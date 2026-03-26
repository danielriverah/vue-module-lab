<template>
    <div> 
        <UiGrid :columns="(permiteImport && cambiosavanzados)?2:1">
            <div v-if="permiteImport && editando">
                <UiGpxImportWizard
                    :value="value"
                    :selected="selecteds"
                    @ready="importPoints"
                    @selected-points="$emit('selected-points',$event)"
                />
            </div>
            <div v-if="cambiosavanzados && editando">
                <UiTrackCleanerPanel
                    :p_points="value"
                    @applyClean="importPoints"
                ></UiTrackCleanerPanel>
            </div>
        </UiGrid>
        <div v-if="history" class="polygon-history-controls">
            <button @click="handleUndo" :disabled="!canUndo">
            Undo
            </button>
            <button @click="handleRedo" :disabled="!canRedo">
            Redo
            </button>
            <button @click="handleReset" :disabled="!canReset">
            Deshacer todo
            </button>
            <button @click="handleSave" :disabled="!canSave">
            Guardar
            </button>
            <template>
                <label class="ui-checkbox" >
                    
                    <input
                    type="checkbox"
                    v-model="mostrarDetalle"
                    :checked="mostrarDetalle"
                    @change="cambioMostrarDetalle"
                    />

                    <span class="checkmark"></span>

                    <span class="label">
                        Mostrar Informacion
                    </span>

                </label>
            </template>
            <!-- ///<input type="checkbox" :checked="mostrarDetalle" @input="mostrarDetalle=!mostrarDetalle"> -->
        </div>
    </div>
</template>
<script>
import UiGpxImportWizard from '@/polygons_map/UiGpxImportWizard.vue';
import UiTrackCleanerPanel from '@/polygons_map/UiTrackCleanerPanel.vue';
import UiGrid from '../../../ui/UiGrid.vue';
export default {
    name: "MapActions",
    components:{
        UiGpxImportWizard,
        UiTrackCleanerPanel,
        UiGrid,
    },
    props:{
        value:Array,
        history:Object,
        selecteds:Array,
        editando:{
            type:Boolean,
            default:false
        },
        permiteImport:{
            type:Boolean,
            default:true
        },
        cambiosavanzados:{
            type:Boolean,
            default:true
        },
        ver_info:{
            type:Boolean,
            default:true
        },
    },
    data(){
        return {
            points:[...this.value],
            //pointsSelected:[...this.selecteds],
            historyLocal:{...(this.history??{})},
            mostrarDetalle:this.ver_info??false,
        }
    },
    computed:{
        canUndo(){
            return this.historyLocal.canUndo();
        },
        canRedo(){
            return this.historyLocal.canRedo();
        },
        canReset(){
            return this.historyLocal.canReset();
        },
        canSave(){
            return this.historyLocal.isDirty();
        },
    },
    methods:{
        handleUndo(){
            console.log(this.history.getPresent())
            this.history.undo();
            console.log(this.history.getPresent())
            this.$emit('input',this.history.getPresent());
        },
        handleRedo(){
            this.history.redo();
            this.$emit('input',this.history.getPresent());
        },
        handleReset(){
            //console.log(this.history.getPresent())
            this.history.reset();
            console.log(this.history.getPresent())
            this.$emit('input',this.history.getPresent());
        },
        importPoints(points){
            console.log("puntosimported",points);
            this.$emit('input',points);
        },
        handleSave(){
            console.log(this.history.getPresent())
            this.$emit('save-poligon',this.history.getPresent())
        },
        cambioMostrarDetalle(event){
            this.$emit('show-info-change',event.target.checked)
        }
    },
    watch:{
        value:{
            deep:true,
            handler(v){
                this.historyLocal = {...this.history};
            }
        }
    },
    // selecteds:{
    //     deep:true,
    //     handler(v){
    //         console.log(v)
    //         this.pointsSelected = [...v];
    //     }
    // }
}
</script>