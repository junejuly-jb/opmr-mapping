<script setup>
  import MappingList from './MappingList.vue';
  import { useMappingStore } from '@/stores/mappings';
  import ButtonArray from './ButtonArray.vue';
  import FileUpload from './Dialogs/FileUpload.vue';
  const mappingStore = useMappingStore()

</script>

<template>
  <div>
    <FileUpload/>
    <div class="cpoe__heading">
      <h2>OPMR Mapping Rules</h2>
    </div>
    <ButtonArray/>
    <v-pagination
      v-model="mappingStore.currentPage"
      :length="Math.ceil(mappingStore.mappings.length / mappingStore.itemsPerPage)"
      total-visible="3"
    ></v-pagination>
    <div class="opmr__search">
      <v-text-field v-model="mappingStore.searchTerm" density="compact" v-if="mappingStore.isSearching" label="Search" variant="outlined" clearable prepend-inner-icon="mdi-magnify"></v-text-field>
    </div>
    <div v-for="(mapping, index) in mappingStore.filteredPaginatedItems">
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
.opmr__search{
  max-width: 500px;
  padding: 5px 40px;
  transition: 0.5s ease-in-out;
}
</style>
