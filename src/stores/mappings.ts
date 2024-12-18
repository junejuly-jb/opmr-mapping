import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { type CPOE, type Conditions } from '../interfaces/CPOE'
import { type Products } from '../interfaces/Products';
import { type Notification } from '../interfaces/Notification';
import OPMRServices from '../services/OPMRServices';

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
    const notifs = ref<Array<Notification>>([])
    const isSaving = ref(false)
    const unSavedChanges = ref([]);

    //functions
    const addUnsavedChanges = (id) => {
        const results = unSavedChanges.value.filter(mappingId => mappingId == id);
        if(results){
            unSavedChanges.value.push(id)
        }
    }
    const generateId = () => {
        if(mappings.value.length > 0){
            const lastMapping = mappings.value[mappings.value.length - 1]
            const lastId = Number(lastMapping.mappingId)
            return lastId + 1;
        }
        return 1;
    }
    const autoRemoveNotifs = (id) => {
        setTimeout(() => {
            removeNotifs(id)
        }, 3000)
    }
    const toggleSaving = () => {
        isSaving.value = !isSaving.value
    }
    const removeNotifs = (id) => {
        const index = notifs.value.findIndex((item) => item.id === id);
        notifs.value.splice(index, 1);
    }
    const addNotifs = (id, message, type) => {
        const alert = {id, message, type}
        notifs.value.push(alert)
    }
    const getMappings = async () => {
        try {
            const data = await OPMRServices.getMappings();
            if(data.data.success){
                mappings.value = data.data.data
                const id = Date.now()
                addNotifs(id, 'OPMR Mapping Rules fetched successfully.', 'success')
                setTimeout(() => {
                    removeNotifs(id)
                }, 4000);
            }
            else{
                addNotifs(Date.now(), 'Unable to retrieve OPMR Mappings.', 'error')
            }
        } catch (error) {
            addNotifs(Date.now(), 'Unable to retrieve OPMR Mappings.', 'error')
        }        
        setLocalStorage()
    }

    const getProducts = async () => {
        try {
            const data = await OPMRServices.getProducts();
            if(data.data.success){
                products.value = data.data.data
                const id = Date.now()
                addNotifs(id, 'Products loaded successfully.', 'success')
                setTimeout(() => {
                    removeNotifs(id)
                }, 4000);
            }
            else{
                addNotifs(Date.now(), 'Unable to retrieve product list.', 'error')
            }
        } catch (error) {
            addNotifs(Date.now(), 'Unable to retrieve product list.', 'error')
        }
        
    }
    const setCurrentPage = (val) => {
        currentPage.value = val
    }

    const setBulkMapping = (data) => {
        mappings.value = []
        data.forEach(item => {
            item.mappingId = generateId()
            mappings.value.push(item)
        })
        // mappings.value = data
    }

    const mergeMappings = (data) => {
        data.forEach(item => {
            item.mappingId = generateId()
            mappings.value.push(item)
        });
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

    const setEmptyMapping = (type) => { 
        const emptyMap = <CPOE>({
            mappingId: generateId(),
            type: type,
            productReference: '',
            conditions: []
        })
        mappings.value.unshift(emptyMap)
        currentPage.value = 1
        addUnsavedChanges(emptyMap.mappingId)
    }
    const removeMapping = (id) => {
        const index = mappings.value.findIndex(obj => obj.mappingId === id);
        mappings.value.splice(index, 1)
    }
    const removeConditionWithinAMapping = (mapping, conditionIndex) => {
        const index = mappings.value.findIndex(obj => obj.mappingId === mapping.mappingId)
        mappings.value[index].conditions.splice(conditionIndex, 1)
    }
    const addCondition = (data) => {
        const index = mappings.value.findIndex(obj => obj.mappingId === data.parent)
        const condition:Conditions = {
            calories: serializeCalories(data.calories),
            reference: mappings.value[index].type == 'Feed Base' ? data.reference : '',
            isUsed: data.isUsed,
            userId: data.userId,
            isModular: data.isModular,
            FortifierKey: []
        }
        mappings.value[index].conditions.push(condition)
    }

    const addFortifier = (data, c_index, mapping) => {
        const mappingIndex = mappings.value.findIndex(obj => obj.mappingId === mapping.mappingId);
        mappings.value[mappingIndex].conditions[c_index].FortifierKey.push(data)
    }

    const toggleFileUploadDialog = () => {
        fileUploadDialog.value = !fileUploadDialog.value
    }

    const removeFortifier = (mapping, c_index, index) => {
        const mappingIndex = mappings.value.findIndex(obj => obj.mappingId === mapping.mappingId);
        mappings.value[mappingIndex].conditions[c_index].FortifierKey.splice(index, 1)
    }

    const updateCondition = (mapping, data, c_index) => {
        const mappingIndex = mappings.value.findIndex(obj => obj.mappingId === mapping.mappingId);
        mappings.value[mappingIndex].conditions[c_index].reference = mappings.value[mappingIndex].type == 'Feed Base' ? data.reference : ''
        mappings.value[mappingIndex].conditions[c_index].calories = serializeCalories(data.calories)
        mappings.value[mappingIndex].conditions[c_index].isModular = data.isModular
    }

    const updateFortifierKey = (mapping, c_index, index, data) => {
        const mappingIndex = mappings.value.findIndex(obj => obj.mappingId === mapping.mappingId);
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
        getProducts, products, getMappings, notifs, removeNotifs, isSaving, toggleSaving, addNotifs, autoRemoveNotifs,
        unSavedChanges, addUnsavedChanges
    };
})