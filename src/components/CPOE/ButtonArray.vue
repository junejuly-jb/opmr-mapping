<script setup>
import { useMappingStore } from '../../stores/mappings';
import { mdiPlus, mdiFile, mdiCheck, mdiDownload, mdiInformation } from '@mdi/js';
import * as XLSX from "xlsx";
import { ref } from 'vue';

const mappingStore = useMappingStore();
const drawer = ref(false)

const handleSave = () => {
  const duplicates = findDuplicates(mappingStore.mappings) //check for duplicates
  const hasEmptyHL7Ref = checkForEmptyReference(mappingStore.mappings)
  const fortifiedBreastMilkWithoutFortifier = checkForFortifiedBreastMilkWithoutFortifier(mappingStore.mappings)
  const invalidConditionMilktype = checkValidMilkTypeCondition(mappingStore.mappings)
  const invalidMilktypeCalorie = invalidConditionMilktype.length === 0 ? checkMilkTypeCaloricValue(mappingStore.mappings) : [];
  const invalidNonMilktypeCalorie = checkNonMilkTypeCaloricValue(mappingStore.mappings)
  if(duplicates.length > 0 || hasEmptyHL7Ref > 0 || fortifiedBreastMilkWithoutFortifier.length > 0 || invalidConditionMilktype.length > 0 || invalidMilktypeCalorie.length > 0 || invalidNonMilktypeCalorie.length > 0){
    if(duplicates.length > 0){
      var messages = []
      duplicates.forEach(element => {
        messages.push(`${element.productReference} - ${element.type}`)
      });
      mappingStore.errors.push({title: 'Duplicate entry', data: messages })
    }
    if(hasEmptyHL7Ref > 0){
      mappingStore.errors.push({title: 'HL7 reference required', data: [`${hasEmptyHL7Ref} HL7 reference ${hasEmptyHL7Ref > 1 ? 'are': 'is'} empty.`]})
    }
    if(fortifiedBreastMilkWithoutFortifier.length > 0){
      mappingStore.errors.push({title: 'Fortified milk must have fortifiers', data: fortifiedBreastMilkWithoutFortifier})
    }
    if(invalidConditionMilktype.length > 0){
      mappingStore.errors.push({title: 'Different milktypes on multiple condition', data: invalidConditionMilktype})
    }
    if(invalidMilktypeCalorie.length > 0){
      mappingStore.errors.push({title: 'Calorie not in range ', data: invalidMilktypeCalorie})
    }
    if(invalidNonMilktypeCalorie.length > 0){
      mappingStore.errors.push({title: 'Calorie not in range ', data: invalidNonMilktypeCalorie})
    }
    mappingStore.errorDialog = true
  }
  else {
    mappingStore.setConfirmationDialogText('save-mapping','Save','Do you want to save your changes to the OPMR mapping rules?')
    mappingStore.toggleConfirmationDialog(true)
  }
}

const findDuplicates = (arr) => {
  const seen = new Set();
  const duplicates = [];

  for (const item of arr) {
    const type = item.type.toLowerCase().trim()
    const productRef = item.productReference.toLowerCase().trim();
    const key = `${type}-${productRef}`;
      if (seen.has(key)) {
          duplicates.push(item); // Store the duplicate
      } else {
          seen.add(key);
      }
  }
  return duplicates;
}


const checkForEmptyReference = (arr) => {
  const isEmpty = arr.filter(item => item.productReference === "").length;
  return isEmpty
}

