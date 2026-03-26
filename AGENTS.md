# AGENTS.md — Proyecto principal `vue-module-lab`

## Objetivo operativo
Implementar el módulo Monitoring con 4 tareas:
1. Viewer
2. Renderer
3. Actions
4. Integración

## Ruta oficial de creación (obligatoria)
Toda creación del módulo debe vivir en:

`resources/assets/js/modules/producciones/monitoring`

Si una tarea propone crear archivos fuera de esa ruta, primero se corrige el plan.

## Regla de trabajo (ciclo circular)
Cada tarea itera de forma obligatoria:
1. **Creación** (en ruta oficial)
2. **Revisión** (contratos + desacoplamiento)
3. **Testing** (feliz + bordes)
4. **Nueva creación** (ajustes por hallazgos)

## Definición de terminado
- Props/emits documentados.
- Estados clave cubiertos (`sin detalle`, `cargando`, `error`, `sin preview`, `con preview`).
- Evidencia de testing.
- Progreso y próximo prompt actualizados en README.

## Convención de progreso
- `Pendiente`
- `En progreso`
- `En revisión`
- `En testing`
- `Cerrada`

Con porcentaje estimado (0–100%).
