<template>
    <div class="card list-item card-content-body" 
        :class="[tipoEtapa, {'permite-soltar':permiteSoltar, 'drag-enabled': canDrag, 'drop-enabled': canDrop, 'drag-over': isDragOver,selected:isSelected }]"
        :style="[getStileBoxShdow,getColorBG]"
        :draggable="canDrag"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
        @dragover.prevent="onDragOver"
        @dragleave="onDragLeave"
        @drop.prevent="onDrop"
        @click="selectItem"
    >
        <div class="estatus-list" :style="getStileEstatus">
            {{ tipoEtapa }}
        </div> 
        <div class="title-card">
            <span>
                <i v-if="getEtapas.icono && getEtapas.icono.tipo=='icon'" :class="['material-symbols-outlined icono',tipoEtapa]">
                    {{ getEtapas.icono.icono }}
                </i>
                <i v-else-if="getEtapas.icono && getEtapas.icono.tipo=='svg'" 
                    :class="['icono', tipoEtapa]"
                    v-html="getEtapas.icono.path"
                >
                </i>
                <i v-else-if="getEtapas.icono && getEtapas.icono.tipo=='img'" :class="['icono',tipoEtapa]">
                    <img :src="getEtapas.icono.path" :alt="getEtapas.icono.nombre">
                </i>
            </span> 
            <strong style="margin-left: 30px;">[{{ getEtapas.tipo_etapa }}] {{ getEtapas.nombre }}</strong> 
            <strong>[{{ getEtapas.tipo_documento }}]</strong> <br> 
            <details class="folios-actividad-details">
                <summary>Folios</summary> 
                <ul class="folios-actividad-list"> 
                    <template v-if="getfolios.length>0" >
                        <li v-for="(folio,findex) in getEtapas.actividades" :key="findex"
                            class="folio-actividad-item folio-actividad-link"

                        >
                            <LinksFolios :estatus="getEtapas.estatus" :actividad="folio" 
                                @action-link="actionsLinks"
                            />
                        </li>
                    </template>
                    <li v-if="(['pendiente','en_progreso']).includes(getEtapas.estatus)" class="folio-actividad-item folio-actividad-empty">
                        <span v-if="getfolios.length>0" >
                            Puedes agregar uno nuevo o arrastrar una actividad compatible.
                        </span>
                        <span v-else>
                            Sin folios. Puedes agregar uno nuevo o arrastrar una actividad compatible.
                        </span>
                    </li>
                    <li v-if="(['pendiente','en_progreso']).includes(getEtapas.estatus)" class="folio-actividad-item folio-actividad-action">
                        <button @click.stop="ClickAddAct()" class="btn-small" type="button">Agregar actividad</button>
                    </li>
                </ul>
            </details>
        </div> 
        <div>
            <strong>Fecha programada</strong><br> 
            <span>{{ getEtapas.fecha_estimada_inicio }}</span>
        </div> 
        <div class="desfase desfase-neg">
            <strong>Fecha inicio</strong> <br> 
            <span>
                <span v-if="etapa.dias_atraso>0" class="info-danger">
                    <small>Tiene {{ getEtapas.dias_atraso }} dias de atraso</small>
                </span>
                <div v-else>{{ fechaInicio }}</div>
                <div class="progress grey lighten-3" v-if="etapa.avance">
                    <div class="determinate green" :style="{ width: etapa.avance }"></div>
                </div><br>
                <div class="info-default">
                    <small>
                        {{ getEtapas.observaciones}}
                    </small>
                </div>
            </span>
        </div> 
        <div class="item-card-actons">
            <div class="ghost-actions" index="0">
                <menuContextual v-bind="menuContextualProps" />
            </div>
        </div>
        <p v-if="hasError" class="error-message">
            {{ error }}
        </p>
    </div>
