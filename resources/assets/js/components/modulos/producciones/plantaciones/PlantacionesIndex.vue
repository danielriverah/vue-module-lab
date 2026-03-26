<template>
    <div>
        <div class="card">
            <div class="card-content">
                <UiToggleDivider
                    v-model="testAbierto"
                ></UiToggleDivider>
                <tabla-index 
                    v-if="testAbierto"
                    v-model="lotes"
                    @edit="actionTabla_edit"
                    @aplicar="actionTabla_aplicar"
                    @ver="actionTabla_ver"

                ></tabla-index>
            </div>
        </div>
        <div class="fixed-action-btn direction-top active">
					<a @click.prevent="verModalVistaCreate=true" class="btn-floating btn-large waves-green waves-effect waves-light light-green accent-4 modal-trigger" 
                        title="Nueva plantación"
                    >
						<i class="large material-icons">add</i>
					</a>
				</div>
        <ModalBase 
            v-model="verModalVista"
            >
            <template slot="head"></template>
                <visualiza-plantacion
                    v-model="getPlantacionSelected" 
                    :data="getDataVer"
                ></visualiza-plantacion>
            <template slot="foot"></template>
        </ModalBase>
        <ModalBase v-model="verModalVistaCreate" >
            <template slot="head"><h4>{{ !formCreateEdit.docto_produccion_id?'Crea':'Editar' }} plantacion</h4></template>
                <docto-produccion-create
                    v-model="formCreateEdit" 
                    v-bind="getPropsCreate"
                    @input="formCreateEdit=$event"
                ></docto-produccion-create>
            <template slot="foot">
                <UiButton class="btn btn-flat" @click.prevent="verModalVistaCreate=false" color="grey">Cancelar</UiButton>
                <UiButton class="btn btn-success" @click.prevent="sendFormPlantacion" color="green">Guardar</UiButton>
            </template>
        </ModalBase>
        
    </div>
</template>
<script>
    import { mockData,dataIndex,dataVer } from '@/mock/plantacionMock';
    import TablaIndex from './TablaIndex.vue';
    import VisualizaPlantacion from './VisualizaDoctoPlantacion.vue';
    import DoctoProduccionCreate from '../doctos/DoctoProduccionCreate.vue';
    import UiButton from '../../../ui/UiButton.vue';
    import UiToggleDivider from '../../../ui/UiToggleDivider_.vue';
    export default {
        name: 'PlantacionesIndex',
        components: {
            TablaIndex,
            VisualizaPlantacion,DoctoProduccionCreate,UiButton,UiToggleDivider
        },
        mounted(){
            console.log('dataIndex',dataIndex);
        },
        props:{
            value:Object,
        },
        data() {
            return {
                lotes: this.value?.producciones??dataIndex.producciones??[],
                datos_ver:dataVer,
                cats:{
                    conceptos_producciones:dataIndex.conceptos_producciones,
                    centros_costos:dataIndex.centros_costos,
                    lotes_producciones:dataIndex.lotes_producciones,
                    programaciones_plantaciones:dataIndex.programaciones_plantaciones,
                    articulos:dataIndex.articulos,
                    articulos_producir:dataIndex.articulos_producir,
                },
                verModalVista:false,
                verModalVistaCreate:false,
                plantacionSelected:null,
                formCreateEdit:{},
                testAbierto:true,
            }
        },
        computed:{
            getPlantacionSelected(){
                
                return this.plantacionSelected;
            },
            getDataVer(){
                if(!this.plantacionSelected) return {};
                console.log('Datos Ver::',this.datos_ver,this.plantacionSelected)

                return this.datos_ver[this.plantacionSelected?.docto_produccion_id??0]??{};
            },
            getPropsCreate(){
                return {
                    cats:{
                        conceptos:this.cats.conceptos_producciones??[],
                        ranchos:this.cats.centros_costos??[],
                        lotes_producciones:this.cats.lotes_producciones??[],
                        programaciones:this.cats.programaciones_plantaciones??[],
                        articulos:this.cats.articulos??[],
                        articulos_resultados:this.cats.articulos_producir??[],
                    }
                }
            }
        },
        methods: {
            actionTabla_edit(row){
                console.log('editar',row);
                this.plantacionSelected = row;
            },
            actionTabla_aplicar(row){
                console.log('aplicar',row);
                this.plantacionSelected = row;
            },
            actionTabla_ver(row){
                console.log('ver',row);
                this.plantacionSelected = row;
                this.verModalVista=true;
            },
            sendFormPlantacion(){
                console.log('guardar',this.formCreateEdit);
                this.verModalVistaCreate=false;
            }
        }
    }
</script>