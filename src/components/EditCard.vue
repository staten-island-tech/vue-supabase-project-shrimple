<template>
  <div class="bg-slate-200 p-4 border border-black flex flex-col">
    <code class="text-gray-500 text-xs">item {{ item.id }}</code>
    <div v-for="key in Object.keys(fields)" :key="key">
      <label>{{ key }}<textarea v-model="fields[key as keyof typeof item]" class="w-full"></textarea></label>
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
// props are read only...
const fields: Partial<Item> = structuredClone(props.item);
delete fields.id;

async function save() {
  console.log("saving", fields, "to", props.item.id);
  const { error } = await supabase.from("items").update(fields).eq("id", props.item.id);
  if (error) {
    alert(`
    something went wrong
    ${error}
    `);
  } else {
    alert(`successfully saved item "${fields.name}"`);
  }
}
</script>

<style scoped></style>
