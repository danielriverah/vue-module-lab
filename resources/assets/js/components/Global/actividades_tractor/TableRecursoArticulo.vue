<template>
    <div>
        <table class="striped centered tabla-actividades-recursos" >
            <thead>
                <tr><th>Nombre</th><th>Cantidad</th><th></th></tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in get_articulos_added" :key="index" class="row-act-empleado" :class="{'selected':item.editando,'editando':item.editando}">
                    <td v-if="item.editando">
                        <SelectBase
                            :options="getArticulos"
                            :error="getError(index,'nombre')"
                            :optionLabel="'nombre_select'"
                            v-model="item.articulo"
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
                            <input @input="onInput" v-model="item.cantidad" type="number" :class="{'invalid': !!getError(index,'cantidad')}">
                            <span 
                                class="helper-text red-text" v-if="getError(index,'cantidad')"
                            >
                                {{ getError(index,'cantidad') }}
                            </span>
                        </div>
                    </td>
                    <td v-else>{{ item.cantidad }}</td>
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
        <button type="button" @click.stop="addItem" class="btn-small">Agregar articulos</button>
    </div>
</template>
<script>
    import SelectBase from '../SelectBase.vue';
    export default {
        name:'TrRecursoArticulo',
        components:{
            SelectBase
        },
        mounted(){
            // console.log(this.errorLocal)
            // console.log(this.articulos)
        },
        props:{
            recurso_articulo:{
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
                articulos:[...this.recurso_articulo],
                errorLocal:{},
                catalogoLocal:[...this.catalogo]
            }
        },
        computed:{
            getArticulos(){
                const artsUsed=this.articulos.map(a=>{return a.articulo_id});
                return this.catalogoLocal.filter(a=>!artsUsed.includes(a.articulo_id));
            },
            get_articulos_added(){
                return this.articulos
            },
            getNewArticulo(){
                return{
                    articulo:null,
                    cantidad:0,
                    editando:true,
                    nombre:null,
                    articulo_id:null,
                }
            },
            editando(){
                const art=this.articulos.find(a=>a.editando);
                return art??false;
            },
            getIndexEditando(){
                return this.articulos.findIndex(a=>a.editando);
            },
            editandoIncoplete(){
                return !this.compruebaArtCompleto(this.editando);
            },
            generaErrors(){
                const indx=this.getIndexEditando;
                if(indx>=0){
                    this.$set(this.errorLocal,`articulos[${indx}]`,{
                        nombre:'Seleccione un articulo',
                        cantidad:'Ingrese una cantidad'
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
            compruebaArtCompleto(art){
                if(!art)return true;
                return art.articulo && art.cantidad>0;
            },
            getError(index,tipo){
                let art=this.articulos[index];
                //console.log(index,this.errorLocal,tipo)
                if(tipo=='nombre'){
                    if((art?.nombre??'')==''){
                        return this.errorLocal[`articulos[${index}]`]?.nombre??null;
                    }
                }else if(tipo=='cantidad'){
                    if((art.cantidad??0)==0){
                        return this.errorLocal[`articulos[${index}]`]?.cantidad??null;
                    }
                }
            },
            addItem(){
                if(this.editando && this.editandoIncoplete){
                    this.generaErrors
                    return;
                }
                this.articulos.forEach(e => e.editando=false);
                this.articulos.push({...this.getNewArticulo});
            },
            selectItem(value,articulo){
                articulo.nombre=value?.nombre??null;
                articulo.articulo_id=value?.articulo_id??null;
                this.onInput();
            },
            onInput(e){
                console.log(e)
                this.$emit('input',this.articulos);
            },
            editRow(art){
                if(this.editando && this.editandoIncoplete){
                    this.generaErrors
                    return;
                }
                this.articulos.forEach(e => e.editando=false);
                art.editando=true;
                //this.$set(art,'editando',true)
            },
            saveRow(art,index){
                art.editando=false;
                //this.onInput();
                //this.$set(emp,'editando',false)
            },
            removeRow(art,index){
                this.articulos.splice(index,1);
                this.onInput();
            },
            // editRow(articulo){
            //     articulo.editando = true;
            // },
            // removeRow(articulo,index){
            //     this.$emit('eliminar-fila',articulo,index);
            // },
            // saveRow(articulo,index){
            //     if(this.compruebaEmpleadoCompleto(articulo)){
            //         this.$emit('guardar-fila',articulo,index);
            //     }
            // },
            // onInput(e){
            //     console.log(e.target.value);
            // },
            // selectEmpleado(ev,articulo){
            //     console.log('empleado seleccionado',ev,articulo);
            //     // articulo.nombre = ev.nombre_corto;
            //     // articulo.id_cat_empleado = ev.id;
            // },
            // compruebaEmpleadoCompleto(articulo){
            //     return articulo.empleado && articulo.horas;
            // }
        },
        watch:
        {
            recurso_articulo:{
                handler(newVal){
                    this.articulo=[...newVal];
                },
                deep:true,
                immediate:true
            },
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
<style>
    /* .tabla-actividades-recursos tbody tr:not(.editando) td{
        padding-top: 0;
        padding-bottom: 0;
    } */
</style>