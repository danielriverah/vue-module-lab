
<!-- v-on="$listeners" renvia los listeners v-bind reenvia los props -->
<template>
    <InputBase
        type="text"
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
            value: [String, Number],
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
  