<template>
    <div>
        <table class="striped centered tabla-actividades-recursos" id="edit-empleados-table">
                <thead>
                    <tr><th>Empleado</th><th>Horas</th><th>Horas extra</th><th></th></tr>
                </thead>
                <tbody>
                        <tr v-for="(emp, index) in get_empleados_added" :key="index" class="row-act-empleado" :class="{'selected':emp.editando,'editando':emp.editando}">
                            <td v-if="emp.editando">
                                <SelectBase
                                    :options="getCatEmpleados"
                                    :error="getError(index,'nombre')"
                                    :optionLabel="'nombre_corto'"
                                    v-model="emp.empleado"
                                    @input="selectItem($event,emp)"
                                ></SelectBase>
                            </td>
                            <td v-else>{{emp.nombre}}</td>
                            <td v-if="emp.editando">
                                <div class="input-field">
                                    <input @input="onInput" v-model.number="emp.horas" type="number" :class="{'invalid': !!getError(index,'horas')}">
                                    <span 
                                        class="helper-text red-text" v-if="getError(index,'horas')"
                                    >
                                        {{ getError(index,'horas') }}
                                    </span>
                                </div>
                            </td>
                            <td v-else>{{ emp.horas }}</td>
                            <td v-if="emp.editando">
                                <input @input="onInput" v-model.number="emp.horas_extra" type="number">
                            </td>
                            <td v-else>{{ emp.horas_extra }}</td>
                            <td>
                                <a href="#!" @click.stop="editRow(emp)" v-if="!emp.editando">
                                    <i class="material-icons">edit</i>
                                </a>
                                <a href="#!" @click.stop="saveRow(emp,index)" v-else-if="compruebaEmpleadoCompleto(emp)">
                                    <i class="material-icons">save</i>
                                </a>
                                <a href="#!" @click.stop="removeRow(emp,index)">
                                    <i class="material-icons">delete_forever</i>
                                </a>
                            </td>
                            <!-- <tr v-if="errorLocal.empleados_extra[index]" :key="`error-${index}`">
                                <td :colspan="4" class="red white-text" >{{ errorLocal.empleados_extra[index] }}</td>
                            </tr> -->
                        </tr>
                        
                </tbody>
            </table>
            <button type="button" @click.stop="addItem" class="btn-small">Agregar empleado</button>
        <!-- <table class="highlight" id="edit-recursos-table">
            <thead>
                <tr><th>Nombre</th><th>Cantidad</th><th></th></tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in get_articulos_added" :key="index" class="row-act-empleado" :class="{'selected':item.editando}">
                    <td v-if="item.editando">
                        <SelectBase
                            :options="getArticulos"
                            :error="getError(index,'nombre')"
                            :optionLabel="'nombre_select'"
                            v-model="item.articulo"
                            @input="selectItem($event,item)"
                        ></SelectBase>
                    </td>
                    <td v-else>{{item.nombre}}</td>
                    <td v-if="item.editando">
                        <div class="input-field">
                            <input @input="onInput" v-model="item.cantidad" type="number" :class="{'invalid': !!getError(index,'cantidad')}">
                            <span 
                                class="helper-text red-text" v-if="getError(index,'cantidad')"
                            >
                                {{ getError(index,'cantidad') }}
                            </span>
                        </div>
                    </td>
                    <td v-else>{{ item.cantidad }}</td>
                    <td v-if="item.editando">
                        <input @input="onInput" v-model="emp.horas_extra" type="number">
                    </td>
                    <td v-else>{{ item.horas_extra }}</td>
                    <td>
                        <a href="#!" @click.stop="editRow(item)" v-if="!item.editando">
                            <i class="material-icons">edit</i>
                        </a>
                        <a href="#!" @click.stop="saveRow(item,index)" v-else-if="compruebaArtCompleto(item)">
                            <i class="material-icons">save</i>
                        </a>
                        <a href="#!" @click.stop="removeRow(item,index)">
                            <i class="material-icons">delete_forever</i>
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
        <button type="button" @click.stop="addItem" class="btn-small">Agregar articulos</button> -->
    </div>
