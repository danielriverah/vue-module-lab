<!-- <template>
    <div>
        <div class="row" style="margin-bottom: 3px;">
            <div class="col s12 card-content-title">
                <small>{{ etapa.orden??0 }}</small> - <strong><small>{{ etapa.estadistico_documento_id??0 }}</small></strong>
                <span
                    class="new badge estatus"
                    :class="estatusColor"
                    data-badge-caption=""
                >
                    {{ etapa.estatus_doc }}
                </span>
                <span class="right grey-text text-darken-1">{{ fechaInicio(etapa.fecha_estimada_inicio) }} - {{ fechaFin(etapa.fecha_estimada_fin) }}</span>
            </div>
            <div class="col s12 card-content-body">
                <strong>{{ etapa.nombre }}</strong>
                <div class="grey-text text-darken-1" style="font-size: 12px;">
                    {{ etapa.observaciones }}
                </div>
                <div class="progress grey lighten-3" v-if="etapa.avance">
                    <div class="determinate green" :style="{ width: etapa.avance }"></div>
                </div>
                <div class="grey-text text-darken-1" style="font-size: 12px;">
                    <a
                    href="#"
                    @click.prevent="verActividadesEtapa"
                    >
                        Actividades: {{ etapa.actividades_ids?.length || 0 }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template> -->
<template>
    <!-- CARD -->
    <div
        v-if="getConfig.type=='card'"
		class="card hoverable"
		:class="{ 'drag-active': draggable }"
		:draggable="draggable"
		@dblclick="onRowDblclick(actividad)"
		@dragstart="onDragStart(actividad, $event)"
	>
		<div class="card-content">
		<div class="row" style="margin-bottom: 0;">
			<div class="col s12 m9">
                <div>
                    <span>{{ actividad.actividad_id }}</span>
                </div>
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
	</div> 
    <div 
        v-else-if="getConfig.type=='full'"
        class="actividad-full"
    >
        <h1>Information data full {{ actividad.actividad_id  }}</h1>
    </div>
    <div 
        v-else-if="getConfig.type=='row'"
    >
        <h1>Information row {{ actividad.actividad_id  }}</h1>
    </div>
    <div 
        v-else
    >
        <h1>Information BIG Card {{ actividad.actividad_id }}</h1>
    </div>
</template>
<script>
    // import ActividadActions from './ActividadActions.vue'
    import ActividadActions from '@/components/modulos/actividades/tractoristas/ActividadActions.vue'
	// import ActividadStatusChip from './ActividadStatusChip.vue'
	import ActividadStatusChip from '@/components/modulos/actividades/tractoristas/ActividadStatusChip.vue'
    import helper from '@/components/helpers/fechas';
    export default{
        name:"Actividad",
        components:{
            ActividadActions,
			ActividadStatusChip
        },
        props:{
            actividad:{
                type:Object,
                required:true
            },
            config:{
                type:Object,
                default:()=>{
                    return {}
                }
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
        data(){
            return{
                nombreEstadistico: 'Estadistico'
            }
        },
        computed:{
            getConfig(){
                return {
                    ...{
                        type:'card', //'card | row | bigCard | edit'
                    },
                    ...this.config
                }
            }
        },
        methods: {
            emitirAccion(tipo, payload = {}) {
                this.$emit('actions', {
                    tipo,
                    actividad: this.actividad,
                    ...payload
                });
            },
			onDragStart(row, event) {
			    if (!this.draggable) return
				event.dataTransfer.effectAllowed = 'move'
				event.dataTransfer.setData('text/plain', String(row.actividad_id))
				//this.emitirAccion('on-drag-start',{event})
				//this.$emit('drag-start', actividad)
			},
			iconoActividad(actividad) {
				if (actividad.estatus === 'TERMINADA') return 'check_circle'
				if (actividad.estatus === 'EN_PROCESO') return 'track_changes'
				return 'agriculture'
			},
			onRowDblclick(row) {
                this.emitirAccion('editar-actividaddbl',row)
				//this.$emit('editar-actividaddbl', row)
			},
			onLigar(row) {
                this.emitirAccion('ligar-actividad',row)
				//this.$emit('ligar-actividad', row)
			},
			onEditar(row) {
				this.emitirAccion('editar-actividad',row)
				//this.$emit('editar-actividad', row)
			},
			onVer(row) {
                this.emitirAccion('ver-actividad',row)
				//this.$emit('ver-actividad', row)
			},
			verEstadistico(row){
                this.emitirAccion('ver-estadistico',row)
				//this.$emit('ver-estadistico',row)
			},
			fechaCorta(fecha){
				if(fecha){
					let r=helper.shortDate(fecha)
                    return r;
				}else{
					return null
				}
			}
		}

    }
    // const defConfig= {
    //             type: 'card',        // ['card','row','full']
    //             viewActividades: true,
    //             addActividad: true
    //         }; 
    // const colors_estatus={pendiente:'red lighten-4',atrasada:'red lighten-1',en_progreso:'orange lighten-3',completada:'green lighten-3',cancelado:'grey lighten-2',omitida:'grey lighten-3'}
    // export default {
    //     name: 'ActividadesProduccionView',
    //     components: { },
    //     props: {
    //         etapa: {
    //             type: Object,
    //             required:true
    //         },
    //         actividades:{
    //             type:Array,
    //             default:()=>{
    //                 return []
    //             }
    //         },
    //         config:{
    //             type: Object,
    //             default:()=>{
    //                 return {}
    //             }
    //         }
    //     },
    //     data() {
    //         return {
    //             localConfig: {},
    //             estatusColor:colors_estatus[this.etapa.estatus_doc]
    //         }
    //     },
    //     computed:{
    //         configs() {
    //             return this.localConfig = {
    //                 ...defConfig,
    //                 ...this.config
    //             };
    //         }
    //     },
    //     methods: {
    //         verActividadesEtapa(){
    //             this.$emit('verActividadesEtapa',this.etapa.estadistico_documento_id);
    //         },
    //         fechaInicio:(fecha)=>{
    //             let res = helper.shortDate(fecha);
    //             return res;
    //         },
    //         fechaFin:(fecha)=>{
    //             let res = helper.shortDate(fecha);
    //             return res;
    //         }
    //     },
    //     watch:{
    //         config:{
    //             immediate: true,
    //             deep:true,
    //             handler(val){
    //                 this.localConfig = {
    //                     //...this.localConfig,// actualiza sobre lo ya configurado
    //                     ...defConfig, // valores por defecto
    //                     ...val
    //                 };
    //             },
    //         }
    //     }
    // }
</script>
<style>
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
.actividad-full{
    width: 100%;
}
    /* .card-content-title, .card-content-body{
        color: black;
    }
    span.badge.estatus{
        color: black;
        font-size: medium;
        font-weight: 400;
        border-radius: 10%;
    } */
</style>