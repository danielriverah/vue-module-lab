# AGENTS README
## Componente Vue: `ProductionMonitoringViewer`
## Módulo Vue: Monitoring Scene UI
### División: `Viewer` + `Renderer` + `Actions`

### Objetivo

Crear un componente Vue reutilizable para visualizar el monitoreo de una producción agrícola a partir de:

- datos generales de `production_monitoring`
- detalle de escena de `production_monitoring_detalle`
- archivos de vista previa existentes en S3 (`json`, `svg`, `png`)
- posibilidad de generar la vista cuando no exista imagen para una fecha dada
- emitir acciones al componente padre para actualizar, guardar SVG y guardar PNG

El componente **no debe ser dueño de la lógica de persistencia**.  
Debe comportarse como un visor/controlador de UI que:

- **recibe datos**
- **muestra estado**
- **detecta faltantes**
- **solicita acciones al padre**
- **reacciona a nuevos datos recibidos**

---

# 1. Responsabilidad del componente

El componente `ProductionMonitoringViewer` debe:

1. Mostrar información general de la producción.
2. Mostrar información del detalle satelital de la fecha seleccionada.
3. Mostrar la previsualización existente si ya hay:
   - `preview_json`
   - `preview_svg`
   - `preview_image`
4. Si la imagen de la fecha actual no existe:
   - permitir generar la vista
   - permitir guardar SVG
   - permitir guardar PNG
5. Emitir acciones al padre para que este ejecute:
   - actualización de datos
   - generación/render
   - guardado de SVG
   - guardado de PNG
6. Actualizarse automáticamente cuando el padre cambie props o pase nuevos datos.

---

# 2. Filosofía de diseño

Este componente debe ser **presentacional + interactivo**, pero no acoplarse a servicios HTTP ni SDK de AWS directamente.

## El padre debe encargarse de:

- consultar backend
- consultar DynamoDB
- consultar existencia real en S3
- generar JSON/SVG/PNG
- persistir cambios
- volver a pasar al componente los datos actualizados

## El hijo debe encargarse de:

- renderizar la UI
- decidir qué botones mostrar
- emitir eventos
- reaccionar a cambios de props
- mostrar loading, errores y estados vacíos

---

# 3. Entidades de entrada esperadas

## 3.1 `production`
Representa el registro principal de monitoreo.

Ejemplo esperado:

```json
{
  "produccion_id": 1987,
  "folio": "TL2601-04",
  "dias_max_monitoreo": 95,
  "estatus": "OPEN",
  "fecha_siembra": "2026-01-27",
  "ultima_fecha_consultada": "2026-03-19",
  "pbox": {
    "min_lat": 21.122813888889,
    "min_lon": -100.89053055556,
    "max_lat": 21.126355555556,
    "max_lon": -100.88798333333,
    "pbox": [-100.89053055556, 21.122813888889, -100.88798333333, 21.126355555556],
    "puntos_bbox": [
      [21.122813888889, -100.89053055556],
      [21.122813888889, -100.88798333333],
      [21.126355555556, -100.88798333333],
      [21.126355555556, -100.89053055556]
    ]
  }
}
# Enfoque mas detallado
# AGENTS README
## Módulo Vue: Monitoring Scene UI
### División: `Viewer` + `Renderer` + `Actions`

---

# 1. Objetivo

Construir un módulo Vue para monitoreo de producción agrícola usando datos de:

- `production_monitoring`
- `production_monitoring_detalle`
- previews existentes en S3
- datos renderizables para generar nuevas vistas

El módulo debe dividirse en tres piezas especializadas:

- **Viewer** → visualiza datos y previews
- **Renderer** → genera o prepara la visualización
- **Actions** → expone botones y emite eventos

El padre orquesta la carga, persistencia, consulta en backend, consulta en S3 y actualización de props.

---

# 2. Arquitectura propuesta

## 2.1 Componente contenedor
### `ProductionMonitoringModule.vue`

Este componente une a los 3 subcomponentes:

- `ProductionMonitoringViewer.vue`
- `ProductionMonitoringRenderer.vue`
- `ProductionMonitoringActions.vue`

Su función es:

- recibir props globales
- repartir datos a cada subcomponente
- escuchar eventos de hijos
- reenviar eventos al padre o coordinarlos localmente

---

# 3. Responsabilidad de cada componente

---

# 3.1 `ProductionMonitoringViewer.vue`

## Responsabilidad
Mostrar datos ya existentes.

## Debe mostrar
- información general de producción
- información del detalle de escena
- preview PNG si existe
- preview SVG si existe
- estado de disponibilidad de JSON/SVG/PNG
- mensajes vacíos o errores visuales

## No debe hacer
- render de imagen nueva
- guardado en S3
- llamadas HTTP
- lógica AWS

## Props sugeridas

```js
props: {
  production: { type: Object, required: true },
  detail: { type: Object, default: null },
  preview: {
    type: Object,
    default: () => ({
      json: { exists: false, url: null, key: null },
      svg: { exists: false, url: null, key: null },
      png: { exists: false, url: null, key: null }
    })
  },
  selectedDate: { type: String, default: null },
  loading: { type: Boolean, default: false },
  error: { type: [String, Object, null], default: null }
}
Computed sugeridos
computed: {
  hasDetail() {
    return !!this.detail;
  },
  hasJsonPreview() {
    return !!this.preview?.json?.exists;
  },
  hasSvgPreview() {
    return !!this.preview?.svg?.exists;
  },
  hasPngPreview() {
    return !!this.preview?.png?.exists;
  }
}
Estados que debe manejar
sin detalle
cargando
error
detalle con preview
detalle sin preview
Salida esperada

