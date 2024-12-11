<script setup>
import { ref } from 'vue';
import { useMappingStore } from '../../../stores/mappings';
import { mdiPlus } from '@mdi/js';

const mappingStore = useMappingStore();
const calories = ref('')
const reference = ref('WATER')

const addCondition = (isActive, mapping) => {
    const data = { calories: calories.value, reference: reference.value, parent: mapping.productReference}
    mappingStore.addCondition(data)
    isActive.value = false
    calories.value = ''
    reference.value = ''
}
defineProps({
  mapping: {
    type: Object,
    required: true,
  }
});
</script>
<template>
    <v-dialog max-width="550">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
            v-bind="activatorProps"
            :prepend-icon="mdiPlus"
            text="Condition"
            variant="plain"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Set Product Mapping">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-text-field v-model="calories" label="Caloric Range" variant="outlined"></v-text-field>
                <v-autocomplete
                v-model="reference"
                label="Product Reference"
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
                text="Save Condition"
                color="success"
                @click="addCondition(isActive, mapping)"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>