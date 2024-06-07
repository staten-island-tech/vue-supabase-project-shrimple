<template>
  <RouterLink :to="url"
    class="bg-slate-200 dark:bg-slate-800 p-4 border border-black dark:border-white flex flex-col cursor-pointer hover:shadow-2xl transition-shadow duration-100 ease-linear rounded-lg flex-grow w-max"
  >
    <div>
      <h2 class="text-lg">{{ props.item.name }}</h2>
      <h2 class="font-mono">${{ props.item.price }}</h2>
    </div>
    <div class="flex flex-grow justify-around align-center">
      <img :src="props.item.image" />
    </div>
    <!-- <code>{{ props.item.id }}</code> -->
  </RouterLink>
</template>

<script setup lang="ts">
import { onMounted, type PropType, ref } from "vue";
import type { Item } from "../types/interface";
import { RouterLink } from "vue-router";
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
});

const url = ref("/")
onMounted(() => {
  url.value = `/item/${props.item.id}?${props.item.name}`
})
</script>

<style scoped>
img {
  max-width: 360px;
  height: auto;
}
</style>
