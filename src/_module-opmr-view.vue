<script setup>
  import { mdiMagnify } from '@mdi/js';
  import MappingList from './components/CPOE/MappingList.vue';
  import { useMappingStore } from './stores/mappings';
  import ButtonArray from './components/CPOE/ButtonArray.vue';
  import FileUpload from './components/CPOE/Dialogs/FileUpload.vue';
  import { onMounted } from 'vue';
  import Notification from './components/CPOE/Notification.vue';

  const mappingStore = useMappingStore()
  onMounted(() => { 
    mappingStore.getMappings()
    mappingStore.getProducts()
  })
</script>

<template>
  <div>
    <Notification/>
    <FileUpload/>
    <div class="cpoe__heading">
      <h2>OPMR Mapping Rules</h2>
    </div>
    <ButtonArray/>
    <div class="opmr__pagination__search">
      <div class="search">
        <v-text-field v-model="mappingStore.searchTerm" density="compact" label="Search" variant="outlined" clearable :prepend-inner-icon="mdiMagnify"></v-text-field>
      </div>
      <div class="pagination">
        <v-pagination
          v-model="mappingStore.currentPage"
          :length="Math.ceil(mappingStore.mappings.length / mappingStore.itemsPerPage)"
          total-visible="3"
        ></v-pagination>
      </div>
    </div>
    <div v-if="mappingStore.unSavedChanges" class="mx-5">
      <v-alert variant="outlined" class="w-50" type="warning">
        There are unsaved changes on your mapping. Please hit Save before closing
      </v-alert>
    </div>
    <div v-for="(mapping, index) in mappingStore.filteredPaginatedItems">
      <MappingList :index="index" :mapping="mapping"></MappingList>
    </div>
  </div>
</template>

<style>
  .cpoe__heading{
    padding: 10px 20px;
    background-color: rgb(28, 42, 75);
    color: white;
  }
  .opmr__pagination__search{
    display: flex;
    padding: 0px 20px;
  }
  .search{
    width: 30%;
  }
  .pagination{
    width: 50%;
    margin-left: auto;
  }
  .v-pagination__list{
    justify-content: right !important;
  }
</style>
