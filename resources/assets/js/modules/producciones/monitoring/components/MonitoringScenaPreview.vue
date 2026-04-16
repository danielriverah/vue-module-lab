<template>
    <div class="monitor-preview">
        <div class="preview-header" v-if="result && result.metadata">
            <h4>{{ result.metadata.folio }}</h4>
            <small>
                {{ result.metadata.fecha }} |
                {{ result.metadata.imageType }}
            </small>
        </div>

        <!-- <div v-if="!result || !result.canvas" class="empty-preview">
            No hay imagen generada para mostrar
        </div>

        <div v-else ref="canvasContainer" class="canvas-container"></div> -->
        <div class="col s12">
            <div class="card-panel pm-panel">
              <h6 class="pm-panel-title">Mapa + lecturas satelitales</h6>
              <div class="row">
                <div class="col s12">
                  <div class="pm-map-canvas">
                    <GmapMap
                        ref="mapaRef"
                        :center="centro"
                        :zoom="18"
                        :map-type-id="'satellite'"
                        style="height: 520px; width: 100%; border-radius: 8px;"
                    >
                    <!-- <gmap-ground-overlay
                        v-if="prepararOverlayDesdeHTML"
                        :source="prepararOverlayDesdeHTML"
                        :bounds="bboxImagen" 
                        :opacity="1"
                    ></gmap-ground-overlay> -->
                    <GmapPolygon
                      v-if="zonaP"
                      :paths="zonaP.paths"
                      :options="zonaP.options"
                    />
                      <!-- <GmapPolygon
                        v-if="monitoringAreaPaths.length"
                        :paths="monitoringAreaPaths"
                        :options="monitoringAreaOptions"
                      />
                      <GmapPolygon
                        v-if="monitoredPolygonPaths.length"
                        :paths="monitoredPolygonPaths"
                        :options="monitoredPolygonOptions"
                      /> -->
                    </GmapMap>
                    <p class="pm-map-note">
                      Área monitoreada + polígono base. Se usa para preparar la imagen final por screenshot.
                    </p>
                  </div>
                </div>
                <!-- <div class="col s12 l5">
                  <table class="striped highlight responsive-table pm-reading-table">
                    <thead>
                      <tr>
                        <th>Lectura</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, idx) in satelliteReadings" :key="item.label + '-' + idx">
                        <td>{{ item.label }}</td>
                        <td>{{ item.value }}</td>
                      </tr>
                      <tr v-if="satelliteReadings.length === 0">
                        <td colspan="2" class="grey-text text-darken-1">Sin lecturas satelitales disponibles.</td>
                      </tr>
                    </tbody>
                  </table>
                </div> -->
              </div>
            </div>
        </div>
    </div>
</template>

<script>
//node_modules\vue2-google-maps\dist\components\mapElementFactory.js
// import mapElementFactory from 'vue2-google-maps/dist/components/mapElementFactory';

// const GmapGroundOverlay = mapElementFactory({
//     name: 'groundOverlay',
//     events: [],
//     ctr: () => google.maps.GroundOverlay,
//     ctrArgs: (options) => {
//         return [
//             options.source, // El string Base64 o URL
//             options.bounds  // El objeto con north, south, east, west
//         ];
//         // El constructor nativo es: new GroundOverlay(url, bounds, options)
//         const url = options.source || '';
//         const bounds = options.bounds || { north: 0, south: 0, east: 0, west: 0 };
//         console.log(options,url, bounds)
//         return [url, bounds];
//     },
//     mappedProps: {
//         // Usamos noBind: true para que no intente llamar a setSource()
//         source: { type: String, noBind: true }, 
//         bounds: { type: Object, noBind: true },
//         opacity: { type: Number, noBind: true }
//     },
//     // Agregamos un watcher manual para redibujar si la imagen cambia
//     afterCreate(instance) {
//         instance.setMap(this.$map);
//         /*this.$watch('source', (newSource) => {
//         // Como Google no permite setSource, lo ideal es forzar 
//         // el refresco del componente o manejar la instancia aquí.
//         // Pero con noBind, al menos el error de "Uncaught Error" desaparecerá.
//         });*/
//     }
// });
export default {
    name: 'MonitoringScenePreview',
    // components:{
    //     'gmap-ground-overlay': GmapGroundOverlay
    // },
    props: {
        polygon:{
            type:Object,
            default:{},
        },
        result: {
            type: Object,
            default: null
        },
        centro:{
            type:Object,
            default:{lat:0,lon:0}
        }
    },
    data(){
        return{
            fuenteImagenCanvas:null
        }
    },
    watch: {
        result: {
            immediate: true,
            deep: true,
            handler(v) {
                console.log(v)
                this.actualizarOverlay();
            }
        }
    },
    mounted() {
        console.log(this.$props)
        this.actualizarOverlay();
    },
    computed:{
        zonaP(){
            console.log(this.polygon)
            return this.polygon;
        },
        bboxImagen(){
            // 1. Obtenemos el arreglo: [-100.89, 21.11, -100.87, 21.13]
            const bbox = this.result.metaImagen.bboxLatLng;
            // 2. Mapeamos por índice según el estándar [Oeste, Sur, Este, Norte]
            const r = {
                west:  bbox[0],
                south: bbox[1],
                east:  bbox[2],
                north: bbox[3]
            };
            console.log(r)
            return r;
        },
        prepararOverlayDesdeHTML() {
            const canvas = this.result?.canvas;
            if (!canvas) return null;
            console.log(canvas)
            return canvas.toDataURL('image/png');
        }
    },
    methods: {
        // renderCanvas() {
        //     this.$nextTick(() => {
        //         const container = this.$refs.canvasContainer;
        //         if (!container) return;

        //         container.innerHTML = '';

        //         if (this.result && this.result.canvas) {
        //             container.appendChild(this.result.canvas);
        //         }
        //     });
        // },
        beforeDestroy() {
            if (this.overlay) {
            this.overlay.setMap(null);
            this.overlay = null;
            }
        },
        async actualizarOverlay() {
            if (!this.prepararOverlayDesdeHTML || !this.bboxImagen) return;
            if (!this.$refs.mapaRef || !this.$refs.mapaRef.$mapPromise) return;

            const map = await this.$refs.mapaRef.$mapPromise;

            if (this.overlay) {
                this.overlay.setMap(null);
                this.overlay = null;
            }

            this.overlay = new google.maps.GroundOverlay(
                this.prepararOverlayDesdeHTML,
                this.bboxImagen,
                { opacity: 1 }
            );

            this.overlay.setMap(map);
        }
    }
};
</script>

<style scoped>
.monitor-preview {
    width: 100%;
}

.preview-header {
    margin-bottom: 10px;
}

.canvas-container {
    width: 100%;
    min-height: 200px;
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: auto;
    background: #fafafa;
    padding: 8px;
}

.empty-preview {
    padding: 20px;
    border: 1px dashed #bbb;
    border-radius: 6px;
    color: #666;
}
</style>