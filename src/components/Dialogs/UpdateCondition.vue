<script setup>
const test = (mapping) => {
    console.log(mapping)
}

defineProps({
    mapping: {
        type: Object,
        required: true
    }
})
</script>
<template>
    <v-dialog max-width="400">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn @click="test(mapping)" v-bind="activatorProps" prepend-icon="mdi-pencil" color="primary" variant="tonal" size="small" rounded="xl">Update</v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Update Product Mapping">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-text-field label="Calories" variant="outlined"></v-text-field>
                <v-text-field label="Product Reference" variant="outlined"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                text="Close"
                @click="isActive.value = false"
                ></v-btn>
                <v-btn
                text="Save Condition"
                color="success"
                @click=""
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>