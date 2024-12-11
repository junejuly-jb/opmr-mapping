<script setup lang="ts">
    import { ref } from 'vue';
    import { FortifierKey } from '../../../interfaces/CPOE'
    import { useMappingStore } from '../../../stores/mappings';
    import { mdiPencil } from '@mdi/js';

    const mappingStore = useMappingStore();
    
    const updateFortifier = (isActive) => {
        mappingStore.updateFortifierKey(props.mapping, props.c_index, props.index, fortifier.value)
        isActive.value = false
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
        }
    });

    const fortifier = ref<FortifierKey>({
        fortifierKey: props.fortifierkey.fortifierKey,
        calOzStart: props.fortifierkey.calOzStart,
        calOzEnd: props.fortifierkey.calOzEnd,
        modular: props.fortifierkey.modular,
        isModular: props.fortifierkey.isModular
    });

</script>
<template>
    <v-dialog max-width="650">
        <template v-slot:activator="{ props: activatorProps }">
            <v-list-item v-bind="activatorProps">
                <v-list-item-title><v-icon :icon="mdiPencil"></v-icon><span class="spacer"></span><span class="spacer"></span>Update</v-list-item-title>
            </v-list-item>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Update Fortifier Key">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-autocomplete
                    v-model="fortifier.fortifierKey"
                    label="Fortifier Key"
                    item-value="formtypeHL7Reference" 
                    item-title="formtypeHL7Reference"
                    :items="mappingStore.products"
                    variant="outlined"
                    clearable
                ></v-autocomplete>
                <v-switch color="primary" v-model="fortifier.isModular" inset :label="fortifier.isModular ? 'Modular' : 'Non Modular'"></v-switch>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                text="Close"
                @click="isActive.value = false"
                ></v-btn>
                <v-btn
                text="Update"
                color="success"
                @click="updateFortifier(isActive)"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<style setup>
.spacer{
    padding: 0px 2px;
}
</style>