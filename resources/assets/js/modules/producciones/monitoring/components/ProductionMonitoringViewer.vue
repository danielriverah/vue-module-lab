<template>
  <section class="pm-viewer">
    <div class="card z-depth-1 pm-card">
      <div class="card-content">
        <div class="pm-header-row">
          <div>
            <span class="card-title">Production Monitoring Viewer</span>
            <p class="grey-text text-darken-1 pm-subtitle">
              Visualización de producción, detalle y previews por fecha.
            </p>
          </div>
          <span class="chip teal lighten-5 teal-text text-darken-3" v-if="selectedDate">
            Fecha: {{ selectedDate }}
          </span>
        </div>

        <div v-if="loading" class="pm-state-block">
          <div class="progress">
            <div class="indeterminate"></div>
          </div>
          <p class="grey-text text-darken-1">Cargando información de monitoreo...</p>
        </div>

        <div v-else-if="hasError" class="pm-state-block card-panel red lighten-5 red-text text-darken-4">
          {{ errorMessage }}
        </div>

        <div v-else-if="!hasProduction && !hasDetail" class="pm-state-block card-panel grey lighten-4 grey-text text-darken-2">
          No hay datos disponibles para mostrar en este momento.
        </div>

        <div v-else class="row">
          <div class="col s12 l6">
            <div class="card-panel pm-panel">
              <h6 class="pm-panel-title">Producción</h6>
              <ul class="browser-default pm-list" v-if="hasProduction">
                <li><strong>Folio:</strong> {{ getValue(production.folio) }}</li>
                <li><strong>ID Producción:</strong> {{ getValue(production.produccion_id) }}</li>
                <li><strong>Estatus:</strong> {{ getValue(production.estatus) }}</li>
                <li><strong>Fecha siembra:</strong> {{ getValue(production.fecha_siembra) }}</li>
                <li><strong>Última fecha consultada:</strong> {{ getValue(production.ultima_fecha_consultada) }}</li>
                <li><strong>Días máx. monitoreo:</strong> {{ getValue(production.dias_max_monitoreo) }}</li>
              </ul>
              <p v-else class="grey-text text-darken-1">Sin información de producción.</p>
            </div>
          </div>

          <div class="col s12 l6">
            <div class="card-panel pm-panel">
              <h6 class="pm-panel-title">Detalle de escena</h6>
              <ul class="browser-default pm-list" v-if="hasDetail">
                <li><strong>Fecha escena:</strong> {{ getValue(detail.fecha) }}</li>
                <li><strong>Clave:</strong> {{ getValue(detail.clave) }}</li>
                <li><strong>Cloud cover:</strong> {{ getValue(detail.cloud_cover) }}</li>
                <li><strong>Colección:</strong> {{ getValue(detail.collection) }}</li>
                <li><strong>Procesado:</strong> {{ getValue(detail.procesado) }}</li>
                <li><strong>Renderizado:</strong> {{ getValue(detail.renderizado) }}</li>
              </ul>
              <p v-else class="grey-text text-darken-1">No existe detalle para la fecha seleccionada.</p>
            </div>
          </div>

          <div class="col s12">
            <div class="card-panel pm-panel">
              <h6 class="pm-panel-title">Estado de previews</h6>

              <div class="row pm-preview-status-row">
                <div class="col s12 m4">
                  <div class="pm-preview-status">
                    <span>JSON</span>
                    <span :class="statusChipClass(hasJsonPreview)">{{ hasJsonPreview ? 'Disponible' : 'No disponible' }}</span>
                  </div>
                </div>
                <div class="col s12 m4">
                  <div class="pm-preview-status">
                    <span>SVG</span>
                    <span :class="statusChipClass(hasSvgPreview)">{{ hasSvgPreview ? 'Disponible' : 'No disponible' }}</span>
                  </div>
                </div>
                <div class="col s12 m4">
                  <div class="pm-preview-status">
                    <span>PNG</span>
                    <span :class="statusChipClass(hasPngPreview)">{{ hasPngPreview ? 'Disponible' : 'No disponible' }}</span>
                  </div>
                </div>
              </div>

              <div class="pm-preview-view" v-if="hasPngPreview">
                <img :src="preview.png.url" alt="Preview PNG" class="responsive-img z-depth-1 pm-preview-image" />
              </div>

              <div class="pm-preview-view" v-else-if="hasSvgPreview && preview.svg.url">
                <object :data="preview.svg.url" type="image/svg+xml" class="pm-preview-svg">
                  Tu navegador no soporta vista previa SVG embebida.
                </object>
              </div>

              <p v-else class="grey-text text-darken-1 pm-empty-preview">
                No existe preview visual persistido para esta fecha.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ProductionMonitoringViewer',
  props: {
    production: {
      type: Object,
      default: null
    },
    detail: {
      type: Object,
      default: null
    },
    preview: {
      type: Object,
      default: () => ({
        json: { exists: false, url: null, key: null },
        svg: { exists: false, url: null, key: null },
        png: { exists: false, url: null, key: null }
      })
    },
    selectedDate: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: [String, Object],
      default: null
    }
  },
  computed: {
    hasProduction() {
      return !!this.production && Object.keys(this.production).length > 0;
    },
    hasDetail() {
      return !!this.detail && Object.keys(this.detail).length > 0;
    },
    hasJsonPreview() {
      return !!this.preview?.json?.exists;
    },
    hasSvgPreview() {
      return !!this.preview?.svg?.exists;
    },
    hasPngPreview() {
      return !!this.preview?.png?.exists;
    },
    hasError() {
      return !!this.error;
    },
    errorMessage() {
      if (!this.error) {
        return '';
      }
      if (typeof this.error === 'string') {
        return this.error;
      }
      return this.error.message || 'Ocurrió un error al cargar la información.';
    }
  },
  methods: {
    getValue(value) {
      if (value === null || value === undefined || value === '') {
        return '—';
      }
      return value;
    },
    statusChipClass(available) {
      return available
        ? 'new badge green lighten-4 green-text text-darken-3 pm-badge'
        : 'new badge grey lighten-3 grey-text text-darken-2 pm-badge';
    }
  }
};
</script>

<style scoped>
.pm-viewer {
  width: 100%;
}

.pm-card {
  border-radius: 12px;
}

.pm-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.pm-subtitle {
  margin: 0;
}

.pm-state-block {
  margin-top: 12px;
}

.pm-panel {
  border-radius: 10px;
  margin-bottom: 12px;
}

.pm-panel-title {
  margin-top: 0;
  margin-bottom: 12px;
  font-weight: 600;
}

.pm-list {
  margin: 0;
  padding-left: 18px;
}

.pm-list li {
  margin-bottom: 6px;
}

.pm-preview-status-row {
  margin-bottom: 10px;
}

.pm-preview-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 8px;
  background: #fafafa;
}

.pm-badge {
  position: static;
  float: none;
  margin: 0;
  min-width: auto;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  border-radius: 12px;
}

.pm-preview-view {
  margin-top: 12px;
}

.pm-preview-image,
.pm-preview-svg {
  width: 100%;
  min-height: 220px;
  border-radius: 10px;
  background: #f5f5f5;
}

.pm-empty-preview {
  margin-top: 10px;
}
</style>
