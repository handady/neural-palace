import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store.js";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 注册swiper
import { register } from "swiper/element/bundle";
register();

// 注册markdown编辑器
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";

const app = createApp(App);

// 注册组件
app.use(ElementPlus);
app.use(mavonEditor);

app.use(router).use(store).mount("#app");
