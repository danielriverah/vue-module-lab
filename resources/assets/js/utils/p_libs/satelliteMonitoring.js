/**
 * satelliteMonitoring.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Librería reusable para monitoreo satelital con GeoTIFF v2
 * Compatible con Vue (sin dependencias de componentes Vue)
 * Pensada para frontend — sin llamadas a backend
 *
 * Responsabilidades (preparadas para separación futura):
 *   [VISUALIZACIÓN]  bboxToLeafletBounds, polygonToLeafletLatLngs, buildMapOverlay
 *   [GENERACIÓN]     generateMonitoringImage, renderBandsToCanvas, renderNdviToCanvas
 *   [UTILIDADES]     normalizeDynamoScene, getSceneBandUrls, sceneHasPreview, etc.
 *   [GUARDADO]       exportCanvasToBlob, exportCanvasToDataUrl
 *   [NAVEGACIÓN]     buildSceneTimeline
 *
 * Dependencias requeridas:
 *   - geotiff v2  (importable como "geotiff")
 *
 * @version 1.0.0
 * ─────────────────────────────────────────────────────────────────────────────
 */
import proj4 from "proj4";
import { fromUrl } from 'geotiff';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTES Y CONFIGURACIÓN
// ─────────────────────────────────────────────────────────────────────────────

/** Bandas requeridas por cada tipo de imagen */
const IMAGE_TYPE_BANDS = {
  'natural-color':           ['band_red', 'band_green', 'band_blue'],             // B4, B3, B2
  'false-color-vegetation':  ['band_nir', 'band_red', 'band_green'],              // B8, B4, B3
  'swir-nir-red':            ['band_swir16', 'band_nir', 'band_red'],             // B11, B8, B4
  'ndvi':                    ['band_nir', 'band_red'],                            // (B8 - B4) / (B8 + B4)
  'agriculture-rededge':     ['band_rededge2', 'band_rededge1', 'band_red'],      // B6, B5, B4
  'rededge-nir-red':         ['band_rededge2', 'band_nir', 'band_red'],           // B6, B8, B4
  'ndre':                    ['band_nir', 'band_rededge1'],                       // (B8 - B5) / (B8 + B5)
  'ndre2':                   ['band_nir', 'band_rededge2'],                       // (B8 - B6) / (B8 + B6)
  'ndmi':                    ['band_nir', 'band_swir16'],                         // (B8 - B11) / (B8 + B11)
  'evi':                     ['band_nir', 'band_red', 'band_blue'],    // 2.5 * ((NIR-RED)/(NIR+6*RED-7.5*BLUE+1))
};
const SIZE_PIXELES={
  'band_red':10,
  'band_green':10,
  'band_blue':10,
  'band_nir':10,
  'band_swir16':20,
  'band_rededge1':20,
  'band_rededge2':20,
  'band_rededge3':20,
}

/** Tipos de imagen válidos */
const VALID_IMAGE_TYPES = Object.keys(IMAGE_TYPE_BANDS);

/** Resolución por defecto al leer rasters */
const DEFAULT_RASTER_SIZE = { width: 512, height: 512 };

/** Paleta NDVI por defecto: rango [-1, 1] → color RGB */
const DEFAULT_NDVI_PALETTE = [
  { min: -1.0, max: -0.1, color: [139, 90,  43]  }, // suelo desnudo / marrón
  { min: -0.1, max:  0.0, color: [200, 170, 110]  }, // muy escasa / beige
  { min:  0.0, max:  0.2, color: [230, 230, 100]  }, // escasa / amarillo
  { min:  0.2, max:  0.4, color: [140, 200,  60]  }, // moderada / verde claro
  { min:  0.4, max:  0.6, color: [ 60, 170,  40]  }, // buena / verde medio
  { min:  0.6, max:  0.8, color: [ 20, 120,  20]  }, // alta / verde oscuro
  { min:  0.8, max:  1.0, color: [  0,  70,   0]  }, // muy alta / verde intenso
];
const DEFAULT_INDEX_PALETTES = {
  ndvi: [
    { min: -1.0, max: -0.1, color: [139,  90,  43] },
    { min: -0.1, max:  0.0, color: [200, 170, 110] },
    { min:  0.0, max:  0.2, color: [230, 230, 100] },
    { min:  0.2, max:  0.4, color: [140, 200,  60] },
    { min:  0.4, max:  0.6, color: [ 60, 170,  40] },
    { min:  0.6, max:  0.8, color: [ 20, 120,  20] },
    { min:  0.8, max:  1.0, color: [  0,  70,   0] },
  ],

  ndre: [
    { min: -1.0, max:  0.0, color: [165,  42,  42] },
    { min:  0.0, max:  0.2, color: [220, 190, 120] },
    { min:  0.2, max:  0.4, color: [180, 220,  80] },
    { min:  0.4, max:  0.6, color: [ 90, 180,  50] },
    { min:  0.6, max:  1.0, color: [  0, 100,   0] },
  ],

  ndre2: [
    { min: -1.0, max:  0.0, color: [165,  42,  42] },
    { min:  0.0, max:  0.2, color: [220, 190, 120] },
    { min:  0.2, max:  0.4, color: [180, 220,  80] },
    { min:  0.4, max:  0.6, color: [ 90, 180,  50] },
    { min:  0.6, max:  1.0, color: [  0, 100,   0] },
  ],

  ndmi: [
    { min: -1.0, max: -0.2, color: [150,  90,  60] },
    { min: -0.2, max:  0.0, color: [220, 180, 120] },
    { min:  0.0, max:  0.2, color: [240, 230, 140] },
    { min:  0.2, max:  0.4, color: [120, 200, 120] },
    { min:  0.4, max:  1.0, color: [ 20, 120,  60] },
  ],

  evi: [
    { min: -1.0, max:  0.0, color: [165,  42,  42] },
    { min:  0.0, max:  0.2, color: [230, 220, 120] },
    { min:  0.2, max:  0.4, color: [160, 210,  80] },
    { min:  0.4, max:  0.6, color: [ 70, 170,  50] },
    { min:  0.6, max:  1.0, color: [  0, 100,   0] },
  ],
};

/** Prefijos de URIs que NO son URLs HTTP descargables directamente */
const NON_HTTP_PROTOCOLS = ['s3://', 'gs://', 'azure://', 'abfs://'];

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 1 — NORMALIZACIÓN DYNAMO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convierte un valor DynamoDB-like al valor JS correspondiente.
 * Maneja: S, N, BOOL, NULL, L, M
 * @param {*} val - Valor con formato DynamoDB
 * @returns {*} Valor JS nativo
 */
function parseDynamoValue(val) {
  if (val === null || val === undefined) return null;
  if (typeof val !== 'object') return val;

  if ('S'    in val) return String(val.S);
  if ('N'    in val) return Number(val.N);
  if ('BOOL' in val) return Boolean(val.BOOL);
  if ('NULL' in val) return null;

  if ('L' in val) {
    if (!Array.isArray(val.L)) return [];
    return val.L.map(parseDynamoValue);
  }

  if ('M' in val) {
    if (typeof val.M !== 'object' || Array.isArray(val.M)) return {};
    return normalizeDynamoScene(val.M);
  }

  // Sin tipo conocido: devolver tal cual
  return val;
}

/**
 * Normaliza un registro DynamoDB-like a un objeto JS plano.
 * Convierte .S, .N, .BOOL, .L, .M a valores reales.
 *
 * @param {Object} record - Registro con estructura DynamoDB
 * @returns {Object} Objeto JS plano y limpio
 * @throws {Error} Si el registro no es un objeto válido
 *
 * @example
 * const scene = normalizeDynamoScene(rawDynamoRecord);
 * // scene.id     === "PROD#1978"
 * // scene.bbox   === [-102.10, 21.56, -101.01, 22.58]
 */
