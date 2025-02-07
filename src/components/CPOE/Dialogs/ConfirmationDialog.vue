<script setup>
import { useMappingStore } from '../../../stores/mappings';
import OPMRServices from '../../../services/OPMRServices'
import { ref } from 'vue';
const emit = defineEmits(['notify'])
const mappingStore = useMappingStore()

const props = defineProps({
    sampleMappings: {
        type: Array,
        required: true,
    },
})

const errors = ref([]);

const handleOverwrite = () => {
    try {
        mappingStore.setBulkMapping(props.sampleMappings)
        mappingStore.toggleConfirmationDialog(false)
        mappingStore.toggleFileUploadDialog()
        mappingStore.setCurrentPage(1)
        emit('notify')
        mappingStore.setConfirmationDialogText('','','')
    } catch (error) {
        console.log(error)
    }
    
}
const handleMerge = () => {
    try {
        const duplicates = checkDuplicates(mappingStore.mappings, props.sampleMappings)
        if(duplicates.length < 0){
            mappingStore.mergeMappings(props.sampleMappings)
            mappingStore.toggleConfirmationDialog(false)
            mappingStore.toggleFileUploadDialog()
            mappingStore.setCurrentPage(1)
            emit('notify')
            mappingStore.setConfirmationDialogText('','','')
        }
        else{
            duplicates.forEach(element => {
                errors.value.push(element.productReference)
            });
        }
    } catch (error) {
        console.log(error)
    }
}

const checkDuplicates = (arr1, arr2) => {
    const set1 = new Set(arr1.map(item => JSON.stringify({ productReference: item.productReference, type: item.type })));
    return arr2.filter(item => set1.has(JSON.stringify({ productReference: item.productReference, type: item.type })));
};

const handleClose = () => {
    mappingStore.toggleConfirmationDialog(false)
    
    setTimeout(() => { 
        mappingStore.setConfirmationDialogText('','','')
        errors.value = []
    },500)
}

const handleSave = async () => {
    mappingStore.toggleSaving()
    try {
        var data = { data: mappingStore.mappings }
        const result = await OPMRServices.saveMapping(JSON.stringify(data));
        setTimeout(() => {
            mappingStore.toggleSaving()
            mappingStore.toggleConfirmationDialog(false)
            mappingStore.setConfirmationDialogText('','','')
            const id = Date.now()
            if(result.data.success){
                mappingStore.addNotifs(id, 'OPMR mapping rules saved successfully.', 'success')
                mappingStore.autoRemoveNotifs(id)
                mappingStore.unSavedChanges = false
            } else {
                mappingStore.addNotifs(id, 'Unable to save mapping rules.', 'error')
                mappingStore.autoRemoveNotifs(id)
            }
        }, 1000)
    } catch (error) {
        setTimeout(() => {
            mappingStore.toggleSaving()
            const id = Date.now()
            mappingStore.addNotifs(id, 'Unable to save mapping rules.', 'error')
            mappingStore.autoRemoveNotifs(id)
        }, 1000)
    }
}

const handleUpdateCondition = () => {
    mappingStore.toggleConfirmationDialog(false)
    setTimeout(() => { mappingStore.setConfirmationDialogText('','','') },500)
    mappingStore.updateConditionDialog = true
}

const handleDeleteCondition = () => {
    mappingStore.toggleConfirmationDialog(false)
    setTimeout(() => { mappingStore.setConfirmationDialogText('','','') },500)
    mappingStore.removeConditionWithinAMapping()
}

const handleDeleteMapping = () => {
    mappingStore.toggleConfirmationDialog(false)
    setTimeout(() => { mappingStore.setConfirmationDialogText('','','') },500)
    mappingStore.removeMapping()
}

const handleUpdateFortifier = () => {
    mappingStore.toggleConfirmationDialog(false)
    setTimeout(() => { mappingStore.setConfirmationDialogText('','','') },500)
    mappingStore.updateFortifierDialog = true
}

const handleDeleteFortifier = () => {
    mappingStore.toggleConfirmationDialog(false)
    setTimeout(() => { mappingStore.setConfirmationDialogText('','','') },500)
    mappingStore.removeFortifier()
}

</script>
<template>
    <v-dialog
        width="400"
        v-model="mappingStore.confirmationDialog"
        >
        
        <v-card
            :loading="mappingStore.isSaving"
            :text="mappingStore.confirmationDialogText.text"
            :title="mappingStore.confirmationDialogText.title"
        >
        <v-card-text v-if="errors.length > 0">
            Duplicate mapping detected:
            <v-alert variant="tonal" density="compact" color="error">
                <div v-for="error in errors">{{ error }}</div>
            </v-alert>
        </v-card-text>
        <template v-if="mappingStore.confirmationDialogText.type === 'confirmation-merge-overwrite'" v-slot:actions>
          <v-btn @click="handleClose">
            Close
          </v-btn>
          <v-btn @click="handleOverwrite" color="success">
            Overwrite
          </v-btn>
          <v-btn @click="handleMerge" color="success">
            Merge
          </v-btn>
        </template>
        <template v-else-if="mappingStore.confirmationDialogText.type === 'update-condition-in-use'" v-slot:actions>
            <v-btn @click="handleClose">
                Cancel
            </v-btn>
            <v-btn @click="handleUpdateCondition" color="success">
                Update anyway
            </v-btn>
        </template>
        <template v-else-if="mappingStore.confirmationDialogText.type === 'delete-condition-in-use'" v-slot:actions>
            <v-btn @click="handleClose">
                Cancel
            </v-btn>
            <v-btn @click="handleDeleteCondition" color="error">
                Delete anyway
            </v-btn>
        </template>
        <template v-else-if="mappingStore.confirmationDialogText.type === 'delete-mapping-in-use'" v-slot:actions>
            <v-btn @click="handleClose">
                Cancel
            </v-btn>
            <v-btn @click="handleDeleteMapping" color="error">
                Delete anyway
            </v-btn>
        </template>
        <template v-else-if="mappingStore.confirmationDialogText.type === 'update-fortifier-in-use'" v-slot:actions>
            <v-btn @click="handleClose">
                Cancel
            </v-btn>
            <v-btn @click="handleUpdateFortifier" color="success">
                Update anyway
            </v-btn>
        </template>
        <template v-else-if="mappingStore.confirmationDialogText.type === 'delete-fortifier-in-use'" v-slot:actions>
            <v-btn @click="handleClose">
                Cancel
            </v-btn>
            <v-btn @click="handleDeleteFortifier" color="error">
                Delete Anyway
            </v-btn>
        </template>
        <template v-else v-slot:actions> 
          <v-btn @click="handleClose">
            Cancel
          </v-btn>
          <v-btn @click="handleSave" color="success">
            Save
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>