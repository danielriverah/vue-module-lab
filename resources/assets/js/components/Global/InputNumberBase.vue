<template>
    <InputBase
        :tipo="'number'"
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
            value: [Number,String,null],
            label: String,
            readonly: Boolean,
            disabled: Boolean,
            placeholder: String,
            error: String,
            name: String,
            clases:String
        },
    };
</script>