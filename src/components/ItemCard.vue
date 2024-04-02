<template>
  <div class="bg-slate-200 w-1/3 h-1/3 p-4 border border-black flex flex-col">
    <h2>{{ props.item.name }}</h2>
    <h2>${{ props.item.price }}</h2>
    <p>{{ props.item.description }}</p>
    <p>{{ props.item.stock }} left in stock</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { PropType } from "vue";
import type { Item } from "../types/interface";
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
});
</script>

<style scoped></style>
