<template>
    <div>
        <h1>Test Table</h1>
        <!-- <ui-button @click="testActionBtn" :action="testActionBtn">Init Table</ui-button> -->
        <ui-button :action="testActionBtn" icon="save" class="ui-btn-icon-only">

        </ui-button>
        <!-- <button @click="cargaEmit">Boton</button> -->
        <ui-table v-model="lotes" />
        <!-- <table ref="table" class="display responsive compact" >
            <thead>
                <tr>
                    <th >Col1</th>
                    <th >Col2</th>
                    <th >Col3</th>
                    <th >Col4</th>
                    <th >Col5</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
                <tr><td>val1 tested values responsive</td><td>val1 colums 2</td><td>val1 col3</td><td>val1 col4</td><td>val1</td></tr>
            </tbody>
        </table> -->
    </div>
</template>
<script>
    import { mockData,dataIndex } from '@/mock/plantacionMock';
    import {setssTest} from '@/sets_modulos/TestTable'
    import UiButton from '@/components/ui/UiButton.vue';
    import TableLanguages from '@/utils/TableLanguages.js'
    import UiTable from '@/components/ui/UiTable.vue';
    // import DataTable from 'datatables.net-dt';
    // import 'datatables.net-responsive-dt';
    // import 'datatables.net-responsive';
    // import('materialize-css/dist/css/materialize.min.css')
    // import('vue-select/dist/vue-select.css')
    // import('datatables.net')
    // import ('datatables.net-dt/css/dataTables.dataTables.min.css')
    // import ('datatables.net-responsive-dt')
    // import ('datatables.net-responsive-dt/css/responsive.dataTables.css')
    // import ('datatables/media/js/jquery.dataTables.min.js')
    // import ('datatables/media/css/jquery.dataTables.min.css')
    // import('materialize-css/dist/js/materialize.min.js')
    export default {
        mixins: [setssTest],
        name: "TestTable",
        components:{
            UiButton,UiTable
        },
        mounted() {
            console.log('Mounted del componente')
            console.log(dataIndex)
            this.initTable()
        },
        data() {
            return {
                registros: mockData,
                lotes:[...dataIndex.lotes_producciones]
            }
        },
        
        methods:{
            initTable(){
                //console.log(this.$refs.table)
                this.table=$(this.$refs.table).DataTable({
                    responsive: true,
                    pageLength: 10,
                    language: TableLanguages('es'),
                });
                /*this.table=new DataTable(this.$refs.table,{
                    responsive: true,
                    lengthChange:true,
                    paging:true,
                    pageLength: 5,
                    language: TableLanguages('es'),
                });*/
            },
            recargarDatos() {
                console.log("Recargando datos...");
                // aquí haces tu axios o fetch
            },
            cargaEmit(){
                this.$emit("action-emited",{param1:'test'});
            },
            async actionTest(){
                await new Promise(resolve => {
                    setTimeout(() => {
                        resolve()
                    }, 2000)
                })
            },
            async testActionBtn(a,b){
                console.log("inicio",a);
                await this.actionTest();
                console.log('Finalizo',b)
            }
        },
    }
</script>