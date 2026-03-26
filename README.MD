# vue-module-lab

## Plan principal (basado en `docs/modulos/producciones/Monitoring/AGENTS_README.md`)

Este roadmap divide el módulo Monitoring en **3 tareas principales** y una **4ta tarea de integración**, cada una con ciclo circular de:

**Creación → Revisión → Testing → Creación (iteración siguiente)**

---

## Tarea 1 — Viewer (`ProductionMonitoringViewer.vue`)

### Alcance
Mostrar:
- metadata de `production`
- detalle de escena `detail`
- estado y vista previa (`json`, `svg`, `png`)
- estados visuales (`loading`, `error`, vacío)

### Ciclo circular
1. **Creación**
   - Estructura de UI para metadata y preview.
   - Computed: `hasDetail`, `hasJsonPreview`, `hasSvgPreview`, `hasPngPreview`.
2. **Revisión**
   - Revisar contratos de props y defaults.
   - Validar que no existan llamadas HTTP/S3/AWS.
3. **Testing**
   - Caso con preview completo.
   - Caso sin preview.
   - Caso sin detalle.
4. **Nueva vuelta (Creación)**
   - Ajustar mensajes, estados vacíos y accesibilidad.

### Progreso sugerido
- Estado: `Pendiente`
- Avance: `0%`

### Prompt próximo sugerido
> Implementa `ProductionMonitoringViewer.vue` con props tipadas, computed de disponibilidad de preview y estados visuales (loading/error/sin detalle), sin lógica de persistencia.

---

## Tarea 2 — Renderer (`ProductionMonitoringRenderer.vue`)

### Alcance
Render temporal cuando no hay preview persistido, usando `detail` + `rendererData`.

### Ciclo circular
1. **Creación**
   - Base de renderer temporal (SVG/imagen local).
   - Emisión de eventos: `render-ready`, `render-error`, `request-render`.
2. **Revisión**
   - Verificar que solo transforme datos de entrada a salida visual temporal.
   - Confirmar reacción a cambios de `selectedDate`, `detail`, `rendererData`.
3. **Testing**
   - Caso A: hay PNG (no render extra).
   - Caso B: no hay PNG pero sí `rendererData` (render temporal).
   - Caso C: no hay datos (emitir `request-render`).
4. **Nueva vuelta (Creación)**
   - Optimizar watchers, payload y metadata de salida.

### Progreso sugerido
- Estado: `Pendiente`
- Avance: `0%`

### Prompt próximo sugerido
> Crea `ProductionMonitoringRenderer.vue` que reciba `detail`, `preview`, `rendererData` y emita `render-ready`, `render-error` o `request-render` según disponibilidad de datos.

---

## Tarea 3 — Actions (`ProductionMonitoringActions.vue`)

### Alcance
Centralizar acciones de usuario y reglas de habilitación:
- actualizar
- cambiar fecha
- generar vista
- guardar SVG
- guardar PNG
- guardar todo

### Ciclo circular
1. **Creación**
   - Botonera y selector de fecha.
   - Emits: `update`, `change-date`, `render`, `save-svg`, `save-png`, `save-all`.
2. **Revisión**
   - Revisar reglas de `disabled` por estado (`loading`, `updating`, `rendering`, `saving*`).
   - Revisar consistencia de UX y etiquetas.
3. **Testing**
   - Verificar habilitación/deshabilitación en cada combinación crítica.
   - Verificar emisiones correctas y payload.
4. **Nueva vuelta (Creación)**
   - Ajustar copy de botones e indicadores de progreso.

### Progreso sugerido
- Estado: `Pendiente`
- Avance: `0%`

### Prompt próximo sugerido
> Implementa `ProductionMonitoringActions.vue` con reglas de habilitación para render/guardado y eventos desacoplados para que el padre ejecute persistencia.

---

## Tarea 4 — Integración (`ProductionMonitoringModule.vue`)

### Alcance
Integrar Viewer + Renderer + Actions como contenedor coordinador.

### Ciclo circular
1. **Creación**
   - Componer los 3 subcomponentes.
   - Pasar props globales y estados derivados (`hasDetail`, `canRender`, `canSaveSvg`, `canSavePng`).
2. **Revisión**
   - Validar contratos y flujo de eventos hacia el padre.
   - Confirmar desacoplamiento: el módulo integra UI, el padre persiste.
3. **Testing**
   - Flujo de solo visualización.
   - Flujo sin preview + generación temporal.
   - Flujo de guardado SVG/PNG + refresco por props nuevas.
4. **Nueva vuelta (Creación)**
   - Ajustar sincronización de watchers y payload final.

### Progreso sugerido
- Estado: `Pendiente`
- Avance: `0%`

### Prompt próximo sugerido
> Crea `ProductionMonitoringModule.vue` como contenedor de Viewer, Renderer y Actions; calcula estados derivados y reemite eventos al padre con payload consistente.

---

## Tablero de progreso consolidado

| Tarea | Estado | Avance |
|---|---|---|
| 1. Viewer | Pendiente | 0% |
| 2. Renderer | Pendiente | 0% |
| 3. Actions | Pendiente | 0% |
| 4. Integración | Pendiente | 0% |

---

## Notas de ejecución
- Mantener arquitectura desacoplada: UI/estado en componentes; persistencia/consultas en padre.
- Repetir ciclo circular por tarea hasta cierre de criterios.
- Actualizar esta tabla al terminar cada ronda de creación, revisión y testing.
