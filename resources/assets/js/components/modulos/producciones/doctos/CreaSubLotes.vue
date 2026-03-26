<template>
    <div>
        <UiGrid :columns="1">
            <template>
                <label class="ui-checkbox" >
                    <input
                        type="checkbox"
                        v-model="permiteImport"
                        :checked="permiteImport"
                        @change="permiteImport=$event.target.checked"
                    />
                    <span class="checkmark"></span>
                    <span class="label">
                        Permite importar GPX
                    </span>

                </label>
            </template>
            <template>
                <label class="ui-checkbox" >
                    <input
                        type="checkbox"
                        v-model="cambiosavanzados"
                        :checked="cambiosavanzados"
                        @change="cambiosavanzados=$event.target.checked"
                    />
                    <span class="checkmark"></span>
                    <span class="label">
                        Opciones avanzadas 
                    </span>

                </label>
            </template>
        </UiGrid>
        <MapActions v-if="getEditor"
            :value="polEd"
            :history="getEditor"
            :selecteds="puntosSelected"
            :editando="creandoEditandoPol"
            :permiteImport="permiteImport"
            :cambiosavanzados="cambiosavanzados"
            @input="recargaPoligono"
            @save-poligon="savePolygono"
            @selected-points="cambioseleccion"
            :ver_info="ver_info_map"
            @show-info-change="changeVerInfo"
            :mostrarDetalle="mostrarDetalle"
        ></MapActions>
        <UiGrid :columns="2">
            <UiMapViewBase
                :center="centroMap"
                :listaVer="getPoligonosCreados"
                :poligonoProduccion="getPoligonoProd"
                :ver_info_map="ver_info_map"
                :poligonoCreando="getPolC"
                :poligonoOriginal="getPolor"
                :ocultarPoligonsVer="false"
                :markersEdit="puntosSelected"
                :addPoints="creandoEditandoPol"
                @polygon-updated="recargaPoligono"
                @selected-points="cambioseleccion"
                @AddUpdatePoligon="savePolygono"
            />
            <UiGrid :columns="1">
                <UiListaPolygonoos
                    :polygons="getPoligonosCreados"
                    :editando="creandoEditandoPol"
                    :selsIds="[]"
                    :foliop="produccion.text"
                    @crear="creaPoligono"
                    @edit="editaPoligono"
                    @save="savePoligono"
                    @delete="deletePoligono"
                    @cancela="cancelaEdicion"
                    @selectionChange="changeSelectedLista"
                ></UiListaPolygonoos>
            </UiGrid>
        </UiGrid>
    </div>
