# AGENTS.md — Proyecto principal `vue-module-lab`

Este archivo define cómo planear y ejecutar el módulo **Monitoring Scene UI** con una dinámica circular por tarea.

## Objetivo operativo
Implementar el módulo `ProductionMonitoringModule` dividido en:
1. `ProductionMonitoringViewer`
2. `ProductionMonitoringRenderer`
3. `ProductionMonitoringActions`
4. Integración de las tres piezas

## Regla de trabajo (ciclo circular obligatorio)
Cada tarea debe iterar en este orden y repetirlo hasta cerrar criterios:

1. **Creación**
   - Implementar alcance mínimo funcional.
   - Mantener desacoplamiento (sin persistencia ni llamadas HTTP dentro de componentes presentacionales).
2. **Revisión**
   - Revisar props, emits, estados derivados y UX de estados vacíos/error/loading.
   - Verificar que no se rompa el contrato de datos (`production`, `detail`, `preview`, `rendererData`).
3. **Testing**
   - Probar flujo feliz y casos borde.
   - Registrar resultados y ajustar pendientes.
4. **Volver a Creación**
   - Tomar hallazgos de testing para siguiente iteración.

## Definición de terminado por tarea
- Props y eventos documentados.
- Estados clave cubiertos (`sin detalle`, `cargando`, `error`, `sin preview`, `con preview`).
- Validación manual de botones/acciones habilitadas.
- Evidencia breve en README (progreso y siguiente prompt sugerido).

## Convención de progreso
Usar estatus por tarea:
- `Pendiente`
- `En progreso`
- `En revisión`
- `En testing`
- `Cerrada`

y un porcentaje estimado de avance (0–100%).
