<script setup>
import { onMounted, ref, watch } from 'vue';
import { useMappingStore } from '../../../stores/mappings';

const mappingStore = useMappingStore();

const localFormData = ref({
    reference: '',
    milktype: '',
    calories: '',
    isModular: false
})
const caloricRange = ref([])

const addCondition = () => {
    if(localFormData.value.reference){
        mappingStore.addCondition(localFormData)
        mappingStore.addConditionDialog = false
    }
}

watch(() => mappingStore.addConditionDialog, (newVal, oldVal) => { //watch if the dialog was opened!
    if(newVal){
        if(mappingStore.addConditionSelectedMapping.mapping.isBreastMilk && mappingStore.useMilkTypes){
            localFormData.value.milktype = mappingStore.milktypes[0].milktypeName
            localFormData.value.reference = mappingStore.bmTypes[0].formtypeHL7Reference
            localFormData.value.calories = mappingStore.milktypes[0].milktypeCaloricRange[0]

            const milktype = mappingStore.milktypes.find(item => item.milktypeName === localFormData.value.milktype)
            if(milktype){
                caloricRange.value = milktype.milktypeCaloricRange
            }
        }
        else{
            localFormData.value.milktype = null
            localFormData.value.reference = mappingStore.addConditionSelectedMapping.mapping.isBreastMilk ? mappingStore.bmTypes[0].formtypeHL7Reference : mappingStore.products[0].formtypeHL7Reference
            localFormData.value.calories = ''
        }
    }
})

watch(() => localFormData.value.milktype, (newVal, oldVal) => {
    if(newVal && oldVal){
        const milktype = mappingStore.milktypes.find(item => item.milktypeName === newVal)
        if(milktype){
            caloricRange.value = milktype.milktypeCaloricRange
            localFormData.value.calories = milktype.milktypeCaloricRange[0]
        }
    }
})

</script>
<template>
    <v-dialog v-model="mappingStore.addConditionDialog" max-width="650" persistent>
        <v-card title="Set Mapping Condition">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-autocomplete
                    v-if="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk && mappingStore.useMilkTypes"
                    v-model="localFormData.milktype"
                    label="Milk Type"
                    item-value="milktypeName" 
                    item-title="milktypeName"
                    :items="mappingStore.milktypes"
                    variant="outlined"
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                ></v-autocomplete>
                <v-autocomplete
                    v-if="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk && mappingStore.useMilkTypes"
                    v-model="localFormData.calories"
                    label="Calorie"
                    :items="caloricRange"
                    variant="outlined"
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                ></v-autocomplete>
                <v-text-field v-else v-model="localFormData.calories" label="Caloric Range" variant="outlined"></v-text-field>
                <div v-if="mappingStore.addConditionSelectedMapping.mapping.type == 'Feed Base'">
                    <v-autocomplete
                        v-model="localFormData.reference"
                        :label="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk ? 'Base' : 'Product'"
                        item-value="formtypeHL7Reference"
                        item-title="formtypeHL7Reference"
                        :items="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk ? mappingStore.bmTypes : mappingStore.products"
                        variant="outlined"
                        :rules="[v => !!v || 'This field is required']"
                        clearable
                    ></v-autocomplete>
                </div>
                <v-switch 
                    v-if="!mappingStore.addConditionSelectedMapping.mapping.isBreastMilk" 
                    v-model="localFormData.isModular"
                    color="primary"
                    inset 
                    :label="localFormData.isModular ? 'Modular' : 'Non Modular'">
                </v-switch>
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