<template>
  <div class="bg-slate-200 w-1/3 h-1/3 p-4 border border-black flex flex-col cursor-pointer" @click="go">
    <h2 class="text-lg">{{ props.item.name }}</h2>
    <h2 class="font-mono">${{ props.item.price }}</h2>
    <img :src="props.item.image" />
    <code>{{ props.item.id }}</code>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { Item } from "../types/interface";
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
});

function go() {
  window.location.assign(`${window.location.origin}/item/${props.item.id}?${props.item.name}`);
}
</script>

<style scoped></style>
