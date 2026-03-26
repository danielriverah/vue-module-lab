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

    <ProductionMonitoringRenderer
      :production="production"
      :detail="detail"
      :preview="normalizedPreview"
      :renderer-data="rendererData"
      :selected-date="selectedDate"
      :rendering="rendering"
      @request-render="onRequestRender"
      @render-ready="onRenderReady"
      @render-error="onRenderError"
    />

    <div class="card-panel amber lighten-5 amber-text text-darken-4 pm-next-panel">
      <strong>Integración parcial:</strong>
      Actions se integrará en la siguiente tarea.
    </div>
  </section>
</template>

<script>
import ProductionMonitoringViewer from './components/ProductionMonitoringViewer.vue';
import ProductionMonitoringRenderer from './components/ProductionMonitoringRenderer.vue';

export default {
  name: 'ProductionMonitoringModule',
  components: {
    ProductionMonitoringViewer,
    ProductionMonitoringRenderer
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
  },
  methods: {
    onRequestRender(payload) {
      this.$emit('request-render', payload);
      this.$emit('render', payload);
    },
    onRenderReady(payload) {
      this.$emit('render-ready', payload);
    },
    onRenderError(payload) {
      this.$emit('render-error', payload);
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
