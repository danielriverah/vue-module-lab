<template>
    <div>
        <span href="#">{{ getActividad.serie }}-{{ getActividad.actividad_id }}</span> <span>{{ getActividad.estatus }}</span> <menuContextual v-bind="menuContextualActProps" />
        <strong v-if="documentoLocal.docto_produccion_id">
            -> [<span href="#">{{ getActividad.documento.folio }}</span> (<span>{{ getActividad.documento.estatus }}</span>) <menuContextual v-bind="menuContextualDocProps" />]</strong>
    </div>
</template>
<script>
    import menuContextual from './MenuContextual.vue'
    export default {
        name: "LinksFolios",
        components:{menuContextual},
        mounted() {
            // console.log(this.actividad)
            // console.log(this.documento)
        },
        props:{
            actividad:{
                type: Object,
                required: true
            },
            estatus:{
                type:String,
                required:true
            }
        },
        data(){
            return{
                actividadLocal: {...this.actividad},
                estatusEstadistico:this.estatus,
                itemContextMenuAct:[
                    {'label':'Editar','action':this.ClickEditar,'icon':{'type':'icon','name':'edit',path:'',position:'left'}},
                    {'label':'Ver Detalle','action':this.ClickVerDetalle,'icon':{'type':'icon','name':'visibility',path:'',position:'left'}},
                    {'label':'Finalizar','action':this.ClickFinalizar,'icon':{'type':'icon','name':'done_all',path:'',position:'left'}},
                    {'label':'Desligar','action':this.ClickDesligar,'icon':{'type':'icon','name':'link_off',path:'',position:'left'}},
                    // {'label':'Cancelar','action':this.ClickCancelar,'icon':{'type':'icon','name':'cancel',path:'',position:'left'}},
                ],
                itemContextMenuDocto:[
                    {'label':'Ver Detalle','action':this.ClickVerDetalleDocto,'icon':{'type':'icon','name':'visibility',path:'',position:'left'}},
                    {'label':'Finalizar','action':this.ClickFinalizarDocto,'icon':{'type':'icon','name':'done_all',path:'',position:'left'}},
                    // {'label':'Cancelar','action':this.ClickCancelarDocto,'icon':{'type':'icon','name':'cancel',path:'',position:'left'}},
                ],
            }
        },
        computed:{
            getActividad(){
                let act={...(this.actividadLocal??{})}
                act=this.normaliza(act);
                return act;
            },
            documentoLocal(){
                return this.getActividad.documento
            },
            getTextBBuscar(){
                const map={
                    'EN_PROGRESO':'en_proceso',
                    'ATRASADA':'atrasada',
                    'EN_PROCESO':'en_proceso',
                    'EN_PROGRESO_2':'en_proceso',
                    'TERMINADA':'completada',
                    'OMITIDA':'omitida',
                    'CANCELADA':'cancelada',
                    'N':'finalizada',
                    'terminada':'finalizada',
                    'P':'pendiente',
                    'pendiente':'pendiente',
                };
                const valr=  map[this.getActividad.estatus.toUpperCase()] ?? 'ghost';
                return valr;
            },
            getEstatusDocto(){
                const map={
                    'EN_PROGRESO':'en_proceso',
                    'ATRASADA':'atrasada',
                    'EN_PROCESO':'en_proceso',
                    'EN_PROGRESO_2':'en_proceso',
                    'TERMINADA':'completada',
                    'OMITIDA':'omitida',
                    'CANCELADA':'cancelada',
                    'N':'finalizada',
                    'terminada':'finalizada',
                    'P':'pendiente',
                    'pendiente':'pendiente',
                };
                const valr=  map[this.getActividad.documento.estatus.toUpperCase()] ?? 'ghost';
                return valr;
            },
            menuContextualDocProps(){
                const it=this.itemContextMenuDocto.filter((i=>this.estatusActionsDocto.includes(i.label)))
                return {
                    items:it
                }
            },
            menuContextualActProps(){
                const it=this.itemContextMenuAct.filter((i=>this.estatusActions.includes(i.label)))
                return {
                    items:it
                }
            },
            estatusActions(){
                return this.getActionsActLabel(this.getTextBBuscar);
            },
            estatusActionsDocto(){
                return this.getActionsActLabel(this.getEstatusDocto);
            },
        },
        methods:{
            normaliza(act){
                act=act??{};
                act.estatus=act.estatus??'P'
                act.serie=act.serie??'S/D';
                act.documento=act.documento??{};
                act.documento.folio=act.documento.folio??'S/D';
                act.documento.estatus= act.documento.estatus??'';
                return act;
            },
            getActionsActLabel(est){
                const mapAccions={
                    'en_proceso':['Editar','Ver Detalle','Finalizar','Desligar','Cancelar'],
                    'completada':['Ver Detalle','Desligar'],
                    'cancelada':['Ver Detalle','Desligar'],
                    'pendiente':['Ver Detalle','Finalizar','Cancelar'],
                    'finalizada':['Ver Detalle'],
                }
                let res=mapAccions[est] ?? [];
                if(!(['PENDIENTE','ATRASADA','EN_PROCESO','GHOST']).includes(this.estatusEstadistico.toUpperCase())){
                    res=['Ver Detalle'];
                }
                return res;
            },
            ClickEditar(){
                this.sendEmit({action:'actividad-edita',actividad:this.getActividad})
            },
            ClickVerDetalle(){
                this.sendEmit({action:'actividad-ver',actividad:this.getActividad})
            },
            ClickFinalizar(){
                this.sendEmit({action:'actividad-finaliza',actividad:this.getActividad})
            },
            ClickDesligar(){
                this.sendEmit({action:'actividad-quitar',actividad:this.getActividad})
            },
            
            //documento
            ClickVerDetalleDocto(){
                this.sendEmit({action:'documento-ver',documento:this.getActividad.documento})
            },
            ClickFinalizarDocto(){
                this.sendEmit({action:'documento-finaliza',documento:this.getActividad.documento})
            },
            sendEmit(params){
                this.$emit('action-link',params);
            },
        },
        watch:{
            actividad(newVal,oldVal){
                this.actividadLocal={...(newVal??{})};
            }
        }
    }
</script>
<style scoped>
    
</style>