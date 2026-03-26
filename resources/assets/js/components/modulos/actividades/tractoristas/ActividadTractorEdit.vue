<template>
	<UiFormBase
		:value="form"
		:rules="rules"
		:errors="errors"
		@submit="guardar"
	>
	<!-- #default="{errors}" -->
		<template #default="{errors}">	
			<BaseActividadForm
				v-model="form"
				:config="{}"
				:catalogos="catalogosForm"
				:errors="errors"
			>
				<template slot="slot_responsable">
					<UiSelect
						v-model="form.tractorista"
						:options="getTractoristasDisponibles"
						label="Tractorista"
						optionLabel="nombre_corto"
						optionValue="nombre_corto"
						:reduce="r=>r.empleado_id"
						:searching="true"
						:error="errors.tractorista"
						@input="onInput"
					></UiSelect>
				</template>
			</BaseActividadForm>
			<!-- <UiGrid :columns="formCols">
				<UiSelect
					v-model="form.tipo_docto"
					:options="concpetos" 
					optionLabel="nombre"
					optionValue="nombre"
					placeholder="Seleccionar tipo de documento"
					:reduce="r=>r.nombre"
					label="Tipo documento"
					:searching="true"
				></UiSelect>
				<UiSelect
					v-model="form.produccion"
					:options="producciones" 
					optionLabel="nombre"
					optionValue="nombre"
					placeholder="Seleccionar tipo de documento"
					:reduce="r=>r.nombre"
					label="Tipo documento"
					:searching="true"
				></UiSelect>
			</UiGrid> -->
		</template>
	<!-- 
		{type:'select',name:'tipo_docto',label:"Tipo documento",label_options:'tipos_doctos',props:{clases:'col s12'}}, 
		{type:'select',name:'produccion',label:"Producción",label_options:'producciones',props:{clases:'col s12 m6 l6'}},
		{type:'select',name:'estadistico',label:"Etapa produccion",label_options:'estadisticos',props:{clases:'col s12 m6 l6',optionLabel:'label_select'}},
		{type:'select',name:'tractorista',label:"Tractorista",label_options:'tractoristas',props:{clases:'col s12 m6 l6'}}, 
		{type:'text',name:'nombre',label:"Actividad",props:{clases:'col s12 m6 l6'}},
		{type:'date-range',name:'fechas',label:"Perido a realizarla",props:{clases:"col s12",rango:{min:null,max:null}}},
		{type:'textarea',name:'observaciones',label:"Observaciones",props:{clases:"col s12"},},
		{type:'number',name:'horas',label:"Horas",props:{clases:'col s6 m6 l6'}},
		{type:'number',name:'horas_extra',label:"Horas_extra",props:{clases:'col s6 m6 l6'}}, 
	-->
	</UiFormBase>
</template>
<script>
	import { rules, validateForm } from "@/helpers/validaForms"
	import BaseActividadForm from '../BaseActividadForm.vue';
	import UiFormBase from '@/components/ui/UiFormBase.vue';
	import UiGrid from '@/components/ui/UiGrid.vue';
	import UiInput from '@/components/ui/UiInput.vue';
	import UiSelect from '@/components/ui/UiSelect.vue';
	import UiTextArea from '@/components/ui/UiTextArea.vue';
	export default {
		name:"ActividadTractorEdit",
		components:{UiFormBase,BaseActividadForm,UiGrid,UiInput,UiSelect,UiTextArea},
		mounted(){
			console.log('mounted activ tract edit:',this.$props)
			this.form.modulo='tractor';
		},
		props:{
			value:{type:Object,default:()=>{return {};}},
			//rules:{type:Object,default:()=>{return {};}},
			serverErrors:{type:Object,default:()=>{return {};}},
			catalogos:{type:Object,default:()=>{return {};}},
		},
		data(){
			return {
				form:{...{modulo:'tractor'},...this.value},
				errors:{...this.serverErrors},
				rules:{
					tractorista:[rules.required("El nombre es obligatorio")],
					nombre:[
						rules.required("El nombre es obligatorio"),
						rules.minLength(3)
					],
					//fechas:{required:true,custom:["fechas"]},
				},
				catalogosLocal:{
					...{},
					...this.catalogos
				}
			}
		},
		computed:{
			formCols(){
                const w=this.$screen.width
                if (w < 576) return 1
                if (w < 768) return 2
                if (w < 992) return 3
                return 4
            },
			concpetos(){
				return this.catalogosLocal.actividades_modulo_conceptos[this.form.modulo]??[];
			},
			catalogosForm(){
				return {
					...{ ...this.catalogosLocal},
					...{conceptos:this.concpetos},
					...{actividades_modulo_conceptos:null
						,tractoristas:null
						,empleados:this.getEmpledosDisponibles
						}
				}
			},
			getEmpledosDisponibles(){
				return this.catalogosLocal.empleados.filter(f=>f.empleado_id!=this.form.tractorista)
			},
			getTractoristasDisponibles(){
				const ids=this.form.empleados.map(e=>e.empleado_id)
				const c=this.catalogosLocal.tractoristas.filter(e=>!ids.includes(e.empleado_id))
				return c;
			},
		},
		
		methods:{
			guardar(form){
				console.log('guardar',form)
				this.$emit('submit',form)
			},
			onInput(v){
				// console.log('onInput',v)
				// this.$set(this.form,'tractorista',v??null)
				// //this.$emit('input', {...this.form,...v})
			}
		}
	}
