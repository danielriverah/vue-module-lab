<template>
  <section class="pm-module">
    <ProductionMonitoringViewer
      :production="normalizedProduction"
      :detail="normalizedDetail"
      :preview="normalizedPreview"
      :renderer-data="effectiveRenderData"
      :selected-date="selectedDate"
      :loading="loading"
      :error="moduleError"
    />

    <ProductionMonitoringRenderer
      :detail="normalizedDetail"
      :preview="normalizedPreview"
      :renderer-data="effectiveRenderData"
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

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function unwrapDynamo(value) {
  if (!isObject(value)) return value;
  if (Object.prototype.hasOwnProperty.call(value, 'S')) return value.S;
  if (Object.prototype.hasOwnProperty.call(value, 'N')) {
    const parsed = Number(value.N);
    return Number.isNaN(parsed) ? value.N : parsed;
  }
  if (Object.prototype.hasOwnProperty.call(value, 'BOOL')) return !!value.BOOL;
  if (Object.prototype.hasOwnProperty.call(value, 'L')) return (value.L || []).map(unwrapDynamo);
  if (Object.prototype.hasOwnProperty.call(value, 'M')) {
    const out = {};
    Object.keys(value.M || {}).forEach((k) => {
      out[k] = unwrapDynamo(value.M[k]);
    });
    return out;
  }
  const out = {};
  Object.keys(value).forEach((k) => {
    out[k] = unwrapDynamo(value[k]);
  });
  return out;
}

function parseMysqlPolygon(value) {
  if (!value || typeof value !== 'string') return [];
  return value.split('|').map((pair) => {
    const coords = pair.split(',').map((n) => Number(String(n).trim()));
    if (coords.length < 2 || Number.isNaN(coords[0]) || Number.isNaN(coords[1])) return null;
    return { lat: coords[0], lng: coords[1] };
  }).filter(Boolean);
}

function normalizePolygon(rawPolygon) {
  if (!rawPolygon) return null;
  if (isObject(rawPolygon) && rawPolygon.type === 'Polygon') return rawPolygon;
  if (!Array.isArray(rawPolygon)) return null;
  const ring = rawPolygon.map((point) => {
    if (!Array.isArray(point) || point.length < 2) return null;
    const lat = Number(point[0]);
    const lng = Number(point[1]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return [lng, lat];
  }).filter(Boolean);
  if (!ring.length) return null;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) ring.push([first[0], first[1]]);
  return { type: 'Polygon', coordinates: [ring] };
}

function bboxToPolygon(bbox) {
  if (!Array.isArray(bbox) || bbox.length < 4) return null;
  const minLon = Number(bbox[0]);
  const minLat = Number(bbox[1]);
  const maxLon = Number(bbox[2]);
  const maxLat = Number(bbox[3]);
  if ([minLon, minLat, maxLon, maxLat].some(Number.isNaN)) return null;
  return {
    type: 'Polygon',
    coordinates: [[
      [minLon, minLat],
      [maxLon, minLat],
      [maxLon, maxLat],
      [minLon, maxLat],
      [minLon, minLat]
    ]]
  };
}

function normalizeProduction(rawProduction) {
  const production = unwrapDynamo(rawProduction || {});
  const pbox = production && production.pbox ? production.pbox : null;
  return Object.assign({}, production, {
    poligono_points: parseMysqlPolygon(production && production.poligono),
    pbox_polygon: normalizePolygon(pbox && pbox.puntos_bbox) || bboxToPolygon(pbox && pbox.pbox)
  });
}

function normalizeDetail(rawDetail) {
  const detail = unwrapDynamo(rawDetail || {});
  return Object.assign({}, detail, {
    polygon: normalizePolygon(detail.polygon),
    bbox_polygon: bboxToPolygon(detail.bbox)
  });
}

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
  data() {
    return {
      localRenderResult: null,
      localRenderError: null
    };
  },
  computed: {
    normalizedPreview() {
      const incoming = this.preview || {};
      const fromDetail = this.normalizedDetail || {};
      return {
        json: Object.assign({ exists: false, url: null, key: null }, incoming.json || {}, {
          url: (incoming.json && incoming.json.url) || fromDetail.preview_json || null,
          exists: (incoming.json && incoming.json.exists) || !!fromDetail.preview_json
        }),
        svg: Object.assign({ exists: false, url: null, key: null }, incoming.svg || {}, {
          url: (incoming.svg && incoming.svg.url) || fromDetail.preview_svg || null,
          exists: (incoming.svg && incoming.svg.exists) || !!fromDetail.preview_svg
        }),
        png: Object.assign({ exists: false, url: null, key: null }, incoming.png || {}, {
          url: (incoming.png && incoming.png.url) || fromDetail.preview_image || null,
          exists: (incoming.png && incoming.png.exists) || !!fromDetail.preview_image
        })
      };
    },
    normalizedProduction() {
      return normalizeProduction(this.production);
    },
    normalizedDetail() {
      return normalizeDetail(this.detail);
    },
    effectiveRenderData() {
      return this.rendererData || this.localRenderResult || null;
    },
    moduleError() {
      return this.error || this.localRenderError;
    },
    hasDetail() {
      return !!this.normalizedDetail && Object.keys(this.normalizedDetail).length > 0;
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
      return !!(this.effectiveRenderData && this.effectiveRenderData.svgContent) && !this.savingSvg;
    },
    canSavePng() {
      const hasRenderAsset = !!(
        this.effectiveRenderData &&
        (this.effectiveRenderData.svgContent || this.effectiveRenderData.imageUrl || this.effectiveRenderData.pngSource)
      );
      return hasRenderAsset && !this.savingPng;
    }
  },
  watch: {
    rendererData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.localRenderResult = null;
        }
      }
    },
    selectedDate() {
      this.localRenderError = null;
    }
  },
  methods: {
    basePayload() {
      return {
        production: this.normalizedProduction,
        detail: this.normalizedDetail,
        selectedDate: this.selectedDate,
        rendererData: this.effectiveRenderData
      };
    },
    onRequestRender(payload) {
      this.$emit('request-render', payload);
      this.$emit('render', payload);
    },
    onRenderReady(payload) {
      this.localRenderResult = payload;
      this.localRenderError = null;
      this.$emit('render-ready', payload);
    },
    onRenderError(payload) {
      this.localRenderError = payload;
      this.$emit('render-error', payload);
    },
    onUpdate() {
      this.$emit('update');
    },
    onChangeDate(value) {
      this.$emit('change-date', value);
    },
    onRenderAction() {
      this.$emit('render', Object.assign({ source: 'actions' }, this.basePayload()));
    },
    onSaveSvg() {
      this.$emit('save-svg', this.basePayload());
    },
    onSavePng() {
      this.$emit('save-png', this.basePayload());
    },
    onSaveAll() {
      const payload = Object.assign({ source: 'actions-save-all' }, this.basePayload());
      this.$emit('save-all', payload);
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
