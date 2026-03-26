
<template>
    <v-select v-bind="$attrs" v-on="$listeners">
        <!-- slot por defecto -->
        <template #no-options="{ search, searching, loading }">
            <span class="grey-text">
                No hay coincidencias
                <span v-if="searching"> para "{{ search }}"</span>.
            </span>
        </template>
    
         <!-- 🔥 REENVÍO DE TODOS LOS DEMÁS SLOTS -->
        <template v-for="(_, slot) in $slots" #[slot]>
            <slot :name="slot" />
        </template>

        <template v-for="(_, slot) in $scopedSlots" #[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>
    </v-select>
  </template>
<script>
    import vSelect from 'vue-select';
    export default {
        name: 'BaseSelect',
        components: { vSelect },
        inheritAttrs: false
    };
</script>
