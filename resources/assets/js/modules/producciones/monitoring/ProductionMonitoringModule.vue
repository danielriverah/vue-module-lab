<template>
  <section class="pm-module">
	<button type="button" @click="updateEscenas">carga updateEscenas</button>
	<button type="button" @click="updateProduccion">carga updateProduccion</button>
	<MonitoringEsceneMain
		ref="monitoringMod"
		@save-imagen="guardaImagen"
		@save-all-imagenes="guardaImagenes"
	></MonitoringEsceneMain>
    <!-- <div class="col s12">
      <ul class="tabs tabs-fixed-width tab-demo z-depth-1 tabs-images">
        <li class="tab col s3 " :class="{'disabled':!imagenRenderedNat}" @click="tabActive='imagenRenderedNat'"><a :class="{'active':tabActive==='imagenRenderedNat'}">Natural</a></li>
        <li class="tab col s3 " :class="{'disabled':!ImagenVegetation}" @click="tabActive='ImagenVegetation'"><a :class="{'active':tabActive==='ImagenVegetation'}">Vegetación</a></li>
        <li class="tab col s3 " :class="{'disabled':!ImagenNir}" @click="tabActive='ImagenNir'"><a :class="{'active':tabActive==='ImagenNir'}">NIR</a></li>
        <li class="tab col s3 " :class="{'disabled':!ImagenNdvi}" @click="tabActive='ImagenNdvi'"><a :class="{'active':tabActive==='ImagenNdvi'}">NDVI</a></li>
        <li class="tab col s3 " :class="{'disabled':!ImagenAgricredEdge}" @click="tabActive='ImagenAgricredEdge'"><a :class="{'active':tabActive==='ImagenAgricredEdge'}">Red Edge</a></li>
        <li class="tab col s3 " :class="{'disabled':!ImagenRedEdgeNirRed}" @click="tabActive='ImagenRedEdgeNirRed'"><a :class="{'active':tabActive==='ImagenRedEdgeNirRed'}">Red Edge Nir Red</a></li>
        <li class="tab col s3 " :class="{'disabled':!ImagenNdre}" @click="tabActive='ImagenNdre'"><a :class="{'active':tabActive==='ImagenNdre'}">NDRE</a></li>
        <li class="tab col s3 " :class="{'disabled':!ImagennNre2}" @click="tabActive='ImagennNre2'"><a :class="{'active':tabActive==='ImagennNre2'}">NDRE2</a></li>
        <li class="tab col s3 " :class="{'disabled':!ImagenNdmi}" @click="tabActive='ImagenNdmi'"><a :class="{'active':tabActive==='ImagenNdmi'}">NDMI</a></li>
        <li class="tab col s3 " :class="{'disabled':!ImagenEvi}" @click="tabActive='ImagenEvi'"><a :class="{'active':tabActive==='ImagenEvi'}">EVI</a></li>
      </ul>
    </div>
    <MonitoringScenaPreview :polygon="polygonBinding" :result="getImagenBySelect" :centro="imagenes.centro" v-if="getImagenBySelect"></MonitoringScenaPreview> -->
    <!-- <MonitoringScenaPreview :result="getImagenVegetation"></MonitoringScenaPreview>
    <MonitoringScenaPreview :result="getImagenNir"></MonitoringScenaPreview>
    <MonitoringScenaPreview :result="getImagenNdvi"></MonitoringScenaPreview>
    <MonitoringScenaPreview :result="getImagenAgricredEdge"></MonitoringScenaPreview>
    <MonitoringScenaPreview :result="getImagenRedEdgeNirRed"></MonitoringScenaPreview>
    <MonitoringScenaPreview :result="getImagenNdre"></MonitoringScenaPreview>
    <MonitoringScenaPreview :result="getImagennNre2"></MonitoringScenaPreview>
    <MonitoringScenaPreview :result="getImagenNdmi"></MonitoringScenaPreview>
    <MonitoringScenaPreview :result="getImagenEvi"></MonitoringScenaPreview> -->
    <!-- <ProductionMonitoringViewer
      :production="normalizedProduction"
      :detail="normalizedDetail"
      :preview="normalizedPreview"
      :renderer-data="effectiveRenderData"
      :timeline-items="timelineItems"
      :scene-status="sceneStatus"
      :selected-date="selectedDate"
      :loading="loading"
      :error="moduleError"
    /> -->

    <!-- <ProductionMonitoringRenderer
      :detail="normalizedDetail"
      :preview="normalizedPreview"
      :renderer-data="effectiveRenderData"
      :selected-date="selectedDate"
      :rendering="rendering"
      @request-render="onRequestRender"
      @render-ready="onRenderReady"
      @render-error="onRenderError"
    /> -->

    <!-- <ProductionMonitoringActions
      :has-detail="hasDetail"
      :has-json-preview="hasJsonPreview"
      :has-svg-preview="hasSvgPreview"
      :has-png-preview="hasPngPreview"
      :can-render="canRender"
      :can-save-svg="canSaveSvg"
      :can-save-png="canSavePng"
      :loading="loading"
      :updating="updating"
      :rendering="rendering"
      :saving-svg="savingSvg"
      :saving-png="savingPng"
      :selected-date="selectedDate"
      @update="onUpdate"
      @change-date="onChangeDate"
      @render="onRenderAction"
      @save-svg="onSaveSvg"
      @save-png="onSavePng"
      @save-all="onSaveAll"
    /> -->
  </section>
</template>

<script>
import ProductionMonitoringViewer from './components/ProductionMonitoringViewer.vue';
import ProductionMonitoringRenderer from './components/ProductionMonitoringRenderer.vue';
import ProductionMonitoringActions from './components/ProductionMonitoringActions.vue';
import MonitoringScenaPreview from './components/MonitoringScenaPreview.vue';
import MonitoringEsceneMain from './MonitoringEsceneMain.vue';

