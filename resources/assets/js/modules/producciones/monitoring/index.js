require('@/bootstrap');

import Vue from 'vue';
import ProductionMonitoringModule from './ProductionMonitoringModule.vue';
import monitoringLoader from './loadProductionMonitoringModule';

window.Vue = Vue;
const { mountProductionMonitoringModule } = monitoringLoader;

mountProductionMonitoringModule({
  selector: '#production-monitoring-module',
  Vue,
  ModuleComponent: ProductionMonitoringModule
});
