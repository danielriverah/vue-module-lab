<template>
    <div>
        <h4>Empleados</h4>
        <table class="table">
            <tr>
                <th>Empleado</th>
                <th>Horas</th>
                <th>Horas Extra</th>
                <th>Acciones</th>
            </tr>
            <tr v-for="(row,i) in rows" :key="i">
                <td style="min-width: 350px;">
                    <UiSelect 
                        v-if="editingIndex==i" v-model="row.empleado"
                        :options="empleadosComp" 
                        optionLabel="nombre_select"
                        optionValue="nombre_select"
                        :searching="true"
                        @input="onInputEmpleado($event,row)"
                    >
                        <!-- <option v-for="(e,index ) in empleados" :key="index" :value="e.id">
                        {{e.nombre}}
                        </option> -->
                    </UiSelect>
                    <span v-else>
                        {{ getEmpleado(row.empleado_id) }}
                    </span>
                </td>
                <td>
                    <input v-if="editingIndex==i" type="number" v-model="row.horas" class="form-control">
                    <span v-else>{{ row.horas }}</span>
                </td>
                <td>
                    <input v-if="editingIndex==i"  type="number" v-model="row.horas_extra" class="form-control">
                    <span v-else>{{ row.horas_extra }}</span>
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
                    <!-- <button
                        v-if="editingIndex!==i"
                        class="btn btn-sm btn-primary"
                        @click="edit(i)"
                        title="Editar"
                    >
                        <i class="material-icons">edit</i>
                    </button>
                    <button
                        v-if="editingIndex===i"
                        class="btn btn-sm btn-success"
                        @click="save(i)"
                        title="Guardar"
                    >
                    <i class="material-icons">save</i>
                    </button>
                    <button
                        class="btn btn-sm btn-danger"
                        @click="remove(i)"
                        title="Eliminar"
                    >
                        X
                    </button> -->
                </td>
            </tr>
        </table>
        <button class="btn btn-success" @click="add">
            Agregar empleado
        </button>
    </div>
</template>
<script>
    import UiSelect from '../../ui/UiSelect.vue';
    export default{
        components:{
            UiSelect
        },
        props:{
            value:{
                type:Array,
                default:()=>[]
            },
            empleados:Array
        },
        data(){
            return{
                editingIndex:null
            }
        },
        computed:{
            rows:{
                get(){
                    return this.value
                },
                set(v){
                    this.$emit('input',v)
                }
            },
            empleadosComp(){
                const ids=this.rows.map(r=>r.empleado_id)
                return this.getEmpleadosFixed().filter(e=>!ids.includes(e.empleado_id))
                /*let empleadosDisponibles=this.empleados.filter(e=>!ids.includes(e.empleado_id))
                empleadosDisponibles= empleadosDisponibles.map(e=>({
                    ...e,
                    nombre_select:`${e.nombre} ${e.apellido_paterno} ${e.apellido_materno} - ${e.rfc}`
                }))
                console.log(empleadosDisponibles)
                return empleadosDisponibles*/
            }
        },
        methods:{
            getEmpleadosFixed(){
                return this.empleados.map(e=>({
                    ...e,
                    nombre_select:`${e.nombre} ${e.apellido_paterno} ${e.apellido_materno} - ${e.rfc}`
                }))
            },
            add(){
                if(this.editingIndex!==null) {
                    if(!this.rowCompletado(this.editingIndex)) return;
                    else this.save(this.editingIndex)
                }
                this.rows.push({
                    empleado_id:null,
                    horas:0,
                    horas_extra:0
                })
                this.editingIndex=this.rows.length-1
            },
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
                    alert("Complete empleado")
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
                return row.empleado_id && (row.horas>0 || row.horas_extra>0)
            },
            allRowsCompletos(){
                return this.rows.every(r=>r.empleado_id && (r.horas>0 || r.horas_extra>0))
            },
            getEmpleado(id){
                const emp=this.empleados.find(e=>e.empleado_id===id)
                return (emp?`${emp.nombre} ${emp.apellido_paterno} ${emp.apellido_materno} - ${emp.rfc}`:'')
            }
            ,
            onInputEmpleado(empleado,row){
                row.empleado_id=empleado.empleado_id
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