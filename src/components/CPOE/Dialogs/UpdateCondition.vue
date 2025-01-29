<script setup>
    import { inject } from 'vue';
    import { useMappingStore } from '../../../stores/mappings';

    const mappingStore = useMappingStore();
    const user = inject('authUser')

    const handleUpdateCondition = () => {
        mappingStore.updateCondition(user)
        mappingStore.updateConditionDialog = false
    }
</script>
<template>
    <v-dialog v-model:model-value="mappingStore.updateConditionDialog" max-width="650" persistent>
        <v-card title="Update Product Mapping">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-text-field v-model="mappingStore.updateSelectedCondition.updatedMapping.calories" label="Caloric Range" variant="outlined"></v-text-field>
                <div v-if="mappingStore.updateSelectedCondition.mapping.type == 'Feed Base'">
                    <v-autocomplete
                    v-model="mappingStore.updateSelectedCondition.updatedMapping.reference"
                    label="Product Reference"
                    item-value="formtypeHL7Reference" 
                    item-title="formtypeHL7Reference"
                    :items="!mappingStore.updateSelectedCondition.mapping.isBreastMilk ? mappingStore.products : mappingStore.bmTypes"
                    variant="outlined"
                    clearable
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                    ></v-autocomplete>
                </div>
                <v-switch v-if="!mappingStore.updateSelectedCondition.mapping.isBreastMilk" color="primary" v-model="mappingStore.updateSelectedCondition.updatedMapping.isModular" inset :label="mappingStore.updateSelectedCondition.updatedMapping.isModular ? 'Modular' : 'Non Modular'"></v-switch>
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