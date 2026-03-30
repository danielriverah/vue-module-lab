require('@/bootstrap');

import Vue from 'vue';
import ProductionMonitoringModule from './ProductionMonitoringModule.vue';
import monitoringLoader from './loadProductionMonitoringModule';
import { getMonitoringValidationScenario } from './mockMonitoringData';

window.Vue = Vue;
const { mountProductionMonitoringModule } = monitoringLoader;

function resolveMockPropsFromWindow() {
  if (typeof window === 'undefined') {
    return {};
  }

  const enabled = window.__PRODUCTION_MONITORING_USE_MOCK__ === true;
  if (!enabled) {
    return {};
  }

  const scenarioName = window.__PRODUCTION_MONITORING_MOCK_SCENARIO__;
  return getMonitoringValidationScenario(scenarioName);
}

mountProductionMonitoringModule({
  selector: '#production-monitoring-module',
  Vue,
  ModuleComponent: ProductionMonitoringModule,
  propsData: resolveMockPropsFromWindow()
});
