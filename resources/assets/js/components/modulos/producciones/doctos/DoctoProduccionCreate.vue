<template>
    <div>
        <form>
            <UiGrid :columns="2">
                <UiSelect 
                    v-model="form.concepto_produccion_id"
                    :options="conceptos"
                    :reduce="r=>r.concepto_produccion_id"
                    label="Tipo producción"
                    optionLabel="nombre"
                    optionValue="nombre"
                />
                <UiSelect 
                    v-model="form.centro_costo_id"
                    :options="ranchos"
                    :reduce="r=>r.centro_costo_id"
                    label="Rancho"
                    optionLabel="nombre"
                    optionValue="nombre"
                    searching
                />
                <UiInput v-model="form.fecha" type="date" label="Fecha plantación" />
                <UiSelect 
                    v-model="form.produccion_id"
                    :options="producciones"
                    :reduce="r=>r.produccion_id"
                    label="Lote producción"
                    optionLabel="text"
                    optionValue="text"
                    searching
                    :disabled="producciones.length==0"
                />
                <a @click.prevent="dividirProd" v-if="form.produccion_id">
                    <UiInput 
                        v-model.number="form.area_produccion" type="number" label="Superficie (HA) total produccion" readonly
                    />
                </a>
                <UiInput v-model.number="form.area_plantacion" type="number" label="Superficie (HA) a plantar" />
                <UiSelect 
                    v-model="form.programa_plantacion_id"
                    :options="programaciones"
                    :reduce="r=>r.programa_plantacion_id"
                    label="Programación"
                    optionLabel="text"
                    optionValue="text"
                    searching
                    :disabled="programaciones.length==0"
                />
                <UiSelect 
                    v-model="form.articulo"
                    :options="articulos"
                    :reduce="r=>r.artiulo"
                    label="Articulo plantar/sembrar"
                    optionLabel="articulo"
                    optionValue="articulo"
                    searching
                    :disabled="articulos.length==0"
                />
                <UiInput v-model.number="form.cantidad" type="number" label="Cantidad" />
                <UiSelect 
                    v-model="form.articulo_producir"
                    :options="articulosProd"
                    :reduce="r=>r.id"
                    label="Articulo cosecha"
                    optionLabel="id"
                    optionValue="text"
                    searching
                    :disabled="articulosProd.length==0"
                />
            </UiGrid>
        </form>
        <ModalBase v-model="verModalSubdividirLote" >
            <template slot="head"><h4>Dividir produccion a sublotes</h4> Area Produccion: {{ areaProduccion }} (Ha)</template>
            <CreaSubLotes
                :produccion="getPropsSublotes"
                :poligonos="poligonos"
                @polygonsChange="poligonos=$event"
            ></CreaSubLotes>

            <!-- 
                <docto-produccion-create
                    v-model="formCreateEdit" 
                    v-bind="getPropsCreate"
                    @input="formCreateEdit=$event"
                ></docto-produccion-create -->
            <template slot="foot">
                <UiButton class="btn btn-flat" @click.prevent="verModalSubdividirLote=false" color="grey">Cancelar</UiButton>
                <UiButton class="btn btn-success" @click.prevent="sendSubdividirProduction" color="green">Guardar</UiButton>
            </template> 
        </ModalBase>
    </div>