//import * as libTest from '@/utils/p_libs/satelliteMonitoring.js'
import {LoadingImages} from './utils/Imagen'
let produccion={
        "monitoring": 1,
        "plantaciones_json": "[{\"area\": 4.790000, \"poligono\": \"21.123025147835985,-100.88892270320764|21.123203470926057,-100.8888086116766|21.123383277963537,-100.8887167274952|21.12418167569374,-100.88828015888008|21.124470695426293,-100.88813266435211|21.125086768750172,-100.88828736543655|21.12574940483472,-100.8879861831665|21.126077095324003,-100.8884958922863|21.126353615309185,-100.8889426290989|21.1258166666667,-100.889288888889|21.12525515856121,-100.88913942203793|21.124400918721136,-100.88963368535042|21.123704500859425,-100.89001774023643|21.123181217344545,-100.89032764632924|21.12302150932035,-100.89041586773217|21.1228268202119,-100.89042494975145\", \"variedad\": \"\", \"docto_produccion_id\": 6619}]",
        "produccion_id": 1987,
        "folio": "TL2601-04",
        "articulo": "AVENA",
        "fecha": "2026-01-01",
        "estatus": "N",
        "aplicado": "NO",
        "cantidad": "4.790000",
        "centro_costo": "EL TULIPAN",
        "rancho": "EL TULIPAN",
        "usuario_creacion": "kortiz@megafreshproduce.com.mx",
        "currentyear": "26",
        "area_asig": "4.920000",
        "poligono_asig": "21.1228138888889,-100.890530555556|21.1252527777778,-100.889183333333|21.1258166666667,-100.889288888889|21.1263555555556,-100.888944444444|21.12575,-100.887983333333|21.1250805555556,-100.888263888889|21.1244694444444,-100.888113888889|21.1230138888889,-100.888897222222",
        "area_zona": "4.920000",
        "poligono_zona": "21.1228138888889,-100.890530555556|21.1252527777778,-100.889183333333|21.1258166666667,-100.889288888889|21.1263555555556,-100.888944444444|21.12575,-100.887983333333|21.1250805555556,-100.888263888889|21.1244694444444,-100.888113888889|21.1230138888889,-100.888897222222",
        "fecha_plantacion": "2026-01-27",
        "fecha_cierre_prevista": "2026-04-02",
        "fecha_cierre": "2026-04-02",
        "year": 2026,
        "semana": 1,
        "variedades": "N/A",
        "tienePlan": 0
    }
    let escenas=[
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260207_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260207_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260207_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260207_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2A_14QKJ_20260207_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2A_14QKJ_20260207_0_L2A.png",
            "scene_created": "2026-02-07T20:35:19.641Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260207_0_L2A/B03.tif",
            "cloud_cover": 32.854462,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260207_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2A_14QKJ_20260207_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.895188,
                20.699693,
                -100.827434,
                21.478079
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260207_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2A_14QKJ_20260207_0_L2A",
            "fecha": "2026-02-07",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260207_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260217_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260217_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260217_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260217_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2A_14QKJ_20260217_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2A_14QKJ_20260217_0_L2A.png",
            "scene_created": "2026-02-17T20:38:07.784Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260217_0_L2A/B03.tif",
            "cloud_cover": 0.000306,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260217_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2A_14QKJ_20260217_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.894724,
                20.69838,
                -100.827433,
                21.454617
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260217_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2A_14QKJ_20260217_0_L2A",
            "fecha": "2026-02-17",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2A_14QKJ_20260217_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260207_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260207_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260207_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260207_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2A_14QLJ_20260207_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2A_14QLJ_20260207_0_L2A.png",
            "scene_created": "2026-02-07T20:32:42.104Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260207_0_L2A/B03.tif",
            "cloud_cover": 15.261447,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260207_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2A_14QLJ_20260207_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.927775,
                20.700629,
                -99.86622,
                21.28323
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260207_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2A_14QLJ_20260207_0_L2A",
            "fecha": "2026-02-07",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260207_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260217_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260217_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260217_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260217_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2A_14QLJ_20260217_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2A_14QLJ_20260217_0_L2A.png",
            "scene_created": "2026-02-17T20:38:10.701Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260217_0_L2A/B03.tif",
            "cloud_cover": 0.001687,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260217_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2A_14QLJ_20260217_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.927465,
                20.700629,
                -99.86718,
                21.259385
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260217_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2A_14QLJ_20260217_0_L2A",
            "fecha": "2026-02-17",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2A_14QLJ_20260217_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260108_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260108_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260108_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260108_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-08_S2B_14QKJ_20260108_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-08_S2B_14QKJ_20260108_0_L2A.png",
            "scene_created": "2026-01-08T23:43:21.922Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260108_0_L2A/B03.tif",
            "cloud_cover": 0.06703,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260108_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-08_S2B_14QKJ_20260108_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260108_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QKJ_20260108_0_L2A",
            "fecha": "2026-01-08",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260108_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260128_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260128_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260128_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260128_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-29_S2B_14QKJ_20260128_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-29_S2B_14QKJ_20260128_0_L2A.png",
            "scene_created": "2026-01-29T22:27:37.661Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260128_0_L2A/B03.tif",
            "cloud_cover": 17.923544,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260128_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-29_S2B_14QKJ_20260128_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260128_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QKJ_20260128_0_L2A",
            "fecha": "2026-01-29",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2B_14QKJ_20260128_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260207_1_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260207_1_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260207_1_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260207_1_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2B_14QKJ_20260207_1_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2B_14QKJ_20260207_1_L2A.png",
            "scene_created": "2026-02-07T23:28:58.880Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260207_1_L2A/B03.tif",
            "cloud_cover": 44.826078,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260207_1_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2B_14QKJ_20260207_1_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260207_1_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QKJ_20260207_1_L2A",
            "fecha": "2026-02-07",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260207_1_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260217_1_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260217_1_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260217_1_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260217_1_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2B_14QKJ_20260217_1_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2B_14QKJ_20260217_1_L2A.png",
            "scene_created": "2026-02-17T23:39:22.804Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260217_1_L2A/B03.tif",
            "cloud_cover": 0,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260217_1_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2B_14QKJ_20260217_1_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260217_1_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QKJ_20260217_1_L2A",
            "fecha": "2026-02-17",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260217_1_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260227_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260227_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260227_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260227_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-27_S2B_14QKJ_20260227_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-27_S2B_14QKJ_20260227_0_L2A.png",
            "scene_created": "2026-02-27T22:19:18.237Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260227_0_L2A/B03.tif",
            "cloud_cover": 0,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260227_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-27_S2B_14QKJ_20260227_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260227_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QKJ_20260227_0_L2A",
            "fecha": "2026-02-27",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2B_14QKJ_20260227_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260309_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260309_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260309_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260309_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-09_S2B_14QKJ_20260309_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-09_S2B_14QKJ_20260309_0_L2A.png",
            "scene_created": "2026-03-09T23:48:17.948Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260309_0_L2A/B03.tif",
            "cloud_cover": 2.371485,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260309_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-09_S2B_14QKJ_20260309_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260309_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QKJ_20260309_0_L2A",
            "fecha": "2026-03-09",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260309_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260319_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260319_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260319_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260319_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-19_S2B_14QKJ_20260319_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-19_S2B_14QKJ_20260319_0_L2A.png",
            "scene_created": "2026-03-19T23:35:37.284Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260319_0_L2A/B03.tif",
            "cloud_cover": 0.000003,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260319_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-19_S2B_14QKJ_20260319_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260319_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QKJ_20260319_0_L2A",
            "fecha": "2026-03-19",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2B_14QKJ_20260319_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260108_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260108_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260108_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260108_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-08_S2B_14QLJ_20260108_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-08_S2B_14QLJ_20260108_0_L2A.png",
            "scene_created": "2026-01-08T23:46:22.271Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260108_0_L2A/B03.tif",
            "cloud_cover": 0.330069,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260108_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-08_S2B_14QLJ_20260108_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260108_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QLJ_20260108_0_L2A",
            "fecha": "2026-01-08",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260108_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260128_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260128_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260128_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260128_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-29_S2B_14QLJ_20260128_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-29_S2B_14QLJ_20260128_0_L2A.png",
            "scene_created": "2026-01-29T22:25:56.082Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260128_0_L2A/B03.tif",
            "cloud_cover": 14.392182,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260128_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-29_S2B_14QLJ_20260128_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260128_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QLJ_20260128_0_L2A",
            "fecha": "2026-01-29",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2B_14QLJ_20260128_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260207_1_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260207_1_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260207_1_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260207_1_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2B_14QLJ_20260207_1_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2B_14QLJ_20260207_1_L2A.png",
            "scene_created": "2026-02-07T23:27:32.878Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260207_1_L2A/B03.tif",
            "cloud_cover": 35.223943,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260207_1_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-07_S2B_14QLJ_20260207_1_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260207_1_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QLJ_20260207_1_L2A",
            "fecha": "2026-02-07",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260207_1_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260217_1_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260217_1_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260217_1_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260217_1_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2B_14QLJ_20260217_1_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2B_14QLJ_20260217_1_L2A.png",
            "scene_created": "2026-02-17T23:28:00.852Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260217_1_L2A/B03.tif",
            "cloud_cover": 0.000003,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260217_1_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-17_S2B_14QLJ_20260217_1_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260217_1_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QLJ_20260217_1_L2A",
            "fecha": "2026-02-17",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260217_1_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260227_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260227_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260227_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260227_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-27_S2B_14QLJ_20260227_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-27_S2B_14QLJ_20260227_0_L2A.png",
            "scene_created": "2026-02-27T22:09:19.145Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260227_0_L2A/B03.tif",
            "cloud_cover": 0.032024,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260227_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-27_S2B_14QLJ_20260227_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260227_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QLJ_20260227_0_L2A",
            "fecha": "2026-02-27",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2B_14QLJ_20260227_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260309_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260309_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260309_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260309_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-09_S2B_14QLJ_20260309_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-09_S2B_14QLJ_20260309_0_L2A.png",
            "scene_created": "2026-03-09T23:54:32.193Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260309_0_L2A/B03.tif",
            "cloud_cover": 12.838176,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260309_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-09_S2B_14QLJ_20260309_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260309_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QLJ_20260309_0_L2A",
            "fecha": "2026-03-09",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260309_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260319_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260319_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260319_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260319_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-19_S2B_14QLJ_20260319_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-19_S2B_14QLJ_20260319_0_L2A.png",
            "scene_created": "2026-03-19T23:37:29.223Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260319_0_L2A/B03.tif",
            "cloud_cover": 0.007027,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260319_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-19_S2B_14QLJ_20260319_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260319_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2B_14QLJ_20260319_0_L2A",
            "fecha": "2026-03-19",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2B_14QLJ_20260319_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260103_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260103_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260103_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260103_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-03_S2C_14QKJ_20260103_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-03_S2C_14QKJ_20260103_0_L2A.png",
            "scene_created": "2026-01-03T22:42:55.320Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260103_0_L2A/B03.tif",
            "cloud_cover": 2.309296,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260103_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-03_S2C_14QKJ_20260103_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260103_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QKJ_20260103_0_L2A",
            "fecha": "2026-01-03",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260103_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260123_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260123_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260123_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260123_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-23_S2C_14QKJ_20260123_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-23_S2C_14QKJ_20260123_0_L2A.png",
            "scene_created": "2026-01-23T22:56:24.494Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260123_0_L2A/B03.tif",
            "cloud_cover": 0.256492,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260123_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-23_S2C_14QKJ_20260123_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260123_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QKJ_20260123_0_L2A",
            "fecha": "2026-01-23",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/1/S2C_14QKJ_20260123_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260202_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260202_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260202_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260202_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-02_S2C_14QKJ_20260202_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-02_S2C_14QKJ_20260202_0_L2A.png",
            "scene_created": "2026-02-02T22:45:21.632Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260202_0_L2A/B03.tif",
            "cloud_cover": 0.465871,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260202_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-02_S2C_14QKJ_20260202_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260202_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QKJ_20260202_0_L2A",
            "fecha": "2026-02-02",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260202_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260212_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260212_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260212_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260212_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-12_S2C_14QKJ_20260212_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-12_S2C_14QKJ_20260212_0_L2A.png",
            "scene_created": "2026-02-12T22:15:07.418Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260212_0_L2A/B03.tif",
            "cloud_cover": 0.00001,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260212_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-12_S2C_14QKJ_20260212_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260212_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QKJ_20260212_0_L2A",
            "fecha": "2026-02-12",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260212_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260222_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260222_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260222_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260222_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-22_S2C_14QKJ_20260222_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-22_S2C_14QKJ_20260222_0_L2A.png",
            "scene_created": "2026-02-22T22:00:05.082Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260222_0_L2A/B03.tif",
            "cloud_cover": 15.68723,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260222_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-22_S2C_14QKJ_20260222_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260222_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QKJ_20260222_0_L2A",
            "fecha": "2026-02-22",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/2/S2C_14QKJ_20260222_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260304_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260304_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260304_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260304_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-04_S2C_14QKJ_20260304_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-04_S2C_14QKJ_20260304_0_L2A.png",
            "scene_created": "2026-03-04T23:27:12.820Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260304_0_L2A/B03.tif",
            "cloud_cover": 0.199505,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260304_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-04_S2C_14QKJ_20260304_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260304_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QKJ_20260304_0_L2A",
            "fecha": "2026-03-04",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260304_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260314_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260314_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260314_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260314_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-15_S2C_14QKJ_20260314_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-15_S2C_14QKJ_20260314_0_L2A.png",
            "scene_created": "2026-03-15T00:08:05.577Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260314_0_L2A/B03.tif",
            "cloud_cover": 6.343164,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260314_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-15_S2C_14QKJ_20260314_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260314_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QKJ_20260314_0_L2A",
            "fecha": "2026-03-15",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260314_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260324_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260324_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260324_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260324_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-24_S2C_14QKJ_20260324_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-24_S2C_14QKJ_20260324_0_L2A.png",
            "scene_created": "2026-03-24T21:44:46.097Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260324_0_L2A/B03.tif",
            "cloud_cover": 8.435095,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260324_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-24_S2C_14QKJ_20260324_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -101.899168,
                20.687254,
                -100.826462,
                21.693213
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260324_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QKJ_20260324_0_L2A",
            "fecha": "2026-03-24",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/KJ/2026/3/S2C_14QKJ_20260324_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260103_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260103_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260103_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260103_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-03_S2C_14QLJ_20260103_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-03_S2C_14QLJ_20260103_0_L2A.png",
            "scene_created": "2026-01-03T22:44:06.837Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260103_0_L2A/B03.tif",
            "cloud_cover": 0.233712,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260103_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-03_S2C_14QLJ_20260103_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260103_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QLJ_20260103_0_L2A",
            "fecha": "2026-01-03",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260103_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260113_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260113_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260113_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260113_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-13_S2C_14QLJ_20260113_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-13_S2C_14QLJ_20260113_0_L2A.png",
            "scene_created": "2026-01-13T22:32:54.387Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260113_0_L2A/B03.tif",
            "cloud_cover": 43.759304,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260113_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-13_S2C_14QLJ_20260113_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260113_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QLJ_20260113_0_L2A",
            "fecha": "2026-01-13",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260113_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260123_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260123_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260123_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260123_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-23_S2C_14QLJ_20260123_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-23_S2C_14QLJ_20260123_0_L2A.png",
            "scene_created": "2026-01-23T22:55:50.219Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260123_0_L2A/B03.tif",
            "cloud_cover": 10.404922,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260123_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-01-23_S2C_14QLJ_20260123_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260123_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QLJ_20260123_0_L2A",
            "fecha": "2026-01-23",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/1/S2C_14QLJ_20260123_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260202_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260202_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260202_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260202_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-02_S2C_14QLJ_20260202_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-02_S2C_14QLJ_20260202_0_L2A.png",
            "scene_created": "2026-02-02T22:46:35.232Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260202_0_L2A/B03.tif",
            "cloud_cover": 19.880372,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260202_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-02_S2C_14QLJ_20260202_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260202_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QLJ_20260202_0_L2A",
            "fecha": "2026-02-02",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260202_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260212_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260212_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260212_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260212_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-12_S2C_14QLJ_20260212_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-12_S2C_14QLJ_20260212_0_L2A.png",
            "scene_created": "2026-02-12T22:17:35.957Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260212_0_L2A/B03.tif",
            "cloud_cover": 1.400297,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260212_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-12_S2C_14QLJ_20260212_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260212_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QLJ_20260212_0_L2A",
            "fecha": "2026-02-12",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260212_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260222_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260222_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260222_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260222_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-22_S2C_14QLJ_20260222_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-22_S2C_14QLJ_20260222_0_L2A.png",
            "scene_created": "2026-02-22T22:07:17.549Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260222_0_L2A/B03.tif",
            "cloud_cover": 39.962223,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260222_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-02-22_S2C_14QLJ_20260222_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260222_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QLJ_20260222_0_L2A",
            "fecha": "2026-02-22",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/2/S2C_14QLJ_20260222_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260304_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260304_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260304_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260304_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-04_S2C_14QLJ_20260304_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-04_S2C_14QLJ_20260304_0_L2A.png",
            "scene_created": "2026-03-04T23:30:26.053Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260304_0_L2A/B03.tif",
            "cloud_cover": 1.799168,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260304_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-04_S2C_14QLJ_20260304_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260304_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QLJ_20260304_0_L2A",
            "fecha": "2026-03-04",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260304_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260314_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260314_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260314_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260314_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-15_S2C_14QLJ_20260314_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-15_S2C_14QLJ_20260314_0_L2A.png",
            "scene_created": "2026-03-15T00:04:14.817Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260314_0_L2A/B03.tif",
            "cloud_cover": 7.290397,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260314_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-15_S2C_14QLJ_20260314_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260314_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QLJ_20260314_0_L2A",
            "fecha": "2026-03-15",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260314_0_L2A/B04.tif"
        },
        {
            "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B07.tif",
            "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B11.tif",
            "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B05.tif",
            "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B06.tif",
            "collection": "sentinel-2-l2a",
            "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-24_S2C_14QLJ_20260324_0_L2A.json",
            "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-24_S2C_14QLJ_20260324_0_L2A.png",
            "scene_created": "2026-03-24T21:41:29.251Z",
            "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B03.tif",
            "cloud_cover": 3.710641,
            "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B02.tif",
            "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-24_S2C_14QLJ_20260324_0_L2A.svg",
            "folio": "TL2601-04",
            "procesado": false,
            "bbox": [
                -100.93317,
                20.700629,
                -99.86622,
                21.701115
            ],
            "polygon": [
                [
                    21.122813888889,
                    -100.89053055556
                ],
                [
                    21.122813888889,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.88798333333
                ],
                [
                    21.126355555556,
                    -100.89053055556
                ]
            ],
            "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B08.tif",
            "renderizado": false,
            "id": "PROD#1987",
            "clave": "S2C_14QLJ_20260324_0_L2A",
            "fecha": "2026-03-24",
            "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B04.tif"
        }
    ]
