<template>
    <div class="row">
        <!-- <div
            v-for="field in visibleFields"
            :key="field.name"
            > -->
            <!-- :class="['input-wrapper', field.col || 'col s12']" -->
            <InputFactory
                v-for="field in visibleFields"
                :key="field.name"
                :type="field.type"
                :value="resolveValorfield(field.name)"
                :label="field.label"
                :readonly="resolveBool(field.readonly)"
                :disabled="resolveBool(field.disabled)"
                :placeholder="field.placeholder"
                :options="resolveCatalogo(field.label_options)"
                :error="getErrorByName(field.name)"
                v-bind="field.props"
                @input="onInput(field.name, $event)"
                @change="forward('change', field.name, $event)"
                @blur="forward('blur', field.name, $event)"
                @focus="forward('focus', field.name, $event)"
                @inicio-change="forward('inicio-change',field.name,$event)"
                @range-change="forward('range-change',field.name,$event)"
            >
                <!-- Slots personalizados por campo -->
                <template
                    v-for="(_, slot) in $slots"
                    #[slot]
                >
                    <slot :name="slot" />
                </template>
        
                <template
                    v-for="(_, slot) in $scopedSlots"
                    #[slot]="scope"
                >
                    <slot :name="slot" v-bind="scope" />
                </template>
            </InputFactory>
        <!-- </div> -->
    </div>
</template>
  
<script>
import InputFactory from './InputFactory.vue';
    export default {
        name: 'GroupInputsBase',
        components: { InputFactory },
        mounted(){
            
        },
        props: {
            fields: {
                type: Array,
                required: true
            },
            form: {
                type: Object,
                required: true
            },
            errors: {
                type: Object,
                default: () => ({})
            },
            catalogos:{
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {
                //getValoresForm:{}
                localForm:{...this.form}
            }
        },
        computed: {
            getValoresForm(){
                return this.localForm
            },
            visibleFields() {
                return this.fields.filter(f => !this.resolveBool(f.hidden));
            },
            getCatalogos(){
                return this.catalogos;
            }
        },
        methods: {
            getErrorByName(name){
                let err=this.errors[name];
                if(Array.isArray(err)){
                    err=err[0];
                }
                return err;
            },
            resolveValorfield(lbl){
                //console.log(lbl,this.getValoresForm[lbl])
                return this.getValoresForm[lbl];
            },
            resolveCatalogo(name){
                //console.log(name,this.getCatalogos[name])
                return this.getCatalogos[name]??[];
            },
            resolveBool(prop) {
                // console.log('prop', prop);
                return typeof prop === 'function'
                    ? prop(this.localForm)
                    : !!prop;
            },
        
            onInput(name, value) {
                this.$emit('input', { name, value });
            },
        
            forward(event, name, value) {
                this.$emit(event, { name, value, form: this.localForm });
            }
        },
        watch: {
            form:{
                handler(newVal){
                    this.localForm = {...newVal}
                },
                deep:true
            }
        }

    };
</script>
    