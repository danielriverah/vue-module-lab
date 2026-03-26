  <template>
    <div class="actividad-tractorista">
        <div class="card">
            <div class="car-content">
                <div class="row">
                    <FiltrosGeneral
                        v-bind="propsFiltrosG"
                        @input="ChangeFiltrosGen"
                        
                    />
                </div>
            </div>
        </div>
<!-- <div class="card header-card">
            <div class="card-content">
                <div class="row" style="margin-bottom: 0;">
                    <div class="col s12">
                        <div class="filters row">
                            <div class="input-field col s12 m6 l6">
                                <select v-model="yearSeleccionado" class="browser-default"
                                    style="border-left:none;border-top:none;border-right:none;">
                                    <option value="" selected>Selecciona una opción</option>
                                    <option v-for="year in d_yearsSelect" :key="year" :value="year">{{year}}</option>
                                </select>
                                <label class="active">Año</label>
                            </div>
                            <div class="input-field col s12 m6 l6 vue-select-field">
                                <label class="active">Rancho</label>
                                <!-- <select v-model="ranchoSeleccionado" class="browser-default">
                                    <option value="" selected>Selecciona una opción</option>
                                    <option v-for="it in ranchosFiltrados" :key="it.nombre" :value="it.nombre">{{it.nombre}}</option>
                                </select> ->
                                <BaseSelect
                                    :options="ranchosFiltrados"
                                    :reduce="p => p.nombre"
                                    v-model="ranchoSeleccionado"
                                    :class="{ 'has-value': !!ranchoSeleccionado }"
                                    placeholder="Selecciona una opción"
                                    :append-to-body="true"
                                    :get-option-label="(option) => option.nombre"
                                >
                                </BaseSelect>
                            </div>
                            <div class="input-field col s12 m6 l6 vue-select-with-icon">
                                <label class="active">Zona produccion</label>
                                <i class="material-icons">map</i>
                                <!-- <select v-model="tablaSeleccionada" class="browser-default">
                                    <option value="" selected>Selecciona una opción</option>
                                    <option v-for="it in tablasFiltradas" :key="it.nombre" :value="it.nombre">{{it.nombre}}</option>
                                </select> ->
                                <BaseSelect
                                    :options="tablasFiltradas"
                                    label="nombre"
                                    :reduce="p => p.nombre"
                                    v-model="tablaSeleccionada"
                                    :class="{ 'has-value': !!tablaSeleccionada }"
                                    placeholder="Selecciona una opción"
                                    
                                />
                            </div>
                            <div class="input-field col s12 m6 l6">
                                <!-- <select v-model="produccionSeleccionada" class="browser-default">
                                    <option value="" selected>Selecciona una opción</option>
                                    <option v-for="it in produccionesfiltradas" :key="it.nombre" :value="it.nombre">{{it.nombre}}</option>
                                </select> ->
                                <BaseSelect
                                    :options="produccionesfiltradas"
                                    label="nombre"
                                    :reduce="p => p.produccion_id"
                                    v-model="produccionSeleccionada"
                                    :class="{ 'has-value': !!produccionSeleccionada }"
                                    placeholder="Selecciona una opción"
                                />
                                <label class="active">Producción</label>
                            </div>
                            
                            <!-- <div class="input-field col s12 m12 l2 right-align">
                                <a class="btn green lighten-4 grey-text text-darken-3">
                                    <i class="material-icons left">add</i>Crear actividad
                                </a>
                            </div> ->
                        </div>
                        <div class="row valign-wrapper col s12" style="margin-bottom: 0; padding: 0;">
                            <div class="row col s12">
                                <div class="grey-text text-darken-1 breadcrumb">
                                    Producción: 
                                    <i class="material-icons tiny">chevron_right</i>
                                    <strong class="mono">{{ produccion.folio??'FOLIO' }}</strong>
                                </div>
                                <h4 class="title">Plan de Producción: {{ produccion.plan_produccion??'plan_producción' }}</h4>
                                <!-- <div class="meta">
                                    <span>ID: <strong class="mono">{{ produccionSeleccionada }}</strong></span>
                                    <span class="dot"></span>
                                    <span><i class="material-icons tiny">location_on</i> North Sector A1</span>
                                </div> ->
                            </div>
                            <!-- <div class="row col s12 m4 right-align">
                                <a class="btn-flat btn-small">
                                    <i class="material-icons left">share</i>Compartir
                                </a>
                            </div> ->
                        </div>
                        <!-- <div class="filters row range-row">
                            <div class="input-field col s12 m6 l4">
                                <i class="material-icons prefix">date_range</i>
                                <input type="text" value="Oct 01, 2023 - Oct 31, 2023" />
                                <label class="active">Rango de fechas</label>
                            </div>
                            <div class="input-field col s12 m6 l4">
                                <i class="material-icons prefix">map</i>
                                <select class="browser-default">
                                    <option>All Zones</option>
                                    <option>North Sector A1</option>
                                    <option>North Sector A2</option>
                                    <option>Central Plot</option>
                                </select>
                                <label class="active">Zona productiva</label>
                            </div>
                            <div class="input-field col s12 m12 l4 right-align">
                                <a class="btn-flat grey-text text-darken-1">Limpiar filtros</a>
                            </div>
                        </div> -->
                        <!-- <div class="tab-like">
                            <a class="active"><i class="material-icons left">view_kanban</i>Resumen</a>
                            <a><i class="material-icons left">layers</i>Etapas</a>
                            <a><i class="material-icons left">link</i>Vinculadas</a>
                            <a><i class="material-icons left">settings</i>Ajustes</a>
                        </div> ->
                    </div>
                </div>
            </div>
        </div> 
-->

        <div class="row">
            <div class="col s12 l4">
                <div class="card timeline-card">
                    <div class="card-content">
                        <span class="card-title">Línea de producción <strong v-if="countEtapas>0"><small style="font-size: 8px;">({{ countEtapas }} Etapas)</small></strong></span>
                        <StatusTabs v-model="statusFiltroEtapas" :tabs="LineaTabs" />
                        <ul class="collection timeline-list">
                            <li
                                v-for="etapa in etapasFiltradasOrdenadas"
                                :key="etapa.estadistico_documento_id"
                                class="collection-item"
                                :class="{ active: etapaSeleccionada === etapa.estadistico_documento_id }"
                                @click="etapaSeleccionada = etapa.estadistico_documento_id"
                                @dragover.prevent
                                @drop="onDropStage($event,etapa.estadistico_documento_id)"
                                @dblclick="verEstadisticoById(etapa.estadistico_documento_id)"
                                
                            >
                                <DocumentoEstadistico
                                    :etapa="etapa"
                                    :catalogos="catalogosEstadisticos"
                                    :produccion="getProduccion"
                                    :actividades="actividadesPorEtapa(etapa.actividades_ids)"
                                    @verActividadesEtapa="verActividadesEtapa"
                                    @actualiza-catalogos="actualizaCatalogos"
                                    @agregar-actividad="modalCrearActividad"
                                />
                            </li>
                        </ul>
                    </div>
                    <div class="card-action">
                        <div class="row" style="margin-bottom: 0;">
                            <div class="col s6">
                                <div class="grey-text text-darken-1" style="font-size: 12px;">Cultivo</div>
                                <strong>{{ produccion.cultivo }}</strong>
                            </div>
                            <div class="col s6">
                                <div class="grey-text text-darken-1" style="font-size: 12px;">Superficie</div>
                                <strong>{{ produccion.superficie }}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col s12 l8">
                <div class="card">
                    <div class="card-content">
                        <div class="row valign-wrapper" style="margin-bottom: 0;">
                            <div class="col s12 m8">
                                <span class="card-title">
                                    Actividades:
                                    <strong>Todas <strong v-if="countActividades>0"><small style="font-size: 8px;">({{ countActividades }} Actividades)</small></strong></strong>
                                </span>
                                <!-- <p class="grey-text text-darken-1">
                                    Arrastra actividades para asignarlas a una etapa del plan.
                                </p> -->
                            </div>
                        </div>
                        <div class="grey-text text-darken-1 breadcrumb editable"  @click="mostrarFiltrosActividades">
                            Más filtros: 
                            <i class="material-icons tiny ">{{ !openInfo? 'keyboard_arrow_down' :'keyboard_arrow_up' }}</i>
                        </div>
                        <div class="divider"></div>
                        <div v-if="openInfo">
                            <ActivityFiltersForm 
                                v-model="filtrosAppActividades"
                                :catalogos="{tractoristas:tractoristasFiltrados}"
                                :rango="rangoFechasDisponibles"
                                @filtro-activ-change-tractorista="filtrosActsTrac"
                                @filtro-activ-change-buscar="filtrosActsBuscar"
                                @filtro-activ-change-rango="filtrosActsRango"
                            />
                        </div>
                        <StatusTabs v-model="statusFiltroActividades" :tabs="statusTabs" />
                        <div
                            class="dropzone"
                            @dragover.prevent
                            @drop="creaActividFromEtapa(etapaSeleccionada)"
                        >
                            <TablaActividades
                                :actividades="actividadesFiltradasOrdenadas"
                                :chip-actividad="chipActividad"
                                :etiqueta-actividad="etiquetaActividad"
                                :draggable="true"
                                :mostrar-etapa="true"
                                :etapas-map="etapasMap"
                                @editar-actividad="editarActividad"
                                @ligar-actividad="ligarActividad"
                                @ver-actividad="verActividad"
                                @ver-estadistico="verEstadistico"
                                @nueva-actividad="modalCrearActividad"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
