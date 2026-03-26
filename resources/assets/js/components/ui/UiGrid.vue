<template>
    <div :style="gridStyle" class="ui-grid">
      <slot />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      columns: {
        type: Number,
        default: 2
      },
      gap: {
        type: String,
        default: '16px'
      }
    },
    computed: {
      gridStyle() {
        return {
          display: 'grid',
          gridTemplateColumns: `repeat(${this.columns}, 1fr)`,
          gap: this.gap
        }
      }
    }
  }
  </script>