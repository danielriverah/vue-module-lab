<!-- <template>
    <transition name="fade">
      <div
        v-if="value"
        class="modal-overlay"
        @click.self="cerrar"
      >
        <div class="modal-container">
          <slot name="header"></slot>
  
          <div class="modal-body">
            <slot></slot>
          </div>
  
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    name: 'ModalBase',
  
    props: {
      value: {         
        type: Boolean,
        required: true
      }
    },
  
    methods: {
      cerrar() {
        this.$emit('input', false);
      }
    }
  };
  </script> -->
<template>
    <transition name="fade">
        <div
            v-if="value"
            class="modal-overlay"
            @click.self="close"
        >
            <div class="modal-container">
    
                <!-- HEADER -->
                <div v-if="$slots.head" class="modal-header">
                    <slot name="head"></slot>
                </div>
        
                <!-- BODY -->
                <div class="modal-body">
                    <slot></slot>
                </div>
        
                <!-- FOOTER (OPCIONAL) -->
                <div v-if="$slots.foot" class="modal-footer">
                    <slot name="foot"></slot>
                </div>
    
            </div>
        </div>
    </transition>
</template>
  
<script>
    export default {
        name: 'ModalBase',
    
        props: {
            value: {
                type: Boolean,
                required: true
            },
            size: {
                type: String,
                default: 'md' // sm | md | lg | xl | full
            }
        },
        computed: {
            sizeClass() {
                return `modal-${this.size}`;
            }
        },
        methods: {
        close() {
            this.$emit('input', false);
        }
        }
    };
</script>
<style scoped>
    /* Overlay */
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 5vh 5vw; /* deja espacio lateral y vertical */
        z-index: 9999;
        height: 100%;
    }

    /* Contenedor */
    .modal-container {
        background: #fff;
        border-radius: 8px;
        padding: 1.5rem;

        /* Tamaño dinámico */
        width: 100%;
        max-width: 90vw;   /* nunca más de 90% del ancho */
        max-height: 90vh;  /* nunca más de 90% del alto */

        display: flex;
        flex-direction: column;

        overflow: hidden;
    }

    /* Body scrollable */
    .modal-body {
        overflow-y: auto;
        flex: 1;
    }

    /* Footer */
    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    /* Transición */
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s ease;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }
</style>
<!-- <style scoped>
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: var(--modal-overlay-bg, rgba(0,0,0,.5));
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: var(--modal-z, 9999);
    }

    .modal-container {
        color: black;
        background: var(--modal-bg, #fff);
        border-radius: var(--modal-radius, 6px);
        padding: var(--modal-padding, 1rem);
        max-width: var(--modal-max-width, 600px);
        width: var(--modal-width, auto);
    }
    .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    
    .modal-container {
        position: absolute;
        background: #fff;
        border-radius: 6px;
        padding: 1rem;
        min-width: 300px;
        max-width: 90%;
        align-items: center;
        justify-content: center;
    }
    .modal-body{
        overflow-y: auto;
        max-height: 60vh;
    }
    
    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 1rem;
    }
</style> -->

  
  