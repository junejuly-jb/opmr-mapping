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
const cals = ref(null);
const hasFirstCondition = ref(false);

const addCondition = async () => {
    const isValidCals = await cals.value?.validate?.();

    if(localFormData.value.reference && isValidCals.length <=0 ){
        mappingStore.addCondition(localFormData)
        mappingStore.addConditionDialog = false
    }
}

const isValidItem = (item) => {
  const singleNumber = /^\d+$/ 
  const validRange = /^(\d+)-(\d+)$/

  const min = caloricRange.value[0]
  const max = caloricRange.value[caloricRange.value.length - 1]


  if (singleNumber.test(item)) {
    const value = Number(item)
    return value >= min && value <= max
  }

  const rangeMatch = item.match(validRange)
  if (rangeMatch) {
    const start = Number(rangeMatch[1])
    const end = Number(rangeMatch[2])
    return start < end && start >= min && end <= max
  }

  return false
}

const validateRangeOrNumber = (value) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return true
  const values = Array.isArray(value) ? value : [value]

  for (const v of values) {
    if (!isValidItem(v)) {
      return `Only whole numbers or valid ranges within ${caloricRange.value[0]}-${caloricRange.value[caloricRange.value.length-1]} are allowed`
    }
  }

  return true
}

const validateCaloricRangeForNonMilkTypes = (value) => {
  if (!mappingStore.appsettings.donor_allow_feed_orders_with_custom_cal_oz) {
    return true;
  }

  const trimmed = String(value).trim();

  if (/^\d+$/.test(trimmed)) {
    const numericValue = Number(trimmed);
    if (!mappingStore.appsettings.donor_cal_oz_options.includes(numericValue)) {
      return `Caloric value must be in range (e.g. [${mappingStore.appsettings.donor_cal_oz_options[0]} ... ${mappingStore.appsettings.donor_cal_oz_options[mappingStore.appsettings.donor_cal_oz_options.length - 1]}])`;
    }
    return true;
  }

  if (/^\d+\s*-\s*\d+$/.test(trimmed)) {
    const [start, end] = trimmed.split('-').map(Number);
    
    if (start > end) return 'Invalid range: start calorie is greater than end.';

    for (let i = start; i <= end; i++) {
      if (!mappingStore.appsettings.donor_cal_oz_options.includes(i)) {
        return `All values in the range must be in: [${mappingStore.appsettings.donor_cal_oz_options[0]} ... ${mappingStore.appsettings.donor_cal_oz_options[mappingStore.appsettings.donor_cal_oz_options.length - 1]}]`;
      }
    }
    return true;
  }

  return `Invalid input: must be a number or range (e.g. [${mappingStore.appsettings.donor_cal_oz_options[0]} ... ${mappingStore.appsettings.donor_cal_oz_options[mappingStore.appsettings.donor_cal_oz_options.length - 1]}]).`;
};

watch(() => mappingStore.addConditionDialog, (newVal, oldVal) => { //watch if the dialog was opened!
    if(newVal){
        if(mappingStore.addConditionSelectedMapping.mapping.isBreastMilk && mappingStore.useMilkTypes){
            hasFirstCondition.value = mappingStore.addConditionSelectedMapping.mapping.conditions.length > 0 ? true : false;
            
            localFormData.value.milktype = mappingStore.addConditionSelectedMapping.mapping.conditions.length > 0 ? mappingStore.addConditionSelectedMapping.mapping.conditions[0].milktype : mappingStore.milktypes[0].milktypeName
            localFormData.value.reference = mappingStore.bmTypes[0].formtypeHL7Reference
            localFormData.value.calories = '';

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
                <v-select
                    v-if="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk && mappingStore.useMilkTypes"
                    v-model="localFormData.milktype"
                    label="Milk Type"
                    item-value="milktypeName" 
                    item-title="milktypeName"
                    :items="mappingStore.milktypes"
                    variant="outlined"
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                    :disabled="hasFirstCondition"
                ></v-select>
                <v-text-field
                    v-if="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk && mappingStore.useMilkTypes"
                    v-model="localFormData.calories"
                    label="Calorie"
                    variant="outlined"
                    :rules="mappingStore.addConditionSelectedMapping.mapping.fortified ? [] : [validateRangeOrNumber]"
                    ref="cals"
                ></v-text-field>
                <v-text-field
                    v-else
                    v-model="localFormData.calories"
                    label="Caloric Range" 
                    variant="outlined"
                    ref="cals"
                    :rules="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk && !mappingStore.addConditionSelectedMapping.mapping.fortified ? [validateCaloricRangeForNonMilkTypes] : []">
                </v-text-field>
                <div v-if="mappingStore.addConditionSelectedMapping.mapping.type == 'Feed Base'">
                    <v-select
                        v-model="localFormData.reference"
                        :label="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk ? 'Base' : 'Product'"
                        item-value="formtypeHL7Reference"
                        item-title="formtypeHL7Reference"
                        :items="mappingStore.addConditionSelectedMapping.mapping.isBreastMilk ? mappingStore.bmTypes : mappingStore.products"
                        variant="outlined"
                        :rules="[v => !!v || 'This field is required']"
                    ></v-select>
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