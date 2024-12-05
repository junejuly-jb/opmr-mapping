<script setup>
import { useMappingStore } from 'vue'
const mappingStore = useMappingStore();
</script>
<template>
    <v-dialog
        v-model="mappingStore.isUpdated"
        width="600"
        >
        <v-card
            prepend-icon="mdi-upload"
            text="Select your file (csv and xls files only)"
            title="File Upload"
        >
        TEST
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn>
            Close
          </v-btn>
          <v-btn color="success">
            Save
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>