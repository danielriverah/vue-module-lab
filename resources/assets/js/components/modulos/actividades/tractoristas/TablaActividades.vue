<template>
	<div class="row">
		<div class="col s12" v-if="actividades && actividades.length>0">
			<a href="#" @click.prevent="agregarNuevaActividad" class="btn floating green"><i class="material-icons">add</i></a>
		</div>
		<div
			v-for="actividad in actividades"
			:key="actividad.tractor_actividad_id"
			class="col s12"
		>
			<ActividadC
				:actividad="actividad"
				:draggable="cardDraggable(actividad.actividad_id)"
				:mostrarEtapa="mostrarEtapa"
				:etapasMap="etapasMap"
				:chipActividad="chipActividad"
				:etiquetaActividad="etiquetaActividad"
				@actions="handleActions"
				
			></ActividadC>
		<!-- <div
			class="card hoverable"
			:class="{ 'drag-active': draggable }"
			:draggable="draggable"
			@dblclick="onRowDblclick(actividad)"
			@dragstart="onDragStart(actividad, $event)"
		>
			<div class="card-content">
			<div class="row" style="margin-bottom: 0;">
				<div class="col s12 m9">
				<div class="valign-wrapper">
					<div class="icon-box">
					<i class="material-icons">{{ iconoActividad(actividad) }}</i>
					</div>
					<div>
					<span class="card-title">{{ actividad.nombre }}</span>
					<div class="grey-text text-darken-1" style="font-size: 13px;">
						{{ actividad.descripcion || 'Actividad sin descripción' }}
					</div>
					</div>
				</div>
				</div>
				<div class="col s12 m3 right-align">
				<ActividadStatusChip
					:actividad="actividad"
					:chip-actividad="chipActividad"
					:etiqueta-actividad="etiquetaActividad"
				/>
				</div>
			</div>

			<div class="row" style="margin-bottom: 0;">
				<div class="col s12 m6">
				<div class="meta">
					<i class="material-icons tiny">event</i>
					<span>
					{{ fechaCorta(actividad.fecha_inicio) || '—' }} {{ actividad.fecha_fin ? `- ${fechaCorta(actividad.fecha_fin)}` : '' }}
					</span>
				</div>
				</div>
				<div class="col s12 m6">
				<div class="meta">
					<i class="material-icons tiny">link</i>
					<span v-if="actividad.estadistico_documento_id">
					<a
						href="#"
						@click.prevent="verEstadistico"
					>DOC-{{ nombreEstadistico }}</a>
					</span>
					<span v-else class="grey-text">
					Sin ligar
					</span>
				</div>
				</div>
				<div class="col s12 m6" v-if="mostrarEtapa && actividad.etapa_id">
				<div class="meta">
					<i class="material-icons tiny">layers</i>
					<span class="chip green lighten-4">
					{{ etapasMap[actividad.etapa_id] || 'Etapa' }}
					</span>
				</div>
				</div>
			</div>
			</div>
			<div class="card-action">
			<ActividadActions
				:actividad="actividad"
				@ligar="onLigar"
				@editar="onEditar"
				@ver="onVer"
			/>
			</div>
		</div> -->
		</div>

		<div v-if="!actividades.length" class="col s12">
		<div class="center-align grey-text">
			No hay actividades
		</div>
		</div>
	</div>
</template>

<script>
	import ActividadActions from './ActividadActions.vue'
	import ActividadStatusChip from './ActividadStatusChip.vue'
	import ActividadC from '@/components/modulos/producciones/planes_operativos/Actividades/Actividad.vue'
	import helper from '@/components/helpers/fechas';
	export default {
		name: 'TablaActividades',
		components: { ActividadActions, ActividadStatusChip,ActividadC },
		props: {
			actividades: {
				type: Array,
				required: true
			},
			draggable: {
				type: Boolean,
				default: false
			},
			mostrarEtapa: {
				type: Boolean,
				default: false
			},
			etapasMap: {
				type: Object,
				default: () => ({})
			},
			chipActividad: {
				type: Function,
				required: true
			},
			etiquetaActividad: {
				type: Function,
				required: true
			}
		},
		data() {
			return {
				//nombreEstadistico: 'Estadistico'
			}
		},
		computed: {
			
		},
		methods: {
			cardDraggable(actividadId) {
				const act=this.actividades.find(a=>a.tractor_actividad_id===actividadId)
				const res=(Boolean) (act.estadistico_documento_id??0)==0;
				//console.log(res,act)
				return res;
			},
			handleActions({tipo,actividad}){
				const acciones = {
						'editar-actividaddbl':this.onRowDblclick,
						'ligar-actividad':this.onLigar,
						'editar-actividad':this.onEditar,
						'ver-actividad':this.onVer,
						'ver-estadistico':this.verEstadistico,
						//'on-drag-start': this.onDragStart,
						// ligar: this.onLigar,
						// ver: this.onVer,
						// 'ver-estadistico': this.verEstadistico
					};
					if (acciones[tipo]) {
						acciones[tipo](actividad);
					}
			},
			/*onDragStart(actividad, event) {
				console.log(event)
				if (!this.draggable) return
					// event.dataTransfer.effectAllowed = 'move'
					// event.dataTransfer.setData('text/plain', String(actividad.tractor_actividad_id))
					this.$emit('drag-start', actividad)
			},*/
			iconoActividad(actividad) {
				if (actividad.estatus === 'TERMINADA') return 'check_circle'
				if (actividad.estatus === 'EN_PROCESO') return 'track_changes'
				return 'agriculture'
			},
			onRowDblclick(row) {
				this.$emit('editar-actividad', row)
			},
			onLigar(row) {
				this.$emit('ligar-actividad', row)
			},
			onEditar(row) {
				this.$emit('editar-actividad', row)
			},
			onVer(row) {
				//this.$emit('ver-actividad', row)
				const actividadId=row.tractor_actividad_id??row.actividad_id;
				this.$emit('ver-actividad',actividadId)
			},
			verEstadistico(row){
				this.$emit('ver-estadistico',row)
			},
			agregarNuevaActividad(){
				this.$emit('nueva-actividad')
			},
			fechaCorta(fecha){
				if(fecha){
					return helper.shortDate(fecha)
				}else{
					return null
				}
			}
		}
	}
</script>

<style scoped>
.icon-box {
	width: 44px;
	height: 44px;
	border-radius: 8px;
	background: rgba(46, 125, 50, 0.08);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: #2e7d32;
	margin-right: 12px;
}

.meta {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 13px;
	color: #6b6f6b;
}

.drag-active {
 	 cursor: grab;
}
</style>
