<template>
    <div>
        <div class="row col s12">
            <h5>Filtros Generales</h5>
            <GrupoInputs
                v-bind="FiltrosGen"
                @input="onInputGen"
            />
            <div class="col s12">
                <div class="row valign-wrapper col s12" style="margin-bottom: 0; padding: 0;">
                    <div class="row col s12">
                        <div class="grey-text text-darken-1 breadcrumb editable"  @click="checkInfoProd">
                            Producción: 
                            <i class="material-icons tiny ">{{ !openInfo? 'chevron_right' :'keyboard_arrow_up' }}</i>
                            
                            <h5 v-if="localForm.produccion && localForm.produccion!=''">
                                <h1>FOLIO </h1>
                                <!-- <strong class="mono">FOLIO PRODUCCIÓN: {{ (localForm.produccion?.folio??'FOLIO') }}</strong> -->
                            </h5>
                        </div>
                        <!-- <div v-if="openInfo && (localForm.produccion?.nombre??false)">
                            <div class="card white darken-4 z-depth-1">
                            <div class="card-content row valign-wrapper">
                            <div class="col s12 m2">
                                <div class="responsive-img grey lighten-2" style="height:96px"></div>
                            </div>
                            <div class="col s12 m8">
                                <p class="grey-text text-darken-1">
                                    Folio : {{ form.produccion?.folio??'FOLIO' }}
                                </p>

                                <h5>{{ localForm.zona??'ZONA: ' }} {{ localForm.produccion.cultivo??'Variedad' }} ({{ localForm.produccion.variedad??'variedad' }})</h5>

                                <p class="grey-text">
                                <i class="material-icons tiny">location_on</i>
                                    Ubicación
                                </p>
                            </div>
                            </div>

                            <div class="divider"></div>
                            <div class="card-content row">
                                <div class="col s12 m4">
                                    <h6 class="blue-text"> Inormacion General</h6>

                                    <p><strong> Variedad: </strong><br>{{ localForm.produccion.variedad??'Maíz híbrido / Pioneer P1197AM' }}</p>
                                    <p><strong> Fecha siembra: </strong><br>{{ localForm.produccion.fecha_plantacion??'fecha_plantacion' }}</p>
                                    <p><strong> Ventana cosecha: </strong><br>{{ localForm.produccion.ventana_cosecha??'de - a' }}</p>
                                    <p><strong> Area: </strong><br>{{ localForm.produccion.superficie??'84.5 Acres' }}</p>
                                </div>
                            </div>
                            <div class="card-action">
                            </div>

                            </div>

                        </div> -->
                    </div>
                </div>
            </div>
            <GrupoInputs
                v-bind="filtrosFechas"
                @input="onInputGen"
            />
        </div>
    </div>
