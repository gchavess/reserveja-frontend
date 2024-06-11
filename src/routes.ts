import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView/LoginView.vue";
import CadastroView from "@/views/CadastroView/CadastroView.vue";
import HomeView from "@/views/HomeView/HomeView.vue";
import SalaView from "@/views/SalaView/SalaView.vue";
import RelatorioView from "@/views/RelatorioView/RelatorioView.vue"

const routes = [
  { path: "/", component: LoginView },
  { path: "/login", component: LoginView },
  { path: "/cadastro", component: CadastroView },
  { path: "/home", component: HomeView },
  { path: "/sala/:id", component: SalaView },
  { path: "/relatorio", component: RelatorioView},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
