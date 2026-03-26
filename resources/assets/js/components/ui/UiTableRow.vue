<template>
    <tr
        :class="{ 'selected': selected }"
        @click="handleClick"
        @dblclick="handleDblClick"
    >
        <slot :row="row"></slot>
    
        <td v-if="$slots.actions">
            <slot name="actions" :row="row"></slot>
        </td>
    </tr>
</template>
  
<script>
    export default {
        name: 'UiRow',
        props: {
            row: {
                type: Object,
                required: true
            },
            selected: Boolean,
        },
    
        methods: {

            handleClick() {
                this.$emit('click', this.row)
            },
        
            handleDblClick() {
                this.$emit('dblclick', this.row)
            }
        }
    }
</script>