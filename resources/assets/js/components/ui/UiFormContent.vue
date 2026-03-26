<template>
    <div class="form-content">
    
        <GroupInputsBase
            :form="model"
            :fields="fields"
            :errors="errors"
            v-on="$listeners"
            @input="update"
        />
    
    </div>
</template>
    
<script>
    export default{
        name:'FormContent',
        props:{
            value:Object,
            fields:Array,
            rules:Object
        },
        data(){
            return{
                model:{...this.value},
                errors:{}
            }
        },
        methods:{
            update({name,value}){
                this.model[name]=value
                this.validateField(name)
    
                this.$emit('input',{...this.model})
            },
    
            validateField(name){
                if(!this.rules || !this.rules[name]) return
    
                const ruleSet = this.rules[name]
    
                for(let rule of ruleSet){
                    const result = rule(this.model[name], this.model)
    
                    if(result !== true){
                        this.$set(this.errors,name,result)
                        return
                    }
                }
    
                this.$delete(this.errors,name)
            }
        },
        watch:{
            value(val){
                this.model={...val}
            }
        }
    }
</script>