export function normalizeDynamoScene(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    throw new Error(
      '[normalizeDynamoScene] El registro debe ser un objeto no nulo. ' +
      `Recibido: ${typeof record}`
    );
  }

  const result = {};

  for (const [key, val] of Object.entries(record)) {
    try {
      result[key] = parseDynamoValue(val);
    } catch (e) {
      console.warn(`[normalizeDynamoScene] No se pudo parsear el campo "${key}":`, e.message);
      result[key] = null;
    }
  }

  // Post-proceso bbox: lista plana de números
  if (Array.isArray(result.bbox)) {
    result.bbox = result.bbox.map(Number).filter(n => !isNaN(n));
  }

  // Post-proceso polygon: [[lat, lon], ...]
  if (Array.isArray(result.polygon)) {
    result.polygon = result.polygon
      .filter(p => Array.isArray(p) && p.length >= 2)
      .map(p => [Number(p[0]), Number(p[1])]);
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 2 — HELPERS DE ESCENA
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extrae las URLs de bandas disponibles de una escena normalizada.
 * Solo retorna bandas con string no vacía.
 *
 * @param {Object} scene - Escena normalizada
 * @returns {Object} Mapa { band_red: "https://...", band_nir: "https://...", ... }
 * @throws {Error} Si scene no es un objeto válido
 */
export function getSceneBandUrls(scene) {
  if (!scene || typeof scene !== 'object') {
    throw new Error('[getSceneBandUrls] Se requiere una escena normalizada válida.');
  }

  const bandKeys = [
    'band_blue', 'band_green', 'band_red',
    'band_nir',  'band_rededge1','band_rededge2', 'band_rededge3',
    'band_swir16',
  ];

  const result = {};
  for (const key of bandKeys) {
    const url = scene[key];
    if (typeof url === 'string' && url.trim().length > 0) {
      result[key] = url.trim();
    }
  }
  return result;
}

/**
 * Verifica si la escena tiene al menos un preview con URL HTTP accesible.
 *
 * @param {Object} scene - Escena normalizada
 * @returns {boolean}
 */
export function sceneHasPreview(scene) {
  if (!scene || typeof scene !== 'object') return false;

  const fields = ['preview_image', 'preview_svg'];
  for (const field of fields) {
    const val = scene[field];
    if (typeof val === 'string' && val.trim().length > 0) {
      const isNonHttp = NON_HTTP_PROTOCOLS.some(p => val.startsWith(p));
      if (!isNonHttp) return true;
    }
  }
  return false;
}

/**
 * Devuelve información sobre previews disponibles en la escena.
 * Distingue entre URLs HTTP (usables) y URIs de almacenamiento (solo referencia).
 *
 * @param {Object} scene - Escena normalizada
 * @returns {{
 *   image: string|null,
 *   json: string|null,
 *   svg: string|null,
 *   isHttp: boolean,
 *   imageIsHttp: boolean,
 *   jsonIsHttp: boolean,
 *   svgIsHttp: boolean
 * }}
 */
export function getScenePreviewInfo(scene) {
  if (!scene || typeof scene !== 'object') {
    return { image: null, json: null, svg: null, isHttp: false,
             imageIsHttp: false, jsonIsHttp: false, svgIsHttp: false };
  }

  const parsePreview = (val) => {
    if (typeof val !== 'string' || val.trim().length === 0) return { url: null, isHttp: false };
    const isNonHttp = NON_HTTP_PROTOCOLS.some(p => val.startsWith(p));
    return { url: val.trim(), isHttp: !isNonHttp };
  };

  const img  = parsePreview(scene.preview_image);
  const json = parsePreview(scene.preview_json);
  const svg  = parsePreview(scene.preview_svg);

  return {
    image:       img.url,
    svg:         svg.url,
    isHttp:      img.isHttp || json.isHttp || svg.isHttp,
    imageIsHttp: img.isHttp,
    svgIsHttp:   svg.isHttp,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 3 — UTILIDADES DE MAPA (VISUALIZACIÓN)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convierte el bbox a bounds de Leaflet: [[minLat, minLon], [maxLat, maxLon]]
 * El bbox usa formato GeoJSON/STAC: [minLon, minLat, maxLon, maxLat].
 *
 * @param {number[]} bbox - Array [minLon, minLat, maxLon, maxLat]
 * @returns {[[number,number],[number,number]]} Bounds para L.imageOverlay
 * @throws {Error} Si bbox es inválido o incompleto
 */
export function bboxToLeafletBounds(bbox) {
  if (!Array.isArray(bbox) || bbox.length < 4) {
    throw new Error(
      `[bboxToLeafletBounds] bbox inválido. Se esperan 4 valores [minLon, minLat, maxLon, maxLat]. ` +
      `Recibido: ${JSON.stringify(bbox)}`
    );
  }

  const [minLon, minLat, maxLon, maxLat] = bbox.map(Number);

  if ([minLon, minLat, maxLon, maxLat].some(isNaN)) {
    throw new Error(
      `[bboxToLeafletBounds] bbox contiene valores no numéricos: ${JSON.stringify(bbox)}`
    );
  }

  if (minLat >= maxLat) {
    throw new Error(
      `[bboxToLeafletBounds] minLat (${minLat}) debe ser menor que maxLat (${maxLat}).`
    );
  }
  if (minLon >= maxLon) {
    throw new Error(
      `[bboxToLeafletBounds] minLon (${minLon}) debe ser menor que maxLon (${maxLon}).`
    );
  }

  return [[minLat, minLon], [maxLat, maxLon]];
}

/**
 * Convierte el polygon de la escena a LatLngs de Leaflet.
 * Espera [[lat, lon], ...] (ya normalizado).
 *
 * @param {Array} polygon - Lista [[lat, lon], ...]
 * @returns {[number,number][]} Array de [lat, lon] para L.polygon
 * @throws {Error} Si polygon es inválido o tiene menos de 3 puntos
 */
export function polygonToLeafletLatLngs(polygon) {
  if (!Array.isArray(polygon) || polygon.length < 3) {
    throw new Error(
      `[polygonToLeafletLatLngs] polygon inválido. Se necesitan al menos 3 puntos. ` +
      `Recibido: ${JSON.stringify(polygon)}`
    );
  }

  return polygon.map((pt, i) => {
    if (!Array.isArray(pt) || pt.length < 2) {
      throw new Error(
        `[polygonToLeafletLatLngs] Punto inválido en índice ${i}: ${JSON.stringify(pt)}`
      );
    }
    const lat = Number(pt[0]);
    const lon = Number(pt[1]);
    if (isNaN(lat) || isNaN(lon)) {
      throw new Error(
        `[polygonToLeafletLatLngs] Coordenada no numérica en índice ${i}: ` +
        `lat=${pt[0]}, lon=${pt[1]}`
      );
    }
    return [lat, lon];
  });
}

/**
 * Construye imageBounds y polygonLatLngs de Leaflet a partir de una escena.
 *
 * @param {Object} scene - Escena normalizada
 * @returns {{ imageBounds: [[number,number],[number,number]], polygonLatLngs: [number,number][] }}
 * @throws {Error} Con todos los errores encontrados (bbox y/o polygon)
 */
export function buildMapOverlay(scene) {
  const errors = [];
  let imageBounds    = null;
  let polygonLatLngs = null;

  try {
    imageBounds = bboxToLeafletBounds(scene.bbox);
  } catch (e) {
    errors.push(e.message);
  }

  try {
    polygonLatLngs = polygonToLeafletLatLngs(scene.polygon);
  } catch (e) {
    errors.push(e.message);
  }

  if (errors.length > 0) {
    throw new Error(
      `[buildMapOverlay] Errores construyendo overlays:\n  - ${errors.join('\n  - ')}`
    );
  }

  return { imageBounds, polygonLatLngs };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 4 — EXPORTACIÓN DE CANVAS (GUARDADO)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Exporta un canvas a Blob de forma asíncrona.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {string}  [mimeType='image/png']
 * @param {number}  [quality=0.92] - Calidad para JPEG (0-1)
 * @returns {Promise<Blob>}
 * @throws {Error} Si canvas no es válido o el blob no puede generarse
 */
export function exportCanvasToBlob(canvas, mimeType = 'image/png', quality = 0.92) {
  if (!canvas || typeof canvas.toBlob !== 'function') {
    return Promise.reject(
      new Error('[exportCanvasToBlob] Se requiere un HTMLCanvasElement válido.')
    );
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('[exportCanvasToBlob] El canvas retornó un blob nulo.'));
        } else {
          resolve(blob);
        }
      },
      mimeType,
      quality
    );
  });
}

