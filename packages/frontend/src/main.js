import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store.js";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App);

// 注册组件
app.use(ElementPlus);

app.use(router).use(store).mount("#app");
