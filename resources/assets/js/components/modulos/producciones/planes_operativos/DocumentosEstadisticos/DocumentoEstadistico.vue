<template>
    <div>
        <!-- <div class="row" style="margin-bottom: 3px;">
            <div class="col s12 card-content-title">
                <small>{{ getEtapas.orden??0 }}</small> - <strong><small>{{ getEtapas.estadistico_documento_id??0 }}</small></strong>
                <span
                    class="new badge estatus"
                    :class="estatusColor"
                    data-badge-caption=""
                >
                    {{ getEtapas.estatus_doc }}
                </span>
                <span class="right grey-text text-darken-1">{{ fechaInicio(getEtapas.fecha_estimada_inicio) }} - {{ fechaFin(getEtapas.fecha_estimada_fin) }}</span>
            </div>
            <div class="col s12 card-content-body">
                <strong>{{ getEtapas.nombre }} <span v-if="etapa.dias_atraso>0" class="text red text-darken-2"><small>Tiene {{ getEtapas.dias_atraso }} dias de atraso</small></span></strong>
                <div class="grey-text text-darken-1" style="font-size: 12px;">
                    {{ getEtapas.observaciones??'Sin Observaciones' }}
                </div>
                <div class="progress grey lighten-3" v-if="etapa.avance">
                    <div class="determinate green" :style="{ width: etapa.avance }"></div>
                </div>
                <div class="grey-text text-darken-1" style="font-size: 12px;">
                    <a
                    href="#"
                    @click.prevent="verActividadesEtapa"
                    >
                        <!-- Actividades: {{ actividadesPorEtapa[etapa.estadistico_documento_id]?.length || 0 }} ->
                        Actividades: {{ actividadesCount }}
                    </a>
                    <button 
                        v-if="permiteAdd"
                        @click.prevent="agregaEtapa(getEtapas)"
                    >
                        <i  class="material-icons" v-tooltip="'Agregar Actividad'">add</i>
                    </button>
                </div>
            </div>
        </div> -->
    </div>
</template>
<script>
    import helper from '@/components/helpers/fechas';
    const defConfig= {
                type: 'card',        // ['card','row','full']
                viewActividades: true,
                addActividad: true
            }; 
    const colors_estatus={pendiente:'red lighten-4',atrasada:'red lighten-1',en_progreso:'orange lighten-3',completada:'green lighten-3',cancelado:'grey lighten-2',omitida:'grey lighten-3'}
    export default {
        name: 'ActividadesProduccionView',
        components: { },
        props: {
            etapa: {
                type: Object,
                required:true
            },
            produccion:{
                type:Object,
                require:true
            },
            actividades:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            catalogos:{
                type:Object,
                default:()=>{
                    return {
                        tractoristas:[]
                    }
                }
            },
            config:{
                type: Object,
                default:()=>{
                    return {}
                }
            }
        },
        data() {
            return {
                formNewAct:{
                    produccion_id:'',
                    estadistico_documento_id:'',
                    tractorista_id:'',
                },
                errors:{},
                localConfig: {},
                
                nueva_Actividad:false,
                c_tractoristas:[],
                empleadoSeleccionado:'',
                empleadosActividad:[],
                etapaLocal:{...this.etapa}
            }
        },
        mounted(){
            // console.log(this.etapa)
            //this.empleadoSeleccionado='DANIEL HERRADA RIVERA'
        },
        computed:{
            getEtapas(){
                return this.etapaLocal;
            },
            actividadesCount(){
                return this.getEtapas.actividades_ids?.length || 0
            },
            configs() {
                return this.localConfig = {
                    ...defConfig,
                    ...this.config
                };
            },
            permiteAdd(){
                return ['atrasada','pendiente',"en_progreso"].includes(this.getEtapas.estatus_doc)
            },
            tractoristas(){
                //console.log(this.catalogos.tractoristas);
                this.c_tractoristas=this.catalogos.tractoristas??[];
                // if(this.c_tractoristas.length==0){
                //     this.consultaTractoristas();
                // }
                return this.c_tractoristas
            },
            
            empleadoEditando() {
                return this.empleadosActividad.find(e => e.editar);
            },
            catEmpleados(){
                return this.catalogos.empleados??[];
            },
            estatusColor(){
                return colors_estatus[this.getEtapas.estatus_doc]
            },

        },
        methods: {
            consultaTractoristas(){
                this.$emit('actualiza-catalogos',['tractoristas'])
                // const uri=this.route('catalogos.actividades_tractor',{'accion':'tractoristas'});
                // $.ajax({
                //     url:uri,
                //     dataType:'json',
                //     success:(res)=>{
                //         console.log(res)
                //         this.catalogos.tractoristas=res.tractoristas;
                //     },
                //     error:()=>{console.log('error consultaTractoristas') }
                // })
            },
            verActividadesEtapa(){
                this.$emit('verActividadesEtapa',this.getEtapas.estadistico_documento_id);
            },
            agregaEtapa(etapa){
                this.$emit('agregar-actividad',etapa)
                //this.nueva_Actividad=true;
                //this.$emit('ver-estadistico',etapa.estadistico_documento_id)
            },
            fechaInicio:(fecha)=>{
                let res = helper.shortDate(fecha);
                return res;
            },
            fechaFin:(fecha)=>{
                let res = helper.shortDate(fecha);
                return res;
            },
            crearActividad(){
                alert('crearActividad');
            },
            
            
            

            
        },
        watch:{
            etapas:{
                inmediate: true,
                deep:true,
                handler(val){
                    this.etapaLocal={ ...this.localForm, ...val };
                },
            },
            config:{
                immediate: true,
                deep:true,
                handler(val){
                    this.localConfig = {
                        //...this.localConfig,// actualiza sobre lo ya configurado
                        ...defConfig, // valores por defecto
                        ...val
                    };
                },
            },
            empleadoSeleccionado(newVal,oldVal){
                const empleado=this.catalogos.tractoristas.find(e=>e.nombre===newVal);
                this.formNewAct.tractorista_id=empleado?.empleado_id??'';
            }
            // catalogos: {
            //     deep: true,
            //     handler(nuevo) {
            //     console.log('Catálogos actualizados', nuevo);
            //     }
            // }
        }
    }
</script>
<style>
    .card-content-title, .card-content-body{
        color: black;
    }
    span.badge.estatus{
        color: black;
        font-size: medium;
        font-weight: 400;
        border-radius: 10%;
    }
    .editable {
        cursor: pointer;
        border-bottom: 1px dashed #999;
    }
    .editable:hover {
        color: #1976d2;
    }
</style>