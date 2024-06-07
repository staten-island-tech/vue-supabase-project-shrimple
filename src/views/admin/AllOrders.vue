<template>
  <div v-if="loaded">
    <div class="w-full flex flex-col items-center">
      <h1 class="font-bold underline">orders (oldest first)</h1>
      <div class="flex flex-row gap-2 w-11/12">
        <div class="flex flex-col gap-2 min-w-40 max-w-40">
          <h2 class="italic">click an order below to start editing it</h2>
          <label class="flex">
            show fulfilled orders?
            <input
              type="checkbox"
              v-model="all"
            />
          </label>
          <div
            v-for="order in all ? orders : orders.filter((order) => order.status !== 'fulfilled')"
            :key="order.id"
          >
            <div
              @click="getOrder(order)"
              class="border rounded p-1 bg-slate-100 dark:bg-slate-800"
              :class="order.id === selected?.id ? 'border-cyan-500' : 'border-black dark:border-white'"
            >
              <p>
                order <span class="font-mono text-sm">{{ order.id }}</span>
              </p>
              <p class="font-bold">status: {{ order.status }}</p>
              <p class="font-bold">created: {{ new Date(order.created_at).toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <div
          v-if="selected"
          class="border border-black dark:border-white rounded-md p-4 flex flex-col gap-2 h-fit w-full transition-colors"
          :class="saved ? 'bg-slate-100 dark:bg-slate-800' : 'bg-red-100 dark:bg-red-950'"
        >
          <h2 class="font-mono text-sm text-gray-600 dark:text-gray-300">
            edit order {{ selected.id }}<span class="text-red-500">{{ saved ? "" : " (UNSAVED)" }}</span
            >:
          </h2>
          <div
            class="flex flex-col"
            @change="checkSave"
          >
            <label class="font-bold">
              status:
              <input
                v-model="selected.status"
                class="font-normal"
              />
            </label>
            <label class="flex flex-col font-bold">
              notes:
              <textarea
                v-model="selected.notes"
                class="font-normal"
              ></textarea>
            </label>
            <div>
              <h3 class="font-bold">cart:</h3>
              <p
                v-for="(qty, id) in cart"
                :key="id"
              >
                {{ items[id].name }} × {{ qty }} ({{ cart[id] }} × ${{ items[id].price }} = <span class="font-bold">${{ cart[id] * items[id].price }}</span
                >)
              </p>
              <div v-if="cost > 0">
                <p>
                  total cost: <span class="font-bold">${{ cost }}</span>
                </p>
              </div>
            </div>
          </div>
          <p class="font-bold">
            contact information: <span class="font-normal">{{ contact }}</span>
          </p>
          <div class="flex flex-row gap-2 buttons">
            <button @click="save">
              <v-icon name="pr-save"></v-icon>
              SAVE ORDER
            </button>
            <button
              @click="fulfill"
              v-if="selected.status !== 'fulfilled'"
            >
              <v-icon name="pr-check-square"></v-icon>
              FULFILL ORDER
            </button>
            <button @click="del">
              <v-icon name="pr-trash"></v-icon>
              DELETE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref, toRaw } from "vue";
import { supabase } from "../../../utils/supabase";
import type { Item, Order } from "@/types/interface";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type Rdr = Optional<Order, "notes" | "data" | "user_id">;
let orders: Ref<Array<Rdr>> = ref([]);
const loaded = ref(false);
const all = ref(false);

const selected: Ref<Order | undefined> = ref();
let cart: Ref<{
  [id: string]: number;
}> = ref({});
const contact: Ref<string> = ref("");
let lastSave: Order | undefined;
const saved = ref(true);
let items: { [id: string]: Optional<Item, "image" | "description"> } = {};
const cost = ref(0);

onMounted(async () => {
  // oldest orders first
  const response = await supabase.from("orders").select("id, status, created_at").order("created_at");
  if (response.error) return;
  orders.value = response.data;
  loaded.value = true;

  // get all items
  const { data, error } = await supabase.from("items").select("name, id, price, stock");
  if (!error) {
    data.forEach((item) => {
      items[item.id] = {
        name: item.name,
        price: item.price,
        stock: item.stock,
      } as Item;
    });
    console.log(items);
  }
});

async function getOrder(order: Rdr) {
  contact.value = "";
  cart.value = {};
  cost.value = 0;
  const { data, error } = await supabase.from("orders").select().eq("id", order.id);
  if (error) return;
  selected.value = data[0] as unknown as Order;
  console.log(selected.value.data);
  cart.value = selected.value.data;
  lastSave = structuredClone(toRaw(selected.value));

  // get contact of order's user
  {
    if (!selected.value) return;
    const { data, error } = await supabase.from("users").select().eq("user_id", selected.value.user_id);
    if (!error) {
      contact.value = data[0] ? data[0].contact : "NONE";
    }
  }

  // get price
  for (const [id, qty] of Object.entries(cart.value)) {
    cost.value += items[id].price * qty;
    console.log(cost.value);
  }
}

async function del() {
  if (!selected.value) return;
  const prompt = confirm(`are you sure you want to delete order ${selected.value.id}?`);
  if (!prompt) return;
  const { error } = await supabase.from("orders").delete().eq("id", selected.value.id);
  if (error) {
    alert("something went wrong");
  } else {
    // no ts. this is not undefined
    orders.value = orders.value.filter((order) => order.id !== selected.value!.id);
    selected.value = undefined;
  }
}

async function save() {
  if (!selected.value) return;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, user_id, created_at, ...slctd } = selected.value;
  const { error } = await supabase.from("orders").update(slctd).eq("id", id);
  if (error) {
    alert("something went wrong");
    return;
  }
  // i am tired. block scoping makes me sad
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, user_id, notes, ...saveOrder } = selected.value;
    orders.value.splice(
      orders.value.findIndex((order) => order.id === id),
      1,
      saveOrder
    );

    // lastSave is set in getOrder(), should never be undefined
    if (selected.value.status === "fulfilled" && lastSave?.status !== "fulfilled") selected.value = undefined;
  }
  lastSave = structuredClone(toRaw(selected.value));
  saved.value = true;
}

function checkSave() {
  saved.value = JSON.stringify(lastSave) === JSON.stringify(selected.value) || selected.value === undefined;
}

async function fulfill() {
  if (!selected.value) return;
  const stocks: {
    [id: string]: number;
  } = {};

  // https://stackoverflow.com/a/37576787  run fetches in parallel
  await Promise.all(
    Object.keys(cart.value).map(async (id) => {
      const { data, error } = await supabase.from("items").select("id, stock").eq("id", id);
      if (!error) {
        stocks[id] = data[0].stock;
      }
    })
  );

  const output = Object.entries(stocks)
    .map((item) => {
      const [id, qty] = item;
      console.log(item);
      return `${items[id].name}: ${qty} → ${qty - cart.value[id]}${qty - cart.value[id] < 0 ? " (!)" : ""}`;
    })
    .sort();

  const prompt = confirm(
    `
    are you sure you want to fullfil order ${selected.value.id}? this will mark the order as fulfilled and update the stock based on the order.\n
    affected items:\n${output.join("\n")}
    `
  );
  if (!prompt) return;

  await Promise.all(
    Object.entries(stocks).map((item) => {
      const [id, qty] = item;
      return supabase
        .from("items")
        .update({ stock: qty - cart.value[id] })
        .eq("id", id);
    })
  );

  selected.value.status = "fulfilled";
  await save();
}
</script>

<style scoped>
.buttons * {
  flex-grow: 1;
}
</style>
