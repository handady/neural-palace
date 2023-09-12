import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home";
import Neuron from "@/views/Neuron/Neuron";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