</template>
<script>
    import SelectBase from '../SelectBase.vue';
    export default {
        name:'TableEmpleadosExtra',
        components:{
            SelectBase
        },
        mounted(){
            // console.log(this.errorLocal)
            // console.log(this.articulos)
        },
        props:{
            data:{
                type:Array,
                required:true
            },
            errors:{
                type:Object,
                default:()=>{}
            },
            catalogo:{
                type:Array,
                default:()=>[]
            }
        },
        data(){
            return{
                primaryKey:'empleado_id',
                dataLocal:[...this.data],
                errorLocal:{},
                catalogoLocal:[...this.catalogo]
            }
        },
        computed:{
            getCatEmpleados(){
                const artsUsed=this.dataLocal.map(a=>{return a[this.primaryKey]});
                console.log(artsUsed)
                return this.catalogoLocal.filter(a=>!artsUsed.includes(a[this.primaryKey]));
            },
            get_empleados_added(){
                return this.dataLocal
            },
            getNewItem(){
                return{
                    empleado:null,
                    horas:0,
                    horas_extra:0,
                    editando:true,
                    nombre:null,
                    empleado_id:null,
                }
            },
            editando(){
                const art=this.dataLocal.find(a=>a.editando);
                return art??false;
            },
            getIndexEditando(){
                return this.dataLocal.findIndex(a=>a.editando);
            },
            editandoIncoplete(){
                return !this.compruebaEmpleadoCompleto(this.editando);
            },
            generaErrors(){
                const indx=this.getIndexEditando;
                if(indx>=0){
                    this.$set(this.errorLocal,`error[${indx}]`,{
                        nombre:'Seleccione un empleado',
                        horas:'Ingrese horas trabajadas'
                    })
                }
            },
            completo(){
                if(this.editando && this.editandoIncoplete){
                    this.generaErrors
                    return false;
                }
                return true;
            },
        },
        methods:{
            compruebaEmpleadoCompleto(itm){
                if(!itm)return true;
                return itm.empleado && ((itm.horas??0)>0 || (itm.horas_extra??0)>0);
            },
            getError(index,tipo){
                let itm=this.dataLocal[index];
                //console.log(index,this.errorLocal,tipo)
                if(tipo=='nombre'){
                    if((itm?.nombre??'')==''){
                        return this.errorLocal[`error[${index}]`]?.nombre??null;
                    }
                }else if(tipo=='horas'){
                    if((itm.horas??0)==0 && (itm.horas_extra??0)==0){
                        return this.errorLocal[`error[${index}]`]?.horas??null;
                    }
                }
            },
            addItem(){
                if(this.editando && this.editandoIncoplete){
                    this.generaErrors
                    return;
                }
                this.dataLocal.forEach(e => e.editando=false);
                this.dataLocal.push({...this.getNewItem});
            },
            selectItem(value,itm){
                console.log(value,itm);
                itm.nombre=value?.nombre??null;
                itm[this.primaryKey]=value[this.primaryKey]??null;
                this.onInput();
            },
            onInput(e){
                console.log(e)
                this.$emit('input',this.dataLocal);
            },
            editRow(itm){
                if(this.editando && this.editandoIncoplete){
                    this.generaErrors
                    return;
                }
                this.dataLocal.forEach(e => e.editando=false);
                itm.editando=true;
                //this.$set(art,'editando',true)
            },
            saveRow(itm,index){
                itm.editando=false;
                //this.onInput();
                //this.$set(emp,'editando',false)
            },
            removeRow(itm,index){
                this.dataLocal.splice(index,1);
                this.onInput();
            },
        },
        watch:
        {
            catalogo:{
                handler(newVal){
                    console.log('cambio cat',newVal);
                    this.catalogoLocal=[...newVal];
                },
                deep:true,
                immediate:true
            }
        }
    }
</script>