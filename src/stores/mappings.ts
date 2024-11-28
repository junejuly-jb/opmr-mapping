import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import jsonData from "@/assets/mappings.json";
import { type CPOE, type MapType, type Conditions } from '@/interfaces/CPOE'

export const useMappingStore = defineStore ('mappings', () => {
    const mappings = ref<Array<CPOE>>(jsonData)
    const searchTerm = ref('');
    const fileUploadDialog = ref(false)
    const currentPage = ref(1);
    const itemsPerPage = ref(5);

    //functions
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

    const totalPages = computed(() => {
        return Math.ceil(mappings.value.length / itemsPerPage.value);
    })

    const filteredPaginatedItems = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        return filteredMapping.value.slice(start, end);
    })

    const setEmptyMapping = () => { 
        const emptyMap = <CPOE>({
            productReference: '',
            conditions: []
        })
        mappings.value.unshift(emptyMap)
    }
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

    watch(searchTerm, (newValue, oldValue) => {
        currentPage.value = 1
    });

    return { searchTerm, 
        filteredMapping,
        mappings, 
        setEmptyMapping, 
        removeMapping, 
        addCondition, 
        removeConditionWithinAMapping,
        fileUploadDialog,
        toggleFileUploadDialog,
        addFortifier,
        removeFortifier,
        totalPages,
        filteredPaginatedItems, currentPage, itemsPerPage
    };
})