const escena={
    "band_rededge3": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B07.tif",
    "band_swir16": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B11.tif",
    "band_rededge1": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B05.tif",
    "band_rededge2": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B06.tif",
    "collection": "sentinel-2-l2a",
    "preview_json": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-24_S2C_14QLJ_20260324_0_L2A.json",
    "preview_image": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-24_S2C_14QLJ_20260324_0_L2A.png",
    "scene_created": "2026-03-24T21:41:29.251Z",
    "band_green": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B03.tif",
    "cloud_cover": 3.710641,
    "band_blue": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B02.tif",
    "preview_svg": "s3://sentinela-monitoring/previews/PROD_1987/2026-03-24_S2C_14QLJ_20260324_0_L2A.svg",
    "folio": "TL2601-04",
    "procesado": false,
    "bbox": [
        -100.93317,
        20.700629,
        -99.86622,
        21.701115
    ],
    "polygon": [
        [
            21.122813888889,
            -100.89053055556
        ],
        [
            21.122813888889,
            -100.88798333333
        ],
        [
            21.126355555556,
            -100.88798333333
        ],
        [
            21.126355555556,
            -100.89053055556
        ]
    ],
    "band_nir": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B08.tif",
    "renderizado": false,
    "id": "PROD#1987",
    "clave": "S2C_14QLJ_20260324_0_L2A",
    "fecha": "2026-03-24",
    "band_red": "https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/14/Q/LJ/2026/3/S2C_14QLJ_20260324_0_L2A/B04.tif"
}
//const images=new LoadingImages(escena,{lat:21.124525,lon:-100.888874});
// console.log(libTest)
// const t=libTest.buildMapOverlay(escena);
// const e=libTest.getSceneBandUrls(escena);
// const p=libTest.getScenePreviewInfo(escena);
// console.log(t,e,p)

