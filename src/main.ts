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
import { PrMinus, PrPlus, PrSave, PrUpload, PrTimes, PrTrash } from "oh-vue-icons/icons";

addIcons(PrMinus, PrPlus, PrSave, PrUpload, PrTimes, PrTrash);

app.component("v-icon", OhVueIcon);
