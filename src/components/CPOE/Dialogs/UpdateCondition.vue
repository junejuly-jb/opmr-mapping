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

    const handleUpdateCondition = () => {
        mappingStore.updateCondition()
        mappingStore.updateConditionDialog = false
    }

    const toggleUpdate = (mapping, condition, c_index) => {
        mappingStore.updateSelectedConditon.mapping = JSON.parse(JSON.stringify(mapping))
        mappingStore.updateSelectedConditon.updatedMapping = JSON.parse(JSON.stringify(condition))
        mappingStore.updateSelectedConditon.conditionIndex = c_index
        if(condition.calories.length == 0){
            mappingStore.updateSelectedConditon.updatedMapping.calories = ''
        }
        else if (condition.calories.length == 1) {
            mappingStore.updateSelectedConditon.updatedMapping.calories = condition.calories[0]
        }
        else {
            mappingStore.updateSelectedConditon.updatedMapping.calories = condition.calories[0] + '-' + condition.calories[condition.calories.length - 1]
        }

        if(!condition.isUsed){
            mappingStore.updateConditionDialog = true
        }else {
            mappingStore.setConfirmationDialogText('update-condition-in-use', 'Warning', 'The mapping you want to update is currently in use. Do you wish to continue?')
            mappingStore.confirmationDialog = true
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
    <v-btn @click="toggleUpdate(mapping, condition, c_index)" :prepend-icon="mdiPencil" color="primary" variant="tonal" size="small" rounded="xl">Update</v-btn>
    <v-dialog v-model:model-value="mappingStore.updateConditionDialog" max-width="650">
        <v-card title="Update Product Mapping">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-text-field v-model="mappingStore.updateSelectedConditon.updatedMapping.calories" label="Caloric Range" variant="outlined"></v-text-field>
                <div v-if="mapping.type == 'Feed Base'">
                    <v-autocomplete
                    v-model="mappingStore.updateSelectedConditon.updatedMapping.reference"
                    label="Product Reference"
                    item-value="formtypeHL7Reference" 
                    item-title="formtypeHL7Reference"
                    :items="mappingStore.products"
                    variant="outlined"
                    clearable
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                    ></v-autocomplete>
                </div>
                <v-switch color="primary" v-model="mappingStore.updateSelectedConditon.updatedMapping.isModular" inset :label="updatedCondition.isModular ? 'Modular' : 'Non Modular'"></v-switch>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                text="Close"
                @click="mappingStore.updateConditionDialog = false"
                ></v-btn>
                <v-btn
                text="Update Condition"
                color="success"
                @click="handleUpdateCondition"
                ></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>