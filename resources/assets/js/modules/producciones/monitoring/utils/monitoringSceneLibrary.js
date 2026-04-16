/**
 * Monitoring Scene Library
 * Requiere dependencia frontend: `npm i geotiff`
 */
const IMAGE_TYPE_BANDS = {
  'natural-color': ['red', 'green', 'blue'],
  'false-color-vegetation': ['nir', 'red', 'green'],
  'swir-nir-red': ['swir16', 'nir', 'red'],
  'ndvi': ['nir', 'red']
};

const DEFAULT_PREVIEW_SIZE = 512;

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function unwrapDynamoValue(value) {
  if (!isObject(value)) return value;
  if (Object.prototype.hasOwnProperty.call(value, 'S')) return value.S;
  if (Object.prototype.hasOwnProperty.call(value, 'N')) {
    const parsed = Number(value.N);
    return Number.isNaN(parsed) ? value.N : parsed;
  }
  if (Object.prototype.hasOwnProperty.call(value, 'BOOL')) return !!value.BOOL;
  if (Object.prototype.hasOwnProperty.call(value, 'NULL')) return null;
  if (Object.prototype.hasOwnProperty.call(value, 'L')) return (value.L || []).map(unwrapDynamoValue);
  if (Object.prototype.hasOwnProperty.call(value, 'M')) {
    const out = {};
    Object.keys(value.M || {}).forEach((key) => {
      out[key] = unwrapDynamoValue(value.M[key]);
    });
    return out;
  }

  const out = {};
  Object.keys(value).forEach((key) => {
    out[key] = unwrapDynamoValue(value[key]);
  });
  return out;
}

function normalizeMonitoringRecord(record) {
  return unwrapDynamoValue(record || {});
}

function resolveDateFromDetail(detail) {
  const item = normalizeMonitoringRecord(detail);
  return item.fecha || item.scene_created || item.date || null;
}

export function buildTimelineItems(details) {
  return (details || [])
    .map((detail) => {
      const normalized = normalizeMonitoringRecord(detail);
      const status = resolveSceneStatus(normalized);
      return {
        date: resolveDateFromDetail(normalized),
        status,
        detail: normalized,
        hasData: !!normalized && Object.keys(normalized).length > 0
      };
    })
    .filter((item) => !!item.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

export function createMonitoringNavigator(details, selectedDate) {
  const timeline = buildTimelineItems(details);
  const availableDates = timeline.map((item) => item.date);
  let currentDate = selectedDate && availableDates.includes(selectedDate)
    ? selectedDate
    : (availableDates[0] || null);

  function currentIndex() {
    return Math.max(0, availableDates.indexOf(currentDate));
  }

  return {
    get timeline() {
      return timeline;
    },
    get availableDates() {
      return availableDates;
    },
    get currentDate() {
      return currentDate;
    },
    setDate(date) {
      if (availableDates.includes(date)) {
        currentDate = date;
      }
      return currentDate;
    },
    current() {
      return timeline.find((item) => item.date === currentDate) || null;
    },
    next() {
      const idx = currentIndex();
      if (idx < availableDates.length - 1) {
        currentDate = availableDates[idx + 1];
      }
      return this.current();
    },
    previous() {
      const idx = currentIndex();
      if (idx > 0) {
        currentDate = availableDates[idx - 1];
      }
      return this.current();
    }
  };
}

function hasPreviewAssets(detail) {
  return !!(detail.preview_image || detail.preview_png || detail.preview_svg || detail.preview_json);
}

function hasBands(detail) {
  const urls = bandUrlsFromRecord(detail);
  return !!(urls.blue || urls.green || urls.red || urls.nir || urls.swir16);
}

export function resolveSceneStatus(detailInput) {
  const detail = normalizeMonitoringRecord(detailInput);
  if (!detail || Object.keys(detail).length === 0) {
    return 'no-detail';
  }
  if (detail.renderizado === true || hasPreviewAssets(detail)) {
    return 'ready';
  }
  if (detail.procesado === false && hasBands(detail)) {
    return 'needs-generation';
  }
  if (detail.procesado === true && !hasPreviewAssets(detail)) {
    return 'processing';
  }
  return 'unknown';
}

export function bandUrlsFromRecord(detailInput) {
  const detail = normalizeMonitoringRecord(detailInput);
  return {
    blue: detail.band_blue || detail.b02 || null,
    green: detail.band_green || detail.b03 || null,
    red: detail.band_red || detail.b04 || null,
    nir: detail.band_nir || detail.b08 || null,
    rededge1: detail.band_rededge1 || detail.b05 || null,
    rededge3: detail.band_rededge3 || detail.b07 || null,
    swir16: detail.band_swir16 || detail.b11 || null
  };
}

async function loadGeoTiffModule() {
  const mod = await import('geotiff');
  return mod;
}

async function readBandRaster(url,bbox) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const geotiff = await loadGeoTiffModule();
  const tiff = await geotiff.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const raster = await image.readRasters({ interleave: false,window:bbox });
  return {
    data: raster[0],
    width: image.getWidth(),
    height: image.getHeight()
  };
}

function normalizeBandValue(value, min, max) {
  if (max <= min) return 0;
  const clamped = Math.max(min, Math.min(max, value));
  return Math.round(((clamped - min) / (max - min)) * 255);
}

function computeMinMax(data) {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < data.length; i += 1) {
    const v = data[i];
    if (Number.isFinite(v)) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  return { min, max };
}

async function renderRgbPreview(bands, options = {}) {
  const width = bands[0].width;
  const height = bands[0].height;
  const canvas = document.createElement('canvas');
  canvas.width = options.outputSize || width || DEFAULT_PREVIEW_SIZE;
  canvas.height = options.outputSize || height || DEFAULT_PREVIEW_SIZE;

  const imageData = new ImageData(width, height);
  const [rBand, gBand, bBand] = bands.map((band) => band.data);
  const rStats = computeMinMax(rBand);
  const gStats = computeMinMax(gBand);
  const bStats = computeMinMax(bBand);

  for (let i = 0; i < rBand.length; i += 1) {
    const idx = i * 4;
    imageData.data[idx] = normalizeBandValue(rBand[i], rStats.min, rStats.max);
    imageData.data[idx + 1] = normalizeBandValue(gBand[i], gStats.min, gStats.max);
    imageData.data[idx + 2] = normalizeBandValue(bBand[i], bStats.min, bStats.max);
    imageData.data[idx + 3] = 255;
  }

  const ctx = canvas.getContext('2d');
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  tempCanvas.getContext('2d').putImageData(imageData, 0, 0);
  ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width: canvas.width,
        height: canvas.height
      });
    }, 'image/png');
  });
}