</template>
<script>
import UiMapViewBase from '../../../ui/UiMapViewBase.vue';
import { useEditableState } from '@/utils/ui/useEditableState'
import MapActions from './MapActions.vue';
import UiGrid from '@/components/ui/UiGrid.vue';
import UiListaPolygonoos from '@/polygons_map/UiListaPolygonoos.vue';
import UiButton from '../../../ui/UiButton.vue';
export default {
    name:'CreaSubLotes',
    components: {
        UiMapViewBase,
        MapActions,
        UiGrid,
        UiListaPolygonoos,
    },
    mounted(){
        console.log(this.produccion)
        //console.log('entro al componente');
        //console.log(useEditableState)
        try{
            this.editor=useEditableState(null, { maxHistory:50 })
            this.editor.setExternalValue(this.polEd)
        }catch(e){console.log(e)}
        //console.log(this.editor,useEditableState)
    },
    props:['produccion','poligonos'],
    data() {
        return {
            polygonInfo:null,
            polygons:this.poligonos??[]/*[
                {id:'TEXT1',name:"TEXT1",paths:[{    "lat": 22.219416082608827,    "lng": -101.8996223263893},{    "lat": 22.219599827067736,    "lng": -101.89972425033187},{    "lat": 22.21961472525656,    "lng": -101.89880693484878},{    "lat": 22.219381320116543,    "lng": -101.89870501090621},{    "lat": 22.219058525133985,    "lng": -101.89867282439803},{    "lat": 22.219048592968896,    "lng": -101.8995847754631},{    "lat": 22.219321727252648,    "lng": -101.89958745767211},{    "lat": 22.219322968770882,    "lng": -101.89945938219165},{    "lat": 22.219413599573972,    "lng": -101.8994600527439}]},
            ]*/,
            polEd:[],//this.nomalizaPats(this.produccion.poligono_asignacion),
            centroMap:null,
            puntosSelected:[0],
            editor:null,
            mostrarDetalle:false,
            savedVersion:false,
            creandoEditandoPol:false,
            ver_info_map:false,
            permiteImport:false,
            cambiosavanzados:false
        }
    },
    computed:{
        getPolC(){
            if(!this.creandoEditandoPol)return null;
            return this.getPolEd();
        },
        getPolor(){

            if(!this.creandoEditandoPol)return null;
            return this.getPolorO();
        },
        getEditor(){
            return this.editor??null;
        },
        getPoligonosCreados(){
            return this.polygons;
        },
        getPoligonoNew(){
            return {name:'Nuevo',paths:[],area_real:0,area_ingresada:0,editando:true}
        },
        getPoligonoProd(){
            return this.getPoligonoProduccion()
        }
        //paths,name,id
    },
    methods: {
        validaSelection(event){
            console.log('validaSelection',puntosSelected,event)
        },
        getPolEd(){
            if(this.po)
            if(!this.creandoEditandoPol)return null;
            this.centroMap=this.polEd[0]
            return {
                name:'Creando',
                paths:this.polEd
            }
        },
        getPolorO(){
            if(this.creandoEditandoPol) return this.polygonInfo;
            return null
            /*return {
                name:this.produccion.text,
                name:this.produccion.text,
                paths:this.nomalizaPats(this.produccion.poligono_asignacion)
            }*/
        },
        getPoligonoProduccion(){
            return {
                name:this.produccion.text,
                paths:this.nomalizaPats(this.produccion.poligono_asignacion)
            }
        },
        nomalizaPats(pointString){
            if (!pointString || typeof pointString !== 'string') {
                return []
            }

            return pointString.split('|').map(point => {
                const [lat, lng] = point.split(',')

                return {
                    lat: parseFloat(lat),
                    lng: parseFloat(lng)
                }
            })
        },
        recargaPoligono(event){
            //console.log('data::recargaPoligono',event)
            this.polEd=event;
        },
        cambioseleccion(event){
            console.log('data::cambioseleccion',event)
            this.puntosSelected=event;
        },
        savePolygono(polygon){
            console.log('try save',this.polygonInfo)
            if(!this.polygonInfo){
                return;
            }
            this.polygonInfo.paths=[...this.polEd]
            this.polygonInfo.id=this.polygonInfo.name??'text'
            const p={...this.polygonInfo}
            this.polygonInfo=null
            this.polygons[p.indx??this.polygons.length-1]={...p}
            this.polygons[p.indx??this.polygons.length-1].editando=false
            this.polEd=[]
            this.creandoEditandoPol=false;
            this.editor.setExternalValue(null)
            this.$emit('polygonsChange',this.polygons)
        },
        creaPoligono(){
            console.log('creando poligono',this.creandoEditandoPol)
            if(this.creandoEditandoPol) return;
            this.polygonInfo={...this.getPoligonoNew}
            this.editor.setExternalValue(null)
            this.polEd=[...this.polygonInfo.paths]
            this.creandoEditandoPol=true
            this.polygons.push(this.polygonInfo)
            //this.editor.setExternalValue(this.polEd)
            this.creandoEditandoPol=true;
        },
        editaPoligono(poligon){
            console.log(poligon, this.creandoEditandoPol)
            if(this.creandoEditandoPol) return;
            let index=this.polygons.findIndex(p=>p.id===poligon.id)
            poligon.editando=true
            this.polygonInfo=poligon
            this.polygonInfo.indx=index;
            this.editor.setExternalValue(null)
            this.polEd=[...this.polygonInfo.paths]
            /*if(index<0) return;
            
            this.polygonInfo={...poligon}
            this.polygonInfo.index=index;
            this.polygons[index].editando=true*/
            //this.editor.setExternalValue(this.polEd)
            this.creandoEditandoPol=true

        },
        cancelaEdicion(){
            this.editor.reset();
            this.polygonInfo.path=this.editor.getPresent();
            const p={...this.polygonInfo}
            this.polEd=[]
            this.editor.setExternalValue(null)
            p.edtando=false,
            this.polygons[p.indx??this.polygons.length-1]={...p}
            //console.log(this.history.getPresent())
            this.creandoEditandoPol=false;
            
        },
        savePoligono(){
            if(this.polEd.length<3) return;
        },
        deletePoligono(){

        },
        changeVerInfo(v){
            console.log('cambio info map',v)
            this.ver_info_map=v;
        },
        changeSelectedLista(idsSelected){
            this.centroMap=this.polygons.find(p=>p.id==idsSelected[0])?.paths[0]
        },
    },
    watch:{
        polEd:{
            handler:function(v){
                if(this.editor && v)
                    this.editor.setExternalValue(v)
            },
            deep:true
        },
        savedVersion:{
            deep:true,
            handler:function(v){
                if(v)
                    this.editor.confirmSave(v)
            }
        },
        // polygons:{
        //     handler:function(v){
        //         emit('polygonsChange',v)
        //     },
        //     deep:true
        // }
        // polygonInfo:{
        //     handler:function(v){
        //             console.log(v)
        //         if(v){
        //             //this.polygons[index]={...this.polygonInfo}
        //             //this.polEd=[...v.paths]
        //         }
        //     },
        //     deep:true
        // }
    },
}
</script>