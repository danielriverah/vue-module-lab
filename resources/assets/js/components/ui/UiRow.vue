<template>
    <div :class="rowClass">
      <slot />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      align: String,      // start, center, end, between, around
      vertical: Boolean,  // cambia dirección
      gap: {
        type: String,
        default: '8px'
      },
      wrap: Boolean
    },
    computed: {
      rowClass() {
        return [
          'ui-row',
          { 'ui-row-vertical': this.vertical },
          `ui-align-${this.align}`,
          { 'ui-wrap': this.wrap }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .ui-row {
    display: flex;
    gap: var(--gap, 8px);
    align-items: center;
  }
  
  .ui-row-vertical {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ui-wrap {
    flex-wrap: wrap;
  }
  
  .ui-align-between { justify-content: space-between; }
  .ui-align-around { justify-content: space-around; }
  .ui-align-center { justify-content: center; }
  .ui-align-start { justify-content: flex-start; }
  .ui-align-end { justify-content: flex-end; }
  </style>