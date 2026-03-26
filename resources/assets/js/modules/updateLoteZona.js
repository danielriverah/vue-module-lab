require('@/bootstrap');
//import ModalBase from '@/components/modals/ModalBase.vue'
// Vue.component('ModalBase', ModalBase)
import * as VueGoogleMaps from 'vue2-google-maps'
import Vue from 'vue'
window.Vue = Vue;
let modTxt='lote_asign_zona';
//import TestTable from './components/TestTable.vue';
// import PlantacionesIndex from './components/modulos/producciones/plantaciones/PlantacionesIndex.vue';
import AsignMapZona from '@/components/modulos/lotes/edit/AsignMapZona.vue';
import {setts} from '@/sets_modulos/lotes/AsignZonaProd.js'
const key=window.appConfig.mapKey
const libreries=window.appConfig.mapLibreries

//console.log('key',key,libreries,setts)
if(document.getElementById(modTxt)){
    //vue-google-map
    const nameCamelCase=snakeToCamel(modTxt)+'AppVue'
    console.log('cargando: ',modTxt,nameCamelCase)
    Vue.use(VueGoogleMaps, {
        load: {
            key: key,
            libraries: libreries // necessary for places input
        }
    })
    const el = document.getElementById(modTxt)
    console.log(modTxt,el,setts)
    setts.el=el,
    setts.components={AsignMapZona}
    window[nameCamelCase]=new Vue(setts)
}
modTxt='lote_asign_zona_a';
if(document.getElementById(modTxt)){
    //vue-google-map
    const nameCamelCase=snakeToCamel(modTxt)+'AppVue'
    console.log('cargando: ',modTxt,nameCamelCase)
    Vue.use(VueGoogleMaps, {
        load: {
            key: key,
            libraries: libreries // necessary for places input
        }
    })
    const el = document.getElementById(modTxt)
    console.log(modTxt,el,setts)
    setts.el=el,
    setts.components={AsignMapZona}
    window[nameCamelCase]=new Vue(setts)
}
modTxt='lote_asign_zona_b';
if(document.getElementById(modTxt)){
    //vue-google-map
    const nameCamelCase=snakeToCamel(modTxt)+'AppVue'
    console.log('cargando: ',modTxt,nameCamelCase)
    Vue.use(VueGoogleMaps, {
        load: {
            key: key,
            libraries: libreries // necessary for places input
        }
    })
    const el = document.getElementById(modTxt)
    console.log(modTxt,el,setts)
    setts.el=el,
    setts.components={AsignMapZona}
    window[nameCamelCase]=new Vue(setts)
}
