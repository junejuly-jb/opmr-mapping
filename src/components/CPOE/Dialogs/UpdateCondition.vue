<script setup>
    import { ref } from 'vue';
    import { useMappingStore } from '../../../stores/mappings';
    import { mdiPencil } from '@mdi/js';

    const mappingStore = useMappingStore();
    const updatedCondition = ref({
        calories: '',
        reference: '',
        isModular: false
    })

    const updateCondition = (mapping, updatedCondition, c_index, isActive) => {
        mappingStore.updateCondition(mapping, updatedCondition, c_index)
        isActive.value = false
    }

    const toggleUpdate = (condition) => {
        updatedCondition.value.reference = condition.reference
        updatedCondition.value.isModular = condition.isModular
        if(condition.calories.length == 0){
            updatedCondition.value.calories = ''
        }
        else if (condition.calories.length == 1) {
            updatedCondition.value.calories = condition.calories[0]
        }
        else {
            updatedCondition.value.calories = condition.calories[0] + '-' + condition.calories[condition.calories.length - 1]
        }
    }

    defineProps({
        condition: {
            type: Object,
            required: true
        },
        mapping: {
            type: Object,
            required: true
        },
        c_index: {
            type: Number,
            required: true
        }
    })
</script>
<template>
    <v-dialog max-width="650">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn @click="toggleUpdate(condition)" v-bind="activatorProps" :prepend-icon="mdiPencil" color="primary" variant="tonal" size="small" rounded="xl">Update</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Update Product Mapping">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-text-field v-model="updatedCondition.calories" label="Caloric Range" variant="outlined"></v-text-field>
                <div v-if="mapping.type == 'Feed Base'">
                    <v-autocomplete
                    v-model="updatedCondition.reference"
                    label="Product Reference"
                    item-value="formtypeHL7Reference" 
                    item-title="formtypeHL7Reference"
                    :items="mappingStore.products"
                    variant="outlined"
                    clearable
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                    ></v-autocomplete>
                </div>
                <v-switch color="primary" v-model="updatedCondition.isModular" inset :label="updatedCondition.isModular ? 'Modular' : 'Non Modular'"></v-switch>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                text="Close"
                @click="isActive.value = false"
                ></v-btn>
                <v-btn
                text="Update Condition"
                color="success"
                @click="updateCondition(mapping, updatedCondition, c_index, isActive)"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>