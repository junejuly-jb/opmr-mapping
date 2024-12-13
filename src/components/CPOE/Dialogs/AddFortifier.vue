<script setup lang="ts">
    import { ref } from 'vue';
    import { FortifierKey } from '../../../interfaces/CPOE'
    import { useMappingStore } from '../../../stores/mappings';
    import { mdiPlus } from '@mdi/js';

    const mappingStore = useMappingStore();
    const fortifier = ref<FortifierKey>({
        fortifierKey: 'WATER',
        calOzStart: null,
        calOzEnd: null,
        modular: null,
    });
    const addFortifier = (c_index, mapping, isActive) => {
        mappingStore.addFortifier(fortifier.value, c_index, mapping)
        fortifier.value = {
            fortifierKey: 'Water',
            calOzStart: null,
            calOzEnd: null,
            modular: null,
        }
        isActive.value = false
    }
    defineProps({
        c_index: {
            type: Number,
            required: true,
        },
        mapping: {
            type: Object,
            required: true,
        }
    });
</script>
<template>
    <v-dialog max-width="650">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
            v-bind="activatorProps"
            :prepend-icon="mdiPlus"
            text="Fortifier"
            variant="tonal"
            color="primary"
            size="small" 
            rounded="xl"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Add Fortifier Key">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-autocomplete
                v-model="fortifier.fortifierKey"
                label="Fortifier Key"
                item-value="formtypeHL7Reference" 
                item-title="formtypeHL7Reference"
                :items="mappingStore.products"
                variant="outlined"
                clearable
                ></v-autocomplete>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                text="Close"
                @click="isActive.value = false"
                ></v-btn>
                <v-btn
                text="Add Fortifier"
                color="success"
                @click="addFortifier(c_index, mapping, isActive)"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>