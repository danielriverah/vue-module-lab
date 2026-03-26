<template>
    <div :class="[ !removeIF? 'input-field':'', clases]" >
        <input
            v-bind="$props"
            :type="tipo"
            :value="value"
            :readonly="readonly"
            :disabled="disabled"
            :placeholder="placeholder"
            :class="{'invalid': !valido? true:false}"
            @input="$emit('input', $event.target.value)"
            @change="$emit('change',$event.target.value)"
            @blur="$emit('blur', $event.target.value)"
            @focus="$emit('focus', $event.target.value)"
        />
        <label v-if="label" :class="{active: value !== null && value !== '' }">{{ label }}</label>
        <span v-if="!valido" class="helper-text red-text">{{ error }}</span>
    </div>
</template>
<script>
    export default {
        name:'InputBase',
        props: {
            tipo: {type:String, default: 'text'},
            value: [String, Number, Boolean, Object, Array, null],
            label: String,
            readonly: Boolean,
            disabled: Boolean,
            placeholder: String,
            error: String,
            name: String,
            clases:String,
            removeIF:Boolean,
            min:String,
            max:String,
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
    }
</script>
<style>
    .invalid ~ .helper-text{
        position: absolute !important;
        bottom: -10px;
    }
    /* input.invalid{
        border-bottom: 1px solid #fb5858;
    } */
</style>