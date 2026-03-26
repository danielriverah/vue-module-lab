<template>
  <section class="pm-module">
    <ProductionMonitoringViewer
      :production="production"
      :detail="detail"
      :preview="normalizedPreview"
      :selected-date="selectedDate"
      :loading="loading"
      :error="error"
    />

    <div class="card-panel amber lighten-5 amber-text text-darken-4 pm-next-panel">
      <strong>Integración parcial:</strong>
      Renderer y Actions se integrarán en las siguientes tareas.
    </div>
  </section>
</template>

<script>
import ProductionMonitoringViewer from './components/ProductionMonitoringViewer.vue';

export default {
  name: 'ProductionMonitoringModule',
  components: {
    ProductionMonitoringViewer
  },
  props: {
    production: {
      type: Object,
      required: true
    },
    detail: {
      type: Object,
      default: null
    },
    preview: {
      type: Object,
      default: () => ({})
    },
    rendererData: {
      type: Object,
      default: null
    },
    selectedDate: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    updating: {
      type: Boolean,
      default: false
    },
    rendering: {
      type: Boolean,
      default: false
    },
    savingSvg: {
      type: Boolean,
      default: false
    },
    savingPng: {
      type: Boolean,
      default: false
    },
    error: {
      type: [String, Object],
      default: null
    }
  },
  computed: {
    normalizedPreview() {
      const incoming = this.preview || {};
      return {
        json: Object.assign({ exists: false, url: null, key: null }, incoming.json || {}),
        svg: Object.assign({ exists: false, url: null, key: null }, incoming.svg || {}),
        png: Object.assign({ exists: false, url: null, key: null }, incoming.png || {})
      };
    }
  }
};
</script>

<style scoped>
.pm-module {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pm-next-panel {
  margin: 0;
  border-radius: 10px;
}
</style>
