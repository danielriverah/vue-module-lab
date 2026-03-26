<template>
    <div>
        <h4>Artículos</h4>
        <table class="table">
            <tr>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Acciones</th>
            </tr>
            <tr v-for="(row,i) in rows" :key="i">
                <td style="min-width: 350px;">
                    <UiSelect 
                        v-if="editingIndex==i" v-model="row.articulo"
                        :options="articulosComp" 
                        optionLabel="nombre_select"
                        optionValue="nombre_select"
                        :searching="true"
                        @input="onInputArticulo($event,row)"
                    >
                        <!-- <option v-for="(e,index ) in empleados" :key="index" :value="e.id">
                        {{e.nombre}}
                        </option> -->
                    </UiSelect>
                    <span v-else>
                        {{ getArticulo(row.articulo_id) }}
                    </span>
                </td>
                <!-- <td>
                    <select v-model="row.articulo_id" class="form-control">
                    <option v-for="(a,index) in articulos" :key="index" :value="a.id">
                    {{a.nombre}}
                    </option>
                    </select>
                </td> -->
                <td>
                    <input v-if="editingIndex==i"  type="number" step="0.0001" v-model="row.cantidad" class="form-control">
                    <span v-else>{{row.cantidad}}</span>
                </td>
                <td>
                    <i 
                        v-if="editingIndex!==i"
                        class="material-icons puntero"
                        @click="edit(i)"
                        title="Editar"
                    >edit</i>
                    <i v-if="editingIndex===i"
                        class="material-icons puntero btn-success"
                        @click="save(i)"
                        title="Guardar"
                    >save</i>
                    <i
                        class="material-icons puntero btn-danger"
                        @click="remove(i)"
                        title="Eliminar"
                    >cancel</i>
                    <!-- <button class="btn btn-danger" @click="remove(i)">X</button> -->
                </td>
            </tr>
        </table>
        <button class="btn btn-success" @click="add">
        Agregar artículo
        </button>
    </div>
</template>
<script>
    import UiSelect from '../../ui/UiSelect.vue';
    export default{
        components:{UiSelect},
        mounted(){
            console.log("mounted articulos tabla::",this.$props)
        },
        props:{
            value:{
                type:Array,
                default:()=>[]
            },
            articulos:Array
        },
        data:()=>({
            editingIndex:null
        }),
        computed:{
            rows:{
                get(){ return this.value },
                set(v){ this.$emit('input',v) }
            },
            articulosComp(){
                console.log(this.articulos)
                const ids=this.rows.map(r=>r.articulo_id)
                return this.getArticulosFixed().filter(e=>!ids.includes(e.articulo_id))
            },
        },
        
        methods:{
            getArticulosFixed(){
                console.log(this.articulos)
                return this.articulos.map(e=>({
                    ...e,
                    nombre_select:`${e.nombre} - ${e.clave}`
                }))
            },
            add(){
                console.log(this.rows)
                if(this.editingIndex!==null) {
                    if(!this.rowCompletado(this.editingIndex)) return;
                    else this.save(this.editingIndex)
                }
                this.rows.push({
                    articulo_id:null,
                    cantidad:0
                })
                this.editingIndex=this.rows.length-1
            },
            // remove(i){
            //     this.rows.splice(i,1)
            // }
            edit(i){
                if(this.editingIndex!==null) {
                    if(!this.rowCompletado(this.editingIndex)) return;
                    else this.save(this.editingIndex)
                }
                this.editingIndex=i
            },
            save(i){
                const row=this.rows[i]
                if(!this.rowCompletado(i)){
                    alert("Complete el articulo")
                    return
                }
                this.editingIndex=null
            },
            remove(i){
                this.rows.splice(i,1)
                if(this.editingIndex===i){
                    this.editingIndex=null
                }
            },
            rowCompletado(index){
                const row=this.rows[index]
                return row.articulo_id && row.cantidad>0
            },
            allRowsCompletos(){
                return this.rows.every(r=>r.articulo_id && r.cantidad>0)
            },
            getArticulo(id){
                const art=this.articulos.find(e=>e.articulo_id===id)
                return (art?`${art.nombre} - ${art.clave}`:'')
            }
            ,
            onInputArticulo(articulo,row){
                row.articulo_id=articulo.articulo_id
            }
        }
    
    }
</script>
<style scoped>
    table{
        width: 100%;
    }
    .puntero{
        cursor: pointer;
    }
    input{
        width: 350px;
    }
    td,th{
        padding: 0 5px !important;
    }
</style>