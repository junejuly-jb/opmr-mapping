<script setup>
import { useMappingStore } from '../../stores/mappings';
import Conditions from './Conditions.vue';
import AddCondition from './Dialogs/AddCondition.vue';
import { mdiMinusCircle } from '@mdi/js';

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
                :icon="mdiMinusCircle"
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