/**
 * Exporta un canvas a Data URL (base64).
 *
 * @param {HTMLCanvasElement} canvas
 * @param {string} [mimeType='image/png']
 * @param {number} [quality=0.92]
 * @returns {string} Data URL
 * @throws {Error} Si canvas no es válido
 */
export function exportCanvasToDataUrl(canvas, mimeType = 'image/png', quality = 0.92) {
  if (!canvas || typeof canvas.toDataURL !== 'function') {
    throw new Error('[exportCanvasToDataUrl] Se requiere un HTMLCanvasElement válido.');
  }
  return canvas.toDataURL(mimeType, quality);
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 5 — LECTURA DE BANDAS CON GEOTIFF v2 (GENERACIÓN)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Verifica si una URL es HTTP/HTTPS.
 * @param {string} url
 * @returns {boolean}
 */
function isHttpUrl(url) {
  return typeof url === 'string' &&
    (url.startsWith('http://') || url.startsWith('https://'));
}

/**
 * Lee un raster de un GeoTIFF remoto usando geotiff v2.
 *
 * @param {string} url          - URL HTTP del archivo .tif
 * @param {number} targetWidth  - Ancho de salida deseado
 * @param {number} targetHeight - Alto de salida deseado
 * @param {Object} [options={}] - Opciones extra (resampleMethod, pool)
 * @returns {Promise<{ data: TypedArray, width: number, height: number }>}
 * @throws {Error} Con mensajes descriptivos en cada etapa de fallo
 */
async function readBandRaster(url, targetWidth = 512, targetHeight = 512, options = {},tPix=null) {
  let centro=options.centro
  if (!isHttpUrl(url)) {
    throw new Error(
      `[readBandRaster] La URL no es accesible vía HTTP: "${url}". ` +
      `Las URIs S3/GS deben convertirse a URLs firmadas antes de usar esta función.`
    );
  }

  let tiff;
  try {
    tiff = await fromUrl(url, { allowFullFile: true });
    //console.log(tiff)
  } catch (e) {
    throw new Error(
      `[readBandRaster] No se pudo abrir el GeoTIFF desde: "${url}". ` +
      `Posibles causas: CORS bloqueado, URL expirada, archivo inexistente. ` +
      `Detalle: ${e.message}`
    );
  }

  let image;
  try {
    image = await tiff.getImage();
    //console.log(image)
  } catch (e) {
    throw new Error(
      `[readBandRaster] No se pudo obtener la imagen del GeoTIFF: "${url}". ` +
      `Detalle: ${e.message}`
    );
  }

  const origWidth  = image.getWidth();
  const origHeight = image.getHeight();

  if (!origWidth || !origHeight || origWidth <= 0 || origHeight <= 0) {
    throw new Error(
      `[readBandRaster] Dimensiones inválidas en GeoTIFF "${url}": ` +
      `${origWidth}x${origHeight}`
    );
  }
  const [minX, minY, maxX, maxY] = image.getBoundingBox();
  const lon = centro.lon;
  const lat = centro.lat;
  //const [xProjected, yProjected] = proj4("EPSG:4326", "EPSG:XXXX", [lon, lat]);
  //console.log("bbox:", [minX, minY, maxX, maxY]);
  //console.log("geoKeys:", image.getGeoKeys());

  const [xProjected, yProjected] = proj4("EPSG:4326", "EPSG:32614", [lon, lat]);
  //21.124525, -100.888874
  //console.log("projected:", { xProjected, yProjected });
  // convertir lon/lat -> pixel
  const inside =
    xProjected >= minX && xProjected <= maxX &&
    yProjected >= minY && yProjected <= maxY;

  if (!inside) {
    throw new Error("La coordenada reproyectada está fuera del bbox del TIFF");
  }
  const pixelX = Math.floor(((xProjected - minX) / (maxX - minX)) * origWidth);
  const pixelY = Math.floor(((maxY - yProjected) / (maxY - minY)) * origHeight);
  const halfSideMeters = 1000;
  const metersPerPixel = tPix??10;
  const halfSidePx = Math.round(halfSideMeters / metersPerPixel);
  const left = Math.max(0, pixelX - halfSidePx);
  const top = Math.max(0, pixelY - halfSidePx);
  const right = Math.min(origWidth, pixelX + halfSidePx);
  const bottom = Math.min(origHeight, pixelY + halfSidePx);



  //console.log("pixel:", { pixelX, pixelY });
  //console.log("window:", [left, top, right, bottom]);
  const readOptions = {
    // window: [ origWidth/2, origHeight/2, 512, 512],//[left,top,right,buttom]
    window: [left, top, right, bottom],
    width:  targetWidth,
    height: targetHeight,
    resampleMethod: "bilinear",
  };
  

  if (options.resampleMethod) readOptions.resampleMethod = options.resampleMethod;
  if (options.pool)           readOptions.pool           = options.pool;

  let rasters;
  try {
    rasters = await image.readRasters(readOptions);
    //console.log(rasters)
  } catch (e) {
    throw new Error(
      `[readBandRaster] Error leyendo rasters de: "${url}". ` +
      `Detalle: ${e.message}`
    );
  }

  if (!rasters || !rasters[0]) {
    throw new Error(
      `[readBandRaster] El raster leído de "${url}" está vacío o es nulo.`
    );
  }
  const pixelSizeX = (maxX - minX) / origWidth;
  const pixelSizeY = (maxY - minY) / origHeight;
  const cropMinX = minX + left * pixelSizeX;
  const cropMaxX = minX + right * pixelSizeX;
  const cropMaxY = maxY - top * pixelSizeY;
  const cropMinY = maxY - bottom * pixelSizeY;
  const [west, south] = proj4("EPSG:32614", "EPSG:4326", [cropMinX, cropMinY]);
  const [east, north] = proj4("EPSG:32614", "EPSG:4326", [cropMaxX, cropMaxY]);
  //console.log(west, south, east, north)
  return {
    data:   rasters[0],
    width:  rasters.width,
    height: rasters.height,
    bboxProjected: [cropMinX, cropMinY, cropMaxX, cropMaxY],
    rasterCrs: "EPSG:32614",
    bboxLatLng: [west, south, east, north],
    boundsLeaflet: [
      [south, west],
      [north, east]
    ],
    center: { lon, lat }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 6 — RENDER DE CANVAS (GENERACIÓN)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normaliza un array de valores a Uint8ClampedArray [0-255]
 * usando percentiles para evitar que outliers colapsen el contraste.
 *
 * @param {TypedArray} data
 * @param {number} [low=2]   - Percentil inferior (%)
 * @param {number} [high=98] - Percentil superior (%)
 * @returns {Uint8ClampedArray}
 */
function normalizeToUint8(data, low = 2, high = 98) {
  if (!data || data.length === 0) {
    throw new Error('[normalizeToUint8] El array de datos está vacío o es nulo.');
  }

  // Ordenar una copia para calcular percentiles
  const sorted = Array.from(data).sort((a, b) => a - b);
  const len = sorted.length;

  const lowIdx  = Math.max(0, Math.floor((low  / 100) * len));
  const highIdx = Math.min(len - 1, Math.floor((high / 100) * len));

  const minVal = sorted[lowIdx]  ?? 0;
  const maxVal = sorted[highIdx] ?? 1;
  const range  = maxVal - minVal || 1;

  const result = new Uint8ClampedArray(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = Math.round(((data[i] - minVal) / range) * 255);
  }
  return result;
}

/**
 * Renderiza tres bandas (R, G, B) a un HTMLCanvasElement.
 *
 * @param {{ r: BandData, g: BandData, b: BandData }} bands
 * @param {Object} [options={}]
 * @returns {HTMLCanvasElement}
 */
function renderRGBtoCanvas(bands, options = {}) {
  const { r, g, b } = bands;

  if (!r || !g || !b) {
    throw new Error('[renderRGBtoCanvas] Se requieren las tres bandas r, g, b.');
  }

  if (r.width !== g.width || r.width !== b.width ||
      r.height !== g.height || r.height !== b.height) {
    throw new Error(
      `[renderRGBtoCanvas] Dimensiones inconsistentes entre bandas: ` +
      `R=${r.width}x${r.height}, G=${g.width}x${g.height}, B=${b.width}x${b.height}`
    );
  }

  const width  = r.width;
  const height = r.height;

  const rNorm = normalizeToUint8(r.data, options.lowPercentile, options.highPercentile);
  const gNorm = normalizeToUint8(g.data, options.lowPercentile, options.highPercentile);
  const bNorm = normalizeToUint8(b.data, options.lowPercentile, options.highPercentile);

  const canvas = document.createElement('canvas');
  canvas.width  = width;
  canvas.height = height;

  const ctx       = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const px        = imageData.data;
  const pixels    = width * height;

  for (let i = 0; i < pixels; i++) {
    px[i * 4 + 0] = rNorm[i];
    px[i * 4 + 1] = gNorm[i];
    px[i * 4 + 2] = bNorm[i];
    px[i * 4 + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * Obtiene el color RGB de la paleta NDVI para un valor dado.
 * Si el valor está fuera de todos los rangos, usa el último color.
 *
 * @param {number} ndvi  - Valor NDVI entre -1 y 1
 * @param {Array}  palette
 * @returns {[number, number, number]}
 */
function getNdviColor(ndvi, palette) {
  for (const entry of palette) {
    if (ndvi >= entry.min && ndvi <= entry.max) {
      return entry.color;
    }
  }
  return palette[palette.length - 1].color;
}
function renderTwoBandIndexToCanvas(bandA, bandB, calculator, options = {}) {
  if (!bandA || !bandB) {
    throw new Error('[renderTwoBandIndexToCanvas] Se requieren ambas bandas.');
  }

  if (bandA.width !== bandB.width || bandA.height !== bandB.height) {
    throw new Error(
      `[renderTwoBandIndexToCanvas] Dimensiones distintas: ` +
      `A=${bandA.width}x${bandA.height}, B=${bandB.width}x${bandB.height}`
    );
  }

  const width = bandA.width;
  const height = bandA.height;
  const pixels = width * height;
  const palette = options.palette || DEFAULT_INDEX_PALETTES[options.indexName];

  if (options.palette && !validateNdviPalette(options.palette)) {
    throw new Error(
      `[render${options.indexName?.toUpperCase() || 'Index'}ToCanvas] La paleta proporcionada tiene formato inválido. ` +
      `Cada entrada debe tener: { min: number, max: number, color: [r, g, b] }`
    );
  }

  const nodata = options.nodataValue ?? 0;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const px = imageData.data;

  for (let i = 0; i < pixels; i++) {
    const a = bandA.data[i];
    const b = bandB.data[i];
    const base = i * 4;

    if (a === nodata && b === nodata) {
      px[base + 3] = 0;
      continue;
    }

    const value = calculator(a, b);
    const [r, g, bColor] = getNdviColor(value, palette);

    px[base + 0] = r;
    px[base + 1] = g;
    px[base + 2] = bColor;
    px[base + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
/**
 * Renderiza un índice NDVI a canvas con paleta de colores configurable.
 * Los píxeles nodata se vuelven transparentes.
 *
 * @param {Object} nirBand - { data, width, height }
 * @param {Object} redBand - { data, width, height }
 * @param {Object} [options={}]
 * @param {Array}  [options.palette]      - Paleta personalizada
 * @param {number} [options.nodataValue]  - Valor de nodata (alpha=0)
 * @returns {HTMLCanvasElement}
 */
function renderNdviToCanvas(nirBand, redBand, options = {}) {
  if (!nirBand || !redBand) {
    throw new Error('[renderNdviToCanvas] Se requieren las bandas NIR y RED.');
  }

  if (nirBand.width !== redBand.width || nirBand.height !== redBand.height) {
    throw new Error(
      `[renderNdviToCanvas] Dimensiones distintas entre NIR y RED: ` +
      `NIR=${nirBand.width}x${nirBand.height}, RED=${redBand.width}x${redBand.height}`
    );
  }

  const width   = nirBand.width;
  const height  = nirBand.height;
  const pixels  = width * height;
  const palette = options.palette || DEFAULT_INDEX_PALETTES['ndvi'];

  // Validar paleta si fue proporcionada
  if (options.palette && !validateNdviPalette(options.palette)) {
    throw new Error(
      '[renderNdviToCanvas] La paleta NDVI proporcionada tiene formato inválido. ' +
      'Cada entrada debe tener: { min: number, max: number, color: [r, g, b] }'
    );
  }

  const nodata = options.nodataValue ?? 0;

  const canvas = document.createElement('canvas');
  canvas.width  = width;
  canvas.height = height;

  const ctx       = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const px        = imageData.data;

  for (let i = 0; i < pixels; i++) {
    const nir  = nirBand.data[i];
    const red  = redBand.data[i];
    const base = i * 4;

    if (nir === nodata && red === nodata) {
      // Píxel transparente para nodata
      px[base + 3] = 0;
      continue;
    }

    const denom = nir + red;
    const ndvi  = denom === 0 ? 0 : (nir - red) / denom;
    const [r, g, b] = getNdviColor(ndvi, palette);

    px[base + 0] = r;
    px[base + 1] = g;
    px[base + 2] = b;
    px[base + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
function renderNdreToCanvas(nirBand, redEdge1Band, options = {}) {
  return renderTwoBandIndexToCanvas(
    nirBand,
    redEdge1Band,
    (nir, re1) => {
      const denom = nir + re1;
      return denom === 0 ? 0 : (nir - re1) / denom;
    },
    {
      ...options,
      indexName: 'ndre',
    }
  );
}
function renderNdre2ToCanvas(nirBand, redEdge2Band, options = {}) {
  return renderTwoBandIndexToCanvas(
    nirBand,
    redEdge2Band,
    (nir, re2) => {
      const denom = nir + re2;
      return denom === 0 ? 0 : (nir - re2) / denom;
    },
    {
      ...options,
      indexName: 'ndre2',
    }
  );
}
function renderNdmiToCanvas(nirBand, swirBand, options = {}) {
  return renderTwoBandIndexToCanvas(
    nirBand,
    swirBand,
    (nir, swir) => {
      const denom = nir + swir;
      return denom === 0 ? 0 : (nir - swir) / denom;
    },
    {
      ...options,
      indexName: 'ndmi',
    }
  );
}
function renderEviToCanvas(nirBand, redBand, blueBand, options = {}) {
  if (!nirBand || !redBand || !blueBand) {
    throw new Error('[renderEviToCanvas] Se requieren las bandas NIR, RED y BLUE.');
  }

  if (
    nirBand.width !== redBand.width || nirBand.height !== redBand.height ||
    nirBand.width !== blueBand.width || nirBand.height !== blueBand.height
  ) {
    throw new Error(
      `[renderEviToCanvas] Dimensiones distintas entre bandas: ` +
      `NIR=${nirBand.width}x${nirBand.height}, ` +
      `RED=${redBand.width}x${redBand.height}, ` +
      `BLUE=${blueBand.width}x${blueBand.height}`
    );
  }

  const width = nirBand.width;
  const height = nirBand.height;
  const pixels = width * height;
  const palette = options.palette || DEFAULT_INDEX_PALETTES['evi'];

  if (options.palette && !validateNdviPalette(options.palette)) {
    throw new Error(
      '[renderEviToCanvas] La paleta proporcionada tiene formato inválido. ' +
      'Cada entrada debe tener: { min: number, max: number, color: [r, g, b] }'
    );
  }

  const nodata = options.nodataValue ?? 0;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(width, height);
  const px = imageData.data;

  for (let i = 0; i < pixels; i++) {
    const nir = nirBand.data[i];
    const red = redBand.data[i];
    const blue = blueBand.data[i];
    const base = i * 4;

    if (nir === nodata && red === nodata && blue === nodata) {
      px[base + 3] = 0;
      continue;
    }

    const denom = nir + (6 * red) - (7.5 * blue) + 1;
    const evi = denom === 0 ? 0 : 2.5 * ((nir - red) / denom);

    const [r, g, b] = getNdviColor(evi, palette);

    px[base + 0] = r;
    px[base + 1] = g;
    px[base + 2] = b;
    px[base + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 7 — VALIDACIÓN DE BANDAS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valida que las bandas requeridas para el imageType estén disponibles y sean HTTP.
 *
 * @param {Object} bandUrls  - Mapa de bandas disponibles
 * @param {string} imageType - Tipo de imagen solicitado
 * @param {Object} scene     - Para mensajes de error contextuales
 * @throws {Error} Si falta alguna banda o no es HTTP
 */
function validateBandsForType(bandUrls, imageType, scene) {
  const required = IMAGE_TYPE_BANDS[imageType];

  // imageType ya fue validado antes de llamar esto, pero doble check
  if (!required) {
    throw new Error(
      `[validateBandsForType] Tipo de imagen desconocido: "${imageType}".`
    );
  }

  const missing      = [];
  const notHttp      = [];

  for (const band of required) {
    if (!bandUrls[band]) {
      missing.push(band);
    } else if (!isHttpUrl(bandUrls[band])) {
      notHttp.push(`${band} → "${bandUrls[band]}"`);
    }
  }

  const sceneId = scene.id || scene.clave || '(sin id)';
  const errors  = [];

  if (missing.length > 0) {
    errors.push(
      `Bandas faltantes en escena "${sceneId}" para "${imageType}": ` +
      `${missing.join(', ')}.`
    );
  }

  if (notHttp.length > 0) {
    errors.push(
      `Bandas con URI no-HTTP (S3/GS sin firmar) en escena "${sceneId}": ` +
      `${notHttp.join('; ')}. Usa URLs presignadas para acceso directo.`
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `[generateMonitoringImage] ${errors.join(' | ')} ` +
      `Bandas disponibles: ${Object.keys(bandUrls).join(', ') || 'ninguna'}.`
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 8 — FUNCIÓN PRINCIPAL DE GENERACIÓN
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detecta si un objeto tiene estructura DynamoDB-like.
 * @param {Object} obj
 * @returns {boolean}
 */
function isDynamoLike(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const firstVal = Object.values(obj)[0];
  if (!firstVal || typeof firstVal !== 'object') return false;
  return (
    'S' in firstVal || 'N' in firstVal || 'BOOL' in firstVal ||
    'L' in firstVal || 'M' in firstVal || 'NULL' in firstVal
  );
}

/**
 * Genera una imagen de monitoreo satelital a partir de un registro de escena.
 * Acepta registros DynamoDB-like o escenas ya normalizadas.
 *
 * @param {Object}  sceneRecord                   - Registro de escena
 * @param {string}  imageType                     - "natural-color" | "false-color-vegetation" | "swir-nir-red" | "ndvi"
 * @param {Object}  [options={}]
 * @param {number}  [options.width=512]            - Ancho del raster
 * @param {number}  [options.height=512]           - Alto del raster
 * @param {string}  [options.resampleMethod]       - Método de resampleo geotiff
 * @param {boolean} [options.includeBlob=false]    - Incluir blob PNG en resultado
 * @param {boolean} [options.includeDataUrl=false] - Incluir dataURL en resultado
 * @param {Array}   [options.palette]              - Paleta personalizada NDVI
 * @param {number}  [options.nodataValue]          - Valor nodata para NDVI
 * @param {number}  [options.lowPercentile=2]      - Percentil bajo para normalización
 * @param {number}  [options.highPercentile=98]    - Percentil alto para normalización
 *
 * @returns {Promise<{
 *   canvas: HTMLCanvasElement,
 *   blob: Blob|null,
 *   dataUrl: string|null,
 *   imageBounds: [[number,number],[number,number]]|null,
 *   polygonLatLngs: [number,number][]|null,
 *   metadata: Object
 * }>}
 */
export async function generateMonitoringImage(sceneRecord, imageType, options = {}) {
  // ── Validaciones de entrada ────────────────────────────────────────────────
  if (!sceneRecord || typeof sceneRecord !== 'object') {
    throw new Error('[generateMonitoringImage] sceneRecord debe ser un objeto no nulo.');
  }

  if (!imageType || typeof imageType !== 'string') {
    throw new Error(
      `[generateMonitoringImage] imageType es requerido y debe ser string. ` +
      `Tipos válidos: ${VALID_IMAGE_TYPES.join(', ')}.`
    );
  }

  if (!VALID_IMAGE_TYPES.includes(imageType)) {
    throw new Error(
      `[generateMonitoringImage] imageType inválido: "${imageType}". ` +
      `Tipos válidos: ${VALID_IMAGE_TYPES.join(', ')}.`
    );
  }

  // ── Normalizar escena ──────────────────────────────────────────────────────
  let scene;
  try {
    scene = isDynamoLike(sceneRecord)
      ? normalizeDynamoScene(sceneRecord)
      : sceneRecord;
  } catch (e) {
    throw new Error(`[generateMonitoringImage] Error normalizando escena: ${e.message}`);
  }

  // ── Obtener y validar URLs de bandas ───────────────────────────────────────
  let bandUrls;
  try {
    bandUrls = getSceneBandUrls(scene);
  } catch (e) {
    throw new Error(`[generateMonitoringImage] Error obteniendo URLs de bandas: ${e.message}`);
  }

  validateBandsForType(bandUrls, imageType, scene);

  // ── Configuración de lectura ───────────────────────────────────────────────
  const rWidth  = (typeof options.width  === 'number' && options.width  > 0) ? options.width  : DEFAULT_RASTER_SIZE.width;
  const rHeight = (typeof options.height === 'number' && options.height > 0) ? options.height : DEFAULT_RASTER_SIZE.height;

  const readOpts = {
    resampleMethod: options.resampleMethod || undefined,
    pool:           options.pool           || undefined,
    centro:         options.centro         || {lat:0,lon:0}
  };
  // ── Lectura de bandas y render ─────────────────────────────────────────────
  let canvas;
  let metaImagen;
  if (imageType === 'ndvi') {
    let nirBand, redBand;
    try {
      [nirBand, redBand] = await Promise.all([
        readBandRaster(bandUrls.band_nir, rWidth, rHeight, readOpts),
        readBandRaster(bandUrls.band_red, rWidth, rHeight, readOpts),
      ]);
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error leyendo bandas para NDVI: ${e.message}`);
    }

    try {
      canvas = renderNdviToCanvas(nirBand, redBand, {
        palette:     options.palette,
        nodataValue: options.nodataValue,
      });
      metaImagen={
          width:nirBand.width,
          height:nirBand.height,
          bboxProjected: nirBand.bboxProjected,
          rasterCrs: nirBand.rasterCrs,
          bboxLatLng: nirBand.bboxLatLng,
          boundsLeaflet:nirBand.boundsLeaflet,
          center:nirBand.center
      }
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error renderizando NDVI: ${e.message}`);
    }

  }else if(imageType==='ndre'){
    let nirBand, rededgeBand;
    try {
      [nirBand, rededgeBand] = await Promise.all([
        readBandRaster(bandUrls.band_nir, rWidth, rHeight, readOpts),
        readBandRaster(bandUrls.band_rededge1, rWidth, rHeight,readOpts,SIZE_PIXELES['band_rededge1']),
      ]);
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error leyendo bandas para NDVI: ${e.message}`);
    }

    try {
      canvas = renderNdreToCanvas(nirBand, rededgeBand, {
        palette:     options.palette,
        nodataValue: options.nodataValue,
      });
      metaImagen={
        width:nirBand.width,
        height:nirBand.height,
        bboxProjected: nirBand.bboxProjected,
        rasterCrs: nirBand.rasterCrs,
        bboxLatLng: nirBand.bboxLatLng,
        boundsLeaflet:nirBand.boundsLeaflet,
        center:nirBand.center
      }
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error renderizando NDVI: ${e.message}`);
    }
  }else if(imageType==='ndre2'){
    let nirBand, rededgeBand;
    try {
      [nirBand, rededgeBand] = await Promise.all([
        readBandRaster(bandUrls.band_nir, rWidth, rHeight, readOpts),
        readBandRaster(bandUrls.band_rededge2, rWidth, rHeight,readOpts,SIZE_PIXELES['band_rededge2']),
      ]);
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error leyendo bandas para NDVI: ${e.message}`);
    }

    try {
      canvas = renderNdre2ToCanvas(nirBand, rededgeBand, {
        palette:     options.palette,
        nodataValue: options.nodataValue,
      });
      metaImagen={
        width:nirBand.width,
        height:nirBand.height,
        bboxProjected: nirBand.bboxProjected,
        rasterCrs: nirBand.rasterCrs,
        bboxLatLng: nirBand.bboxLatLng,
        boundsLeaflet:nirBand.boundsLeaflet,
        center:nirBand.center
      }
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error renderizando NDVI: ${e.message}`);
    }
  }else if(imageType==='ndmi'){
    let nirBand, swirBand;
    try {
      [nirBand, swirBand] = await Promise.all([
        readBandRaster(bandUrls.band_nir, rWidth, rHeight, readOpts),
        readBandRaster(bandUrls.band_swir16, rWidth, rHeight, readOpts,SIZE_PIXELES['band_swir16']),
      ]);
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error leyendo bandas para NDVI: ${e.message}`);
    }

    try {
      canvas = renderNdmiToCanvas(nirBand, swirBand, {
        palette:     options.palette,
        nodataValue: options.nodataValue,
      });
      metaImagen={
        width:nirBand.width,
        height:nirBand.height,
        bboxProjected: nirBand.bboxProjected,
        rasterCrs: nirBand.rasterCrs,
        bboxLatLng: nirBand.bboxLatLng,
        boundsLeaflet:nirBand.boundsLeaflet,
        center:nirBand.center
      }
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error renderizando NDVI: ${e.message}`);
    }
  }else if(imageType==='evi'){
    let nirBand, redBand, blueBand;
    try {
      [nirBand, redBand,blueBand] = await Promise.all([
        readBandRaster(bandUrls.band_nir, rWidth, rHeight, readOpts),
        readBandRaster(bandUrls.band_red, rWidth, rHeight, readOpts),
        readBandRaster(bandUrls.band_blue, rWidth, rHeight, readOpts),
      ]);
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error leyendo bandas para NDVI: ${e.message}`);
    }

    try {
      canvas = renderEviToCanvas(nirBand, redBand,blueBand, {
        palette:     options.palette,
        nodataValue: options.nodataValue,
      });
      metaImagen={
        width:nirBand.width,
        height:nirBand.height,
        bboxProjected: nirBand.bboxProjected,
        rasterCrs: nirBand.rasterCrs,
        bboxLatLng: nirBand.bboxLatLng,
        boundsLeaflet:nirBand.boundsLeaflet,
        center:nirBand.center
      }
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error renderizando NDVI: ${e.message}`);
    }
  }else if(imageType==='swir-nir-red'){
    let nirBand, redBand, swirBand;
    try {
      [swirBand,nirBand, redBand] = await Promise.all([
        readBandRaster(bandUrls.band_swir16, rWidth, rHeight,readOpts,SIZE_PIXELES['band_swir16']),
        readBandRaster(bandUrls.band_nir, rWidth, rHeight, readOpts),
        readBandRaster(bandUrls.band_red, rWidth, rHeight, readOpts),
      ]);
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error leyendo bandas para NDVI: ${e.message}`);
    }

    try {
      canvas = renderEviToCanvas(swirBand,nirBand, redBand, {
        palette:     options.palette,
        nodataValue: options.nodataValue,
      });
      metaImagen={
        width:nirBand.width,
        height:nirBand.height,
        bboxProjected: nirBand.bboxProjected,
        rasterCrs: nirBand.rasterCrs,
        bboxLatLng: nirBand.bboxLatLng,
        boundsLeaflet:nirBand.boundsLeaflet,
        center:nirBand.center
      }
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error renderizando NDVI: ${e.message}`);
    }
  }else if(imageType==='agriculture-rededge'){
    let redEdge2Band,redEdge1Band, redBand;
    try {
      [redEdge2Band,redEdge1Band, redBand] = await Promise.all([
        readBandRaster(bandUrls.band_rededge2, rWidth, rHeight, readOpts,SIZE_PIXELES['band_rededge2']),
        readBandRaster(bandUrls.band_rededge1, rWidth, rHeight, readOpts,SIZE_PIXELES['band_rededge1']),
        readBandRaster(bandUrls.band_red, rWidth, rHeight, readOpts),
      ]);
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error leyendo bandas para NDVI: ${e.message}`);
    }

    try {
      canvas = renderEviToCanvas(redEdge2Band,redEdge1Band, redBand, {
        palette:     options.palette,
        nodataValue: options.nodataValue,
      });
      const nirBand=redBand;
      metaImagen={
        width:nirBand.width,
        height:nirBand.height,
        bboxProjected: nirBand.bboxProjected,
        rasterCrs: nirBand.rasterCrs,
        bboxLatLng: nirBand.bboxLatLng,
        boundsLeaflet:nirBand.boundsLeaflet,
        center:nirBand.center
      }
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error renderizando NDVI: ${e.message}`);
    }
  }else if(imageType==='rededge-nir-red'){
    let redEdge2Band,nirBand, redBand;
    try {
      [redEdge2Band,nirBand, redBand] = await Promise.all([
        readBandRaster(bandUrls.band_rededge2, rWidth, rHeight, readOpts,SIZE_PIXELES['band_rededge2']),
        readBandRaster(bandUrls.band_nir, rWidth, rHeight, readOpts),
        readBandRaster(bandUrls.band_red, rWidth, rHeight, readOpts),
      ]);
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error leyendo bandas para NDVI: ${e.message}`);
    }

    try {
      canvas = renderEviToCanvas(redEdge2Band,nirBand, redBand, {
        palette:     options.palette,
        nodataValue: options.nodataValue,
      });
      //const nirBand=redBand;
      metaImagen={
        width:nirBand.width,
        height:nirBand.height,
        bboxProjected: nirBand.bboxProjected,
        rasterCrs: nirBand.rasterCrs,
        bboxLatLng: nirBand.bboxLatLng,
        boundsLeaflet:nirBand.boundsLeaflet,
        center:nirBand.center
      }
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error renderizando NDVI: ${e.message}`);
    }
  }else {
    const [b1Key, b2Key, b3Key] = IMAGE_TYPE_BANDS[imageType];
    let b1, b2, b3;

    try {
      [b1, b2, b3] = await Promise.all([
        readBandRaster(bandUrls[b1Key], rWidth, rHeight, readOpts),
        readBandRaster(bandUrls[b2Key], rWidth, rHeight, readOpts),
        readBandRaster(bandUrls[b3Key], rWidth, rHeight, readOpts),
      ]);
    } catch (e) {
      throw new Error(
        `[generateMonitoringImage] Error leyendo bandas para "${imageType}": ${e.message}`
      );
    }

    try {
      canvas = renderRGBtoCanvas(
        { r: b1, g: b2, b: b3 },
        {
          lowPercentile:  options.lowPercentile,
          highPercentile: options.highPercentile,
        }
      );
      const nirBand=b1;
      metaImagen={
        width:nirBand.width,
        height:nirBand.height,
        bboxProjected: nirBand.bboxProjected,
        rasterCrs: nirBand.rasterCrs,
        bboxLatLng: nirBand.bboxLatLng,
        boundsLeaflet:nirBand.boundsLeaflet,
        center:nirBand.center
      }
    } catch (e) {
      throw new Error(`[generateMonitoringImage] Error renderizando RGB: ${e.message}`);
    }
  }

  // ── Construir overlays de mapa (no fatales si fallan) ─────────────────────
  let imageBounds    = null;
  let polygonLatLngs = null;

  try {
    imageBounds = bboxToLeafletBounds(scene.bbox);
  } catch (e) {
    console.warn(`[generateMonitoringImage] imageBounds no disponible: ${e.message}`);
  }

  try {
    polygonLatLngs = polygonToLeafletLatLngs(scene.polygon);
  } catch (e) {
    console.warn(`[generateMonitoringImage] polygonLatLngs no disponible: ${e.message}`);
  }

  // ── Exportaciones opcionales ───────────────────────────────────────────────
  let blob    = null;
  let dataUrl = null;

  if (options.includeBlob) {
    try {
      blob = await exportCanvasToBlob(canvas);
    } catch (e) {
      console.warn(`[generateMonitoringImage] No se pudo generar blob: ${e.message}`);
    }
  }

  if (options.includeDataUrl) {
    try {
      dataUrl = exportCanvasToDataUrl(canvas);
    } catch (e) {
      console.warn(`[generateMonitoringImage] No se pudo generar dataUrl: ${e.message}`);
    }
  }

  // ── Metadata de salida ─────────────────────────────────────────────────────
  const metadata = {
    id:           scene.id            || null,
    clave:        scene.clave         || null,
    fecha:        scene.fecha         || null,
    folio:        scene.folio         || null,
    bbox:         scene.bbox          || null,
    collection:   scene.collection    || null,
    cloudCover:   scene.cloud_cover   ?? null,
    sceneCreated: scene.scene_created || null,
    imageType,
  };

  return { canvas, blob, dataUrl, imageBounds, polygonLatLngs, metadata ,metaImagen};
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 9 — FUNCIÓN DE ALTO NIVEL: GET OR GENERATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Revisa si la escena tiene preview HTTP usable.
 * Si lo tiene (y no se fuerza regeneración), devuelve la info del preview.
 * Si no, genera la imagen desde las bandas GeoTIFF.
 *
 * @param {Object}  sceneRecord
 * @param {string}  imageType
 * @param {Object}  [options={}]
 * @param {boolean} [options.forceGenerate=false] - Forzar regeneración aunque haya preview
 *
 * @returns {Promise<{
 *   source: "preview" | "generated",
 *   previewInfo?: Object,
 *   visual?: Object,
 *   imageBounds: [[number,number],[number,number]]|null,
 *   polygonLatLngs: [number,number][]|null,
 *   metadata: Object
 * }>}
 */
export async function getOrGenerateSceneVisual(sceneRecord, imageType, options = {}) {
  if (!sceneRecord || typeof sceneRecord !== 'object') {
    throw new Error('[getOrGenerateSceneVisual] sceneRecord debe ser un objeto no nulo.');
  }

  // Normalizar para poder inspeccionar campos de preview
  let scene;
  try {
    scene = isDynamoLike(sceneRecord)
      ? normalizeDynamoScene(sceneRecord)
      : sceneRecord;
  } catch (e) {
    throw new Error(`[getOrGenerateSceneVisual] Error normalizando escena: ${e.message}`);
  }

  const previewInfo     = getScenePreviewInfo(scene);
  const hasUsablePreview = previewInfo.isHttp && !options.forceGenerate;

  // Overlays de mapa (intentar, no fatales)
  let imageBounds    = null;
  let polygonLatLngs = null;
  try { imageBounds    = bboxToLeafletBounds(scene.bbox);       } catch (_) {}
  try { polygonLatLngs = polygonToLeafletLatLngs(scene.polygon); } catch (_) {}
  const metadata = {
    id:           scene.id           || null,
    clave:        scene.clave        || null,
    fecha:        scene.fecha        || null,
    folio:        scene.folio        || null,
    bbox:         scene.bbox         || null,
    collection:   scene.collection   || null,
    cloudCover:   scene.cloud_cover  ?? null,
    sceneCreated: scene.scene_created || null,
    imageType,
  };

  if (hasUsablePreview) {
    return { source: 'preview', previewInfo, imageBounds, polygonLatLngs, metadata };
  }

  // Avisar si hay preview pero con URI no-HTTP
  if (!previewInfo.isHttp && (previewInfo.image || previewInfo.svg)) {
    console.info(
      `[getOrGenerateSceneVisual] Escena "${scene.id || scene.clave}" tiene preview ` +
      `pero con URI no-HTTP (S3/GS). Generando desde bandas GeoTIFF.`
    );
  }

  const visual = await generateMonitoringImage(scene, imageType, options);
  
  return {
    source:        'generated',
    visual,
    imageBounds:   visual.imageBounds,
    polygonLatLngs: visual.polygonLatLngs,
    metadata:      visual.metadata,
    metaImagen:     visual.metaImagen,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 10 — NAVEGACIÓN POR ESCENAS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Construye una línea de tiempo de escenas ordenadas por fecha.
 * Normaliza cada registro si viene en formato DynamoDB.
 * Enriquece cada escena con flags de preview.
 *
 * @param {Object[]} records - Lista de registros (DynamoDB-like o normalizados)
 * @returns {{
 *   scenes: Object[],
 *   getNext(clave: string): Object|null,
 *   getPrev(clave: string): Object|null,
 *   findByClave(clave: string): Object|null
 * }}
 * @throws {Error} Si records no es un array
 */
export function buildSceneTimeline(records) {
  if (!Array.isArray(records)) {
    throw new Error(
      `[buildSceneTimeline] Se esperaba un array de registros. Recibido: ${typeof records}`
    );
  }

  if (records.length === 0) {
    return {
      scenes:      [],
      getNext:     () => null,
      getPrev:     () => null,
      findByClave: () => null,
    };
  }

  // Normalizar y enriquecer cada escena
  const normalized = records.map((rec, idx) => {
    if (!rec || typeof rec !== 'object') {
      console.warn(`[buildSceneTimeline] Registro inválido en índice ${idx}, se omite.`);
      return null;
    }

    try {
      const scene = isDynamoLike(rec) ? normalizeDynamoScene(rec) : rec;
      const previewInfo = getScenePreviewInfo(scene);

      return {
        ...scene,
        _hasHttpPreview: previewInfo.isHttp,
        _hasAnyPreview:  sceneHasPreview(scene),
        _previewInfo:    previewInfo,
        _normalized:     true,
      };
    } catch (e) {
      console.warn(
        `[buildSceneTimeline] Error normalizando registro en índice ${idx}: ${e.message}`
      );
      return { ...rec, _error: e.message, _normalized: false };
    }
  }).filter(Boolean); // Eliminar nulls

  // Ordenar por fecha (ISO strings ordenan correctamente con localeCompare)
  const sorted = normalized.sort((a, b) => {
    const da = a.fecha || a.scene_created || '';
    const db = b.fecha || b.scene_created || '';
    return da.localeCompare(db);
  });

  const findByClave = (clave) =>
    sorted.find(s => s.clave === clave) || null;

  const getNext = (clave) => {
    const idx = sorted.findIndex(s => s.clave === clave);
    return (idx >= 0 && idx < sorted.length - 1) ? sorted[idx + 1] : null;
  };

  const getPrev = (clave) => {
    const idx = sorted.findIndex(s => s.clave === clave);
    return idx > 0 ? sorted[idx - 1] : null;
  };

  return { scenes: sorted, getNext, getPrev, findByClave };
}

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 11 — HELPERS DE PALETA NDVI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Devuelve una copia de la paleta NDVI por defecto para modificación.
 * @returns {Array}
 */
export function getDefaultNdviPalette() {
  return DEFAULT_NDVI_PALETTE.map(entry => ({
    ...entry,
    color: [...entry.color],
  }));
}

/**
 * Valida que una paleta NDVI tenga la estructura correcta.
 *
 * @param {Array} palette
 * @returns {boolean}
 */
export function validateNdviPalette(palette) {
  if (!Array.isArray(palette) || palette.length === 0) return false;
  return palette.every(
    entry =>
      typeof entry.min   === 'number' &&
      typeof entry.max   === 'number' &&
      entry.min < entry.max         &&
      Array.isArray(entry.color)    &&
      entry.color.length === 3      &&
      entry.color.every(c => typeof c === 'number' && c >= 0 && c <= 255)
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS NOMBRADOS — RESUMEN
// ─────────────────────────────────────────────────────────────────────────────
//
// [NORMALIZACIÓN]
//   export function normalizeDynamoScene(record)
//
// [UTILIDADES DE ESCENA]
//   export function getSceneBandUrls(scene)
//   export function sceneHasPreview(scene)
//   export function getScenePreviewInfo(scene)
//
// [VISUALIZACIÓN / MAPA]
//   export function bboxToLeafletBounds(bbox)
//   export function polygonToLeafletLatLngs(polygon)
//   export function buildMapOverlay(scene)
//
// [GENERACIÓN]
//   export async function generateMonitoringImage(sceneRecord, imageType, options)
//   export async function getOrGenerateSceneVisual(sceneRecord, imageType, options)
//
// [GUARDADO]
//   export function exportCanvasToBlob(canvas, mimeType, quality)
//   export function exportCanvasToDataUrl(canvas, mimeType, quality)
//
// [NAVEGACIÓN]
//   export function buildSceneTimeline(records)
//
// [PALETA NDVI]
//   export function getDefaultNdviPalette()
//   export function validateNdviPalette(palette)
//
// ─────────────────────────────────────────────────────────────────────────────

/*
================================================================================
EJEMPLOS DE USO
================================================================================

────────────────────────────────────────────────────────────
1. Normalizar un registro DynamoDB
────────────────────────────────────────────────────────────

import { normalizeDynamoScene } from './satelliteMonitoring.js'

const raw = {
  id:    { S: "PROD#1978" },
  fecha: { S: "2025-11-16" },
  bbox:  { L: [{ N: "-102.10" }, { N: "21.56" }, { N: "-101.01" }, { N: "22.58" }] }
}
const scene = normalizeDynamoScene(raw)
// scene.id    === "PROD#1978"
// scene.fecha === "2025-11-16"
// scene.bbox  === [-102.10, 21.56, -101.01, 22.58]


────────────────────────────────────────────────────────────
2. Generar imagen de color natural
────────────────────────────────────────────────────────────

import { generateMonitoringImage } from './satelliteMonitoring.js'

const result = await generateMonitoringImage(rawRecord, 'natural-color', {
  width:          512,
  height:         512,
  includeDataUrl: true,
})

// Mostrar en Vue:
this.imageSrc = result.dataUrl  // → <img :src="imageSrc">

// Usar en Leaflet:
L.imageOverlay(result.dataUrl, result.imageBounds).addTo(map)
L.polygon(result.polygonLatLngs, { color: '#00ff88' }).addTo(map)


────────────────────────────────────────────────────────────
3. Generar NDVI con paleta personalizada
────────────────────────────────────────────────────────────

import { generateMonitoringImage, getDefaultNdviPalette } from './satelliteMonitoring.js'

const palette = getDefaultNdviPalette()
palette[0].color = [255, 0, 0]  // suelo desnudo → rojo

const result = await generateMonitoringImage(rawRecord, 'ndvi', {
  palette,
  includeBlob: true,
})

// Descargar como PNG:
const url = URL.createObjectURL(result.blob)
const a = document.createElement('a')
a.href = url
a.download = `ndvi_${result.metadata.clave}.png`
a.click()


────────────────────────────────────────────────────────────
4. Get or Generate (con fallback a preview existente)
────────────────────────────────────────────────────────────

import { getOrGenerateSceneVisual } from './satelliteMonitoring.js'

const result = await getOrGenerateSceneVisual(rawRecord, 'false-color-vegetation', {
  includeDataUrl: true,
})

if (result.source === 'preview') {
  // La escena ya tiene preview HTTP accesible
  console.log('Preview disponible:', result.previewInfo.image)
} else {
  // Imagen generada desde bandas GeoTIFF
  const { canvas, dataUrl } = result.visual
  this.imageSrc = dataUrl
}

// En ambos casos, los overlays de mapa están listos:
L.imageOverlay(result.previewInfo?.image || result.visual.dataUrl, result.imageBounds)
L.polygon(result.polygonLatLngs)


────────────────────────────────────────────────────────────
5. Línea de tiempo y navegación de escenas
────────────────────────────────────────────────────────────

import { buildSceneTimeline } from './satelliteMonitoring.js'

const timeline = buildSceneTimeline(arrayDeRegistros)
const clave    = 'S2A_13QHE_20251116_0_L2A'

const escenaActual = timeline.findByClave(clave)
const siguiente    = timeline.getNext(clave)
const anterior     = timeline.getPrev(clave)

// Escenas que aún necesitan generación:
const sinPreview = timeline.scenes.filter(s => !s._hasHttpPreview)


────────────────────────────────────────────────────────────
6. Solo overlays de mapa (sin generar imagen)
────────────────────────────────────────────────────────────

import { normalizeDynamoScene, buildMapOverlay } from './satelliteMonitoring.js'

const scene = normalizeDynamoScene(rawRecord)
const { imageBounds, polygonLatLngs } = buildMapOverlay(scene)

L.polygon(polygonLatLngs, { color: '#00ff88', weight: 2 }).addTo(map)
//map.fitBounds(imageBounds)
const polygonLayer = L.polygon(result.polygonLatLngs, {
  color: '#00ff88',
  weight: 2
}).addTo(map)

map.fitBounds(polygonLayer.getBounds(), {
  padding: [20, 20]
})


────────────────────────────────────────────────────────────
7. Manejo de errores (siempre usar try/catch)
────────────────────────────────────────────────────────────

import { generateMonitoringImage } from './satelliteMonitoring.js'

try {
  const result = await generateMonitoringImage(rawRecord, 'swir-nir-red', {
    width: 256, height: 256
  })
  // procesar result...
} catch (err) {
  // Los errores incluyen contexto descriptivo:
  // "[generateMonitoringImage] Faltan bandas para 'swir-nir-red' en escena 'PROD#1978'..."
  // "[readBandRaster] No se pudo abrir el GeoTIFF: CORS bloqueado..."
  console.error('Error generando imagen satelital:', err.message)
  this.errorMessage = err.message
}

================================================================================
*/
