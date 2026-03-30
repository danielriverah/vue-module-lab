function parseJSON(value, fallback) {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'object') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function getElementBySelector(selector) {
  if (typeof document === 'undefined' || !selector) {
    return null;
  }

  return document.querySelector(selector);
}

function readDatasetProps(el) {
  const dataset = (el && el.dataset) || {};

  return {
    production: parseJSON(dataset.production, null),
    detail: parseJSON(dataset.detail, null),
    preview: parseJSON(dataset.preview, {}),
    rendererData: parseJSON(dataset.rendererData, null),
    selectedDate: dataset.selectedDate || null,
    loading: dataset.loading === 'true',
    updating: dataset.updating === 'true',
    rendering: dataset.rendering === 'true',
    savingSvg: dataset.savingSvg === 'true',
    savingPng: dataset.savingPng === 'true',
    error: parseJSON(dataset.error, null)
  };
}

function withDefaultListeners(listeners) {
  const source = listeners || {};
  const relay = {};

  [
    'update',
    'change-date',
    'request-render',
    'render',
    'render-ready',
    'render-error',
    'save-svg',
    'save-png',
    'save-all'
  ].forEach((eventName) => {
    if (typeof source[eventName] === 'function') {
      relay[eventName] = source[eventName];
      return;
    }

    relay[eventName] = function relayToDom(payload) {
      if (typeof window === 'undefined') {
        return;
      }

      window.dispatchEvent(new CustomEvent('production-monitoring:' + eventName, {
        detail: payload
      }));
    };
  });

  return relay;
}

function createMonitoringOptions(params) {
  const opts = params || {};
  const propsData = Object.assign({}, opts.propsData || {});
  const listeners = withDefaultListeners(opts.listeners);

  return {
    el: opts.el,
    render(h) {
      return h(opts.ModuleComponent, {
        props: propsData,
        on: listeners
      });
    }
  };
}

function mountProductionMonitoringModule(params) {
  const opts = params || {};
  const selector = opts.selector || '[data-monitoring-module]';
  const el = opts.el || getElementBySelector(selector);

  if (!el) {
    return null;
  }

  const VueRef = opts.Vue;
  const ModuleComponent = opts.ModuleComponent;

  if (!VueRef || !ModuleComponent) {
    throw new Error('mountProductionMonitoringModule requiere Vue y ModuleComponent');
  }

  const propsData = Object.assign(readDatasetProps(el), opts.propsData || {});
  const vueOptions = createMonitoringOptions({
    el,
    ModuleComponent,
    propsData,
    listeners: opts.listeners
  });

  return new VueRef(vueOptions);
}

module.exports = {
  parseJSON,
  readDatasetProps,
  withDefaultListeners,
  createMonitoringOptions,
  mountProductionMonitoringModule
};
