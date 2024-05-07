<template>
  <div v-if="loaded">
    <h1 class="font-bold underline">orders (oldest first)</h1>
    <div class="flex flex-row gap-2">
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
            class="border border-black rounded bg-slate-100"
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
        class="border border-black rounded-md bg-slate-100 p-4 flex flex-col gap-2 h-fit w-full"
      >
        <h2>edit order {{ selected.id }}:</h2>
        <div class="flex flex-col">
          <label>
            status:
            <input v-model="selected.status" />
          </label>
          <label class="flex flex-col">
            notes:
            <textarea v-model="selected.notes"></textarea>
          </label>
          <div>
            <h3>cart:</h3>
            <p
              v-for="item in cart"
              :key="item"
            >
              {{ item }}
            </p>
          </div>
        </div>
        <p>contact information: {{ contact }}</p>
        <div class="flex flex-row gap-2">
          <button @click="save">
            <v-icon name="pr-save"></v-icon>
            SAVE ORDER
          </button>
          <button>
            <v-icon name="pr-trash"></v-icon>
            DELETE ORDER
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from "vue";
import { supabase } from "../../../utils/supabase";
import type { Order } from "@/types/interface";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type Rdr = Optional<Order, "notes" | "data" | "user_id">;
let orders: Array<Rdr> = reactive([]);
const loaded = ref(false);
const all = ref(false);

const selected: Ref<Order | undefined> = ref();
let cart: Ref<Array<string>> = ref([]);
const contact: Ref<string> = ref("");

onMounted(async () => {
  // oldest orders first
  const response = await supabase.from("orders").select("id, status, created_at").order("created_at");
  if (response.error) return;
  orders = response.data;
  loaded.value = true;
});

async function getOrder(order: Rdr) {
  contact.value = "";
  cart.value = [];
  const { data, error } = await supabase.from("orders").select().eq("id", order.id);
  if (error) return;
  selected.value = data[0] as unknown as Order;

  // get names
  for (const [id, qty] of Object.entries(selected.value.data)) {
    const { data, error } = await supabase.from("items").select("name").eq("id", id);
    if (!error) {
      const name = data[0].name;
      // reactive wasn't detecting the sane way of doing this
      cart.value.push(`${qty} × ${name}`);
    }
  }

  {
    const { data, error } = await supabase.from("users").select().eq("user_id", selected.value.user_id);
    if (!error) {
      console.log(data);
      contact.value = data[0] ? data[0].contact : "NONE";
    }
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
    const { data, user_id, notes, ...saveOrder } = selected.value;
    orders = orders.filter((order) => order.id !== id);
    orders.push(saveOrder);
    if (selected.value.status === "fulfilled") selected.value = undefined;
  }
}
</script>

<style scoped></style>
