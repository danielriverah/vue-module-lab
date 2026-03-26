<template>
    <div class="points-table">
        <UiToggleDivider v-model="mostrar">
            <template v-slot:left>
                <span>Tabla de puntos <span>{{ mostrar?'^':'⌘' }}</span></span>
            </template>
        </UiToggleDivider>
        <div v-if="mostrar">
            
            <div class="table-actions">
                <button @click="deleteSelected" :disabled="!selected.length">Eliminar seleccionados</button>
                <button @click="limpiaSeleccion" :disabled="!selected.length">Limpiar selección</button>
            </div>
            <small class="info-text">Puntos Actuales: {{ points.length }} </small>
            <small class="info-text">- Puntos Seleccionados: {{ selected.length }}</small>
            <small class="info-text">- Area: {{ getArea.toFixed(2) }} Ha</small>
            <div class="table-wrapper">
                <table class="striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Lat</th>
                            <th>Lng</th>
                            <th>Dist (m)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(p, index) in points"
                            :key="index"
                            :class="{ selected: selected.includes(index) }"
                            @click="handleSelect(index, $event)"
                        >
                            <td>{{ index + 1 }}</td>
                            <td>{{ p.lat.toFixed(6) }}</td>
                            <td>{{ p.lng.toFixed(6) }}</td>
                            <td>{{ distanceFromPrev(index).toFixed(2) }}</td>
                        </tr>
                    </tbody>
                    <!-- <tfoot>
                        <tr>
                            <td>#</td>
                            <td>Lat</td>
                            <td>Lng</td>
                            <td>Dist (m)</td>
                        </tr>
                    </tfoot> -->
                </table>
            </div>
            <small class="info-text">Puntos Actuales: {{ points.length }} </small>
            <small class="info-text">- Puntos Seleccionados: {{ selected.length }}</small>
            <small class="info-text">- Area: {{ getArea.toFixed(2) }} Ha</small>
            <div class="table-actions">
                <button @click="deleteSelected" :disabled="!selected.length">Eliminar seleccionados</button>
                <button @click="limpiaSeleccion" :disabled="!selected.length">Limpiar selección</button>
            </div>
        </div>
    </div>
</template>
  
<script>
    import { distMeters } from '@/utils/geo'
    import UiToggleDivider from '@/components/ui/UiToggleDivider.vue';
    export default {
        props: {
            points: { type: Array, default: () => [] },
            selected: { type: Array, default: () => [] }
        },
        components: {
            UiToggleDivider
        },
        data() {
            return {
                lastSelected: null,
                mostrar:false,
            }
        },
        computed:{
            getArea(){
                return this.calculateArea(this.points)
            }
            // getPointsSelected(){
            //     return this.selected
            // }
        },
        methods: {
            handleSelect(index, event) {
                let newSelection = [...this.selected]
                if(newSelection.includes(index)){
                    newSelection = newSelection.filter(i => i !== index)
                }else{
                    newSelection.push(index)
                }
                this.$emit('selected-points', newSelection)
            },
            limpiaSelectsInexist(){
                this.$emit('selected-points', this.selected.filter(i=>i<this.points.length))
            },
            deleteSelected() {
                this.$emit('deleteSelected')
            },
        
            distanceFromPrev(index) {
                if (index === 0 && (this.points.length==1)){ 
                    return 0
                }if (index === 0){ 
                    return distMeters(this.points[this.points.length-1], this.points[index])
                }
                
                return distMeters(this.points[index - 1], this.points[index])
            },
            calculateArea(paths){
                if(!paths || paths.length < 3) return 0
                const googlePaths = paths.map(p => 
                    new google.maps.LatLng(p.lat, p.lng)
                )
                let m2=google.maps.geometry.spherical.computeArea(googlePaths)
                return m2/10000;//devuelve hectareas
            },
            limpiaSeleccion(){
                this.$emit('selected-points', [])
            },
    
        },
        watch:{
            points:{
                handler(){
                    this.limpiaSelectsInexist()
                },
                deep:true
            }
        }

    }
</script>
<style scoped>
    .points-table {
        margin-top: 10px;
    }
    
    /* .table-actions {
        margin-bottom: 8px;
    } */
    
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
    }
    
    th, td {
        border: 1px solid #ccc;
        padding: 4px;
        text-align: center;
    }
    
    tr.selected {
        /* background-color: #cce5ff; */
        background-color: #cce5ff !important;
    }
    .table-wrapper {
        max-height: 480px;
        overflow-y: auto;
        border: 1px solid #ddd;
    }
    /* Header fijo */
    thead th {
        position: sticky;
        top: 0;
        background: white;
        z-index: 2;
    }
    /* Footer fijo */
    tfoot td {
        position: sticky;
        bottom: 0;
        background: white;
        z-index: 2;
    }

    .table-wrapper table {
        width: 100%;
        border-collapse: collapse;
    }
</style>