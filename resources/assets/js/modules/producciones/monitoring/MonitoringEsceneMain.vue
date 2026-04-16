<template>
    <div v-if="monitoring">
        <ProductionMonitoringViewer
                :production="normalizedProduction"
                :detail="normalizedDetail"
                :selectedDate="fechaSelected"
                :fechasDisponibles="fechas"
                :timeline-items="fechas"
                :scene-status="sceneStatus"
                :error="moduleError"
            />
            <!-- :preview="normalizedPreview"
            :renderer-data="effectiveRenderData"
            :timeline-items="timelineItems"
            :scene-status="sceneStatus"
            :selected-date="selectedDate"
            :loading="loading"
            :error="moduleError" -->
        <div class="row">
            <div class="col s12 m6 l6">
                <UiSelect 
                    label="FECHA DE MONITOREO"
                    v-model="fechaSelected"
                    :options="fechas"
                    :searching="true"
                    @input="changeFecha"
                ></UiSelect>
            </div>
            <div class="col s12 m6 l6">
                <UiSelect 
                    label="ESCENA"
                    v-model="escenaSelected"
                    :options="escenasIds"
                    :placeholder="'Selecciona una opción'"
                    :searching="true"
                ></UiSelect>
            </div>
        </div>
        <MonitoringEsceneView 
            v-if="getEscene"
            :escene="getEscene"
            :centro="getCentro"
            :produccion="getProduccion"
            :imagenes="getImages"
            :imagenSelected="imagenSelected"
            @imagen-change="imagenSelected=$event"
            @update-imagenes="updateImagenes"
        ></MonitoringEsceneView>
        <ProductionMonitoringActions
            :selectedDate="fechaSelected"
            :imagenes="getImages"
            :imagenSelected="imagenSelected"
            :sendingData="sendingData"
            @imagen-change="imagenSelected=$event"
            @save-image="guardaImagen"
            @save-all-images="guardaImagenes"
        /> 
            <!-- 
             -->
        <!-- :has-detail="hasDetail"
        :has-json-preview="hasJsonPreview"
        :has-svg-preview="hasSvgPreview"
        :has-png-preview="hasPngPreview"
        :can-render="canRender"
        :can-save-svg="canSaveSvg"
        :can-save-png="canSavePng"
        :loading="loading"
        :updating="updating"
        :rendering="rendering"
        :saving-svg="savingSvg"
        :saving-png="savingPng"
        :selected-date="selectedDate"
        @update="onUpdate"
        @change-date="onChangeDate"
        @render="onRenderAction"
        @save-svg="onSaveSvg"
        @save-png="onSavePng"
        @save-all="onSaveAll" -->
    </div>
    <div v-else>
        {{ 'Producción no configurada para monitorear' }}
    </div>
