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

    <ProductionMonitoringActions
      :has-detail="hasDetail"
      :has-json-preview="hasJsonPreview"
      :has-svg-preview="hasSvgPreview"
      :has-png-preview="hasPngPreview"
      :can-render="canRender"
      :can-save-svg="canSaveSvg"
      :can-save-png="canSavePng"
      :loading="loading"
      :updating="updating"
      :rendering="rendering"
      :saving-svg="savingSvg"
      :saving-png="savingPng"
      :selected-date="selectedDate"
      @update="onUpdate"
      @change-date="onChangeDate"
      @render="onRenderAction"
      @save-svg="onSaveSvg"
      @save-png="onSavePng"
      @save-all="onSaveAll"
    />
  </section>
</template>

<script>
import ProductionMonitoringViewer from './components/ProductionMonitoringViewer.vue';
import ProductionMonitoringRenderer from './components/ProductionMonitoringRenderer.vue';
import ProductionMonitoringActions from './components/ProductionMonitoringActions.vue';

export default {
  name: 'ProductionMonitoringModule',
  components: {
    ProductionMonitoringViewer,
    ProductionMonitoringRenderer,
    ProductionMonitoringActions
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
    },
    hasDetail() {
      return !!this.detail && Object.keys(this.detail).length > 0;
    },
    hasJsonPreview() {
      return !!(this.normalizedPreview.json && this.normalizedPreview.json.exists);
    },
    hasSvgPreview() {
      return !!(this.normalizedPreview.svg && this.normalizedPreview.svg.exists);
    },
    hasPngPreview() {
      return !!(this.normalizedPreview.png && this.normalizedPreview.png.exists);
    },
    canRender() {
      return this.hasDetail && !this.rendering;
    },
    canSaveSvg() {
      return !!(this.rendererData && this.rendererData.svgContent) && !this.savingSvg;
    },
    canSavePng() {
      const hasRenderAsset = !!(
        this.rendererData && (this.rendererData.svgContent || this.rendererData.imageUrl)
      );
      return hasRenderAsset && !this.savingPng;
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
    },
    onUpdate() {
      this.$emit('update');
    },
    onChangeDate(value) {
      this.$emit('change-date', value);
    },
    onRenderAction() {
      this.$emit('render', {
        production: this.production,
        detail: this.detail,
        selectedDate: this.selectedDate,
        source: 'actions'
      });
    },
    onSaveSvg() {
      this.$emit('save-svg', {
        selectedDate: this.selectedDate,
        rendererData: this.rendererData,
        detail: this.detail
      });
    },
    onSavePng() {
      this.$emit('save-png', {
        selectedDate: this.selectedDate,
        rendererData: this.rendererData,
        detail: this.detail
      });
    },
    onSaveAll() {
      this.$emit('save-all', {
        selectedDate: this.selectedDate,
        rendererData: this.rendererData,
        detail: this.detail
      });
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
</style>
