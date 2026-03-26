# AGENTS README
## Módulo Vue: Monitoring Scene UI
### División: `Viewer` + `Renderer` + `Actions` + `Module`

---

## 0) Regla crítica para evitar confusiones de creación

Toda **creación de archivos del módulo Monitoring** debe hacerse dentro de:

`resources/assets/js/modules/producciones/monitoring`

Estructura objetivo obligatoria:

```txt
resources/assets/js/modules/producciones/monitoring/
  ProductionMonitoringModule.vue
  components/
    ProductionMonitoringViewer.vue
    ProductionMonitoringRenderer.vue
    ProductionMonitoringActions.vue
  composables/            # opcional
  utils/                  # opcional
  __tests__/              # opcional
```

### Reglas anti-error de creación
1. No crear estos componentes en otras rutas (`components/modulos/...`, `mock/`, etc.).
2. No duplicar nombres en carpetas paralelas.
3. Si ya existe un archivo con el mismo nombre fuera de la ruta oficial, **no reutilizarlo sin migración explícita**.
4. Toda tarea debe declarar ruta exacta de archivo antes de crear código.

---

## 1) Objetivo

Construir un módulo Vue reutilizable para monitoreo de producción agrícola usando:

- `production_monitoring`
- `production_monitoring_detalle`
- previews en S3 (`json`, `svg`, `png`)
- datos renderizables para generar nuevas vistas

El padre orquesta backend/S3/persistencia. El módulo solo UI + coordinación de eventos.

---

## 2) Guía UI obligatoria

Para cualquier componente de Monitoring se debe respetar:
- `docs/ui_reglasgenerales.md`
- uso de **Materialize CSS**
- estructura limpia, moderna y minimalista

---

## 3) Arquitectura propuesta

### 3.1 Contenedor
- `ProductionMonitoringModule.vue`

### 3.2 Subcomponentes
- `ProductionMonitoringViewer.vue` → visualiza estado actual
- `ProductionMonitoringRenderer.vue` → construye vista temporal
- `ProductionMonitoringActions.vue` → emite intención del usuario

---

## 4) Responsabilidad por componente

### 4.1 Viewer
**Sí:** mostrar metadata, detalle, previews y estados (`loading/error/vacío`).

**No:** HTTP, AWS, persistencia, render complejo.

### 4.2 Renderer
**Sí:** tomar `detail + rendererData`, preparar salida temporal y emitir:
- `render-ready`
- `render-error`
- `request-render`

**No:** guardar en S3, persistir en DB, consultar backend.

### 4.3 Actions
**Sí:** botones y eventos:
- `update`
- `change-date`
- `render`
- `save-svg`
- `save-png`
- `save-all`

**No:** lógica visual compleja, render interno, persistencia.

### 4.4 Module (contenedor)
**Sí:** coordinar Viewer + Renderer + Actions, calcular estados derivados y reemitir eventos al padre.

---

## 5) Contrato de datos mínimo

### `production`
- `produccion_id`, `folio`, `estatus`, `fecha_siembra`, `ultima_fecha_consultada`, `dias_max_monitoreo`, `pbox`

### `detail`
- `id`, `clave`, `folio`, `fecha`, `cloud_cover`, `bbox`, `polygon`, `collection`, `scene_created`, `procesado`, `renderizado`, `bandas`

### `preview`
```json
{
  "json": { "exists": false, "url": null, "key": null },
  "svg":  { "exists": false, "url": null, "key": null },
  "png":  { "exists": false, "url": null, "key": null }
}
```

### `rendererData`
Salida/entrada temporal para construir visualización (`svgContent`, `imageUrl`, `geojson`, `dimensions`, `style`).

---

## 6) Flujo funcional resumido

1. **Visualizar**: padre envía `production/detail/preview` → Viewer muestra.
2. **Sin imagen**: Actions habilita “Generar vista” → renderer emite `request-render` o `render-ready`.
3. **Guardar**: usuario ejecuta `save-svg/save-png` → padre persiste → padre refresca props → Viewer actualiza.

---

## 7) Ciclo circular por tarea

Cada tarea debe ejecutarse como:

1. **Creación** (en la ruta oficial)
2. **Revisión** (props/emits/estados/reglas de desacoplamiento)
3. **Testing** (flujo feliz + bordes)
4. **Nueva creación** (ajustes por hallazgos)

---

## 8) Prompts sugeridos (con contexto fijo para no perder continuidad)

### Prompt 1 — Viewer
> Crea `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringViewer.vue` con props `production`, `detail`, `preview`, `selectedDate`, `loading`, `error`; muestra metadata, previews y estados vacíos/error sin lógica HTTP/AWS/persistencia y siguiendo `docs/ui_reglasgenerales.md`.

#### Subprompt 1.1 — Cierre de Viewer
> Finaliza Viewer: valida checklist (`loading`, `error`, `sin detalle`, `preview png/svg`), corrige pendientes, integra en `ProductionMonitoringModule.vue` si aplica y actualiza `docs/progreso.md` marcando la tarea como `Cerrada` (100%) o con bloqueo explícito.

### Prompt 2 — Renderer
> Crea `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringRenderer.vue` que reciba `detail`, `preview`, `rendererData`, `selectedDate`, `rendering` y emita `render-ready`, `render-error`, `request-render` según disponibilidad, manteniendo UI limpia/minimalista con Materialize.

### Prompt 3 — Actions
> Crea `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringActions.vue` con botones (actualizar, cambiar fecha, generar vista, guardar svg/png, guardar todo), reglas de habilitación por estado y emits desacoplados, aplicando la guía UI general.

### Prompt 4 — Integración
> Crea `resources/assets/js/modules/producciones/monitoring/ProductionMonitoringModule.vue` para integrar Viewer/Renderer/Actions, calcular `hasDetail`, `hasJsonPreview`, `hasSvgPreview`, `hasPngPreview`, `canRender`, `canSaveSvg`, `canSavePng` y reemitir eventos al padre.

### Archivos base obligatorios para **todos** los prompts
1. `docs/modulos/producciones/Monitoring/AGENTS_README.md`
2. `docs/ui_reglasgenerales.md`
3. `docs/progreso.md`
4. `AGENTS.md`

### Archivos que cada prompt debe actualizar
1. `docs/progreso.md` (estado, avance, bitácora, próximo paso)
2. Archivo(s) objetivo en `resources/assets/js/modules/producciones/monitoring/...`
3. (Si cambia política global) `docs/ui_reglasgenerales.md` o `AGENTS.md`

---

## 9) Regla final

Cada componente responde a una sola pregunta:
- **Viewer** → ¿qué existe y cómo se ve?
- **Renderer** → ¿qué puedo construir con estos datos?
- **Actions** → ¿qué quiere hacer el usuario?
- **Module** → ¿cómo coordino los tres sin acoplar persistencia?


## 10) Regla de cierre por prompt
Cada prompt principal debe incluir un subprompt de cierre para:
1. verificar checklist funcional,
2. actualizar `docs/progreso.md`,
3. marcar estado como `Cerrada` o dejar bloqueo documentado.
