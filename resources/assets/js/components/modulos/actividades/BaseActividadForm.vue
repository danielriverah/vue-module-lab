<template>
    <div >
        <UiGrid :columns="formCols">
            <UiSelect v-if="!hiddeTipoActividad"
                v-model="value.tipo_docto"
                :options="catalogosLocal.conceptos" 
                optionLabel="nombre"
                optionValue="nombre"
                :reduce="r=>r.nombre"
                label="Tipo documento"
                :searching="true"
                :error="errors.tipo_docto"
            ></UiSelect>
            <UiSelect
                v-model="value.produccion"
                :options="catalogos.producciones" 
                optionLabel="nombre"
                optionValue="nombre"
                :reduce="r=>r.nombre"
                label="Producción"
                :searching="true"
                :error="errors.produccion"
            ></UiSelect>
            <UiSelect
                v-model="value.documento_estadistico"
                :options="catalogos.documentos_estadisticos" 
                optionLabel="label_select"
                optionValue="label_select"
                :reduce="r=>r.estadistico_documento_id"
                label="Etapa producción"
                :searching="true"
                :error="errors.documento_estadistico"
            ></UiSelect>
            <slot name="slot_responsable" />
            <UiInput
                type="text"
                v-model="value.nombre"
                label="Nombre de la actividad"
                :error="errors.nombre"
            ></UiInput>
            <UiInput
                type="date"
                v-model="value.fecha_inicio"
                label="Fecha inicio"
                :error="errors.fecha_inicio"
                :max="value.fecha_estimada_fin"
            ></UiInput>
            <!-- <UiInput
                type="time"
                v-model="value.time"
                label="Time"
                :error="errors.time"
            ></UiInput> -->
            <UiInput
                type="date"
                v-model="value.fecha_estimada_fin"
                label="Fecha estimada fin"
                :error="errors.fecha_estimada_fin"
                :min="value.fecha_inicio"
            ></UiInput>
            </UiGrid>
            <UiTextArea
                v-model="value.observaciones"
                label="Observaciones"
                :error="errors.observaciones"
            ></UiTextArea>
            <UiGrid :columns="formCols">
            <!-- <UiGrid :columns="2" v-if="showHoras"> -->
                <UiInput
                    v-model="value.horas"
                    label="Horas dedicadas"
                    :error="errors.horas"
                ></UiInput>
                <UiInput
                    v-model="value.horas_extra"
                    label="Horas extra"
                    :error="errors.horas_extra"
                ></UiInput>
            <!-- </UiGrid> -->
            
            <!-- <UiInput
                v-model="value.test"
                type="switch"
                label="¿Es ultima actividad?"
                afirmative="SI"
                negative="NO"
            ></UiInput> -->
        </UiGrid>
        <UiInput
                v-model="value.ultima_Actividad"
                type="checkbox"
                label="¿Es ultima actividad?"
            ></UiInput>
        <UiGrid :columns="1">
            <ActividadEmpleados
                v-if="showEmpleados"
                v-model="value.empleados"
                :empleados="catalogosLocal.empleados"
            />
            <ActividadArticulos
                v-if="showArticulos"
                v-model="value.articulos"
                :articulos="catalogosLocal.articulos"
            />
            <ActividadActivos 
                v-if="showActivos"
                v-model="value.activos"
                :activos="catalogosLocal.activos_fijos"
            />
        </UiGrid>
    </div>
</template>
<script>
    import ActividadEmpleados from './ActividadEmpleados.vue';
    import ActividadArticulos from './ActividadArticulos.vue';
    import ActividadActivos from './ActividadActivos.vue';
    import UiSelect from '../../ui/UiSelect.vue';
    import UiInput from '../../ui/UiInput.vue';
    import UiTextArea from '../../ui/UiTextArea.vue';
    import UiGrid from '../../ui/UiGrid.vue';
    export default {
        components:{
            ActividadEmpleados,
            ActividadArticulos,
            ActividadActivos,
            UiSelect,
            UiInput,
            UiTextArea,
            UiGrid
        },
        mounted(){
            console.log('mounted base actividad form:',this.$props)
        },
        props:{
            'value':{type:Object,required:true},
            'config':{type:Object,default:()=>{return {}}},
            catalogos:{type:Object,required:true},
            showEmpleados:{type:Boolean,default:true},
            showActivos:{type:Boolean,default:true},
            showArticulos:{type:Boolean,default:true},
            showHoras:{type:Boolean,default:true},
            hiddeTipoActividad:{type:Boolean,default:false},
            errors:{type:Object,default:()=>{return {}}}
        },
        data(){
            return{
                catalogosLocal:{...this.catalogos},
            }
        },
        computed:{
            formCols(){
                const w=this.$screen.width
                if (w < 576) return 1
                if (w < 768) return 2
                if (w < 992) return 3
                return 3
            },
            concpetos(){
                console.log('Obteniendo catalogos Conceptos',this.catalogosLocal.conceptos)
                return this.catalogosLocal.conceptos;
            },
        },
        methods:{
            // onInput(e){
            //     console.log(this.value)
            //     console.log('input changed',e)
            // }
        },
        watch:{
            catalogos:{
                handler(val){
                    this.catalogosLocal={...val}
                },
                deep:true
            }
        }
    }
</script>