<!-- MODALES -->
        <div>
            <ModalBase key="modal-ver-actividades" v-model="open_modal_lista_actividades" 
                :style="{
                    '--modal-max-width': '100%',
                    '--modal-width': '85%',
                }">
                <template v-slot:header>
                    <h5 v-if="actividadesFiltradasModal.length>1">Actividades</h5>
                    <h5 v-else>Actividad</h5>
                </template>
                <ul>
                    <li v-for="act in actividadesFiltradasModal" :key="act.actividad_id">
                        <!-- <p >Contenido del modal: {{act.actividad_id  }}</p> -->
                        <ActividadC
                            :actividad="act"
                            :config="{type:'full'}"
                            :chip-actividad="chipActividad"
                            :etiqueta-actividad="etiquetaActividad"
                        ></ActividadC>
                    </li>
                </ul>
                <template v-slot:footer>
                    <a class="btn-flat" @click="open_modal_lista_actividades = false">Cerrar</a>
                    <!-- <a class="btn" @click="guardar">Guardar</a> -->
                </template>

            </ModalBase>
        </div>
        <div>
            <ModalBase key="modal-ver-estadistico" v-model="open_modal_ver_estadisticos" 
                :style="{
                    '--modal-max-width': '100%',
                    '--modal-width': '85%',
                }">
                <template v-slot:header>
                    <h5>Estadistico</h5>
                </template>
                <ul>
                    <li v-for="est in estadisticosVer" :key="est.estadistico_documento_id">
                        <p >Contenido del modal: {{est.estadistico_documento_id }}</p>
                        
                    </li>
                </ul>
                <template v-slot:footer>
                    <a class="btn-flat" @click="open_modal_ver_estadisticos = false">Cerrar</a>
                    <!-- <a class="btn" @click="guardar">Guardar</a> -->
                </template>

            </ModalBase>
        </div>
        <div>
            <ModalBase key="modal-nueva-ctividad" v-model="modal_add_Actividad" 
                :style="{
                    '--modal-max-width': '100%',
                    '--modal-width': '85%',
                }">
                <template v-slot:header>
                    <h5 v-if="formNewAct.fromEtap">Nueva actividad desde etapa</h5>
                    <h5 v-else>Nueva actividad</h5>
                </template >
                <ActividadTractorEdit
                    v-bind="propsFormActividad"
                    @submit="onSubmitActividad"
                    @input="onImputActividad"
                ></ActividadTractorEdit>
                 <!-- <template v-slot="form"> -->
                    <!-- <form method="POST" :action="route('actividades.tractor.create')"> -->
                    <!-- <form @submit.prevent="enviarFormularioNuevaActividad" 
                        :style="{   
                        }"
                    >
                        <div class="row">
                            <div v-if="formNewAct.fromEtap" class="input-field col s12 m6">
                                <label class="active">Producción</label>
                                <input type="text" readonly :value="formNewAct.etapa.lote">
                                <span class="red-text" v-if="errors.produccion_id">
                                    {{ errors.produccion_id[0] }}
                                </span>
                            </div>
                            <div v-else class="input-field col s12 m6">
                                <BaseSelect
                                    :options="produccionesTrabajando"
                                    :reduce="p => p.produccion_id"
                                    v-model="formNewAct.produccion_id"
                                    :class="{ 'has-value': !!formNewAct.produccion_id }"
                                    label="nombre"
                                >
                                    <template #option="{ nombre, produccion_id }">
                                        {{ nombre }}
                                        <br />
                                        <cite>{{ nombre }} - {{ produccion_id }}</cite>
                                    </template>
                                </BaseSelect>
                                <label class="active">Producción</label>
                                <span class="red-text" v-if="errors.produccion_id">
                                    {{ errors.produccion_id[0] }}
                                </span>
                            </div>
                            <div v-if="formNewAct.fromEtap" class="input-field col s12 m6">
                                <label class="active">Etapa produccion</label>
                                <input type="text" readonly :value="formNewAct.etapa.label_select">
                                <span class="red-text" v-if="errors.draw">
                                    {{ errors.estadistico_documento_id[0] }}
                                </span>
                            </div>
                            <div v-else class="input-field col s12 m6">
                                <BaseSelect
                                        :options="etapasProduccionNE"
                                        label="label_select"
                                        :reduce="p => p.estadistico_documento_id"
                                        v-model="formNewAct.estadistico_documento_id"
                                        :class="{ 'has-value': !!formNewAct.estadistico_documento_id }"
                                    ></BaseSelect>
                                <label class="active">Etapa produccion</label>
                                <span class="red-text" v-if="errors.estadistico_documento_id">
                                    {{ errors.estadistico_documento_id[0] }}
                                </span>
                            </div>
                            <div class="input-field col s12 m6 l6 vue-select-with-icon">
                                <label class="active">Tractorista</label>
                                <i class="material-icons">people</i>
                                <BaseSelect
                                    :options="tractoristasNuevaActividad"
                                    label="nombre_corto"
                                    v-model="formNewAct.tractorista"
                                    :class="{ 'has-value': !!formNewAct.tractorista}"
                                    @input="onSelectTractorista($event)"
                                    placeholder="Selecciona una opción"
                                />
                                <span class="red-text" v-if="errors.tractorista_id">
                                    {{ errors.tractorista_id[0] }}
                                </span>
                            </div>
                            <div class="input-field col s12 m6">
                                <label :class="{'active':formNewAct.nombre!=='' && formNewAct.nombre!==null}">Nombre actividad</label>
                                <input type="text" v-model="formNewAct.nombre" :readonly="formNewAct.fromEtap">
                                <span class="red-text" v-if="errors.nombre">
                                    {{ errors.nombre[0] }}
                                </span>
                            </div>
                            <div class="input-field col s12 m6">
                                <label
                                :class="{ active: !!formNewAct.fecha_inicio }"
                                >
                                Fecha inicio
                                </label>
                                <input
                                type="date"
                                v-model="formNewAct.fecha_inicio"
                                :max="formNewAct.fecha_fin || null"
                                >
                                <span class="red-text" v-if="errors.fecha_inicio">
                                    {{ errors.fecha_inicio[0] }}
                                </span>
                            </div>

                            <div class="input-field col s12 m6">
                                <label
                                :class="{ active: !!formNewAct.fecha_fin }"
                                >
                                Fecha estimada fin
                                </label>
                                <input
                                type="date"
                                v-model="formNewAct.fecha_fin"
                                :min="formNewAct.fecha_inicio || null"
                                >
                                <span class="red-text" v-if="errors.fecha_fin">
                                    {{ errors.fecha_fin[0] }}
                                </span>
                            </div>
                            <div class="input-field col s12 m12">
                                <label :class="{'active':formNewAct.observaciones!=='' && formNewAct.observaciones!==null}">Observaciones</label>
                                <textarea name="observaciones" v-model="formNewAct.observaciones" class="materialize-textarea"></textarea>
                                <span class="red-text" v-if="errors.observaciones">
                                    {{ errors.observaciones[0] }}
                                </span>
                            </div>
                             <div class="inpu-field col l4 m6 s6">
                                <input type="number" min="0" step="0.25" v-model="formNewAct.horas"/>
                                <label :class="{'active':formNewAct.horas!=='' && formNewAct.horas!==null}">Horas</label>
                                <span class="red-text" v-if="errors.horas">
                                    {{ errors.horas[0] }}
                                </span>
                             </div>
                            <div class="inpu-field col l4 m6 s6">
                                <input type="number" min="0" step="0.25"  v-model="formNewAct.horas_extra"/>
                                <label :class="{'active':formNewAct.horas_extra!=='' && formNewAct.horas_extra!==null}">Horas extra</label>
                                <span class="red-text" v-if="errors.horas_extra">
                                    {{ errors.horas_extra[0] }}
                                </span>
                            </div>
                            <div class="col s12">
                                <h6>Empleados adicionales</h6>
                                <table class="highlight" id="empleados-table">
                                    <thead>
                                        <tr><th>Empleado</th><th>Horas</th><th>Horas extra</th><th></th></tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="emp in getEmpleadosActividad" :key="emp.empleado_id || emp._tmp">
                                            <td v-if="emp.editar">
                                                <BaseSelect
                                                    :options="catEmpleadosNewAct"
                                                    label="nombre_corto"
                                                    v-model="emp.empleado"
                                                    :class="{'has-value': !!emp.empleado}"
                                                    @input="onSelectEmpleado(emp, $event)"
                                                />
                                            </td>
                                            <td v-else @click="editarEmpleado(emp)" >
                                                  <input type="text" :value="emp.empleado ? emp.empleado.nombre_corto : ''" readonly>
                                            </td>
                                            <td v-if="emp.edita_horas">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.25"
                                                        v-model.number="emp.horas"
                                                        @blur="finalizarEdicionHoras(emp)"
                                                        @keyup.enter="finalizarEdicionHoras(emp)"
                                                        class="browser-default"
                                                        style="width:80px"
                                                    />
                                            </td><td v-else @click="actEditarHoras(emp)"><span
                                                        
                                                    >
                                                          <input type="text" :value="emp.horas"  readonly>
                                                    </span></td>
                                            <td v-if="emp.edita_horas">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.25"
                                                        v-model.number="emp.horas_extra"
                                                        @blur="finalizarEdicionHoras(emp)"
                                                        @keyup.enter="finalizarEdicionHoras(emp)"
                                                        class="browser-default"
                                                        style="width:80px"
                                                    />
                                            </td><td v-else @click="actEditarHoras(emp)"><span
                                                        
                                                    >
                                                          <input type="text" :value="emp.horas_extra" readonly></input>
                                                    </span></td>
                                            <td><a href="#" @click.prevent="quitarRegistro(emp)" class="btn-small red white-text">Eliminar</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button type="button" class="btn-small" @click="addEmpleado">Agregar empleado</button>
                            </div>
                           
                            <div class="col s12" style="margin-top:15px">
                                <h6>Recursos</h6>
                                <table class="highlight" id="recursos-table">
                                    <thead>
                                        <tr><th>Tipo</th><th>Referencia</th><th>Cantidad</th><th></th></tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(rec,index) in catGetRecursosActiv" :key="index" @click="recursoEditando(rec,index,$event)">
                                            <td v-if="rec.edita">
                                                <div>
                                                    <select 
                                                        style="display:block;" 
                                                        v-model="rec.tipo" 
                                                        class="prevent-default" 
                                                        @input="onSelectTipoRecurso(rec, $event)">
                                                        <option value="">Selecciona</option>
                                                        <option value="activo_fijo">Activo fijo</option>
                                                        <option value="materia_prima">Matria prima</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td v-else><input type="text" readonly :value="rec.tipo"></td>
                                            <td v-if="rec.edita">
                                                <BaseSelect 
                                                    :options="catReferencias"
                                                    label="nombre_select"
                                                    v-model="rec.referencia"
                                                    :class="{'has-value': !!rec.referencia}"
                                                    @input="onSelectRecurso(rec, $event)"
                                                ></BaseSelect>
                                            </td>
                                            <td v-else @click="activaSelectRec(rec)">
                                                <input type="text" v-model="rec.nombre_select" readonly>
                                            </td>
                                            <td>
                                                <input type="number" v-model.number="rec.cantidad" min="0" step="0.5">
                                            </td>
                                            <td><a href="#" @click.prevent="removeRecurso(rec,index)" class="btn-small red white-text">Eliminar</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                                <button type="button" @click.prevent="addRecurso" class="btn-small">Agregar recurso</button>
                            </div>
                        </div>
                    </form> -->
                 <!-- </template> -->
                <template v-slot:footer>
                    <a href="#" class="btn-flat" @click.prevent="modal_add_Actividad = false">Cerrar</a>
                    <a href="#" class="btn" @click.prevent="onSubmitActividad">Guardar</a>
                </template>
            </ModalBase>
        </div>
    </div>
    <!-- <ModalBase v-model="open">
        <template #header>
            <h4>Editar actividad</h4>
        </template>

        <p>Formulario de edición...</p>

        <template #footer>
            <button @click="guardar">Guardar</button>
            <button @click="open = false">Cancelar</button>
        </template>
    </ModalBase> -->
