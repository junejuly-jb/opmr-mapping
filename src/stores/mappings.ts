import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import jsonData from "@/assets/mappings.json";
import { type CPOE, type Conditions } from '@/interfaces/CPOE'
import { type Products } from '@/interfaces/Products';
import OPMRServices from '@/services/OPMRServices';

export const useMappingStore = defineStore ('mappings', () => {
    const mappings = ref<Array<CPOE>>([])
    const products = ref<Array<Products>>([])
    const searchTerm = ref('');
    const fileUploadDialog = ref(false)
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const isUpdated = ref(false);
    const confirmationDialog = ref(false)
    const confirmationDialogText = ref({ title: '', text: ''})

    //functions
    const getMappings = async () => {
        const data = await OPMRServices.getMappings();
        if(data.data.success){
            mappings.value = data.data.data
        }
        setLocalStorage()
    }

    const getProducts = async () => {
        const data = await OPMRServices.getProducts();
        if(data.data.success){
            products.value = data.data.data
        }
    }
    const setCurrentPage = (val) => {
        currentPage.value = val
    }

    const setBulkMapping = (data) => {
        mappings.value = data
    }

    const mergeMappings = (data) => {
        mappings.value = [...mappings.value, ...data]
    }

    const setConfirmationDialogText = (title, text) => {
        confirmationDialogText.value.title = title;
        confirmationDialogText.value.text = text
    }

    const toggleConfirmationDialog = (val) => {
        confirmationDialog.value = val
    }

    const setLocalStorage = () => {
        var browserStorage = localStorage.getItem('currentPage')
        if(browserStorage){
            const page = parseInt(browserStorage)
            const length = Math.ceil(mappings.value.length / itemsPerPage.value)
            if(page > length){
                currentPage.value = 1
                localStorage.setItem('currentPage', '1')
            }
            else{
                currentPage.value = page
            }
        } else {
            localStorage.setItem('currentPage', '1')
            currentPage.value = 1
        }
    }

    const checkForUnsavedMappings = (val) => {
        isUpdated.value = val
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

    const totalPages = computed(() => {
        return Math.ceil(mappings.value.length / itemsPerPage.value);
    })

    const filteredPaginatedItems = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        const end = start + itemsPerPage.value;
        if(filteredMapping.value.length > 0){
            return filteredMapping.value.slice(start, end);
        }
    })

    const setEmptyMapping = () => { 
        const emptyMap = <CPOE>({
            productReference: '',
            conditions: []
        })
        mappings.value.unshift(emptyMap)
        currentPage.value = 1
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
            calories: serializeCalories(data.calories),
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

    const updateCondition = (mapping, data, c_index) => {
        const mappingIndex = mappings.value.findIndex(obj => obj.productReference === mapping.productReference);
        mappings.value[mappingIndex].conditions[c_index].reference = data.reference
        mappings.value[mappingIndex].conditions[c_index].calories = serializeCalories(data.calories)
    }

    const updateFortifierKey = (mapping, c_index, index, data) => {
        const mappingIndex = mappings.value.findIndex(obj => obj.productReference === mapping.productReference);
        mappings.value[mappingIndex].conditions[c_index].FortifierKey[index].fortifierKey = data.fortifierKey
        mappings.value[mappingIndex].conditions[c_index].FortifierKey[index].calOzEnd = data.calOzEnd
        mappings.value[mappingIndex].conditions[c_index].FortifierKey[index].modular = data.modular
    }

    const serializeCalories = (cal) => {
        if(!cal) return [];
        const arr = cal.split('-');
        if(arr.length == 1) return [arr[0]];
        const rangeArray = Array.from({ length: Number(arr[1]) - Number(arr[0]) + 1 }, (v, i) => Number(arr[0]) + i);
        return rangeArray
    }

    watch(searchTerm, (newValue, oldValue) => {
        currentPage.value = 1
    });

    watch(currentPage, (newValue, oldValue) => {
        localStorage.setItem('currentPage', newValue.toString())
    })

    return { searchTerm, filteredMapping, mappings, setEmptyMapping, 
        removeMapping, addCondition, removeConditionWithinAMapping,
        fileUploadDialog, toggleFileUploadDialog, addFortifier,
        removeFortifier, totalPages,
        filteredPaginatedItems, currentPage, itemsPerPage, updateCondition, updateFortifierKey,
        isUpdated, checkForUnsavedMappings, confirmationDialog, confirmationDialogText, setConfirmationDialogText,
        toggleConfirmationDialog, setBulkMapping, mergeMappings, setCurrentPage, serializeCalories,
        getProducts, products, getMappings
    };
})