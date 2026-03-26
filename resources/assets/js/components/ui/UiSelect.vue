<template>
    <div>
      	<label>{{ label }}</label>
		<v-select v-if="searching && !disabled && !readonly" 
			v-bind="settings" v-on="$listeners"
			:label="optionLabel" :options="options" :value="value"
			:clearable="clearable"
			:reduce="reduce"
			class="select-serching"
			:class="{invalid:error}"
		>
			<template #no-options="{ search, searching, loading }">
				<span class="grey-text">
					No hay coincidencias.
					<span v-if="searching"> para "{{ search }}"</span>.
				</span>
			</template>
		
			<template v-for="(_, slot) in $slots" #[slot]>
				<slot :name="slot" />
			</template>

			<template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
				<slot :name="slot" v-bind="scope" />
			</template>
		</v-select>
		<input v-else-if="disabled || readonly" :value="getValueDisabled" class="select-no-serching" :disabled="disabled" readonly type="text">
		<select v-else 
			class="browser-default select-no-serching" 
			:value="internalValue" @change="onChange" v-bind="settings"
			:class="{invalid:error}" 
		>
			<option disabled selected >{{settings.placeholder? settings.placeholder:'-- selecciona --'}}</option>	
			<option
				v-for="opt in options"
				:key="getOptionValue(opt)"
				:value="getOptionValue(opt)"
			>
				{{ getOptionLabel(opt) }}
			</option>
		</select>
		<button
				v-if="!searching && clearable && value && !disabled && !readonly"
				type="button"
				class="clear-btn no-search"
				@click="$emit('input', null)"
		>
		</button>
		<small v-if="error && typeof(error)=='object'" class="error">{{ error[0] }}</small>
		<small v-else-if="error" class="error">{{ error }}</small>
    </div>
</template>
  
<script>
import('vue-select/dist/vue-select.css')
import vSelect from 'vue-select';
	export default {
		name:"UiSelect",
		components: {
			vSelect
		},
		mounted(){
			//console.log(this.$props)
		},
		props: {
			loading:{
				type: Boolean,
				default: false
			},
			clearable:{
				type: Boolean,
				default: false
			},
			selected: null,
			value: null,
			label: String,
			options: Array,
			searching: {
				type: Boolean,
				default: false
			},
			optionLabel: {
				type: String,
				default: 'label'
			},
			optionValue: {
				type: String,
				default: 'value'
			},
			
			disabled:{
				type: Boolean,
				default: false
			},
			readonly:{
				type: Boolean,
				default: false
			},
			settings: {
				type:Object,
				default: () => ({
					placeholder: 'Selecciona una opción',
					clearSearchOnSelect: true,
					hideSelected: true,
					maxHeight: '200px',
				})
			},
			reduce: [Function,null],
			error:{
				type: String,
				default: null
			}
		},
		computed:{
			getValueDisabled(){
				if(!this.value) return ''
				if(typeof(this.value)=='object'){
					return this.value[this.optionLabel]
				}
				if(typeof(this.reduce)=='function' && this.reduce && typeof(this.options[0])=='object'){
					let obj=this.options.find(o=> this.reduce(o)==this.value);
					return obj[this.optionLabel];
				}
				return this.value
				// if (typeof(this.reduce)=='function' && this.reduce && typeof(this.value)!='object') {
				// 	let obj=this.options.find(o=>o[this.optionValue]==this.value);
				// 	return obj[this.optionLabel]
				// }
				// if (typeof(this.reduce)=='function' && this.reduce ) {
				// 	return this.reduce(this.value)
				// }
				// return this.value[this.optionLabel]
			},
			internalValue() {
				//console.log(typeof(this.reduce))
				if (typeof(this.reduce)=='function' && this.reduce && this.value != null) {
					// Si reduce existe, value ya es reducido
					return this.value
				}
				// Si value es objeto → extraer su id
				if (typeof this.value === 'object' && this.value !== null) {
					return this.value[this.optionValue]
				}
					return this.value
			}
		},
		methods: {
			getOptionValue(opt) {
				//console.log(typeof(this.reduce))
				if (typeof(this.reduce)=='function' && this.reduce) {
					return this.reduce(opt)
				}
				return typeof opt === 'object'
					? opt[this.optionValue]
					: opt
			},

			getOptionLabel(opt) {
				return typeof opt === 'object'
					? opt[this.optionLabel]
					: opt
			},

			onChange(event) {
				//console.log(typeof(this.reduce))
				const selectedVal = event.target.value
				const selectedObj = this.options.find(
					opt => this.getOptionValue(opt) == selectedVal
				)
				console.log(selectedObj)
				if (!selectedObj) {
					this.$emit('input', null)
					return
				}
				if (typeof(this.reduce)=='function' && this.reduce) {
					this.$emit('input', this.reduce(selectedObj))
				} else {
					this.$emit('input', selectedObj)
				}
			}
		}
	}
</script>
<style>
	small.error{
		color: #f44336;
		font-size: 12px;
		margin-top: 4px;
		display: block;
		margin-top: 0px;
	}
</style>