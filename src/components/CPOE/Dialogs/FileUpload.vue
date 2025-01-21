<script setup>
    import { useMappingStore } from '../../../stores/mappings';
    import { ref } from 'vue';
    import { mdiUpload } from '@mdi/js';
    import * as XLSX from 'xlsx';
    import ConfirmationDialog from './ConfirmationDialog.vue';

    const mappingStore = useMappingStore();

    const sampleMappings = ref([])
    const errors = ref([])
    const isDoneLoading = ref(false)

    const feedbaseCount = (keyword) => {
      return sampleMappings.value.filter(item => item.type === keyword).length;
    }

    const handleFileChange = (event) => {
      errors.value = []
      const file = event.target.files[0];
      if (file) {
        readExcel(file);
      } else {
        errors.value.push('Please upload a valid Excel file.');
      }
    }

    const handleSave = () => {
      if(mappingStore.mappings.length != 0){
        mappingStore.setConfirmationDialogText('confirmation-merge-overwrite','Confirmation','You already have an existing mapping. Would you like to overwrite it with the new one or merge the new mapping with the existing one?')
        mappingStore.toggleConfirmationDialog(true)
      }
      else{
        mappingStore.setBulkMapping(sampleMappings.value)
        mappingStore.toggleFileUploadDialog()
        isDoneLoading.value = false
      }
    }

    const handleClose = () => {
      setTimeout(() => {
        isDoneLoading.value = false
        errors.value = []
        sampleMappings.value = []
      },200)
      mappingStore.toggleFileUploadDialog()
    }

    const readExcel = (file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        readFeedBase(workbook)
        readFortifier(workbook)

      };

      reader.readAsArrayBuffer(file);
      isDoneLoading.value = true
    }

    const readFeedBase = (workbook) => {
      // Check if the sheet exists in the workbook
      if (workbook.Sheets['Feed_Base']) {
        const sheet = workbook.Sheets['Feed_Base'];

        // Convert the sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        // Remove empty rows (arrays)
        var sheetData = jsonData.filter(row => row.some(cell => cell !== null && cell !== ''));
        sheetData = sheetData.slice(1)

        //check for caloric errorrs.
        sheetData.forEach((item, index) => {
          checkForErrors(item, index, 'Feed_Base')
        })
        if(errors.value.length < 1){
          sheetData.forEach((item, index) => {
            const data = {}
            if(item[0]){ //if product reference column is not null (create a new mapping)
              data.mappingId = 0
              data.productReference = item[0]
              data.type = 'Feed Base'
              data.isBreastMilk = checkIfBreastMilk(item[0])
              data.conditions = [{ //it always assumed that if product reference is not null, the condition has always value
                calories: mappingStore.serializeCalories(item[1]),
                reference: item[2],
                referenceDID: mappingStore.getProductDID(item[2]),
                isUsed: false,
                user: { userID: null, userFirstName: "", userLastName: ""},
                isModular: false,
                lastUpdate: null,
                FortifierKey: []
              }]

              if(item[3]){ // check if the condition has fortifier associated if yes, add the fortifierkey
                data.conditions[0].FortifierKey.push({
                  "fortifierKey": item[3],
                  "fortifierKeyDID": mappingStore.getProductDID(item[3]),
                  "calOzStart": null,
                  "calOzEnd": item[4],
                  "modular": null,
                })
              }
              sampleMappings.value.push(data)
            }
            else if(!item[0] && item[1]){ // if no productreference on the 1st column, check the second column for condition
              const condition = {
                calories: mappingStore.serializeCalories(item[1]),
                reference: item[2],
                referenceDID: mappingStore.getProductDID(item[2]),
                isUsed: false,
                user: { userID: null, userFirstName: "", userLastName: ""},
                isModular: false,
                lastUpdate: null,
                FortifierKey: []
              }
              sampleMappings.value[sampleMappings.value.length - 1].conditions.push(condition)

              if(item[3]){ //add fortifierkey if column is not null
                const fortifier = {
                  fortifierKey: item[3],
                  fortifierKeyDID: mappingStore.getProductDID(item[3]),
                  calOzStart: null,
                  calOzEnd: item[4],
                  modular: null,
                }
                const lastMapping = sampleMappings.value[sampleMappings.value.length - 1]
                lastMapping.conditions[lastMapping.conditions.length - 1].FortifierKey.push(fortifier)
              }
            }
            else if(!item[0] && !item[1] && !item[2] && item[3]){ //check if product reference, caloric range and product is null (insert the additive to the last mapping on the last condition)
              const fortifier = {
                fortifierKey: item[3],
                fortifierKeyDID: mappingStore.getProductDID(item[3]),
                calOzStart: null,
                calOzEnd: item[4],
                modular: null,
              }
              const lastMapping = sampleMappings.value[sampleMappings.value.length - 1]
              lastMapping.conditions[lastMapping.conditions.length - 1].FortifierKey.push(fortifier)
            }
          });
        }
      } else {
        errors.value.push('Workbook sheet must contains Feed_Base');
      }
    }

    const readFortifier = (workbook) => {
      // Check if the sheet exists in the workbook
      if (workbook.Sheets['Fortifier']) {
        const sheet = workbook.Sheets['Fortifier'];

        // Convert the sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Remove empty rows (arrays)
        var sheetData = jsonData.filter(row => row.some(cell => cell !== null && cell !== ''));
        sheetData = sheetData.slice(1)

        //check for caloric errorrs.
        sheetData.forEach((item, index) => {
          checkForErrors(item, index, 'Fortifier')
        })
        if(errors.value.length < 1){
          sheetData.forEach((item, index) => {
            const data = {}
            if(item[0]){ //if feed base reference column is not null (create a new mapping)
              data.mappingId = 0
              data.productReference = item[0]
              data.type = 'Fortifier'
              data.conditions = [{ //it always assumed that if feed base reference is not null, the condition has always value
                calories: mappingStore.serializeCalories(item[1]),
                reference: '', //always blank if fortifier
                referenceDID: null, //always blank if fortifier
                isUsed: false,
                user: { userID: null, userFirstName: "", userLastName: ""},
                isModular: item[2],
                lastUpdate: null,
                FortifierKey: []
              }]
              if(item[3]){ //check Additive has value
                data.conditions[0].FortifierKey.push({
                  "fortifierKey": item[3],
                  "fortifierKeyDID": mappingStore.getProductDID(item[3]),
                  "calOzStart": null,
                  "calOzEnd": null,
                  "modular": null
                })
              }
              sampleMappings.value.push(data)
            }
            else if(!item[0] && !item[1]){ // if no feed-base reference on the 1st column and no caloric rule, check for additives
              if(item[3]){
                const fortifier = {
                  fortifierKey: item[3],
                  fortifierKeyDID: mappingStore.getProductDID(item[3]),
                  calOzStart: null,
                  calOzEnd: null,
                  modular: null
                }
                const lastMapping = sampleMappings.value[sampleMappings.value.length - 1]
                lastMapping.conditions[lastMapping.conditions.length - 1].FortifierKey.push(fortifier)
              }
            }
          });
        }
      } else {
        errors.value.push('Workbook sheet must contains Fortifier');
      }
    }

    const checkCaloricFormat = (str) => {
      const regex = /^\d+(-\d+)?$/;
      return regex.test(str);
    }

    const checkForErrors = (data, i, type) => {
      const filters = ['ehm','ebm','dbm','dhm'];
      if(data[1]){ //Check for invalid caloric rule
        if(!checkCaloricFormat(data[1])){
          const row = parseInt(i) + 2;
          errors.value.push(`Invalid calorie range value at B${row}(${type}).` )
        }
      }
      //Check for product if name is not on the product load
      if(data[2] && type == 'Feed_Base'){ // Applicable for Feed_Base only.
        const isMatch = mappingStore.products.some(obj => obj.formtypeHL7Reference.toLowerCase() === data[2].toLowerCase());
        if(!isMatch && !filters.includes(data[2].toLowerCase())){ //not product match and ebm and dbm
          const row = parseInt(i) + 2;
          errors.value.push(`Product name not found at C${row}(${type}).`)
        }
      }
      if(data[3]){ //Applicable to Feed_Base and Fortifiers.
        const isMatch = mappingStore.products.some(obj => obj.formtypeHL7Reference.toLowerCase() === data[3].toLowerCase());
        if(!isMatch){
          const row = parseInt(i) + 2;
          errors.value.push(`Product name not found at D${row}(${type}).`)
        }
      }
    }

    const checkIfBreastMilk = (data) => {
      if(mappingStore.globalFiltersForBM.includes(data.toLowerCase())){
        return true;
      }
      return false;
    }
    const setEmptyMapping = () => {
      sampleMappings.value = []
      isDoneLoading.value = false
    }

</script>
<template>
    <ConfirmationDialog :sampleMappings="sampleMappings" @notify="setEmptyMapping"/>
    <v-dialog
        v-model="mappingStore.fileUploadDialog"
        width="600"
        >
        <v-card
            :prepend-icon="mdiUpload"
            text="Select your file (csv and xls files only)"
            title="File Upload"
        >
        <div class="mx-5">
            <v-file-input @change="handleFileChange" type="file" clearable label="File input" variant="outlined" accept=".xlsx, .xls"></v-file-input>
            <div v-if="errors.length < 1 && isDoneLoading">
              <div class="my-1">
                <v-chip color="success">{{ feedbaseCount('Feed Base') }}</v-chip> mapping rules loaded for feed bases.
              </div>
              <div class="my-1">
                <v-chip color="success">{{ feedbaseCount('Fortifier') }}</v-chip> mapping rules loaded for fortifiers.
              </div>
            </div>
            <div class="my-2" v-for="error in errors">
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

          <v-btn @click="handleClose">
            Close
          </v-btn>
          <v-btn v-if="sampleMappings.length > 0" @click="handleSave" color="success">
            Add
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>