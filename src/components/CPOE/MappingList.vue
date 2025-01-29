<script setup>
import { watch } from 'vue'
import { useMappingStore } from '../../stores/mappings';
import Conditions from './Conditions.vue';
import AddCondition from './Dialogs/AddCondition.vue';
import { mdiMinusCircle, mdiContentCopy } from '@mdi/js';

const mappingStore = useMappingStore();
const handleRemoveMapping = (mapping) => {
    mappingStore.deleteSelectedMapping = mapping.mappingId
    if(mapping.conditions && mapping.conditions.length != 0){
        const hasValue = mapping.conditions.some(obj => obj.isUsed === true);
        if(hasValue){
            mappingStore.setConfirmationDialogText('delete-mapping-in-use', 'Warning', 'The mapping you want to delete is currently in use. Do you wish to continue?')
            mappingStore.confirmationDialog = true
        }
        else{ 
            mappingStore.removeMapping()
        }
    }
    else{
        mappingStore.removeMapping()
    }
}



const props = defineProps({
  mapping: {
    type: Object,
    required: true,
  },
  index: Number
});

watch(() => props.mapping.productReference, (newValue, oldValue) => {
    if(newValue && mappingStore.globalFiltersForBM.includes(newValue.toLowerCase()) && props.mapping.isBreastMilk){ //always watch the product reference if hits a breast milk keyword
        props.mapping.isBreastMilk = true
    }
    else {
        props.mapping.isBreastMilk = false
    }
})

</script>
<template>
    <div class="opmr__mapping_lists">
        <div class="col-remove">
            <div>
                <v-tooltip bottom>
                    <template v-slot:activator="{ props }">
                        <v-btn
                        v-bind="props"
                        variant="tonal"
                        color="red-lighten-2"
                        icon
                        @click="handleRemoveMapping(mapping)"
                        size="small"
                        >
                        <v-icon :icon="mdiMinusCircle"></v-icon>
                        </v-btn>
                    </template>
                    <span>Delete</span>
                </v-tooltip>
                <div class="my-2"></div>
                <v-tooltip bottom>
                    <template v-slot:activator="{ props }">
                        <v-btn
                        v-bind="props"
                        variant="tonal"
                        color="primary"
                        icon
                        @click="mappingStore.duplicateMapping(mapping, index)"
                        size="small"
                        >
                        <v-icon :icon="mdiContentCopy"></v-icon>
                        </v-btn>
                    </template>
                    <span>Duplicate mapping</span>
                </v-tooltip>
            </div>
        </div>
        <div class="col-1">
            <div>
                <v-chip class="my-3">{{mapping.type}}</v-chip>
                <v-text-field width="300" v-model="mapping.productReference" density="compact" label="HL7 Reference" variant="outlined" clearable></v-text-field>
            </div>
        </div>
        <div class="col-2">
            <AddCondition :mapping="mapping"/>
            <div class="test">
                <div class="item" v-for="(condition, c_index) in mapping.conditions">
                    <Conditions :condition="condition" :mapping="mapping" :c_index="c_index"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.test{
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.opmr__mapping_lists{
    padding: 0px 20px;
    display: flex;
}
.item{
    flex: 0 0 calc(33% - 10px); 
}
.col-1{
    padding: 0px 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.col-2{
    padding: 5px 0px;
    width: 100%;
}

.opmr__hl7__reference{
    margin: 10px 0px;
    width: 350px;
    padding: 12px 20px;
    border: 1px solid gray;
    border-radius: 10px;
}
.col-remove {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>