const checkForFortifiedBreastMilkWithoutFortifier = (arr) => {
  const withoutFortifiers = [];
  arr.forEach(element => {
    if(element.fortified){
      element.conditions.forEach( condition => {
        if(condition.FortifierKey.length <= 0){
          withoutFortifiers.push(`${element.productReference} (${element.type} - ${element.isBreastMilk ? 'Breast Milk' : ''})`)
        }
      })
    }
  });

  return withoutFortifiers
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
                  "Milk-Type": condition['milktype'],
                  "Product-Name": additiveIndex === 0 ? condition["reference"] : "",
                  "Additive": additive["fortifierKey"],
                  "Mix-To": additive['calOzEnd'],
                  "isBreastMilk": item['isBreastMilk'] ? 1 : ''
                });
              });
            } else {
              feed_base.push({
                "Feed-Base-Reference": conditionIndex === 0 ? item["productReference"] : "",
                "Caloric-Rule": getCalories(condition["calories"]),
                "Milk-Type": condition['milktype'],
                "Product-Name": condition["reference"],
                "Additive": "",
                "Mix-To": "",
                "isBreastMilk": item['isBreastMilk'] ? 1 : ''
              });
            }
          });
        } else {
          feed_base.push({
            "Feed-Base-Reference": item["productReference"],
            "Caloric-Rule": "",
            "Milk-Type": "",
            "Product-Name": "",
            "Additive": "",
            "Mix-To": "",
            "isBreastMilk": item['isBreastMilk']
          });
        }
      }
      else {
        if(item.conditions && item.conditions.length > 0){ // check conditions if not null
          item.conditions.forEach((condition, conditionIndex) => { // loop thru conditions array
            if(condition.FortifierKey && condition.FortifierKey.length > 0){ //check fortifier array if not null
              condition.FortifierKey.forEach((additive, additiveIndex) => { // loop thru fortifier array
                fortifiers.push({
                  "Feed-Base-Reference": (conditionIndex === 0 && additiveIndex === 0) ? item["productReference"] : "",
                  "Calorie-Rule": additiveIndex === 0 ? getCalories(condition["calories"]) : "",
                  "IsModular": additiveIndex === 0 ? (condition['isModular'] ? 1 : 0) : "",
                  "Additive": additive["fortifierKey"],
                  "Mix-To": additive['calOzEnd']
                });
              });
            }
            else{
              fortifiers.push({
                "Feed-Base-Reference": conditionIndex === 0 ? item["productReference"] : "",
                "Calorie-Rule": getCalories(condition["calories"]),
                "IsModular": condition['isModular'] ? 1 : 0,
                "Additive": "",
                "Mix-To": ""
              });
            }
          });
        } else {
          fortifiers.push({
            "Feed-Base-Reference": item["productReference"],
            "Calorie-Rule": "",
            "IsModular": "",
            "Additive": "",
            "Mix-To": ""
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

const checkValidMilkTypeCondition = (arr) => {
  var invalidConditions = []
  if(mappingStore.useMilkTypes){
    arr.forEach(mapping => {
      if(mapping.isBreastMilk){
        if(mapping.conditions.length > 0){
          if(mapping.conditions[0].milktype){
            var lastMilkType = mapping.conditions[0].milktype
            mapping.conditions.forEach( cond => {
              if(cond.milktype != lastMilkType){
                invalidConditions.push(`Milktype must be the same on the first condition (${mapping.type} - ${mapping.productReference})`)
              }
            })
          }
        }
      }
    })
  }
  return invalidConditions
}

const checkMilkTypeCaloricValue = (arr) => {
  //if milktype check caloric value on milktype min max calorie disregard checking if fortified
  var invalidCalMilkType = []
  if(mappingStore.useMilkTypes){
    arr.forEach(mapping => {
      if(mapping.isBreastMilk && !mapping.fortified){
        mapping.conditions.forEach( cond => {
          if(cond.milktype){
            const milktype = mappingStore.milktypes.find(obj => obj.milktypeName.toLowerCase() === cond.milktype.toLowerCase())
            const isValidCal = mappingStore.checkCaloricRangeFromGivenArray(getCalories(cond.calories), milktype)
            if(!isValidCal){
              invalidCalMilkType.push(`Invalid calorie range for ${cond.milktype} (${mapping.productReference} - ${mapping.type})`);
            }
          }
        })
      }
    })
  }

  return invalidCalMilkType;
}

const checkNonMilkTypeCaloricValue = (arr) => {
  //milktype unsupported !!!
  var invalidCal = []
  if(!mappingStore.useMilkTypes){
    arr.forEach(mapping => {
      if(mapping.isBreastMilk && mappingStore.appsettings.donor_allow_feed_orders_with_custom_cal_oz && !mapping.fortified){
        mapping.conditions.forEach( cond => {
          const isValidCal = mappingStore.checkCaloricRangeFromGivenArray(getCalories(cond.calories), mappingStore.appsettings.donor_cal_oz_options)
          if(!isValidCal){
            invalidCal.push(`Invalid calorie range (${mapping.productReference} - ${mapping.type}) Accepted value: [${mappingStore.appsettings.donor_cal_oz_options[0]} ... ${mappingStore.appsettings.donor_cal_oz_options[mappingStore.appsettings.donor_cal_oz_options.length - 1]}]`)
          }
        })
      }
    })
  }
  return invalidCal
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
      <!-- <v-btn
        color="primary"
        @click="drawer = true"
      >
        <v-icon
          :icon="mdiInformation"
        ></v-icon>
      </v-btn>
      <span class="opmr__spacer__h"></span> -->
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
          <v-list-item @click="mappingStore.setEmptyMapping('Feed Base', false)">
            <v-list-item-title>Feed Base</v-list-item-title>
          </v-list-item>
          <v-list-item @click="mappingStore.setEmptyMapping('Feed Base', true)">
            <v-list-item-title>Feed Base - Breast Milk</v-list-item-title>
          </v-list-item>
          <v-list-item @click="mappingStore.setEmptyMapping('Fortifier', false)">
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