# Progreso activo de desarrollo

> Este archivo concentra el seguimiento del **módulo en trabajo actual**.
> Cuando se cambie de módulo, cerrar el bloque anterior y abrir uno nuevo.

---

## Módulo activo
- Nombre: `Monitoring Scene UI`
- Ruta objetivo: `resources/assets/js/modules/producciones/monitoring`
- Documento base: `docs/modulos/producciones/Monitoring/AGENTS_README.md`
- Guía UI base: `docs/ui_reglasgenerales.md`
- Última actualización: `2026-03-26`

## Estado general
- Estado: `En progreso`
- Avance total estimado: `25%`
- Bloqueo actual: `Ninguno`

---

## Tablero por tareas

| Tarea | Estado | Avance | Último movimiento | Próximo paso |
|---|---|---:|---|---|
| 1. Viewer | Cerrada | 100% | Checklist validado e integración parcial en Module | Iniciar Renderer |
| 2. Renderer | Pendiente | 0% | Definida ruta y eventos | Crear render temporal |
| 3. Actions | Pendiente | 0% | Definidas acciones | Crear botonera y emits |
| 4. Integración | Pendiente | 0% | Definido contenedor | Integrar subcomponentes |

---

## Ciclo de trabajo obligatorio (por tarea)
1. **Creación**
2. **Revisión**
3. **Testing**
4. **Nueva creación** (iteración)

---

## Bitácora breve

### 2026-03-26
- Se separó documentación general (`README.MD`) de seguimiento operativo (`docs/progreso.md`).
- Se confirmó que el progreso se llevará aquí para trabajar un módulo a la vez.
- Se agregó regla UI global para Materialize + estilo limpio/moderno/minimalista.
- Se creó `ProductionMonitoringViewer.vue` en la ruta oficial con props, estados (`loading/error/vacío`) y visualización de previews sin lógica de persistencia.
- Se cerró la Tarea 1 (Viewer) al 100%: checklist validado (`loading`, `error`, `sin detalle`, `preview png/svg`) e integración parcial en `ProductionMonitoringModule.vue`.

---

## Prompt próximo sugerido (con contexto fijo)
> Inicia la Tarea 2 creando `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringRenderer.vue` para render temporal con eventos `render-ready`, `render-error` y `request-render`, aplicando `docs/ui_reglasgenerales.md`.

### Archivos base que debes leer antes de ejecutar el prompt
1. `docs/modulos/producciones/Monitoring/AGENTS_README.md`
2. `docs/ui_reglasgenerales.md`
3. `docs/progreso.md`
4. `AGENTS.md`

### Archivos que debes actualizar durante el prompt
1. `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringRenderer.vue`
2. `resources/assets/js/modules/producciones/monitoring/ProductionMonitoringModule.vue`
3. `docs/progreso.md`


### Subprompt de cierre/completado
> Finaliza la Tarea 2 (Renderer): valida casos A/B/C (con PNG / render temporal / request-render), corrige pendientes de payload y actualiza `docs/progreso.md` dejando estado `Cerrada` (100%) o bloqueo explícito.
