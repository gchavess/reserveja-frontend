import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView/LoginView.vue";
import CadastroView from "@/views/CadastroView/CadastroView.vue";
import HomeView from "@/views/HomeView/HomeView.vue";

const routes = [
  { path: "/login", component: LoginView },
  { path: "/cadastro", component: CadastroView },
  { path: "/home", component: HomeView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
