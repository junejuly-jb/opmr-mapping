<script setup>
import { useMappingStore } from '@/stores/mappings';
import { mdiPlus, mdiFile, mdiCheck, mdiDownload } from '@mdi/js';

const mappingStore = useMappingStore();
</script>
<template>
    <div class="opmr__spacer__v">
      <span class="opmr__spacer__h"></span>
      <v-btn
        color="primary"
        @click="mappingStore.setEmptyMapping"
      >
        Mapping Rule
        <v-icon
          :icon="mdiPlus"
          end
        ></v-icon>
      </v-btn>
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
</style>