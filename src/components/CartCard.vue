<template>
  <div>
    <code>{{ item }}</code>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import type { Item } from "@/types/interface";
const props = defineProps({
  item_id: String,
});
import { supabase } from "../../utils/supabase";

const item: Ref<Item | undefined> = ref();

onMounted(async () => {
  const response = await supabase.from("items").select().eq("id", props.item_id);
  if (!response.data) return;
  item.value = response.data[0] as Item;
});
</script>

<style scoped></style>