</template>
  
<script>
    import ActivityFiltersForm from './ActivityFiltersForm.vue'
    import StatusTabs from './StatusTabs.vue'
    import TablaActividades from './TablaActividades.vue'
    import DocumentoEstadistico from '../ProduccionPlanOperativo/DocumentosEstadisticos/DocumentoEstadistico.vue';
    import ActividadC from '../ProduccionPlanOperativo/Actividades/Actividad.vue'
    import axios from 'axios';
    import TesterView from '../Global/TesterView.vue';
    import FiltrosGeneral from '../Actividades/Tractor/FiltrosGeneral.vue';
    import ActividadTractorEdit from './ActividadTractorEdit.vue'
    //import SelectSearch from './../SelectSearchBase.vue'
    //C:\xampp\htdocs\WEB\clientes\megafresh\erp-mega\resources\assets\js\components\SelectSearchBase.vue
    export default {
        name: 'ActividadesProduccionView',
        components: { ActivityFiltersForm, StatusTabs, TablaActividades, DocumentoEstadistico,ActividadC,TesterView, FiltrosGeneral,ActividadTractorEdit },
        created(){
            this.consultaData()
            this.actualizaCatalogos();
            this.$set(
                this.formFiltrosGen,
                'produccion',
                {area: "3.630000",articulo: "LECHUGA",centro_costo_id: 343,cultivo: "LECHUGA",folio: "TL2502-26-02",nombre: "TL2502-26-02",plan_operativo_id: 33,
                    produccion: "TL2502-26-02",produccion_id: 1872,rancho: "EL TULIPAN",rancho_id: 343,superficie: "3.630000 Hectareas",tabla_id: 56,year: 2025}
            );
        },
        props: {
            catalogos:{
                type:Object,
                default:()=>{
                    return {
                        tractoristas:[]
                    }
                }
            },
            d_yearsSelect: {
                type: Array,
                default: () => {
                    const currentYear = new Date().getFullYear()
                    return Array.from({ length: 5 }, (_, i) => currentYear - i)
                }
            },
            d_ranchos:{
                type: Array,
                default:()=>{ return []}
            },
            d_tablas:{
                type:Array,
                default:()=>{return []}
            },
            d_producciones:{
                type:Array,
                default:()=>{return []}
            },
            datos:{
                type:Object,
                default:()=>{return {}}
            }
        },
        data() {
            return {
                
                
                errors:{},
                actividades:[],
                etapas:[],
                
                actividadesModal:[],
                estadisticosModal:[],
                etapaSeleccionada: 1,
                LineaTabs: ['Todas', 'Pendientes', 'En proceso', 'Terminadas','omitidas','Atrasadas', 'Sin actividades'],
                statusTabs: ['Todas', 'Pendientes', 'En proceso', 'Terminadas', 'Sin ligar'],
                statusFiltroEtapas: 'Todas',
                statusFiltroActividades: 'Todas',
                yearSeleccionado:"",
                ranchoSeleccionado:"",
                tablaSeleccionada:"",
                countEtapas:0,
                countActividades:0,
                produccion:{},
                open_modal_lista_actividades:false,
                open_modal_ver_estadisticos:false,
                consultarCatsAx:null,
                modal_add_Actividad:false,
                recursoEditandoSelected:null,
                filtrosAppActividades: {
                    operador: null,
                    fechaInicio: null,
                    fechaFin: null,
                    texto: ''
                },
                //filtros---------------------------------------------------------------------------------------------
                localCatalogos:{},
                formFiltrosGen:{year:'',rancho:'',zona:'',produccion:'',rango:{inicio:null,fin:null},},
                produccionSeleccionada:null,
                rangoGeneral:null,
                etapas_plan_operativo:[],
                tractor_actividades:[],
                filtrosActividades:{operador:'',buscar:'',fecha_inicio:'',fecha_fin:''},
                openInfo:false,
                formNewAct:{
                    fromEtap:false,
                    editando:false,
                    onlyView:false,
                    etapa:{},
                    produccion_id:'',
                    estadistico_documento_id:'',
                    tractorista_id:'',
                    nombre:'',
                    fecha_inicio:null,
                    fecha_fin:null,
                    observaciones:'',
                    horas:null,
                    horas_extra:null,
                    empleados_extra:[],
                    recursos:[],
                    produccion:null,
                    estadistico:null,
                    tractorista:null,
                    fechas:{inicio:null,fin:null},
                },
                erroresNewAct:{},
            }
        },

        computed: {
            
            getEmpleadosActividad(){
                return this.formNewAct.empleados_extra;
            },
            catEmpleadosNewAct(){
                const empleadisids=this.formNewAct.empleados_extra.map(e=>e.empleado_id);
                empleadisids.push(this.formNewAct.tractorista_id??0)
                return this.catalogos.empleados.filter(e=>{return !empleadisids.includes(e.empleado_id)});
            },
            
            
            etapasMap() {
                return {};
                return this.etapas_plan_operativo?.reduce((acc, etapa) => {
                acc[etapa.id] = etapa.titulo
                return acc
                }, {})
            },
            
            
            ranchosFiltrados(){
                if (!this.yearSeleccionado) {
                    return this.d_ranchos;
                }
                //Obtener IDs únicos de ranchos para el año
                const idsRanchos = this.d_producciones
                    .filter(p => p.year == this.yearSeleccionado)
                    .map(p => p.rancho_id)
                //Filtrar ranchos
                
                const res=this.d_ranchos.filter(r =>
                    idsRanchos.includes(r.rancho_id)
                )
                if(this.ranchoSeleccionado && res.filter(a=>a.nombre==this.ranchoSeleccionado).length==0){
                    this.ranchoSeleccionado="";
                }
                return res;
            },
            tablasFiltradas(){
                const idsTablas = this.d_producciones
                    .filter(p => p.year == this.yearSeleccionado)
                    .map(p => p.tabla_id)
                const ranchoid=this.d_ranchos.filter(r=>r.nombre==this.ranchoSeleccionado).map(r=>r.rancho_id)[0];
                let res=[];
                if(idsTablas.length==0 && !ranchoid){
                    res=this.d_tablas
                }else if(idsTablas.length>0 && ranchoid){
                    res=this.d_tablas.filter(t=> idsTablas.includes(t.tabla_id) && t.rancho_id==ranchoid)
                }else if(idsTablas.length>0 && !ranchoid){
                    res=this.d_tablas.filter(t=> idsTablas.includes(t.tabla_id))
                }else if(idsTablas.length==0 && ranchoid){
                    res=this.d_tablas.filter(t=>t.rancho_id==ranchoid)
                }else{
                    res=this.d_tablas
                }
                if(this.tablaSeleccionada && res.filter(a=>a.nombre==this.tablaSeleccionada).length==0){
                    this.tablaSeleccionada="";
                }
                return res;
            },
            produccionesfiltradas(){
                const year=this.yearSeleccionado;
                const ranchoid=this.d_ranchos.filter(r=>r.nombre==this.ranchoSeleccionado).map(r=>r.rancho_id)[0];
                const tablaid=this.d_tablas.filter(t=>t.nombre==this.tablaSeleccionada).map(t=>t.tabla_id)[0];
                let res=[];
                if(year && ranchoid && tablaid){
                    res=this.d_producciones.filter(p=>p.year==year && p.rancho_id==ranchoid && p.tabla_id==tablaid);
                }else if(year && ranchoid){
                    res=this.d_producciones.filter(p=>p.year==year && p.rancho_id==ranchoid);
                }else if(year && tablaid){
                    res=this.d_producciones.filter(p=>p.year==year && p.tabla_id==tablaid);
                }else if(ranchoid && tablaid){
                    res=this.d_producciones.filter(p=>p.rancho_id==ranchoid && p.tabla_id==tablaid);
                }else if(year){
                    res=this.d_producciones.filter(p=>p.year==year);
                }else if(ranchoid){
                    res=this.d_producciones.filter(p=>p.rancho_id==ranchoid);
                }else if(tablaid){
                    res=this.d_producciones.filter(p=>p.tabla_id==tablaid);
                }else{
                    res=this.d_producciones;
                }
                if(this.produccionSeleccionada && res.filter(a=>a.produccion_id==this.produccionSeleccionada).length==0){
                    this.produccionSeleccionada="";
                }
                return res;
            },
            actividadesFiltradasModal(){
                return this.actividadesModal;//=this.actividades.filter(a=>this.etapaVerActividades.actividades_ids.includes(a.actividad_id));
            },
            estadisticosVer(){
                return this.estadisticosModal;
            },
            catalogosEstadisticos(){
                return {...this.catalogos};
            },
            getProduccion(){
                return this.d_producciones.find(p=>p.produccion_id==this.produccionSeleccionada);
            },
            tieneEmpleadoIncompleto() {
                return this.formNewAct.empleados_extra.some(
                    e => !e.empleado_id
                );
            },
            tienaRecursoIncompleto(){
                return this.formNewAct.recursos?.some(
                    r => !r.tipo || !r.referencia || !r.cantidad
                );
            },
            catGetRecursosActiv(){
                return this.formNewAct.recursos??[];
            },
            catReferencias(){
                const tipo=this.recursoEditandoSelected.tipo;//'activo_fijo'
                if(tipo=='activo_fijo'){
                    const afIds=this.formNewAct.recursos.filter(r=>{ return (r.tipo=='activo_fijo' && r.referencia && r.referencia!='') }).map(r=>r.recurso_id );
                    //console.log(afnames)
                    //const afIds=this.catalogos.activos_fijos.filter(af=>afnames.includes(af.nombre)).map(af=>af.activo_fijo_id);
                    console.log(afIds)
                    return this.catalogos.activos_fijos.filter(af=> !afIds.includes(af.activo_fijo_id));
                    return [{referencia_id:1,nombre:'af1'},{referencia_id:2,nombre:'af2'}];
                }else if(tipo=='materia_prima'){
                    const mpIds=this.formNewAct.recursos.filter(r=>{ return (r.tipo=='materia_prima' && r.referencia && r.referencia!='') }).map(r=>r.recurso_id );
                    //console.log(afnames)
                    //const mpIds=this.catalogos.articulos_mp.map(mp=>{if(mpnames.includes(mp.nombre)) return mp.articulo_id;});
                    console.log(mpIds)
                    return this.catalogos.articulos_mp.filter(mp=> !mpIds.includes(mp.articulo_id));
                    return [{referencia_id:1,nombre:'mp1'},{referencia_id:2,nombre:'mp2'}];
                }else{
                    return [];
                }
            },
            
            
            // filtrosActividades(){
            //     return [...this.actividadesFiltradas].sort((a, b) => {
            //         return new Date(a.fecha_inicio) - new Date(b.fecha_inicio);
            //     });
            // },
            //NUevo Computed----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            catalogosFiltroG(){
                return {tablas:this.localCatalogos.tablas,ranchos:this.localCatalogos.ranchos,producciones:this.localCatalogos.producciones}
            },
            propsFiltrosG(){
                return {catalogos:this.catalogosFiltroG,form:this.formFiltrosGen}
            },
            etapasFiltradas() {
                if(!this.produccionSeleccionada)return[];
                let res=this.etapas_plan_operativo.filter(i=>i.produccion_id==this.produccionSeleccionada.produccion_id);
                /*
                const status = this.statusFiltroEtapas
                if(status=='Sin actividades'){
                    return this.etapas_plan_operativo.filter(e=>e.actividades.length==0 && e.estatus_doc!='omitida' && e.produccion_id==this.produccionSeleccionada);
                }else if( status!='Todas'){
                    return this.etapas_plan_operativo.filter(e=>{
                        const estatus=
                                status=='Pendientes'? 'pendiente': 
                                status=='En proceso'?'en_progreso':
                                status=='Terminadas'?'completada':
                                status=='omitidas'?'omitida':
                                status=='Atrasadas'?'atrasada':'';
                        return e.estatus_doc==estatus && e.produccion_id==this.produccionSeleccionada;
                    })
                }
                return this.etapas_plan_operativo.filter(e=>e.produccion_id==this.produccionSeleccionada);*/
                return res;
            },
            etapasFiltradasTabsDate(){
                let res=this.etapasFiltradas;
                if(this.rangoGeneral && (this.rangoGeneral.inicio || this.rangoGeneral.fin)){
                    console.log(this.rangoGeneral)
                    let fi=null
                    let ff=null
                    if(this.rangoGeneral.inicio){fi=new Date(this.rangoGeneral.inicio);}
                    if(this.rangoGeneral.fin){ff=new Date(this.rangoGeneral.fin);}
                    if(fi && !ff){res=res.filter(e=>new Date(e.fecha_estimada_inicio)>=fi);}
                    else if(!fi && ff){res=res.filter(e=>new Date(e.fecha_estimada_inicio)<=ff);}
                    else if(fi && ff){res=res.filter(e=>new Date(e.fecha_estimada_inicio)>=fi && new Date(e.fecha_estimada_inicio)<=ff);}
                }
                const status = this.statusFiltroEtapas
                if(status=='Sin actividades'){
                    res=res.filter(e=>e.actividades.length==0 && e.estatus_doc!='omitida');
                }else if( status!='Todas'){
                    res=res.filter(e=>{
                        const estatus=
                                status=='Pendientes'? 'pendiente': 
                                status=='En proceso'?'en_progreso':
                                status=='Terminadas'?'completada':
                                status=='omitidas'?'omitida':
                                status=='Atrasadas'?'atrasada':'';
                        return e.estatus_doc==estatus;
                    })
                }
                return res;
            },
            etapasFiltradasOrdenadas() {
                //console.log(this.etapasFiltradasTabsDate)
                //return this.etapasFiltradasTabsDate;
                let res = this.etapasFiltradasTabsDate; // o el filtro base
                //copiar antes de ordenar
                const r= [...res].sort((a, b) => {
                    // ordenar por campo principal
                    if (a.orden !== b.orden) {
                        return a.orden > b.orden ? 1 : -1;
                    }
                    // ordenar por fecha
                    return new Date(a.fecha_estimada_inicio) - new Date(b.fecha_estimada_inicio);
                });
                this.countEtapas=r.length;
                return r;
            },
            actividadesFiltradas() {
                if(!this.produccionSeleccionada)return[];
                let res=this.tractor_actividades.filter(e=>e.produccion_id==this.produccionSeleccionada.produccion_id);
                // let status = this.statusFiltroActividades
                // if(status=='Sin ligar'){
                //     return this.tractor_actividades.filter(a=>!a.estadistico_documento_id && a.produccion_id==this.produccionSeleccionada);
                // }else if(status!='Todas'){
                //     status=this.normalizarStatus(status)
                //     return this.tractor_actividades.filter(a=>a.estatus==status && a.produccion_id==this.produccionSeleccionada)
                // }
                // return this.tractor_actividades.filter(a=>a.produccion_id==this.produccionSeleccionada);
                return res;
            },
            actividadesFiltradasTabsFiltrosDate(){
                let res=this.actividadesFiltradas;
                if(this.rangoGeneral && (this.rangoGeneral.inicio || this.rangoGeneral.fin)){
                    console.log(this.rangoGeneral)
                    let fi=null
                    let ff=null
                    if(this.rangoGeneral.inicio){fi=new Date(this.rangoGeneral.inicio);}
                    if(this.rangoGeneral.fin){ff=new Date(this.rangoGeneral.fin);}
                    if(fi && !ff){res=res.filter(e=>new Date(e.fecha_inicio)>=fi);}
                    else if(!fi && ff){res=res.filter(e=>new Date(e.fecha_inicio)<=ff);}
                    else if(fi && ff){res=res.filter(e=>new Date(e.fecha_inicio)>=fi && new Date(e.fecha_inicio)<=ff);}
                }
                let status = this.statusFiltroActividades
                if(status=='Sin ligar'){
                    res=res.filter(a=>!a.estadistico_documento_id);
                }else if(status!='Todas'){
                    status=this.normalizarStatus(status)
                    res=res.filter(a=>a.estatus==status)
                }
                return res
            },
            actividadesFiltradasOrdenadas() {
                //return this.actividadesFiltradasTabsFiltrosDate;
                let res = this.actividadesFiltradasTabsFiltrosDate; // o el filtro base
                //copiar antes de ordenar
                let r=[...res].sort((a, b) => {
                    return new Date(a.fecha_inicio) - new Date(b.fecha_inicio);
                });
                //filtrosActividades:{operador:'',buscar:'',fecha_inicio:'',fecha_fin:''}
                // filtrar por operador
                if (this.filtrosActividades.operador) {
                    r = r.filter(a =>
                        a.tractorista_id === this.filtrosActividades.operador.empleado_id
                    );
                }
                // filtrar por rango de fechas
                if (this.filtrosActividades.fecha_inicio && this.filtrosActividades.fecha_inicio!='') {
                    r = r.filter(a =>
                        new Date(a.fecha_inicio) >= new Date(this.filtrosActividades.fecha_inicio)
                    );
                }

                if (this.filtrosActividades.fecha_fin && this.filtrosActividades.fecha_fin!='') {
                    r = r.filter(a =>
                        new Date(a.fecha_inicio) <= new Date(this.filtrosActividades.fecha_fin)
                    );
                }

                // búsqueda textual
                if (this.filtrosActividades.buscar && this.filtrosActividades.buscar.trim()!='') {
                    const q = this.filtrosActividades.buscar.toLowerCase();
                    r = r.filter(a =>
                        (a.nombre || '').toLowerCase().includes(q) ||
                        (a.descripcion || '').toLowerCase().includes(q) ||
                        (a.fecha_inicio || '').includes(q)
                    );
                }
                this.countActividades=r.length;
                return r;
            },
            tractoristasFiltrados(){
                console.log(this.catalogos)
                if(!this.catalogos.tractoristas || this.catalogos.tractoristas=='undefined'){
                        return [];
                    }
                    const map = new Map();
                    this.actividadesFiltradas.forEach(a=>{
                        if(a.tractorista_id){
                            const tr=this.catalogos.tractoristas.find(t=>t.empleado_id==a.tractorista_id);
                            if(tr && !map.has(tr.empleado_id)){
                                map.set(tr.empleado_id,tr);
                            }
                        }
                    })
                    return Array.from(map.values()).map(op => ({
                        ...op,
                        nombre_corto: `${op.nombre} ${op.apellido_paterno} ${op.apellido_materno}`
                }));
            },
            rangoFechasDisponibles(){
                if (!this.actividadesFiltradas.length) {
                    return { min: null, max: null };
                }
                const fechas = this.actividadesFiltradas.map(a =>{
                    //console.log(a)
                    return new Date(a.fecha_inicio)
                });
                //console.log(fechas);
                return {
                    min: new Date(Math.min(...fechas)).toISOString().slice(0, 10),
                    max: new Date(Math.max(...fechas)).toISOString().slice(0, 10)
                };
            },
            produccionesTrabajando(){
                if(!this.produccionSeleccionada)return[];
                return [this.produccionSeleccionada]
            },
            etapasProduccionNE(){
                let res=this.etapasFiltradas.filter(e=>{return !(['completada','omitida']).includes(e.estatus_doc)})
                return res;
            },
            tractoristasNuevaActividad(){
                const idsEmpleados=this.formNewAct.empleados_extra.map(e=>{return e.empleado_id});
                //console.log(idsEmpleados,this.catalogos.tractoristas)
                return this.catalogos.tractoristas.filter(t=>{ return !idsEmpleados.includes(t.empleado_id)});
            },
            propsFormActividad(){
                let res={
                    catalogos:this.catalogosAct,
                    value:this.formNewAct,
                    errors:this.erroresNewAct,
                }
                return res;
            },
            catalogosAct(){
                return {producciones:this.produccionesTrabajando,estadisticos:this.etapasProduccionNE,tractoristas:this.tractoristasNuevaActividad}
            },
        },
        methods: {
            onSelectTractorista(tractorista){
                if(!tractorista){
                    this.formNewAct.tractorista_id=null;
                    return;
                }
                this.formNewAct.tractorista_id = tractorista.empleado_id;
            },
            recursoEditando(rec,index,event){
                
                let indx=this.formNewAct.recursos.indexOf(this.recursoEditandoSelected);
                if(indx!=index){
                    if(this.tienaRecursoIncompleto){
                        alert('Completa recurso incompleto');
                        return;
                    }
                    console.log(rec,index,event)
                    this.recursoEditandoSelected=rec;
                }
            },
            onSelectTipoRecurso(rec,value){
                //console.log(rec)
                if(!this.recursoEditandoSelected){this.recursoEditandoSelected=rec;}
                setTimeout(()=>{
                    if(rec.lastRecurso){
                        const valores=this.catReferencias.find(r=>r.recurso_id==rec.recurso_id)
                        if(valores){
                            if(rec.recurso_id!=rec.lastRecurso.recurso_id)
                                rec.referencia=rec.lastRecurso;
                        }else{
                            rec.referencia=null;
                        }
                    }
                },100)
                
            },
            onSelectRecurso(rec,value){
                rec.lastRecurso=value;
                rec.recurso_id=value.recurso_id
                rec.nombre_select=value.nombre_select
                if(!this.recursoEditandoSelected){this.recursoEditandoSelected=rec};
            },
            removeRecurso(rec,index){
                let indexRec=this.formNewAct.recursos.indexOf(rec);
                if(indexRec==index){
                    this.recursoEditandoSelected=null;
                }
                this.formNewAct.recursos.splice(index,1);
                //this.formNewAct.recursos=this.formNewAct.recursos.
            },
            activaSelectRec(rec){
                console.log(rec)
                this.formNewAct.recursos.forEach(r=>{if(r!=rec)r.edita_ref=false;})
                rec.edita_ref=true;
            },
            addRecurso(){
                if(this.tienaRecursoIncompleto){
                    alert('Completa recurso incompleto');
                    return;
                }
                const newRec={
                    recurso_id:0,
                    edita:true,
                    edita_ref:false,
                    tipo:'',
                    recurso_id:null,
                    nombre:'',
                    cantidad:0
                }
                this.recursoEditandoSelected=newRec;
                this.formNewAct.recursos.push(newRec);
            },
            getEmpleadoAdicional(empleadoId){
                return this.catalogos.empleados.find(e=>e.empleado_id==empleadoId).nombre_corto??'';
            },
            onSelectEmpleado(emp, empleado) {
                //console.log(emp,empleado)
                if(!empleado){
                    emp.empleado_id=null;
                    return;
                }
                //console.log(emp, empleadoNombre,this.catalogos);
                //const empleado = this.catalogos.empleados.find(e => e.empleado_id === empleadoId);
                //console.log(emp, empleadoNombre,empleado)
                //emp={...emp,...empleado}
                emp.empleado_id = empleado.empleado_id;
                emp.editar = false;
            },
            editarEmpleado(emp) {
                // si hay otro incompleto, no permitir
                if (this.tieneEmpleadoIncompleto && !emp.editar) {
                    alert('Primero termina de seleccionar el empleado pendiente.');
                    return;
                }

                this.formNewAct.empleados_extra.forEach(e => e.editar = false);
                emp.editar = true;
                
            },
            finalizarEdicionHoras(emp) {
                // validación mínima
                emp.horas = Math.max(0, emp.horas || 0);
                emp.horas_extra = Math.max(0, emp.horas_extra || 0);
                if (emp.horas > 24) emp.horas = 24;
                if (emp.horas_extra > 24) emp.horas_extra = 24;
                emp.edita_horas = false;
            },
            quitarRegistro(emp) {
                if (!confirm('¿Eliminar este empleado?')) return;
                this.formNewAct.empleados_extra = this.formNewAct.empleados_extra.filter(e => e !== emp);
            },
            addEmpleado(){
                // ya hay uno sin seleccionar
                if (this.tieneEmpleadoIncompleto) {
                    if (!confirm('Hay un empleado sin seleccionar. ¿Deseas descartarlo?')) {
                        return;
                    }
                    // eliminar incompletos
                    this.formNewAct.empleados_extra = this.formNewAct.empleados_extra.filter(
                        e => e.empleado_id
                    );
                }
                // desactivar edición previa
                this.formNewAct.empleados_extra.forEach(e => e.editar = false);

                // agregar nuevo
                this.formNewAct.empleados_extra.push({
                    empleado_id: null,
                    nombre: '',
                    horas: 0,
                    horas_extra: 0,
                    editar: true
                });
            },
            actEditarHoras(emp) {
                console.log(emp.edita_horas,emp)
                // no permitir si no hay empleado
                if (!emp.empleado_id) {
                    alert('Primero selecciona un empleado');
                    return;
                }
                // cerrar cualquier otra edición
                const datos=[...this.formNewAct.empleados_extra];
                datos.forEach(e =>{
                    e.edita = false
                    if(e.empleado_id!=emp.empleado_id)
                        e.edita_horas = false
                    else{
                        e.edita_horas=true;
                    }
                });
                /*this.formNewAct.empleados_extra.forEach(e => e.edita_horas = false);
                emp.edita = false;
                emp.edita_horas = true;*/
                this.formNewAct.empleados_extra=datos
            },
            
            actividadesPorEtapa(actividades) {
                return this.tractor_actividades.filter(a=> actividades.includes(a.actividad_tractorista_id));
                // return this.actividades.reduce((acc, actividad) => {
                // const key = actividad.etapa_id || 'sin'
                // if (!acc[key]) acc[key] = []
                // acc[key].push(actividad)
                // return acc
                // }, {})
            },
            normalizarStatus(status) {
                return {
                    Pendientes: 'PENDIENTE',
                    'En proceso': 'EN_PROCESO',
                    Terminadas: 'TERMINADA'
                }[status]
            },
            chipActividad(act) {
                if (!act.estadistico_documento_id) return 'purple lighten-3'
                return {
                PENDIENTE: 'orange lighten-3',
                EN_PROCESO: 'blue lighten-3',
                TERMINADA: 'green lighten-3'
                }[act.estatus]
            },
        
            etiquetaActividad(act) {
                if (!act.estadistico_documento_id) return 'SIN LIGAR'
                return act.estatus
            },
            ligarActividad(act) {
                alert(`Ligar actividad: ${act.nombre}`)
            },
            verActividad(actividadId) {
                this.actividadesModal=this.tractor_actividades.filter(a=>a.actividad_id==actividadId);
                this.open_modal_lista_actividades=true;
            },
            verEstadistico(act){
                //alert(`Ver Estadístico: ${act.estadistico_documento_id}`)
                this.estadisticosModal=this.etapas_plan_operativo.filter(e=>e.estadistico_documento_id==act.estadistico_documento_id);
                this.open_modal_ver_estadisticos=true;
            },
            verEstadisticoById(estadisticoId){
                //alert(`Ver Estadístico: ${act.estadistico_documento_id}`)
                this.estadisticosModal=this.etapas_plan_operativo.filter(e=>e.estadistico_documento_id==estadisticoId);
                this.open_modal_ver_estadisticos=true;
            },
            onDropStage(event, etapaId) {
                event.preventDefault();
                let id = Number(event.dataTransfer.getData('text/plain'))
                if(id && !isNaN(id) && etapaId){
                    console.log('onDropStage: ',etapaId,event,'actividad_id: ',id)
                }/*return event => {
                    const actividadId = Number(event.dataTransfer.getData('text/plain'))
                    console.log('actividadId:' ,actividadId)
                    const actividad = this.actividades.find(
                        item => item.tractor_actividad_id === actividadId
                    )
                    if (!actividad) return
                        actividad.etapa_id = etapaId || null
                }*/
            },
            creaActividFromEtapa(etapasId){
                const de=this.etapas_plan_operativo.find(e=>e.estadistico_documento_id==etapasId && !(['omitida','completada']).includes(e.estatus_doc))
                if(!de) return;
                this.modalEditaActividad(de);
            },
            verActividadesEtapa(estadisticoId){
                const estadistico=this.etapas_plan_operativo.filter(e=>e.estadistico_documento_id==estadisticoId)[0];
                if(!estadistico){
                    console.log('No se encontro estadistico');
                    return;
                }
                this.actividadesModal=this.tractor_actividades.filter(a=>estadistico.actividades_ids.includes(a.actividad_id))
                this.open_modal_lista_actividades=true;
            },
            guardar() {
                console.log('guardar...');
                this.open=false;
            },
            actualizaCatalogos(parametros={}){
                
                clearTimeout(this.consultarCatsAx);
                this.consultarCatsAx=setTimeout(()=>{
                   const uri=this.route('catalogos.actividades_tractor',parametros);
                    $.ajax({
                        url:uri,
                        dataType:'json',
                        success:(res)=>{
                            console.log(res)
                            // this.catalogos.tractoristas=res.tractoristas??[];
                            for(let i in res){
                                this.catalogos[i]=res[i];
                                //this.catalogos={...this.catalogos??{},...res};

                            }
                        },
                        error:()=>{console.log('error consultaTractoristas') }
                    })
                },300);
                
            },
            //ACTIVIDADES
            modalCrearActividad(estadistico){
                console.log(estadistico)
                this.$set(this.formNewAct,'editando',false);
                this.$set(this.formNewAct,'fromEtap',(estadistico)?true:false);
                this.$set(this.formNewAct,'produccion',this.produccionSeleccionada??null);
                this.$set(this.formNewAct,'estadistico',(estadistico)?estadistico:null);
                this.$set(this.formNewAct,'nombre',estadistico?.nombre??null);
                this.$set(this.formNewAct,'fechas',{inicio:(estadistico)? estadistico.fecha_estimada_inicio:null,fin:(estadistico)? estadistico.fecha_estimada_fin:null});
                this.$set(this.formNewAct,'recursos',[]);
                this.$set(this.formNewAct,'empleados_extra',[]);
                /*
                this.formNewAct.editando=false;
                this.formNewAct.fromEtap=(estadistico)?true:false;
                this.formNewAct.etapa=(estadistico)?estadistico:{};
                this.formNewAct.actividad_tractorista_id=null;
                this.formNewAct.nombre=estadistico?.nombre??'RASTREAR'
                this.formNewAct.produccion_id=this.produccionSeleccionada.produccion_id
                this.formNewAct.estadistico_documento_id=estadistico?.estadistico_documento_id??''
                this.formNewAct.descripcion=estadistico?.descripcion??''
                this.formNewAct.fecha_inicio=estadistico?.fecha_estimada_inicio??''
                this.formNewAct.fecha_fin=estadistico?.fecha_estimada_fin??''
                this.formNewAct.fecha_estimada_fin=estadistico?.fecha_estimada_fin??''
                this.formNewAct.empleados_extra=[]
                this.formNewAct.recursos=[]*/
                // if(estadistico){
                //     this.formNewAct.fromEtap=true;
                //     this.formNewAct.etapa=estadistico;
                // }
                this.modal_add_Actividad=true;
            },
            editarActividad(actividad){
                console.log(actividad);
                this.$set(this.formNewAct,'editando',true);
                this.$set(this.formNewAct,'fromEtap',false);
                /**produccionesTrabajando
                    etapasProduccionNE 
                    catalogos.tractoristas*/
                const estadistico=this.etapasProduccionNE.find(i=>i.estadistico_documento_id==actividad.estadistico_documento_id)
                const produccion=this.produccionesTrabajando.find(p=>p.produccion_id==actividad.produccion_id);
                const tractorista=this.catalogos.tractoristas.find(t=>t.empleado_id==actividad.tractorista_id);
                this.$set(this.formNewAct,'produccion',produccion??null);
                this.$set(this.formNewAct,'estadistico',estadistico??null);
                this.$set(this.formNewAct,'tractorista',tractorista??null);
                this.$set(this.formNewAct,'nombre',actividad?.nombre??null);
                this.$set(this.formNewAct,'descripcion',actividad.observaciones??'');
                this.$set(this.formNewAct,'fechas',{inicio:actividad.fecha_inicio??null,fin:actividad.fecha_fin??null});
                this.$set(this.formNewAct,'recursos',actividad.recursos??[]);
                this.$set(this.formNewAct,'empleados_extra',actividad.empleados_extra??[]);
                /*
                    this.formNewAct.editando=true;
                    this.formNewAct.fromEtap=false;
                    this.formNewAct.actividad_tractorista_id=actividad.actividad_tractorista_id;
                    this.formNewAct.nombre=actividad.nombre;
                    this.formNewAct.produccion_id=actividad.produccion_id??'';
                    this.formNewAct.estadistico_documento_id=actividad.estadistico_documento_id??''
                    this.formNewAct.descripcion=actividad.descripcion??''
                    this.formNewAct.fecha_inicio=actividad.fecha_inicio??''
                    this.formNewAct.fecha_fin=actividad.fecha_fin??''
                    this.formNewAct.empleados_extra=actividad.empleados_extra??[];
                    this.formNewAct.recursos=actividad.recursos??[];
                    this.formNewAct.empleados_extra=actividad.empleados_extra??[]
                    this.formNewAct.recursos=actividad.recursos??[]
                */
                this.modal_add_Actividad=true;
            },
            onImputActividad(form){
                this.formNewAct={...this.formNewAct,...form}
            },
            aplicaReglas(campo,group,form,formErrors){
                const required=group.required??false;
                const customFuns=group.custom??[];
                const value=form[campo];
                if(required && ((form[campo]??null)==null || form[campo]=='')){
                    formErrors[campo]="Campo requerido."
                    return;
                }
                customFuns.forEach(funStr => {
                    let message={value:null};
                    // const rule=funStr.split(':');
                    // const funName=rule.shift();
                    // const fun= this.validations[funName];
                    // if(typeof fun=='function'){
                    //     const valid=fun(value,...rule);
                    //     if(!valid){
                    //         formErrors[campo]=`Error en el campo ${campo} al aplicar regla ${funName}`;
                    //     }
                    // }
                });
            },
            checkFormActividad(){
                this.erroresNewAct={};
                console.log(this.formNewAct)
                const rules={
                    produccion:{required:true,custom:["esUnidadProductiva"]},
                    estadistico:{required:true,custom:["esEstadistico"]},
                    tractorista:{required:true,custom:["esTractorista"]},
                    nombre:{required:true,custom:["noVacio"]},
                    fechas:{required:true,custom:["fechas"]},
                    observaciones:{required:false,custom:["noVacio"]},
                    horas:{required:true,custom:["noVacio","esNumero","min:0","max:24"]},
                    horas_extra:{required:true,custom:["noVacio","esNumero","min:0","max:24"]},
                }
                for(const i in this.formNewAct){
                    if(rules[i]){
                        this.aplicaReglas(i,rules[i],this.erroresNewAct)
                    }
                }
                console.log(this.erroresNewAct,Object.values(this.erroresNewAct).filter(v => v !== null && v !== '').length,this.erroresNewAct.length)
                if(Object.values(this.erroresNewAct).filter(v => v !== null && v !== '').length>0){return false;}
                return true;
            },
            onSubmitActividad(){
                // this.erroresNewAct={
                //         produccion:"teste_mensaje.",
                //         estadistico:"test Message.",
                //         tractorista:"test Message.",
                //         nombre:"test Message.",
                //         fechas:"test Message.",
                //         observaciones:"test Message.",
                //         horas:"test Message.",
                //         horas_extra:"test Message.",
                //     }
                if(this.checkFormActividad())
                console.log(this.formNewAct)
            },
            enviarFormularioNuevaActividad(){
                console.log('onSubmitActividad')
                return
                this.errors={};
                if(this.tienaRecursoIncompleto){
                    alert('Tienes algun recurso sin completar.');
                    return;
                }else if(this.tieneEmpleadoIncompleto){
                    alert('Tienes algun empleado sin completar.');
                    return;
                }
                //alert('Formulario lista para ser enviado');
                /*actividades_tractoristas_store
                actividades_tractoristas_update */
                // this.formNewAct.tractor_actividad_id=1;
                const uri= (this.formNewAct.tractor_actividad_id)? this.route('actividades.tractor.update',{id:this.formNewAct.tractor_actividad_id}): this.route('actividades.tractor.create')
                console.log(uri);
                axios.post(uri,this.formNewAct)
                    .then(res => {
                        // éxito
                        console.log(res)
                        M.toast({ html: res.data?.message??'Guardado correctamente' });
                        const doctoEstAnte=res.data.estadistico_anterior??null;
                        const doctoEst=res.data.estadistico_nuevo??null;
                        const actividadR=res.data.actividad??null;
                        console.log(doctoEstAnte,doctoEst,actividadR)
                        if(doctoEstAnte){
                            const index = this.etapas_plan_operativo.findIndex(e => e.estadistico_documento_id === doctoEstAnte.estadistico_documento_id);

                            if (index > -1) {
                                // 🔥 reemplazar (NO eliminar)
                                this.$set(this.etapas_plan_operativo, index, doctoEstAnte);
                            } else {
                                this.etapas_plan_operativo.push(doctoEstAnte);
                            }
                        }
                        if(doctoEst){
                            const index = this.etapas_plan_operativo.findIndex(
                                e => e.estadistico_documento_id === doctoEst.estadistico_documento_id
                            );

                            if (index > -1) {
                                this.$set(this.etapas_plan_operativo, index, doctoEst);
                            } else {
                                this.etapas_plan_operativo.push(doctoEst);
                            }
                        }
                        if(actividadR){
                            const index = this.tractor_actividades.findIndex(
                                a => a.tractor_actividad_id === actividadR.tractor_actividad_id
                            );

                            if (index > -1) {
                                this.$set(this.tractor_actividades, index, actividadR);
                            } else {
                                this.tractor_actividades.push(actividadR);
                            }
                        }
                        const ps=this.produccionSeleccionada;
                        this.produccionSeleccionada='';
                        this.produccionSeleccionada=ps;
                        this.modal_add_Actividad=false;
                    })
                    .catch(err => {
                        console.log(err.response)
                        if (err.response && err.response.status === 422) {
                            this.errors = err.response.data.errors;
                        }else if(err.response && err.response.data && err.response.data.message){
                            M.toast({ html: err.response.data.message });
                        } else {
                            M.toast({ html: 'Error inesperado' });
                        }
                    });
            },
            //New Actividad------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            consultaData(){
                setTimeout(()=>{
                    let uri=this.route('catalogos.actividades_tractor');
                    $.ajax({
                        url:uri
                        ,method:'GET'
                        ,data:{accion:['tablas','ranchos','producciones']},
                        success:(res)=>{
                            // console.log(res)
                            for(let i in res){
                                this.$set(this.localCatalogos, i, res[i]);
                            }
                        },
                        error:(err)=>{
                            console.error(err)
                        }
                    })
                },100)
                setTimeout(()=>{
                    const uri=this.route('catalogos.actividades_tractor');
                    $.ajax({
                        url:uri,
                        data:{accion:'data'},
                        success:(res)=>{
                            console.log(res)
                            this.etapas_plan_operativo=res.documentos_estadisticos
                            this.tractor_actividades=res.TA
                        },
                        error:()=>{console.log('error consultaTractoristas') }
                    })
                },150);
            },
            ChangeFiltrosGen(value,a,b){
                if(value.produccion!=this.produccionSeleccionada)
                    this.asignSelectProduccion(value.produccion);
                if(value.rango??null!=this.rangoGeneral??null)
                    this.asignRangoFechasFiltro(value.rango);
            },
            asignSelectProduccion(value){
                this.produccionSeleccionada=value??null
            },
            asignRangoFechasFiltro(value){
                this.rangoGeneral=value??null;
            },
            filtrosActsTrac(value){
                console.log('filtrosActsTrac: ',value)
                //filtrosActividades:{operador:'',buscar:'',fecha_inicio:'',fecha_fin:''}
                this.filtrosActividades.operador=value;
            },
            filtrosActsBuscar(value){
                console.log('filtrosActsBuscar: ',value)
                this.filtrosActividades.buscar=value;
            },
            filtrosActsRango(value){
                console.log('filtrosActsRango: ',value)
                this.filtrosActividades.fecha_inicio=value.inicio;
                this.filtrosActividades.fecha_fin=value.fin;
            },
            mostrarFiltrosActividades(){
                if(!this.produccionSeleccionada){
                    this.openInfo=false;
                    return;
                }
                this.openInfo=!this.openInfo;
            },
            onAtivityChange(value,a,b){
                console.log('onAtivityChange',value,a,b)
            }
        },
        watch:{
            /*formNewAct:{
                    fromEtap:false,
                    editando:false,
                    onlyView:false,
                    etapa:{},
                    produccion_id:'',
                    estadistico_documento_id:'',
                    tractorista_id:'',
                    nombre:'',
                    fecha_inicio:null,
                    fecha_fin:null,
                    observaciones:'',
                    horas:null,
                    horas_extra:null,
                    empleados_extra:[],
                    recursos:[],
                    produccion:null,
                    estadistico:null,
                    tractorista:null,
                    fechas:{inicio:null,fin:null},*/
            'formNewAct.produccion'(newVal,oldVal){
                if(newVal != oldVal)
                    this.$set(this.formNewAct,'produccion_id',newVal?.produccion_id??'');
                //this.formNewAct.produccion_id=formNewAct.produccion.produccion_id??'';
            },
            'formNewAct.estadistico'(newVal,oldVal){
                if(newVal != oldVal){
                    this.$set(this.formNewAct,'estadistico_documento_id',newVal?.estadistico_documento_id??'');
                    // if(newVal){
                    //     setTimeout(()=>{//se pone por si trae las fechas en null las asigne con este valor
                    //         this.$set(this.formNewAct,'fechas',{inicio:newVal?.fecha_estimada_inicio??null,fin:newVal?.fecha_estimada_fin??null});
                    //     },200)
                    // }
                }
            },
            'formNewAct.tractorista'(newVal,oldVal){
                if(newVal != oldVal)
                    this.$set(this.formNewAct,'tractorista_id',newVal?.tractorista_id??'');
                //this.formNewAct.tractorista_id=newVal?.empleado_id??'';
            },
            'formNewAct.fechas'(newVal,oldVal){
                if(newVal != oldVal){
                    this.$set(this.formNewAct,'fecha_inicio',newVal?.inicio??'');
                    this.$set(this.formNewAct,'fecha_fin',newVal?.fin??'');
                }
            },

            /*etapas_plan_operativo(newVal,oldVal){
                console.log('cambio detectado en etapas_plan_operativo: ', newVal??'NoNew',oldVal??'NoOld')
            },
            tractor_actividades(newVal,oldVal){
                console.log('cambio detectado en tractor_actividades: ', newVal??'NoNew',oldVal??'NoOld')
            },
            yearSeleccionado(newVal,oldVal){
                console.log('yearSeleccionado: ','new: '+newVal,'old: '+oldVal)
                //console.log(this.datos);
                //console.log('yearSeleccionado: ',newVal??'NoNew',oldVal??'NoOld')
            },
            ranchoSeleccionado(newVal,oldVal){
                console.log('ranchoSeleccionado: ','new: '+newVal,'old: '+oldVal)
                if(!newVal && oldVal){

                }else if(newVal && !oldVal){

                }
                //console.log('ranchoSeleccionado: ',newVal??'NoNew',oldVal??'NoOld')
            },
            tablaSeleccionada(newVal,oldVal){
                console.log('tablaSeleccionada: ','new: '+newVal,'old: '+oldVal)
                console.log('tablaSeleccionada: ',newVal??'NoNew',oldVal??'NoOld')
            },
            produccionSeleccionada(newVal,oldVal){
                //console.log('produccionSeleccionada: ','new: '+newVal,'old: '+oldVal)
                this.produccion=this.d_producciones.filter(p=>p.produccion_id==newVal)[0];
                if(!this.produccion){
                    this.produccion={};
                    return;
                }
                //console.log('produccionSeleccionada: ',newVal??'NoNew',oldVal??'NoOld')
                const produccionId=this.produccion.produccion_id;
                //this.etapas=this.etapas_plan_operativo.filter(e=>e.produccion_id==produccionId??0)
                //this.actividades=this.tractor_actividades.filter(a=>a.produccion_id==produccionId??0)
            },
            recursoEditandoSelected(newVal,oldVal){
                console.log('cambio recurso editando: ',newVal,oldVal)
                if(newVal){
                    const indx=this.formNewAct.recursos.indexOf(newVal);
                    this.formNewAct.recursos.forEach((it,index,arr)=>{
                        if(indx!=index){
                            it.edita=false;
                            console.log(it,index,arr,indx)
                        }
                    })
                    newVal.edita=true;
                }
            },
            'formNewAct.fecha_inicio'(val) {
                if (
                    this.formNewAct.fecha_estimada_fin &&
                    val > this.formNewAct.fecha_estimada_fin
                ) {
                    this.formNewAct.fecha_estimada_fin = null;
                }
            }*/
        }
    }
