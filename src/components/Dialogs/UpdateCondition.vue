<script setup>
    import { ref } from 'vue';
    import { useMappingStore } from '@/stores/mappings';

    const mappingStore = useMappingStore();
    const updatedCondition = ref({
        calories: '',
        reference: ''
    })

    const updateCondition = (mapping, updatedCondition, c_index, isActive) => {
        mappingStore.updateCondition(mapping, updatedCondition, c_index)
        isActive.value = false
    }

    const toggleUpdate = (condition) => {
        updatedCondition.value.reference = condition.reference
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
    <v-dialog max-width="400">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn @click="toggleUpdate(condition)" v-bind="activatorProps" prepend-icon="mdi-pencil" color="primary" variant="tonal" size="small" rounded="xl">Update</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Update Product Mapping">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-text-field v-model="updatedCondition.calories" label="Calories" variant="outlined"></v-text-field>
                <v-text-field v-model="updatedCondition.reference" label="Product Reference" variant="outlined"></v-text-field>
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
                @click="updateCondition(mapping, updatedCondition, c_index, isActive)"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>