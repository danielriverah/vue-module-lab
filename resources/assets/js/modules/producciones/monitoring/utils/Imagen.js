import * as libTest from '@/utils/p_libs/satelliteMonitoring.js'
class LoadingImages{
    constructor(escena,centro){
        console.log(escena)
        this.escena=escena;
        //{lat:21.124525,lon:-100.888874}
        this.centro={lat:centro.lat,lon:centro.lon,lng:centro.lon};
        this.ImagenRenderedNat=null;
        this.ImagenVegetation=null;
        this.ImagenNir=null;
        this.ImagenNdvi=null;
        this.ImagenAgricredEdge=null;
        this.ImagenRedEdgeNirRed=null;
        this.ImagenNdre=null;
        this.ImagennNre2=null;
        this.ImagenNdmi=null;
        this.ImagenEvi=null;
        this.init();
    }
    init(){
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
    }
    async generaImagenNatural(){
        if(this.escena.imagen_natural){
            this.ImagenRenderedNat=this.escena.imagen_natural;
            return;
        }
        const v=await libTest.getOrGenerateSceneVisual(this.escena,'natural-color',{includeDataUrl: true,width: 1024,height: 1024,centro:this.centro});//natural-color,false-color-vegetation,swir-nir-red,ndvi
        this.ImagenRenderedNat=v;
    }
    async generaImagenVegetation(){
        if(this.escena.imagen_vegetation){
            this.ImagenVegetation=this.escena.imagen_vegetation;
            return;
        }
        const v=await libTest.getOrGenerateSceneVisual(this.escena,'false-color-vegetation',{includeDataUrl: true,width: 1024,height: 1024,centro:this.centro});//natural-color,false-color-vegetation,swir-nir-red,ndvi
        this.ImagenVegetation=v;
    }
    async generaImagenNir(){
        if(this.escena.imagen_nir){
            this.ImagenNir=this.escena.imagen_nir;
            return;
        }
        const v=await libTest.getOrGenerateSceneVisual(this.escena,'swir-nir-red',{includeDataUrl: true,width: 1024,height: 1024,centro:this.centro});//natural-color,false-color-vegetation,swir-nir-red,ndvi
        this.ImagenNir=v;
    }
    async generaImagenNdvi(){
        if(this.escena.imagen_ndvi){
            this.ImagenNdvi=this.escena.imagen_ndvi;
            return;
        }
      const v=await libTest.getOrGenerateSceneVisual(this.escena,'ndvi',{includeDataUrl: true,width: 1024,height: 1024,centro:this.centro});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenNdvi=v;
    }
    async generaImagenAgricRededge(){
        if(this.escena.imagen_agric_red_edge){
            this.ImagenAgricredEdge=this.escena.imagen_agric_red_edge;
            return;
        }
      const v=await libTest.getOrGenerateSceneVisual(this.escena,'agriculture-rededge',{includeDataUrl: true,width: 1024,height: 1024,centro:this.centro});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenAgricredEdge=v;
    }
    async generaImagenRededgNirRed(){
        if(this.escena.imagen_edge_nir_red){
            this.ImagenRedEdgeNirRed=this.escena.imagen_edge_nir_red;
            return;
        }
      const v=await libTest.getOrGenerateSceneVisual(this.escena,'rededge-nir-red',{includeDataUrl: true,width: 1024,height: 1024,centro:this.centro});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenRedEdgeNirRed=v;
    }
    async generaImagenNdre(){
        if(this.escena.imagen_ndre){
            this.ImagenNdre=this.escena.imagen_ndre;
            return;
        }
      const v=await libTest.getOrGenerateSceneVisual(this.escena,'ndre',{includeDataUrl: true,width: 1024,height: 1024,centro:this.centro});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenNdre=v;
    }
    async generaImagenNdre2(){
        if(this.escena.imagen_ndre2){
            this.ImagennNre2=this.escena.imagen_ndre2;
            return;
        }
      const v=await libTest.getOrGenerateSceneVisual(this.escena,'ndre2',{includeDataUrl: true,width: 1024,height: 1024,centro:this.centro});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagennNre2=v;
    }
    async generaImagenNdmi(){
        if(this.escena.imagen_ndmi){
            this.ImagenNdmi=this.escena.imagen_ndmi;
            return;
        }
      const v=await libTest.getOrGenerateSceneVisual(this.escena,'ndmi',{includeDataUrl: true,width: 1024,height: 1024,centro:this.centro});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenNdmi=v;
    }
    async generaImagenEvi(){
        if(this.escena.imagen_evi){
            this.ImagenEvi=this.escena.imagen_evi;
            return;
        }
      const v=await libTest.getOrGenerateSceneVisual(this.escena,'evi',{includeDataUrl: true,width: 1024,height: 1024,centro:this.centro});//natural-color,false-color-vegetation,swir-nir-red,ndvi
      this.ImagenEvi=v;
    }
}

export {LoadingImages}; 