Visualización pura.

3.2 ProductionMonitoringRenderer.vue
Responsabilidad

Tomar los datos necesarios para construir una vista previa renderizable.

Debe encargarse de
recibir detail
recibir rendererData o preview.json
montar una previsualización interna
preparar SVG o contenido gráfico temporal
notificar si puede guardarse
reaccionar cuando cambie fecha, detalle o datos renderizables
No debe hacer
guardar directamente en S3
persistir en DynamoDB
consultar backend
Props sugeridas
props: {
  production: { type: Object, required: true },
  detail: { type: Object, default: null },
  preview: { type: Object, default: () => ({}) },
  rendererData: { type: Object, default: null },
  selectedDate: { type: String, default: null },
  rendering: { type: Boolean, default: false }
}
Eventos que puede emitir
emit('render-ready', {
  svgContent,
  pngSource,
  metadata
})

emit('render-error', error)

emit('request-render', {
  production,
  detail,
  selectedDate
})
Función clave

Este componente sirve para cubrir el caso:

“Estoy viendo la fecha de hoy, no existe imagen, pero sí tengo datos para crearla”.

Entonces:

si no hay preview persistido
pero sí existe información para renderizar
el renderer puede construir una vista temporal y avisar al sistema que ya está lista para guardar
Casos de uso
Caso A: existe PNG
puede no renderizar nada
o mostrar el PNG directamente
Caso B: no existe PNG pero existe JSON/renderData
genera SVG temporal
genera preview local
habilita acciones de guardado
Caso C: no existe nada
emite request-render
3.3 ProductionMonitoringActions.vue
Responsabilidad

Centralizar todas las acciones del usuario.

Debe mostrar botones como:
Actualizar
Cambiar fecha
Generar vista
Guardar SVG
Guardar PNG
Guardar todo
Reintentar
No debe hacer
lógica de visualización
render de imagen
persistencia
Props sugeridas
props: {
  hasDetail: { type: Boolean, default: false },
  hasJsonPreview: { type: Boolean, default: false },
  hasSvgPreview: { type: Boolean, default: false },
  hasPngPreview: { type: Boolean, default: false },
  canRender: { type: Boolean, default: false },
  canSaveSvg: { type: Boolean, default: false },
  canSavePng: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  updating: { type: Boolean, default: false },
  rendering: { type: Boolean, default: false },
  savingSvg: { type: Boolean, default: false },
  savingPng: { type: Boolean, default: false },
  selectedDate: { type: String, default: null }
}
Eventos que debe emitir
emit('update')
emit('change-date', date)
emit('render')
emit('save-svg')
emit('save-png')
emit('save-all')
Reglas de habilitación
Botón actualizar

Siempre disponible salvo loading/updating

Botón generar vista

Disponible si:

hay detail
no hay PNG
no está renderizando
Botón guardar SVG

Disponible si:

existe salida del renderer o SVG temporal
no está guardando
Botón guardar PNG

Disponible si:

existe salida renderizada o SVG/base visual
no está guardando
4. Componente contenedor
ProductionMonitoringModule.vue

Este componente debe ser el pegamento entre todos.