</script>

<style>

</style>
<!-- <template>
	<div class="actividad" :class="mode">
		<div v-if="hasMessajeForm">
			<span>{{ getMessageForm }}</span>
		</div>
		<FormBase
			v-bind="datosGen"
			v-on="$listeners"
			:hide-btn-submit="true"
			@submit.prevent="enviarFormulario"
			@input="onInput"
		> 
			<template v-slot:after v-if="localForm.add_empleados_extra || localForm.add_recursos">
				<SelectFolioForActividad v-if="seleccionafolio">

						
				</SelectFolioForActividad>
				<TablaRecEmpls v-bind="getPropsEmpsRec" @input="onInput" ref="EmpsReqs" 
				/>
			</template>
		</FormBase>
		
	</div>
</template>

<script>
	import FormBase from '@/components/Global/FormBase.vue';
	import TablaRecEmpls from '@/components/Global/TablaRecEmpls.vue';
	import SelectFolioForActividad from './SelectFolioForActividad.vue';
    export default {
		name: 'ActividadView',
		components:{FormBase,TablaRecEmpls, SelectFolioForActividad},
		mounted(){
			console.log('mounted:',this.value)
		},
		props:{
			mode: {
				type: String,
				default: 'full'
			},
            catalogos:{type:Object,default:()=>{return{};}},
            rango_etapas:{
                type:Object,
                default:()=>{return {min:null,max:null}}
            },
			value:{type:Object,default:()=>{return {}}},
			//errors:{type:Object,default:()=>{return {}}},
			errores:{type:Object,default:()=>{return {};}},
			hideCampos:
            {
                type:Array,
                default:()=>{return [];}
            },
			disabledCampos:{
                type:Array,
                default:()=>{return [];}
            },
			desdeFolio:{
				type:Boolean,
				default:false
			}
			
        },
		data(){
			return {
				seleccionafolio:`${this.desdeFolio?true:false}`,
				tieneFolio:{
					type:Boolean,
					default:false
				},
				localForm: { ...{observaciones:null,tractorista:null,add_empleados_extra:false,add_recursos:false,empleados_extra:[],recursos:[],horas:null,horas_extra:null},...this.value },
				errors:{...this.errores},
				hideCamposLocal:[...this.hideCampos],
				disabledCamposLocal:[...this.disabledCampos],
                rules:{
                    produccion:{required:true,custom:["esUnidadProductiva"]},
                    estadistico:{required:true,custom:["esEstadistico"]},
                    tractorista:{required:true,custom:["esTractorista"]},
                    //regador:{required:true,custom:["esRegador"]},
                    nombre:{required:true,custom:["noVacio"]},
                    fechas:{required:true,custom:["fechas"]},
                    //observaciones:{required:true,custom:["noVacio"]},
                    //horas:{required:true,custom:["noVacio","esNumero","min:0","max:24"]},
                    //horas_extra:{required:true,custom:["noVacio","esNumero","min:0","max:24"]},
                },
				fields:[
					{type:'select',name:'tipo_docto',label:"Tipo documento",label_options:'tipos_doctos',props:{clases:'col s12'}}, 
					{type:'select',name:'produccion',label:"Producción",label_options:'producciones',props:{clases:'col s12 m6 l6'}},
					{type:'select',name:'estadistico',label:"Etapa produccion",label_options:'estadisticos',props:{clases:'col s12 m6 l6',optionLabel:'label_select'}},
					{type:'select',name:'tractorista',label:"Tractorista",label_options:'tractoristas',props:{clases:'col s12 m6 l6'}}, 
					{type:'text',name:'nombre',label:"Actividad",props:{clases:'col s12 m6 l6'}},
					{type:'date-range',name:'fechas',label:"Perido a realizarla",props:{clases:"col s12",rango:{min:null,max:null}}},
					{type:'textarea',name:'observaciones',label:"Observaciones",props:{clases:"col s12"},},
					{type:'number',name:'horas',label:"Horas",props:{clases:'col s6 m6 l6'}},
					{type:'number',name:'horas_extra',label:"Horas_extra",props:{clases:'col s6 m6 l6'}},

					// {name:'text',label:"TEXTO",type:'text',props:{clases:"col s6"},},    
					// {name:'number',label:"Numerico",type:'number',props:{clases:"col s6"},},
					// {name:'textarea',label:"Text Area",type:'textarea',props:{clases:"col s6"},},
					// {name:'select',label:"Select v",type:'select',label_option:'opciones_select',props:{'reduce':item=>item.id,clases:"col s6"},},
					// {name:'date',label:"Fecha",type:'date',props:{clases:"col s6"},},
					// {name:'date_range',label:"Rango de fechas",type:'date-range',props:{clases:"col s6",rango:{min:'2026-01-05',max:'2026-01-29'}}},
				]
			}
		},
		computed:{
			getfields(){
				// let res=this.fields.filter(f=>{
				// 	if(!this.hideCamposLocal){
				// 		return true;
				// 	}
				// 	return !this.hideCamposLocal.includes(f.name)
				// })
				// console.log(res);
				return this.retrnFieldFixed;
			},
			retrnFieldFixed(){
				let res=[...this.fields];
				res.forEach(f=>{
					if((this.disabledCamposLocal??[]).includes(f.name)){
						f.disabled=true;
					}
					if((this.hideCamposLocal??[]).includes(f.name)){
						f.hidden=true;
					}
				})
				return res;
			},
			hasMessajeForm(){
				for(let it in this.errores){
					if(!this.localForm.hasOwnProperty(it)){
						return this.errores[it]?true:false;
					}
				}
				return false;
			},
			getMessageForm(){
				this.hasMessajeForm?this.errores.message??'':'';
			},
			datosGen(){
				let res={
						value:this.localForm,
						fields:this.getfields,
						catalogos:this.getAllcatalogos,
						errors:this.getErrors,
					}
					//console.log('retorna new res:',res.value)
				return res;
			},
			getErrors(){
                let err=this.errors;
                let res={};
                for(let it in err){
                    if(!this.rules.hasOwnProperty(it)){
                        res={...res,[it]:err[it]??null}
                    } else if((this.rules[it].required??false) && (!(this.localForm[it]??null) || (this.localForm[it]??'')==='')){
                        res={
                            ...res,
                            [it]:err[it]??null
                        }
                    }
                }
				console.log('retorna errores:',err,res);
                return res;
            },
			getAllcatalogos(){
				let res={...this.catalogos}
				let tractoristas=[...res.tractoristas??[]]
				let empUsos=[];
                empUsos=this.localForm.empleados_extra.map(i=>{return i.empleado_id})
                //console.log(empUsos)
				res.tractoristas=tractoristas.filter(e=>!empUsos.includes(e.empleado_id))
				console.log(res)
                //return this.catalogosLocal.empleados.filter(e=>!empUsos.includes(e.empleado_id));
				return res;
			},
			getPropsEmpsRec(){
				return {
					form:this.localForm,
					catalogos:{
						empleados:this.catalogos.empleados,
						articulos:this.catalogos.articulos,
						activos_fijos:this.catalogos.activos_fijos,
						tipos_doctos:this.catalogos.tipos_doctos,
					},
					errores:{
						empleados:this.errores.empleados_extra??null,
						recursos:this.errores.recursos??null,
					},
				}
			},
			completo(){
				this.errors={};
                for(let it in this.rules){
                    const rule=this.rules[it];
                    if((rule.required??false) && (!this.localForm[it] || this.localForm[it]==='')){
                        this.generaErros();
                        return false;
                    }
                }
				if((this.localForm.fechas??null)==null || typeof(this.localForm.fechas)!='object'
                    || (this.localForm.fechas.inicio??null)==null || (this.localForm.fechas.fin??null)==null
                ){
                    this.generaErros('fechas');
                    return false;
                }
				if((this.localForm.horas??0)==0 && (this.localForm.horas_extra??0)==0){
                    this.generaErros('horas');
                    return false;
                }
				if(this.localForm.add_empleados_extra || this.localForm.add_recursos){
                    if(!this.$refs.EmpsReqs.completo){
                        return false;
                    }
                }
                return true;
            },
		},
		methods:{
			generaErros(campo,mess=null){
                if(!campo){
                    for(let it in this.rules){
                        this.generaErros(it)
                    }
                    return;
                }
                //console.log(campo,this.errors)
                this.$set(this.errors,campo,mess??this.getErrorNewAct(campo));
                // this.errors[campo]=this.getErrorNewAct(campo)
            },
            getErrorNewAct(label){
                return `El campo ${label} es requerido`;
            },
			onInput(e){
				this.localForm = {...this.localForm,...e};
				this.$emit('input', this.localForm);
			},
			enviarFormulario(event,form){
				//console.log(event,form)
                if(!this.completo){
                    return;
                }
                this.$emit('submit',this.localForm)
            }
		},
		watch: {
			'localForm.estadistico'(newVal, oldVal) {
				if (!newVal || newVal === oldVal) return;
				this.$set(this.localForm,'fechas',{inicio:newVal?.fecha_estimada_inicio??null,fin:newVal?.fecha_estimada_fin??null});
				this.$set(this.localForm,'nombre',newVal.nombre??'');

				this.$emit('input', this.localForm);
			},
			errores:{
				handler(newVal, oldVal){
					console.log('change errors:',newVal)
					for(let it in newVal){
							this.generaErros(it,newVal[it][0]??null)
					}
				},
				deep:true
			},
			hideCampos:{
				handler(newVal, oldVal){
					this.hideCamposLocal=[...newVal];
				},
			},
			disabledCampos:{
				handler(newVal, oldVal){
					this.disabledCamposLocal=[...newVal];
			},
			 }
		}
    };
</script>

<style scoped>
    
</style> -->
