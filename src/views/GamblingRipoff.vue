<!-- this is INTEGRAL to the success of soap smiles -->
<template>
  <div>
    <h1>hello world!</h1>
  </div>
  <div
    class="container"
    v-if="ready"
  >
    <div
      class="flex flex-row gambleContainer items-end transform-gpu"
      ref="gambleContainer"
      :style="{ transitionDuration: `${transition}ms` }"
    >
      <div
        v-for="vindex in 8"
        :key="vindex"
        class="gamble flex flex-col p-2"
        :class="(index + vindex) % 2 ? 'color' : null"
      >
        <span>{{ items[(index + vindex - 1) % items.length].name }}</span>
        <img :src="images[items[(index + vindex - 1) % items.length].name]" />
      </div>
    </div>
    <span class="pointer font-mono">^</span>
  </div>
  <button
    @click="spin"
    class="w-32"
  >
    spin
  </button>
  <!-- <div v-if="ready">
    <code>{{ items[(index + 3) % items.length].name }}</code>
  </div> -->
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
let items: any[] = reactive([]);
const index = ref(2);
const width = 90 / 6;
const gambleContainer = ref();
const transition = ref(0);
const ready = ref(false);
const images: { [key: string]: string } = reactive({});

async function spin() {
  let speen = Math.ceil(Math.random() * items.length * 2) + 349;
  // let speen = 10;
  while (speen > 1) {
    // use desmos to get a function
    speen--;
    await shift(getDelay(speen));
  }
  speen--;
  await fakeShift();
}

function getDelay(count: number) {
  let ms = 750 / (0.1 * (count + 10) ** 0.9) - 30;
  if (isNaN(ms)) ms = 1000;
  if (ms > 400) ms = 400 + (ms - 400) * 0.75;
  ms = Math.max(10, ms);
  return ms;
}

async function shift(ms: number) {
  const anim = gambleContainer.value.animate([{ transform: `translateX(${width / 2}vw)`, easing: "linear" }, { transform: `translateX(${-width * 0.5}vw)` }], {
    duration: ms,
    iterations: 1,
  });
  await anim.finished;
  index.value++;
  if (index.value >= items.length) index.value = 0;
  gambleContainer.value.style.transform = `translateX(${-width}vw)`;
}

async function fakeShift() {
  // left edge to just before right edge
  const far = Math.floor(Math.random() * width) + Math.ceil(width * 0.5);
  // const far = Math.ceil(width * 0.5);
  // const far = Math.floor(width * 1.5);
  const anim = gambleContainer.value.animate(
    [{ transform: `translateX(${width / 2}vw)`, easing: "linear" }, { transform: `translateX(${width / 2 - far}vw)` }],
    {
      duration: getDelay(0),
      iterations: 1,
    }
  );
  await anim.finished;
  transition.value = 0;
  gambleContainer.value.style.transform = `translateX(${-far + width * 1.5}vw)`;
  index.value++;
  if (index.value >= items.length) index.value = 0;
  await wait(1000);
  transition.value = 1000;
  gambleContainer.value.style.transform = `translateX(${width / 2}vw)`;
}

async function wait(ms: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function blobToBase(blob: Blob) {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
}

import { supabase } from "../../utils/supabase";
import { get } from "http";
onMounted(async () => {
  const data = (await supabase.from("items").select("name, image")).data;
  if (!data) return;
  data.forEach(async (item: { name: string; image: string }) => {
    item.image = item.image.replace("q_90", "q_30");
    const blob = await (await fetch(item.image)).blob();
    images[item.name] = (await blobToBase(blob)) as string;
  });
  items = data;
  ready.value = true;
});
</script>

<style scoped>
.container {
  box-sizing: border-box;
  max-width: 90vw;
  margin: 0 auto;
  /* border: black 2px solid; */
  align-items: center;
  @apply flex flex-col overflow-clip;
}

.gambleContainer {
  transition-property: transform;
  transition-timing-function: ease-out;
  border-bottom: black 2px solid;
  transform: translateX(7.5vw);
}

.gamble {
  min-width: calc(90vw / 6);
  height: 200px;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  background-image: linear-gradient(to top, gray, white);
}

.gamble img {
  max-width: 80%;
  max-height: 80%;
}

.color {
  background-image: linear-gradient(to top, lightgray, white);
}

.pointer {
  font-size: xx-large;
  position: relative;
  /* left: calc(50% - 4px); */
  transform: translateY(-14px);
  color: black;
  z-index: 100;
}
</style>
