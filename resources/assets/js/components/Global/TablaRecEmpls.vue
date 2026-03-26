<template>
    <div>
        <div class="col s12" v-if="formLocal.add_empleados_extra">
            <h6>Empleados adicionales</h6>
            <div v-if="hasError('empleados')">
                <span v-for="(error,index) in getError('empleados')" :key="index" class="red-text" >
                    {{error}}
                </span>
            </div>
            <TableEmpleadosExtra
                :data="formLocal.empleados_extra"
                :catalogo="getCatEmpleados"
                ref="rEmpleadosExtra"
                @input="changeEmpleadosExtra"
            ></TableEmpleadosExtra>
        </div>
        <div class="col s12" style="margin-top:15px" v-if="formLocal.add_recursos">
            <h5>Recursos</h5>
            <div v-if="hasError('recursos')">
                <span v-for="(error, index) in getError('recursos')" :key="index" class="red-text" >
                    {{error}}
                </span>
            </div>
            <h6>Articulos</h6>
            <TableRecursoArticulo
                :recurso_articulo="formLocal.recursos.articulos"
                :catalogo="catArts"
                ref="rRecursoArticulo"
                @input="changeRecArts"
            ></TableRecursoArticulo>
            <!-- <table class="highlight" id="edit-recursos-table">
                <thead>
                    <tr><th>Nombre</th><th>Cantidad</th><th></th></tr>
                </thead>
                <tbody></tbody>
            </table>
            <button type="button" @click.stop="add" class="btn-small">Agregar articulos</button> -->

            <h6>Activos fijos</h6>
            <TableRecursoActivoFijo
                :data="formLocal.recursos.activos_fijos"
                :catalogo="catAactivosFijos"
                ref="rRecursoActivoFijo"
                @input="changeRecActivoFijo"
            ></TableRecursoActivoFijo>
            <!-- <table class="highlight" id="edit-recursos-table">
                <thead>
                    <tr><th>Nombre</th><th>Horas</th><th></th></tr>
                </thead>
                <tbody></tbody>
            </table>
            <button type="button" @click.stop="add" class="btn-small">Agregar activo fijo</button> -->
        </div>
    </div>
</template>

