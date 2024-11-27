import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import jsonData from "@/assets/mappings.json";
import { emptyMap, type CPOE, type MapType, type Conditions } from '@/interfaces/CPOE'

export const useMappingStore = defineStore ('mappings', () => {
    const mappings = ref<Array<CPOE>>(jsonData)
    const emptyMapping = ref<MapType>(emptyMap)
    const isSearching = ref(false)
    const searchTerm = ref('');
    const fileUploadDialog = ref(false)

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
    const removeConditionWithinAMapping = (mapping, conditionIndex) => {
        const index = mappings.value.findIndex(obj => obj.productReference === mapping.productReference)
        mappings.value[index].conditions.splice(conditionIndex, 1)
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

    const addFortifier = (data, c_index, mapping) => {
        const mappingIndex = mappings.value.findIndex(obj => obj.productReference === mapping.productReference);
        mappings.value[mappingIndex].conditions[c_index].FortifierKey.push(data)
    }

    const toggleFileUploadDialog = () => {
        fileUploadDialog.value = !fileUploadDialog.value
    }

    const removeFortifier = (mapping, c_index, index) => {
        const mappingIndex = mappings.value.findIndex(obj => obj.productReference === mapping.productReference);
        mappings.value[mappingIndex].conditions[c_index].FortifierKey.splice(index, 1)
    }

    return { searchTerm, 
        filteredMapping, 
        toggleSearch, 
        isSearching, 
        mappings, 
        setEmptyMapping, 
        removeMapping, 
        addCondition, 
        removeConditionWithinAMapping,
        fileUploadDialog,
        toggleFileUploadDialog,
        addFortifier,
        removeFortifier
    };
})