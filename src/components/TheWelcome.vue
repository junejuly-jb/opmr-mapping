<script setup>
  import MappingList from './MappingList.vue';
  import { useMappingStore } from '@/stores/mappings';
  const mappingStore = useMappingStore()

</script>

<template>
  <div>
    <div class="cpoe__heading">
      <h2>OPMR Mapping Rules</h2>
    </div>
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
        @click="mappingStore.getMappings"
      >
        File Upload
        <v-icon
          icon="mdi-cloud"
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
    <div class="opmr__search">
      <v-text-field v-if="mappingStore.isSearching" label="Search" variant="outlined" clearable prepend-inner-icon="mdi-magnify"></v-text-field>
    </div>
    <div v-for="(mapping, index) in mappingStore.mappings">
      <MappingList :index="index" :mapping="mapping"></MappingList>
    </div>
  </div>
</template>

<style scoped>
.cpoe__heading{
  padding: 10px 20px;
  background-color: rgb(28, 42, 75);
  color: white;
}
.opmr__spacer__h{
  padding: 0px 20px;
}
.opmr__spacer__v{
  padding: 20px 0px;
}
.opmr__search{
  max-width: 500px;
  padding: 5px 40px;
  transition: 0.5s ease-in-out;
}
</style>
