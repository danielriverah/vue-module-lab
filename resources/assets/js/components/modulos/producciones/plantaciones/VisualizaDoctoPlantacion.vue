<template>
    <div>
        <h3>Datos del visualización</h3>
        <UiGridVue :columns="2">
            <UiInputVue v-for="(it, index) in getLabelsView" :key="index" v-bind="it" readonly />
        </UiGridVue>
        <UiGridVue :columns="4">
            <!-- #f4ff81 yellow-->
            <div class="col s12 valign-wrapper">
                <div class="card col s2 lime accent-1"><div class="card-content"></div></div>
                <div class="col s10 ">Tabla <strong id="tabla">{{ parseFloat(getDocto.areaproduccion).toFixed(2) }} (HA)</strong></div>
            </div>
            <!-- #76ff03 green-->
            <div class="col s12 valign-wrapper">
                <div class="col s2 light-green accent-3"><div class="card-content"></div></div>
                <div class="col s10 ">Zona Poduciendo <strong id="zona_produciendo">{{ parseFloat(getDocto.areaproduccion).toFixed(2) }} (HA)</strong></div>
            </div>
            <!-- #80cbc4  skyblue-->
            <div class="col s12 valign-wrapper">
                <div class="col s2 teal lighten-3"><div class="card-content"></div></div>
                <div class="col s10 ">Zona Aplicada <strong id="zona_aplicada">{{ getAreAplicada }} (HA)</strong></div>
            </div>
            <!-- #F44336 red-->
            <div class="col s12 valign-wrapper">
                <div class="col s2 red"><div class="card-content"></div></div>
                <div class="col s10 ">Zona Seleccionada <strong id="zona_seleccionada">{{ parseFloat(getDocto.areadocto).toFixed(2) }} (HA)</strong></div>
            </div>
        </UiGridVue>
        <GmapMap 
            :center="getAreas.zona_centro_costo.center" 
            :zoom="18" style="height: 400px;width:100%" class="m-2"
            :mapTypeId="'satellite'"
            >
            <GmapPolygon :paths="getAreas.zona_centro_costo.points" :options="{
                strokeColor:'#f4ff81',
                strokeOpacity:1,
                strokeWeight:3,
                fillColor:'#f4ff81',
                fillOpacity:0.3
            }"/>
            <GmapPolygon :paths="getAreas.zona_produccion.points" :options="{
                strokeColor:'#76ff03',
                strokeOpacity:1,
                strokeWeight:3,
                fillColor:'#76ff03',
                fillOpacity:0.3
            }"/>
            <GmapPolygon v-for="(item,index)  in getAreas.zonas_aplicadas" :key="index" :paths="item.points" :options="{
                strokeColor:'#80cbc4',
                strokeOpacity:1,
                strokeWeight:3,
                fillColor:'#80cbc4',
                fillOpacity:0.3
            }"/>
            <GmapPolygon v-if="getAreas.zona_aplicada" :paths="getAreas.zona_aplicada.points" :options="{
                strokeColor:'#F44336',
                strokeOpacity:1,
                strokeWeight:3,
                fillColor:'#F44336',
                fillOpacity:0.3
            }"/>
            <!-- <vue-google-polygon :paths="getAreas.zona_centro_costo" :options="{
                strokeColor:'#000',
                strokeOpacity:1,
                strokeWeight:3,
                fillColor:'#000',
                fillOpacity:0.3
            }"/>
            <vue-google-polygon :paths="getAreas.zona_aplicada" :options="{
                strokeColor:'#000',
                strokeOpacity:1,
                strokeWeight:3,
                fillColor:'#000',
                fillOpacity:0.3
            }"/> -->
        </GmapMap>
    </div>
</template>
<script>
    import UiInputVue from '@/components/ui/UiInput.vue'
    import UiGridVue from '@/components/ui/UiGrid.vue'
    export default{
        name:"VisualizaDoctoPlantacion",
        components:{
            UiGridVue,UiInputVue
        },
        props:{
            value:{
                type:Object,
                required:true
            },
            data:{
                type:Object,
                required:true
            },
        },
        data(){
            return {
                valueLocal:{...this.value},
                labels:[
                    {name:'fecha',value:'Fecha'},
                    {name:'folio',value:'Folio'},
                    {name:'lote',value:'Produccion'},
                    {name:'rancho',value:'Rancho'},
                    {name:'estatus',value:'Estado'},
                    {name:'areadocto',value:'Area (Ha)'},

                    // {name:'area',value:'Área (Ha)'},
                    // {name:'estado',value:'Estado'},
                ]
            }
        },
        computed:{
            getLabelsView(){
                const data={...(this.valueLocal??{})}
                let res=[]
                this.labels.forEach(it => {
                    res.push({
                        label:it.value,
                        value:data[it.name],
                        readonly:true
                    })
                })
                // Object.keys(data).forEach(key => {
                //     res.push({
                //         label:key,
                //         value:data[key],
                //         readonly:true
                //     })
                // })
                console.log(data,res)
                return res;
            },
            getAreas(){
                const docto=this.getDocto;
                const p1=this.pointsStringsToArray(docto.zona_centro_costo);
                const c1=this.getCenterMap(p1);
                const p2=this.pointsStringsToArray(docto.zona_produccion);
                const c2=this.getCenterMap(p2);
                const p3=this.pointsStringsToArray(docto.zona_aplicada??'');
                const c3=this.getCenterMap(p3);
                const res={
                    zona_centro_costo:{points:p1,center:c1},
                    zona_produccion:{points:p2,center:c2},
                    zonas_aplicadas:this.getZonasAplicadas.filter(f=>f.docto_produccion_id!=docto.docto_produccion_id),
                    zona_aplicada:{points:p3,center:c3},
                }
                console.log(res,docto)
                return res;
            },
            getZonasAplicadas(){
                const zonas=[...this.data?.zonas_aplicadas??[]]
                return zonas.map(zona=>{
                    let puntos=this.pointsStringsToArray(zona.poligono)
                    zona.points=puntos,
                    zona.center=this.getCenterMap(puntos)
                    return zona
                })
            },
            getDocto(){
                let dato= this.data?.plantacion??{};
                console.log(dato,this.data)
                if(!dato){
                    dato=this.valueLocal
                }
                let p={};
                if(dato.aplicado && !dato.zona_aplicada && this.data){
                    p.zona_aplicada=(this.data?.zonas_aplicadas?.find(z=>z.docto_produccion_id==this.valueLocal.docto_produccion_id)??null)?.poligono??null
                }
                return {...dato,...p};
            },
            getAreAplicada(){
                let res=0;
                if(this.getZonasAplicadas){
                    res=parseFloat(this.getDocto.areadocto).toFixed(2)
                }
                return res;
            }
        },
        methods:{
            pointsStringsToArray(pointsStrings){
                if(!pointsStrings) return []
                return pointsStrings.split("|").map(point=>{
                    const [x,y]=point.split(",")
                    return {lat:parseFloat(x),lng:parseFloat(y)}
                })
            },
            getCenterMap(points){
                const center={lat:0,lng:0}
                points.forEach(point => {
                    center.lat+=point.lat
                    center.lng+=point.lng
                });
                center.lat=center.lat/points.length
                center.lng=center.lng/points.length
                return center
            }
        }
    }
</script>