<template>
    <div class="pm-module">
        <div class="col s12">
            <div class="pm-status-row">
                <span :class="[statusChipClass(imagenRenderedNat),{'active':tabActive==='imagenRenderedNat'}]" @click="tabActive='imagenRenderedNat'">Natural</span>
                <span :class="[statusChipClass(ImagenVegetation),{'active':tabActive==='ImagenVegetation'}]" @click="tabActive='ImagenVegetation'">Vegetación</span>
                <span :class="[statusChipClass(ImagenNir),{'active':tabActive==='ImagenNir'}]" @click="tabActive='ImagenNir'">NIR</span>
                <span :class="[statusChipClass(ImagenNdvi),{'active':tabActive==='ImagenNdvi'}]" @click="tabActive='ImagenNdvi'">NDVI</span>
                <span :class="[statusChipClass(ImagenAgricredEdge),{'active':tabActive==='ImagenAgricredEdge'}]" @click="tabActive='ImagenAgricredEdge'">Rede</span>
                <span :class="[statusChipClass(ImagenRedEdgeNirRed),{'active':tabActive==='ImagenRedEdgeNirRed'}]" @click="tabActive='ImagenRedEdgeNirRed'">Rede span Red</span>
                <span :class="[statusChipClass(ImagenNdre),{'active':tabActive==='ImagenNdre'}]" @click="tabActive='ImagenNdre'">NDRE</span>
                <span :class="[statusChipClass(ImagennNre2),{'active':tabActive==='ImagennNre2'}]" @click="tabActive='ImagennNre2'">NDRE2</span>
                <span :class="[statusChipClass(ImagenNdmi),{'active':tabActive==='ImagenNdmi'}]" @click="tabActive='ImagenNdmi'">NDMI</span>
                <span :class="[statusChipClass(ImagenEvi),{'active':tabActive==='ImagenEvi'}]" @click="tabActive='ImagenEvi'">EVI</span>
                
            </div>
            <!-- <ul class="tabs tabs-fixed-width tab-demo z-depth-1 tabs-images">
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
            </ul> -->
        </div>
        <MonitoringScenaPreview :polygon="polygonBinding" :result="getImagenBySelect" :centro="imagenes.centro" v-if="getImagenBySelect"></MonitoringScenaPreview>
    </div>
</template>
<script>
    import MonitoringScenaPreview from './MonitoringScenaPreview.vue';
    import {LoadingImages} from '../utils/Imagen'
    export default {
        name: 'MonitoringEsceneView',
        mounted() {
            console.log(this.$props)
            this.imagenes=new LoadingImages(this.escene,this.centro);
        },
        components: {
            MonitoringScenaPreview
        },
        props:{
            escene:{
                type:Object,
                require:true,
            },
            centro:{
                type:Object,
                require:true,
            },
            produccion:{
                type:Object,
                require:true,
            },
            imagenSelected:{
                type:String,
                default:'',
            }
        },
        data() {
            return {
                tabActive:this.imagenSelected,
                productionData:this.produccion,
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
        computed:{
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
        },
        watch:{
            escene:{
                immediate: true,
                dipper:true,
                handler(val){
                    console.log(val)
                    this.imagenes=new LoadingImages(val,this.centro);
                }
            },
            'imagenes.ImagenRenderedNat':{
                immediate: true,
                handler(val){
                    console.log(val);
                    this.imagenRenderedNat=val?.visual??null;
                    this.enviaImagenes();
                }
            },
            'imagenes.ImagenVegetation':{
                immediate: true,
                handler(val){
                    this.ImagenVegetation=val?.visual??null;
                    this.enviaImagenes();
                }
            },
            'imagenes.ImagenNir':{
                immediate: true,
                handler(val){
                    this.ImagenNir=val?.visual??null;
                    this.enviaImagenes();
                }
            },
            'imagenes.ImagenNdvi':{
                immediate: true,
                handler(val){
                    this.ImagenNdvi=val?.visual??null;
                    this.enviaImagenes();
                }
            },
            'imagenes.ImagenAgricredEdge':{
                immediate: true,
                handler(val){
                    this.ImagenAgricredEdge=val?.visual??null;
                    this.enviaImagenes();
                }
            },
            'imagenes.ImagenRedEdgeNirRed':{
                immediate: true,
                handler(val){
                    this.ImagenRedEdgeNirRed=val?.visual??null;
                    this.enviaImagenes();
                }
            },
            'imagenes.ImagenNdre':{
                immediate: true,
                handler(val){
                    this.ImagenNdre=val?.visual??null;
                    this.enviaImagenes();
                }
            },
            'imagenes.ImagennNre2':{
                immediate: true,
                handler(val){
                    this.ImagennNre2=val?.visual??null;
                    this.enviaImagenes();
                }
            },
            'imagenes.ImagenNdmi':{
                immediate: true,
                handler(val){
                    this.ImagenNdmi=val?.visual??null;
                    this.enviaImagenes();
                }
            },
            'imagenes.ImagenEvi':{
                immediate: true,
                handler(val){
                    this.ImagenEvi=val?.visual??null;
                    this.enviaImagenes();
                }
            },
            tabActive:{
                handler(val){
                    this.$emit('imagen-change',val)
                }
            },
            imagenSelected:{
                handler(val){
                    if (this.tabActive !== val) {
                        this.tabActive = val;
                    }
                }
            },
        },
        methods:{
            getPaths(stringArray){
                const res=[];
                stringArray.split('|').forEach(it=>{
                    let p=it.split(',')
                    res.push({lat:parseFloat(p[0]),lng: parseFloat(p[1])})
                })
                console.log(res)
                return res;
            },
            enviaImagenes(){
                this.$emit('update-imagenes',this.imagenes)
            },
            statusChipClass(available) {
				let res=available
					? 'badge'
					: 'badge disabled';
                return res
			},
        }
    }
</script>
<style scoped>
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
    .pm-status-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
    }
    .pm-status-row span{
        border-radius: 10px;
    }
    .pm-status-row span:not(.disabled){
        cursor: pointer;
        background: rgb(177, 252, 229);
        color: rgb(58, 58, 58);
    }
    .pm-status-row span.disabled{
        cursor: no-drop;
        background: rgb(233, 232, 232);
        color: grey;
    }
    .pm-status-row span:not(.disabled):not(.active):hover{
        cursor: pointer;
        background: rgb(140, 213, 255);
        color: #000000;
    }
    .pm-status-row span.active:not(.disabled){
        cursor: pointer;
        background: rgb(140, 213, 255);
        color: #000000;
    }
</style>