const sceneLibrary = typeof require === 'function'
  ? require('./utils/monitoringSceneLibrary')
  : {};

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function unwrapDynamo(value) {
  if (!isObject(value)) return value;
  if (Object.prototype.hasOwnProperty.call(value, 'S')) return value.S;
  if (Object.prototype.hasOwnProperty.call(value, 'N')) {
    const parsed = Number(value.N);
    return Number.isNaN(parsed) ? value.N : parsed;
  }
  if (Object.prototype.hasOwnProperty.call(value, 'BOOL')) return !!value.BOOL;
  if (Object.prototype.hasOwnProperty.call(value, 'L')) return (value.L || []).map(unwrapDynamo);
  if (Object.prototype.hasOwnProperty.call(value, 'M')) {
    const out = {};
    Object.keys(value.M || {}).forEach((k) => {
      out[k] = unwrapDynamo(value.M[k]);
    });
    return out;
  }
  const out = {};
  Object.keys(value).forEach((k) => {
    out[k] = unwrapDynamo(value[k]);
  });
  return out;
}

function parseMysqlPolygon(value) {
  if (!value || typeof value !== 'string') return [];
  return value.split('|').map((pair) => {
    const coords = pair.split(',').map((n) => Number(String(n).trim()));
    if (coords.length < 2 || Number.isNaN(coords[0]) || Number.isNaN(coords[1])) return null;
    return { lat: coords[0], lng: coords[1] };
  }).filter(Boolean);
}