export async function createNaturalColorPreview(urlMap, options = {}) {
  const red = await readBandRaster(urlMap.red);
  const green = await readBandRaster(urlMap.green);
  const blue = await readBandRaster(urlMap.blue);
  return renderRgbPreview([red, green, blue], options);
}

export async function createFalseColorVegetationPreview(urlMap, options = {}) {
  const nir = await readBandRaster(urlMap.nir);
  const red = await readBandRaster(urlMap.red);
  const green = await readBandRaster(urlMap.green);
  return renderRgbPreview([nir, red, green], options);
}

export async function createSwirNirRedPreview(urlMap, options = {}) {
  const swir = await readBandRaster(urlMap.swir16);
  const nir = await readBandRaster(urlMap.nir);
  const red = await readBandRaster(urlMap.red);
  return renderRgbPreview([swir, nir, red], options);
}

export async function createNdviPreview(urlMap, options = {}) {
  const nirBand = await readBandRaster(urlMap.nir);
  const redBand = await readBandRaster(urlMap.red);
  const width = nirBand.width;
  const height = nirBand.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const imageData = new ImageData(width, height);

  for (let i = 0; i < nirBand.data.length; i += 1) {
    const nir = nirBand.data[i];
    const red = redBand.data[i];
    const ndvi = (nir - red) / ((nir + red) || 1);
    const idx = i * 4;
    const green = Math.max(0, Math.min(255, Math.round((ndvi + 1) * 127.5)));
    imageData.data[idx] = 255 - green;
    imageData.data[idx + 1] = green;
    imageData.data[idx + 2] = 32;
    imageData.data[idx + 3] = 255;
  }

  canvas.getContext('2d').putImageData(imageData, 0, 0);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width,
        height
      });
    }, 'image/png');
  });
}

