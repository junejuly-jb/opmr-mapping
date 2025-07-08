import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import { type CPOE, type Conditions } from '../interfaces/CPOE'
import { type Products } from '../interfaces/Products';
import { type Notification } from '../interfaces/Notification';
import { type Milktype } from '../interfaces/Milktype'
import OPMRServices from '../services/OPMRServices';

export const useMappingStore = defineStore ('mappings', () => {
    const mappings = ref<Array<CPOE>>([])
    const forRefMapping = ref<String>('')
    const products = ref<Array<Products>>([])
    const bmTypes = ref<Array<Products>>([])
    const searchTerm = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(5);
    const isUpdated = ref(false);
    const notifs = ref<Array<Notification>>([])
    const isSaving = ref(false)
    const unSavedChanges = ref(false);
    const milktypes = ref<Array<Milktype>>([])
    const useMilkTypes = ref(false)
    const errors = ref([]) //{ title, data: [message]}
    const appsettings = ref([])

    //Constant initialize empty mapping
    const emptyMap = ref<CPOE>({
        mappingId: -1,
        productReference: "",
        type: "",
        isBreastMilk: false,
        fortified: false,
        conditions: []
    });


    //Selection for updating, deletion and adding
    const updateSelectedCondition = ref({ mapping: emptyMap, conditionIndex: -1 })
    const deleteSelectedCondition = ref({ mapping: emptyMap, conditionIndex: -1})
    const deleteSelectedMapping = ref(0)
    const updateSelectedFortifierKey = ref({mapping: emptyMap, c_index: -1, index: -1, data: null})
    const deleteSelectedFortifierKey = ref({mapping: emptyMap, c_index: -1, index: -1})
    const addConditionSelectedMapping = ref({ mapping: emptyMap })

    //Dialogs
    const fileUploadDialog = ref(false)
    const confirmationDialog = ref(false)
    const confirmationDialogText = ref(
        { 
            type:'', 
            //(save-mapping) - confirmation to save mapping
            //(update-condition-in-use) - alert use that condition is in use
            //(delete-condition-in-use) - alert use that condition is in use
            //(delete-mapping-in-use) - alert use that mapping is in use
            //(confirmation-merge-overwrite) - confirmation to merge/overwrite when loading mappings
            //(update-fortifier-in-use) - alert use that fortifier is in use
            //(delete-fortifier-in-use) - alert use that fortifier is in use
            title: '', 
            text: ''
        }
    )
    const updateConditionDialog = ref(false)
    const updateFortifierDialog = ref(false)
    const addConditionDialog = ref(false)
    const errorDialog = ref(false)

    //functions
    const getProductDID = (productName) => {
        const result = products.value.find(product => product.formtypeHL7Reference === productName);
        if(result){
            return Number(result.formtypeID)
        } else {
            return null;
        }
    }

    const duplicateMapping = (data, i) => {
        const newMapping:CPOE = JSON.parse(JSON.stringify(data))
        newMapping.mappingId = generateId()
        newMapping.productReference = ''
        //update in use if in use is true
        if(newMapping.conditions && newMapping.conditions.length != 0){
            newMapping.conditions.forEach((item) => { item.isUsed = false })
        }
        const toInsertIndex = i + 1
        mappings.value.splice(toInsertIndex, 0, newMapping)
    }

    const generateId = () => {
        if(mappings.value.length > 0){
            var largestID = mappings.value.reduce((max, item) => {
                return Number(item.mappingId) > max ? item.mappingId : max;
            }, 0);
            return largestID + 1
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
                forRefMapping.value = JSON.stringify(data.data.data)
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
                bmTypes.value = data.data.bmType
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

    const getMilktypes = async () => {
        try {
            const data = await OPMRServices.getMilktypes();
            if(data.data.success){
                useMilkTypes.value = data.data.useMilktype
                if(data.data.useMilktype){
                    data.data.milktypes.forEach(element => {
                        const start = Number(element.start);
                        const end = Number(element.end);
                        if (!isNaN(start) && !isNaN(end)) {
                            const milktype: Milktype = {
                                milktypeID: element.milktypeID,
                                milktypeName: element.milktypeName,
                                milktypeCaloricRange: Array.from({ length: end - start + 1 }, (_, i) => start + i),
                            };
                            milktypes.value.push(milktype)
                        }
                    });
                }
            }
            else {
                addNotifs(Date.now(), 'Unable to retrieve Milk Types.', 'error')
            }
        } catch (error) {
            addNotifs(Date.now(), 'Unable to retrieve Milk Types.', 'error')
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

    const setConfirmationDialogText = (type, title, text) => {
        confirmationDialogText.value.type = type;
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

    const setEmptyMapping = (type, isBreastMilk) => { 
        const emptyMap = <CPOE>({
            mappingId: generateId(),
            type: type,
            productReference: '',
            isBreastMilk: isBreastMilk,
            conditions: []
        })
        mappings.value.unshift(emptyMap)
        currentPage.value = 1
    }
    const removeMapping = () => {
        const index = mappings.value.findIndex(obj => obj.mappingId === deleteSelectedMapping.value);
        mappings.value.splice(index, 1)
    }
    const removeConditionWithinAMapping = () => {
        const index = mappings.value.findIndex(obj => obj.mappingId === deleteSelectedCondition.value.mapping.mappingId)
        mappings.value[index].conditions.splice(deleteSelectedCondition.value.conditionIndex, 1)
    }
    const addCondition = (data) => {
        const index = mappings.value.findIndex(obj => obj.mappingId === addConditionSelectedMapping.value.mapping.mappingId)
        const condition:Conditions = {
            calories: serializeCalories(data.value.calories),
            reference: mappings.value[index].type == 'Feed Base' ? data.value.reference : '',
            referenceDID: getProductDID(data.value.reference),
            isUsed: false,
            user: { userID: null, userFirstName: '', userLastName: '' },
            isModular: data.value.isModular,
            lastUpdate: null,
            milktype: data.value.milktype,
            FortifierKey: []
        }
        mappings.value[index].conditions.push(condition)
    }

    const addFortifier = (data, c_index, mapping) => {
        if(data.fortifierKey){
            const mappingIndex = mappings.value.findIndex(obj => obj.mappingId === mapping.mappingId);
            data.fortifierKeyDID = getProductDID(data.fortifierKey)
            mappings.value[mappingIndex].conditions[c_index].FortifierKey.push(data)
        }
    }

    const toggleFileUploadDialog = () => {
        fileUploadDialog.value = !fileUploadDialog.value
    }

    const removeFortifier = () => {
        const mappingIndex = mappings.value.findIndex(obj => obj.mappingId === deleteSelectedFortifierKey.value.mapping.mappingId);
        mappings.value[mappingIndex].conditions[deleteSelectedFortifierKey.value.c_index].FortifierKey.splice(deleteSelectedFortifierKey.value.index, 1)
    }

    const updateCondition = (user, data) => {

        //get mapping and condition index
        const iMapping = mappings.value.findIndex(obj => obj.mappingId == updateSelectedCondition.value.mapping.mappingId);
        const iCondition = updateSelectedCondition.value.conditionIndex
        
        //update
        mappings.value[iMapping].conditions[iCondition].reference = mappings.value[iMapping].type == 'Feed Base' ? data.value.reference : ''
        mappings.value[iMapping].conditions[iCondition].referenceDID = getProductDID(data.value.reference)
        mappings.value[iMapping].conditions[iCondition].calories = serializeCalories(data.value.calories)
        mappings.value[iMapping].conditions[iCondition].milktype = data.value.milktype
        mappings.value[iMapping].conditions[iCondition].isModular = data.value.isModular

        //update user if the status is isUsed
        if(mappings.value[iMapping].conditions[iCondition].isUsed){
            mappings.value[iMapping].conditions[iCondition].user.userID = user.userID
            mappings.value[iMapping].conditions[iCondition].user.userLastName = user.userLastName
            mappings.value[iMapping].conditions[iCondition].user.userFirstName = user.userFirstName
            mappings.value[iMapping].conditions[iCondition].lastUpdate = Date.now()
        }
    }

    const updateFortifierKey = (user) => {
        if(!updateSelectedFortifierKey.value.data.fortifierKey || updateSelectedFortifierKey.value.data.fortifierKey == ''){
            const mappingIndex = mappings.value.findIndex(obj => obj.mappingId === updateSelectedFortifierKey.value.mapping.mappingId);
            mappings.value[mappingIndex].conditions[updateSelectedFortifierKey.value.c_index].FortifierKey.splice(updateSelectedFortifierKey.value.index, 1)
        }
        else{
            const mappingIndex = mappings.value.findIndex(obj => obj.mappingId === updateSelectedFortifierKey.value.mapping.mappingId);
            mappings.value[mappingIndex].conditions[updateSelectedFortifierKey.value.c_index].FortifierKey[updateSelectedFortifierKey.value.index].fortifierKey = updateSelectedFortifierKey.value.data.fortifierKey
            mappings.value[mappingIndex].conditions[updateSelectedFortifierKey.value.c_index].FortifierKey[updateSelectedFortifierKey.value.index].fortifierKeyDID = getProductDID(updateSelectedFortifierKey.value.data.fortifierKey)
            mappings.value[mappingIndex].conditions[updateSelectedFortifierKey.value.c_index].FortifierKey[updateSelectedFortifierKey.value.index].calOzEnd = updateSelectedFortifierKey.value.data.calOzEnd
            mappings.value[mappingIndex].conditions[updateSelectedFortifierKey.value.c_index].FortifierKey[updateSelectedFortifierKey.value.index].modular = updateSelectedFortifierKey.value.data.modular
            if(mappings.value[mappingIndex].conditions[updateSelectedFortifierKey.value.c_index].isUsed){
                mappings.value[mappingIndex].conditions[updateSelectedFortifierKey.value.c_index].user.userID = user.userID
                mappings.value[mappingIndex].conditions[updateSelectedFortifierKey.value.c_index].user.userFirstName = user.userFirstName
                mappings.value[mappingIndex].conditions[updateSelectedFortifierKey.value.c_index].user.userLastName = user.userLastName
                mappings.value[mappingIndex].conditions[updateSelectedFortifierKey.value.c_index].lastUpdate = Date.now()
            }
        }
    }

    const serializeCalories = (cal) => {
        if(cal){
            const str = cal.toString()
            if(str.includes("-")){
                const arr = cal.split('-');
                const rangeArray = Array.from({ length: Number(arr[1]) - Number(arr[0]) + 1 }, (v, i) => Number(arr[0]) + i);
                return rangeArray;
            }
            else{
                return [str]
            }
        }
        else {
            return [];
        }
    }

    const getAppSettings = async () => {
        try {
            const data = await OPMRServices.getAppSettings();
            if(data.data.success){
                appsettings.value = data.data.settings
            }
            else {
                addNotifs(Date.now(), 'Unable to fetch app settings.', 'error')
            }
        } catch (error) {
            addNotifs(Date.now(), 'Unable to fetch app settings.', 'error')
        }
    }

    watch(searchTerm, (newValue, oldValue) => {
        currentPage.value = 1
    });

    watch(currentPage, (newValue, oldValue) => {
        localStorage.setItem('currentPage', newValue.toString())
    })

    watch(mappings, (newValue, oldValue) => {
        if(JSON.stringify(newValue) != forRefMapping.value){
            unSavedChanges.value = true
        } else {
            unSavedChanges.value = false
        }
        
    }, { deep: true })

    return { searchTerm, filteredMapping, mappings, setEmptyMapping, 
        removeMapping, addCondition, removeConditionWithinAMapping,
        fileUploadDialog, toggleFileUploadDialog, addFortifier,
        removeFortifier, totalPages,
        filteredPaginatedItems, currentPage, itemsPerPage, updateCondition, updateFortifierKey,
        isUpdated, checkForUnsavedMappings, confirmationDialog, confirmationDialogText, setConfirmationDialogText,
        toggleConfirmationDialog, setBulkMapping, mergeMappings, setCurrentPage, serializeCalories,
        getProducts, products, getMappings, notifs, removeNotifs, isSaving, toggleSaving, addNotifs, autoRemoveNotifs,
        unSavedChanges, duplicateMapping, updateConditionDialog, updateSelectedCondition, deleteSelectedCondition,
        deleteSelectedMapping, updateFortifierDialog, updateSelectedFortifierKey, getProductDID, deleteSelectedFortifierKey, bmTypes,
        getMilktypes, milktypes, useMilkTypes, addConditionSelectedMapping, addConditionDialog,
        errorDialog, errors, getAppSettings, appsettings
    };
})