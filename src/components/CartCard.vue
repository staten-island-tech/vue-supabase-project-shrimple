<template>
  <div
    v-if="item"
    class="card rounded-md p-4 flex-col sm:flex-row sm:gap-10 md:justify-between items-center md:items-start flex-grow w-full dark:text-white border-2 border-black dark:border-white"
  >
    <img
      :src="item.image"
      :aria-labelledby="props.item_id"
      class="image"
    />
    <div class="details">
      <h2 :id="props.item_id">{{ item.name }}</h2>
      <div class="flex flex-row items-center gap-2">
        <h3>
          <label for="quantity"> quantity: </label>
        </h3>
        <div class="quantity drop-shadow-md dark:*:dark-shadow-md">
          <button
            class="button minus"
            @click="change(qty - 1)"
            aria-label="decrease quantity"
          >
            <v-icon
              name="pr-minus"
              scale="0.55"
            />
          </button>
          <input
            type="number"
            id="quantity"
            min="1"
            :max="item.stock"
            @change="change(qty)"
            v-model="qty"
            ref="input"
            :style="`transform: translateY(-${offset}px)`"
          />
          <button
            class="button plus"
            @click="change(qty + 1)"
            aria-label="increase quantity"
          >
            <v-icon
              name="pr-plus"
              scale="0.75"
            />
          </button>
        </div>
      </div>
      <span
        >total cost: ${{ item.price }} × {{ qty }} = <output class="font-bold">${{ item.price * qty }}</output>
      </span>
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
  const response = await supabase.from("items").select("image, name, stock, price").eq("id", props.item_id);
  if (!response.data) return;
  item.value = response.data[0] as Item;
  change(qty.value);
});

import { useCartStore } from "@/stores/cart";
const cartStore = useCartStore();
const input: Ref<HTMLElement | null> = ref(null);
async function change(val: number) {
  // to the skies!!
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
  display: flex;
  justify-content: space-between;
}

.card .image {
  @apply max-h-[30rch] md:max-h-[20rex];
}

.card .details {
  @apply flex flex-col items-center md:items-end justify-between gap-2;
}

.card .quantity {
  @apply flex flex-row gap-2 items-center;
}

.card .details h2 {
  font-size: 2rem;
}

.card .details input {
  @apply border rounded font-semibold;
  height: 2rem;
  text-align: center;
  transition-duration: 30ms;
}

.card .details button {
  width: 2rem;
  height: 2rem;
  @apply flex items-center justify-center;
  transition-duration: 30ms;
}
</style>
