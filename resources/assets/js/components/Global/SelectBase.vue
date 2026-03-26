<template>
    <div class="input-field" :class="[ clases]">
        <i v-if="icono" class="material-icons prefix">{{ icono }}</i>
        <VSelect
            v-bind="$attrs"
            v-on="$listeners"
            :options="options"
            :value="value"
            :disabled="disabled"
            :placeholder="placeholder"
            :multiple="multiple"
            :label="optionLabel"
            :reduce="reduce"
            :loading="loading"

            :class="{'has-value': value !== null && value !== '' }"
        >
        </VSelect>
      <label v-if="label" class="active">{{ label }}</label>
      <span v-if="!valido" class="hepler-text red-text">{{ error }}</span>
    </div>
</template>
  
<script>
    import VSelect from './SelectSearchBase.vue';
    
    export default {
        name: 'SelectBase',
        components: { VSelect },
        inheritAttrs: false,
        props: {
            value: [Object, Array, String, Number, null],
            options: {
                type: Array,
                default: () => []
            },
            label: String,
            disabled: Boolean,
            placeholder: String,
            error: String,
            icono:String,
            multiple: Boolean,
            optionLabel: String,
            reduce:Function,
            clases:String,
            loading:{
                type:Boolean,
                default:false
            }
        },
        computed:{
            valido(){
                // if(this.error && !this.value){
                if(this.error){
                    return false
                }
                return true
            }
        }
    };
</script>
<style>
    .v-select{
        height: 59px;
        min-height: 59px;
        
    }
    .v-select .vs__dropdown-toggle{
        border:none;
    }
    .v-select [aria-expanded="false"] .vs__search{
        background: rgba(230, 230, 230, .1) !important;
        position: absolute;
    }
    .v-select .vs__selected{
        margin-top: 15px;
    }
    .hepler-text{
        position: absolute !important;
        bottom: -10px;
    }
    .input-field:has(span.hepler-text) .v-select .vs__search {
        border-bottom: 2px solid;
    }
    .invalid .v-select .vs__search{
        border-bottom: 1px solid  !important;
    }
</style>
  