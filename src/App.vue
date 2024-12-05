<script setup>
import TheWelcome from './components/TheWelcome.vue'
import { onMounted} from 'vue'
import { useMappingStore } from '@/stores/mappings'
const mappingStore = useMappingStore();
onMounted(() => {
  mappingStore.setLocalStorage
})
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>

