<script setup>
import { useMappingStore } from '@/stores/mappings';
import Conditions from './Conditions.vue';
import AddCondition from './Dialogs/AddCondition.vue';
const mappingStore = useMappingStore();
defineProps({
  mapping: {
    type: Object,
    required: true,
  },
  index: Number
});
</script>
<template>
    <div class="opmr__mapping_lists">
        <div class="col-remove">
            <v-btn
                color="red-lighten-2"
                icon="mdi-minus-circle"
                variant="text"
                @click="mappingStore.removeMapping(mapping.productReference)"
            ></v-btn>
        </div>
        <div class="col-1">
            <v-text-field width="300" v-model="mapping.productReference" density="compact" label="Product Reference" variant="outlined" clearable></v-text-field>
        </div>
        <div class="col-2">
            <AddCondition :mapping="mapping"/>
            <div class="test">
                <div v-for="(condition, c_index) in mapping.conditions">
                    <Conditions :condition="condition" :mapping="mapping" :c_index="c_index"/>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.test{
    display: flex;
}
.opmr__mapping_lists{
    padding: 0px 20px;
    display: flex;
}
.col-1{
    padding: 0px 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.col-2{
    padding: 5px 0px;
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