<!-- <template>
	<div class="row filters-form">
		<div class="input-field col s12 l6">
			<i class="material-icons prefix">person</i>
			<BaseSelect
                :options="tractoristas"
                label="nombre_corto"
                v-model="local.operador"
                :class="{ 'has-value': !!local.operador}"
                @input="emitir"
                placeholder="Selecciona una opción"
            />
		</div>
		<div class="input-field col s12 l6">
			<i class="material-icons prefix">event</i>
			<input 
				type="date"
				:min="dateMin"
				:max="dateMax"
				v-model="local.fechaInicio"
				@change="onFechaInicioChange" 
			/>
			<input
				type="date"
				:min="dateMin"
				:max="dateMax"
				v-model="local.fechaFin"
				@change="onFechaFinChange"
			/>
			<label for="fecha">Rango de fechas</label>
		</div>
		<div class="input-field col s12">
			<i class="material-icons prefix">search</i>
			<input 
				type="text"
				v-model="local.texto"
				@input="emitir"
				placeholder="Buscar actividad"
			 />
		</div>
	</div>
</template> -->
<template>
    <div class="row filters-form">
        <div class="row col s12">
            <h5>Filtros Generales</h5>
            <GrupoInputs
                v-bind="FiltrosGen"
                @input="onInputGen"
            />
		</div>
	</div>
</template>
<script>
	import GrupoInputs from '@/components/Global/GroupInputsBase.vue';
	import UiSelect from '../../../ui/UiSelect.vue';
	export default{
		name:"ActivityFiltersForm",
		components:{GrupoInputs},
		props:{
			catalogos:{type:Object,default:()=>{return{};}},
            form:{
                type:Object,
                default:() => {return{
                    tractorista:null,
                    buscar:'',
                    rango:{inicio:null,fin:null},
                }}
            },
			rango:{
				type:Object,
				default:() => {return{min:false,max:false};}
			},
		},
		data(){
			return {
				emitdFiltros:{
                    tractorista:true,
                    buscar:true,
                    rango:true,
                },
				fields:[
                    {type:'select',name:'tractorista',label:"Operador",label_options:'tractoristas',props:{clases:'col s12 m12 l6'}},
					{name:'rango',label:"Rango de fechas",type:'date-range',props:{clases:"col s12 m12 l6",rango:{min:null,max:null}}},
					{name:'buscar',label:"Buscar",type:'text',props:{clases:"col s12"},},  
                    // {type:'select',name:'rancho',label:"Rancho",label_options:'ranchos',props:{clases:'col s12 m6 l6'}},
                    // {type:'select',name:'zona',label:"Zona producción",label_options:'tablas',props:{clases:'col s12 m6 l6'}},
                    // {type:'select',name:'produccion',label:"Producción",label_options:'producciones',props:{clases:'col s12 m6 l6'}},
                    // {name:'text',label:"TEXTO",type:'text',props:{clases:"col s6"},},    
                    // {name:'number',label:"Numerico",type:'number',props:{clases:"col s6"},},
                    // {name:'textarea',label:"Text Area",type:'textarea',props:{clases:"col s6"},},
                    // {name:'select',label:"Select v",type:'select',label_option:'opciones_select',props:{'reduce':item=>item.id,clases:"col s6"},},
                    // {name:'date',label:"Fecha",type:'date',props:{clases:"col s6"},},
                    // {name:'date_range',label:"Rango de fechas",type:'date-range',props:{clases:"col s6",rango:{min:'2026-01-05',max:'2026-01-29'}}},
                ],
			}
		},
		computed:{
            FiltrosGen(){
                let res={}
				this.fields.find(f=>f.name=='rango').props.rango=this.rango
                res.fields=this.fields;
                const cats={};
                cats.tractoristas=this.catalogos.tractoristas??[];
                res.catalogos=cats;
                res.form=this.form
                return res;
            },
		},
		methods:{
			onInputGen(values) {
                // console.log(values)
                if ((values.name in this.emitdFiltros)) {
                    // console.log(values)
                    this.$emit('filtro-activ-change-'+values.name,values.value)
                }
                if (!(values.name in this.form)) {
                    this.$set(this.form, values.name, values.value ?? '');
                } else {
                    this.form[values.name] = values.value ?? '';
                }
                
            },
		}
	}
	/*export default {
		props: {
			operadores: Array,
			rango: Object,
			value: Object
		},
		mounted(){
			
		},
		data() {
			return {
				operador: null,
				fechaInicio: null,
				fechaFin: null,
				texto: '',
				local: { ...this.value }
			}
		},
		computed: {
			tractoristas() {
				return [
					{ id: null, nombre_corto: 'Todos los operadores' },
					...this.operadores
				];
			},
			dateMin(){
				console.log(this.rango)
				return this.rango.min??false
			},
			dateMax(){
				return this.rango.max??false
			}
		},
		methods: {
			emitir() {
				this.$emit('input', { ...this.local });
			}
		},
		watch: {
			value: {
			deep: true,
			handler(val) {
				this.local = { ...this.local, ...val };
			}
			}
		},
		methods: {
			onFechaInicioChange() {
				if (
					this.local.fechaInicio &&
					this.local.fechaFin &&
					this.local.fechaInicio > this.local.fechaFin
				) {
					this.local.fechaFin = this.local.fechaInicio;
				}

				this.emitir();
			},

			onFechaFinChange() {
					if (
						this.local.fechaInicio &&
						this.local.fechaFin &&
						this.local.fechaFin < this.local.fechaInicio
					) {
						this.local.fechaInicio = this.local.fechaFin;
					}

					this.emitir();
				},

			emitir() {
				this.$emit('input', { ...this.local });
			}
		},
	}*/
</script>

<style scoped>
.filters-form {
  margin-bottom: 8px;
}
</style>
