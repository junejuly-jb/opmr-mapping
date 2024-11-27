<script setup>
    const test = () => {
        console.log('test')
    }
</script>
<template>
    <v-dialog max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn
            v-bind="activatorProps"
            prepend-icon="mdi-plus"
            text="Fortifier"
            variant="tonal"
            color="primary"
            size="small" 
            rounded="xl"
            ></v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Add Fortifier Key">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-select
                label="Fortifier Key"
                :items="['Enfamil Infant', 'Enfamil Gentlease', 'Ketovie 3:1', 'Peptide', 'Alfamino Junior', 'Neosure PWD']"
                variant="outlined"
                ></v-select>
                <v-row>
                    <v-col cols="4">
                        <v-text-field label="Cal/oz Start" variant="outlined"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Cal/oz End" variant="outlined"></v-text-field>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field label="Modular" variant="outlined"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                text="Close"
                @click="isActive.value = false"
                ></v-btn>
                <v-btn
                text="Save"
                color="success"
                @click="test"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>