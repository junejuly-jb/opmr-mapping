<script setup>
  import { mdiMagnify } from '@mdi/js';
  import MappingList from './MappingList.vue';
  import { useMappingStore } from '@/stores/mappings';
  import ButtonArray from './ButtonArray.vue';
  import FileUpload from './Dialogs/FileUpload.vue';
  import { onMounted } from 'vue';

  const mappingStore = useMappingStore()
  onMounted(() => { mappingStore.setLocalStorage })
</script>

<template>
  <div>
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
