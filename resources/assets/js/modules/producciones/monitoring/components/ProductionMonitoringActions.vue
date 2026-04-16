<template>
	<section class="pm-actions card z-depth-1">
		<div class="card-content">
		<span class="card-title">Production Monitoring Actions</span>

		<div class="row pm-actions-grid">
			<div class="col s12 m4">
			<label class="pm-label" for="pm-selected-date">Fecha de monitoreo</label>
			<span class="bag">{{ localDate }}</span>
			<!-- <input
				id="pm-selected-date"
				class="browser-default"
				type="date"
				:value="localDate"
				:disabled="loading || updating"
				@change="onDateChange"
			/> -->
			</div>

			<div class="col s12 m8 pm-button-group">
				<button v-if="getImagen" class="btn waves-effect waves-light" @click="renderCanvas">
					{{ 'Visualización' }}
				</button>
				<button v-else class="btn" disabled >
					{{ 'Visualización' }}
				</button>
				<button v-if="getImagen && !sendingData" class="btn waves-effect waves-light" @click="saveImagen">
					{{ 'Guardar Imagen' }}
				</button>
				<button v-else class="btn" disabled >
					{{ 'Guardar Imagen' }}
				</button>
				<button v-if="getAllImagen && !sendingData" class="btn waves-effect waves-light" @click="saveAllImagen">
					{{ 'Guardar todo' }}
				</button>
				<button v-else class="btn" disabled >
					{{ 'Guardar todo' }}
				</button>
				<!-- <button class="btn waves-effect waves-light" :disabled="disableUpdate" @click="onUpdate">
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
				</button> -->
			</div>
		</div>
		<div class="pm-status-row">
			<span :class="[statusChipClass(imagenRenderedNat),{'active':tabActive==='imagenRenderedNat'}]" @click="tabActive='imagenRenderedNat'">Natural</span>
			<span :class="[statusChipClass(ImagenVegetation),{'active':tabActive==='ImagenVegetation'}]" @click="tabActive='ImagenVegetation'">Vegetación</span>
			<span :class="[statusChipClass(ImagenNir),{'active':tabActive==='ImagenNir'}]" @click="tabActive='ImagenNir'">NIR</span>
			<span :class="[statusChipClass(ImagenNdvi),{'active':tabActive==='ImagenNdvi'}]" @click="tabActive='ImagenNdvi'">NDVI</span>
			<span :class="[statusChipClass(ImagenAgricredEdge),{'active':tabActive==='ImagenAgricredEdge'}]" @click="tabActive='ImagenAgricredEdge'">Rede</span>
			<span :class="[statusChipClass(ImagenRedEdgeNirRed),{'active':tabActive==='ImagenRedEdgeNirRed'}]" @click="tabActive='ImagenRedEdgeNirRed'">Rede span Red</span>
			<span :class="[statusChipClass(ImagenNdre),{'active':tabActive==='ImagenNdre'}]" @click="tabActive='ImagenNdre'">NDRE</span>
			<span :class="[statusChipClass(ImagennNre2),{'active':tabActive==='ImagennNre2'}]" @click="tabActive='ImagennNre2'">NDRE2</span>
			<span :class="[statusChipClass(ImagenNdmi),{'active':tabActive==='ImagenNdmi'}]" @click="tabActive='ImagenNdmi'">NDMI</span>
			<span :class="[statusChipClass(ImagenEvi),{'active':tabActive==='ImagenEvi'}]" @click="tabActive='ImagenEvi'">EVI</span>
		</div>
		<div>
			<div ref="canvasContainer" class="canvas-container"></div>
		</div>
		</div>
	</section>
</template>

