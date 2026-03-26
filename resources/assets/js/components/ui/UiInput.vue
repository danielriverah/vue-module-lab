
<template>
    <div v-if="type=='checkbox'">
		<label>
			<input type="checkbox" class="filled-in" :checked="value" :value="value" v-bind="$props" @change="$emit('input', $event.target.checked)"/>
			<span v-if="label">{{ label}}</span>
			<span v-else></span>
		</label>
		<small v-if="error" class="error">{{ error }}</small>
	</div>
	<div v-else-if="type=='switch' && ($props.readonly || $props.disabled)" >
		<div>
			<label v-if="label">{{ label }}</label>
			<div class="switch">
				<label>
					{{negative}}
					<input type="checkbox"  :checked="value" :value="value"  disabled>
					<span class="lever"></span>
					{{afirmative}}
				</label>
			</div>
		</div>
	</div>
	<div v-else-if="type=='switch' && !$props.readonly && !$props.disabled" >
		<label v-if="label">{{ label }}</label>
		<div class="switch">
			<label>
				{{negative}}
				<input type="checkbox" :checked="value" :value="value" @change="$emit('input', $event.target.checked)" >
				<span class="lever"></span>
				{{afirmative}}
			</label>
		</div>
		<small v-if="error" class="error">{{ error }}</small>
	</div>
    <div v-else>
		<label>{{ label }}</label>
		<input
			ref="input"
			:type="type"
			:value="value"
			v-bind="$props"
			:class="{
				datepicker:type=='date',
				timepicker:type=='time',
			}"
			@input="$emit('input', $event.target.value)"
		/>
		<small v-if="error" class="error">{{ error }}</small>
    </div>
</template>
  
<script>
	const idiomaEsp={
		months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
		weekdays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
		weekdaysAbbrev: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']
	}
	export default {
		mounted(){
			if(this.type === 'date' && !this.browserDefault){
				this.$nextTick(()=>{
					// inicializa
					$(this.$refs.input).datepicker({
						format:'yyyy-mm-dd',
						autoClose:true,
						firstDay:1,
						showDaysInNextAndPreviousMonths:true,
						minDate:this.minDate,
						maxDate:this.maxDate,
						i18n:idiomaEsp,
						showClearBtn:true,
						// onSelect:(value)=>{
						// 	setTimeout(()=>{
						// 		this.$emit('input',this.$refs.input.value)
						// 	},200)
						// },
						onClose:()=>{
							setTimeout(()=>{
								this.$emit('input',this.$refs.input.value)
							},100)
						}
							
					})
					//oculta icono select date default
					$(this.$refs.input).attr('type','text').attr('readonly',true)
				})
			}else if(this.type === 'time' && !this.browserDefault){
				this.$nextTick(()=>{
					$(this.$refs.input).timepicker({
						autoClose:true,
						twelveHour:false,
						onCloseEnd:()=>{
							setTimeout(()=>{
								this.$emit('input',this.$refs.input.value)
							},100)
						},
						/*showHours:false,
						showMinutes:false,
						defaultTime:'now',
						fromnow:0,
						donetext:'OK',
						cleartext:'Clear',
						canceltext:'Can',
						hourText:'Hour',
						minuteText:'Minute',*/
					})
					$(this.$refs.input).attr('type','text').attr('readonly',true)
				})
			}
		},
		props: {
			value: null,
			label: String,
			type: { default: 'text' },
			error: String,
			disabled:{
				type:Boolean,
				default:false
			},
			readonly:{
				type:Boolean,
				default:false
			},
			min:{
				type:String,
				default:null
			},
			max:{type:String,default:null},
			afirmative:{type:String,default:null},
			negative:{type:String,default:null},
			browserDefault:{type:Boolean,default:false}
		},
		computed:{
			minDate(){
				if(!this.min || this.type!='date') return null;
				const res=this.esFecha(this.min) ? this.esFechaLocal(this.min) : null;
				return res
			},
			maxDate(){
				if(!this.min || this.type!='date') return null;
				const res=this.esFecha(this.max) ? this.esFechaLocal(this.max) : null;
				return res;
			},
		},
		methods:{
			esFecha(value){
				if(!value) return false;
				console.log('evaluando fecha',value);
				let dateRegex = /^\d{4}-\d{2}-\d{2}$/;
				return dateRegex.test(value);
			},
			esFechaLocal(fecha){
				const [y,m,d] = fecha.split('-')
				return new Date(y, m - 1, d)
			},
			emitInput(v){
				this.$emit('input',v)
			},
		},
	}
</script>