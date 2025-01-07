<script setup>
import Fortifiers from './Fortifiers.vue'
import AddFortifier from './Dialogs/AddFortifier.vue';
import { useMappingStore } from '../../stores/mappings'
import { mdiClose, mdiPencil } from '@mdi/js'

const mappingStore = useMappingStore();
const getCalories = (cals) => {
    if(cals.length == 0 ){ return 'null'}
    else if(cals.length == 1){ return cals[0] }
    else{ return cals[0] + '-' + cals[cals.length -1] }
}

const handleRemoveCondition = (mapping, c_index, condition) => {
    mappingStore.deleteSelectedCondition.mapping = JSON.parse(JSON.stringify(mapping))
    mappingStore.deleteSelectedCondition.conditionIndex = c_index
    if(condition.isUsed){
        mappingStore.setConfirmationDialogText('delete-condition-in-use', 'Warning', 'The mapping you want to remove is currently in use. Do you wish to continue?')
        mappingStore.confirmationDialog = true
    } else {
        mappingStore.removeConditionWithinAMapping()
    }
}

const toggleUpdateCondition = (mapping, condition, c_index) => {
    mappingStore.updateSelectedConditon.mapping = JSON.parse(JSON.stringify(mapping))
    mappingStore.updateSelectedConditon.updatedMapping = JSON.parse(JSON.stringify(condition))
    mappingStore.updateSelectedConditon.conditionIndex = c_index
    if(condition.calories.length == 0){
        mappingStore.updateSelectedConditon.updatedMapping.calories = ''
    }
    else if (condition.calories.length == 1) {
        mappingStore.updateSelectedConditon.updatedMapping.calories = condition.calories[0]
    }
    else {
        mappingStore.updateSelectedConditon.updatedMapping.calories = condition.calories[0] + '-' + condition.calories[condition.calories.length - 1]
    }

    if(!condition.isUsed){
        mappingStore.updateConditionDialog = true
    }else {
        mappingStore.setConfirmationDialogText('update-condition-in-use', 'Warning', 'The mapping you want to update is currently in use. Do you wish to continue?')
        mappingStore.confirmationDialog = true
    }
}

defineProps({
  condition: {
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
  }
});
</script>
<template>
    <div class="cpoe__condition__outer__container">
        <div class="cpoe__condition__container">
            <div class="cpoe__btn__array">
                <div>
                    <v-btn @click="toggleUpdateCondition(mapping, condition, c_index)" :prepend-icon="mdiPencil" color="primary" variant="tonal" size="small" rounded="xl">Update</v-btn>
                </div>
                <div class="spacer-h"></div>
                <div>
                    <v-btn @click="handleRemoveCondition(mapping, c_index, condition)" :icon="mdiClose" variant="tonal" size="x-small" color="error"></v-btn>
                </div>
            </div>
            <div>
                Reference: {{mapping.type == 'Feed Base' ? condition.reference : 'Feed Base Dependent'}}
            </div>
            <div>
                Caloric Range: {{getCalories(condition.calories)}}
            </div>
            <div>
                Is Modular: {{condition.isModular ? 'Yes' : 'No'}}
            </div>
            <div v-if="condition.calories.length != 0">
                <AddFortifier :c_index="c_index" :mapping="mapping"/>
            </div>
            <div class="spacer-v"></div>
            <div v-if="condition.FortifierKey.length != 0">
                <div v-for="(fortifierkey, index ) in condition.FortifierKey">
                    <Fortifiers :condition="condition" :index="index" :fortifierkey="fortifierkey" :c_index="c_index" :mapping="mapping"/>
                </div>
            </div>
        </div>
        <div class="is__used" v-if="condition.isUsed">Mapping is in use</div>
    </div>
</template>
<style scoped>
.cpoe__condition__container{
    padding: 10px 15px;
}
.cpoe__condition__outer__container {
    border: 0.5px solid gray;
    margin: 0px 0px;
    border-radius: 15px;
}
.cpoe__btn__array{
    display: flex;
    justify-content: right;
    padding: 5px 0px;
}
.spacer-h{
    padding: 0px 2px;
}
.spacer-v{
    padding: 2px 0px;
}
.is__used{
    background-color: gray;
    border-radius: 0px 0px 15px 15px;
    text-align: center;
    padding: 2px 0px;
    color: white;
}
</style>