<template>
    <div class="input-field" :class="clases">
        <!-- <label v-if="label" style="top:-25px;">{{label}}</label>
        <div class="row" style="bottom: 0" :class="{'invalid':!valido}">
            <div class="col s6">
                <InputDateBase
                    :value="obtenerValores?.inicio || null"
                    :readonly="readonly"
                    :disabled="disabled"
                    :placeholder="placeholderInicio"
                    @input="onInicio"
                    :removeIF="true"
                    :min="rango.min"
                    :max="value.fin"
                    :clases=" (!valido && !value.inicio)?'invalid':''"
                />
            </div>

            <div class="col s6">
                <InputDateBase
                    :value="obtenerValores?.fin || null"
                    :readonly="readonly"
                    :disabled="disabled"
                    :placeholder="placeholderFin"
                    @input="onFin"
                    :removeIF="true"
                    :min="value.inicio"
                    :max="rango.max"
                    :clases=" (!valido && !value.fin)?'invalid':''"
                />
            </div>
            <span v-if="!valido" class="helper-text red-text col s12">{{ error }}</span>
        </div> -->
        
    </div>
</template>
  
<script>
import InputDateBase from './InputDateBase.vue';
    export default {
        name: 'InputDateRangeBase',
        components: { InputDateBase },

        props: {
            value: {
                type: Object,
                default: () => ({ inicio: null, fin: null })
            },
            label: String,
            readonly: Boolean,
            disabled: Boolean,
            placeholderInicio: {
                type: String,
                default: 'Fecha inicio'
            },
            placeholderFin: {
                type: String,
                default: 'Fecha fin'
            },
            error: String,
            errorInicio:String,
            errorFin:String,
            clases:String,
            rango: {
                type: Object,
                default: () => ({ min: null, max: null })
            }
        },
        computed: {
            obtenerValores(){
                //console.log(this.value)
                return this.value??{inicio: null, fin: null};
            },
            valido() {
                // if (!this.error || (this.value.inicio && this.value.fin)) return true;
                if (this.error) return false;
                return true;
            }
        },
        methods: {
            emit(event, payload) {
                this.$emit(event, payload);
            },
            onInicio(val) {
                let next = { ...this.value, inicio: val };
                if (this.isInvalid(next)) {
                    next.inicio = this.value.fin;
                }
                // v-model
                this.$emit('input', next);
                // evento individual
                this.$emit('inicio-change', next.inicio);
                this.$emit('range-change', next); // opcional útil
                this.$emit('change', next);
            },
            onFin(val) {
                let next = { ...this.value, fin: val };
                if (this.isInvalid(next)) {
                    next.fin = this.value.inicio;
                };
                // v-model
                this.$emit('input', next);
                // evento individual
                this.$emit('fin-change', next.fin);
                this.$emit('range-change', next); // opcional útil
                this.$emit('change', next);
            },
            isInvalid({ inicio, fin }) {
                if (!inicio || !fin) return false;
                return new Date(inicio) > new Date(fin);
            }
        }
    };
</script>
<style>
    .helper-text{
        position: absolute !important;
        bottom: 10px;
    }
    .invalid input[clases="invalid"]{
        border-bottom: 2px solid #fb5858;
    }
</style>