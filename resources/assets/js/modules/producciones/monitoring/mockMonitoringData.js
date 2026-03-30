const MOCK_BASE_PRODUCTION = {
  produccion_id: 1001,
  folio: 'PROD-2026-0001',
  estatus: 'ACTIVA',
  fecha_siembra: '2025-11-08',
  ultima_fecha_consultada: '2026-03-29',
  dias_max_monitoreo: 240,
  poligono: '31.742000,-116.219000|31.858000,-116.201000|31.847000,-116.121000|31.744000,-116.149000',
  pbox: {
    min_lat: 31.74,
    min_lon: -116.22,
    max_lat: 31.86,
    max_lon: -116.11,
    pbox: [-116.22, 31.74, -116.11, 31.86],
    puntos_bbox: [
      [31.74, -116.22],
      [31.74, -116.11],
      [31.86, -116.11],
      [31.86, -116.22]
    ]
  }
};

const MOCK_BASE_DETAIL = {
  id: 501,
  clave: 'S2A_20260329_31QCV',
  folio: 'DET-2026-03-29-A',
  fecha: '2026-03-29',
  cloud_cover: 8.6,
  bbox: [-116.22, 31.74, -116.11, 31.86],
  polygon: {
    type: 'Polygon',
    coordinates: [[
      [-116.22, 31.74],
      [-116.11, 31.74],
      [-116.11, 31.86],
      [-116.22, 31.86],
      [-116.22, 31.74]
    ]]
  },
  collection: 'sentinel-2-l2a',
  scene_created: '2026-03-29T15:22:10Z',
  procesado: true,
  renderizado: false,
  bandas: ['B02', 'B03', 'B04', 'B08']
};

const MOCK_PREVIEW_EMPTY = {
  json: { exists: false, url: null, key: null },
  svg: { exists: false, url: null, key: null },
  png: { exists: false, url: null, key: null }
};

const MOCK_PREVIEW_COMPLETE = {
  json: {
    exists: true,
    url: 'https://mock-s3.local/monitoring/2026-03-29/scene.json',
    key: 'monitoring/2026-03-29/scene.json'
  },
  svg: {
    exists: true,
    url: 'https://mock-s3.local/monitoring/2026-03-29/scene.svg',
    key: 'monitoring/2026-03-29/scene.svg'
  },
  png: {
    exists: true,
    url: 'https://mock-s3.local/monitoring/2026-03-29/scene.png',
    key: 'monitoring/2026-03-29/scene.png'
  }
};

const MOCK_RENDERER_DATA = {
  svgContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320"><rect width="640" height="320" fill="#f3f7fa"/><text x="20" y="40" fill="#0d47a1" font-size="22">Mock Monitoring Render</text><text x="20" y="75" fill="#455a64" font-size="16">Escena: S2A_20260329_31QCV</text><text x="20" y="105" fill="#455a64" font-size="16">Cloud cover: 8.6%</text><circle cx="520" cy="160" r="70" fill="#4fc3f7" opacity="0.45"/></svg>',
  imageUrl: 'https://mock-s3.local/monitoring/2026-03-29/render-temp.png',
  geojson: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { lote: 'L-22', indice_vigor: 0.72 },
        geometry: MOCK_BASE_DETAIL.polygon
      }
    ]
  },
  readings: [
    { label: 'NDVI', value: '0.72' },
    { label: 'Humedad estimada', value: '61%' },
    { label: 'Temperatura superficie', value: '28.4°C' },
    { label: 'Cobertura nubosa', value: '8.6%' }
  ],
  dimensions: { width: 640, height: 320 },
  style: { palette: 'teal-indigo', opacity: 0.8 }
};

export const monitoringValidationScenarios = {
  sinDetalle: {
    production: { ...MOCK_BASE_PRODUCTION },
    detail: null,
    preview: { ...MOCK_PREVIEW_EMPTY },
    rendererData: null,
    selectedDate: '2026-03-29',
    loading: false,
    updating: false,
    rendering: false,
    savingSvg: false,
    savingPng: false,
    error: null
  },
  cargando: {
    production: { ...MOCK_BASE_PRODUCTION },
    detail: { ...MOCK_BASE_DETAIL },
    preview: { ...MOCK_PREVIEW_EMPTY },
    rendererData: null,
    selectedDate: '2026-03-29',
    loading: true,
    updating: false,
    rendering: false,
    savingSvg: false,
    savingPng: false,
    error: null
  },
  error: {
    production: { ...MOCK_BASE_PRODUCTION },
    detail: { ...MOCK_BASE_DETAIL },
    preview: { ...MOCK_PREVIEW_EMPTY },
    rendererData: null,
    selectedDate: '2026-03-29',
    loading: false,
    updating: false,
    rendering: false,
    savingSvg: false,
    savingPng: false,
    error: {
      message: 'No fue posible consultar la escena para la fecha seleccionada.',
      code: 'MONITORING_FETCH_ERROR'
    }
  },
  sinPreview: {
    production: { ...MOCK_BASE_PRODUCTION },
    detail: { ...MOCK_BASE_DETAIL, renderizado: false },
    preview: { ...MOCK_PREVIEW_EMPTY },
    rendererData: null,
    selectedDate: '2026-03-29',
    loading: false,
    updating: false,
    rendering: false,
    savingSvg: false,
    savingPng: false,
    error: null
  },
  conPreview: {
    production: { ...MOCK_BASE_PRODUCTION },
    detail: { ...MOCK_BASE_DETAIL, renderizado: true },
    preview: { ...MOCK_PREVIEW_COMPLETE },
    rendererData: { ...MOCK_RENDERER_DATA },
    selectedDate: '2026-03-29',
    loading: false,
    updating: false,
    rendering: false,
    savingSvg: false,
    savingPng: false,
    error: null
  }
};

export function getMonitoringValidationScenario(name) {
  if (!name || !monitoringValidationScenarios[name]) {
    return monitoringValidationScenarios.sinPreview;
  }

  return monitoringValidationScenarios[name];
}
