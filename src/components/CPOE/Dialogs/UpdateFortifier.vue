<script setup lang="ts">
    import { ref } from 'vue';
    import { FortifierKey } from '../../../interfaces/CPOE'
    import { useMappingStore } from '../../../stores/mappings';
    import { mdiPencil } from '@mdi/js';

    const mappingStore = useMappingStore();
    
    const updateFortifier = () => {
        mappingStore.updateSelectedFortifierKey.c_index = props.c_index
        mappingStore.updateSelectedFortifierKey.mapping = JSON.parse(JSON.stringify(props.mapping))
        mappingStore.updateSelectedFortifierKey.index = props.index
        mappingStore.updateSelectedFortifierKey.data = JSON.parse(JSON.stringify(props.fortifierkey))
        if(props.condition.isUsed){
            mappingStore.setConfirmationDialogText('update-fortifier-in-use', 'Warning', 'The condition of the associated fortifier you selected is currently in use. Do you wish to continue?')
            mappingStore.confirmationDialog = true
        } else {
            mappingStore.updateFortifierDialog = true
        }
    }

    const handleUpdateFortifierKey = () => {
        mappingStore.updateFortifierKey()
        mappingStore.updateFortifierDialog = false
    }
    const props = defineProps({
        mapping: {
            type: Object,
            required: true
        },
        c_index: {
            type: Number,
            required: true
        },
        index:{
            type: Number,
            required: true
        },
        fortifierkey: {
            type: Object,
            required: true
        },
        condition: {
            type: Object,
            required: true
        }
    });

</script>
<template>
    <v-btn size="x-small" color="primary" variant="tonal" :icon="mdiPencil" @click="updateFortifier"></v-btn>
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