</template>
<script>
    import UiSelect from '@/components/ui/UiSelect.vue'
    import UiGrid from '@/components/ui/UiGrid.vue'
    import UiInput from '@/components/ui/UiInput.vue';
    import CreaSubLotes from './CreaSubLotes.vue';
    export default {
        name: 'DoctoProduccionCreate',
        components:{
            UiGrid,UiSelect,UiInput,CreaSubLotes
        },
        mounted(){
            //console.log(this.$props)
            // if(this.conceptos.length==1){
            //     this.form.concepto_produccion_id = this.conceptos[0].concepto_produccion_id
            // }
            // if(this.ranchos.length==1){
            //     this.form.centro_costo_id = this.ranchos[0].centro_costo_id
            // }
            // if(this.producciones.length==1){
            //     this.form.produccion_id = this.producciones[0].produccion_id
            // }
        },
        props:{
            value:{type:Object,require:true},
            cats:{type:Object,require:true},
        },
        data() {
            return {
                form:this.value,
                verModalSubdividirLote:false,
                poligonos:[
                    {id:'TEXT1',name:"TEXT1",paths:[{    "lat": 22.219416082608827,    "lng": -101.8996223263893},{    "lat": 22.219599827067736,    "lng": -101.89972425033187},{    "lat": 22.21961472525656,    "lng": -101.89880693484878},{    "lat": 22.219381320116543,    "lng": -101.89870501090621},{    "lat": 22.219058525133985,    "lng": -101.89867282439803},{    "lat": 22.219048592968896,    "lng": -101.8995847754631},{    "lat": 22.219321727252648,    "lng": -101.89958745767211},{    "lat": 22.219322968770882,    "lng": -101.89945938219165},{    "lat": 22.219413599573972,    "lng": -101.8994600527439}]},
                ],
            }
        },
        computed: {
            areaProduccion(){
                console.log(this.getPropsSublotes)
                return parseFloat(this.getPropsSublotes.zona_produccion).toFixed(2)
            },
            conceptos(){
                return this.cats.conceptos??[]
            },
            ranchos(){
                return this.cats.ranchos??[]
            },
            producciones(){
                if(!this.form.centro_costo_id) return [];
                //console.log(this.cats.lotes_producciones)
                return (this.cats.lotes_producciones??[]).filter(p=>p.centro_costo_id==this.form.centro_costo_id);
            },
            programaciones(){
                if(!this.form.produccion_id) return [];
                return this.cats.programaciones.filter(p=>p.produccion_id==this.form.produccion_id);
            },
            articulos(){
                if(this.programa_plantacion_id){
                    const articulo=this.cats.programaciones.find(p=>p.programa_plantacion_id==this.form.programa_plantacion_id)?.articulo;
                    return this.cats.articulos?.filter(a=>a.articulo.includes(articulo))??[];
                }
                return this.cats.articulos??[]
            },
            articulosProd(){
                if(this.form.produccion_id){
                    const articulo=this.cats.lotes_producciones.find(p=>p.produccion_id==this.form.produccion_id)?.articulo;
                    let res=this.cats.articulos_resultados?.filter(a=>a.id.includes(articulo))??[];
                    console.log(articulo)
                    if(res.length>0){
                        return res;
                    }
                }
                return this.cats.articulos_resultados??[]
            },
            getPropsSublotes(){
                const prod=this.producciones.find(p=>p.produccion_id==this.form.produccion_id);
                return prod??null
            },
            
        },
        methods: {
            dividirProd(){
                console.log('divide::prod')
                this.verModalSubdividirLote=true;
            },
            sendSubdividirProduction(){
                console.log(this.poligonos)
            },
            SaveData(){
                let datos={};
                if(verificaGuardarSublotes){
                    if(datosEnviar.total){
                        //console.log('Saving data Total',datosEnviar,poligonosSeleccionados,nombresPS,areasPS,loteprodObj)
                        datos=Object.assign({lotepadre:loteprodObj},datosEnviar)
                    }else{
                        let puntos=[]//subpoligonos:poligonosSeleccionados
                        console.log(poligonosSeleccionados)
                        for(let i in poligonosSeleccionados){
                            let points=poligonosSeleccionados[i]
                            let pol='';
                            for(let j=0;j< points.length;j++){
                                let point=points[j];
                                let cent=point.getPosition()
                                pol+=cent.lat()+','+cent.lng();
                                if(j!=points.length-1){
                                    pol+='|'
                                }
                            }
                            puntos.push(pol)
                        }
                        console.log(puntos)
                        console.log('Saving data sublotes',datosEnviar,poligonosSeleccionados,nombresPS,areasPS,loteprodObj,proratearPS)
                        datos=Object.assign({lotepadre:loteprodObj,subpoligonos:puntos,subnombres:nombresPS,subareas:areasPS,prorratear:proratearPS},datosEnviar)
                    }
                }
                if(datos){
                    if(progPlanDivide==true && progPlanSelect && progPlanSelect.folio+progPlanSelect.nombre!=datosEnviar.produccion){
                        mess='la programacion es distinta a la produccion seleccionada';
                        M.toast({html:mess})
                    }else{
                    $.ajax({
                        headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                        method:'POST',
                        data:Object.assign({programaciones:progsPlantsDividir},datos),
                        beforeSend:()=>{
                            LimpiarErroresForm('#modalNew')
                        },
                        success:(res)=>{
                            console.log(res)
                            if(res.status){
                                M.toast({html:res.message})
                                setTimeout(()=>{
                                    document.location.href='plantacion/editar/'+res['id-editRecord'];
                                },500)
                            }else{
                                M.toast({html:res.message})
                            }
                        },
                        error:(err)=>{
                            console.log(err)
                            if(err.status == 422){
                                DespliegaErrorsEnHTML('#modalNew',err)
                            }
                        }
                    })
                    }
                }else{ M.toast({html:'data no verificada'})}
            }
        },
        watch:{
            value:{
                handler(val){
                    console.log(val)
                    this.form = val
                },
                deep:true
            },
            ['form.produccion_id']:{
                handler(val){
                    const prod=this.producciones.find(p=>p.produccion_id==val);
                    let z=parseFloat(prod.zona_produccion??0);
                    this.form.area_produccion=z>0?z.toFixed(2):null;
                    const zl=(z)-(parseFloat(prod.zona_plantada??0));
                    this.form.area_plantacion=zl>0? zl.toFixed(2):null;
                    this.$emit('input',this.form)
                }
            }
        },
    }
</script>