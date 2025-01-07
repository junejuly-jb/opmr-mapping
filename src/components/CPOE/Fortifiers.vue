<script setup>
    import { useMappingStore } from '../../stores/mappings';
    import UpdateFortifier from './Dialogs/UpdateFortifier.vue';
    import { mdiPencil, mdiDelete } from '@mdi/js';

    const mappingStore = useMappingStore();

    const toggleUpdateFortifierDialog = () => {
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

    const props = defineProps({
        fortifierkey: {
            type: Object,
            required: true,
        },
        c_index: {
            type: Number,
            required: true,
        },
        mapping: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true
        },
        condition: {
            type: Object,
            required: true
        }
    });
</script>
<template>
    <div class="opmr__chips">
        <span>
            <v-btn size="x-small" color="primary" variant="tonal" :icon="mdiPencil" @click="toggleUpdateFortifierDialog"></v-btn>
            <v-btn class="mx-1" size="x-small" color="error" variant="tonal" :icon="mdiDelete" @click="mappingStore.removeFortifier(mapping, c_index, index)"></v-btn>
        </span>
        <span>
            <v-chip size="small" variant="outlined">{{fortifierkey.fortifierKey}}</v-chip>
        </span>
    </div>
</template>
<style scoped>
.opmr__chips{
    padding: 2px 0px;
}
.spacer{
    padding: 0px 2px;
}
.v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.08); /* Slightly darker hover effect */
  cursor: pointer;
}
</style>