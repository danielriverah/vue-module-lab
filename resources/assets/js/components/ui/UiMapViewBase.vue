<template>
    <GmapMap 
        :center="getCeter" 
        :zoom="18" style="height: 700px;width:100%" class="m-2"
        :mapTypeId="'satellite'"
        @click="onMapClick"
    >
        <GmapPolygon
            v-if="poligonoProduccion"
            :paths="poligonoProduccion.paths"
            :options="{
                strokeColor: '#FFF',
                fillColor: '#FFF',
                fillOpacity: .6,
                strokeWeight: 1,
                draggable:false,
                clickable:false
            }"
        />
        <template v-if="addPoints">
            <GmapPolygon  v-for="(item,index)  in polygonsView" :key="`${index}-${item.id}`" :paths="item.paths" :options="item.options"
            />
        </template>
        <template v-else>
            <GmapPolygon v-for="(item,index)  in polygonsView" :key="`${index}-${item.id}`" :paths="item.paths" :options="item.options"
                @mouseover="onPolygonHover($event, item, false)"
                @mouseout="hidePolygonInfo"
            />
        </template>
        <GmapPolygon v-if="poligonoOriginalView.paths" :paths="poligonoOriginalView.paths" :options="poligonoOriginalView.options"/>
        <!-- <GmapPolygon v-if="poligonoEditando.paths" :paths="poligonoEditando.paths" :options="poligonoEditando.options"/> -->
        <!-- @paths_changed="onPathsChanged"
        @mouseup="onMouseUp"
        @dragend="onMouseUp"
        @click="onPolygonReady" -->
        <GmapPolygon 
            v-if="poligonoEditando.paths" 
            :paths="poligonoEditando.paths" 
            :options="poligonoEditando.options"
            :zIndex="1000"
            ref="polygonEdit"
            @mouseover="onPolygonHover($event, poligonoEditando, true)"
            @mouseout="hidePolygonInfo"
        />
        <GmapPolygon
            v-for="(it, index) in plantaciones" :key="index" 
            :paths="it.paths" 
            :options="{
                strokeColor: '#FFF',
                fillColor: '#000',
                fillOpacity: .3,
                strokeWeight: 1,
                draggable:false,
                clickable:true
            }" 
            @mouseover="onPolygonVarHover($event, it, false)"
            @mouseout="hidePolygonVarInfo"
        />
        <GmapMarker
            v-for="item in puntosConMeta"
            :key="item.index"
            :position="item.point"
            :draggable="true"
            :label="{
                text: String(item.index + 1),
                color: item.selected ? '#fff' : '#000'
            }"
            :icon="getMarkerIcon(item.selected)"
            :zIndex="9999"
            @click="toggleSelect(item.index)"
            @dragend="onDragPoint($event, item.index)"
            @mouseover="showTooltip(item)"
            @mouseout="hideTooltip"
        />
        <GmapMarker
            v-for="(mid, i) in midPoints"
            :key="'mid-'+i"
            :position="mid.position"
            :draggable="true"
            :clickable="false"
            :icon="midPointIcon"
            :zIndex="9000"
            @dragend="convertMidToReal($event,mid)"
        />
        <GmapInfoWindow
                v-if="tooltipData && ver_info_map"
                :position="tooltipPosition"
                :opened="true"
                :options="infoWindowOptions"
            >
            <div style="font-size:12px;">
                <b>Punto {{ tooltipData.index + 1 }}</b><br>
                Distancia: {{ tooltipData.distance }} m
            </div>
        </GmapInfoWindow>
        <GmapInfoWindow
            v-if="polygonInfo &&ver_info_map"
            :position="polygonInfoPosition"
            :opened="true"
            :options="polygonInfoOptions"
            >
            <div style="font-size:13px;">
                <div v-if="polygonInfo.id">
                <strong>{{ polygonInfo.id }}</strong><br>
                </div>
                Área: {{ polygonInfo.area }} Ha
            </div>
        </GmapInfoWindow>
        <GmapInfoWindow
            v-if="polygonVarInfo"
            :position="polygonVarInfoPosition"
            :opened="true"
            :options="polygonInfoOptions"
            >
            <div style="font-size:13px;">
                <div v-if="polygonVarInfo.variedad">
                <strong>{{ polygonVarInfo.variedad }}</strong><br>
                </div>
                Área: {{ polygonVarInfo.area }} Ha
            </div>
        ></GmapInfoWindow>
        
        <!-- <GmapPolygon :paths="getAreas.zona_centro_costo.points" :options="{
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
        }"/> -->
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
</template>
<script>
    export default {
        name:'UiMapViewBase',
        mounted(){
            console.log('poligonoCreando',this.$props);
        },
        props:{
            center:{
                type:Object,
                default:()=>({
                    lat:22.219416082608827,
                    lng:-101.8996223263893
                })
            },
            listaVer:Array,
            poligonoCreando:Object,
            poligonoOriginal:Object,
            ocultarPoligonsVer:{type:Boolean,default:false},
            addPoints:{type:Boolean,default:false},
            markersEdit:Array,
            poligonoProduccion:Object,
            ver_info_map:{
                type:Boolean,
                default:true
            },
            plantaciones:{
                type:Array,
                default:()=>[]
            }
        },
        data(){
            return {
                polygon:{...this.poligonoCreando??{}},
                ocultar_poligons_ver:this.ocultarPoligonsVer??false,
                //modoAgregarPuntos:this.addPoints??true,
                selectedPoints:[...(this.markersEdit??[])],
                tooltipData: null,
                tooltipPosition: null,
                polygonInfo: null,
                polygonInfoPosition: null,
                polygonVarInfo: null,
                polygonVarInfoPosition: null,
            }
        },
        computed:{
            infoWindowOptions(){
                return {
                    pixelOffset: new google.maps.Size(0, -30)
                }
            },
            polygonInfoOptions(){
                return {
                    pixelOffset: new google.maps.Size(0, -10)
                }
            },
            puntosConMeta(){
                if(!this.polygon?.paths || !this.addPoints) return []
                return this.polygon.paths.map((p, index) => {
                    let prevIndex = index === 0 
                        ? this.polygon.paths.length - 1
                        : index - 1

                    let prevPoint = this.polygon.paths[prevIndex]

                    return {
                        index,
                        point: p,
                        distance: this.getDistance(p, prevPoint),
                        selected: this.selectedPoints.includes(index)
                    }
                })
            },
            midPoints(){
                if(!this.polygon?.paths || this.polygon.paths.length < 2 || !this.addPoints) return []

                const mids = []
                const paths = this.polygon.paths

                for(let i = 0; i < paths.length; i++){
                    const current = paths[i]
                    const next = i === paths.length - 1
                        ? paths[0]
                        : paths[i+1]

                    const mid = {
                        lat: (current.lat + next.lat) / 2,
                        lng: (current.lng + next.lng) / 2
                    }

                    mids.push({
                        position: mid,
                        insertIndex: i + 1 > paths.length ? paths.length : i + 1
                    })
                }

                return mids
            },
            getCeter(){
                return this.center??{lat:10.458194,lng:-66.583441}
            },
            polygonsView(){
                if(this.ocultar_poligons_ver)return [];
                let res= [...this.listaVer??[]]
                return res.map(p=>{
                    p.options=this.getSettingsPol({strokeColor:'#76ff03',fillColor:'#76ff03'});
                    return p;
                })
            },
            poligonoEditando(){
                //#80cbc4 greee-blue
                let res={...this.polygon??{}}
                res.options=this.getSettingsPol({strokeColor:'#F44336',fillColor:'#F44336',editable:false});
                return res;
            },
            poligonoOriginalView(){
                //#F44336 red
                let res={...this.poligonoOriginal??{}}
                res.options=this.getSettingsPol({strokeColor:'#80cbc4',fillColor:'#80cbc4'});
                return res;
            },
            midPointIcon(){
                if(!window.google) return null
                return {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 5,
                    fillColor: '#ffffff',
                    fillOpacity: 1,
                    strokeColor: '#000',
                    strokeWeight: 1
                }
            },
        },
        methods:{
            showTooltip(item){
                this.tooltipData = item
                this.tooltipPosition = item.point
            },
            hideTooltip(){
                this.tooltipData = null
            },
            onPolygonHover(event, polygon, isEditing){
                const area = this.calculateArea(polygon.paths)
                this.polygonInfo = {
                    name: polygon.id || (isEditing ? null : 'Sin nombre'),
                    area: area?area.toFixed(2):area
                }
                this.polygonInfoPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
                }
            },
            hidePolygonInfo(){
                this.polygonInfo = null
            },
            onPolygonVarHover(event, polygon, isEditing){
                console.log(polygon)
                //const area = this.calculateArea(polygon.paths)
                // this.polygonVarInfo = {
                //     name: polygon.id || (isEditing ? null : 'Sin nombre'),
                //     area: area?area.toFixed(2):area
                // }
                this.polygonVarInfo={...polygon}
                this.polygonVarInfoPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
                }
            },
            hidePolygonVarInfo(){
                this.polygonVarInfo = null
            },
            getSettingsPol(opts={}){
                return {...{
                    strokeColor:'#000',
                    strokeOpacity:1,
                    strokeWeight:3,
                    fillColor:'#000',
                    fillOpacity:0.3,
                    editable:false
                },...(opts??{})}
            },
            getDistance(p1, p2){
                if(!p1 || !p2) return 0

                const R = 6371000
                const toRad = x => x * Math.PI / 180

                const dLat = toRad(p2.lat - p1.lat)
                const dLng = toRad(p2.lng - p1.lng)

                const a =
                    Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(toRad(p1.lat)) *
                    Math.cos(toRad(p2.lat)) *
                    Math.sin(dLng/2) * Math.sin(dLng/2)

                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

                return (R * c).toFixed(2)
            },
            calculateArea(paths){
                if(!paths || paths.length < 3) return 0

                const googlePaths = paths.map(p => 
                new google.maps.LatLng(p.lat, p.lng)
                )

                let m2=google.maps.geometry.spherical.computeArea(googlePaths)
                return m2/10000;//devuelve hectareas
            },
            onMapClick(event){
                //console.log(event,this.modoAgregarPuntos)
                if(!this.addPoints) return
                const lat = event.latLng.lat()
                const lng = event.latLng.lng()
                if(!this.polygon || !this.polygon.paths){
                    this.polygon = {
                        paths: [],
                        options: this.getSettingsPol({
                            strokeColor:'#F44336',
                            fillColor:'#F44336',
                            editable:false
                        })
                    }
                }
                this.polygon.paths.push({lat,lng})
                this.emitPolygon()
            },
            // onPolygonReady() {
            //     this.$nextTick(() => {
            //         const polygon = this.$refs.polygonEdit?.$polygonObject
            //         if (!polygon) return
            //         const path = polygon.getPath()
            //         path.addListener('set_at', () => {
            //             this.emitNewPaths(path)
            //         })
            //         path.addListener('insert_at', () => {
            //             this.emitNewPaths(path)
            //         })
            //         path.addListener('remove_at', () => {
            //             this.emitNewPaths(path)
            //         })
            //     })
            // },

            // onPathsChanged() {
            //     const polygon = this.$refs.polygonEdit?.$polygonObject
            //     if (!polygon) return
            //     this.emitNewPaths(polygon.getPath())
            // },

            // onMouseUp() {
            //     const polygon = this.$refs.polygonEdit?.$polygonObject
            //     if (!polygon) return
            //     this.emitNewPaths(polygon.getPath())
            // },

            // emitNewPaths(path) {
            //     const newPaths = []

            //     for (let i = 0; i < path.getLength(); i++) {
            //         const point = path.getAt(i)
            //         newPaths.push({
            //             lat: point.lat(),
            //             lng: point.lng()
            //         })
            //     }

            //     this.$emit('polygon-updated', newPaths)
            // },
            getMarkerIcon(selected){
                if(!window.google) return null
                return {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: selected ? 10 : 7,
                    fillColor: selected ? '#F44336' : '#f47236',
                    fillOpacity: 1,
                    strokeWeight: 1
                }
            },
            onDragPoint(event, index){
                this.polygon.paths.splice(index, 1, {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
                })
                this.emitPolygon()
            },
            toggleSelect(index){
                const i = this.selectedPoints.indexOf(index)

                if(i >= 0){
                    this.selectedPoints.splice(i,1)
                }else{
                    this.selectedPoints.push(index)
                }
                this.emitSelection();
            },
            deleteSelectedPoints(){
                const sorted = [...this.selectedPoints].sort((a,b)=>b-a)
                sorted.forEach(index=>{
                    this.polygon.paths.splice(index,1)
                })
                this.selectedPoints = []
                this.emitPolygon()
            },
            emitPolygon(){
                this.emitActionParam('polygon-updated', [...this.polygon.paths])
                this.$emit('polygon-updated', [...this.polygon.paths])
            },
            emitSelection(){
                this.emitActionParam('selected-points', [...this.selectedPoints])
                this.$emit('selected-points', [...this.selectedPoints])
            },
            convertMidToReal(event,mid){   
                const newPoint = {
                    lat: event.latLng.lat(),
                    lng: event.latLng.lng()
                }
                this.polygon.paths.splice(mid.insertIndex, 0, newPoint)
                this.emitPolygon()
            },
            emitActionParam(action,params){
                this.$emit('action-emited',{action:action,params:params})
            }
        },
        watch:{
            poligonoCreando:{
                handler(nuevo, viejo){
                    this.polygon={...nuevo}
                },
                deep:true
            },
            markersEdit:{
                handler(nuevo, viejo){
                    console.log('cambio valor selected ppoints map')
                    this.selectedPoints=[...nuevo]
                },
                deep:true
            },
            // addPoints:{
            //     handler(nuevo, viejo){
            //         this.modoAgregarPuntos=nuevo;
            //         if(nuevo){
            //             this.selectedPoints=[]
            //         }
            //     }
            // }
        }
    }
</script>
<style scoped>
.test{
    color: #f47236;
    /* color:'#80cbc4'; */
}
</style>