<script setup>
import { useMappingStore } from '../../stores/mappings';
import { mdiPlus, mdiFile, mdiCheck, mdiDownload } from '@mdi/js';
import * as XLSX from "xlsx";

const mappingStore = useMappingStore();
const handleSave = () => {
  mappingStore.setConfirmationDialogText('Save','Do you want to save your changes to the OPMR mapping rules?')
  mappingStore.toggleConfirmationDialog(true)
}

const downloadExcel = () => {
  //Flatten Data
  const transformed = []
  mappingStore.mappings.forEach(item => {
    item.conditions.forEach((condition, conditionIndex) => {
      condition.FortifierKey.forEach((additive, additiveIndex) => {
        transformed.push({
          "Feed-Base-Reference": (conditionIndex === 0 && additiveIndex === 0) ? item["productReference"] : "",
          "Caloric-Rule": additiveIndex === 0 ? getCalories(condition["calories"]) : "",
          "Product-Name": additiveIndex === 0 ? condition["reference"] : "",
          "Additive": additive["fortifierKey"]
        });
      });
    });
  });

  console.log(transformed)
  // Convert JSON to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(transformed);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Feed_Base");

  // Generate Excel file and download
  XLSX.writeFile(workbook, "mapping.xlsx");
}

const getCalories = (arr) => {
  if(arr.length == 1){
    return arr[0]
  }
  else if (!arr){
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