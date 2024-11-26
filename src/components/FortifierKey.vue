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