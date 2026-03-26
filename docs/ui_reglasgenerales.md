# UI Reglas Generales

## Objetivo
Definir lineamientos de interfaz para mantener una experiencia **limpia, moderna y minimalista** en todos los módulos UI.

---

## 1) Framework visual obligatorio
- Utilizar **Materialize CSS** como base de estilos y layout.
- Reutilizar clases utilitarias de Materialize antes de crear clases nuevas.
- Evitar mezclar múltiples frameworks de UI en la misma vista.

---

## 2) Principios de diseño (clean / modern / minimal)
1. **Jerarquía clara**
   - Encabezado breve, contenido principal y acciones al final.
2. **Menos ruido visual**
   - Reducir bordes pesados, sombras agresivas y textos redundantes.
3. **Espaciado consistente**
   - Usar separaciones homogéneas (`margin`/`padding`) y grillas claras.
4. **Tipografía legible**
   - Priorizar tamaños y pesos consistentes; evitar más de 2 niveles de énfasis simultáneos.
5. **Color funcional**
   - Colores para estado (éxito, error, advertencia, info), no para decorar.

---

## 3) Estructura recomendada de componente
- `UiCard` o contenedor principal por bloque funcional.
- Encabezado simple con título y contexto mínimo.
- Cuerpo con información esencial y progresiva.
- Área de acciones alineada y compacta.
- Estados vacíos, loading y error visibles y consistentes.

---

## 4) Reglas de interacción
- Botones primarios: una acción principal por vista.
- Botones secundarios: agrupar acciones complementarias.
- Deshabilitar acciones cuando no haya contexto válido.
- Mostrar feedback inmediato en operaciones asíncronas.

---

## 5) Accesibilidad mínima
- Contraste suficiente en texto y controles.
- Etiquetas claras en campos y botones.
- No depender solo de color para comunicar estado.

---

## 6) Regla de implementación
Antes de crear nuevos estilos:
1. Validar si Materialize ya cubre el caso.
2. Si no cubre, crear estilo puntual y reutilizable.
3. Evitar estilos inline salvo casos estrictamente dinámicos.
