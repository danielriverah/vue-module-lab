<template>
    <div
        class="polygon-item"
        :class="{ selected }"
        @click="$emit('toggle')"
    >
        <!-- Nombre -->
        <div class="info">
            <strong class="namePolygon">{{ foliop }}-<input @input="$emit('input',polygon)" v-if="polygon.editando" type="text" v-model="polygon.name"> <span v-else>{{ polygon.name }}</span></strong>
            <small class="infoPolygon">{{ polygon.paths.length }} puntos de <span>area:{{ (calculateArea(polygon.paths).toFixed(2)) }}</span></small>
            <strong class="areaPolygon">Area ajustada: <input @input="$emit('input',polygon)" v-if="polygon.editando" type="number" v-model.number="polygon.area_ingresada" ><span v-else>{{ polygon.area_ingresada }}</span></strong>
        </div>
        <!-- Miniatura -->
        <canvas ref="thumb" width="80" height="60"></canvas>
        <template>
            <div class="col s12 row  center tooltipped" data-tooltip="Si no selecciona algún sub-Lote se prorratea en todos en caso que exista algún gasto en el lote principal.">
                            <div class="switch center">
                                <label>
                                    NO
                                    <input type="checkbox" v-model="polygon.prorratear" :checked="polygon.prorratear">
                                    <span class="lever"></span>
                                    SÍ
                                </label>
                            </div>
                        </div>
        </template>
    
        
  
    </div>
</template>
  
<script>
    export default {
        props: {
            foliop:String,
            polygon: Object,
            selected: Boolean
        },
    
        mounted() {
            this.drawThumbnail()
        },
    
        methods: {
            drawThumbnail() {
                this.limpiaCanv();
                const canvas = this.$refs.thumb
                const ctx = canvas.getContext('2d')
                const pts = this.polygon.paths
                if (!pts.length) return
        
                const minLat = Math.min(...pts.map(p => p.lat))
                const maxLat = Math.max(...pts.map(p => p.lat))
                const minLng = Math.min(...pts.map(p => p.lng))
                const maxLng = Math.max(...pts.map(p => p.lng))
        
                const scaleX = canvas.width / (maxLng - minLng || 1)
                const scaleY = canvas.height / (maxLat - minLat || 1)
        
                ctx.beginPath()
                pts.forEach((p, i) => {
                const x = (p.lng - minLng) * scaleX
                const y = canvas.height - (p.lat - minLat) * scaleY
                if (i === 0) ctx.moveTo(x, y)
                else ctx.lineTo(x, y)
                })
                ctx.closePath()
                ctx.stroke()
            },
            limpiaCanv(){
                const canvas = this.$refs.thumb
                const ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            },
            calculateArea(paths){
                if(!paths || paths.length < 3) return 0

                const googlePaths = paths.map(p => 
                new google.maps.LatLng(p.lat, p.lng)
                )

                let m2=google.maps.geometry.spherical.computeArea(googlePaths)
                return m2/10000;//devuelve hectareas
            },
        },
        watch:{
            ['polygon.points']:{
                handler(){this.drawThumbnail()},
                deep:true
            }
        }
    }
</script>
  
<style scoped>
    .polygon-item {
        /* display: flex; */
        gap: 10px;
        padding: 8px;
        border: 1px solid #ccc;
        cursor: pointer;
        width: 100%;
    }
    .polygon-item.selected {
        background: #e3f2fd;
    }
    .namePolygon{
        display: block;
        font-size: 14px;
        width: 100%;
    }
    .infoPolygon{
        display: block;
        font-size: 12px;
        width: 100%;
        color: #666;
    }
    .namePolygon input{
        width: 20%;
        border: 1px solid #007bff;
        border-radius: 4px;
    }
    .areaPolygon{
        display: block;
        font-size: 12px;
        width: 100%;
        color: #666;
    }
    .areaPolygon{
        display: block;
        width: 100%;
        color: #007bff;
    }
    .areaPolygon input{
        width: 20%;
        border: 1px solid #007bff;
        border-radius: 4px;
    }
</style>