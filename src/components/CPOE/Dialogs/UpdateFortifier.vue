<script setup lang="ts">
    import { inject } from 'vue';
import { useMappingStore } from '../../../stores/mappings';

    const mappingStore = useMappingStore();
    const user = inject('authUser');
    
    const handleUpdateFortifierKey = () => {
        mappingStore.updateFortifierKey(user)
        mappingStore.updateFortifierDialog = false
    }

</script>
<template>
    <v-dialog v-model:model-value="mappingStore.updateFortifierDialog" max-width="650">
        <v-card title="Update Fortifier Key">
        <v-spacer></v-spacer>
        <v-card-text>
            <v-autocomplete
                v-model="mappingStore.updateSelectedFortifierKey.data.fortifierKey"
                label="Fortifier Key"
                item-value="formtypeHL7Reference" 
                item-title="formtypeHL7Reference"
                :items="mappingStore.products"
                variant="outlined"
                clearable
            ></v-autocomplete>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            text="Close"
            @click="mappingStore.updateFortifierDialog = false"
            ></v-btn>
            <v-btn
            text="Update Fortifier"
            color="success"
            @click="handleUpdateFortifierKey"
            ></v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style setup>
.spacer{
    padding: 0px 2px;
}
</style>