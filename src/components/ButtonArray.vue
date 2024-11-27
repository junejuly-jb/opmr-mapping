<script setup>
import { useMappingStore } from '@/stores/mappings';
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
          icon="mdi-plus"
          end
        ></v-icon>
      </v-btn>
      <span class="opmr__spacer__h"></span>
      <span v-if="!mappingStore.isSearching">
        <v-btn
          color="primary"
          @click="mappingStore.toggleSearch"
        >
          Search
          <v-icon
            icon="mdi-magnify"
            end
          ></v-icon>
        </v-btn>
      </span>
      <span v-else>
        <v-btn
          color="error"
          @click="mappingStore.toggleSearch"
        >
          Cancel
          <v-icon
            icon="mdi-close"
            end
          ></v-icon>
        </v-btn>
      </span>
      <span class="opmr__spacer__h"></span>
      <v-btn
        color="primary"
        @click="mappingStore.toggleFileUploadDialog"
      >
        Import File
        <v-icon
          icon="mdi-upload"
          end
        ></v-icon>
      </v-btn>
      <span class="opmr__spacer__h"></span>
      <v-btn
        color="success"
      >
        Save
        <v-icon
          icon="mdi-check"
          end
        ></v-icon>
      </v-btn>
    </div>
</template>
<style scoped>
.opmr__spacer__h{
  padding: 0px 20px;
}
.opmr__spacer__v{
  padding: 20px 0px;
}
</style>