<template>
    <div>
        <div
            class="file-drop"
            @dragover.prevent
            @drop.prevent="handleDrop"
        >
            <input
                ref="fileInput"
                type="file"
                :accept="accept"
                @change="handleFileSelect"
                hidden
            />
        
            <div @click="$refs.fileInput.click()">
                Arrastra tu archivo aquí o haz clic
            </div>
        </div>
        <div class="content-info" v-if="nombreArcivoSelected">
            <span class="info-select">{{ nombreArcivoSelected }} <span title="Quitar archivo." class="btn-limpiar" @click="limpiar">X</span></span>
        </div>
    </div>
</template>
  
<script>
    export default {
        name: 'UiFileDrop',
    
        props: {
            accept: {
                type: String,
                default: '.gpx'
            }
        },
        data(){
            return{
                nombreArcivoSelected: null
            }
        },
        methods: {
            handleDrop(e) {
                const file = e.dataTransfer.files[0]
                if (file) this.processFile(file)
            },
        
            handleFileSelect(e) {
                const file = e.target.files[0]
                this.nombreArcivoSelected = file.name
                if (file) this.processFile(file)
            },
        
            processFile(file) {
                // validar extensión
                const allowed = this.accept.split(',').map(ext => ext.trim().toLowerCase())
                const fileExt = '.' + file.name.split('.').pop().toLowerCase()
        
                if (!allowed.includes(fileExt)) {
                alert(`Archivo no permitido. Solo: ${this.accept}`)
                return
                }
        
                const reader = new FileReader()
        
                reader.onload = (event) => {
                    this.$emit('loadedText', event.target.result)
                }
        
                reader.onerror = () => {
                    alert('Error leyendo archivo')
                }
                //this.$emit('loadedText',)
                reader.readAsText(file)
            },
            limpiar(){
                this.nombreArcivoSelected=null,
                this.$refs.fileInput.value = null;
                this.$emit('limpiar')
            },
        }
    }
</script>
  
<style scoped>
    .file-drop {
        border: 2px dashed #999;
        padding: 20px;
        text-align: center;
        cursor: pointer;
    }
    .file-drop:hover {
        border-color: #333;
    }
    .content-info{
        margin-top: 10px;
        /* text-align: center; */
        width: 100%;
        padding-bottom: 10px;
    }
    .content-info .info-select{
        /* background-color: #007bff;
        color: #fff; */
        padding: 5px 10px;
        border-radius: 5px;
        width: 100%;
    }
    .content-info .info-select .btn-limpiar{
        cursor: pointer;
        margin-left: 10px;
        font-weight: bold;
        color: #007bff;
        align-items: right;
    }
/* info-select
btn-limpiar */
</style>