// require('materialize-css/dist/js/materialize.min.js')
import screen from '@/plugins/screen'
import './bootstrap';
// import 'select2';
import ModalBase from '@/components/modals/ModalBase.vue'
import BaseSelect from './components/Global/SelectSearchBase.vue'
import Tooltip from '@/directives/tooltip';
Vue.component('ModalBase', ModalBase)
import { route } from './helpers/route';
import Vue from 'vue'
Vue.prototype.$screen = screen
window.Vue = Vue;
Vue.component('BaseSelect', BaseSelect)
Vue.directive('tooltip', Tooltip);
Vue.prototype.route = route;
function toPascalCase(text){
    return text
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')
}
let idImplementAll='plantacion-index';
//import TestTable from './components/TestTable.vue';
//import PlantacionesIndex from './components/modulos/producciones/plantaciones/PlantacionesIndex.vue';
import ActividadesTractor from './components/modulos/actividades/tractoristas/ActividadesTractor.vue';
import {setts} from './sets_modulos/actividades/tractor/indexSetts.js'
if(document.getElementById(idImplementAll)){
    const appName=toPascalCase(idImplementAll+'-app')
    const el = document.getElementById(idImplementAll)
    setts.el=el,
    setts.components={ActividadesTractor}
    window[appName]=new Vue(setts)
    /*console.log(appName)
    window[appName]=new Vue({
        el: el,
        components: {
            ActividadesTractor
        }
    })*/
    //vue-google-map
    /*Vue.use(VueGoogleMaps, {
        load: {
            key: 'AIzaSyBUVWL70vwp5s3tpqA48M-SzY3yFJuRguQ',
            libraries: 'geometry,places,drawing,visualization' // necessary for places input
        }
    })
    const el = document.getElementById(modTxt)
    console.log(modTxt,el,setts)
    setts.el=el,
    setts.components={PlantacionesIndex}
    window.AppVue=new Vue(setts)*/
}