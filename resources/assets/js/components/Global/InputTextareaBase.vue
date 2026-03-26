<template>
    <div class="input-field" :class="clases">
        <textarea
            class="materialize-textarea"
            :value="value"
            :readonly="readonly"
            :disabled="disabled"
            :placeholder="placeholder"
            :class="{'invalid': !valido? true:false}"
            @input="$emit('input', $event.target.value)"
            @change="$emit('change', $event.target.value)"
            @blur="$emit('blur', $event.target.value)"
            @focus="$emit('focus', $event.target.value)"
        ></textarea>
        <label v-if="label" :class="{active: value!=null && value!=''}">{{ label }}</label>
        <span v-if="!valido" class="helper-text red-text" style="">{{ error }}</span>
    </div>
</template>
  
<script>
    export default {
        name: 'InputTextareaBase',
        props: {
            value: String,
            label: String,
            readonly: Boolean,
            disabled: Boolean,
            error: String,
            clases: String,
            placeholder: String,
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
    .helper-text{
        position: absolute;
    }
    /* input.invalid{
        border-bottom: 1px solid rgba(255, 0, 0, 0.509);
    } */
</style>
  