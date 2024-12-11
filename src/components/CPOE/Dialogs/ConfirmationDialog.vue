<script setup>
import { useMappingStore } from '../../../stores/mappings';
import OPMRServices from '../../../services/OPMRServices'
const emit = defineEmits(['notify'])
const mappingStore = useMappingStore()

const props = defineProps({
    sampleMappings: {
        type: Array,
        required: true,
    },
})

const handleOverwrite = () => {
    try {
        mappingStore.setBulkMapping(props.sampleMappings)
        mappingStore.toggleConfirmationDialog(false)
        mappingStore.toggleFileUploadDialog()
        mappingStore.setCurrentPage(1)
        emit('notify')
        mappingStore.setConfirmationDialogText('','')
    } catch (error) {
        console.log(error)
    }
    
}
const handleMerge = () => {
    try {
        mappingStore.mergeMappings(props.sampleMappings)
        mappingStore.toggleConfirmationDialog(false)
        mappingStore.toggleFileUploadDialog()
        mappingStore.setCurrentPage(1)
        emit('notify')
        mappingStore.setConfirmationDialogText('','')
    } catch (error) {
        console.log(error)
    }
}

const handleClose = () => {
    mappingStore.toggleConfirmationDialog(false)
    setTimeout(() => { mappingStore.setConfirmationDialogText('','') },1000)
}

const handleSave = async () => {
    mappingStore.toggleSaving()
    try {
        var data = { data: mappingStore.mappings }
        const result = await OPMRServices.saveMapping(JSON.stringify(data));
        setTimeout(() => {
            mappingStore.toggleSaving()
            mappingStore.toggleConfirmationDialog(false)
            mappingStore.setConfirmationDialogText('','')
            const id = Date.now()
            if(result.data.success){
                mappingStore.addNotifs(id, 'OPMR mapping rules saved successfully.', 'success')
                mappingStore.autoRemoveNotifs(id)
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
        <template v-if="mappingStore.confirmationDialogText.title === 'Confirmation'" v-slot:actions>
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