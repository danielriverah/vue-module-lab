<template>
    <div>
        <ul class="content-linea">
            <!-- <li
                v-for="(item,index) in getEtapas"
                :key="index" 
            >
                <TimeLineItem
                    v-bind="ptopsTimeLine(item,index)"
                    :etapa="item"
                    :selected="selectedEtapas.includes(index)"
                    @drag-start="$emit('drag-start',$event)"
                    @drag-end="$emit('drag-end',$event)"
                    @agregar-actividad="$emit('agregar-actividad',$event)"
                    @cambiar-estatus="$emit('cambiar-estatus',$event)"
                    @ver-detalle="$emit('ver-detalle',$event)"
                    @toggle_estatus="$emit('toggle_estatus',$event)"
                    @select-item="$emit('select-item',index)"
                ></TimeLineItem>
            </li> -->
            <li v-for="(gitem, gindex) in getEtapas" :key="gindex">
                <div class="tipo-etapa-header is-stuck" :data-tipo-etapa="gitem.tipo.toString().trim().toUpperCase()"
                    @click="muestraOcultaDatos(gindex)"
                >
                    <span class="tipo-etapa-pill">[{{ gitem.tipo.toString().trim().toLowerCase() }}]</span><span class="tipo-etapa-title">
                        {{ tituloGrupo(gitem)}}-({{ gitem.items.length }} Etapas)
                    </span>
                    <i class="material-icons right toggle-btn" >{{ groupColapseEstatus(gindex)}}</i>
                </div>
                <ul v-show="verGrupoEtapas(gindex)">
                    <li v-for="(item,index) in gitem.items" :key="index" >
                        <component
                            :is="componenteItem"
                            v-bind="ptopsTimeLine(item,gindex,index)"
                            :etapa="item"
                            :selected="selectedEtapas.includes(item.tl_index)"
                            :index="item.tl_index"
                            @drag-start="dragStart"
                            @drag-end="dragEnd"
                            @cambiar-estatus="$emit('cambiar-estatus',$event)"
                            @etapa-actions="$emit('etapa-actions',$event)"
                            @etapa-link-actions="$emit('etapa-link-actions',$event)"
                            @select-item="selectedItem(item.tl_index,$event)"
                        />
                            <!-- @agregar-actividad="$emit('agregar-actividad',$event)" 
                             @actividad-ligar="$emit('actividad-ligar',$event)"
                             -->
                        <!-- select-item
                                drag-start
                                drag-end
                                cambiar-estatus
                                etapa-actions
                                etapa-link-actions-->
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
    import TimeLineItem from './TimeLineItem.vue';
    export default {
        name: "TimeLineLista",
        components: {
            TimeLineItem
        },
        props:{
            value:{
                type:Array,
                default:()=>{return []},
            },
            ghosts:{
                type:Array,
                default:()=>{return []},
            },
            actividadModulosConceptos:{
                type:Object,
                default:()=>{return {}},
            },
            modoVista:{
                type:String,
                default:'lista',
            },
            selectedEtapas:{
                type:Array,
                default:()=>{return []},
            },
            errores:{
                type:Array,
                default:()=>{return []},
            },
        },
        data(){
            return {
                etapasLocal:this.value,
                groups_colapse_values:{},
                permite_soltar:[],
            }
        },
        computed:{
            getEtapasLocal(){
                let res=[];
                const g=[...this.etapasLocal]
                g.forEach(i=>{
                    res.push(this.normaliza(i))
                })
                return res;
            },
            getGhosts(){
                let res=[];
                const g=[...this.ghosts]
                g.forEach((i,index)=>{
                    //i.ghost_index=index;
                    res.push(this.normalizaGhost(i))
                })
                return res;
            },
            
            componenteItem(){
                const map={
                    'lista':TimeLineItem,
                    // 'timeline':TimelineItem,
                    // 'tarjetas':TarjetasItem,
                    // 'gantt':GanttItem,
                }
                return map[this.modoVista??'lista']??TimeLineItem;
            },
            getEtapas(){
                const groups = [];
                let currentGroup = null;

                this.etapasOrderedByfecha.forEach((item, index) => {
                   if (!currentGroup || currentGroup.tipo !== item.tipo_etapa) {
                        if (currentGroup) {
                            groups.push(currentGroup);
                        }
                        currentGroup = {
                            tipo: item.tipo_etapa,
                            items: [],
                            collapsed: false
                        };
                    }
                    currentGroup.items.push(item);
                });

                if (currentGroup) {
                    groups.push(currentGroup);
                }

                return groups;
            },
            etapasOrderedByfecha(){
                let res=this.etapasWithGhosts.sort((a, b) => new Date(a.fecha_estimada_inicio) - new Date(b.fecha_estimada_inicio));
                res=res.map((a,b,c)=>{
                    a.tl_index=b
                    a.selected=false;
                    if(this.selectedEtapas.includes(b)){
                        a.selected=true;
                    }
                    return a;
                });
                return res;
            },
            
            etapasWithGhosts(){
                return [...this.getEtapasLocal,...this.getGhosts];
            },
            getEtapsPermiteDrop(){
                let res=this.getEtapasLocal.filter(e=>(['atrasada','en_proceso','pendiente']).includes(e.estatus_doc)).map(m=>{return m.estadistico_documento_id});
                return res;
            },
            getEtapasPermiteDrag(){
                let res=[];
                this.getGhosts.forEach(e=>{
                    const {tipo_actividad,actividad_id,docto_produccion_id} = e
                    if(tipo_actividad && tipo_actividad!='')
                    res.push({tipo_actividad,actividad_id,docto_produccion_id})
                })
                return res;
            },
        },
        methods:{
            normaliza(i){
                i.tipo_documento=i.tipo_documento??'';
                i.modulos=this.getModulos(i.tipo_documento)
                i.actividades_permite=i.actividades_permite??[]
                return i;
            },
            normalizaGhost(i){
                i.concepto_nombre=i.concepto_nombre??'';
                i.modulos=this.getModulos(i.concepto_nombre)
                i.estatus_doc=i.estatus_doc??'ghost';
                i.estatus=i.estatus??'ghost';
                i.tipo_etapa=i.tipo_etapa??'ghost';
                i.tipo_actividad=i.modulos[0]??'';
                return i;
            },
            tituloGrupo(gitem){
                return gitem.tipo.toString().trim().toLowerCase()??''=='before'? 'Etapas previas':'Etapas posteriores'
            },
            groupColapseEstatus(gindex){
                return (this.groups_colapse_values[gindex]??true)? 'remove':'add' 
            },
            verGrupoEtapas(index){
                return this.groups_colapse_values[index]??true
            },
            ptopsTimeLine(it,gindex,index){

                const selected =this.selectedEtapas.includes(it.tl_index);
                const allowDrop=this.permite_soltar.includes(it.estadistico_documento_id??0);
                //const allowDrag=this.getEtapsPermiteDrop.includes(it.estadistico_documento_id??0);
                let ad=this.getEtapasPermiteDrag;
                //console.log(gindex,index,ad,it)
                const allowDrag=ad.find(f=>{return (f.actividad_id==it.docto_produccion_id || f.docto_produccion_id==it.docto_produccion_id) && f.tipo_actividad==it.tipo_actividad})?true:false
                const error=this.errores[it.tl_index]
                // if(allowDrop)
                // console.log(gindex,index,it)
                return {selected,allowDrag,allowDrop,error}
            },
            muestraOcultaDatos(index){
                if(this.groups_colapse_values[index]==undefined){
                    this.$set(this.groups_colapse_values,index,false)
                    return;
                }
                this.$set(this.groups_colapse_values,index,!this.groups_colapse_values[index]??true)
            },
            dragStart(params){
                let etapas=[];
                const modulosGhost=params.etapa.modulos??[];
                if(!params.etapa.modulos || modulosGhost.length==0)return;
                const etapasDisponibles=this.getEtapasLocal.filter(f=>f.estatus_doc!='terminado').map(m=>{return m.estadistico_documento_id});
                this.getEtapasLocal.forEach(e=>{
                    e.modulos.forEach(m=>{
                        if(modulosGhost.includes(m) && !etapas.includes(e.estadistico_documento_id) && etapasDisponibles.includes(e.estadistico_documento_id))
                        etapas.push(e.estadistico_documento_id)
                    })
                })
                this.permite_soltar=[...etapas];
                //console.log(this.permite_soltar)
            },
            dragEnd(params){
                setTimeout(()=>{
                    this.permite_soltar=[];
                },1000)
            },
            selectedItem(index,params){
                this.$emit('select-item',{index,params})
            },
            getModulos(concepto){
                let res=[];
                const d={...(this.actividadModulosConceptos??{})}
                for(let i in d){
                    const cArr=d[i].map(c=>{return c.nombre})
                    //console.log(concepto,cArr)
                    if(cArr.includes(concepto))
                    res.push(i)
                }
                //console.log(res)
                return res;
            },
        }
    }
</script>
<style >
    /* .content-linea{
        background: blue;
    }*/
   
    .content-linea .tipo-etapa-header{
        margin: 2px;
        position: relative;
        border: 1px dashed rgb(239, 239, 255);
        border-radius: 10px ;
    } 
    .content-linea .tipo-etapa-header:hover{
        background: rgb(239, 239, 255);
        box-shadow: 0 2px 5px rgba(184, 22, 22, 0.2);
        transform: translate(-5px);
    }
    .toggle-btn{
        background: rgb(239, 239, 255);
        border-radius: 50%;
        position: absolute;
        right: 10px;
        cursor: pointer;
    }
    /* .toggle-btn:hover{
        background: rgb(197, 197, 250);
    } */
</style>