<script setup lang="ts">
    import { inject, ref } from 'vue';
    import { useMappingStore } from '../../../stores/mappings';

    const mappingStore = useMappingStore();
    const user = inject('authUser');
    const errMessage = ref('');
    
    const handleUpdateFortifierKey = () => {
        //Check if type is fortifier else feed base
        if(mappingStore.updateSelectedFortifierKey.mapping.type == 'Fortifier'){
            const c_index = mappingStore.updateSelectedFortifierKey.c_index
            if(mappingStore.updateSelectedFortifierKey.mapping.conditions[c_index].calories.includes(Number(mappingStore.updateSelectedFortifierKey.data.calOzEnd))){
                mappingStore.updateFortifierKey(user)
                mappingStore.updateFortifierDialog = false
            }
            else {
                errMessage.value = 'Calorie not in range.'
            }
        }
        else {
            mappingStore.updateFortifierKey(user)
            mappingStore.updateFortifierDialog = false
        }
    }

</script>
<template>
    <v-dialog v-model:model-value="mappingStore.updateFortifierDialog" max-width="650">
        <v-card title="Update Fortifier Key">
        <v-spacer></v-spacer>
        <v-card-text>
            <v-text-field v-model="mappingStore.updateSelectedFortifierKey.data.calOzEnd" label="Mix to Cal" variant="outlined" clearable/>
            <v-autocomplete
                v-model="mappingStore.updateSelectedFortifierKey.data.fortifierKey"
                label="Fortifier Key"
                item-value="formtypeHL7Reference" 
                item-title="formtypeHL7Reference"
                :items="mappingStore.products"
                variant="outlined"
                clearable
            ></v-autocomplete>
            <v-alert
                v-if="errMessage != ''"
                :text="errMessage"
                type="error"
                density="compact"
                variant="tonal"
            ></v-alert>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
            text="Close"
            @click="mappingStore.updateFortifierDialog = false"
            ></v-btn>
            <v-btn
            text="Update Fortifier"
            color="success"
            @click="handleUpdateFortifierKey"
            ></v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<style setup>
.spacer{
    padding: 0px 2px;
}
</style>