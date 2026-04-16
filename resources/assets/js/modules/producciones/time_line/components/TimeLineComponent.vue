<template>
    <div>
        <div>
            <ul>
            <TimeLineLista
                    :value="estadisticosLocal"
                    :ghosts="getGhostsLocal"
                    :actividadModulosConceptos="actividadModulosConceptos"
                    modoVista="Lista"
                    :selectedEtapas="selectedEtapas"
                    :errores="errores"

                    @cambiar-estatus="cambiarEstatus"
                    @etapa-actions="etapaActions"
                    @etapa-link-actions="etapafolioActions"
                    @select-item="selectItem"
                ></TimeLineLista>
        </ul>
        </div>
    </div>
</template>
<script>
    import TimeLineLista from './TimeLineLista.vue';
    //resources\assets\js\utils\data\data_time_line.js
    export default{
        name:"ProductionTimeLineMain",
        components:{
           TimeLineLista
        },
        mounted(){
            
        },
        props:{
            estadisticos:{type:Array,default:()=>{return[]}},
            ghosts:{type:Array,default:()=>{return[]}},
            actividadModulosConceptos:{type:Object,default:()=>{return {}}},
            errores:{type:Array,default:()=>{return[]}},
    
        },
        data(){
            return{
                estadisticosLocal:this.estadisticos,
                ghostsLocal:this.ghosts,
                selectedEtapas:[],
            }
        },
        computed:{
            getGhostsLocal(){
                let res=[...this.ghostsLocal]
                res=res.map((r,i)=>{
                    r.ghost_index=i;
                    return r;
                })
                return res//this.ghostsLocal.map(g=>{return g.id})
            }
        },
        methods:{
            fixNameFunction(text){
                return snakeToCamel(text)
            },
            cambiarEstatus({etapa,action,actividad,estatus,documento}){
                // let accion=this.fixNameFunction(action);
                // if(this[accion] && typeof this[accion] === 'function'){
                //     console.log('axiste la función: ',this[action])
                //     this[accion]({etapa,actividad,estatus,documento});
                //     return;
                // }
                //console.log({etapa,action,actividad,estatus,documento})
                this.$emit('cambiar-estatus',{etapa,action,actividad,estatus,documento})
            },
            etapaActions({etapa,action,actividad,estatus,documento}){
                console.log({etapa,action,actividad,estatus,documento});
                this.$emit('etapa-actions',{etapa,action,actividad,estatus,documento})
            },
            etapafolioActions({etapa,action,actividad,estatus,documento}){
                console.log({etapa,action,actividad,estatus,documento});
                this.$emit('etapa-link-actions',{etapa,action,actividad,estatus,documento})
            },
            
            selectItem({index,params}){
                //console.log(index)
                if(this.selectedEtapas.includes(index)) {
                    //this.selectedEtapas=[]
                    return
                };
                this.selectedEtapas=[]
                this.selectedEtapas.push(index)
            },
        },
        watch:{
            // estadisticos:{
            //     handler(val){
            //         this.estadisticosLocal=val
            //     },
            //     deep:true
            // },
            ghosts:{
                handler(val){
                    console.log(val)
                    this.ghostsLocal=val
                },
                deep:true
            }
        }
    }
    
</script>