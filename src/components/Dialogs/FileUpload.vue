<script setup>
    import { useMappingStore } from '@/stores/mappings';
    const mappingStore = useMappingStore();
</script>
<template>
    <v-dialog
        v-model="mappingStore.fileUploadDialog"
        width="600"
        >
        <v-card
            prepend-icon="mdi-upload"
            text="Select your file (csv and xls files only)"
            title="File Upload"
        >
        <div class="mx-5">
            <v-file-input clearable label="File input" variant="outlined"></v-file-input>
        </div>
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="mappingStore.toggleFileUploadDialog">
            Close
          </v-btn>
          <v-btn @click="mappingStore.toggleFileUploadDialog" color="success">
            Save
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>