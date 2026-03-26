<template>
    <div> 
        <UiGrid :columns="2">
            
            <div :class="{'end-despliege':canImportL}">
                <UiToggleDivider v-model="canImportL">
                    <template v-slot:left>
                        <span>
                            Importación <span>{{ canImportL?'^':'...' }}</span>
                        </span>
                    </template>
                </UiToggleDivider>
                <UiGpxImportWizard v-if="canImportL && value"
                    :value="value"
                    :selected="selecteds"
                    @ready="importPoints"
                    @selected-points="emitirAccionJs('selected-points',$event)"
                />
            </div>
            
            <div :class="{'end-despliege':canSettingAvanzadosL}">
                <UiToggleDivider v-model="canSettingAvanzadosL">
                    <template v-slot:left>
                        <span>Limpia poligono <span>{{ canSettingAvanzadosL?'^':'...' }}</span></span>
                    </template>
                </UiToggleDivider>
                <UiTrackCleanerPanel v-if="canSettingAvanzadosL && value"
                    :p_points="value"
                    @applyClean="importPoints"
                ></UiTrackCleanerPanel>
            </div>
        </UiGrid>
        <div v-if="historialInited & verBotonesHistorial" class="polygon-history-controls">
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
        </div>
    </div>
</template>
<script>
import UiGpxImportWizard from '@/polygons_map/UiGpxImportWizard.vue';
import UiTrackCleanerPanel from '@/polygons_map/UiTrackCleanerPanel.vue';
import UiGrid from '@/components/ui/UiGrid.vue';
import { useEditableState } from '@/utils/ui/useEditableState'
import UiToggleDivider from '@/components/ui/UiToggleDivider.vue';
export default {
    name: "MapaImportacion",
    components:{
        UiGpxImportWizard,
        UiTrackCleanerPanel,
        UiGrid,
        UiToggleDivider
    },
    props:{
        value:{
            type:Array,
            default:()=>[]
        },
        verBotonesHistorial:{
            type:Boolean,
            default:true
        },
        // history:Object,
        selecteds:{type:Array,
            default:()=>[]},
        editando:{
            type:Boolean,
            default:true
        },
        permiteImport:{
            type:Boolean,
            default:false
        },
        cambiosavanzados:{
            type:Boolean,
            default:false
        },
        // ver_info:{
        //     type:Boolean,
        //     default:true
        // },
    },
    mounted(){
        console.log('Monto MapaImportacion: ',this.$props)
        //console.log('entro al componente');
        //console.log(useEditableState)
        try{
            this.historyLocal=useEditableState(null, { maxHistory:50 })
            this.historyLocal.setExternalValue(null)
        }catch(e){console.log(e)}
        //console.log(this.editor,useEditableState)
    },
    data(){
        return {
            points:[...(this.value??[])],
            //pointsSelected:[...this.selecteds],
            historyLocal:null,
            historyVersion: 0,
            // mostrarDetalle:this.ver_info??false,
            canImportL:false,
            canSettingAvanzadosL:false,
        }
    },
    computed:{
        numberColumns(){
            return (this.permiteImport && this.cambiosavanzados)?2:1;
        },
        canImport(){
            return this.permiteImport && this.editando
        },
        canSettingAvanzados(){
            return this.cambiosavanzados && this.editando
        },
        canUndo(){
            this.historyVersion;
            return this.historyLocal.canUndo();
        },
        canRedo(){
            
            this.historyVersion;
            return this.historyLocal.canRedo();
        },
        canReset(){
            this.historyVersion;
            return this.historyLocal.canReset();
        },
        canSave(){
            this.historyVersion;
            return this.historyLocal.isDirty();
        },
        historialInited(){
            this.historyVersion;
            return this.historyLocal?true:false;
            // return this.historyLocal?this.historyLocal.isDirty():false;
        }
    },
    methods:{
        handleUndo(){
            console.log(this.historyLocal.getPresent())
            this.historyLocal.undo();
            console.log(this.historyLocal.getPresent())
            //this.$emit('input',this.historyLocal.getPresent());
            this.emitirAccionJs('input',this.historyLocal.getPresent())
        },
        handleRedo(){
            this.historyLocal.redo();
            // this.$emit('input',this.historyLocal.getPresent());
            this.emitirAccionJs('input',this.historyLocal.getPresent())
        },
        handleReset(){
            //console.log(this.history.getPresent())
            this.historyLocal.reset();
            console.log(this.historyLocal.getPresent())
            // this.$emit('input',this.historyLocal.getPresent());
            this.emitirAccionJs('input',this.historyLocal.getPresent())
        },
        importPoints(points){
            console.log("puntosimported",points);
            this.historyLocal.setExternalValue(points)
            // this.$emit('input',points);
            this.emitirAccionJs('input',this.historyLocal.getPresent())
        },
        handleSave(){
            console.log(this.historyLocal.getPresent())
            if(this.historyLocal.getPresent().length>15){
                this.emitirAccionJs('message',`La poligonal tiene ${this.historyLocal.getPresent().length} puntos, esto puede ocasionar errores en el sistema. \n Favor de limpiar y volver a intentar.`)
                return;
            }
            //this.$emit('save-poligon',this.historyLocal.getPresent())
            this.emitirAccionJs('save-poligon',this.historyLocal.getPresent())
        },
        emitirAccionJs(action,params){
            this.$emit('action-emited',{action:action,params:params})
        },
        resetHistorial(){
            this.historyLocal.reset()
            this.emitirAccionJs('input',this.historyLocal.getPresent())
        },
        deleteHistorial(){
            this.historyLocal = useEditableState(null, { maxHistory:50 })
        },
        // cambioMostrarDetalle(event){
        //     this.$emit('show-info-change',event.target.checked)
        // }
    },
    watch:{
        value:{
            deep:true,
            handler(v){
                this.historyVersion++;
                console.log(v)
                console.log(this.historyLocal)
                if(!this.historyLocal){
                    console.log('inicializo historia')
                    this.historyLocal=useEditableState(null, { maxHistory:50 })
                    this.historyLocal.setExternalValue(v)
                }else{
                    if(!v){
                        this.historyLocal.setExternalValue(v)
                        this.historyLocal.setExternalValue([])
                    }else
                    this.historyLocal.setExternalValue(v)
                }
                console.log(this.historialInited,this.verBotonesHistorial)
                console.log('HistoriaActualPolygon',this.historyLocal.getPresent())
                //this.historyLocal = {...this.history};
            }
        },
        permiteImport(v){
            console.log('permiteImport cambió:', v)
        },
        cambiosavanzados(v){
            console.log('cambiosavanzados cambió:', v)
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
<style scoped>
.polygon-history-controls{
    display: flex;
    gap: 10px;
    margin-top: 10px;
}
.end-despliege{
    border-bottom: 1px dashed blue;
}
</style>