</template>
<script>
    //resources\assets\js\components\ui\UiSelect.vue
    import UiSelect from '@/components/ui/UiSelect.vue';
    import MonitoringEsceneView from './components/MonitoringEsceneView.vue';
    import ProductionMonitoringViewer from './components/ProductionMonitoringViewer.vue';
    import ProductionMonitoringActions from './components/ProductionMonitoringActions.vue';
    
    function isObject(value) {
        return !!value && typeof value === 'object' && !Array.isArray(value);
    }
    function unwrapDynamo(value) {
        if (!isObject(value)) return value;
        if (Object.prototype.hasOwnProperty.call(value, 'S')) return value.S;
        if (Object.prototype.hasOwnProperty.call(value, 'N')) {
            const parsed = Number(value.N);
            return Number.isNaN(parsed) ? value.N : parsed;
        }
        if (Object.prototype.hasOwnProperty.call(value, 'BOOL')) return !!value.BOOL;
        if (Object.prototype.hasOwnProperty.call(value, 'L')) return (value.L || []).map(unwrapDynamo);
        if (Object.prototype.hasOwnProperty.call(value, 'M')) {
            const out = {};
            Object.keys(value.M || {}).forEach((k) => {
            out[k] = unwrapDynamo(value.M[k]);
            });
            return out;
        }
        const out = {};
        Object.keys(value).forEach((k) => {
            out[k] = unwrapDynamo(value[k]);
        });
        return out;
    }
    function parseMysqlPolygon(value) {
        if (!value || typeof value !== 'string') return [];
        return value.split('|').map((pair) => {
            const coords = pair.split(',').map((n) => Number(String(n).trim()));
            if (coords.length < 2 || Number.isNaN(coords[0]) || Number.isNaN(coords[1])) return null;
            return { lat: coords[0], lng: coords[1] };
        }).filter(Boolean);
    }
    function bboxToPolygon(bbox) {
        if (!Array.isArray(bbox) || bbox.length < 4) return null;
        const minLon = Number(bbox[0]);
        const minLat = Number(bbox[1]);
        const maxLon = Number(bbox[2]);
        const maxLat = Number(bbox[3]);
        if ([minLon, minLat, maxLon, maxLat].some(Number.isNaN)) return null;
        return {
            type: 'Polygon',
            coordinates: [[
                [minLon, minLat],
                [maxLon, minLat],
                [maxLon, maxLat],
                [minLon, maxLat],
                [minLon, minLat]
            ]]
        };
    }
    function normalizePolygon(rawPolygon) {
        if (!rawPolygon) return null;
        if (isObject(rawPolygon) && rawPolygon.type === 'Polygon') return rawPolygon;
        if (!Array.isArray(rawPolygon)) return null;
        const ring = rawPolygon.map((point) => {
            if (!Array.isArray(point) || point.length < 2) return null;
            const lat = Number(point[0]);
            const lng = Number(point[1]);
            if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
            return [lng, lat];
        }).filter(Boolean);
        if (!ring.length) return null;
        const first = ring[0];
        const last = ring[ring.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) ring.push([first[0], first[1]]);
        return { type: 'Polygon', coordinates: [ring] };
    }
    function normalizeProduction(rawProduction) {
        const production = unwrapDynamo(rawProduction || {});
        const pboxRaw = production && production.pbox ? production.pbox : null;
        const pbox = typeof pboxRaw === 'string' ? (() => {
            try {
            return JSON.parse(pboxRaw);
            } catch (error) {
            return null;
            }
        })() : pboxRaw;
        return Object.assign({}, production, {
            poligono_points: parseMysqlPolygon(production && production.poligono),
            pbox_polygon: normalizePolygon(pbox && pbox.puntos_bbox) || bboxToPolygon(pbox && pbox.pbox)
        });
    }
    export default {
        components: {
            UiSelect,
            MonitoringEsceneView,
            ProductionMonitoringViewer,
            ProductionMonitoringActions,
        },
        props:{
            escenas:{
                type:Array,
                default:()=>{return []},
            },
            produccion:{
                type:Object,
                default:()=>{return {}},
            },
        },
        data() {
            return {
                moduleError:null,
                scenesLocal: [...(this.escenas??[])],
                sendingData:false,
                produccionLocal:this.produccion,
                fechaSelected:null,
                escenaSelected:'',
                loading:false,
                imagenes:null,
                imagenSelected:'',
            }
        },
        computed:{
            monitoring(){
                if(this.produccionLocal && this.produccionLocal.monitoring && this.fechas.length>0){
                    return true;
                }
                return false;
            },
            fechas(){
                console.log(this.scenesLocal)
                if(!this.scenesLocal || this.scenesLocal.length==0)return[];
                const fechas=this.scenesLocal.map((s)=>{return s.fecha})
                //quita repetidas
                let result=[...new Set(fechas)]
                //ordena por fecha
                result.sort((a, b) => new Date(a) - new Date(b))
                console.log(result)
                return result;
            },
            escenasIds(){
                // return this.scenesLocal.map((s)=>{if(s.fecha==this.fechaSelected)return s.clave})
                return this.scenesLocal.filter((s)=>{return s.fecha==this.fechaSelected}).map((s)=>{return s.clave})
            },
            getEscene(){
                return this.scenesLocal.filter((s)=>{return s.clave==this.escenaSelected})[0]??null;
            },
            getCentro(){
                let points=this.generaPoints(this.getProduccion.poligono_asig);
                let c=this.generaCentro(points)
                c.lon=c.lng
                return c;
            },
            getProduccion(){
                return this.produccionLocal
            },
            normalizedProduction(){
                const productionSource = (this.extractedPayload && this.extractedPayload.production) || this.produccionLocal;
                return normalizeProduction(productionSource);
            },
            normalizedDetail(){
                return this.getEscene??null;
            },
            sceneStatus(){
                let res='PENDIENTE';
                const escene=this.getEscene
                if(!escene)return null;
                if(escene.procesado)
                    res='PROCESADO'
                return res;
            },
            getImages(){
                return this.imagenes;
            },
        },
        methods:{
            generaPoints(str){
                let r=[];
                str.split('|').forEach((p)=>{
                    let pa=p.split(',')
                    r.push({lat:parseFloat(pa[0]),lng:parseFloat(pa[1])})
                })
                return r;
            },
            generaCentro(points){
                let xsum=0;
                let ysum=0;
                points.forEach((p)=>{
                    xsum+=p.lat;
                    ysum+=p.lng;
                })
                return {lat:xsum/points.length,lng:ysum/points.length}
            },
            updateImagenes(val){
                this.$set(this, 'imagenes', val);
            },
            updateImagen(val,index){
                let imgs=[...this.imagenes]
                imgs[index]=val;
                this.$set(this, 'imagenes', imgs);
            },
            changeFecha(val){
                this.escenaSelected=null;
            },
            updateEsceneByIndex(val,index){
                let esce=[...this.scenesLocal]
                esce[index]=val;
                this.$set(this, 'scenesLocal', esce);
            },
            updateEscenas(val){
                if(this.sendingData)return;
                this.setError(null)
                //console.log(val,this.scenesLocal)
                //this.scenesLocal=[...val]
                this.$set(this, 'scenesLocal', val);
            },
            updateProduccion(val,escenas){
                if(this.sendingData)return;
                this.setError(null)
                console.log(val)
                this.scenesLocal=[...(escenas??[])]
                this.produccionLocal=val
                this.updateImagenes(null);
                this.fechaSelected=null;
                this.escenaSelected=null;
            },
            guardaImagen({imagen,index}){
                console.log(imagen,index)
                if(this.sendingData)return;
                this.setError(null)
                this.sendingData=true
                this.$emit('save-imagen',{imagen,index})
            },
            guardaImagenes(imagenes){
                if(this.sendingData)return;
                this.setError(null)
                this.sendingData=true
                this.$emit('save-all-imagenes',{imagenes});
            },
            terminoSendData(){
                this.sendingData=false
            },
            setError(err){
                this.moduleError=err;
            }
        },
    }
</script>