<template>
  <span class="chip" :class="chipActividad(actividad)">
    {{ etiquetaActividad(actividad) }}
  </span>
</template>

<script>
export default {
  name: 'ActividadStatusChip',
  props: {
    actividad: {
      type: Object,
      required: true
    },
    chipActividad: {
      type: Function,
      required: true
    },
    etiquetaActividad: {
      type: Function,
      required: true
    }
  }
}
</script>
