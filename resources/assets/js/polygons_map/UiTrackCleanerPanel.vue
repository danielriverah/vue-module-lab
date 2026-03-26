<template>
    <div class="cleaner-panel">
        <UiToggleDivider v-model="mostrar">
            <template v-slot:left>
                <span>Parametros <span>{{ mostrar?'^':'⚙' }}</span></span>
            </template>
        </UiToggleDivider>
        <div v-if="mostrar">

            <h5>Limpieza de Geometría</h5>
            
            <!-- Parámetros -->
            <div class="form-group">
                    <label>Epsilon RDP (m)</label>
                <input type="number" v-model.number="rdpEpsilon" />
                <small class="info-text">
                    Reduce puntos innecesarios manteniendo la forma general del terreno.
                    <br>
                    Si el punto se desvía menos que esta distancia, será eliminado.
                    <br>
                    <strong>Recomendado:</strong> 1 a 3 metros.
                </small>
            </div>
            <div class="form-group">
                <label>Distancia mínima entre puntos (m)</label>
                <input type="number" v-model.number="minDistance" />
                <small class="info-text">
                        Elimina puntos que estén demasiado cerca entre sí.
                    <br>
                        Útil cuando el GPS generó muchos puntos muy juntos.
                    <br>
                    <strong>Recomendado:</strong> 0.5 a 1 metro.
                </small>
            </div>
            <div class="form-group">
                <label>Tolerancia línea recta (°)</label>
                <input type="number" v-model.number="straightTolerance" />
                <small class="info-text">
                    Elimina puntos que estén casi alineados en una misma dirección.
                    <br>
                    Entre mayor sea el valor, más puntos rectos se eliminarán.
                    <br>
                    <strong>Recomendado:</strong> 3° a 8°.
                </small>
            </div>
            <!-- Acciones -->
            <!-- <div class="actions">
                <button @click="preview">Previsualizar</button>
                <button @click="apply">Aplicar</button>
                <button @click="$emit('revert')">Revertir cambios</button>
            </div> -->
        </div>
    
        <hr />
    
        <div class="extra-actions">
            <button @click="applyRdp">Aplicar RDP</button>
            <button @click="removeNearPoints">Quitar puntos cercanos</button>
            <button @click="removeCollinearPoints">Quitar colineales</button>
            <!-- <button @click="reorderPoints">Reordenar puntos</button> -->
            <button @click="validateIntersections">Validar cruces</button>
        </div>
    
        <div class="stats">
            <p>Puntos actuales: {{ points.length }}</p>
            <p v-if="previewPoints">Preview: {{ previewPoints.length }}</p>
            <p v-if="hasIntersection" class="error">
            ⚠ El polígono tiene cruces.
            </p>
        </div>
  
    </div>
</template>
  
<script>
    import { removeNear, removeCollinear,sortClockwise,hasSelfIntersection } from '@/utils/cleanTrack'
    import { rdpSimplify } from '@/utils/rdp'
    import UiToggleDivider from '@/components/ui/UiToggleDivider.vue';
    //import { sortClockwise, hasSelfIntersection,cleanGpsTrack } from '@/utils/polygonClean'
    //import {createHistory,pushState,undo,redo,deepCopy} from '@/utils/history'
    
    export default {
        name: 'UiTrackCleanerPanel',
        components:{
            UiToggleDivider
        },
        props: {
            p_points: { type: Array, default: () => [] }
        },
        data() {
            return {
                minDistance: 0.5,
                straightTolerance: 5,
                rdpEpsilon: 1,
                previewPoints: null,
                hasIntersection: false,
                mostrar:false
            }
        },
        computed: {
            points() {
                return this.p_points
            }
        },
        methods: {
    
            preview() {
                let cleaned = [...this.points]
                cleaned = removeNear(cleaned, this.minDistance)
                cleaned = removeCollinear(cleaned, this.straightTolerance)
        
                this.previewPoints = cleaned
                this.$emit('preview', cleaned)
            },
        
            apply() {
                if (!this.previewPoints) this.preview()
                this.$emit('applyClean', this.previewPoints)
                this.previewPoints = null
            },
        
            removeNearPoints() {
                const cleaned = removeNear(this.points, this.minDistance)
                this.$emit('applyClean', cleaned)
            },
        
            removeCollinearPoints() {
                const cleaned = removeCollinear(this.points, this.straightTolerance)
                this.$emit('applyClean', cleaned)
            },
        
            applyRdp() {
                const simplified = rdpSimplify(this.points, this.rdpEpsilon)
                this.$emit('applyClean', simplified)
            },
        
            reorderPoints() {
                const sorted = sortClockwise(this.points)
                this.$emit('applyClean', sorted)
            },
        
            validateIntersections() {
                this.hasIntersection = hasSelfIntersection(this.points)
            }
    
        },
        // watch:{
        //     p_points: {
        //         immediate: true,
        //         handler(val) {
        //             console.log('p_points cambiaron a::',val)
        //             this.previewPoints = val
        //             this.points = val
        //         }
        //     }
        // }
    }
</script>
  
<style>
    .cleaner-panel {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
    }
    
    .actions, .extra-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .stats {
        font-size: 14px;
    }
    
    .error {
        color: red;
    }
    .info-text{
        color: rgba(137, 43, 226, 0.668);

    }
</style>