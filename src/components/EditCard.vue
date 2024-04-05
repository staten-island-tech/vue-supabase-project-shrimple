<template>
  <div class="bg-slate-200 p-4 border border-black flex flex-col gap-2">
    <code class="text-gray-500 text-xs">item {{ item.id }}</code>
    <label>
      name
      <input type="text" v-model="fields.name" />
    </label>
    <label>
      description
      <textarea v-model="fields.description"></textarea>
    </label>
    <label>
      price
      <input type="number" v-model="fields.price" min="0" />
    </label>
    <label>
      stock
      <input type="number" v-model="fields.stock" min="0" />
    </label>
    <label>
      image
      <input type="file" @change="upload" accept="image/png, image/jpeg" ref="fileInput" />
    </label>
    <button @click="save">SAVE CHANGES</button>
    <button @click="emits('del', item.id)">DELETE CARD</button>
  </div>
</template>

<script setup lang="ts">
import { ref, toRaw } from "vue";
import type { PropType } from "vue";
import type { Item } from "../types/interface";
import { supabase } from "../../utils/supabase";
const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
});

const emits = defineEmits(["update", "del"]);

const fields: Partial<Item> = structuredClone(toRaw(props.item));
delete fields.id;

async function save() {
  console.log("saving", fields, "to", props.item.id);
  // UNSAVED means it was created and does not exist on db, so don't add id so supabase does insert and makes its own id
  // otherwise, set id so supabase updates existing item
  const obj = fields;
  if (!props.item.id.startsWith("UNSAVED")) obj.id = props.item.id;

  const { data, error } = await supabase.from("items").upsert(obj, { ignoreDuplicates: false }).select();
  if (error) {
    alert(`
    something went wrong
    ${error}
    `);
  } else {
    emits("update", data[0].id, props.item.id);
    alert(`successfully saved item "${fields.name}"`);
  }
}

const fileInput = ref();
async function upload() {
  if (props.item.id.startsWith("UNSAVED")) {
    alert("Please save before adding an image!!");
    return;
  }
  const img = fileInput.value.files[0];
  const reader = new FileReader();
  reader.addEventListener("loadend", async () => {
    if (!reader.result) return;
    const baseImg = reader.result.toString();
    // https://cloudinary.com/documentation/image_upload_api_reference#upload
    const url = `https://api.cloudinary.com/v1_1/dy04q8t2b/upload`;
    const fd = new FormData();
    fd.append("upload_preset", "soap admin");
    fd.append("file", baseImg);
    fd.append("public_id", props.item.id);
    const response = await fetch(url, {
      method: "POST",
      body: fd,
    });
    const responseData = await response.text();
    fields.image = JSON.parse(responseData).url;
  });
  reader.readAsDataURL(img);
}
</script>

<style scoped>
label {
  @apply flex flex-col;
}

button {
  @apply bg-slate-100 w-fit p-2 self-center border border-black;
}
</style>
