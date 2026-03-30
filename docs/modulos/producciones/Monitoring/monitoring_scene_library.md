# Monitoring Scene Library (`monitoringSceneLibrary.js`)

Ruta:
`resources/assets/js/modules/producciones/monitoring/utils/monitoringSceneLibrary.js`

## ¿Qué hace?

Esta librería centraliza la lógica para:
- normalizar registros de monitoreo (DynamoDB/API/MySQL)
- crear timeline de fechas con datos
- navegar entre fechas disponibles
- detectar estado de escena (`ready`, `needs-generation`, `processing`, etc.)
- generar previews desde bandas con GeoTIFF:
  - color natural
  - falso color vegetación
  - SWIR-NIR-RED
  - NDVI
- generar SVG temático NDVI
- entregar `bbox` y `imageBounds` para Leaflet
- mapear polígonos a `lat/lng`
- guardar blobs

## Dependencia necesaria

```bash
npm i geotiff
```

## Uso rápido

```js
import sceneLib from '@/modules/producciones/monitoring/utils/monitoringSceneLibrary';

const timeline = sceneLib.buildTimelineItems(details);
const navigator = sceneLib.createMonitoringNavigator(details, selectedDate);
const current = navigator.current();
const status = sceneLib.resolveSceneStatus(current?.detail);

const visuals = await sceneLib.generateSceneVisuals(current?.detail, {
  outputSize: 512
});

// Leaflet
const bounds = sceneLib.bboxToLeafletBounds(current?.detail?.bbox);
const latLngs = sceneLib.polygonToLeafletLatLngs(current?.detail?.polygon);
```

## Integración actual en el módulo

`ProductionMonitoringModule.vue` consume la librería para:
- construir `timelineItems`
- calcular `sceneStatus`

Y `ProductionMonitoringViewer.vue` muestra esos datos en UI para validación rápida.
