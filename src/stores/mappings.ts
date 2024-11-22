import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import jsonData from "@/assets/mappings.json";
import { emptyMap, type CPOE, type MapType } from '@/interfaces/CPOE'

export const useMappingStore = defineStore ('mappings', () => {
    const dialog = ref(false)
    const mappings = ref<Array<CPOE>>([])
    const emptyMapping = ref<MapType>(emptyMap)

    const toggleDialog = () => {
        dialog.value = !dialog.value
    }
    
    const getMappings = computed( () => mappings.value = jsonData);
    const setEmptyMapping = () => { mappings.value.push(emptyMapping.value)}
    const removeMapping = (i) => {
        mappings.value.splice(i, 1)
    }

    return { dialog, toggleDialog, mappings, getMappings, setEmptyMapping, removeMapping};
})