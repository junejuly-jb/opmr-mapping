<script setup lang="ts">
    import { ref, watch } from 'vue';
    import { FortifierKey } from '../../../interfaces/CPOE'
    import { useMappingStore } from '../../../stores/mappings';
    import { mdiPlus } from '@mdi/js';

    const mappingStore = useMappingStore();
    const fortifier = ref<FortifierKey>({
        fortifierKey: 'WATER',
        fortifierKeyDID: 0,
        calOzStart: null,
        calOzEnd: null,
        modular: null,
    });
    const errMessage = ref('')

    const addFortifier = (c_index, mapping, isActive) => {
        if(mapping.type === 'Fortifier'){ //if fortifier, check if the calozend is in range
            if(!fortifier.value.calOzEnd){ // if null, add the fortifier directly
                mappingStore.addFortifier(fortifier.value, c_index, mapping)
                fortifier.value = {
                    fortifierKey: 'Water',
                    fortifierKeyDID: null,
                    calOzStart: null,
                    calOzEnd: null,
                    modular: null,
                }
                errMessage.value = ''
                isActive.value = false
            }
            else{ //check the calozend
                if(mapping.conditions[c_index].calories.includes(Number(fortifier.value.calOzEnd))){ //check if calozend is in range
                mappingStore.addFortifier(fortifier.value, c_index, mapping)
                fortifier.value = {
                    fortifierKey: 'Water',
                    fortifierKeyDID: null,
                    calOzStart: null,
                    calOzEnd: null,
                    modular: null,
                }
                    errMessage.value = ''
                    isActive.value = false
                }
                else {
                    errMessage.value = 'Calorie not in range.'
                }
            }
        }
        else {
            mappingStore.addFortifier(fortifier.value, c_index, mapping)
            fortifier.value = {
                fortifierKey: 'Water',
                fortifierKeyDID: null,
                calOzStart: null,
                calOzEnd: null,
                modular: null,
            }
            errMessage.value = ''
            isActive.value = false
        }
        
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
            v-if="!mapping.isBreastMilk"
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
                <v-text-field v-if="mapping.type == 'Fortifier'" v-model="fortifier.calOzEnd" class="w-50" density="compact" label="Mix to Cal" variant="outlined" clearable/>
                <v-autocomplete
                v-model="fortifier.fortifierKey"
                label="Fortifier Key"
                item-value="formtypeHL7Reference" 
                item-title="formtypeHL7Reference"
                :items="mappingStore.products"
                variant="outlined"
                clearable
                ></v-autocomplete>
                <v-alert
                    v-if="errMessage != ''"
                    :text="errMessage"
                    type="error"
                    density="compact"
                    variant="tonal"
                ></v-alert>
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