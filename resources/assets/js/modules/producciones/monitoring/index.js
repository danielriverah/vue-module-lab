require('@/bootstrap');

import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';
import ProductionMonitoringModule from './ProductionMonitoringModule.vue';
import monitoringLoader from './loadProductionMonitoringModule';
import { getMonitoringValidationScenario } from './mockMonitoringData';

window.Vue = Vue;
const { mountProductionMonitoringModule } = monitoringLoader;

function setupGoogleMaps(VueRef) {
  if (typeof window === 'undefined') {
    return;
  }

  const config = window.appConfig || {};
  const key = config.mapKey;
  const libraries = config.mapLibreries || 'geometry,places,drawing,visualization';

  if (!key) {
    return;
  }

  VueRef.use(VueGoogleMaps, {
    load: {
      key,
      libraries
    }
  });
}

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

setupGoogleMaps(Vue);

mountProductionMonitoringModule({
  selector: '#production-monitoring-module',
  Vue,
  ModuleComponent: ProductionMonitoringModule,
  propsData: resolveMockPropsFromWindow()
});
