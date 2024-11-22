<script setup>
import { useMappingStore } from '@/stores/mappings';
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
                @click="mappingStore.removeMapping(index)"
            ></v-btn>
        </div>
        <div class="col-1">
            <div>Product Reference</div>
            <input :name="`${mapping.productReference}`" :id="`${mapping.productReference}`" v-model="mapping.productReference" type="text" placeholder="HL7 Reference" class="opmr__hl7__reference">
        </div>
        <div class="col-2">
            <v-dialog max-width="500">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn
                    v-bind="activatorProps"
                    prepend-icon="mdi-plus"
                    text="Condition"
                    variant="plain"
                    ></v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                    <v-card title="Set Product Mapping">
                    <v-spacer></v-spacer>
                    <v-card-text>
                        <v-text-field label="Calories" variant="outlined"></v-text-field>
                        <v-text-field label="Product Reference" variant="outlined"></v-text-field>
                        <v-select
                        label="Fortifier Key"
                        :items="['Enfamil Infant', 'Enfamil Gentlease', 'Ketovie 3:1', 'Peptide', 'Alfamino Junior', 'Neosure PWD']"
                        variant="outlined"
                        ></v-select>
                        <v-row>
                            <v-col
                            cols="6"
                            >
                                <v-text-field label="Cal/oz Start" variant="outlined"></v-text-field>
                            </v-col>
                            <v-col
                            cols="6"
                            >
                                <v-text-field label="Cal/oz End" variant="outlined"></v-text-field>
                            </v-col>
                        </v-row>
                        <v-text-field label="Modular" variant="outlined"></v-text-field>
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
                        @click="isActive.value = false"
                        ></v-btn>
                    </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>
        </div>
    </div>
</template>

<style scoped>
.opmr__mapping_lists{
    padding: 0px 20px;
    display: flex;
}
.col-1{
    padding: 0px 30px;
 /* background-color: green; */
}

.opmr__hl7__reference{
    margin: 10px 0px;
    width: 500px;
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