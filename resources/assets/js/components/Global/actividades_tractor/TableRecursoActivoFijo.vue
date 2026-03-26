<template>
    <div>
        <table class="striped centered tabla-actividades-recursos">
            <thead>
                <tr><th>Nombre</th><th>Horas</th><th></th></tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in get_activos_fijos_added" :key="index" class="row-act-empleado" :class="{'selected':item.editando,'editando':item.editando}">
                    <td v-if="item.editando">
                        <SelectBase
                            :options="getActivosFijos"
                            :error="getError(index,'nombre')"
                            :optionLabel="'nombre_select'"
                            v-model="item.activo_fijo"
                            @input="selectItem($event,item)"
                        ></SelectBase>
                         <!-- <div class="input-field">
                             <span>{{ emp.nombre??'Aqui va nombre' }}</span>
                             <span class="helper-text red-text small" v-if="errorLocal[`empleados_extra[${index}]`] && errorLocal[`empleados_extra[${index}]`].nombre">{{ errorLocal[`empleados_extra[${index}]`].nombre }}</span>
                         </div> -->
                    </td>
                    <td v-else>{{item.nombre}}</td>
                    <td v-if="item.editando">
                        <div class="input-field">
                            <input @input="onInput" v-model="item.horas" type="number" :class="{'invalid': !!getError(index,'horas')}">
                            <span 
                                class="helper-text red-text" v-if="getError(index,'horas')"
                            >
                                {{ getError(index,'horas') }}
                            </span>
                        </div>
                    </td>
                    <td v-else>{{ item.horas }}</td>
                    <!-- <td v-if="item.editando">
                        <input @input="onInput" v-model="emp.horas_extra" type="number">
                    </td>
                    <td v-else>{{ item.horas_extra }}</td> -->
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
                    <!-- <tr v-if="errorLocal.empleados_extra[index]" :key="`error-${index}`">
                        <td :colspan="4" class="red white-text" >{{ errorLocal.empleados_extra[index] }}</td>
                    </tr> -->
                </tr>
            </tbody>
        </table>
        <button type="button" @click.stop="addItem" class="btn-small">Agregar Activo fijo</button>
    </div>
</template>
<script>
    import SelectBase from '../SelectBase.vue';
    export default {
        name:'TableRecursoActivoFijo',
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
                activos_fijos:[...this.data],
                errorLocal:{},
                catalogoLocal:[...this.catalogo]
            }
        },
        computed:{
            getActivosFijos(){
                const artsUsed=this.activos_fijos.map(a=>{return a.activo_fijo_id});
                console.log(artsUsed)
                return this.catalogoLocal.filter(a=>!artsUsed.includes(a.activo_fijo_id));
            },
            get_activos_fijos_added(){
                return this.activos_fijos
            },
            getNewItem(){
                return{
                    activo_fijo:null,
                    horas:0,
                    editando:true,
                    nombre:null,
                    activo_fijo_id:null,
                }
            },
            editando(){
                const art=this.activos_fijos.find(a=>a.editando);
                return art??false;
            },
            getIndexEditando(){
                return this.activos_fijos.findIndex(a=>a.editando);
            },
            editandoIncoplete(){
                return !this.compruebaArtCompleto(this.editando);
            },
            generaErrors(){
                const indx=this.getIndexEditando;
                if(indx>=0){
                    this.$set(this.errorLocal,`activos_fijos[${indx}]`,{
                        nombre:'Seleccione un activo fijo',
                        horas:'Ingrese una cantidad de horas'
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
            compruebaArtCompleto(itm){
                if(!itm)return true;
                return itm.activo_fijo && itm.horas>0;
            },
            getError(index,tipo){
                let itm=this.activos_fijos[index];
                //console.log(index,this.errorLocal,tipo)
                if(tipo=='nombre'){
                    if((itm?.nombre??'')==''){
                        return this.errorLocal[`activos_fijos[${index}]`]?.nombre??null;
                    }
                }else if(tipo=='horas'){
                    if((itm.horas??0)==0){
                        return this.errorLocal[`activos_fijos[${index}]`]?.horas??null;
                    }
                }
            },
            addItem(){
                if(this.editando && this.editandoIncoplete){
                    this.generaErrors
                    return;
                }
                this.activos_fijos.forEach(e => e.editando=false);
                this.activos_fijos.push({...this.getNewItem});
            },
            selectItem(value,itm){
                console.log(value,itm);
                itm.nombre=value?.nombre??null;
                itm.activo_fijo_id=value?.activo_fijo_id??null;
                this.onInput();
            },
            onInput(e){
                console.log(e)
                this.$emit('input',this.activos_fijos);
            },
            editRow(itm){
                if(this.editando && this.editandoIncoplete){
                    this.generaErrors
                    return;
                }
                this.activos_fijos.forEach(e => e.editando=false);
                itm.editando=true;
                //this.$set(art,'editando',true)
            },
            saveRow(itm,index){
                itm.editando=false;
                //this.onInput();
                //this.$set(emp,'editando',false)
            },
            removeRow(itm,index){
                this.activos_fijos.splice(index,1);
                this.onInput();
            },
        },
        watch:
        {
            // data:{
            //     handler(newVal){
            //         this.activos_fijos=[...newVal];
            //     },
            //     deep:true,
            //     immediate:true
            // },
            catalogo:{
                handler(newVal){
                    console.log('cambio cat',newVal);
                    this.catalogoLocal=[...newVal];
                },
                deep:true,
                immediate:true
            }
            // errors:{
            //     handler(newVal){
            //         this.errorLocal=newVal;
            //     },
            //     deep:true,
            //     immediate:true
            // }
        }
    }
</script>