function normalizePolygon(rawPolygon) {
  if (!rawPolygon) return null;
  if (isObject(rawPolygon) && rawPolygon.type === 'Polygon') return rawPolygon;
  if (!Array.isArray(rawPolygon)) return null;
  const ring = rawPolygon.map((point) => {
    if (!Array.isArray(point) || point.length < 2) return null;
    const lat = Number(point[0]);
    const lng = Number(point[1]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return [lng, lat];
  }).filter(Boolean);
  if (!ring.length) return null;
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) ring.push([first[0], first[1]]);
  return { type: 'Polygon', coordinates: [ring] };
}

function bboxToPolygon(bbox) {
  if (!Array.isArray(bbox) || bbox.length < 4) return null;
  const minLon = Number(bbox[0]);
  const minLat = Number(bbox[1]);
  const maxLon = Number(bbox[2]);
  const maxLat = Number(bbox[3]);
  if ([minLon, minLat, maxLon, maxLat].some(Number.isNaN)) return null;
  return {
    type: 'Polygon',
    coordinates: [[
      [minLon, minLat],
      [maxLon, minLat],
      [maxLon, maxLat],
      [minLon, maxLat],
      [minLon, minLat]
    ]]
  };
}

function normalizeProduction(rawProduction) {
  const production = unwrapDynamo(rawProduction || {});
  const pboxRaw = production && production.pbox ? production.pbox : null;
  const pbox = typeof pboxRaw === 'string' ? (() => {
    try {
      return JSON.parse(pboxRaw);
    } catch (error) {
      return null;
    }
  })() : pboxRaw;
  return Object.assign({}, production, {
    poligono_points: parseMysqlPolygon(production && production.poligono),
    pbox_polygon: normalizePolygon(pbox && pbox.puntos_bbox) || bboxToPolygon(pbox && pbox.pbox)
  });
}

