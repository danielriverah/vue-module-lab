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

          <div class="col s12">
            <div class="card-panel pm-panel">
              <h6 class="pm-panel-title">Mapa + lecturas satelitales</h6>
              <div class="row">
                <div class="col s12 l7">
                  <div class="pm-map-canvas">
                    <GmapMap
                      :center="mapCenter"
                      :zoom="16"
                      :map-type-id="'satellite'"
                      style="height: 320px; width: 100%; border-radius: 8px;"
                    >
                      <GmapPolygon
                        v-if="monitoringAreaPaths.length"
                        :paths="monitoringAreaPaths"
                        :options="monitoringAreaOptions"
                      />
                      <GmapPolygon
                        v-if="productionPolygonPaths.length"
                        :paths="productionPolygonPaths"
                        :options="productionPolygonOptions"
                      />
                      <GmapPolygon
                        v-if="monitoredPolygonPaths.length"
                        :paths="monitoredPolygonPaths"
                        :options="monitoredPolygonOptions"
                      />
                    </GmapMap>
                    <p class="pm-map-note">
                      Área monitoreada + polígono base. Se usa para preparar la imagen final por screenshot.
                    </p>
                  </div>
                </div>
                <div class="col s12 l5">
                  <table class="striped highlight responsive-table pm-reading-table">
                    <thead>
                      <tr>
                        <th>Lectura</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, idx) in satelliteReadings" :key="item.label + '-' + idx">
                        <td>{{ item.label }}</td>
                        <td>{{ item.value }}</td>
                      </tr>
                      <tr v-if="satelliteReadings.length === 0">
                        <td colspan="2" class="grey-text text-darken-1">Sin lecturas satelitales disponibles.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="col s12">
            <div class="card-panel pm-panel">
              <h6 class="pm-panel-title">Screenshots / imágenes de monitoreo</h6>
              <div class="pm-shot-grid">
                <img
                  v-for="(shot, index) in screenshotImages"
                  :key="shot.url + '-' + index"
                  :src="shot.url"
                  :alt="shot.label"
                  class="z-depth-1 pm-shot-image"
                />
                <p v-if="screenshotImages.length === 0" class="grey-text text-darken-1">
                  No hay screenshots disponibles aún.
                </p>
              </div>
            </div>
          </div>

          <div class="col s12">
            <div class="card-panel pm-panel">
              <h6 class="pm-panel-title">JSON de monitoreo (opcional)</h6>
              <details class="pm-json-wrapper">
                <summary>Ver JSON</summary>
                <pre class="pm-json-content">{{ monitoringJson }}</pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue';

const FallbackMap = {
  name: 'FallbackMap',
  functional: true,
  render(createElement, context) {
    return createElement('div', {
      staticClass: 'pm-map-fallback'
    }, context.children);
  }
};

const FallbackPolygon = {
  name: 'FallbackPolygon',
  functional: true,
  render(createElement) {
    return createElement();
  }
};

