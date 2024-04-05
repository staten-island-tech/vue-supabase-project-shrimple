<template>
  <div class="bg-slate-200 p-4 border border-black flex flex-col">
    <div v-for="key in Object.keys(fields)" :key="key">
      <label v-if="key !== 'id'">{{ key }}<textarea v-model="fields[key as keyof typeof item]"></textarea></label>
    </div>
    <button @click="save">SAVE CHANGES</button>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import type { Item } from "../types/interface";
import { supabase } from "../../utils/supabase";
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
});
const fields = props.item;

async function save() {
  await supabase.from("items").update(fields).eq("id", props.item.id);
}
</script>

<style scoped></style>
