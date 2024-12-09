<script setup lang="ts">
    import { ref } from 'vue';
    import { FortifierKey } from '@/interfaces/CPOE'
    import { useMappingStore } from '@/stores/mappings';
    import { mdiPlus } from '@mdi/js';

    const mappingStore = useMappingStore();
    const fortifier = ref<FortifierKey>({
        fortifierKey: 'Enfamil Infant',
        calOzStart: null,
        calOzEnd: null,
        modular: null,
    });
    const addFortifier = (c_index, mapping, isActive) => {
        mappingStore.addFortifier(fortifier.value, c_index, mapping)
        fortifier.value = {
            fortifierKey: 'Enfamil Infant',
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
    <v-dialog max-width="600">
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
                <v-select
                v-model="fortifier.fortifierKey"
                label="Fortifier Key"
                :items="['Enfamil Infant', 'Enfamil Gentlease', 'Ketovie 3:1', 'Peptide', 'Alfamino Junior', 'Neosure PWD']"
                variant="outlined"
                ></v-select>
                <v-row>
                    <!-- <v-col cols="4">
                        <v-text-field v-model="fortifier.calOzStart" label="Cal/oz Start" variant="outlined"></v-text-field>
                    </v-col> -->
                    <v-col cols="6">
                        <v-text-field v-model="fortifier.calOzEnd" label="Fortifier Calorie" variant="outlined"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="fortifier.modular" label="Modular Volume" variant="outlined"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                text="Close"
                @click="isActive.value = false"
                ></v-btn>
                <v-btn
                text="Save"
                color="success"
                @click="addFortifier(c_index, mapping, isActive)"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>