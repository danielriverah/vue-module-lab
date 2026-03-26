<template>
    <div>
        <table ref="tablaPlants"  class="display compact responsive" width="100%">
            <thead>
				<tr>
					<th data-priority="1">Fecha Aplicación</th>
					<th data-priority="4">Folio</th>
					<th data-priority="3">Estatus</th>
					<th data-priority="2">Lote</th>
					<th data-priority="6">Creado Por</th>
					<th data-priority="5"></th>
				</tr>
			</thead>
        </table>
    </div>
</template>
<script>
    import 'datatables.net-responsive'
    import 'datatables.net-responsive-dt/css/responsive.dataTables.css'
    import TableLanguages from '@/utils/TableLanguages.js'
    export default {
        name: 'TablaIndex',
        props:{
            value:Array,
        },
        mounted(){
            console.log(this.value);
            this.initTable();
        },
        data(){
            return{
                laTabla:null,
                valueLocal:[...this.value??[]]
            }
        },
        methods:{
            initTable(){
                $(document).ready(()=>{

                    this.laTabla=$(this.$refs.tablaPlants).DataTable({
                        data:this.valueLocal,
                        columns:[
                            {'data':'fecha_proceso'},
                            {'data':'folio'},
                            {'render':(a,b,row)=>{
                                let res=``;
                                if(row.estatus == 'Pendiente')
                                    res+=`<span class="status text-pending">•</span>`;
                                else if(row.estatus == 'Normal')
                                    res+=`<span class="status text-authorized">•</span>`;
                                else if(row.estatus == 'Cancelado')
                                    res+=`<span class="status text-cancel">•</span>`;
                                res+=row.estatus
                                return (res)
                            }},
                            {'data':'lote'},
                            {'data':'usuario_creacion'},
                            {'render':(a,b,row)=>{
                                let res=``;
                                if(row.estatus =='Pendiente'){
                                    res+=`<i data-id="${row.docto_produccion_id}" class="btn-edit material-icons puntero" title="Editar" 
                                            href="plantacion/editar/`+row.docto_produccion_id+`" 
                                        >edit</i>
                                        <i class="material-icons disabled-btn"  title="La plantacion debe estar terminada">beenhere</i>`;
                                }else if(row.estatus =='Normal'){
                                    res+=`<i class="material-icons disabled-btn"  title="La aplicación debe estar pendiente">edit</i>`;
                                    if(row.concepto_produccion == 'PLANTACION'){
                                        if(row.surtida > 0 && row.aplicado==0){
                                            res+=`<i data-id="${row.docto_produccion_id}" class="btn-aplicar edit-record" 
                                                        href="plantacion/aplica/`+row.docto_produccion_id+`"
                                                    >
                                                            <i class="material-icons"  title="Aplicar plantación" >beenhere</i>
                                                        </i>`
                                        }else{
                                            if(row.surtida == 0 )
                                                res+=`<i class="material-icons disabled-btn"  title="Plantación no surtida">beenhere</i>`
                                            else
                                                res+=`<i class="material-icons disabled-btn"  title="Plantación aplicada">beenhere</i>`
                                        }
                                    }else{
                                        res+=`<i class="material-icons disabled-btn"  title="No es plantacion">beenhere</i>`;
                                    }
                                }else{
                                    if(row.estatus =='Cancelado'){
                                        res+=`<i class="material-icons disabled-btn"  title="La plantacón debe estar pendiente">edit</i>
                                                <i class="material-icons disabled-btn"  title="La plantación fue cancelada">beenhere</i>`
                                    }else
                                    res+=`<i class="material-icons disabled-btn"  title="La plantacón debe estar pendiente">edit</i>
                                            <i class="material-icons disabled-btn"  title="La plantación debe estar terminada">beenhere</i>`;
                                }
                                res+=`<i data-id="${row.docto_produccion_id}" class="btn-ver material-icons puntero" title="Visualizar">remove_red_eye</i>`;
                                return (res);
                            }}
                        ],
                        paging: true,
                        responsive: true,
                        language:TableLanguages('es'),
                        drawCallback:()=>{
                            //$('.tooltipped').tooltip();
                        }
                    })
                    this.bindEvents()
                    $('select').formSelect();
                })
            },
            bindEvents() {
                const table = $(this.$refs.tablaPlants)
                table.on('click', '.btn-edit', (e) => {
                    const id = $(e.currentTarget).data('id')
                    const rowData = this.laTabla.row($(e.currentTarget).closest('tr')).data()
                    this.editar(rowData)
                })
                table.on('click', '.btn-aplicar', (e) => {
                    const rowData = this.laTabla.row($(e.currentTarget).closest('tr')).data()
                    this.aplicar(rowData)
                })
                table.on('click', '.btn-ver', (e) => {
                    const rowData = this.laTabla.row($(e.currentTarget).closest('tr')).data()
                    this.visualizar(rowData)
                })
                table.on('click', 'tbody tr',(e)=> {
                    //$(this).addClass('selected');
                    //console.log(this.laTabla.row(e.currentTarget).data());
                    this.laTabla.$('.selected').removeClass('selected');
                    $(e.currentTarget).addClass('selected');
                })
                table.on('dblclick', 'tbody tr',(e)=> {
                    //$(this).addClass('selected');
                    //console.log(this.laTabla.row(e.currentTarget).data());
                    if($(e.currentTarget).find('.btn-edit').length)
                    $(e.currentTarget).find('.btn-edit').trigger('click')
                    else if($(e.currentTarget).find('.btn-aplicar').length)
                    $(e.currentTarget).find('.btn-aplicar').trigger('click')
                    else
                    $(e.currentTarget).find('.btn-ver').trigger('click')
                })
            },
            render(){
                this.laTabla.clear().draw();
                this.laTabla.rows.add(this.valueLocal).draw();
            },
            editar(row){
                this.$emit('edit',row)
            }
            ,
            aplicar(row){
                this.$emit('aplicar',row)
            },
            visualizar(row){
                this.$emit('ver',row)
            }
        },
        watch:{
            value(v){
                console.log(v)
                this.valueLocal=[...v];
                this.render();
            }
        }
    }
    /*colsTablePlantaciones=[
    {'data':'fecha_proceso'},
    {'data':'folio'},
    {'render':(a,b,row)=>{
        let res=``;
        if(row.estatus == 'Pendiente')
            res+=`<span class="status text-pending">•</span>`;
        else if(row.estatus == 'Normal')
            res+=`<span class="status text-authorized">•</span>`;
        else if(row.estatus == 'Cancelado')
            res+=`<span class="status text-cancel">•</span>`;
        res+=row.estatus
        return (res)
    }},
    {'data':'lote'},
    {'data':'usuario_creacion'},
    {'render':(a,b,row)=>{
        let res=``;
        if(row.estatus =='Pendiente'){
            res+=`<i class="material-icons edit-plantacion-app tooltipped puntero" data-tooltip="Editar" href="plantacion/editar/`+row.docto_produccion_id+`" >edit</i>
                <i class="material-icons tooltipped disabled-btn"  data-tooltip="La plantacion debe estar terminada">beenhere</i>`;
        }else if(row.estatus =='Normal'){
            res+=`<i class="material-icons tooltipped disabled-btn"  data-tooltip="La aplicación debe estar pendiente">edit</i>`;
            if(row.concepto_produccion == 'PLANTACION'){
                if(row.surtida > 0 && row.aplicado==0){
					res+=`<a class="edit-record" href="plantacion/aplica/`+row.docto_produccion_id+`">
									<i class="material-icons tooltipped"  data-tooltip="Aplicar plantación"  id-record="`+row.docto_produccion_id+`" >beenhere</i>
								</a>`
				}else{
                    if(row.surtida == 0 )
					    res+=`<i class="material-icons tooltipped disabled-btn"  data-tooltip="Plantación no surtida">beenhere</i>`
					else
                        res+=`<i class="material-icons tooltipped disabled-btn"  data-tooltip="Plantación aplicada">beenhere</i>`
				}
            }else{
                res+=`<i class="material-icons tooltipped disabled-btn"  data-tooltip="No es plantacion">beenhere</i>`;
            }
        }else{
            if(row.estatus =='Cancelado'){
                res+=`<i class="material-icons tooltipped disabled-btn"  data-tooltip="La plantacón debe estar pendiente">edit</i>
                        <i class="material-icons tooltipped disabled-btn"  data-tooltip="La plantación fue cancelada">beenhere</i>`
            }else
            res+=`<i class="material-icons tooltipped disabled-btn"  data-tooltip="La plantacón debe estar pendiente">edit</i>
                    <i class="material-icons tooltipped disabled-btn"  data-tooltip="La plantación debe estar terminada">beenhere</i>`;
        }
        res+=`<i class="material-icons tooltipped visualizarPlantacion" data-tooltip="Visualizar" id-record="`+row.docto_produccion_id+`">remove_red_eye</i>`;
        return (res);
    }}, */
    /*TablePlantaciones=$('#tablePlantaciones').DataTable({
            "aaSorting": [],
            data: [],
            columns:colsTablePlantaciones, 
            paging: true,
            responsive: true,
            "language":idiomaEp,
            "drawCallback": function () {
                $('.tooltipped').tooltip();
            },
        }); */
</script>
<style scoped>
table.dataTable.dtr-inline.collapsed>tbody>tr[role="row"]>td:first-child:before, table.dataTable.dtr-inline.collapsed>tbody>tr[role="row"]>th:first-child:before {
    top: 9px;
    left: 4px;
    height: 14px;
    width: 14px;
    display: block;
    position: absolute;
    color: white;
    border: 2px solid white;
    border-radius: 14px;
    box-shadow: 0 0 3px #444;
    box-sizing: content-box;
    text-align: center;
    text-indent: 0 !important;
    font-family: 'Courier New', Courier, monospace;
    line-height: 14px;
    content: '+';
    background-color: #31b131;
}
</style>