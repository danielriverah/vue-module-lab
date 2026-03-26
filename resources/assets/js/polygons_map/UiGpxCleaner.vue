<template>
    <div class="cleaner">

        <div class="controls">
            <label>Distancia mínima (m)</label>
            <input type="number" v-model.number="minDistance">
    
            <label>Tolerancia línea (°)</label>
            <input type="number" v-model.number="straightTolerance">
    
            <button @click="applyClean">Aplicar Limpieza</button>
        </div>
    
        <div>
            <p>Puntos originales: {{ original.length }}</p>
            <p>Puntos limpios: {{ cleaned.length }}</p>
        </div>
  
    </div>
</template>
  
<script>
    import { cleanGpsTrack } from '@/utils/polygonClean'
    
    export default {
        props: {
            points: Array
        },
    
        data() {
        return {
            minDistance: 0.5,
            straightTolerance: 5,
            original: [],
            cleaned: []
        }
        },
    
        watch: {
            points: {
                immediate: true,
                handler(val) {
                    this.original = val
                    this.cleaned = val
                }
            }
        },
    
        methods: {
        applyClean() {
            this.cleaned = cleanGpsTrack(this.original, {
            minDistance: this.minDistance,
            straightTolerance: this.straightTolerance
            })
    
            this.$emit('cleaned', this.cleaned)
        }
        }
    }
</script>