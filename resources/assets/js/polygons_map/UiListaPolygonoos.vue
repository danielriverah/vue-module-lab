<template>
    <div class="lista-poligonos">
        <div class="actions-bar">
            <!-- <button
            @click="$emit('import')"
            :disabled="(editando??true) || selectedIds.length !== 0"
            >
            Importar
            </button> -->
    
            <!-- "
            -->
            <button
                @click="emiitir('crear')"
                :disabled="canAddPoligon" 
                >
                Crear
            </button>
            <button
                @click="emiitir('edit', selectedPolygon)"
                :disabled="canEditPoligon"
            >Editar</button>
            <button
                @click="emiitir('cancela', selectedPolygon)"
                :disabled="!canAddPoligon && !canEditPoligon && !canDeletePoligon"
            >Cancelar edición</button>
            <button
                @click="emiitir('delete', selectedPolygon)"
                :disabled="canDeletePoligon"
            >Eliminar</button>
            
        <!-- 
    
            
            Editar
            </button>
    
            <button
            @click="$emit('view', selectedPolygon)"
            :disabled="(editando??true) || selectedIds.length !== 1"
            >
            Visualizar
            </button> -->
        </div>
    
        <div class="list">
            <UiGrid :columns="2">
                <UiPolygonItem
                    v-for="poly in polygons"
                    :key="poly.id"
                    :polygon="poly"
                    :foliop="foliop"
                    :selected="selectedIds.includes(poly.id)"
                    @toggle="toggleSelection(poly.id)"
                    @input="poly=$event"
                />
            </UiGrid>
        </div>
  
    </div>
</template>
  
<script>
    import UiGrid from '@/components/ui/UiGrid.vue';
    import UiPolygonItem from './UiPolygonItem.vue'
    
    export default {
        components: { UiGrid,UiPolygonItem },
        
        props: {
            foliop:String,
            polygons: Array,
            editando:Boolean,
            selsIds:Array,
            historial:Object
        },
        mounted(){
            console.log('cargo lista',this.$props)
        },
    
        data() {
            return {
                selectedIds: [...(this.selsIds??[])]
            }
        },
    
        computed: {
            formCols(){
                const w=this.$screen.width
                if (w < 576) return 2
                if (w < 768) return 5
                if (w < 992) return 7
                return 8
            },
            selectedPolygon() {
                return this.polygons.find(p => p.id === this.selectedIds[0])
            },
            
            canAddPoligon(){
                return (this.editando??true) || (this.selectedIds?.length??0) !== 0
            },
            canEditPoligon(){
                return ((this.editando??true) || this.selectedIds.length !== 1)
            },
            canDeletePoligon(){
                return this.selectedIds.length!==1
            },
            canSaveEdicion(){
                return !(this.editando??false) || (this.selectedIds.length !== 1) || !(this.historial?.isDirty? this.historial?.isDirty():false)
            },
        },
    
        methods: {
            toggleSelection(id) {
                if (this.selectedIds.includes(id)) {
                this.selectedIds = this.selectedIds.filter(i => i !== id)
                } else {
                this.selectedIds = [id] // selección simple
                }
                this.$emit('selectionChange', this.selectedIds)
            },
            limpiaSelecteds(){
                this.selectedIds = []
                this.$emit('selectionChange', this.selectedIds)
            },
            emiitir(action,params){
                this.$emit(action,params)
            },
        },
        watch:{
            selsIds(newVal){
                this.selectedIds=[...newVal]
            }
        }
    }
</script>
  
<style scoped>
    .actions-bar {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
    }
    .list {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
</style>