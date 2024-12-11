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
        }
    });
</script>
<template>
    <div class="opmr__chips">
        <span>
            <v-menu location="start">
                <template v-slot:activator="{ props }">
                    <v-btn
                    dark
                    v-bind="props"
                    icon
                    size="small"
                    variant="text"
                    >
                    <v-icon :icon="mdiDotsVertical"></v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <UpdateFortifier :mapping="mapping" :c_index="c_index" :index="index" :fortifierkey="fortifierkey"/>
                    <v-list-item @click="mappingStore.removeFortifier(mapping, c_index, index)">
                        <v-list-item-title><v-icon :icon="mdiDelete"></v-icon><span class="spacer"></span><span class="spacer"></span>Delete</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </span>
        <span>
            <v-chip size="small" variant="outlined">{{fortifierkey.fortifierKey}}</v-chip>
        </span>
        <span class="spacer" variant="outlined"></span>
        <span>
            <v-chip size="small" variant="outlined">{{fortifierkey.isModular ? 'Modular' : 'Non modular'}}</v-chip>
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