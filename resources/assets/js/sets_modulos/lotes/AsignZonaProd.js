// import tractor_actividades from '@/utils/data/tractor_actividades'
import lote_edit from "../../utils/data/lote_edit"
export const setts={
    mounted() {
        console.log('actividad asigna zona',this.$props)
    },
    props:{
        value:{
            type:Object,
            default:()=>{}
        }
    },
    data(){
        return{
            lote:{...lote_edit?.lote??{},...this.value}
        }
    },
    computed:{
        datosVista(){
            
        },
        catalogos(){
            
        },

    },
    methods: {
        accionFromComponente(parametros) {
            // Aquí llamas tu JS puro
            accionFromComponenteJS(parametros);
        },
        MandaOrdenActualizar(a,b,c){
            MandaOrdenActualizar(a,b,c);
        }
    },
    //template: `<test-table @action-emited="accionFromComponente" />`
}