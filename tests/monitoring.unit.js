const fs = require('fs');
const path = require('path');
const assert = require('assert');
const compiler = require('vue-template-compiler');
const vm = require('vm');
const monitoringLoader = require('../resources/assets/js/modules/producciones/monitoring/loadProductionMonitoringModule.js');

function loadVueComponentDefinition(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = compiler.parseComponent(content);
  if (!parsed.script || !parsed.script.content) {
    throw new Error(`No script block found in ${filePath}`);
  }

  let script = parsed.script.content;
  script = script.replace(/^\s*import\s+.*?;\s*$/gm, '');
  script = script.replace(/components\s*:\s*\{[\s\S]*?\},/m, 'components: {},');
  script = script.replace(/export\s+default/, 'module.exports =');

  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox, { filename: filePath });
  return sandbox.module.exports;
}

function createEmitCollector(ctx) {
  ctx.__emits = [];
  ctx.$emit = (name, payload) => ctx.__emits.push({ name, payload });
}

function run() {
  const actionsPath = path.resolve(__dirname, '../resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringActions.vue');
  const rendererPath = path.resolve(__dirname, '../resources/assets/js/modules/producciones/monitoring/components/ProductionMonitoringRenderer.vue');
  const modulePath = path.resolve(__dirname, '../resources/assets/js/modules/producciones/monitoring/ProductionMonitoringModule.vue');

  const Actions = loadVueComponentDefinition(actionsPath);
  const Renderer = loadVueComponentDefinition(rendererPath);
  const Module = loadVueComponentDefinition(modulePath);

  // Actions: reglas de habilitación y emits
  {
    const ctx = {
      loading: false,
      updating: false,
      rendering: false,
      savingSvg: false,
      savingPng: false,
      canRender: false,
      canSaveSvg: true,
      canSavePng: true,
      localDate: '2026-03-26'
    };
    createEmitCollector(ctx);

    ctx.disableUpdate = Actions.computed.disableUpdate.call(ctx);
    ctx.disableRender = Actions.computed.disableRender.call(ctx);
    ctx.disableSaveSvg = Actions.computed.disableSaveSvg.call(ctx);
    ctx.disableSavePng = Actions.computed.disableSavePng.call(ctx);
    ctx.disableSaveAll = Actions.computed.disableSaveAll.call(ctx);

    assert.strictEqual(ctx.disableRender, true, 'disableRender debe ser true cuando canRender=false');
    Actions.methods.onRender.call(ctx);
    assert.strictEqual(ctx.__emits.length, 0, 'onRender no debe emitir si está deshabilitado');

    ctx.canRender = true;
    ctx.disableRender = Actions.computed.disableRender.call(ctx);
    Actions.methods.onRender.call(ctx);
    assert.strictEqual(ctx.__emits[0].name, 'render', 'onRender debe emitir render cuando está habilitado');

    Actions.methods.onDateChange.call(ctx, { target: { value: '2026-03-27' } });
    assert.strictEqual(ctx.__emits[1].name, 'change-date', 'onDateChange debe emitir change-date');
    assert.strictEqual(ctx.__emits[1].payload, '2026-03-27', 'onDateChange debe emitir la fecha seleccionada');
  }

  // Renderer: casos A/B/C y deduplicación request-render
  {
    const ctx = {
      detail: { id: 9, clave: 'A1' },
      preview: { json: { exists: false }, png: { exists: false } },
      rendererData: null,
      production: { produccion_id: 1 },
      selectedDate: '2026-03-26',
      renderOutput: { svgContent: null, imageUrl: null, metadata: null },
      renderError: null,
      lastRequestSignature: null
    };
    createEmitCollector(ctx);

    ctx.hasDetail = Renderer.computed.hasDetail.call(ctx);
    ctx.hasPngPreview = Renderer.computed.hasPngPreview.call(ctx);
    ctx.hasJsonPreview = Renderer.computed.hasJsonPreview.call(ctx);
    ctx.hasRenderableData = Renderer.computed.hasRenderableData.call(ctx);
    ctx.canRequestRender = Renderer.computed.canRequestRender.call(ctx);

    assert.strictEqual(ctx.canRequestRender, true, 'Renderer debe solicitar render en caso C');
    Renderer.methods.emitRequestRender.call(ctx);
    Renderer.methods.emitRequestRender.call(ctx);
    assert.strictEqual(ctx.__emits.length, 1, 'request-render debe deduplicarse');
    assert.strictEqual(ctx.__emits[0].name, 'request-render', 'Debe emitir request-render');

    // Caso B con JSON preview
    ctx.preview = { json: { exists: true }, png: { exists: false } };
    ctx.rendererData = {};
    ctx.hasJsonPreview = Renderer.computed.hasJsonPreview.call(ctx);
    ctx.hasRenderableData = Renderer.computed.hasRenderableData.call(ctx);
    assert.strictEqual(ctx.hasRenderableData, true, 'Con JSON preview debe haber datos renderizables');

    Renderer.methods.prepareRenderOutput.call(ctx);
    assert.strictEqual(ctx.__emits[1].name, 'render-ready', 'prepareRenderOutput debe emitir render-ready');
    assert.ok(ctx.__emits[1].payload.svgContent, 'render-ready debe contener svgContent');
  }

  // Module: integración de payload y datos efectivos
  {
    const ctx = {
      production: { produccion_id: 99 },
      detail: { id: 7 },
      preview: {},
      monitoringPayload: null,
      rendererData: null,
      selectedDate: '2026-03-26',
      savingSvg: false,
      savingPng: false,
      rendering: false,
      localRenderResult: null,
      localRenderError: null,
      error: null
    };
    createEmitCollector(ctx);
    ctx.basePayload = () => Module.methods.basePayload.call(ctx);

    ctx.normalizedPreview = Module.computed.normalizedPreview.call(ctx);
    assert.strictEqual(ctx.normalizedPreview.png.exists, false, 'normalizedPreview debe crear defaults');

    Module.methods.onRenderReady.call(ctx, { svgContent: '<svg></svg>', imageUrl: null });
    ctx.effectiveRenderData = Module.computed.effectiveRenderData.call(ctx);
    ctx.canSaveSvg = Module.computed.canSaveSvg.call(ctx);
    assert.strictEqual(ctx.canSaveSvg, true, 'canSaveSvg debe habilitarse tras render-ready local');

    Module.methods.onSaveAll.call(ctx);
    const saveAllEvent = ctx.__emits.find((e) => e.name === 'save-all');
    assert.ok(saveAllEvent, 'save-all debe emitirse');
    assert.strictEqual(saveAllEvent.payload.source, 'actions-save-all', 'save-all debe incluir source');
  }

  // Loader JS: lectura de dataset, listeners y montaje desacoplado
  {
    const datasetElement = {
      dataset: {
        production: JSON.stringify({ produccion_id: 12 }),
        detail: JSON.stringify({ id: 77 }),
        details: JSON.stringify([{ id: 77 }, { id: 78 }]),
        preview: JSON.stringify({ png: { exists: true } }),
        monitoringPayload: JSON.stringify({
          prod: { produccion_id: 1978, pbox: '{"pbox":[-101.9,22.2,-101.8,22.3]}' },
          detalle: [{ id: 'PROD#1978', fecha: '2025-12-26', band_red: 'https://red.tif' }]
        }),
        rendererData: '',
        selectedDate: '2026-03-27',
        loading: 'false',
        updating: 'true',
        rendering: 'false',
        savingSvg: 'false',
        savingPng: 'true',
        error: ''
      }
    };

    const props = monitoringLoader.readDatasetProps(datasetElement);
    assert.strictEqual(props.production.produccion_id, 12, 'readDatasetProps debe leer production');
    assert.strictEqual(props.details.length, 2, 'readDatasetProps debe leer details');
    assert.strictEqual(props.monitoringPayload.prod.produccion_id, 1978, 'readDatasetProps debe leer monitoringPayload');
    assert.strictEqual(props.updating, true, 'readDatasetProps debe convertir flags booleanas');
    assert.strictEqual(props.savingPng, true, 'readDatasetProps debe convertir savingPng');

    const listeners = monitoringLoader.withDefaultListeners({
      render(payload) {
        this.payload = payload;
      }
    });
    assert.strictEqual(typeof listeners['render'], 'function', 'withDefaultListeners debe conservar listeners custom');
    assert.strictEqual(typeof listeners['save-all'], 'function', 'withDefaultListeners debe generar listener fallback');

    let mountedOptions = null;
    function FakeVue(options) {
      mountedOptions = options;
      return { __fakeVue: true, options };
    }

    const app = monitoringLoader.mountProductionMonitoringModule({
      el: datasetElement,
      Vue: FakeVue,
      ModuleComponent: { name: 'ProductionMonitoringModule' },
      propsData: { selectedDate: '2026-03-28' }
    });

    assert.ok(app.__fakeVue, 'mountProductionMonitoringModule debe montar instancia Vue');
    assert.strictEqual(mountedOptions.el, datasetElement, 'mountProductionMonitoringModule debe conservar el elemento destino');
    const vnode = mountedOptions.render((component, vnodeOptions) => ({ component, vnodeOptions }));
    assert.strictEqual(vnode.vnodeOptions.props.selectedDate, '2026-03-28', 'propsData explícito debe sobrescribir dataset');
    assert.strictEqual(vnode.vnodeOptions.props.detail.id, 77, 'props desde dataset deben llegar al render');
  }

  // Module: soporte payload Dynamo {prod, detalle[]} y preview API pendiente
  {
    const ctx = {
      production: null,
      detail: null,
      details: [],
      preview: {},
      monitoringPayload: {
        prod: {
          produccion_id: 1978,
          pbox: '{"puntos_bbox":[[22.219048592969,-101.89972425033],[22.219048592969,-101.8986728244],[22.219614725257,-101.8986728244],[22.219614725257,-101.89972425033]]}'
        },
        detalle: [
          { id: 'PROD#1978', fecha: '2025-11-16' },
          { id: 'PROD#1978', fecha: '2025-12-26', band_red: 'https://red.tif', produccion: { articulo: 'LECHUGA' } }
        ]
      },
      rendererData: null,
      selectedDate: '2025-12-26'
    };

    ctx.extractedPayload = Module.computed.extractedPayload.call(ctx);
    ctx.normalizedProduction = Module.computed.normalizedProduction.call(ctx);
    ctx.normalizedDetail = Module.computed.normalizedDetail.call(ctx);
    ctx.normalizedPreview = Module.computed.normalizedPreview.call(ctx);

    assert.strictEqual(ctx.normalizedProduction.produccion_id, 1978, 'normalizedProduction debe usar prod desde monitoringPayload');
    assert.strictEqual(ctx.normalizedDetail.fecha, '2025-12-26', 'normalizedDetail debe usar último detalle por defecto');
    assert.ok(ctx.normalizedPreview.png.pendingApiUrl, 'normalizedPreview debe incluir URL API pendiente');
    assert.strictEqual(ctx.normalizedPreview.png.exists, false, 'normalizedPreview debe forzar pendiente para render geotiff');
  }

  console.log('All Monitoring unit tests passed.');
}

try {
  run();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