<script>
    import InputNumberBase from './InputNumberBase.vue';
    import SelectBase from './SelectBase.vue';
    import TableRecursoArticulo from './actividades_tractor/TableRecursoArticulo.vue';
    import TableRecursoActivoFijo from './actividades_tractor/TableRecursoActivoFijo.vue';
    import TableEmpleadosExtra from './actividades_tractor/TableEmpleadosExtra.vue';
    export default {
        name:'TablaRecEmpls',
        components:{
            InputNumberBase,
            SelectBase,
            TableRecursoArticulo,
            TableRecursoActivoFijo,
            TableEmpleadosExtra,
        },
        mounted(){
            //console.log(this.formLocal)
        },
        props:{
            form:{
                type: Object,
                default: () => ({
                    empleados_extra: [],
                    recursos: []
                })
            },
            catalogos:{
                type: Object,
                default: () => ({
                    empleados: []
                })
            },
            errores:{
                type: Object,
                default: () => ({
                    empleados:null,
                    recursos:null
                })
            }

        },
        data(){
            return{
                formLocal:{...this.form},
                errorLocal:{
                    empleados_extra: [],
                    recursos: []
                },
                erroresRecGen:{...this.errores},
                catalogosLocal:{...this.catalogos},
            }
        },
        computed:{
            
            erroresGen(){
                return this.erroresRecGen??{};
            },
            completo(){
                if(!this.formLocal.add_empleados_extra && !this.formLocal.add_recursos){
                    return true;
                }else if(this.formLocal.add_empleados_extra && !this.formLocal.add_recursos){
                    return this.$refs.rEmpleadosExtra.completo;
                }else if(!this.formLocal.add_empleados_extra && this.formLocal.add_recursos){
                    return this.$refs.rRecursoArticulo.completo && this.$refs.rRecursoActivoFijo.completo;
                }
                return this.$refs.rEmpleadosExtra.completo && this.$refs.rRecursoArticulo.completo && this.$refs.rRecursoActivoFijo.completo;
            },
            catArts(){
                return this.catalogosLocal.articulos;
            },
            catAactivosFijos(){
                return this.catalogosLocal.activos_fijos;
            },
            getCatEmpleados(){
                let empUsos=[];
                //empUsos=this.formLocal.empleados_extra.map(i=>{return i.empleado_id})
                if(this.formLocal.tractorista){
                    empUsos.push(this.formLocal.tractorista.empleado_id);
                }
                //console.log(empUsos)
                return this.catalogosLocal.empleados.filter(e=>!empUsos.includes(e.empleado_id));
            },
            // get_empleados_extra(){
            //     return this.formLocal.empleados_extra;
            // },
            // get_recursos(){
            //     return this.formLocal.recursos;
            // },
            // newEmp(){
            //     return{
            //         nombre: '',
            //         horas: 0,
            //         horas_extra: 0,
            //         editando: true,
            //         empleado_id:null,
            //     }
            // },
            // indexEmpleadoEditando(){
            //     return (this.formLocal.empleados_extra??[]).findIndex(e=>e.editando==true);
            // },
            // empleadoEditando(){
            //     let indx=this.indexEmpleadoEditando;
            //     if(indx==-1){
            //         return null;
            //     }
            //     return this.formLocal.empleados_extra[indx];
            // },
            // empleadoEditandoCompletado(){
            //     let empl=this.empleadoEditando;
            //     if(!empl){
            //         return true;
            //     }
            //     return (empl.nombre??'')!='' && ((empl.horas??0)!=0 || (empl.horas_extra??0)!=0);
            // },
            // canAddEmp(){
            //     return this.empleadoEditandoCompletado;
            // },
            
        },
        
        methods:{
            hasError(name){
                // console.log(name,this.erroresRecGen,this.erroresRecGen[name], typeof(this.erroresRecGen[name]))
                if(this.erroresRecGen[name]){
                    return true;
                }
                return false;
            },
            getError(name){
                let res=this.erroresRecGen[name]??null;
                if(!Array.isArray(res)){
                   res=[res];
                }
                return res;
            },
            // selectEmpleado(empleadoCat,emp){
            //     emp.empleado_id=empleadoCat?.empleado_id??null
            //     emp.nombre=empleadoCat?.nombre??''
            //     //console.log(empleadoCat,emp)
            //     this.onInput()
            // },
            // // onInputHoras(val,emp){
            // //     emp.horas=val.target.value;
            // // },
            // // onInputHorasExtra(val,emp){
            // //     emp.horas_extra=val.target.value;
            // // },
            // onInput(empleado,attr,value){
            //     //console.log(empleado,attr,value)
            //     //limpiarErrores();
            //     this.$emit('input',this.formLocal);
            // },
            // compruebaEmpleadoCompleto(emp){
            //     return (emp.nombre??'')!='' && ((emp.horas??0)!=0 || (emp.horas_extra??0)!=0);
            // },
            // getErrorEmp(index,tipo){
            //     let emp=this.formLocal.empleados_extra[index];
            //     if(tipo=='nombre'){
            //         if((emp?.nombre??'')==''){
            //             let r=this.errorLocal[`empleados_extra[${index}]`]?.nombre??null;
            //             console.log(r)
            //             return r;
            //         }
            //     }
            //     else if(tipo=='horas'){
            //         if((emp?.horas??0)==0 && (emp?.horas_extra??0)==0)
            //         return this.errorLocal[`empleados_extra[${index}]`]?.horas??null;
            //     }
            //     //errorLocal[`empleados_extra[${index}]`]?.nombre??null
            // },
            // generarErroresEmp(emp){
            //     return {
            //         nombre: !emp.nombre?'Nombre es requerido': '',
            //         horas: !(emp.horas??0)>0 && !(emp.horas_extra??0)>0?'Horas es requerido': '',
            //         //horas_extra: !emp.horas_extra?'Horas extra es requerido': '',
            //     }
            // },
            // setErrors(name,value){
            //     this.$set(this.errorLocal,name,value);
            // },
            // addEmpleado(){
            //     if(!this.canAddEmp){
            //         let emplEdit=this.empleadoEditando;
            //         if(emplEdit){
            //             let errs=this.generarErroresEmp(emplEdit);
            //             let index=this.indexEmpleadoEditando
            //             this.setErrors(`empleados_extra[${index}]`,errs)
            //             //this.errorLocal.empleados_extra[index]=errs;
            //             // for(let e in errs){
            //                 // if(errs[e]!=''){
            //                 //     this.errorLocal.empleados_extra[index]=errs[e];
            //                 //     break;
            //                 // }
            //             // 0}
            //         }
            //         //this.errorLocal.empleados_extra[this.indexEmpleadoEditando]='deberias de completar este registro antes de continuar'
            //         //console.log(this.errorLocal);
            //         return;
            //     }
            //     if(!this.formLocal.empleados_extra) this.formLocal.empleados_extra=[];
            //     //let ee=this.formLocal.empleados_extra;
            //     //ee.push(this.newEmp);
            //     //this.$set(this.formLocal,'empleados_extra', ee)
            //     //this.$set(this.formLocal.empleados_extra,'editando',false)
            //     this.formLocal.empleados_extra.forEach(e => e.editando=false);
            //     this.formLocal.empleados_extra.push({...this.newEmp});
            //     this.$emit('input', this.formLocal)
            //     // console.log(this.formLocal.empleados_extra);
            // },
            // canEditEmpleado(emp){
            //     let emplEdit=this.empleadoEditando;
            //     if(emplEdit && !this.empleadoEditandoCompletado){
            //         let errs=this.generarErroresEmp(emplEdit);
            //         let index=this.indexEmpleadoEditando
            //         this.setErrors(`empleados_extra[${index}]`,errs)
            //         return false;
            //     }
            //     return true;
            // },
            // editRow(emp){
            //     if(!this.canEditEmpleado(emp)){
            //         return;
            //     }
            //     this.formLocal.empleados_extra.forEach(e => e.editando=false);
            //     emp.editando=true;
            //     //this.$set(emp,'editando',true)
            // },
            // saveRow(emp,index){
            //     emp.editando=false;
            //     console.log()
            //     //this.onInput();
            //     //this.$set(emp,'editando',false)
            // },
            // removeRow(emp,index){
            //     this.formLocal.empleados_extra.splice(index,1);
            //     this.onInput();
            // },
            changeRecArts(val){
                console.log(val)
                this.formLocal.recursos.articulos=val;
                this.$emit('input',this.formLocal);
            },
            changeRecActivoFijo(val){
                console.log(val)
                this.formLocal.recursos.activos_fijos=val;
                this.$emit('input',this.formLocal);
            },
            changeEmpleadosExtra(val){
                this.formLocal.empleados_extra=val;
                this.$emit('input',this.formLocal);
            },
        },
        watch:{
            form:{
                handler(val){
                    this.formLocal = {...val}
                },
                deep:true,
            },
            catalogos:{
                handler(val){
                    console.log(val)
                    this.catalogosLocal = {...val}
                },
                deep:true
            },
            errores:{
                handler(val){
                    console.log('erroresChange: ',val)
                    for(let it in val){
                        this.$set(this.erroresRecGen,it,val[it]);
                    }
                    //this.erroresRecGen = {...val}
                    //this.$set(this.erroresRecGen,val);
                },
                deep:true
            }
        }

    }
</script>
<style>
    tr.row-act-empleado.selected{
        background: #0e0e0e0e;
        box-shadow: #0e0e0e0e;
    }
    .tabla-actividades-recursos tbody tr:not(.editando):hover{
        background: #0e0e0e10;
    }
    .tabla-actividades-recursos tbody tr:not(.editando) td{
        padding-top: 0;
        padding-bottom: 0;
    }
</style>