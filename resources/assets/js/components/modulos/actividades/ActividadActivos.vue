<template>

    <div>
        
        <h4>Activos</h4>
        
        <table class="table">
            <tr>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Acciones</th>
            </tr>
            <tr v-for="(row,i) in rows" :key="i">
            
                <td>
                    <UiSelect 
                        v-if="editingIndex==i" v-model="row.articulo"
                        :options="articulosComp" 
                        optionLabel="nombre_select"
                        optionValue="nombre_select"
                        :searching="true"
                        @input="onInputArticulo($event,row)"
                    >
                    </UiSelect>
                    <span v-else>
                        {{ getArticulo(row.articulo_id) }}
                    </span>
                    <!-- <select v-model="row.activo_fijo_id" class="form-control">
                    
                    <option v-for="(a,index) in activos" :key="index" :value="a.id">
                    {{a.nombre}}
                    </option>
                    
                    </select> -->
                </td>
                
                <td>
                    <input type="number" step="0.01" v-model="row.horas" class="form-control">
                </td>
                
                <td>
                    <button class="btn btn-danger" @click="remove(i)">X</button>
                </td>
            
            </tr>
        
        </table>
        
        <button class="btn btn-success" @click="add">
        Agregar activo
        </button>
    
    </div>
    
</template>
    
    
<script>
    import UiSelect from '../../ui/UiSelect.vue';
    export default{
        components:{UiSelect},
        mounted(){
            console.log("mounted activos tabla::",this.$props)
        },
        props:{
            value:{
                type:Array,
                default:()=>[]
            },
            activos:Array
        },
        data:()=>({
            editingIndex:null
        }),
        computed:{
            rows:{
                get(){ return this.value },
                set(v){ this.$emit('input',v) }
            },
            activosComp(){
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
        // props:['value','activos'],
        
        // computed:{
        // rows:{
        // get(){ return this.value },
        // set(v){ this.$emit('input',v) }
        // }
        // },
        
        // methods:{
        
        // add(){
        
        // this.rows.push({
        // activo_fijo_id:null,
        // horas:0
        // })
        
        // },
        
        // remove(i){
        // this.rows.splice(i,1)
        // }
        
        // }
    
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