Props sugeridas
props: {
  production: { type: Object, required: true },
  detail: { type: Object, default: null },
  preview: { type: Object, default: () => ({}) },
  rendererData: { type: Object, default: null },
  selectedDate: { type: String, default: null },
  loading: { type: Boolean, default: false },
  updating: { type: Boolean, default: false },
  rendering: { type: Boolean, default: false },
  savingSvg: { type: Boolean, default: false },
  savingPng: { type: Boolean, default: false },
  error: { type: [String, Object, null], default: null }
}
Eventos que reemite al padre
emit('update')
emit('change-date', date)
emit('render', payload)
emit('save-svg', payload)
emit('save-png', payload)
emit('save-all', payload)
Responsabilidades
calcular estados derivados globales
pasar datos a Viewer
pasar datos a Renderer
pasar flags a Actions
escuchar render-ready
exponer save-svg y save-png con payload completo
5. Flujo de interacción
5.1 Flujo: solo visualizar
Padre carga production, detail, preview
Viewer muestra metadata e imagen
Actions solo habilita actualizar o cambiar fecha
5.2 Flujo: no existe imagen
Padre pasa detail, pero preview.png.exists = false
Viewer muestra “sin preview”
Actions habilita “Generar vista”
Usuario pulsa “Generar vista”
Actions emite render
Padre genera datos o responde con rendererData
Renderer crea preview temporal
Renderer emite render-ready
Actions habilita guardar SVG/PNG
5.3 Flujo: guardar
Usuario pulsa “Guardar SVG”
Actions emite save-svg
Padre guarda en S3
Padre actualiza preview
Viewer refleja el nuevo estado

Igual para PNG.

6. Contrato de datos
6.1 production

Datos globales de monitoreo.

Campos esperados:

produccion_id
folio
estatus
fecha_siembra
ultima_fecha_consultada
dias_max_monitoreo
pbox
6.2 detail

Datos de escena puntual.

Campos esperados:

id
clave
folio
fecha
cloud_cover
bbox
polygon
collection
scene_created
procesado
renderizado
bandas
6.3 preview

Estado real de archivos existentes.

{
  json: { exists: false, url: null, key: null },
  svg: { exists: false, url: null, key: null },
  png: { exists: false, url: null, key: null }
}
6.4 rendererData

Datos temporales o definitivos para construir la salida visual.

Ejemplo:

{
  svgContent: null,
  imageUrl: null,
  geojson: null,
  dimensions: { width: 512, height: 512 },
  style: {
    type: 'ndvi',
    opacity: 0.7,
    palette: {
      muy_bajo: '#8b0000',
      bajo: '#ff6600',
      medio: '#ffff00',
      alto: '#66cc00',
      muy_alto: '#008000'
    }
  }
}
7. Estados derivados en el contenedor
computed: {
  hasDetail() {
    return !!this.detail;
  },
  hasJsonPreview() {
    return !!this.preview?.json?.exists;
  },
  hasSvgPreview() {
    return !!this.preview?.svg?.exists;
  },
  hasPngPreview() {
    return !!this.preview?.png?.exists;
  },
  canRender() {
    return this.hasDetail && !this.rendering;
  },
  canSaveSvg() {
    return !!this.rendererData?.svgContent && !this.savingSvg;
  },
  canSavePng() {
    return (!!this.rendererData?.svgContent || !!this.rendererData?.imageUrl) && !this.savingPng;
  }
}
8. Watchers recomendados

El contenedor o el renderer deben reaccionar a:

cambio de fecha
cambio de detalle
cambio de preview
cambio de rendererData

Ejemplo conceptual:

watch: {
  detail: {
    immediate: true,
    deep: true,
    handler(val) {
      this.localDetail = val;
    }
  },
  preview: {
    immediate: true,
    deep: true,
    handler(val) {
      this.localPreview = val;
    }
  },
  rendererData: {
    immediate: true,
    deep: true,
    handler(val) {
      this.localRendererData = val;
    }
  }
}
9. Estructura visual sugerida
Bloque 1: Viewer
encabezado de producción
metadata de escena
preview visible
Bloque 2: Renderer
canvas/svg temporal
estado de render
mensajes de disponibilidad
Bloque 3: Actions
selector de fecha
actualizar
generar
guardar svg
guardar png
10. Reglas de desacoplamiento
Viewer

Solo lee y muestra.

Renderer

Solo transforma datos a vista temporal.

Actions

Solo emite intención del usuario.

Parent

Consulta, guarda, actualiza y sincroniza.

11. Nombres sugeridos
ProductionMonitoringModule.vue
ProductionMonitoringViewer.vue
ProductionMonitoringRenderer.vue
ProductionMonitoringActions.vue
12. Resultado esperado

El módulo final debe permitir:

visualizar una producción y su escena
ver previews existentes
construir preview temporal cuando no exista
guardar salidas cuando el usuario lo decida
reaccionar automáticamente a nuevos datos del padre
13. Regla principal

Cada componente debe responder a una sola pregunta:

Viewer → ¿qué existe y cómo se ve?
Renderer → ¿qué puedo construir con estos datos?
Actions → ¿qué quiere hacer el usuario?