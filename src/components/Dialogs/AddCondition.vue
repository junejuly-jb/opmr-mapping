<script setup>
import { ref } from 'vue';
import { useMappingStore } from '@/stores/mappings';
const mappingStore = useMappingStore();
const newCondition = ref({})
const calories = ref('')
const reference = ref('')

const serializeCalories = (cal) => {
    const arr = cal.split('-');
    return arr
}
const addCondition = (isActive, mapping) => {
    const data = { calories: serializeCalories(calories.value), reference: reference.value, parent: mapping.productReference}
    mappingStore.addCondition(data)
    isActive.value = false
}
defineProps({
  mapping: {
    type: Object,
    required: true,
  }
});
</script>
<template>
    <v-dialog max-width="400">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            text="Condition"
            variant="plain"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Set Product Mapping">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-text-field v-model="calories" label="Calories" variant="outlined"></v-text-field>
                <v-text-field v-model="reference" label="Product Reference" variant="outlined"></v-text-field>
                    <!-- <v-col cols="8" v-if="mapping.conditions.length != 0">
                        <v-row>
                            <v-col cols="6">
                                <v-select
                                label="Fortifier Key"
                                :items="['Enfamil Infant', 'Enfamil Gentlease', 'Ketovie 3:1', 'Peptide', 'Alfamino Junior', 'Neosure PWD']"
                                variant="outlined"
                                ></v-select>
                            </v-col>
                            <v-col cols="2">
                                <v-text-field v-model="newCondition.CalOzStart" label="Cal/oz Start" variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="2">
                                <v-text-field v-model="newCondition.CalOzEnd" label="Cal/oz End" variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="2">
                                <v-text-field v-model="newCondition.Modular" label="Modular" variant="outlined"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col> -->
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