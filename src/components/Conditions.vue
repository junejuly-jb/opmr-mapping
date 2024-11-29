<script setup>
import Fortifiers from './Fortifiers.vue'
import AddFortifier from './Dialogs/AddFortifier.vue';
import { useMappingStore } from '@/stores/mappings'
import UpdateCondition from '@/components/Dialogs/UpdateCondition.vue'

const getCalories = (cals) => {
    if(cals.length == 0 ){ return 'null'}
    else if(cals.length == 1){ return cals[0] }
    else{ return cals[0] + ' - ' + cals[cals.length -1] }
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
  mapping: {
    type: Object,
    required: true,
  }
});
</script>
<template>
    <div class="cpoe__condition__container">
        <div class="cpoe__btn__array">
            <div>
                <UpdateCondition :condition="condition" :mapping="mapping" :c_index="c_index"/>
            </div>
            <div class="spacer-h"></div>
            <div>
                <v-btn @click="mappingStore.removeConditionWithinAMapping(mapping, c_index)" icon="mdi-close" variant="tonal" size="x-small" color="error"></v-btn>
            </div>
        </div>
        <div>
            Reference: {{condition.reference}}
        </div>
        <div>
            Calories: {{getCalories(condition.calories)}}
        </div>
        <div>
            <AddFortifier :c_index="c_index" :mapping="mapping"/>
            <!-- <v-btn prepend-icon="mdi-plus" color="primary" variant="tonal" size="small" rounded="xl">Fortifier</v-btn> -->
        </div>
        <div class="spacer-v"></div>
        <div v-if="condition.FortifierKey.length != 0">
            <div v-for="(fortifierkey, index ) in condition.FortifierKey">
                <Fortifiers :index="index" :fortifierkey="fortifierkey" :c_index="c_index" :mapping="mapping"/>
            </div>
        </div>
    </div>
</template>
<style scoped>
.cpoe__condition__container{
    padding: 10px 15px;
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
</style>