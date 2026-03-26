<template>
  <section class="pm-actions card z-depth-1">
    <div class="card-content">
      <span class="card-title">Production Monitoring Actions</span>

      <div class="row pm-actions-grid">
        <div class="col s12 m4">
          <label class="pm-label" for="pm-selected-date">Fecha de monitoreo</label>
          <input
            id="pm-selected-date"
            class="browser-default"
            type="date"
            :value="localDate"
            :disabled="loading || updating"
            @change="onDateChange"
          />
        </div>

        <div class="col s12 m8 pm-button-group">
          <button class="btn waves-effect waves-light" :disabled="disableUpdate" @click="onUpdate">
            {{ updating ? 'Actualizando...' : 'Actualizar' }}
          </button>

          <button class="btn teal waves-effect waves-light" :disabled="disableRender" @click="onRender">
            {{ rendering ? 'Generando...' : 'Generar vista' }}
          </button>

          <button class="btn blue waves-effect waves-light" :disabled="disableSaveSvg" @click="onSaveSvg">
            {{ savingSvg ? 'Guardando SVG...' : 'Guardar SVG' }}
          </button>

          <button class="btn indigo waves-effect waves-light" :disabled="disableSavePng" @click="onSavePng">
            {{ savingPng ? 'Guardando PNG...' : 'Guardar PNG' }}
          </button>

          <button class="btn green waves-effect waves-light" :disabled="disableSaveAll" @click="onSaveAll">
            Guardar todo
          </button>
        </div>
      </div>

      <div class="pm-status-row">
        <span :class="statusChipClass(hasDetail)">Detalle {{ hasDetail ? 'OK' : 'No disponible' }}</span>
        <span :class="statusChipClass(hasJsonPreview)">JSON {{ hasJsonPreview ? 'OK' : 'No' }}</span>
        <span :class="statusChipClass(hasSvgPreview)">SVG {{ hasSvgPreview ? 'OK' : 'No' }}</span>
        <span :class="statusChipClass(hasPngPreview)">PNG {{ hasPngPreview ? 'OK' : 'No' }}</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ProductionMonitoringActions',
  props: {
    hasDetail: {
      type: Boolean,
      default: false
    },
    hasJsonPreview: {
      type: Boolean,
      default: false
    },
    hasSvgPreview: {
      type: Boolean,
      default: false
    },
    hasPngPreview: {
      type: Boolean,
      default: false
    },
    canRender: {
      type: Boolean,
      default: false
    },
    canSaveSvg: {
      type: Boolean,
      default: false
    },
    canSavePng: {
      type: Boolean,
      default: false
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
    selectedDate: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      localDate: this.selectedDate
    };
  },
  computed: {
    disableUpdate() {
      return this.loading || this.updating;
    },
    disableRender() {
      return this.loading || this.updating || this.rendering || !this.canRender;
    },
    disableSaveSvg() {
      return this.loading || this.savingSvg || !this.canSaveSvg;
    },
    disableSavePng() {
      return this.loading || this.savingPng || !this.canSavePng;
    },
    disableSaveAll() {
      return this.disableSaveSvg || this.disableSavePng;
    }
  },
  watch: {
    selectedDate(val) {
      this.localDate = val;
    }
  },
  methods: {
    statusChipClass(available) {
      return available
        ? 'chip green lighten-4 green-text text-darken-3'
        : 'chip grey lighten-3 grey-text text-darken-2';
    },
    onDateChange(event) {
      this.localDate = event.target.value;
      this.$emit('change-date', this.localDate);
    },
    onUpdate() {
      this.$emit('update');
    },
    onRender() {
      this.$emit('render');
    },
    onSaveSvg() {
      this.$emit('save-svg');
    },
    onSavePng() {
      this.$emit('save-png');
    },
    onSaveAll() {
      this.$emit('save-all');
    }
  }
};
</script>

<style scoped>
.pm-actions {
  border-radius: 12px;
}

.pm-actions-grid {
  margin-bottom: 8px;
}

.pm-label {
  display: block;
  margin-bottom: 6px;
  color: #424242;
  font-size: 0.9rem;
}

.pm-button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: flex-end;
}

.pm-button-group .btn {
  min-width: 132px;
}

.pm-status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}
</style>
