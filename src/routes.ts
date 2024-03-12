import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/Login/LoginView.vue";
import CadastroView from "@/views/Cadastro/CadastroView.vue";
import EsqueceuSuaSenhaView from "@/views/EsqueceuSuaSenha/EsqueceuSuaSenhaView.vue";

const routes = [
  { path: "/login", component: LoginView },
  { path: "/cadastro", component: CadastroView },
  { path: "/esqueceu-sua-senha", component: EsqueceuSuaSenhaView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
