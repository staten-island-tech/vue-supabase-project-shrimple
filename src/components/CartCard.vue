<template>
  <div
    v-if="item"
    class="card"
  >
    <img
      :src="item.image"
      class="image"
    />
    <div class="details">
      <h2>{{ item.name }}</h2>
      <div class="quantity">
        <button
          class="button minus"
          @click="change(qty - 1)"
        >
          <v-icon
            name="hi-minus"
            scale="0.5"
          />
        </button>
        <input
          type="number"
          min="0"
          :max="item.stock"
          @change="change(qty)"
          v-model="qty"
          ref="input"
          :style="`transform: translateY(-${offset}px)`"
        />
        <button
          class="button plus"
          @click="change(qty + 1)"
        >
          <v-icon
            name="hi-plus"
            scale="0.5"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import type { Item } from "@/types/interface";
const props = defineProps({
  item_id: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
const emits = defineEmits(["explode"]);
import { supabase } from "../../utils/supabase";

const item: Ref<Item | undefined> = ref();
const qty = ref(props.quantity);
const offset = ref(0);

onMounted(async () => {
  const response = await supabase.from("items").select("image, name, stock").eq("id", props.item_id);
  if (!response.data) return;
  item.value = response.data[0] as Item;
  change(qty.value);
});

import { useCartStore } from "@/stores/cart";
const cartStore = useCartStore();
const input: Ref<HTMLElement | null> = ref(null);
async function change(val: number) {
  if (val > item.value!.stock) {
    val = item.value!.stock;
    offset.value += 4;
  } else {
    offset.value = 0;
  }
  if (val < 1) {
    const user = confirm(`are you sure you want to remove ${item.value!.name} from your cart?`);
    if (user) {
      delete cartStore.cart[props.item_id];
      emits("explode", props.item_id);
    }
  } else {
    if (val !== qty.value && input.value) {
      const sign = val > qty.value ? "-" : "";
      input.value.animate([{ transform: `translateY(0px)` }, { transform: `translateY(${sign}4px)` }], {
        duration: 30,
        iterations: 2,
        direction: "alternate",
        easing: "ease-out",
      });
    }
    cartStore.cart[props.item_id] = qty.value = val;
  }
  cartStore.saveCart();
}
</script>

<style scoped>
.card {
  @apply bg-slate-100 rounded-md p-2 w-11/12 flex-col md:flex-row  md:justify-between items-center md:items-start;
  border: 2px black solid;
  display: flex;
  justify-content: space-between;
}

.card .image {
  @apply max-h-[30rch] md:max-h-[20rex];
}

.card .details {
  @apply flex flex-col items-center md:items-end;
}

.card .quantity {
  @apply flex flex-row gap-2;
}

.card .quantity * {
  @apply drop-shadow-md;
}

.card .details h2 {
  font-size: 2rem;
}

.card .details input {
  text-align: center;
  @apply border border-black rounded;
  transition-duration: 30ms;
}

.card .details button {
  width: 2rem;
  height: 2rem;
  @apply bg-white flex items-center justify-center;
}
</style>