</template>
<script>
    import GrupoInputs from '@/components/Global/GroupInputsBase.vue';
    export default {
        name: "FiltrosGeneral",
        components:{GrupoInputs},
        mounted(){
            console.log(this.localForm)
        },
        props:{
            catalogos:{type:Object,default:()=>{return{};}},
            form:{
                type:Object,
                default:() => {return{
                    year:'',
                    rancho:'',
                    zona:'',
                    produccion:null,
                    rango:{inicio:null,fin:null},
                }}
            },
            rango_etapas:{
                type:Object,
                default:()=>{return {min:null,max:null}}
            },
        },
        created(){
            this.localCatalogos = { ...this.catalogos };
        },
        data(){
            return{
                localCatalogos:{},
                // catalogos:{
                //     'opciones_years':[{id:1,text:'opcion 1',label:'opcion 1'},{id:2,text:'opcion 2',label:'opcion 2'},{id:3,text:'opcion 3',label:'opcion 3'}]
                // },
                // form:{
                //     text:'',
                //     number:'',
                //     textarea:'',
                //     select:1,
                //     date:'',
                //     date_range:{ inicio: '2026-01-01', fin: '2026-03-03' },
                // },
                errors:{},
                fields:[
                    {type:'select',name:'year',label:"Año",label_options:'years',props:{clases:'col s12 m6 l6'}},
                    {type:'select',name:'rancho',label:"Rancho",label_options:'ranchos',props:{clases:'col s12 m6 l6'}},
                    {type:'select',name:'zona',label:"Zona producción",label_options:'tablas',props:{clases:'col s12 m6 l6'}},
                    {type:'select',name:'produccion',label:"Producción",label_options:'producciones',props:{clases:'col s12 m6 l6'}},
                    // {name:'text',label:"TEXTO",type:'text',props:{clases:"col s6"},},    
                    // {name:'number',label:"Numerico",type:'number',props:{clases:"col s6"},},
                    // {name:'textarea',label:"Text Area",type:'textarea',props:{clases:"col s6"},},
                    // {name:'select',label:"Select v",type:'select',label_option:'opciones_select',props:{'reduce':item=>item.id,clases:"col s6"},},
                    // {name:'date',label:"Fecha",type:'date',props:{clases:"col s6"},},
                    // {name:'date_range',label:"Rango de fechas",type:'date-range',props:{clases:"col s6",rango:{min:'2026-01-05',max:'2026-01-29'}}},
                ],
                field_rango:{name:'rango',type:'date-range',label:'Filtrar por rango',props:{clases:"col s12",rango:{min:null,max:null}}},
                
                emitdFiltros:{
                    produccion:true,
                    rango:true,
                },
                openInfo:false,
                poductionsData:{},
                prodData:{},
                localForm:{...this.form}
            }
        },
        computed:{
            FiltrosGen(){
                let res={}
                res.fields=this.fields;
                const cats={};
                cats.years=this.yearsProds;
                cats.ranchos=this.ranchosFiltrados;
                cats.tablas=this.tablasFiltradas;
                cats.producciones=this.produccionesfiltradas
                res.catalogos=cats;
                res.form=this.localForm
                return res;
            },
            filtrosFechas(){
                let res={}
                this.field_rango.props.rango={min:this.rango_etapas.min,max:this.rango_etapas.max}
                this.field_rango.disabled=this.localForm.produccion? false:true
                res.fields=[this.field_rango];
                res.form=this.localForm
                return res;
            },
            yearsProds(){
                let res=[];
                this.localCatalogos.producciones?.forEach(p => {
                    if(!res.includes(p.year)){
                        res.push(p.year)
                    }
                });
                return res;
            },
            ranchosFiltrados(){
                if (!this.localForm.year) {
                    return this.localCatalogos.ranchos;
                }
                //Obtener IDs únicos de ranchos para el año
                const idsRanchos = this.localCatalogos.producciones.filter(p => p.year == this.localForm.year).map(p => p.rancho_id)
                //Filtrar ranchos
                const res=this.localCatalogos.ranchos.filter(r =>idsRanchos.includes(r.rancho_id))
                //console.log(this.form.rancho)
                if(this.localForm.rancho && res.filter(a=>a.rancho_id==this.localForm.rancho.rancho_id).length==0){
                    this.localForm.rancho=null;
                }
                return res;
            },
            tablasFiltradas(){
                const idsTablas = [...new Set(this.localCatalogos.producciones?.filter(p => p.year == this.localForm.year).map(p => p.tabla_id))]
                const ranchoid=this.localCatalogos.ranchos?.filter(r=>r.rancho_id==this.localForm.rancho?.rancho_id??0).map(r=>r.rancho_id)[0];
                console.log(ranchoid)
                let res=[];
                if(idsTablas.length==0 && !ranchoid){
                    res=this.localCatalogos.tablas??[];
                }else if(idsTablas.length>0 && ranchoid){
                    res=this.localCatalogos.tablas.filter(t=> idsTablas.includes(t.tabla_id) && t.rancho_id==ranchoid)
                }else if(idsTablas.length>0 && !ranchoid){
                    res=this.localCatalogos.tablas.filter(t=> idsTablas.includes(t.tabla_id))
                }else if(idsTablas.length==0 && ranchoid){
                    res=this.localCatalogos.tablas.filter(t=>t.rancho_id==ranchoid)
                }else{
                    res=this.localCatalogos.tablas
                }
                if(this.localForm.zona && (this.localCatalogos.tablas?.length??0)>0 && res.filter(a=>a.tabla_id==this.localForm.zona.tabla_id).length==0){
                    this.localForm.zona=null;
                }
                return res;
            },
            produccionesfiltradas(){
                const year=this.localForm.year;
                const ranchoid=this.localCatalogos.ranchos?.filter(r=>r.rancho_id==this.localForm.rancho?.rancho_id??0).map(r=>r.rancho_id)[0];
                const tablaid=this.localCatalogos.tablas?.filter(t=>t.tabla_id==this.localForm.zona?.tabla_id??0).map(t=>t.tabla_id)[0];
                let res=[];
                if(year && ranchoid && tablaid){
                    res=this.localCatalogos.producciones.filter(p=>p.year==year && p.rancho_id==ranchoid && p.tabla_id==tablaid);
                }else if(year && ranchoid){
                    res=this.localCatalogos.producciones.filter(p=>p.year==year && p.rancho_id==ranchoid);
                }else if(year && tablaid){
                    res=this.localCatalogos.producciones.filter(p=>p.year==year && p.tabla_id==tablaid);
                }else if(ranchoid && tablaid){
                    res=this.localCatalogos.producciones.filter(p=>p.rancho_id==ranchoid && p.tabla_id==tablaid);
                }else if(year){
                    res=this.localCatalogos.producciones.filter(p=>p.year==year);
                }else if(ranchoid){
                    res=this.localCatalogos.producciones.filter(p=>p.rancho_id==ranchoid);
                }else if(tablaid){
                    res=this.localCatalogos.producciones.filter(p=>p.tabla_id==tablaid);
                }else{
                    res=this.localCatalogos.producciones;
                }
                if(this.localForm.produccion && (this.localCatalogos.producciones?.length??0)>0 && res.filter(a=>a.produccion_id==this.localForm.produccion.produccion_id).length==0){
                    console.log('cambio set produccion')
                    this.$set(this.localForm,'produccion',null);
                }
                return res;
            },
            catalogosTest(){
                return this.localCatalogos;
            },
            
            
        },
        methods: {
            checkInfoProd(){
                this.openInfo=!this.openInfo;
            }, 
            consultaCats(){
                let uri=this.route('catalogos.actividades_tractor');
                $.ajax({
                    url:uri
                    ,method:'GET'
                    ,data:{accion:['tablas','ranchos','producciones']},
                    beforeSend:()=>{
                        this.fields.map(i=>i.props.loading=true)
                    },
                    complete:()=>{
                        this.fields.map(i=>i.props.loading=false)
                    },
                    success:(res)=>{
                        // console.log(res)
                        for(let i in res){
                            this.$set(this.localCatalogos, i, res[i]);
                        }
                    },
                    error:(err)=>{
                        console.error(err)
                    }
                })
            },
            onInputGen(values) {
                console.log(values,this.localForm)
                if ((values.name in this.emitdFiltros)) {
                    // console.log(values)
                    this.$emit('filtro-change-'+values.name,values.value)
                }
                if (!(values.name in this.localForm)) {
                    this.$set(this.localForm, values.name, values.value ?? '');
                } else {
                    this.localForm[values.name] = values.value ?? '';
                }
                console.log(this.localForm,this.form)
                this.$emit('input', this.localForm);
            },
            onChangeInicio(val,a){
                console.log('cambio inicio',val,a)
            },
            onChangefin(val,a){
                console.log('Cambio fin',val,a)
            },
            obtenerInfoGen(prod){
                return;
                if(this.poductionsData[prod.produccion_id]){
                    return this.poductionsData[prod.produccion_id];
                }
                let uri=this.route('informacion.producciones',{':id':prod.produccion_id});
            },
        },
        watch:
        {
            form:{
                deep: true,
                immediate: true,
                handler(val) {
                    // console.log(val)
                    this.localForm = { ...val };
                    //this.$emit('input', this.localForm);
                }
            },
            catalogos: {
                deep: true,
                immediate: true,
                handler(val) {
                    // console.log(val)
                    this.localCatalogos = { ...val };
                }
            },
            rango_etapas:{
                deep:true,
                immediate:true,
                handler(val){
                    this.field_rango.props.rango=val;
                    
                }
            },
            'localForm.produccion'(newVal){
                if(!newVal){
                    // console.log('cambio prod',newVal)
                    this.localForm.rango.inicio=null;
                    this.localForm.rango.fin=null;
                }
                this.$emit('input', this.localForm);
            }
            // yearSelected(newVal){
            //     this.$emit('year-selected',newVal)
            // }
        }
    }
</script>