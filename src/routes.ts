import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import CadastroView from "@/views/CadastroView.vue";

const routes = [
  { path: "/login", component: LoginView },
  { path: "/cadastro", component: CadastroView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
