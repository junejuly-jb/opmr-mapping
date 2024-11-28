<script setup>
    import { useMappingStore } from '@/stores/mappings';
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
            <v-btn density="compact" icon color="success" variant="text" size="small">
                <v-tooltip activator="parent" location="start">Edit Fortifier</v-tooltip> 
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <span class="spacer"></span>
            <v-btn density="compact" @click="mappingStore.removeFortifier(mapping, c_index, index)" icon color="error" variant="text" size="small" rounded="xl">
                <v-tooltip activator="parent" location="start">Remove Fortifier</v-tooltip> 
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </span>
        <span class="spacer"></span>
        <span class="spacer"></span>
        <span>
            <v-chip size="small" variant="outlined">{{fortifierkey.fortifierKey}}</v-chip>
        </span>
        <span class="spacer" variant="outlined"></span>
        <span>
            <v-chip size="small" variant="outlined">{{fortifierkey.calOzStart ?? '0'}} - {{fortifierkey.calOzEnd}}</v-chip>
        </span>
        <span class="spacer"></span>
        <span>
            <v-chip size="small" variant="outlined">Modular: {{fortifierkey.modular}}</v-chip>
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
</style>