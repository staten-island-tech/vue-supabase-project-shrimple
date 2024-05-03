<!-- this is INTEGRAL to the success of soap smiles -->
<template>
  <div>
    <h1>hello world!</h1>
  </div>
  <div class="container p-2">
    <div
      class="gap-2 flex flex-row gambleContainer"
      ref="gambleContainer"
      :style="{ transitionDuration: `${transition}ms` }"
    >
      <div class="gamble">{{ items[index % items.length] }}</div>
      <div class="gamble">{{ items[(index + 1) % items.length] }}</div>
      <div class="gamble">{{ items[(index + 2) % items.length] }}</div>
      <div class="gamble">{{ items[(index + 3) % items.length] }}</div>
      <div class="gamble">{{ items[(index + 4) % items.length] }}</div>
      <div class="gamble">{{ items[(index + 5) % items.length] }}</div>
      <div class="gamble">{{ items[(index + 6) % items.length] }}</div>
    </div>
    <span class="pointer font-mono">|</span>
  </div>
  <code>index: {{ index }}</code>
  <code>value: {{ items[index + 3] }}</code>
  <code>offset: {{ offset }}</code>
  <button @click="spin">spin</button>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
const items = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
const index = ref(0);
const magic = 24 + 108;
const offset = ref(magic);
const gambleContainer = ref();
const transition = ref(0);

async function spin() {
  let speen = 50;
  while (speen > 1) {
    // use desmos to get a function
    speen--;
    await shift(700 / (speen - 0.99) ** 0.05 - 500);
  }
  speen--;
  await fakeShift();
}

async function shift(ms: number) {
  if (isNaN(ms)) ms = 600;
  if (ms < 0) ms = 10;
  const anim = gambleContainer.value.animate([{ transform: `translateX(-${magic}px)` }, { transform: `translateX(${-magic - 108}px)` }], {
    duration: ms,
    iterations: 1,
  });
  await anim.finished;
  index.value++;
  if (index.value >= items.length) index.value = 0;
  gambleContainer.value.style.transform = `translateX(-${magic}px)`;
}

async function fakeShift() {
  const far = Math.ceil(Math.random() * 84) + 63;
  const anim = gambleContainer.value.animate([{ transform: `translateX(-${magic}px)`, easing: "ease-out" }, { transform: `translateX(${-magic - far}px)` }], {
    duration: 1200,
    iterations: 1,
  });
  await anim.finished;
  transition.value = 0;
  gambleContainer.value.style.transform = `translateX(${-magic - far + 108}px)`;
  index.value++;
  if (index.value >= items.length) index.value = 0;
  await wait(1000);
  transition.value = 1000;
  gambleContainer.value.style.transform = `translateX(${-magic}px)`;
}

async function wait(ms: number) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
</script>

<style scoped>
.container {
  box-sizing: border-box;
  max-width: 500px;
  border: 4px solid black;
  overflow-x: clip;
}

.gambleContainer {
  transition-property: transform;
  transition-timing-function: ease-out;
  transform: translateX(-24px);
}

.gamble {
  min-width: 100px;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  @apply rounded;
}

.pointer {
  position: relative;
  left: 238px;
  bottom: 10px;
}
</style>