export function createNdviSvg(detailInput) {
  const detail = normalizeMonitoringRecord(detailInput);
  const title = detail.clave || 'NDVI';
  const date = detail.fecha || detail.scene_created || '';
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 160">',
    '<defs><linearGradient id="ndviGrad" x1="0" y1="0" x2="1" y2="0">',
    '<stop offset="0%" stop-color="#d32f2f"/>',
    '<stop offset="50%" stop-color="#fbc02d"/>',
    '<stop offset="100%" stop-color="#2e7d32"/>',
    '</linearGradient></defs>',
    '<rect x="0" y="0" width="640" height="160" fill="#fafafa"/>',
    '<text x="24" y="36" fill="#263238" font-size="24">NDVI temático</text>',
    `<text x="24" y="64" fill="#455a64" font-size="16">${title} ${date}</text>`,
    '<rect x="24" y="86" width="592" height="28" fill="url(#ndviGrad)" rx="8"/>',
    '<text x="24" y="132" fill="#616161" font-size="13">Bajo vigor</text>',
    '<text x="534" y="132" fill="#616161" font-size="13">Alto vigor</text>',
    '</svg>'
  ].join('');
}

export async function generateSceneVisuals(detailInput, options = {}) {
  const detail = normalizeMonitoringRecord(detailInput);
  const urls = bandUrlsFromRecord(detail);
  const visuals = {
    status: resolveSceneStatus(detail),
    naturalColor: null,
    falseColorVegetation: null,
    swirNirRed: null,
    ndvi: null,
    ndviSvg: createNdviSvg(detail),
    bbox: detail.bbox || null,
    imageBounds: bboxToLeafletBounds(detail.bbox)
  };

  if (!(urls.red && urls.green && urls.blue && urls.nir)) {
    return visuals;
  }

  visuals.naturalColor = await createNaturalColorPreview(urls, options);
  visuals.falseColorVegetation = await createFalseColorVegetationPreview(urls, options);

  if (urls.swir16) {
    visuals.swirNirRed = await createSwirNirRedPreview(urls, options);
  }

  visuals.ndvi = await createNdviPreview(urls, options);
  return visuals;
}

export function bboxToLeafletBounds(bboxInput) {
  const bbox = unwrapDynamoValue(bboxInput);
  if (!Array.isArray(bbox) || bbox.length < 4) {
    return null;
  }

  const minLon = Number(bbox[0]);
  const minLat = Number(bbox[1]);
  const maxLon = Number(bbox[2]);
  const maxLat = Number(bbox[3]);

  if ([minLon, minLat, maxLon, maxLat].some(Number.isNaN)) {
    return null;
  }

  return [[minLat, minLon], [maxLat, maxLon]];
}

export function polygonToLeafletLatLngs(polygonInput) {
  const polygon = unwrapDynamoValue(polygonInput);

  if (typeof polygon === 'string') {
    return polygon
      .split('|')
      .map((pair) => pair.trim())
      .filter(Boolean)
      .map((pair) => {
        const [lat, lng] = pair.split(',').map((n) => Number(String(n).trim()));
        return { lat, lng };
      })
      .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));
  }

  if (isObject(polygon) && polygon.type === 'Polygon' && Array.isArray(polygon.coordinates)) {
    return (polygon.coordinates[0] || []).map((point) => ({ lat: Number(point[1]), lng: Number(point[0]) }));
  }

  if (Array.isArray(polygon)) {
    return polygon
      .map((point) => {
        if (!Array.isArray(point) || point.length < 2) return null;
        return { lat: Number(point[0]), lng: Number(point[1]) };
      })
      .filter((point) => point && Number.isFinite(point.lat) && Number.isFinite(point.lng));
  }

  return [];
}

export function saveBlob(blob, fileName = 'monitoring-preview.png') {
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return fileName;
}

export function mapProductionPolygon(detailOrProduction) {
  const normalized = normalizeMonitoringRecord(detailOrProduction);
  return polygonToLeafletLatLngs(normalized.poligono || normalized.polygon);
}

export function createMonitoringStore(details, selectedDate) {
  const navigator = createMonitoringNavigator(details, selectedDate);

  return {
    navigator,
    get currentDetail() {
      const current = navigator.current();
      return current ? current.detail : null;
    },
    get status() {
      return resolveSceneStatus(this.currentDetail);
    },
    async buildVisuals(options) {
      if (!this.currentDetail) return null;
      return generateSceneVisuals(this.currentDetail, options);
    }
  };
}

export default {
  normalizeMonitoringRecord,
  buildTimelineItems,
  createMonitoringNavigator,
  resolveSceneStatus,
  bandUrlsFromRecord,
  createNaturalColorPreview,
  createFalseColorVegetationPreview,
  createSwirNirRedPreview,
  createNdviPreview,
  generateSceneVisuals,
  bboxToLeafletBounds,
  polygonToLeafletLatLngs,
  createMonitoringStore,
  saveBlob,
  mapProductionPolygon,
  createNdviSvg
};
