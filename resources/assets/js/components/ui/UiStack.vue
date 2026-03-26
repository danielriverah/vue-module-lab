<template>
    <div :style="{ display: 'flex', flexDirection: 'column', gap }">
      <slot />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      gap: {
        type: String,
        default: '12px'
      }
    }
  }
  </script>