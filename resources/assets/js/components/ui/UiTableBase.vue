<template>
    <table ref="laTabla" class="display compact responsive">
        <thead>
            <slot name="head"></slot>
        </thead>
        <tbody>
            <slot name="body"></slot>
        </tbody>
        <tfoot>
            <slot name="foot"></slot>
        </tfoot>
    </table>
</template>
<script>
    // import DataTable from 'datatables.net-dt';
    import 'datatables.net-responsive-dt';
    import 'datatables.net-responsive';
    // import('materialize-css/dist/css/materialize.min.css')
    // import('vue-select/dist/vue-select.css')
    // import('datatables.net')
    import ('datatables.net-dt/css/dataTables.dataTables.min.css')
    // import ('datatables.net-responsive-dt')
    import ('datatables.net-responsive-dt/css/responsive.dataTables.css')
    ///import ('datatables/media/js/jquery.dataTables.min.js')
    // import ('datatables/media/css/jquery.dataTables.min.css')
    // import('materialize-css/dist/js/materialize.min.js')
    export default {
        name: "UiTableBase",
        mounted(){
            this.initializeTable()
        },
        data(){
            return{
                tabla:null
            }
        },
        methods:{
            initializeTable(){
                $(document).ready(()=>{
                    if(this.tabla!=null){
                        return;
                        this.tabla.destroy();
                    }
                    this.tabla=$(this.$refs.laTabla).DataTable({
                        "responsive": true,
                        "autoWidth": false
                    });
                    $('select').formSelect();
                } );
            }
        }
    }
</script>

<style scoped>

</style>