import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import jsonData from "@/assets/mappings.json";
import { emptyMap, type CPOE, type MapType, type Conditions } from '@/interfaces/CPOE'

export const useMappingStore = defineStore ('mappings', () => {
    const mappings = ref<Array<CPOE>>([])
    const emptyMapping = ref<MapType>(emptyMap)
    const isSearching = ref(false)

    const getMappings = computed( () => mappings.value = jsonData);

    //functions
    const setEmptyMapping = () => { mappings.value.push(emptyMapping.value)}
    const removeMapping = (i) => { mappings.value.splice(i, 1) }
    const removeConditionWithinAMapping = (mappingIndex, conditionIndex) => {
        mappings.value[mappingIndex].conditions.splice(conditionIndex, 1)
    }
    const addCondition = (data, i) => {
        console.log(data)
        // const condition: Conditions = {
        //     calories: data.value.condition,
        //     reference: data.value.reference,
        //     FortifierKey: data.value.FortifierKey,
        //     CalOzStart: data.value.CalOzStart ?? null,
        //     CalOzEnd: data.value.CalOzEnd ?? null,
        //     Modular: data.value.Modular ?? null
        // }
        console.log()
        console.log(i)
    }
    const toggleSearch = () => {
        isSearching.value = !isSearching.value
    }

    return { toggleSearch, isSearching, mappings, getMappings, setEmptyMapping, removeMapping, addCondition, removeConditionWithinAMapping };
})