<template>
    <form @submit.prevent="submit">
    
        <slot name="before" :errors="localErrors" />
    
        <slot :errors="localErrors"/>
    
        <slot name="after" :errors="localErrors" />
    
        <slot name="footer">
            <button v-if="!hideBtnSubmit" class="btn" type="submit">
                Guardar
            </button>
        </slot>
    
    </form>
    </template>
    
    <script>
    import { validateForm,rules } from '@/helpers/validaForms'
    export default{
        name:'UiFormBase',
        props:{
            value:{
                type:Object,
                required:true
            },

            rules:{
                type:Object,
                default:()=>({})
            },

            errors:{
                type:Object,
                default:()=>({})
            },
            hideBtnSubmit:{
                type:Boolean,
                default:false
            }
        },
        data(){
            return{
                localErrors:{}
            }
        },
        computed:{
            allErrors(){
                return {
                    ...this.errors,
                    ...this.localErrors
                }
            }
        },
        methods:{
            submit(){
                const result = validateForm(this.value,this.rules)
                this.localErrors = result.errors
                if(!result.valid) return
                this.$emit("submit",this.value)
            }
        }
    }
    </script>

<!-- <template>
    <form @submit.prevent="$emit('submit',$event,localForm)">
        <slot name="before" />
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

</script> -->