</template>
<script>
    import LinksFolios from './LinksFolios.vue';
    import menuContextual from './MenuContextual.vue'
    import helper from '@/components/helpers/fechas';
    const defConfig= {
                type: 'card',        // ['card','row','full']
                viewActividades: true,
                addActividad: true
            }; 
    // const colors_estatus={pendiente:'red lighten-4',atrasada:'red lighten-1',en_progreso:'orange lighten-3',completada:'green lighten-3',cancelado:'grey lighten-2',omitida:'grey lighten-3'}
    const estatus_color_span={
        pendiente: {'borderLeft':'5px solid rgb(255,193,7)', background: 'rgb(255,193,7)',boxShadow: '0 4px 10px rgba(255,193,7,0.35)',color: '#212529'},
        atrasada: {'borderLeft':'5px solid rgb(220,53,69)', background: 'rgb(220,53,69)',boxShadow: '0 4px 10px rgba(220,53,69,0.40)',color: '#fff'},
        en_proceso: {'borderLeft':'5px solid rgb(13,110,253)', background: 'rgb(13,110,253)',boxShadow: '0 4px 10px rgba(13,110,253,0.35)',color: '#fff'},
        en_progreso: {'borderLeft':'5px solid rgb(13,110,253)', background: 'rgb(13,110,253)',boxShadow: '0 4px 10px rgba(13,110,253,0.35)',color: '#fff'},
        completada: {'borderLeft':'5px solid rgb(25,135,84)', background: 'rgb(25,135,84)',boxShadow: '0 4px 10px rgba(25,135,84,0.35)',color: '#fff'},
        omitida: {'borderLeft':'5px solid rgb(212, 212, 212)', background: 'rgb(212, 212, 212)',boxShadow: '0 4px 10px rgba(212, 212, 212,0.35)',color: '#212529'},
        ghost: {'borderLeft':'5px solid rgb(150, 138, 138)', background: 'rgb(150, 138, 138)',boxShadow: '0 4px 10px rgba(150, 138, 138,0.35)',color: '#fff'},
    }
    export default {
        name: 'TimeLineItem',
        components: {LinksFolios, menuContextual },
        mounted(){
            //this.NormalizeEtapa(this.etapa)
        },
        props: {
            etapa: {
                type: Object,
                required:true
            },
            config:{
                type: Object,
                default:()=>{
                    return {}
                }
            },
            selected:{
                type:Boolean,
                default:true
            },
            allowDrag:{
                type:Boolean,
                default:true
            },
            allowDrop:{
                type:Boolean,
                default:true
            },
            error:{
                type:String,
                default:''
            },
            index:{
                type:Number,
                default:-1
            },
        },
        data() {
            return {
                items_menu_contextual:[
                    // {'label':'Editar','action':this.ClickEdit,'icon':{'type':'icon','name':'edit',path:'',position:'left'}},
                    {'label':'Ver Detalle','action':this.ClickVerDetalle,'icon':{'type':'icon','name':'clarify',path:'',position:'left'}},
                    {'label':'Terminar','action':this.ClickTerminar,'icon':{'type':'icon','name':'done_all',path:'',position:'left'}},
                    {'label':'Omitir','action':this.ClickOmitir,'icon':{'type':'icon','name':'do_not_disturb_on',path:'',position:'left'}},
                    {'label':'Pendiente','action':this.ClickPendiente,'icon':{'type':'icon','name':'pause',path:'',position:'left'}},
                    {'label':'Inicar','action':this.ClickInicar,'icon':{'type':'icon','name':'not_started',path:'',position:'left'}},
                    {'label':'Agregar Actividad','action':this.ClickAddAct,'icon':{'type':'icon','name':'add_ad',path:'',position:'left'}},
                    {'label':'Ligar','action':this.LigarAEtapa,'icon':{'type':'icon','name':'link',path:'',position:'left'}},
                ],
                localConfig: {},
                etapaLocal:{...this.etapa},
                dragEnabled: this.allowDrag,
                dropEnabled: this.allowDrop,
                isDragOver: false,
                permiteSoltar:false,
            }
        },
        computed:{
            isSelected(){
                return this.selected || this.getEtapas.selected
            },
            canDrag(){
                return this.dragEnabled;
            },
            canDrop(){
                return this.dropEnabled;
            },
            hasError() {
                return typeof this.error === 'string' && this.error.trim().length > 0;
            },
            getfolios(){
                return (this.getEtapas.actividades??[])
            },
            getEtapas(){
                const res=this.normaliza({...(this.etapaLocal??{})})
                return res;
            },
            actividadesCount(){
                return this.getEtapas.actividades_ids?.length || 0
            },
            tipoEtapa(){
                return this.getEtapas.estatus_doc
            },
            getColorBG(){
                let borderLeft=(estatus_color_span[this.getEtapas.estatus_doc])?.borderLeft??'';
                return {borderLeft}
            },
            getStileBoxShdow(){
                let boxShadow=(estatus_color_span[this.getEtapas.estatus_doc])?.boxShadow??'';
                return {boxShadow}
            },
            getStileEstatus(){
                return estatus_color_span[this.getEtapas.estatus_doc]
            },
            fechaInicio(){
                return this.fechaInicioFix(this.getEtapas.fecha_estimada_inicio);
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
            permiteDrop(){
                return this.canDrop
            },
            permiteDrag(){
                return this.canDrag
            },
            menuContextualProps(){
                const it=this.items_menu_contextual.filter((i=>this.estatusActions.includes(i.label)))
                return {
                    index:this.index,
                    items:it
                }
            },
            estatusActions(){
                return this.getActionsLabel(this.getEtapas.estatus_doc);
            },
            // getTextBBuscar(){
            //     const today = new Date().toISOString().split('T')[0];
            //     const diff = this.diffDays(this.doc.fecha_estimada_inicio, today);
            //     const est=this.doc.estatus;
            //     const valr=(diff>0 && est=='pendiente')? 'atrasada':est;
            //     return valr;
            // },
        },
        methods: {
            selectItem(){
                //const index=this.index;
                this.$emit('select-item')
            },
            normaliza(it){
                it=it??{};
                it.actividades=it.actividades??[];
                it.estatus=it.estatus??'pendiente';
                it.estatus_doc=it.estatus_doc??'pendiente';
                it.orden=it.orden??0;
                it.estadistico_documento_id=it.estadistico_documento_id??0;
                it.observaciones=it.observaciones??'Sin Observaciones' ;
                it.dias_atraso=it.dias_atraso??0
                return it;
            },
            getActionsLabel(est){
                const mapAccions={
                    'pendiente':['Editar','Ver Detalle','Inicar','Omitir','Agregar Actividad'],
                    'atrasada':['Editar','Ver Detalle','Inicar','Omitir','Agregar Actividad'],
                    'en_proceso':['Editar','Ver Detalle','Terminar','Omitir','Pendiente','Agregar Actividad'],
                    'en_progreso':['Editar','Ver Detalle','Terminar','Omitir','Pendiente','Agregar Actividad'],
                    'completada':['Ver Detalle'],
                    'omitida':['Ver Detalle','Pendiente'],
                    'ghost':['Ligar'],
                }
                return mapAccions[est] ?? [];
            },
            habilitarDrag(){
                this.dragEnabled = true;
            },
            deshabilitarDrag(){
                this.dragEnabled = false;
            },
            toggleDrag(){
                this.dragEnabled = !this.dragEnabled;
            },
            habilitarDrop(){
                this.dropEnabled = true;
            },
            deshabilitarDrop(){
                this.dropEnabled = false;
            },
            toggleDrop(){
                this.dropEnabled = !this.dropEnabled;
            },
            onDragStart(event){
                if(!this.canDrag){
                    event.preventDefault();
                    return;
                }

                const payload = {
                    etapa: this.getEtapas,
                    estadistico_documento_id: this.getEtapas.estadistico_documento_id,
                    tipo_etapa: this.getEtapas.tipo_etapa,
                };

                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('application/json', JSON.stringify(payload));
                this.$emit('drag-start', payload);
            },
            onDragEnd(){
                this.$emit('drag-end', { etapa: this.getEtapas });
            },
            onDragOver(event){
                this.isDragOver = true;
                if(this.canDrop){
                    this.permiteSoltar=true;
                    event.dataTransfer.allowDrop='default'
                }else{
                    this.permiteSoltar=false;
                    event.dataTransfer.allowDrop='default'
                }
            },
            onDragLeave(){
                this.isDragOver = false;
            },
            onDrop(event){
                this.isDragOver = false;

                if(!this.canDrop){
                    return;
                }

                let data = null;

                try{
                    const raw = event.dataTransfer.getData('application/json');
                    data = raw ? JSON.parse(raw) : null;
                }catch(e){
                    data = null;
                }
                this.agregaActividad(data)
            },
            fechaInicioFix:(fecha)=>{
                let res = helper.shortDate(fecha);
                return res;
            },
            fechaFin:(fecha)=>{
                let res = helper.shortDate(fecha);
                return res;
            },
            cambiarEstatus(estatus){
                const etapa=this.getEtapas;
                this.$emit('cambiar-estatus',{etapa,action:'etapa-cambiar-estatus',estatus})
            },
            agregaActividad(actividad){
                actividad=actividad??null;
                let etapa=this.getEtapas;
                if(!etapa?.estadistico_documento_id??false){
                    etapa=null;
                }
                this.$emit('etapa-actions',{etapa,action:'etapa-nueva-actividad',actividad})
            },
            verDetalle(){
                const etapa=this.getEtapas;
                this.$emit('etapa-actions',{etapa,action:'etapa-ver-detalle'})
            },
            actionsLinks(params){
                const etapa=this.getEtapas;
                this.$emit('etapa-link-actions',{etapa,...params})
            },
            ClickVerDetalle(){
                this.verDetalle();
            },
            ClickTerminar(){
                this.cambiarEstatus('TERMINAR');
            },
            ClickOmitir(){
                this.cambiarEstatus('OMITIR');
            },
            ClickPendiente(){
                this.cambiarEstatus('PENDIENTE');
            },
            ClickInicar(){
                this.cambiarEstatus('INICIAR');
            },
            ClickAddAct(){
                this.agregaActividad();
            },
            LigarAEtapa(){
                this.$emit('etapa-actions',{etapa:null,action:'actividad-ligar-a-etapa',actividad:this.getEtapas})
                
            }
            
        },
        watch:{
            etapa:{
                immediate: true,
                deep:true,
                handler(val){
                    this.etapaLocal={...(val??{})};
                },
            },
            config:{
                immediate: true,
                deep:true,
                handler(val){
                    this.localConfig = {
                        ...defConfig, // valores por defecto
                        ...val
                    };
                },
            },
            allowDrag:{
                immediate:true,
                deep:true,
                handler(val){
                    this.dragEnabled=val;
                }
            },
            allowDrop:{
                immediate:true,
                deep:true,
                handler(val){
                    this.dropEnabled=val;
                }
            },
        }
    }
</script>
<style scoped>
    .card-content-body{
        border: none;
        border-left: 5px solid;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        padding: 5px;
        border-radius: 10px;
        position: relative;
        overflow: visible;
        z-index: 1;
    }
    .card-content-body:not(.completa,.selected):hover{
        background: #e6e6e6;
    }
    .card-content-body:hover, .card-content-body.selected{
        z-index: 20;
    }
    .card-content-body .folios-actividad-list:hover{
        z-index: 21;
    }
    .card-content-body.drag-enabled:hover{
        cursor:move;
    }
    .card-content-body.drag-over:not(.drag-enabled){
        background: rgb(255, 243, 243);
    }
    .card-content-body.drop-enabled.drag-over{
        background: rgb(245, 255, 243);
    }
    .card-content-body .item-card-actons:hover{
        background: #c2daf3;
    }
    .card-content-body.permite-soltar:hover{
        cursor: move !important;
    }
    .card-content-body .item-card-actons{
        position: absolute;
        right: 0;          /* Pegado a la derecha */
        top: 50%;          /* Baja el borde superior al 50% del padre */
        transform: translateY(-50%); /* Sube el elemento la mitad de su propia altura */
        padding: 3px;
        
        /* Opcional: para asegurar que los iconos internos se alineen en fila o columna */
        display: flex;
        align-items: center;
    }
    .card-content-body .estatus-list{
        position: absolute;
        padding: 5px;
        border-radius: 10px;
        height: auto;
        left: -3px;
    }
    .card-content-body .title-card{
        margin-top: 40px;
        position: relative;
    }
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
    .card-item-tl{
        border-radius: 10px;
        padding: 5px;
        background: #fafafa;
    }
    .card-content-body.selected{
        background: #e6e6e6;
    }
    
    /*.card-item-tl.danger-item{
        border-left: 5px solid rgb(220, 53, 69);
        box-shadow: rgba(220, 53, 69, 0.35) 0px 4px 10px;
    }
    .card-item-tl.alert-item{
        border-left: 5px solid rgb(255, 193, 7);
        box-shadow: rgba(255, 193, 7, 0.35) 0px 4px 10px;
    }*/
    .icono {
        display: inline-flex;  /* Mejor que inline-block para centrar */
        align-items: center;
        justify-content: center;
        width: 28px;           /* Ajusta el tamaño que desees */
        height: 28px;
        vertical-align: middle;
        overflow: hidden;      /* Evita que cualquier cosa salga del borde */
    }

    /* Para imágenes <img> y vectores <svg> internos */
    .icono img, 
    .icono svg {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;   /* Mantiene la proporción sin deformar */
        display: block;
    }
    .icono > svg {
        width: 100% !important;
        height: auto !important;
        max-height: 100% !important;
        /* color: rgb(212, 212, 212);
        color: rgb(150, 138, 138); */
    }
    .info-danger{
        padding: 1px;
    }
    .info-danger:first-child{
        border: 1px dashed red;
        padding: 0 10px 2px 10px;
        border-radius: 10px;
    }
    .info-default{
        padding: 1px;
    }
    .info-default:first-child{
        border: 1px dashed blue;
        padding: 0 10px 2px 10px;
        border-radius: 10px;
    }
    .error-message{
        grid-column: 1 / -1;
        width: 100%;
        box-sizing: border-box;
        margin-top: 8px;
        padding: 12px 14px;
        border: 1px solid #f5c2c7;
        border-radius: 10px;
        background: #f8d7da;
        color: #842029;
        font-weight: 500;
        line-height: 1.4;
    }
</style>