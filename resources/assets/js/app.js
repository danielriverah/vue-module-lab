/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

// require('materialize-css/dist/js/materialize.min.js')
require('./bootstrap');
// import './bootstrap';
import ModalBase from '@/components/modals/ModalBase.vue'

Vue.component('ModalBase', ModalBase)
import * as VueGoogleMaps from 'vue2-google-maps'
import Vue from 'vue'
window.Vue = Vue;//require('vue');

// import 'select2';
// // import 'datatables.net';
// // import 'datatables.net-bs4';
// import 'jquery-validation';
// import 'dropify';
// import BaseSelect from './components/Global/SelectSearchBase.vue'
// // import 'vue-select/dist/vue-select.css'
// import Tooltip from '@/directives/tooltip';
// import { route } from './helpers/route';


// Vue.component('BaseSelect', BaseSelect)
// Vue.directive('tooltip', Tooltip);
// Vue.prototype.route = route;


let modTxt='plantacion-index';
//import TestTable from './components/TestTable.vue';
import PlantacionesIndex from './components/modulos/producciones/plantaciones/PlantacionesIndex.vue';
import {setts} from './sets_modulos/TestTable.js'
if(document.getElementById(modTxt)){
    //vue-google-map
    Vue.use(VueGoogleMaps, {
        load: {
            key: 'AIzaSyBUVWL70vwp5s3tpqA48M-SzY3yFJuRguQ',
            libraries: 'geometry,places,drawing,visualization' // necessary for places input
        }
    })
    const el = document.getElementById(modTxt)
    console.log(modTxt,el,setts)
    setts.el=el,
    setts.components={PlantacionesIndex}
    window.AppVue=new Vue(setts)
}



// Vue.component(
//     'example-component', require('./components/ExampleComponent.vue').default
// );
// if(document.getElementById('app')){
//     const app = new Vue({
//         el: '#app'
//     });
// }
