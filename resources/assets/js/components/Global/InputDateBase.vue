<template>
    <InputBase
        :tipo="'date'"
        v-bind="$props"
        v-on="$listeners"
    />
</template>
  
<script>
import InputBase from './InputBase.vue';
    export default {
        name: 'InputTextBase',
        components: {
            InputBase
        },
        props: {
            value: [String],
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
    };
</script>