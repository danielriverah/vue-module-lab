require('@/bootstrap');

import Vue from 'vue';
import ProductionTimeLineMain from './ProductionTimeLineMain.vue';
import { setts } from '@/sets_modulos/time_line';

window.Vue = Vue;
let modTxt='production-time-line';
if(document.getElementById(modTxt)){
	const nameCamelCase=snakeToCamel(modTxt)+'AppVue'
	console.log('cargando: ',modTxt,nameCamelCase)
	const el = document.getElementById(modTxt)
	setts.el=el,
	setts.components={ProductionTimeLineMain}
	window[nameCamelCase]=new Vue(setts)
}
