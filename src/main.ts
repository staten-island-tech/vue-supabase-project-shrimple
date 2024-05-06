import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

import { OhVueIcon, addIcons } from "oh-vue-icons";
// use hero icons
import { HiMinus, HiPlus } from "oh-vue-icons/icons";

addIcons(HiMinus, HiPlus);

app.component("v-icon", OhVueIcon);
