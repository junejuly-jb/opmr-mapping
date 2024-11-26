<script setup>
    defineProps({
        fortifierkey: {
            type: Object,
            required: true,
        }
    });
</script>
<template>
    <div class="opmr__chips">
        <span>
            <v-btn icon color="success" variant="text" size="small">
                <v-tooltip activator="parent" location="start">Edit Fortifier</v-tooltip> 
                <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="error" variant="text" size="small" rounded="xl">
                <v-tooltip activator="parent" location="start">Remove Fortifier</v-tooltip> 
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </span>
        <span class="spacer"></span>
        <span>
            <v-chip size="small">{{fortifierkey.fortifierKey}}</v-chip>
        </span>
        <span class="spacer"></span>
        <span>
            <v-chip size="small">{{fortifierkey.calOzStart ?? '0'}} - {{fortifierkey.calOzEnd}}</v-chip>
        </span>
        <span class="spacer"></span>
        <span>
            <v-chip size="small">Modular: {{fortifierkey.modular ?? 'null'}}</v-chip>
        </span>
    </div>
</template>
<style scoped>
.opmr__chips{
    padding: 5px 0px;
}
.spacer{
    padding: 0px 2px;
}
</style>