const MOCK_BASE_PRODUCTION = {
  produccion_id: { N: '1891' },
  folio: { S: 'TL2601-37' },
  dias_max_monitoreo: { N: '95' },
  estatus: { S: 'OPEN' },
  fecha_siembra: { S: '2026-03-19' },
  poligono: { S: '21.1177972222222,-100.900811111111|21.1211583333333,-100.898858333333|21.1205194444444,-100.897930555556|21.1173777777778,-100.899711111111' },
  pbox: {
    M: {
      max_lat: { N: '21.121158333333' },
      max_lon: { N: '-100.89793055556' },
      min_lat: { N: '21.117377777778' },
      min_lon: { N: '-100.90081111111' },
      pbox: { L: [{ N: '-100.90081111111' }, { N: '21.117377777778' }, { N: '-100.89793055556' }, { N: '21.121158333333' }] },
      puntos_bbox: {
        L: [
          { L: [{ N: '21.117377777778' }, { N: '-100.90081111111' }] },
          { L: [{ N: '21.117377777778' }, { N: '-100.89793055556' }] },
          { L: [{ N: '21.121158333333' }, { N: '-100.89793055556' }] },
          { L: [{ N: '21.121158333333' }, { N: '-100.90081111111' }] }
        ]
      }
    }
  },
  ultima_fecha_consultada: { S: '2026-03-29' }
};

const MOCK_BASE_DETAIL = {
  id: { S: 'PROD#1891' },
  clave: { S: 'S2A_14QKJ_20260326_0_L2A' },
  band_blue: { S: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2A_14QKJ_20260326_0_L2A/B02.tif' },
  band_green: { S: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2A_14QKJ_20260326_0_L2A/B03.tif' },
  band_nir: { S: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2A_14QKJ_20260326_0_L2A/B08.tif' },
  band_red: { S: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2A_14QKJ_20260326_0_L2A/B04.tif' },
  band_rededge1: { S: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2A_14QKJ_20260326_0_L2A/B05.tif' },
  band_rededge3: { S: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2A_14QKJ_20260326_0_L2A/B07.tif' },
  band_swir16: { S: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2A_14QKJ_20260326_0_L2A/B11.tif' },
  bbox: { L: [{ N: '-101.899168' }, { N: '20.687254' }, { N: '-100.826462' }, { N: '21.693213' }] },
  cloud_cover: { N: '0' },
  collection: { S: 'sentinel-2-l2a' },
  fecha: { S: '2026-03-27' },
  folio: { S: 'TL2601-37' },
  polygon: {
    L: [
      { L: [{ N: '21.117377777778' }, { N: '-100.90081111111' }] },
      { L: [{ N: '21.117377777778' }, { N: '-100.89793055556' }] },
      { L: [{ N: '21.121158333333' }, { N: '-100.89793055556' }] },
      { L: [{ N: '21.121158333333' }, { N: '-100.90081111111' }] }
    ]
  },
  preview_image: { S: 's3://sentinela-monitoring/previews/PROD_1891/2026-03-27_S2A_14QKJ_20260326_0_L2A.png' },
  preview_json: { S: 's3://sentinela-monitoring/previews/PROD_1891/2026-03-27_S2A_14QKJ_20260326_0_L2A.json' },
  preview_svg: { S: 's3://sentinela-monitoring/previews/PROD_1891/2026-03-27_S2A_14QKJ_20260326_0_L2A.svg' },
  procesado: { BOOL: false },
  renderizado: { BOOL: false },
  scene_created: { S: '2026-03-27T05:24:14.229Z' }
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
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [-100.90081111111, 21.117377777778],
            [-100.89793055556, 21.117377777778],
            [-100.89793055556, 21.121158333333],
            [-100.90081111111, 21.121158333333],
            [-100.90081111111, 21.117377777778]
          ]]
        }
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
