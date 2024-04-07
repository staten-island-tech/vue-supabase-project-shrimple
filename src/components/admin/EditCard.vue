<template>
  <div class="bg-slate-200 p-4 border-2 border-black flex flex-col gap-2">
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

    <div class="flex flex-col gap-2">
      <div v-if="fields.image">
        <label class="funny flex flex-row gap-2 items-center">
          <input type="checkbox" v-model="funny" />
          funny preview
        </label>
        <p>image preview</p>
        <img :src="fields.image" class="h-80" :class="funny ? 'w-full' : ''" />
      </div>
      <label class="button">
        ⬆ UPLOAD A NEW IMAGE
        <input type="file" @change="upload" accept="image/*" ref="fileInput" class="hidden" />
      </label>
    </div>

    <div class="flex gap-6">
      <button @click="save">💾 SAVE CHANGES</button>
      <button @click="emits('del', item.id)">🚮 DELETE ITEM</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, toRaw } from "vue";
import type { PropType } from "vue";
import type { Item } from "../../types/interface";
import { supabase } from "../../../utils/supabase";

const funny = ref(false);

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
});

const emits = defineEmits(["update", "del"]);

const fields: Partial<Item> = reactive(structuredClone(toRaw(props.item)));
delete fields.id;

async function save() {
  console.log("saving", fields, "to", props.item.id);
  // UNSAVED means it was created and does not exist on db, so don't add id so supabase does insert and makes its own id
  // otherwise, set id so supabase updates existing item
  const obj = fields;
  if (!props.item.id.startsWith("UNSAVED")) obj.id = props.item.id;

  const { data, error } = await supabase.from("items").upsert(obj, { ignoreDuplicates: false }).select();
  if (error) {
    alert(`did you know? every ${error.code} minutes in Africa, ${Number(error.code) * 60} seconds pass`);
    console.log(error);
  } else {
    emits("update", data[0].id, props.item.id);
    alert(`successfully saved item "${fields.name}"`);
  }
}

// BOO! import jumpscare!!
import { Cloudinary } from "@cloudinary/url-gen";
import { quality, format } from "@cloudinary/url-gen/actions/delivery";
import { auto } from "@cloudinary/url-gen/qualifiers/quality";
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_NAME,
  },
});
const fileInput = ref();
async function upload() {
  if (props.item.id.startsWith("UNSAVED")) {
    alert("Please save before adding an image!!");
    return;
  }
  const img = fileInput.value.files[0];
  if (!img.type.startsWith("image")) {
    alert("images only please");
    return;
  }
  const reader = new FileReader();
  reader.onloadend = async () => {
    if (!reader.result) return;
    const baseImg = reader.result.toString();
    // https://cloudinary.com/documentation/image_upload_api_reference#upload
    const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/upload`;
    const fd = new FormData();
    fd.append("upload_preset", "soap admin");
    fd.append("file", baseImg);
    const response = await fetch(url, {
      method: "POST",
      body: fd,
    });
    const responseData = JSON.parse(await response.text());
    console.log(responseData);
    const cldImg = cld.image(`${responseData.public_id}.${responseData.format}`);
    cldImg.delivery(quality(90)).delivery(format(auto()));
    fields.image = cldImg.toURL();
  };
  reader.readAsDataURL(img);
}
</script>

<style scoped>
input,
textarea {
  @apply border border-black;
}

label:not(.funny) {
  /* didn't laugh */
  @apply flex flex-col;
}
</style>