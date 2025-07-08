<script setup>
    import { inject, watch, ref } from 'vue';
    import { useMappingStore } from '../../../stores/mappings';

    const mappingStore = useMappingStore();
    const user = inject('authUser')

    const localFormData = ref({
        reference: '',
        milktype: '',
        calories: '',
        isModular: false
    })
    const caloricRange = ref([])
    const cals = ref(null);
    const hasFirstCondition = ref(false)

    const handleUpdateCondition = () => {
        //Feed base reference cannot be empty!
        if(mappingStore.updateSelectedCondition.mapping.type == 'Feed Base'){
            // check if reference is empty 
            if(localFormData.value.reference){
                mappingStore.updateCondition(user, localFormData)
                mappingStore.updateConditionDialog = false
            }
        }else { //else fortifier
            mappingStore.updateCondition(user, localFormData)
            mappingStore.updateConditionDialog = false
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

    watch(() => mappingStore.updateConditionDialog, (newVal, oldVal) => {
        if(newVal){
            hasFirstCondition.value = mappingStore.updateSelectedCondition.mapping.conditions.length > 1 ? true : false
            const index = mappingStore.updateSelectedCondition.conditionIndex
            localFormData.value.reference = mappingStore.updateSelectedCondition.mapping.conditions[index].reference
            localFormData.value.milktype = mappingStore.updateSelectedCondition.mapping.conditions[index].milktype
            localFormData.value.isModular = mappingStore.updateSelectedCondition.mapping.conditions[index].isModular
            if(mappingStore.updateSelectedCondition.mapping.conditions[index].calories.length == 0){
                localFormData.value.calories = ''
            } else if(mappingStore.updateSelectedCondition.mapping.conditions[index].calories.length == 1){
                localFormData.value.calories = mappingStore.updateSelectedCondition.mapping.conditions[index].calories[0]
            } else {
                localFormData.value.calories = mappingStore.updateSelectedCondition.mapping.conditions[index].calories[0] + '-' + mappingStore.updateSelectedCondition.mapping.conditions[index].calories[mappingStore.updateSelectedCondition.mapping.conditions[index].calories.length - 1]
            }

            if(mappingStore.useMilkTypes){
                const milktype = mappingStore.milktypes.find(item => item.milktypeName === localFormData.value.milktype)
                if(milktype){
                    caloricRange.value = milktype.milktypeCaloricRange
                }
            }
        }
    })

    watch(() => localFormData.value.milktype, (newVal, oldVal) => { //watch milktype if changed, apply caloric range on each selected milktype
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
    <v-dialog v-model:model-value="mappingStore.updateConditionDialog" max-width="650" persistent>
        <v-card title="Update Mapping Condition">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-autocomplete
                    v-if="mappingStore.updateSelectedCondition.mapping.isBreastMilk && mappingStore.useMilkTypes"
                    v-model="localFormData.milktype"
                    label="Milk Type"
                    item-value="milktypeName" 
                    item-title="milktypeName"
                    :items="mappingStore.milktypes"
                    variant="outlined"
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                    :disabled="hasFirstCondition"
                ></v-autocomplete>
                <v-text-field
                    v-if="mappingStore.updateSelectedCondition.mapping.isBreastMilk && mappingStore.useMilkTypes"
                    v-model="localFormData.calories"
                    label="Calorie"
                    variant="outlined"
                    :rules="mappingStore.updateSelectedCondition.mapping.fortified ? [] : [validateRangeOrNumber]"
                    ref="cals"
                ></v-text-field>
                <v-text-field v-else v-model="localFormData.calories" label="Caloric Range" variant="outlined"></v-text-field>
                <div v-if="mappingStore.updateSelectedCondition.mapping.type == 'Feed Base'">
                    <v-autocomplete
                    v-model="localFormData.reference"
                    label="Product Reference"
                    item-value="formtypeHL7Reference" 
                    item-title="formtypeHL7Reference"
                    :items="!mappingStore.updateSelectedCondition.mapping.isBreastMilk ? mappingStore.products : mappingStore.bmTypes"
                    variant="outlined"
                    clearable
                    :menu-props="{ top: true, offsetY: true, maxWidth:200 }"
                    :rules="[v => !!v || 'This field is required']"
                    ></v-autocomplete>
                </div>
                <v-switch 
                    v-model="localFormData.isModular"
                    v-if="!mappingStore.updateSelectedCondition.mapping.isBreastMilk"
                    color="primary" 
                    inset 
                    :label="localFormData.isModular ? 'Modular' : 'Non Modular'">
                </v-switch>
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