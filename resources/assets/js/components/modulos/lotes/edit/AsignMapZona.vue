<template>
    <div>
        <!-- <h1>TESTER map</h1> -->
        <MapaImportacion v-if="editando"
            v-model="polyEdit"
            @action-emited="cambiosLimpieza"
            :selecteds="pointsSelecteds"
        ></MapaImportacion>
        <template v-if="!onlyView">
            <button v-if="!editando" @click="cargaEdit" :disabled="!LoteEditable">Editar</button>
            <button v-else @click="cancelaEdicion">Cancela Edición</button>
            <button @click="limpiaEdicion" :disabled="!editando">Limpiar</button>
        </template>
        <div>
            <small v-if="editando" class="info-text">Area seleccionada: {{ getArea.toFixed(2) }} Ha</small>
            <small v-else class="info-text">Area producció: {{ getArea.toFixed(2) }} Ha</small>
        </div>
        <div class="row">
            <UiMapViewBase
                :center="getCenter" 
                :poligonoProduccion="PPoligonProd"
                :poligonoOriginal="pPolOrig"
                :poligonoCreando="pEdit"
                :addPoints="editando"
                :plantaciones="plantacionesLote"
                :markersEdit="pointsSelecteds"
                @action-emited="cambiosMap"
            ></UiMapViewBase>
        </div>
    </div>
</template>
<script>
    import MapaImportacion from '@/components/Importaciones/MapaImportacion.vue';
    import UiMapViewBase from '@/components/ui/UiMapViewBase.vue';
    export default {
        props: {
            lote:{type:Object,default:()=>{}},
            onlyView:{type:Boolean,default:false}
        },
        components:{
            UiMapViewBase,MapaImportacion
        },
        mounted(){
            console.log('Component mounted. ',this.$props)
        },
        data(){
            return {
                loteLocal:{...this.lote},
                editando:false,
                polyEdit:[],
                pointsSelecteds:[]
            }
        },
        computed:{
            getArea(){
                if(this.editando)return this.calculateArea(this.polyEdit)
                return this.calculateArea(this.pLote.paths??[])
            },
            getCenter(){
                return this.pLote.paths[0]??this.pPadre.paths[0];
            },
            pPadre(){
                if(this.editando)return {...this.pLote}
                return {paths:this.normalizaPoligon(this.loteLocal.poligono_zona)};
            },
            pLote(){
                return {paths:this.normalizaPoligon(this.loteLocal.poligono_asig)};
            },
            pEdit(){
                if(!this.editando)return null
                return {paths:this.polyEdit}
            },
            pPolOrig(){
                if(!this.editando)return null;
                return {...this.pLote}
            },
            PPoligonProd(){
                if(this.editando)return null;
                return {...this.pLote}
            },
            pointsNormsSend(){
                if(this.polyEdit.length<3) return false;
                if(!this.polyEdit.every(p=>typeof p.lat=='number' && typeof p.lng=='number'))return false;
                return this.polyEdit.length>0?this.polyEdit.map(p=>`${p.lat},${p.lng}`).join('|'):'';
            },
            LoteEditable(){
                return this.loteLocal.produccion_id && ('N','ABIERTA','NORMAL').includes(this.loteLocal.estatus) && (this.loteLocal.plantaciones??[]).length==0;
            },
            plantacionesLote(){
                return this.getpoligonsPlantaciones();
            },
        },
        methods:{
            calculateArea(paths){
                if(!paths || paths.length < 3 || !window.google) return 0
                const googlePaths = paths.map(p => 
                    new google.maps.LatLng(p.lat, p.lng)
                )
                let m2=google.maps.geometry.spherical.computeArea(googlePaths)
                return m2/10000;//devuelve hectareas
            },
            cargaEdit(){
                if(this.editando) return;
                this.editando=true;
                this.polyEdit=this.pLote.paths;
            },
            normalizaPoligon(pathsString){
                let res=[];
                if(!pathsString) return res;
                pathsString.split('|').forEach((path,k) => {
                    let o = path.split(',');
                    //console.log(o);
                    res[k] = {lat:parseFloat(o[0]), lng:parseFloat(o[1])}
                })
                return res;
            },
            getpoligonsPlantaciones(){
                let res=[];
                if(this.editando)return res;
                (this.loteLocal.plantaciones??[]).forEach(p=>{
                    res.push({
                        id:p.docto_produccion_id,paths:this.normalizaPoligon(p.poligono??[]),
                        variedad:p.variedad??'Sin variedad',
                        area:p.area,

                    })
                })
                return res;
            },
            cambiosLimpieza(params){
                if(params.action=='input'){
                    this.polyEdit=params.params
                }else if(params.action=='selected-points'){
                    this.pointsSelecteds=params.params;
                }else if(params.action=='save-poligon'){
                    this.ActualizaZonaProduccion();
                }else
                console.log('cambios Limpieza',params)
            },
            cambiosMap(params){
                if(params.action=='selected-points'){
                    this.pointsSelecteds=params.params;
                }else if(params.action=="polygon-updated"){
                    this.polyEdit=params.params;
                }else
                console.log('cambiosMap',params)
            },
            cancelaEdicion(){
                this.editando=false;
                this.polyEdit=[];
                this.pointsSelecteds=[];
            },
            limpiaEdicion(){
                this.polyEdit=[];
                this.pointsSelecteds=[];
            },
            ///--               ACIONES ACIA VISTA      --///
            ActualizaZonaProduccion(){
                if(!this.pointsNormsSend) return;
                this.$emit('actualiza-zona-produccion',{produccion_id:this.loteLocal.produccion_id,newZona:this.pointsNormsSend,area:this.getArea.toFixed(2)})
                // this.$emit('actualiza-zona-produccion',{...this.loteLocal, poligono_asig:this.polyEdit})
            },
            //--        ACCIONES DESDEVISTA --//
            ///sumary
            ActualizaLote(lote){
                console.log(lote)
                this.loteLocal={...lote};
                this.polyEdit=[];
                this.pointsSelecteds=[];
                this.editando=false;
            },
            GetZonaProduccion(){
                console.log('peticion de zonas de produccioon');
            },
            GetLimitesParaSentinela2(){
                console.log('peticion de limites para sentinela 2');
            }
        }
    }
</script>
