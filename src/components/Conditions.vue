<script setup>
import FortifierKey from './FortifierKey.vue'
import { useMappingStore } from '@/stores/mappings'

const getCalories = (cals) => {
    if(cals.length == 0 ){ return 'null'}
    else{
        return cals[0] + ' - ' + cals[cals.length -1]
    }
}

const mappingStore = useMappingStore();
defineProps({
  condition: {
    type: Object,
    required: true,
  },
  c_index: {
    type: Number,
    required: true,
  },
  m_index: {
    type: Number,
    required: true,
  }
});
</script>
<template>
    <div class="cpoe__condition__container">
        <div class="cpoe__btn__array">
            <div class="cpoe__btn__update">
                <v-btn prepend-icon="mdi-pencil" variant="tonal" size="small" rounded="xl">Update</v-btn>
            </div>
            <div class="spacer"></div>
            <div class="cpoe__btn__delete">
                <v-btn @click="mappingStore.removeConditionWithinAMapping(m_index, c_index)" icon="mdi-close" variant="tonal" size="x-small" color="error"></v-btn>
            </div>
        </div>
        <div>
            Reference: {{condition.reference}}
        </div>
        <div>
            Calories: {{getCalories(condition.calories)}}
        </div>
        <div>
            <FortifierKey/>
        </div>
    </div>
</template>
<style scoped>
.cpoe__condition__container{
    padding: 10px 15px;
    border: 0.5px solid gray;
    margin: 0px 10px;
    border-radius: 15px;
}
.cpoe__btn__array{
    display: flex;
    justify-content: right;
    padding: 5px 0px;
}
.spacer{
    padding: 0px 2px;
}
</style>