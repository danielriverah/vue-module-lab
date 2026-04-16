<template>
    <div>
        <!-- <ul>
            <TimeLineLista
                    :value="estadisticosLocal"
                    :ghosts="ghostsLocal"
                    :selectedEtapas="selectedEtapas"
                    :actividadModulosConceptos="actividadModulosConceptos"

                    @cambiar-estatus="cambiarEstatus"
                    @etapa-actions="etapaActions"
                    @etapa-link-actions="etapafolioActions"
                    @select-item="selectItem"
                ></TimeLineLista>
        </ul> -->
        <TimeLineComponent
            :estadisticos="estadisticosLocal"
            :ghosts="ghostsLocal"
            :actividadModulosConceptos="actividadModulosConceptos"
            
            @cambiar-estatus="cambiarEstatus"
            @etapa-actions="etapaActions"
            @etapa-link-actions="etapafolioActions"
        ></TimeLineComponent>
    </div>
</template>
<script>
    import TimeLineComponent from './components/TimeLineComponent.vue';
    //resources\assets\js\utils\data\data_time_line.js
    //import * as dtaView from '@/utils/data/data_time_line';
    export default{
        name:"ProductionTimeLineMain",
        components:{
            TimeLineComponent
        },
        mounted(){
            console.log('DATA Main:<> ',dtaView)
        },
        props:{
            estadisticos:{type:Array,default:()=>{return[];}},
            ghosts:{type:Array,default:()=>{return[];}},
            modulosConceptos:{type:Array,default:()=>{return[];}},
        },
        data(){
            return{
                estadisticosLocal:[...this.estadisticos],
                ghostsLocal:[...this.ghosts],
                actividadModulosConceptos:[...this.modulosConceptos],
                selectedEtapas:[],
            }
        },
        methods:{
            fixNameFunction(text){
                return snakeToCamel(text)
            },
            cambiarEstatus({etapa,action,actividad,estatus,documento}){
                const accion=this.fixNameFunction(action);
                if(this[accion] && typeof this[accion] === 'function'){
                    console.log('axiste la función: ',this[action])
                    this[accion]({etapa,actividad,estatus,documento});
                }
                this.$emit('cambiar-estatus',{etapa,action,actividad,estatus,documento})
            },
            etapaActions({etapa,action,actividad,estatus,documento}){
                const accion=this.fixNameFunction(action);
                if(this[accion] && typeof this[accion] === 'function'){
                    console.log('axiste la función: ',this[action])
                    this[accion]({etapa,actividad,estatus,documento});
                }
                this.$emit('etapa-actions',{etapa,action,actividad,estatus,documento})
            },
            etapafolioActions({etapa,action,actividad,estatus,documento}){
                const accion=this.fixNameFunction(action);
                if(this[accion] && typeof this[accion] === 'function'){
                    console.log('axiste la función: ',this[action])
                    this[accion]({etapa,actividad,estatus,documento});
                }
                this.$emit('etapa-link-actions',{etapa,action,actividad,estatus,documento})
            },

            selectItem({index,params}){
                //console.log(index)
                if(this.selectedEtapas.includes(index)) {
                    //this.selectedEtapas=[]
                    return
                };
                this.selectedEtapas=[]
                this.selectedEtapas.push(index)
            },
            getNewEstatus(est){
                const map={
                    'omitir':'omitida',
                    'iniciar':'en_progreso',
                    'terminar':'completada',
                };
                return map[est.toLowerCase()]??est.toLowerCase();
            },
            actualizaEtapas(val){
                this.estadisticosLocal=[...val]
            },
            actualizaGhosts(val){
                this.ghostsLocal=[...val]
            },
            actualizaModulosConceptos(val){
                this.actividadModulosConceptos=[...val]
            },
            // etapaNuevaActividad({etapa,actividad}){
            //     if(!actividad)return;
            //     actividad=actividad.etapa
            //     let actividades=etapa.actividades;
            //     console.log(actividades,actividades)
            //     let gostIndex=actividad.ghost_index;
            //     actividades.push(actividad);
            //     const item = this.estadisticosLocal.find(
            //         e => e.estadistico_documento_id === etapa.estadistico_documento_id
            //     );
            //     console.log(actividad)
            //     this.$set(item, 'actividades', actividades);
            //     if(item.estatus!='en_proceso'){
            //         this.$set(item, 'estatus', 'en_proceso');
            //         this.$set(item, 'estatus_doc', 'en_proceso');
            //     }
            //     const r=[...this.ghostsLocal]
            //     r.splice(gostIndex,1)
            //     console.log(this.ghostsLocal,gostIndex)
            //     this.actualizaGhosts(r)
            // }
            // etapaCambiarEstatus({ etapa, estatus }) {
            //     console.log('cambiar estatus de etapa:', etapa, 'nuevo estatus:', estatus);
            //     estatus=this.getNewEstatus(estatus);
            //     const item = this.estadisticosLocal.find(
            //         e => e.estadistico_documento_id === etapa.estadistico_documento_id
            //     );
            //     setTimeout(()=>{
            //         if (item) {
            //             this.$set(item, 'estatus_doc', estatus);
            //             this.$set(item, 'estatus', estatus);
            //         }
            //         console.log(item)
            //     },500)
            // },
        },
        watch:{
            estadisticosLocal:{
                deep:true,
                immediate:true,
                handler(val){
                    console.log(val)
                    this.estadisticosLocal=[...val]
                }
            },
            ghostsLocal:{
                deep:true,
                immediate:true,
                handler(val){
                    console.log(val)
                    this.ghostsLocal=[...val]
                }
            },
            actividadModulosConceptos:{
                deep:true,
                immediate:true,
                handler(val){
                    console.log(val)
                    this.actividadModulosConceptos=[...val]
                }
            },
        }
    }
    
</script>