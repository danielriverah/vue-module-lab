<template>
    <div :class="colClass" :style="colStyle">
      <slot />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      span: Number, // 1–12
      grow: Boolean
    },
    computed: {
      colClass() {
        return ['ui-col', { 'ui-grow': this.grow }]
      },
      colStyle() {
        if (this.span) {
          return {
            flex: `0 0 ${(this.span / 12) * 100}%`
          }
        }
        return {}
      }
    }
  }
  </script>
  
  <style scoped>
  .ui-col {
    min-width: 0;
  }
  
  .ui-grow {
    flex: 1;
  }
  </style>