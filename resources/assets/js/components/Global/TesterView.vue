<template>
    <div>
        <!-- <div
            v-for="(field, index) in fiels"
            :key="index"
        > -->
            <InputBase
                v-bind="$data"
                @input="onInput"
            />
        <!-- </div> -->
            <!-- :options="pciones" -->
    </div>
</template>
<script>
    import InputBase from './GroupInputsBase.vue';
    export default {
        name: "TesterView",
        components:{InputBase},
        data(){
            return{
                catalogos:{
                    'opciones_select':[{id:1,text:'opcion 1',label:'opcion 1'},{id:2,text:'opcion 2',label:'opcion 2'},{id:3,text:'opcion 3',label:'opcion 3'}]
                },
                form:{
                    text:'',
                    number:'',
                    textarea:'',
                    select:1,
                    date:'',
                    date_range:{ inicio: '2026-01-01', fin: '2026-03-03' },
                },
                errors:{},
                fields:[
                    {name:'text',label:"TEXTO",type:'text',props:{clases:"col s6"},},    
                    {name:'number',label:"Numerico",type:'number',props:{clases:"col s6"},},
                    {name:'textarea',label:"Text Area",type:'textarea',props:{clases:"col s6"},},
                    {name:'select',label:"Select v",type:'select',label_option:'opciones_select',props:{'reduce':item=>item.id,clases:"col s6"},},
                    {name:'date',label:"Fecha",type:'date',props:{clases:"col s6"},},
                    {name:'date_range',label:"Rango de fechas",type:'date-range',props:{clases:"col s6",rango:{min:'2026-01-05',max:'2026-01-29'}}},
                ]
            }
        },
        computed:{
            catalogosTest(){
                return this.catalogos;
            }
        },
        methods: {
            onInput(values, value) {
                console.log(values, value)
                if (!(values.name in this.form)) {
                    this.$set(this.form, values.name, values.value ?? '');
                } else {
                    this.form[values.name] = values.value ?? '';
                }
            }
        }
    }
</script>