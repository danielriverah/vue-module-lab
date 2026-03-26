<template>
    <div class="tractor-actividad-form">
    
        <h3>Crear Actividad</h3>
    
        <div class="row">
    
            <div class="col-md-4">
                <label>Producción</label>
                <select v-model="form.produccion_id" class="form-control">
                    <option v-for="p in producciones" :key="p.id" :value="p.id">
                        {{p.nombre}}
                    </option>
                </select>
            </div>
    
            <div class="col-md-4">
                <label>Nombre</label>
                <input v-model="form.nombre" class="form-control">
            </div>
    
            <div class="col-md-4">
                <label>Tractorista</label>
                <select v-model="form.tractorista_id" class="form-control">
                    <option v-for="e in empleados" :key="e.id" :value="e.id">
                        {{e.nombre}}
                    </option>
                </select>
            </div>
    
            <div class="col-md-3">
                <label>Horas</label>
                <input type="number" step="0.01" v-model="form.horas" class="form-control">
            </div>
    
            <div class="col-md-3">
                <label>Horas extra</label>
                <input type="number" step="0.01" v-model="form.horas_extra" class="form-control">
            </div>
    
            <div class="col-md-3">
                <label>Fecha inicio</label>
                <input type="date" v-model="form.fecha_inicio" class="form-control">
            </div>
    
            <div class="col-md-3">
                <label>Fecha estimada fin</label>
                <input type="date" v-model="form.fecha_estimada_fin" class="form-control">
            </div>
    
            <div class="col-md-12">
                <label>Observaciones</label>
                <textarea v-model="form.observaciones" class="form-control"></textarea>
            </div>
    
        </div>
    
    
        <hr>
    
        <tractor-actividad-articulos
            v-model="form.articulos"
            :articulos="catalogos.articulos"
        />
    
        <tractor-actividad-activos
            v-model="form.activos"
            :activos="catalogos.activos"
        />
    
        <tractor-actividad-empleados
            v-model="form.empleados"
            :empleados="catalogos.empleados"
        />
    
    
        <button class="btn btn-primary mt-3" @click="guardar">
            Guardar Actividad
        </button>
    
    </div>
</template>
<script>
    import TractorActividadArticulos from './TractorActividadArticulos.vue'
    import TractorActividadActivos from './TractorActividadActivos.vue'
    import TractorActividadEmpleados from './TractorActividadEmpleados.vue'
    export default {
        components:{
            TractorActividadArticulos,
            TractorActividadActivos,
            TractorActividadEmpleados
        },
        
        props:{
            catalogos:Object
        },
        
        data(){
        return{
        
        form:{
            produccion_id:null,
            nombre:'',
            tractorista_id:null,
            horas:0,
            horas_extra:0,
            fecha_inicio:'',
            fecha_estimada_fin:'',
            observaciones:'',
        
            articulos:[],
            activos:[],
            empleados:[]
        }
        
        }
        },
        
        methods:{
        
        guardar(){
            
            // axios.post('/tractor-actividades',this.form)
            // .then(()=>{
            //     alert('Actividad guardada')
            // })
        
        }
        
        }
    }
</script>