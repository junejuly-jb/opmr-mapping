<script setup>
import { useMappingStore } from '../../stores/mappings';
import { mdiPlus, mdiFile, mdiCheck, mdiDownload } from '@mdi/js';
import * as XLSX from "xlsx";

const mappingStore = useMappingStore();
const handleSave = () => {
  mappingStore.setConfirmationDialogText('save-mapping','Save','Do you want to save your changes to the OPMR mapping rules?')
  mappingStore.toggleConfirmationDialog(true)
}

const downloadExcel = () => {
  const feed_base = []
  const fortifiers = []

  //Flatten Data to a one dimensional array
  if(mappingStore.mappings && mappingStore.mappings.length > 0){ //check mappings if not null
    mappingStore.mappings.forEach(item => { // loop thru mappings.json
      if(item.type === 'Feed Base'){ // Check mapping type
        if(item.conditions && item.conditions.length > 0){ //check the conditions array if not null.
          item.conditions.forEach((condition, conditionIndex) => { //loop each conditions.
            if(condition.FortifierKey && condition.FortifierKey.length > 0){ // check if fortifiers array is not null
              condition.FortifierKey.forEach((additive, additiveIndex) => { //loop thru fortifiers array.
                feed_base.push({
                  "Feed-Base-Reference": (conditionIndex === 0 && additiveIndex === 0) ? item["productReference"] : "",
                  "Caloric-Rule": additiveIndex === 0 ? getCalories(condition["calories"]) : "",
                  "Product-Name": additiveIndex === 0 ? condition["reference"] : "",
                  "Additive": additive["fortifierKey"]
                });
              });
            } else {
              feed_base.push({
                "Feed-Base-Reference": conditionIndex === 0 ? item["productReference"] : "",
                "Caloric-Rule": getCalories(condition["calories"]),
                "Product-Name": condition["reference"],
                "Additive": ""
              });
            }
          });
        } else {
          feed_base.push({
            "Feed-Base-Reference": item["productReference"],
            "Caloric-Rule": "",
            "Product-Name": "",
            "Additive": ""
          });
        }
      }
      else {
        if(item.conditions && item.conditions.length > 0){ // check conditions if not null
          item.conditions.forEach((condition, conditionIndex) => { // loop to conditions array
            if(condition.FortifierKey && condition.FortifierKey.length > 0){ //check fortifier array if not null
              condition.FortifierKey.forEach((additive, additiveIndex) => { // loop thru fortifier array
                fortifiers.push({
                  "Feed-Base-Reference": (conditionIndex === 0 && additiveIndex === 0) ? item["productReference"] : "",
                  "Calorie-Rule": additiveIndex === 0 ? getCalories(condition["calories"]) : "",
                  "Additive": additive["fortifierKey"],
                  "IsModular": ""
                });
              });
            }
            else{
              fortifiers.push({
                "Feed-Base-Reference": conditionIndex === 0 ? item["productReference"] : "",
                "Calorie-Rule": getCalories(condition["calories"]),
                "Additive": "",
                "IsModular": ""
              });
            }
          });
        } else {
          fortifiers.push({
            "Feed-Base-Reference": item["productReference"],
            "Calorie-Rule": "",
            "Additive": "",
            "IsModular": ""
          });
        }
      }
    });

    const feedBaseSheet = XLSX.utils.json_to_sheet(feed_base); // Convert JSON to a worksheet (feed base)
    const fortifierSheet = XLSX.utils.json_to_sheet(fortifiers); // Convert JSON to a worksheet (fortifiers)

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, feedBaseSheet, "Feed_Base");
    XLSX.utils.book_append_sheet(workbook, fortifierSheet, "Fortifiers");

    // Generate Excel file and download
    XLSX.writeFile(workbook, "mapping.xlsx");
  } else {
    const id = Date.now()
    mappingStore.addNotifs(id, 'OPMR mapping rules is empty.', 'warning')
    mappingStore.autoRemoveNotifs(id)
  }
  
}

const getCalories = (arr) => {
  if(arr.length == 1){
    return arr[0];
  }
  else if (arr.length == 0){
    return '';
  }
  else {
    return arr[0] + '-' + arr[arr.length - 1]
  }
}
</script>
<template>
    <div class="opmr__spacer__v">
      <span class="opmr__spacer__h"></span>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn
            color="primary"
            v-bind="props"
          >
            Mapping Rule
            <v-icon
            :icon="mdiPlus"
            end
            ></v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="mappingStore.setEmptyMapping('Feed Base')">
            <v-list-item-title>Feed Base</v-list-item-title>
          </v-list-item>
          <v-list-item @click="mappingStore.setEmptyMapping('Fortifier')">
            <v-list-item-title>Fortifier</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <span class="opmr__spacer__h"></span>
      <v-btn
        color="primary"
        @click="mappingStore.toggleFileUploadDialog"
      >
        Import File
        <v-icon
          :icon="mdiFile"
          end
        ></v-icon>
      </v-btn>
      <span class="opmr__spacer__h"></span>
      <v-btn
        color="primary"
        @click="downloadExcel"
      >
        Download Mapping
        <v-icon
          :icon="mdiDownload"
          end
        ></v-icon>
      </v-btn>
      <span class="opmr__spacer__h"></span>
      <v-btn
        color="success"
        @click="handleSave"
      >
        Save
        <v-icon
          :icon="mdiCheck"
          end
        ></v-icon>
      </v-btn>
    </div>
</template>
<style scoped>
.opmr__spacer__h{
  padding: 0px 10px;
}
.opmr__spacer__v{
  padding: 20px 0px;
}
.v-list-item {
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.v-list-item:hover {
  background-color: rgb(223, 223, 223);
}
</style>