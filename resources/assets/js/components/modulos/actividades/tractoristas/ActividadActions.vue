<template>
  <div class="actividad-acciones">
    <a
      v-if="!actividad.estadistico_documento_id"
      class="btn-small purple"
      @click.stop="$emit('ligar', actividad)"
    >
      Ligar
    </a>
    <a
      v-if="actividad.estatus !== 'TERMINADA'"
      class="btn-small blue"
      @click.stop="$emit('editar', actividad)"
    >
      Editar
    </a>
    <a
      class="btn-small grey"
      @click.stop="$emit('ver', actividad)"
    >
      Ver
    </a>
  </div>
</template>

<script>
export default {
  name: 'ActividadActions',
  props: {
    actividad: {
      type: Object,
      required: true
    }
  }
}
</script>