<script>
	export default {
		name: 'ProductionMonitoringActions',
		props: {
			imagenes:{
				type: Object,
				default:{},
			},
			imagenSelected:{
				type: String,
				default:'',
			},
			sendingData:{
				type: Boolean,
				default: false
			},
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
					savingData:false,
					imagenesLocal:this.imagenes,
					tabActive:this.imagenSelected,
					localDate: this.selectedDate,
					localRenderResult: null,
					localRenderError: null,
					imagenRenderedNat:null,
					ImagenVegetation:null,
					ImagenNir:null,
					ImagenNdvi:null,
					ImagenAgricredEdge:null,
					ImagenRedEdgeNirRed:null,
					ImagenNdre:null,
					ImagennNre2:null,
					ImagenNdmi:null,
					ImagenEvi:null,
				};
			},
		computed: {
			getImagen(){
				return this[this.tabActive]
			},
			getAllImagen(){
				if(
					this['imagenRenderedNat'] &&
					this['ImagenVegetation'] &&
					this['ImagenNir'] &&
					this['ImagenNdvi'] &&
					this['ImagenAgricredEdge'] &&
					this['ImagenRedEdgeNirRed'] &&
					this['ImagenNdre'] &&
					this['ImagennNre2'] &&
					this['ImagenNdmi'] &&
					this['ImagenEvi'] 
				)
				return true
				return false;
			},
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
			},
			imagenes(val){
				this.imagenesLocal=val;
			},
			'imagenesLocal.ImagenRenderedNat':{
				immediate: true,
				handler(val){
					console.log(val);
					this.imagenRenderedNat=val?.visual??null;
				}
			},
			'imagenesLocal.ImagenVegetation':{
				immediate: true,
				handler(val){
					this.ImagenVegetation=val?.visual??null;
				}
			},
			'imagenesLocal.ImagenNir':{
				immediate: true,
				handler(val){
					this.ImagenNir=val?.visual??null;
				}
			},
			'imagenesLocal.ImagenNdvi':{
				immediate: true,
				handler(val){
					this.ImagenNdvi=val?.visual??null;
				}
			},
			'imagenesLocal.ImagenAgricredEdge':{
				immediate: true,
				handler(val){
					this.ImagenAgricredEdge=val?.visual??null;
				}
			},
			'imagenesLocal.ImagenRedEdgeNirRed':{
				immediate: true,
				handler(val){
					this.ImagenRedEdgeNirRed=val?.visual??null;
				}
			},
			'imagenesLocal.ImagenNdre':{
				immediate: true,
				handler(val){
					this.ImagenNdre=val?.visual??null;
				}
			},
			'imagenesLocal.ImagennNre2':{
				immediate: true,
				handler(val){
					this.ImagennNre2=val?.visual??null;
				}
			},
			'imagenesLocal.ImagenNdmi':{
				immediate: true,
				handler(val){
					this.ImagenNdmi=val?.visual??null;
				}
			},
			'imagenesLocal.ImagenEvi':{
				immediate: true,
				handler(val){
					this.ImagenEvi=val?.visual??null;
				}
			},
			tabActive:{
				handler(val){
					this.$emit('imagen-change',val)
				}
			},
			imagenSelected:{
				handler(val){
					if (this.tabActive !== val) {
						this.tabActive = val;
					}
				}
			},
		},
		methods: {
			renderCanvas() {
				this.$nextTick(() => {
					const container = this.$refs.canvasContainer;
					console.log(container,this.getImagen)
					if (!container) return;
					container.innerHTML = '';
					if (this.getImagen && this.getImagen.canvas) {
						container.appendChild(this.getImagen.canvas);
					}
				});
			},
			statusChipClass(available) {
			return available
				? 'chip'
				: 'chip disabled';
			},
			onDateChange(event) {
			this.localDate = event.target.value;
			this.$emit('change-date', this.localDate);
			},
			onUpdate() {
			if (this.disableUpdate) return;
			this.$emit('update');
			},
			onRender() {
			if (this.disableRender) return;
			this.$emit('render');
			},
			onSaveSvg() {
			if (this.disableSaveSvg) return;
			this.$emit('save-svg');
			},
			saveImagen() {
				if (!this.getImagen) return;
				this.$emit('save-image',{imagen:this.getImagen,index:this.imagenSelected});
			},
			saveAllImagen() {
				if (!this.getAllImagen) return;
				this.$emit('save-all-images',this.imagenesLocal);
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
	.pm-status-row span{
        border-radius: 10px;
    }
    .pm-status-row span:not(.disabled){
        cursor: pointer;
        background: rgb(177, 252, 229);
        color: rgb(58, 58, 58);
    }
    .pm-status-row span.disabled{
        cursor: no-drop;
        background: rgb(233, 232, 232);
        color: grey;
    }
    .pm-status-row span:not(.disabled):not(.active):hover{
        cursor: pointer;
        background: rgb(140, 213, 255);
        color: #000000;
    }
    .pm-status-row span.active:not(.disabled){
        cursor: pointer;
        background: rgb(140, 213, 255);
        color: #000000;
    }
</style>
