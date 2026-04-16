
<template>
    <div class="ghost-actions" ref="root">
        <a
            class="btn-flat btn-actions-item"
            @click.prevent="toggle"
            href="#"
        >
            <i class="material-icons">more_vert</i>
        </a>
    
        <ul
            v-if="open"
            class="context-menu"
            :style="{display: open ? 'block' : 'none'}"
        >
            <li
                class="collection-item"
                :class="{'avatar': it.avatar,'actionable':!!it.action}"
                v-for="(it, i) in getItems"
                :key="i"
                @click.prevent="run(it)"
            >
                <img v-if="it.avatar" :src="it.avatar.path" alt="" class="circle" />
                <span>{{ it.label }}</span>
                <div v-if="(it.lines.length>0)" >
                        <div v-for="(line,index) in it.lines"
                            :key="index">
                            <span>{{ line }}</span><br>
                        </div>
                </div>
                <i v-if="it.icon && (it.icon.type=='icon')" class="material-symbols-outlined" :class="{'left':it.icon.position=='left','right':it.icon.position=='right'}">
                    {{ it.icon.name }}
                </i>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        name: 'ContextMenu',

        props: {
            items: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
            open: false
            }
        },
        computed:{
            getItems(){
                const itms=[...(this.items??[])]
                let res=[];
                itms.forEach(i=>{
                    res.push(this.normalize(i))
                })
                return itms
            }
        },

        mounted() {
            document.addEventListener('click', this.handleOutside)
        },

        beforeUnmount() {
            document.removeEventListener('click', this.handleOutside)
        },

        methods: {
            normalize(it){
                it.avatar=it.avatar??false
                it.lines=it.lines??[];
                it.icon=it.icon??{}
                it.icon.type=it.icon?.type??'icon'
                it.icon.position=it.icon.position??'left'
                it.action=it.action??true
                return it;
            },
            toggle() {
                this.open = !this.open
            },
            close() {
                this.open = false
            },
            run(item) {
                this.close()
                if (typeof item.action === 'function') {
                    item.action()
                }
            },
            handleOutside(e) {
                if (!this.$refs.root?.contains(e.target)) {
                    this.close()
                }
            }
        }
    }
</script>
<style scoped>
    .ghost-actions {
        position: relative;
        display: inline-block;
    }

    .context-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: #fff;
        min-width: 180px;
        border-radius: 8px;
        box-shadow: 0 6px 18px rgba(0,0,0,.15);
        z-index: 1000;
        padding: 6px 0;
    }

    .context-menu li a {
        display: block;
        padding: 8px 16px;
        color: #212529;
        text-decoration: none;
    }

    .context-menu li a:hover {
        background: rgba(0,0,0,.05);
    }
    .context-menu li{
        display: block;
        padding: 8px 16px;
        color: #212529
    }
    .context-menu  li.actionable:hover {
        box-shadow: 0 4px 10px #0e0e0e;
        cursor: pointer;
        background: rgba(0,0,0,.05);
        /* box-shadow: 0 4px 10px #e2e0e0; */
    }
    .btn-actions-item{
        padding: 0;
        background: #0e0e0e0d;
        margin-right: 10px;
    }
    .btn-actions-item:hover{
        background: #0e0e0e1d;
        box-shadow: 0 4px 10px #0e0e0e1d;
    }
    .context-menu .collection-item.actionable{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .context-menu .collection-item.actionable:hover{
        background: #e0e0e07a;
    }

</style>