export default {
  name: 'ProductionMonitoringViewer',
  components: {
    GmapMap: Vue.options.components.GmapMap || FallbackMap,
    GmapPolygon: Vue.options.components.GmapPolygon || FallbackPolygon
  },
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
      return !!(this.preview && this.preview.json && this.preview.json.exists);
    },
    hasSvgPreview() {
      return !!(this.preview && this.preview.svg && this.preview.svg.exists);
    },
    hasPngPreview() {
      return !!(this.preview && this.preview.png && this.preview.png.exists);
    },
    hasError() {
      return !!this.error;
    },
    detailPolygonPaths() {
      const polygon = this.detail && this.detail.polygon ? this.detail.polygon : null;
      return this.polygonToMapPaths(polygon);
    },
    productionPolygonPaths() {
      if (this.production && Array.isArray(this.production.poligono_points) && this.production.poligono_points.length) {
        return this.production.poligono_points;
      }
      const polygon = this.production && this.production.polygon ? this.production.polygon : null;
      return this.polygonToMapPaths(polygon);
    },
    monitoringAreaPaths() {
      const detailBbox = this.detail && this.detail.bbox_polygon ? this.detail.bbox_polygon : null;
      const productionPbox = this.production && this.production.pbox_polygon ? this.production.pbox_polygon : null;
      return this.polygonToMapPaths(detailBbox || productionPbox);
    },
    monitoredPolygonPaths() {
      const feature = this.rendererData &&
        this.rendererData.geojson &&
        this.rendererData.geojson.features &&
        this.rendererData.geojson.features[0];

      const polygon = feature && feature.geometry ? feature.geometry : null;
      return this.polygonToMapPaths(polygon);
    },
    mapCenter() {
      const points = this.monitoredPolygonPaths.length
        ? this.monitoredPolygonPaths
        : (this.productionPolygonPaths.length ? this.productionPolygonPaths : this.monitoringAreaPaths);

      if (!points.length) {
        return { lat: 23.6345, lng: -102.5528 };
      }

      const lat = points.reduce((acc, item) => acc + item.lat, 0) / points.length;
      const lng = points.reduce((acc, item) => acc + item.lng, 0) / points.length;
      return { lat, lng };
    },
    detailPolygonOptions() {
      return {
        strokeColor: '#1e88e5',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#42a5f5',
        fillOpacity: 0.25,
        clickable: false
      };
    },
    monitoringAreaOptions() {
      return {
        strokeColor: '#ef6c00',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#ffcc80',
        fillOpacity: 0.15,
        clickable: false
      };
    },
    productionPolygonOptions() {
      return {
        strokeColor: '#1565c0',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#90caf9',
        fillOpacity: 0.3,
        clickable: false
      };
    },
    monitoredPolygonOptions() {
      return {
        strokeColor: '#2e7d32',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#66bb6a',
        fillOpacity: 0.35,
        clickable: false
      };
    },
    satelliteReadings() {
      const readings = this.rendererData && Array.isArray(this.rendererData.readings)
        ? this.rendererData.readings
        : [];
      return readings;
    },
    screenshotImages() {
      const images = [];
      if (this.preview && this.preview.png && this.preview.png.url) {
        images.push({ label: 'Preview PNG persistido', url: this.preview.png.url });
      }
      if (this.rendererData && this.rendererData.imageUrl) {
        images.push({ label: 'Render temporal', url: this.rendererData.imageUrl });
      }
      if (!images.length && this.hasDetail) {
        images.push({
          label: 'Previsualización generada local (sin render persistido)',
          url: this.buildPendingRenderImage()
        });
      }
      return images;
    },
    monitoringJson() {
      const payload = {
        detail: this.detail || null,
        preview: this.preview || null,
        rendererData: this.rendererData || null
      };
      return JSON.stringify(payload, null, 2);
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
    },
    polygonToMapPaths(polygon) {
      if (!polygon || !polygon.coordinates || !Array.isArray(polygon.coordinates[0])) {
        return [];
      }

      return polygon.coordinates[0]
        .map((point) => ({
          lng: point[0],
          lat: point[1]
        }));
    },
    buildPendingRenderImage() {
      const title = this.detail && this.detail.clave ? this.detail.clave : 'Sin escena';
      const date = this.detail && this.detail.fecha ? this.detail.fecha : (this.selectedDate || 'Sin fecha');
      const svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 320">',
        '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#eceff1"/><stop offset="100%" stop-color="#cfd8dc"/></linearGradient></defs>',
        '<rect width="640" height="320" fill="url(#g)"/>',
        '<text x="24" y="48" font-size="24" fill="#263238" font-family="Arial">Monitoring pendiente de render</text>',
        '<text x="24" y="86" font-size="18" fill="#37474f" font-family="Arial">Escena: ' + title + '</text>',
        '<text x="24" y="116" font-size="18" fill="#37474f" font-family="Arial">Fecha: ' + date + '</text>',
        '<text x="24" y="158" font-size="16" fill="#455a64" font-family="Arial">Sin preview PNG/SVG persistido aún.</text>',
        '<text x="24" y="188" font-size="16" fill="#455a64" font-family="Arial">Puedes generar imagen desde acciones del módulo.</text>',
        '</svg>'
      ].join('');

      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
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

.pm-map-canvas {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 8px;
  background: #fafafa;
}

.pm-map-fallback {
  height: 320px;
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(180deg, #eceff1, #f5f5f5);
}

.pm-map-note {
  margin: 8px 0 0;
  font-size: 0.85rem;
  color: #616161;
}

.pm-reading-table {
  font-size: 0.9rem;
}

.pm-shot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.pm-shot-image {
  width: 100%;
  min-height: 150px;
  border-radius: 8px;
  background: #f5f5f5;
  object-fit: cover;
}

.pm-json-wrapper summary {
  cursor: pointer;
  font-weight: 600;
}

.pm-json-content {
  margin-top: 10px;
  max-height: 280px;
  overflow: auto;
  background: #263238;
  color: #eceff1;
  padding: 10px;
  border-radius: 8px;
}
</style>
