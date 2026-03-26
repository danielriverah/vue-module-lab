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
- Estado: `En planeación`
- Avance total estimado: `0%`
- Bloqueo actual: `Ninguno`

---

## Tablero por tareas

| Tarea | Estado | Avance | Último movimiento | Próximo paso |
|---|---|---:|---|---|
| 1. Viewer | En revisión | 70% | Componente base creado | Revisar props/estados y validar integración |
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

---

## Prompt próximo sugerido (con contexto fijo)
> Revisa e integra `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringViewer.vue` dentro del contenedor del módulo y valida casos `loading/error/sin detalle/con preview` con datos mock.

### Archivos base que debes leer antes de ejecutar el prompt
1. `docs/modulos/producciones/Monitoring/AGENTS_README.md`
2. `docs/ui_reglasgenerales.md`
3. `docs/progreso.md`
4. `AGENTS.md`

### Archivos que debes actualizar durante el prompt
1. `resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringViewer.vue`
2. `resources/assets/js/modules/producciones/monitoring/ProductionMonitoringModule.vue`
3. `docs/progreso.md`
