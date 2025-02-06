<script setup>
    import { useMappingStore } from '../../../stores/mappings';
    const mappingStore = useMappingStore();

    const handleClose = () => {
        mappingStore.errorDialog = false
        setTimeout(() => {
            mappingStore.errors = []
        },500)
    }
</script>
<template>
    <v-dialog
        width="600"
        v-model="mappingStore.errorDialog"
        >
        <v-card title="Check for errors" class="px-5">
            <div v-for="err in mappingStore.errors">
                <v-alert
                    class="my-1"
                    density="compact"
                    variant="tonal" 
                    type="error" 
                    :title="err.title"
                    >
                    <div v-for="message in err.data">
                        {{ message }}
                    </div>
                </v-alert>
            </div>
            <template v-slot:actions>
            <v-btn @click="handleClose">
                Close
            </v-btn>
            </template>
      </v-card>
    </v-dialog>
</template>