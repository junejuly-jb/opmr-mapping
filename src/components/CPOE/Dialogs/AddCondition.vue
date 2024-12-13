<script setup>
import { ref } from 'vue';
import { useMappingStore } from '../../../stores/mappings';
import { mdiPlus } from '@mdi/js';

const mappingStore = useMappingStore();
const calories = ref('')
const reference = ref('WATER')
const isModular = ref(false)

const addCondition = (isActive, mapping) => {
    const data = { calories: calories.value, reference: reference.value, isUsed: false, userId: null, isModular: isModular, parent: mapping.mappingId}
    mappingStore.addCondition(data)
    isActive.value = false
    calories.value = ''
    reference.value = 'WATER'
    isModular.value = false
}
defineProps({
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
            text="Condition"
            variant="plain"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Set Product Mapping">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-text-field v-model="calories" label="Caloric Range" variant="outlined"></v-text-field>
                <div v-if="mapping.type == 'Feed Base'">
                    <v-autocomplete
                        v-model="reference"
                        label="Product Reference"
                        item-value="formtypeHL7Reference" 
                        item-title="formtypeHL7Reference"
                        :items="mappingStore.products"
                        variant="outlined"
                        :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                        clearable
                    ></v-autocomplete>
                </div>
                <v-switch color="primary" v-model="isModular" inset :label="isModular ? 'Modular' : 'Non Modular'"></v-switch>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                text="Close"
                @click="isActive.value = false"
                ></v-btn>
                <v-btn
                text="Add Condition"
                color="success"
                @click="addCondition(isActive, mapping)"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>