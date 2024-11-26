import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import jsonData from "@/assets/mappings.json";
import { emptyMap, type CPOE, type MapType, type Conditions } from '@/interfaces/CPOE'
import FortifierKey from '@/components/FortifierKey.vue';

export const useMappingStore = defineStore ('mappings', () => {
    const mappings = ref<Array<CPOE>>(jsonData)
    const emptyMapping = ref<MapType>(emptyMap)
    const isSearching = ref(false)
    const searchTerm = ref('');

    //functions
    const setEmptyMapping = () => { mappings.value.push(emptyMapping.value)}
    const removeMapping = (productReference) => { 
        // const res = mappings.value.filter((mapping) =>
        //     mapping.productReference.includes(productReference)
        // );
        // if (res.length != 1) return;
        const index = mappings.value.findIndex(obj => obj.productReference === productReference);
        mappings.value.splice(index, 1)
    }
    const removeConditionWithinAMapping = (mappingIndex, conditionIndex) => {
        mappings.value[mappingIndex].conditions.splice(conditionIndex, 1)
    }
    const addCondition = (data) => {
        const index = mappings.value.findIndex(obj => obj.productReference === data.parent)
        const condition = {
            calories: data.calories,
            reference: data.reference,
            FortifierKey: []
        }
        mappings.value[index].conditions.push(condition)
    }
    const toggleSearch = () => { 
        isSearching.value = !isSearching.value 
        if (!isSearching.value) searchTerm.value = ''
    }
    const filteredMapping = computed(() => {
        if (!searchTerm.value) {
            return mappings.value; // Return all mappings if search is empty
        }
        return mappings.value.filter((mapping) =>
            mapping.productReference
                .toLowerCase()
                .includes(searchTerm.value.toLowerCase())
        );
    });

    return { searchTerm, 
        filteredMapping, 
        toggleSearch, 
        isSearching, 
        mappings, 
        setEmptyMapping, 
        removeMapping, 
        addCondition, 
        removeConditionWithinAMapping };
})