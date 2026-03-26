<template>
    <div>
        <!-- <h1>contendor wisard</h1> -->
        <UiPointsTable 
            v-if="points.length>0"
            :points="points"
            :selected="selected"
            @deleteSelected="deleteSelected"
            @selected-points="onChangeSelected"
        />
        <UiFileDrop 
            @loadedText="onLoadedText"
        />
    </div>
</template>
<script>
    import UiFileDrop from '@/components/ui/UiFileDrop.vue';
    import UiPointsTable from './UiPointsTable.vue';
    import {parseGpxToPoints} from '@/utils/parseGpx'
    export default{
        components:{
            UiFileDrop,
            UiPointsTable,
        },
        props:{
            value:{type:Array,default:[]},
            selected:{type:Array,default:[]}
        },
        data(){
            return {
                points:[...(this.value??[])],
                //selected:[...this.pointsSelected],
                
            }
        },
        methods:{
            onChangeSelected(event){
                this.$emit('selected-points',event)
            },
            onLoadedText(text){
                let res=parseGpxToPoints(text)
                //console.log(res)
                this.$emit('ready',res)
                //console.log('loaded gpx',a,b,c);
            },
            applyRemoveNear(){
                console.log('remove near');
            },
            applyRemoveCollinear(){
                console.log('remove collinear');
            },
            deleteSelected(){
                let np=this.points.filter((p,i)=>!this.selected.includes(i))
                /*console.log(this.selected)
                console.log(this.points)
                console.log('delete selected');*/
                this.$emit('ready',np)

            }
        },
        watch:{
            value:{
                handler(newVal){
                    this.points=[...newVal]
                },
                deep:true
            },
            // pointsSelected:{
            //     handler(newVal){
            //         this.selected=[...newVal]
            //     },
            //     deep:true
            // },
            // selected:{
            //     handler(newVal){
            //         console.log("this.$emit('update:pointsSelected',newVal)")
            //     },
            //     deep:true
            // }
        }
    }
</script>