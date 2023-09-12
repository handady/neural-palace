import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home";
import Neuron from "@/views/Neuron/Neuron";
import SceneEditor from "@/components/SceneEditor";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: "/neuron",
    name: "Neuron",
    component: Neuron,
  },
  {
    path: "/edit-scene",
    name: "SceneEditor",
    component: SceneEditor,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
