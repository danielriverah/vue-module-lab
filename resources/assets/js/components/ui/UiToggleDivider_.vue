<template>
    <div class="toggle-divider" :class="{open:value, close:!value}" @click="toggle">
        {{ arrows }}
    </div>
</template>
<script>
    export default {
        props: {
            value: {
            type: Boolean,
            default: false
            }
        },
        data(){
            return {
            arrows: ''
            }
        },
        mounted(){
            this.fill()
            window.addEventListener('resize', this.fill)
        },
        beforeDestroy(){
            window.removeEventListener('resize', this.fill)
        },
        methods:{
            fill(){
            const width = this.$el.offsetWidth
            const count = Math.floor(width / 14)

            const icon = this.value ? '⌃' : '⌄'

            this.arrows = Array(count).fill(icon).join('')
            },
            toggle(){
            this.$emit('input', !this.value)
            this.$nextTick(this.fill)
            }
        },
        watch:{
            value(){
                this.$nextTick(this.fill)
            }
        },
        // template:`
        //     <div class="toggle-divider" @click="toggle">
        //     {{ arrows }}
        //     </div>
        // `
    }
</script>
<style scoped>
    .toggle-divider{
        width:100%;
        text-align:center;
        cursor:pointer;
        user-select:none;
        color:#888;
        letter-spacing:6px;
        padding:6px 0;
        font-size:14px;
        transition:all .2s ease;
        white-space: nowrap;
    }
    .toggle-divider.close:hover{
        border-top: 1px dashed rgb(65, 143, 247);
    }
    .toggle-divider.open:hover{
        border-bottom: 1px dashed rgb(65, 143, 247);
    }
    .toggle-divider:hover{
        color:rgb(65, 143, 247);
        /* background:rgba(0,0,0,0.03); */
        transform:translateY(1px);
    }
</style>