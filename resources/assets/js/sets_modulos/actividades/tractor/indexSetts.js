import tractor_actividades from '@/utils/data/tractor_actividades'
export const setts={
    mounted() {
        console.log(tractor_actividades)
    },
    computed:{
        datosVista(){
            return{
                catalogos:this.catalogos,
                d_yearsSelect:this.d_yearsSelect,
                d_ranchos:this.d_ranchos,
                d_tablas:this.d_tablas,
                d_producciones:this.d_producciones,
                datos:this.datos,
            }
        },
        catalogos(){
            return{
                actividades_modulo_conceptos:tractor_actividades.actividades_modulo_conceptos,
                activos_fijos:tractor_actividades.activos_fijos,
                articulos:tractor_actividades.articulos,
                empleados:tractor_actividades.empleados,
                producciones:tractor_actividades.producciones,
                tractoristas:tractor_actividades.tractoristas,

            }
        },
        d_yearsSelect(){},
        d_ranchos(){},
        d_tablas(){},
        d_producciones(){return tractor_actividades.producciones},
        datos(){
            return {
                actividades:{ ...tractor_actividades.data2.TA??{} },
                documentos_estadisticos:{...tractor_actividades.data2.documentos_estadisticos??{}},
            };
        },

    },
    methods: {
        accionFromComponente(parametros) {
            // Aquí llamas tu JS puro
            accionFromComponenteJS(parametros);
        }
    },
    //template: `<test-table @action-emited="accionFromComponente" />`
}