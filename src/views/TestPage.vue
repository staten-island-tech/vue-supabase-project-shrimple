<template>
  <div class="flex flex-col items-center">
    <h1 class="font-serif">as shrimple as that</h1>
    <output class="font-mono">{{ counter }}</output>
    <div class="flex flex-wrap justify-around w-11/12 gap-1">
      <button
        v-for="i in counter"
        @click="counter++"
        class="bg-blue-200 p-2 rounded-xl hover:bg-blue-100 transition-colors duration-300 ring-2 ring-inset flex-grow"
      >
        shrimple
      </button>
    </div>
    <p v-for="country in countries">{{ country }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
const counter = ref(1);
import { supabase } from "../../utils/supabase";
const countries: Ref<Array<any> | null> = ref([]);

async function getCountries() {
  const { data } = await supabase.from("countries").select();
  countries.value = data;
}

onMounted(() => {
  getCountries();
});
</script>

<style scoped></style>
