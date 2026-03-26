# AGENTS.md — Proyecto principal `vue-module-lab`

## Objetivo operativo
Implementar módulos de forma ordenada, desacoplada y con seguimiento claro del avance activo.

## Ruta oficial de creación para Monitoring
Toda creación del módulo Monitoring debe vivir en:

`resources/assets/js/modules/producciones/monitoring`

Si una tarea propone crear archivos fuera de esa ruta, primero se corrige el plan.

## Regla de trabajo (ciclo circular)
Cada tarea itera de forma obligatoria:
1. **Creación** (en ruta oficial)
2. **Revisión** (contratos + desacoplamiento)
3. **Testing** (feliz + bordes)
4. **Nueva creación** (ajustes por hallazgos)

## Dónde registrar avance
- El estado operativo del módulo en curso se registra en `docs/progreso.md`.
- `README.MD` queda reservado para información general del repositorio.

## Definición de terminado
- Props/emits documentados.
- Estados clave cubiertos (`sin detalle`, `cargando`, `error`, `sin preview`, `con preview`).
- Evidencia de testing.
- Progreso y próximo paso actualizados en `docs/progreso.md`.

## Convención de progreso
- `Pendiente`
- `En progreso`
- `En revisión`
- `En testing`
- `Cerrada`

Con porcentaje estimado (0–100%).