function normalizeDetail(rawDetail) {
  const detail = unwrapDynamo(rawDetail || {});
  const productionNested = detail && detail.produccion ? unwrapDynamo(detail.produccion) : null;
  return Object.assign({}, detail, {
    produccion: productionNested,
    polygon: normalizePolygon(detail.polygon),
    bbox_polygon: bboxToPolygon(detail.bbox),
    bands: {
      blue: detail.band_blue || null,
      green: detail.band_green || null,
      red: detail.band_red || null,
      nir: detail.band_nir || null,
      rededge1: detail.band_rededge1 || null,
      rededge3: detail.band_rededge3 || null,
      swir16: detail.band_swir16 || null
    }
  });
}

function extractMonitoringPayload(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'object') {
    return null;
  }

  const payload = unwrapDynamo(rawPayload);
  const details = Array.isArray(payload.detalle)
    ? payload.detalle.filter((item) => !!item && typeof item === 'object')
    : [];
  const firstDetail = details[0] || null;
  const lastDetail = details.length ? details[details.length - 1] : null;

  return {
    production: payload.prod || payload.production || null,
    detail: lastDetail || firstDetail,
    details,
    produccion: (firstDetail && firstDetail.produccion) || payload.produccion || null
  };
}

export default {
  name: 'ProductionMonitoringModule',
  components: {
    ProductionMonitoringViewer,
    ProductionMonitoringRenderer,
    ProductionMonitoringActions,
    MonitoringScenaPreview,
	MonitoringEsceneMain,
  },
  mounted(){
    //this.generaImages();
  },
  props: {
    production: {
      type: Object,
      required: true
    },
    detail: {
      type: Object,
      default: null
    },
    preview: {
      type: Object,
      default: () => ({})
    },
    monitoringPayload: {
      type: Object,
      default: null
    },
    details: {
      type: Array,
      default: () => []
    },
    rendererData: {
      type: Object,
      default: null
    },
    selectedDate: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    updating: {
      type: Boolean,
      default: false
    },
    rendering: {
      type: Boolean,
      default: false
    },
    savingSvg: {
      type: Boolean,
      default: false
    },
    savingPng: {
      type: Boolean,
      default: false
    },
    error: {
      type: [String, Object],
      default: null
    }
  },
  data() {
    return {
		tabActive:'imagenRenderedNat',
		productionData:produccion,
		imagenes:null,
		localRenderResult: null,
		localRenderError: null,
		imagenRenderedNat:null,
		ImagenVegetation:null,
		ImagenNir:null,
		ImagenNdvi:null,
		ImagenAgricredEdge:null,
		ImagenRedEdgeNirRed:null,
		ImagenNdre:null,
		ImagennNre2:null,
		ImagenNdmi:null,
		ImagenEvi:null,
    };
  },
  computed: {
	polygonBinding(){
		const puntosString=this.productionData.poligono_asig;
		const paths=this.getPaths(puntosString);
		let res={
			paths,
			length:paths.length,
			options:{
				strokeColor: '#FFF',
                fillColor: 'transparent',
                // fillOpacity: .01,
                strokeWeight: 1,
                draggable:false,
                clickable:true
			}
		};
		console.log(res)
		return res;
	},
    getImagenBySelect(){
      return this[this.tabActive]
    },
    getImagenNatural(){
      return this.imagenRenderedNat;
    },
    getImagenVegetation(){
      return this.ImagenVegetation;
    },
    getImagenNir(){
      return this.ImagenNir;
    },
    getImagenNdvi(){
      return this.ImagenNdvi;
    },
    getImagenAgricredEdge(){
      return this.ImagenAgricredEdge;
    },
    getImagenRedEdgeNirRed(){
      return this.ImagenRedEdgeNirRed;
    },
    getImagenNdre(){
      return this.ImagenNdre;
    },
    getImagennNre2(){
      return this.ImagennNre2;
    },
    getImagenNdmi(){
      return this.ImagenNdmi;
    },
    getImagenEvi(){
      return this.ImagenEvi;
    },
    extractedPayload() {
      return extractMonitoringPayload(this.monitoringPayload);
    },
    normalizedPreview() {
      const incoming = this.preview || {};
      const fromDetail = this.normalizedDetail || {};
      const apiPreviewBase = this.normalizedProduction && this.normalizedProduction.produccion_id
        ? '/api/producciones/' + this.normalizedProduction.produccion_id + '/monitoring/previews'
        : null;
      return {
        json: Object.assign({ exists: false, url: null, key: null }, incoming.json || {}, {
          url: (incoming.json && incoming.json.url) || null,
          exists: false,
          pendingApiUrl: apiPreviewBase ? apiPreviewBase + '/json?fecha=' + (this.selectedDate || '') : null,
          fallbackKey: fromDetail.preview_json || null
        }),
        svg: Object.assign({ exists: false, url: null, key: null }, incoming.svg || {}, {
          url: (incoming.svg && incoming.svg.url) || null,
          exists: false,
          pendingApiUrl: apiPreviewBase ? apiPreviewBase + '/svg?fecha=' + (this.selectedDate || '') : null,
          fallbackKey: fromDetail.preview_svg || null
        }),
        png: Object.assign({ exists: false, url: null, key: null }, incoming.png || {}, {
          url: (incoming.png && incoming.png.url) || null,
          exists: false,
          pendingApiUrl: apiPreviewBase ? apiPreviewBase + '/png?fecha=' + (this.selectedDate || '') : null,
          fallbackKey: fromDetail.preview_image || null
        })
      };
    },
    normalizedProduction() {
      const productionSource = (this.extractedPayload && this.extractedPayload.production) || this.production;
      return normalizeProduction(productionSource);
    },
    normalizedDetail() {
      const detailSource = (this.extractedPayload && this.extractedPayload.detail) || this.detail;
      return normalizeDetail(detailSource);
    },
    normalizedDetails() {
      const payloadDetails = this.extractedPayload && this.extractedPayload.details;
      const items = payloadDetails && payloadDetails.length
        ? payloadDetails
        : (this.details && this.details.length ? this.details : (this.normalizedDetail ? [this.normalizedDetail] : []));
      return items.map((item) => normalizeDetail(item));
    },
    timelineItems() {
      if (sceneLibrary.buildTimelineItems) {
        return sceneLibrary.buildTimelineItems(this.normalizedDetails);
      }
      return this.normalizedDetails.map((detail) => ({
        date: detail.fecha || detail.scene_created || null,
        status: 'unknown',
        detail
      })).filter((item) => !!item.date);
    },
    sceneStatus() {
      if (sceneLibrary.resolveSceneStatus) {
        return sceneLibrary.resolveSceneStatus(this.normalizedDetail);
      }
      return this.hasDetail ? 'unknown' : 'no-detail';
    },
    effectiveRenderData() {
      return this.rendererData || this.localRenderResult || null;
    },
    moduleError() {
      return this.error || this.localRenderError;
    },
    hasDetail() {
      return !!this.normalizedDetail && Object.keys(this.normalizedDetail).length > 0;
    },
    hasJsonPreview() {
      return !!(this.normalizedPreview.json && this.normalizedPreview.json.exists);
    },
    hasSvgPreview() {
      return !!(this.normalizedPreview.svg && this.normalizedPreview.svg.exists);
    },
    hasPngPreview() {
      return !!(this.normalizedPreview.png && this.normalizedPreview.png.exists);
    },
    canRender() {
      return this.hasDetail && !this.rendering;
    },
    canSaveSvg() {
      return !!(this.effectiveRenderData && this.effectiveRenderData.svgContent) && !this.savingSvg;
    },
    canSavePng() {
      const hasRenderAsset = !!(
        this.effectiveRenderData &&
        (this.effectiveRenderData.svgContent || this.effectiveRenderData.imageUrl || this.effectiveRenderData.pngSource)
      );
      return hasRenderAsset && !this.savingPng;
    }
  },
  watch: {
    rendererData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.localRenderResult = null;
        }
      }
    },
    selectedDate() {
      this.localRenderError = null;
    },
    'imagenes.ImagenRenderedNat':{
      immediate: true,
      handler(val){
        console.log(val);
        this.imagenRenderedNat=val?.visual??null;
      }
    },
    'imagenes.ImagenVegetation':{
      immediate: true,
      handler(val){
        this.ImagenVegetation=val?.visual??null;
        //console.log(val);
      }
    },
    'imagenes.ImagenNir':{
      immediate: true,
      handler(val){
        this.ImagenNir=val?.visual??null;
        //console.log(val);
      }
    },
    'imagenes.ImagenNdvi':{
      immediate: true,
      handler(val){
        this.ImagenNdvi=val?.visual??null;
        //console.log(val);
      }
    },
    'imagenes.ImagenAgricredEdge':{
      immediate: true,
      handler(val){
        this.ImagenAgricredEdge=val?.visual??null;
        //console.log(val);
      }
    },
    'imagenes.ImagenRedEdgeNirRed':{
      immediate: true,
      handler(val){
        this.ImagenRedEdgeNirRed=val?.visual??null;
        //console.log(val);
      }
    },
    'imagenes.ImagenNdre':{
      immediate: true,
      handler(val){
        this.ImagenNdre=val?.visual??null;
        //console.log(val);
      }
    },
    'imagenes.ImagennNre2':{
      immediate: true,
      handler(val){
        this.ImagennNre2=val?.visual??null;
        //console.log(val);
      }
    },
    'imagenes.ImagenNdmi':{
      immediate: true,
      handler(val){
        this.ImagenNdmi=val?.visual??null;
        //console.log(val);
      }
    },
    'imagenes.ImagenEvi':{
      immediate: true,
      handler(val){
        this.ImagenEvi=val?.visual??null;
        //console.log(val);
      }
    },
  },
  methods: {
	getPaths(stringArray){
		const res=[];
		stringArray.split('|').forEach(it=>{
			let p=it.split(',')
			res.push({lat:parseFloat(p[0]),lng: parseFloat(p[1])})
		})
		console.log(res)
		return res;
	},
	updateEscenas(){
		this.$refs.monitoringMod.updateEscenas(escenas);
	},
	updateProduccion(){
		this.$refs.monitoringMod.updateProduccion(produccion,escenas);
	},
	guardaImagen({imagen,index}){
		console.log('save-imagenes',{imagen,index});
		setTimeout(()=>{
			this.$refs.monitoringMod.terminoSendData();
		},5000)
	},
	guardaImagenes(imagenes){
		console.log('save-imagenes',imagenes);
		setTimeout(()=>{
			this.$refs.monitoringMod.terminoSendData();
		},5000)
	},
	setError(){

	},
    /*generaImages(){
      setTimeout(()=>{this.generaImagenNatural();},100);
      setTimeout(()=>{this.generaImagenVegetation();},100);
      setTimeout(()=>{this.generaImagenNir();},100);
      setTimeout(()=>{this.generaImagenNdvi();},100);
      setTimeout(()=>{this.generaImagenAgricRededge();},100);
      setTimeout(()=>{this.generaImagenRededgNirRed();},100);
      setTimeout(()=>{this.generaImagenNdre();},100);
      setTimeout(()=>{this.generaImagenNdre2();},100);
      setTimeout(()=>{this.generaImagenNdmi();},100);
      setTimeout(()=>{this.generaImagenEvi();},100);
    },
    async generaImagenNatural(){
      const v=await libTest.getOrGenerateSceneVisual(escena,'natural-color',{includeDataUrl: true,width: 1024,height: 1024,centro:{lat:21.124525,lon:-100.888874}});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      
      this.imagenRenderedNat=v.visual;
    },
    async generaImagenVegetation(){
      const v=await libTest.getOrGenerateSceneVisual(escena,'false-color-vegetation',{includeDataUrl: true,width: 1024,height: 1024,centro:{lat:21.124525,lon:-100.888874}});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenVegetation=v.visual;
    },
    async generaImagenNir(){
      const v=await libTest.getOrGenerateSceneVisual(escena,'swir-nir-red',{includeDataUrl: true,width: 1024,height: 1024,centro:{lat:21.124525,lon:-100.888874}});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenNir=v.visual;
    },
    async generaImagenNdvi(){
      const v=await libTest.getOrGenerateSceneVisual(escena,'ndvi',{includeDataUrl: true,width: 1024,height: 1024,centro:{lat:21.124525,lon:-100.888874}});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenNdvi=v.visual;
    },
    async generaImagenAgricRededge(){
      const v=await libTest.getOrGenerateSceneVisual(escena,'agriculture-rededge',{includeDataUrl: true,width: 1024,height: 1024,centro:{lat:21.124525,lon:-100.888874}});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenAgricredEdge=v.visual;
    },
    async generaImagenRededgNirRed(){
      const v=await libTest.getOrGenerateSceneVisual(escena,'rededge-nir-red',{includeDataUrl: true,width: 1024,height: 1024,centro:{lat:21.124525,lon:-100.888874}});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenRedEdgeNirRed=v.visual;
    },
    async generaImagenNdre(){
      const v=await libTest.getOrGenerateSceneVisual(escena,'ndre',{includeDataUrl: true,width: 1024,height: 1024,centro:{lat:21.124525,lon:-100.888874}});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenNdre=v.visual;
    },
    async generaImagenNdre2(){
      const v=await libTest.getOrGenerateSceneVisual(escena,'ndre2',{includeDataUrl: true,width: 1024,height: 1024,centro:{lat:21.124525,lon:-100.888874}});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagennNre2=v.visual;
    },
    async generaImagenNdmi(){
      const v=await libTest.getOrGenerateSceneVisual(escena,'ndmi',{includeDataUrl: true,width: 1024,height: 1024,centro:{lat:21.124525,lon:-100.888874}});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenNdmi=v.visual;
    },
    async generaImagenEvi(){
      const v=await libTest.getOrGenerateSceneVisual(escena,'evi',{includeDataUrl: true,width: 1024,height: 1024,centro:{lat:21.124525,lon:-100.888874}});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      console.log(v)
      this.ImagenEvi=v.visual;
    },*/
    basePayload() {
      return {
        production: this.normalizedProduction,
        detail: this.normalizedDetail,
        details: this.normalizedDetails,
        produccion: this.normalizedDetail && this.normalizedDetail.produccion
          ? this.normalizedDetail.produccion
          : (this.extractedPayload && this.extractedPayload.produccion) || null,
        selectedDate: this.selectedDate,
        preview: this.normalizedPreview,
        rendererData: this.effectiveRenderData
      };
    },
    onRequestRender(payload) {
      this.$emit('request-render', payload);
      this.$emit('render', payload);
    },
    onRenderReady(payload) {
      this.localRenderResult = payload;
      this.localRenderError = null;
      this.$emit('render-ready', payload);
    },
    onRenderError(payload) {
      this.localRenderError = payload;
      this.$emit('render-error', payload);
    },
    onUpdate() {
      this.$emit('update');
    },
    onChangeDate(value) {
      this.$emit('change-date', value);
    },
    onRenderAction() {
      this.$emit('render', Object.assign({ source: 'actions' }, this.basePayload()));
    },
    onSaveSvg() {
      this.$emit('save-svg', this.basePayload());
    },
    onSavePng() {
      this.$emit('save-png', this.basePayload());
    },
    onSaveAll() {
      const payload = Object.assign({ source: 'actions-save-all' }, this.basePayload());
      this.$emit('save-all', payload);
    },
	
  }
};
</script>

<style scoped>
	.pm-module {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.tabs-images{
	}
	.tabs-images li:not(.disabled){
		cursor: pointer;
    	opacity: 1;
	}
	.tabs-images li:not(.disabled):hover{
		background: rgb(206, 206, 206);
		/* box-shadow: 0 5px 0 10px red; */
	}
	.tabs-images li:not(.disabled) a.active{
		border-bottom:solid;
		font-weight: bold;
	}
	.tabs-images li:not(.disabled) a:not(.active):hover{
		color: rgb(98, 179, 255);
	}
</style>
