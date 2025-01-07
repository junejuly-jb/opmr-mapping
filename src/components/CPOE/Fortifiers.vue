<script setup>
    import { useMappingStore } from '../../stores/mappings';
    import UpdateFortifier from './Dialogs/UpdateFortifier.vue';
    import { mdiDotsVertical, mdiDelete } from '@mdi/js';

    const mappingStore = useMappingStore();

    defineProps({
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
            <UpdateFortifier :condition="condition" :mapping="mapping" :c_index="c_index" :index="index" :fortifierkey="fortifierkey"/>
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