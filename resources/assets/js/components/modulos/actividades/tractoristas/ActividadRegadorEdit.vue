<template>
	<div class="actividad" :class="mode">
		<FormBase
			v-bind="datosGen"
			v-on="$listeners"
			:hide-btn-submit="true"
			@submit.prevent="enviarFormulario"
			@input="onInput"
		> 
			<template v-slot:after v-if="localForm.add_empleados_extra || localForm.add_recursos">
				<TablaRecEmpls 
                    v-bind="getPropsEmpsRec" 
                    @input="onInput"
                    ref="EmpsReqs"
                />
			</template>
		</FormBase>
		
	</div>
</template>

<script>
	import FormBase from '@/components/Global/FormBase.vue';
	import TablaRecEmpls from '@/components/Global/TablaRecEmpls.vue';
    export default {
		name: 'ActividadRegadorEdit',
		components:{FormBase,TablaRecEmpls},
        mounted(){
            console.log(this.value)
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
        },
		data(){
			return {
				localForm: { ...this.value },
                errors:{},
                rules:{
                    produccion:{required:true,custom:["esUnidadProductiva"]},
                    estadistico:{required:true,custom:["esEstadistico"]},
                    //tractorista:{required:true,custom:["esTractorista"]},
                    regador:{required:true,custom:["esRegador"]},
                    nombre:{required:true,custom:["noVacio"]},
                    fechas:{required:true,custom:["fechas"]},
                    //observaciones:{required:true,custom:["noVacio"]},
                    //horas:{required:true,custom:["noVacio","esNumero","min:0","max:24"]},
                    //horas_extra:{required:true,custom:["noVacio","esNumero","min:0","max:24"]},
                },
				fields:[
					{type:'select',name:'produccion',label:"Producción",label_options:'producciones',props:{clases:'col s12 m6 l6'}},
					{type:'select',name:'estadistico',label:"Etapa produccion",label_options:'estadisticos',props:{clases:'col s12 m6 l6',optionLabel:'label_select'}},
					{type:'select',name:'regador',label:"Regador",label_options:'regadores',props:{clases:'col s12 m6 l6'}},
					{type:'text',name:'nombre',label:"Actividad",value:"Riego", readonly:true,props:{clases:'col s12 m6 l6'}},
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
			datosGen(){
				let res={
						value:this.localForm,
						fields:this.fields,
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
                    if(!this.rules[it]){
                        res={...res,[it]:err[it]??null}
                    } else if((this.rules[it].required??false) && (!(this.localForm[it]??null) || (this.localForm[it]??'')==='')){
                        res={
                            ...res,
                            [it]:err[it]??null
                        }
                    }
                }
                return res;
            },
			getAllcatalogos(){
				let res={...this.catalogos}
				let regadores=[...res.regadores??[]]
				let empUsos=[];
                empUsos=this.localForm.empleados_extra.map(i=>{return i.empleado_id})
				res.regadores=regadores.filter(e=>!empUsos.includes(e.empleado_id))
				return res;
			},
			getPropsEmpsRec(){
				return {
					form:this.localForm,
					catalogos:{
						empleados:this.catalogos.empleados,
						articulos:this.catalogos.articulos,
						activos_fijos:this.catalogos.activos_fijos,

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
            generaErros(campo){
                if(!campo){
                    for(let it in this.rules){
                        this.generaErros(it)
                    }
                    return;
                }
                //console.log(campo,this.errors)
                this.$set(this.errors,campo,this.getErrorNewAct(campo));
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
                $emit('submit',this.localForm)
            }
		},
		watch: {
			'localForm.estadistico'(newVal, oldVal) {
				if (!newVal || newVal === oldVal) return;
				this.$set(this.localForm,'fechas',{inicio:newVal?.fecha_estimada_inicio??null,fin:newVal?.fecha_estimada_fin??null});
				this.$set(this.localForm,'nombre',newVal.nombre??'');
				// setear campos derivados
				// this.localForm = {
				// 	...this.localForm,
				// 	estadistico_documento_id: newVal.estadistico_documento_id ?? '',
				// 	fechas: {
				// 		inicio: newVal.fecha_estimada_inicio ?? null,
				// 		fin: newVal.fecha_estimada_fin ?? null
				// 	}
				// };

				// emitir el cambio ya normalizado
				this.$emit('input', this.localForm);
			}
		}
    };
</script>
