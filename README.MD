# vue-module-lab

## Plan principal (Monitoring)

Fuente funcional base:
`docs/modulos/producciones/Monitoring/AGENTS_README.md`

## Regla de creación para evitar confusiones

Todas las nuevas piezas del módulo deben crearse en:

`resources/assets/js/modules/producciones/monitoring`

Estructura esperada:
- `ProductionMonitoringModule.vue`
- `components/ProductionMonitoringViewer.vue`
- `components/ProductionMonitoringRenderer.vue`
- `components/ProductionMonitoringActions.vue`

---

## Tarea 1 — Viewer

### Ciclo circular
1. **Creación**
   - Crear archivo en: `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringViewer.vue`
2. **Revisión**
   - Validar props, estados y desacoplamiento.
3. **Testing**
   - Probar: con detalle, sin detalle, con/sin preview.
4. **Nueva creación**
   - Ajustes por hallazgos.

### Progreso
- Estado: `Pendiente`
- Avance: `0%`

### Prompt próximo sugerido
> Crea `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringViewer.vue` sin lógica de persistencia ni HTTP, solo visualización y estados.

---

## Tarea 2 — Renderer

### Ciclo circular
1. **Creación**
   - Crear archivo en: `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringRenderer.vue`
2. **Revisión**
   - Verificar emits (`render-ready`, `render-error`, `request-render`) y reacción a cambios.
3. **Testing**
   - Probar casos: A) hay PNG, B) render temporal, C) request-render.
4. **Nueva creación**
   - Ajustar watchers/payload.

### Progreso
- Estado: `Pendiente`
- Avance: `0%`

### Prompt próximo sugerido
> Crea `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringRenderer.vue` para render temporal y emisión de eventos sin persistencia.

---

## Tarea 3 — Actions

### Ciclo circular
1. **Creación**
   - Crear archivo en: `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringActions.vue`
2. **Revisión**
   - Revisar reglas de habilitación/deshabilitación.
3. **Testing**
   - Validar eventos y estado de botones.
4. **Nueva creación**
   - Ajustes por hallazgos.

### Progreso
- Estado: `Pendiente`
- Avance: `0%`

### Prompt próximo sugerido
> Crea `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringActions.vue` con botones y emits desacoplados para que el padre persista.

---

## Tarea 4 — Integración

### Ciclo circular
1. **Creación**
   - Crear archivo en: `resources/assets/js/modules/producciones/monitoring/ProductionMonitoringModule.vue`
2. **Revisión**
   - Validar estados derivados y coordinación entre subcomponentes.
3. **Testing**
   - Probar flujos de visualización, generación temporal y guardado.
4. **Nueva creación**
   - Ajustes por hallazgos.

### Progreso
- Estado: `Pendiente`
- Avance: `0%`

### Prompt próximo sugerido
> Crea `resources/assets/js/modules/producciones/monitoring/ProductionMonitoringModule.vue` como contenedor de Viewer, Renderer y Actions, reemitiendo eventos al padre.

---

## Tablero consolidado

| Tarea | Estado | Avance |
|---|---|---|
| Viewer | Pendiente | 0% |
| Renderer | Pendiente | 0% |
| Actions | Pendiente | 0% |
| Integración | Pendiente | 0% |
