<script setup>
import { useMappingStore } from '@/stores/mappings';
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
    } catch (error) {
        console.log(error)
    }
}
</script>
<template>
    <v-dialog
        width="400"
        v-model="mappingStore.confirmationDialog"
        >
        <v-card
            :text="mappingStore.confirmationDialogText.text"
            :title="mappingStore.confirmationDialog.title"
        >
        <template v-slot:actions>
          <v-btn @click="mappingStore.toggleConfirmationDialog(false)">
            Close
          </v-btn>
          <v-btn @click="handleOverwrite" color="success">
            Overwrite
          </v-btn>
          <v-btn @click="handleMerge" color="success">
            Merge
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>