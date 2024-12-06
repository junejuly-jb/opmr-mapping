<script setup>
    import { useMappingStore } from '@/stores/mappings';
    import { ref } from 'vue';
    import * as XLSX from 'xlsx';
    import ConfirmationDialog from './ConfirmationDialog.vue';

    const mappingStore = useMappingStore();

    const sampleMappings = ref([])
    const errors = ref([])

    const handleFileChange = (event) => {
      errors.value = []
      const file = event.target.files[0];
      if (file) {
        readExcel(file);
      } else {
        alert('Please upload a valid Excel file.');
      }
    }

    const handleSave = () => {
      if(mappingStore.mappings.length != 0){
        mappingStore.setConfirmationDialogText('Confirmation','You already have an existing mapping. Would you like to overwrite it with the new one or merge the new mapping with the existing one?')
        mappingStore.toggleConfirmationDialog(true)
      }
      else{
        mappingStore.setBulkMapping(sampleMappings)
        mappingStore.toggleFileUploadDialog()
      }
    }

    const readExcel = (file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Check if the sheet exists in the workbook
        if (workbook.Sheets['Feed_Base Example']) {
          const sheet = workbook.Sheets['Feed_Base Example'];

          // Convert the sheet data to JSON
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Remove empty rows (arrays)
          var sheetData = jsonData.filter(row => row.some(cell => cell !== null && cell !== ''));
          sheetData = sheetData.slice(1)

          //check for caloric errorrs.
          sheetData.forEach((item, index) => {
            checkForErrors(item, index)
          })
          if(errors.value.length < 1){
            sheetData.forEach((item, index) => {
              const data = {}
              if(item[0]){ //if product reference column is not null (create a new mapping)
                data.productReference = item[0]
                data.conditions = [{ //it always assumed that if product reference is not null, the condition has always value
                  calories: mappingStore.serializeCalories(item[1]),
                  reference: item[2],
                  FortifierKey: []
                }]

                if(item[3]){ // check if the condition has fortifier associated if yes, add the fortifierkey
                  data.conditions[0].FortifierKey.push({
                    "fortifierKey": item[3],
                    "calOzStart": null,
                    "calOzEnd": null,
                    "modular": null
                  })
                }
                sampleMappings.value.push(data)
              }
              else if(!item[0] && item[1]){ // if no productreference on the 1st column, check the second column for condition
                const condition = {
                  calories: mappingStore.serializeCalories(item[1]),
                  reference: item[2],
                  FortifierKey: []
                }
                sampleMappings.value[sampleMappings.value.length - 1].conditions.push(condition)

                if(item[3]){ //add fortifierkey if column is not null
                  const fortifier = {
                    fortifierKey: item[3],
                    calOzStart: null,
                    calOzEnd: null,
                    modular: null
                  }
                  const lastMapping = sampleMappings.value[sampleMappings.value.length - 1]
                  lastMapping.conditions[lastMapping.conditions.length - 1].FortifierKey.push(fortifier)
                }
              }
              else if(!item[0] && !item[1] && !item[2] && item[3]){ //check if product reference, caloric range and product is null (insert the additive to the last mapping on the last condition)
                const fortifier = {
                  fortifierKey: item[3],
                  calOzStart: null,
                  calOzEnd: null,
                  modular: null
                }
                const lastMapping = sampleMappings.value[sampleMappings.value.length - 1]
                lastMapping.conditions[lastMapping.conditions.length - 1].FortifierKey.push(fortifier)
              }
            });
          }
        } else {
          errors.value.push('Workbook sheet must contains Feed_Base Example');
        }
      };

      reader.readAsArrayBuffer(file);
    }

    const checkCaloricFormat = (str) => {
      const regex = /^\d+(-\d+)?$/;
      return regex.test(str);
    }

    const checkForErrors = (data, i) => {
      if(data[1]){
        if(!checkCaloricFormat(data[1])){
          const row = parseInt(i) + 2;
          errors.value.push('Invalid value at column B row ' + row)
        }
      }
    }

    const setEmptyMapping = () => {
      sampleMappings.value = []
    }

</script>
<template>
    <ConfirmationDialog :sampleMappings="sampleMappings" @notify="setEmptyMapping"/>
    <v-dialog
        v-model="mappingStore.fileUploadDialog"
        width="600"
        >
        <v-card
            prepend-icon="mdi-upload"
            text="Select your file (csv and xls files only)"
            title="File Upload"
        >
        <div class="mx-5">
            <v-file-input @change="handleFileChange" type="file" clearable label="File input" variant="outlined" accept=".xlsx, .xls"></v-file-input>
            <div class="my-2" v-for="error in errors">
              <!-- <div>{{ error }}</div> -->
              <v-alert
                :text="error"
                type="error"
                density="compact"
                variant="tonal"
              ></v-alert>
            </div>
            
        </div>
        <template v-slot:actions>
          <v-spacer></v-spacer>

          <v-btn @click="mappingStore.toggleFileUploadDialog">
            Close
          </v-btn>
          <v-btn @click="handleSave" color="success">
            Save
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>