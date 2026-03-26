<template>
    <button
		:type="nativeType"
		:class="buttonClass"
		@click="handleClick"
		:disabled="isDisabled"
    >
		<!-- Loader opcional -->
		<span v-if="loading" class="ui-btn-loader">Enviando...</span>
		<!-- Icono -->
		<i v-if="icon && !loading" class="material-symbols-outlined ui-btn-icon">{{ icon }}</i>
	
		<!-- Texto -->
		<span v-if="$slots.default && !loading" class="ui-btn-text">
			<slot />
		</span>
    </button>
</template>
  
<script>
	import{buttonAsync } from '@/mixins/buttonAsync'
	export default {
		name: 'UiButton',
		mixins:[buttonAsync],
		props: {
			icon: String,
			type: {
				type: String,
				default: 'primary' // primary, danger, success, warning
			},
			disabled: Boolean,
			nativeType: {
				type: String,
				default: 'button'
			},
			action:Function
		},
		computed: {
			isDisabled() {
				return this.disabled || this.loading
			},
			buttonClass() {
				return [
					'btn',
					`btn-${this.type}`,
					{ 'ui-btn-icon-only': this.icon && !this.$slots.default }
				]
			}
		},
		methods: {
			async handleClick(event) {
				if (this.isDisabled) return
				if(!this.action)
				this.run(async () => {
					this.$emit('click', event)
				})
				await this.run(()=>this.action(event))
			}
		}
	}
  </script>
  
<style scoped>
    .btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-size: 14px;
        transition: .2s;
    }
    
    .ui-btn-icon-only {
        padding: 6px;
        width: 34px;
        height: 34px;
        justify-content: center;
    }
    
    /* Tipos */
    .btn-primary {
        background: #1976d2;
        color: white;
    }
    
    .btn-danger {
        background: #d32f2f;
        color: white;
    }
    
    .btn-success {
        background: #388e3c;
        color: white;
    }
    .btn-flat {
        background: #dbdbdb;
        color: rgb(87, 87, 87);
    }
    
    .btn-warning {
        background: #f57c00;
        color: white;
    }
    
    .btn:hover {
        opacity: .85;
    }
    .material-symbols-outlined {
        font-size: 18px;
    }
</style>