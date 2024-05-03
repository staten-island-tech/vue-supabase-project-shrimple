<!-- this is INTEGRAL to the success of soap smiles -->
<template>
  <div>
    <h1>hello world!</h1>
  </div>
  <div class="container rounded">
    <div
      class="flex flex-row gambleContainer"
      ref="gambleContainer"
      :style="{ transitionDuration: `${transition}ms` }"
    >
      <div
        class="gamble"
        :class="(index % items.length) % 2 ? 'color' : null"
      >
        {{ items[index % items.length] }}
      </div>
      <div
        class="gamble"
        :class="((index + 1) % items.length) % 2 ? 'color' : null"
      >
        {{ items[(index + 1) % items.length] }}
      </div>
      <div
        class="gamble"
        :class="((index + 2) % items.length) % 2 ? 'color' : null"
      >
        {{ items[(index + 2) % items.length] }}
      </div>
      <div
        class="gamble"
        :class="((index + 3) % items.length) % 2 ? 'color' : null"
      >
        {{ items[(index + 3) % items.length] }}
      </div>
      <div
        class="gamble"
        :class="((index + 4) % items.length) % 2 ? 'color' : null"
      >
        {{ items[(index + 4) % items.length] }}
      </div>
      <div
        class="gamble"
        :class="((index + 5) % items.length) % 2 ? 'color' : null"
      >
        {{ items[(index + 5) % items.length] }}
      </div>
      <div
        class="gamble"
        :class="((index + 6) % items.length) % 2 ? 'color' : null"
      >
        {{ items[(index + 6) % items.length] }}
      </div>
    </div>
    <span class="pointer font-mono">|</span>
  </div>
  <button @click="spin">spin</button>
  <!-- debug!!!!!! not accurate with final shift -->
  <code>{{ items[(index + 3) % items.length] }}</code>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
const items = reactive([1, 2, 3, 4, 5, "💣"]);
const index = ref(2);
const magic = 108;
const gambleContainer = ref();
const transition = ref(0);

async function spin() {
  let speen = Math.ceil(Math.random() * (items.length * 20 + 1)) + 299;
  // let speen = 1;
  while (speen > 1) {
    // use desmos to get a function
    speen--;
    await shift(750 / (speen - 0.99) ** 0.05 - 600);
  }
  speen--;
  await fakeShift();
}

async function shift(ms: number) {
  if (isNaN(ms)) ms = 750;
  if (ms < 0) ms = 10;
  const anim = gambleContainer.value.animate([{ transform: `translateX(-${magic}px)` }, { transform: `translateX(${-magic - 100}px)` }], {
    duration: ms,
    iterations: 1,
  });
  await anim.finished;
  index.value++;
  if (index.value >= items.length) index.value = 0;
  gambleContainer.value.style.transform = `translateX(-${magic}px)`;
}

async function fakeShift() {
  // 50-149 (left edge to just before right edge)
  const far = Math.ceil(Math.random() * 100) + 49;
  const anim = gambleContainer.value.animate([{ transform: `translateX(${-magic}px)`, easing: "ease-out" }, { transform: `translateX(${-magic - far}px)` }], {
    duration: 750 * (far / 100),
    iterations: 1,
  });
  await anim.finished;
  transition.value = 0;
  gambleContainer.value.style.transform = `translateX(${-magic - far + 100}px)`;
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
  height: 108px;
  border: 4px solid rgb(101, 101, 101);
  overflow-x: clip;
}

.gambleContainer {
  transition-property: transform;
  transition-timing-function: ease-out;
  transform: translateX(-108px);
}

.gamble {
  min-width: 100px;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.color {
  background-color: cyan;
}

.pointer {
  position: relative;
  left: 238px;
  bottom: 10px;
  color: red;
}
</style>
