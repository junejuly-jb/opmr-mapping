<script setup lang="ts">
    import { ref } from 'vue';
    import { FortifierKey } from '@/interfaces/CPOE'
    import { useMappingStore } from '@/stores/mappings';
    const mappingStore = useMappingStore();
    
    const addFortifier = () => {
        // mappingStore.addFortifier(fortifier.value, c_index, mapping)
        // fortifier.value = {
        //     fortifierKey: 'Enfamil Infant',
        //     calOzStart: null,
        //     calOzEnd: null,
        //     modular: null,
        // }
        // isActive.value = false
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
    });

</script>
<template>
    <v-dialog max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
            <v-list-item v-bind="activatorProps">
                <v-list-item-title><v-icon>mdi-pencil</v-icon><span class="spacer"></span><span class="spacer"></span>Update</v-list-item-title>
            </v-list-item>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card title="Update Fortifier Key">
            <v-spacer></v-spacer>
            <v-card-text>
                <v-select
                v-model="fortifier.fortifierKey"
                label="Fortifier Key"
                :items="['Enfamil Infant', 'Enfamil Gentlease', 'Ketovie 3:1', 'Peptide', 'Alfamino Junior', 'Neosure PWD']"
                variant="outlined"
                ></v-select>
                <v-row>
                    <!-- <v-col cols="4">
                        <v-text-field v-model="fortifier.calOzStart" label="Cal/oz Start" variant="outlined"></v-text-field>
                    </v-col> -->
                    <v-col cols="6">
                        <v-text-field v-model="fortifier.calOzEnd" label="Fortifier Calorie" variant="outlined"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="fortifier.modular" label="Modular Volume" variant="outlined"></v-text-field>
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
                @click="addFortifier()"
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