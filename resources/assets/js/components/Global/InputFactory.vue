<template>
    <component
        :is="component"
        v-bind="$props"
        v-on="$listeners"
        :options="options"
    />
  </template>
  
<script>
    import InputTextBase from './InputTextBase.vue';
    import InputNumberBase from './InputNumberBase.vue';
    import InputTextareaBase from './InputTextareaBase.vue';
    import SelectBase from './SelectBase.vue';
    import InputDateBase from './InputDateBase.vue';
    import InputDateRangeBase from './InputDateRangeBase.vue';
    
    export default {
        name: 'InputFactory',
        inheritAttrs: false,
        mounted(){
            // console.log(this.rango)
        },
        props: {
            type: {
                type: String,
                default: 'text'
            },
            value: [String, Number,Object,Array,null],
            options:Array,
            label:String,
            clases:String,
            reduce:Function,
            error:String,
            readonly:{type:Boolean,default:false},
            disabled:{type:Boolean,default:false},
            placeholder:String,
            name:String,
            rango:Object,
            multiple:Boolean,
            loading:Boolean,
            optionLabel:{
                String,
                default:'nombre'
            }
        },
        computed: {
            component() {
                const map = {
                    text: InputTextBase,
                    number: InputNumberBase,
                    textarea: InputTextareaBase,
                    select: SelectBase,
                    date: InputDateBase,
                    'date-range': InputDateRangeBase
                };
                return map[this.type] || InputTextBase;
            }
        }
    };
</script>
  