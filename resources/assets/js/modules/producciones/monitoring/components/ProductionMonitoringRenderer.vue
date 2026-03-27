<template>
  <section class="pm-renderer card z-depth-1">
    <div class="card-content">
      <div class="pm-header">
        <span class="card-title">Production Monitoring Renderer</span>
        <span class="chip blue lighten-5 blue-text text-darken-3" v-if="selectedDate">
          Fecha: {{ selectedDate }}
        </span>
      </div>

      <div v-if="rendering" class="pm-state">
        <div class="progress"><div class="indeterminate"></div></div>
        <p class="grey-text text-darken-1">Generando visualización temporal...</p>
      </div>

      <div v-else-if="availabilityCase === 'A'" class="card-panel green lighten-5 green-text text-darken-4 pm-state">
        Caso A: existe PNG persistido. No se requiere render temporal.
      </div>

      <div v-else-if="renderError" class="card-panel red lighten-5 red-text text-darken-4 pm-state">
        {{ renderError }}
      </div>

      <div v-else-if="availabilityCase === 'B'" class="pm-state">
        <p class="green-text text-darken-3">Caso B: hay datos para render temporal.</p>

        <div v-if="renderOutput.imageUrl" class="pm-preview">
          <img :src="renderOutput.imageUrl" alt="Render temporal" class="responsive-img z-depth-1 pm-image" />
        </div>

        <div v-else-if="renderOutput.svgContent" class="pm-preview">
          <div class="pm-svg" v-html="renderOutput.svgContent"></div>
        </div>

        <div v-else class="card-panel grey lighten-4 grey-text text-darken-2 pm-preview">
          Render temporal listo, sin salida visual final disponible.
        </div>
      </div>

      <div v-else-if="availabilityCase === 'C'" class="card-panel amber lighten-5 amber-text text-darken-4 pm-state">
        Caso C: no hay PNG ni datos renderizables. Se emite `request-render` al padre.
      </div>

      <div v-else class="card-panel grey lighten-4 grey-text text-darken-2 pm-state">
        Sin detalle para renderizar en la fecha seleccionada.
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ProductionMonitoringRenderer',
  props: {
    detail: { type: Object, default: null },
    preview: { type: Object, default: () => ({}) },
    rendererData: { type: Object, default: null },
    selectedDate: { type: String, default: null },
    rendering: { type: Boolean, default: false }
  },
  data() {
    return {
      renderOutput: {
        svgContent: null,
        imageUrl: null,
        metadata: null
      },
      renderError: null,
      lastRequestSignature: null
    };
  },
  computed: {
    hasDetail() {
      return !!this.detail && Object.keys(this.detail).length > 0;
    },
    hasPngPreview() {
      return !!(this.preview && this.preview.png && this.preview.png.exists);
    },
    hasJsonPreview() {
      return !!(this.preview && this.preview.json && this.preview.json.exists);
    },
    hasRenderableData() {
      const data = this.rendererData || {};
      return !!(data.svgContent || data.imageUrl || data.geojson || this.hasJsonPreview);
    },
    canRequestRender() {
      return this.hasDetail && !this.hasPngPreview && !this.hasRenderableData;
    },
    availabilityCase() {
      if (!this.hasDetail) return 'NONE';
      if (this.hasPngPreview) return 'A';
      if (this.hasRenderableData) return 'B';
      if (this.canRequestRender) return 'C';
      return 'NONE';
    }
  },
  watch: {
    detail: {
      immediate: true,
      deep: true,
      handler() {
        this.evaluateRenderCase();
      }
    },
    preview: {
      immediate: true,
      deep: true,
      handler() {
        this.evaluateRenderCase();
      }
    },
    rendererData: {
      immediate: true,
      deep: true,
      handler() {
        this.evaluateRenderCase();
      }
    },
    selectedDate() {
      this.evaluateRenderCase();
    }
  },
  methods: {
    evaluateRenderCase() {
      this.renderError = null;

      if (this.availabilityCase === 'A') {
        this.lastRequestSignature = null;
        this.renderOutput = { svgContent: null, imageUrl: null, metadata: { source: 'png-preview' } };
        return;
      }

      if (this.availabilityCase === 'B') {
        this.lastRequestSignature = null;
        this.prepareRenderOutput();
        return;
      }

      if (this.availabilityCase === 'C') {
        this.renderOutput = { svgContent: null, imageUrl: null, metadata: null };
        this.emitRequestRender();
        return;
      }

      this.renderOutput = { svgContent: null, imageUrl: null, metadata: null };
    },
    prepareRenderOutput() {
      try {
        const data = this.rendererData || {};
        const fallbackSvg = this.hasJsonPreview
          ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 120"><rect width="420" height="120" fill="#f5f5f5"/><text x="20" y="65" fill="#424242" font-size="16">JSON disponible: listo para render definitivo</text></svg>'
          : null;

        const payload = {
          svgContent: data.svgContent || fallbackSvg,
          imageUrl: data.imageUrl || null,
          pngSource: data.imageUrl || null,
          metadata: {
            detailId: this.detail && this.detail.id ? this.detail.id : null,
            selectedDate: this.selectedDate,
            source: data.svgContent || data.imageUrl ? 'rendererData' : 'preview-json'
          }
        };

        this.renderOutput = {
          svgContent: payload.svgContent,
          imageUrl: payload.imageUrl,
          metadata: payload.metadata
        };

        this.$emit('render-ready', payload);
      } catch (error) {
        const message = error && error.message ? error.message : 'Error al preparar render temporal.';
        this.renderError = message;
        this.$emit('render-error', {
          message,
          selectedDate: this.selectedDate,
          detail: this.detail
        });
      }
    },
    emitRequestRender() {
      const signature = [
        this.selectedDate || '',
        this.detail && this.detail.id ? this.detail.id : '',
        this.detail && this.detail.clave ? this.detail.clave : ''
      ].join('|');

      if (this.lastRequestSignature === signature) {
        return;
      }

      this.lastRequestSignature = signature;
      this.$emit('request-render', {
        detail: this.detail,
        selectedDate: this.selectedDate,
        reason: 'missing-preview-and-render-data'
      });
    }
  }
};
</script>

<style scoped>
.pm-renderer {
  border-radius: 12px;
}

.pm-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.pm-state {
  margin-top: 12px;
}

.pm-preview {
  margin-top: 10px;
}

.pm-image,
.pm-svg {
  width: 100%;
  min-height: 180px;
  border-radius: 10px;
  background: #f5f5f5;
}

.pm-svg svg {
  width: 100%;
  height: auto;
}
</style>