</script>

<style scoped>
    .actividad-tractorista .title {
        font-weight: 700;
        margin: 4px 0;
    }

    .actividad-tractorista .meta {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #6b6f6b;
        font-size: 13px;
    }

    .actividad-tractorista .meta .mono {
        font-family: monospace;
    }

    .actividad-tractorista .meta .dot {
        width: 4px;
        height: 4px;
        background: #cfd8cf;
        border-radius: 50%;
        display: inline-block;
    }

    .actividad-tractorista .breadcrumb {
        font-size: 12px;
    }

    .actividad-tractorista .filters .input-field {
        margin-top: 0;
    }

    .actividad-tractorista .filters label {
        font-size: 11px;
        color: #7a7f7a;
    }

    .actividad-tractorista .tab-like {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        padding-top: 12px;
        border-top: 1px solid #e3e8e3;
    }

    .actividad-tractorista .tab-like a {
        color: #9e9e9e;
        font-weight: 600;
        font-size: 13px;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding-bottom: 6px;
        border-bottom: 2px solid transparent;
    }

    .actividad-tractorista .tab-like a.active {
        color: #2e7d32;
        border-bottom-color: #2e7d32;
    }

    .timeline-list .collection-item.active {
        border-left: 4px solid #2e7d32;
        background: #f1f8f2;
    }

    .dropzone {
        padding: 8px 0;
    }
</style>
  
