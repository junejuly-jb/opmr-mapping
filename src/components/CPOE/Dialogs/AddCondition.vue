<script setup>
import { onMounted, ref } from 'vue';
import { useMappingStore } from '../../../stores/mappings';

const mappingStore = useMappingStore();
const addCondition = () => {
    if(mappingStore.addConditionSelectedMapping.data.reference){
        mappingStore.addCondition()
        mappingStore.addConditionDialog = false
    }
}

</script>
<template>
    <v-dialog v-model="mappingStore.addConditionDialog" max-width="650" persistent>
        <v-card title="Set Mapping Condition">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-autocomplete
                    v-if="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk && mappingStore.useMilkTypes"
                    v-model="mappingStore.addConditionSelectedMapping.data.milkType"
                    label="Milk Type"
                    item-value="milktypeName" 
                    item-title="milktypeName"
                    :items="mappingStore.milktypes"
                    variant="outlined"
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                ></v-autocomplete>
                <v-autocomplete
                    v-if="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk && mappingStore.useMilkTypes"
                    v-model="mappingStore.addConditionSelectedMapping.data.calories"
                    label="Calorie"
                    :item-value="mappingStore.addConditionSelectedMapping.milktypeCaloricRange" 
                    :item-title="mappingStore.addConditionSelectedMapping.milktypeCaloricRange"
                    :items="mappingStore.addConditionSelectedMapping.milktypeCaloricRange"
                    variant="outlined"
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                ></v-autocomplete>
                <v-text-field v-else v-model="mappingStore.addConditionSelectedMapping.data.calories" label="Caloric Range" variant="outlined"></v-text-field>
                <div v-if="mappingStore.addConditionSelectedMapping.mapping.type == 'Feed Base'">
                    <v-autocomplete
                        v-model="mappingStore.addConditionSelectedMapping.data.reference"
                        :label="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk ? 'Base' : 'Product'"
                        item-value="formtypeHL7Reference" 
                        item-title="formtypeHL7Reference"
                        :items="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk ? mappingStore.bmTypes : mappingStore.products"
                        variant="outlined"
                        :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                        :rules="[v => !!v || 'This field is required']"
                        clearable
                    ></v-autocomplete>
                </div>
                <v-switch v-if="!mappingStore.addConditionSelectedMapping.mapping.isBreastMilk" color="primary" v-model="mappingStore.addConditionSelectedMapping.data.isModular" inset :label="mappingStore.addConditionSelectedMapping.data.isModular ? 'Modular' : 'Non Modular'"></v-switch>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                text="Close"
                @click="mappingStore.addConditionDialog = false"
                ></v-btn>
                <v-btn
                text="Add Condition"
                color="success"
                @click="addCondition"
                ></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>