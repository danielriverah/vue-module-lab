<template>
    <!-- <form @submit.prevent="onSubmit">
        <div class="row">
    
            <slot name="before" />
    
            <div
            v-for="field in fields"
            :key="field.name"
            :class="`col ${field.col || 's12'}`"
            v-show="!isHidden(field)"
            >
            <component
                :is="resolveComponent(field)"
                v-model="localForm[field.name]"
                :label="field.label"
                v-bind="field.props"
                :options="field.options"
                :readonly="isReadonly(field)"
                :disabled="isDisabled(field)"
                @input="onInput(field, $event)"
            />
            </div>
    
            <slot name="after" />
    
        </div>
    
        <slot name="footer">
            <button type="submit" class="btn">Guardar</button>
        </slot>
    </form> -->
    <form @submit.prevent="$emit('submit',$event,localForm)">
        <slot name="before" />

        <!-- :fields="fields"
        :form="localForm" -->
        <GroupInputsBase
            v-bind="datosGen"
            v-on="$listeners"
            @input="onInput"
        />

        <slot name="after" />

        <slot name="footer">
            <button type="submit" class="btn" v-if="verBtn">Guardar</button>
        </slot>
    </form>
</template>
  
<script>
    import GroupInputsBase from './GroupInputsBase.vue';
    export default{
        name: 'FormBase',
        components:{GroupInputsBase},
        mounted(){
			//console.log(this.datosGen);
		},
        props: {
            value: {
                type: Object,
                required: true
            },
            fields: {
                type: Array,
                required: true
            },
            catalogos:{
                type: Object,
                default:()=>{return {}}
            },
            errors:{
                type: Object,
                default:()=>{return {}}
            },
            rango_etapas:{
                type:Object,
                default:()=>{return {min:null,max:null}}
            },
            'hide-btn-submit':{
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                localForm: { ...this.value }
            };
        },
        computed:{
            datosGen(){
                let res={
                    form:this.localForm,
                    fields:this.fields,
                    errors:this.errors,
                    catalogos:this.catalogos,
                }
                //console.log(res)
                return res;
            },
            verBtn(){
                return !this.hideBtnSubmit;
            },
        },
        methods: {
            onInput({ name, value }) {
                console.log('onInput', name, value);
                this.localForm = { ...this.localForm, [name]: value };
                this.$emit('input', { ...this.localForm });
            }
        },
        watch: {
            value: {
                deep: true,
                handler(val) {
                    this.localForm = { ...this.localForm, ...val };
                }
            }
        },
    }
    /**
    {
         name: 'fecha_fin',              // clave en el form
        type: 'date',                   // text | number | date | select | slot
        label: 'Fecha fin',
        col: 's12 m6',                  // layout
        readonly: false,                // boolean | function(form)
        disabled: false,                // boolean | function(form)
        hidden: false,                  // boolean | function(form)
        props: {},                      // props extra al input
        options: [],                    // solo select
        component: null,                // override componente
        slot: null                      // si se renderiza por slot
    } 
    */
    /*export default {
        name: 'FormBase',
        props: {
            value: {
            type: Object,
            required: true
            },
            fields: {
            type: Array,
            required: true
            }
        },

        data() {
            return {
            localForm: { ...this.value }
            };
        },

        watch: {
            value: {
            deep: true,
            handler(val) {
                this.localForm = { ...this.localForm, ...val };
            }
            }
        },

        methods: {
            resolveComponent(field) {
            if (field.component) return field.component;

            const map = {
                text: 'BaseInputText',
                number: 'BaseInputNumber',
                date: 'BaseInputDate',
                select: 'BaseSelect'
            };

            return map[field.type] || 'BaseInputText';
            },

            isReadonly(field) {
            return typeof field.readonly === 'function'
                ? field.readonly(this.localForm)
                : !!field.readonly;
            },

            isDisabled(field) {
            return typeof field.disabled === 'function'
                ? field.disabled(this.localForm)
                : !!field.disabled;
            },

            isHidden(field) {
            return typeof field.hidden === 'function'
                ? field.hidden(this.localForm)
                : !!field.hidden;
            },

            onInput(field, value) {
            this.$emit('input', {
                ...this.localForm,
                [field.name]: value
            });

            this.$emit('change', {
                field: field.name,
                value,
                form: { ...this.localForm }
            });
            },

            onSubmit() {
            this.$emit('submit', { ...this.localForm });
            }
        }
    };*/

</script>