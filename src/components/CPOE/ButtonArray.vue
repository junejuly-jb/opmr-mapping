<script setup>
import { useMappingStore } from '../../stores/mappings';
import { mdiPlus, mdiFile, mdiCheck, mdiDownload } from '@mdi/js';

const mappingStore = useMappingStore();
const handleSave = () => {
  mappingStore.setConfirmationDialogText('Save','Do you want to save your changes to the OPMR mapping rules?')
  mappingStore.toggleConfirmationDialog(true)
}
</script>
<template>
    <div class="opmr__spacer__v">
      <span class="opmr__spacer__h"></span>
      <!-- <v-btn
        color="primary"
        @click="mappingStore.setEmptyMapping"
      >
        Mapping Rule
        <v-icon
          :icon="mdiPlus"
          end
        ></v-icon>
      </v-btn> -->
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