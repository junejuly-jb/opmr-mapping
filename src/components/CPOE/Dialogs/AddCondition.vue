<script setup>
import { computed, ref, watch } from 'vue';
import { useMappingStore } from '../../../stores/mappings';
import { mdiPlus } from '@mdi/js';

const props = defineProps({
  mapping: {
    type: Object,
    required: true,
  }
});

const mappingStore = useMappingStore();
const calories = ref('')
const reference = ref('')
const isModular = ref(false)
const isEmptyProductReference = ref(false);
const isEmptyReference = ref(false)
const milkType = ref('')
const caloricItem = ref([])

const addCondition = (isActive, mapping) => {
    const data = { calories: calories.value, reference: reference.value, isUsed: false, userId: null, isModular: isModular.value, parent: mapping.mappingId, milktype: milkType.value}
    if(mapping.type == 'Feed Base' && (data.reference == '' || !data.reference)){
        isEmptyReference.value = true
    }
    else{
        mappingStore.addCondition(data)
        isActive.value = false
        calories.value = ''
        reference.value = 'WATER'
        isModular.value = false
    }
}


watch(() => props.mapping.productReference,(newValue) => { 
        isEmptyProductReference.value = !newValue; 
    }, 
    { immediate: true });

watch(reference, () => {
    isEmptyReference.value = false
});

watch(() => props.mapping.isBreastMilk, (newValue) => {
    if(newValue) {
        reference.value = mappingStore.bmTypes[0].formtypeHL7Reference
    } else {
        reference.value = mappingStore.products[0].formtypeHL7Reference
    }
}, { immediate: true })

watch(milkType, (newValue) => {
    const milktype = mappingStore.milktypes.find(item => item.milktypeName === newValue);
    if(milktype && props.mapping.isBreastMilk){
        caloricItem.value = milktype.milktypeCaloricRange
        calories.value = milktype.milktypeCaloricRange[0]
    }
    else {
        calories.value = ''
    }
}, {immediate: true})

const isMetWithCondition = computed(() => { //check if breastmilk is true and has only 1 condition.
    return props.mapping.isBreastMilk === true && 
        Array.isArray(props.mapping.conditions) && 
        props.mapping.conditions.length > 0
})

</script>
<template>
    <v-dialog max-width="650" persistent>
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
            v-if="!isMetWithCondition"
            v-bind="activatorProps"
            :prepend-icon="mdiPlus"
            text="Condition"
            variant="plain"
            :disabled="isEmptyProductReference"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Set Mapping Condition">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-autocomplete
                    v-if="mappingStore.useMilkTypes && props.mapping.isBreastMilk"
                    v-model="milkType"
                    label="Milk Type"
                    item-value="milktypeName" 
                    item-title="milktypeName"
                    :items="mappingStore.milktypes"
                    variant="outlined"
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                    clearable
                ></v-autocomplete>
                <v-autocomplete
                    v-if="mappingStore.useMilkTypes && props.mapping.isBreastMilk"
                    v-model="calories"
                    label="Calorie"
                    item-value="caloricItem" 
                    item-title="caloricItem"
                    :items="caloricItem"
                    variant="outlined"
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                    clearable
                ></v-autocomplete>
                <v-text-field v-else v-model="calories" label="Caloric Range" variant="outlined"></v-text-field>
                <div v-if="mapping.type == 'Feed Base'">
                    <v-autocomplete
                        v-model="reference"
                        label="Product"
                        item-value="formtypeHL7Reference" 
                        item-title="formtypeHL7Reference"
                        :items="props.mapping.isBreastMilk ? mappingStore.bmTypes : mappingStore.products"
                        variant="outlined"
                        :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                        clearable
                    ></v-autocomplete>
                </div>
                <v-switch v-if="!props.mapping.isBreastMilk" color="primary" v-model="isModular" inset :label="isModular ? 'Modular' : 'Non Modular'"></v-switch>
                <v-alert
                    v-if="isEmptyReference"
                    text="Product field is required."
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
                text="Add Condition"
                color="success"
                @click="addCondition(isActive, mapping)"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>