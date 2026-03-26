export const setts={
    
    methods: {
        accionFromComponente(parametros) {
            // Aquí llamas tu JS puro
            accionFromComponenteJS(parametros);
        }
    },
    //template: `<test-table @action-emited="accionFromComponente" />`
}
export const setssTest={
    mounted() {
        console.log(this.$props)
        console.log(this)
    },
}