<template>
  <div class="container">
    <div class="container-login">
      <div class="content">
        <span class="title">Seja bem-vindo ao ReserveJá!</span>
        <input-email @value="user.email = $event" />
        <input-password @value="user.senha = $event"></input-password>

        <button-label
          class="botao-entrar"
          :label="'Entrar'"
          :disabled="!formValid"
          :widthCemPorCentro="true"
          @click="entrar()"
        ></button-label>

        <div class="container-botoes">
          <a href="#">Esqueceu sua senha?</a>
          <span class="texto-cadastro"
            >Não tem uma conta?
            <router-link to="/cadastro">Faça login</router-link></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-facing-decorator";
import InputEmail from "@/components/InputEmail/InputEmail.vue";
import InputPassword from "@/components/InputPassword/InputPassword.vue";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";
import { validateForm } from "@/utils/FormUtils.js";

@Component({
  components: { InputEmail, InputPassword, ButtonLabel },
})
export default class LoginView extends Vue {
  user = {
    email: "",
    senha: "",
  };

  validationRules = {
    email: [{ required: true, message: "Por favor, insira seu e-mail." }],
    senha: [{ required: true, message: "Por favor, insira sua senha." }],
  };

  get errors() {
    return validateForm(this.user, this.validationRules);
  }

  get formValid() {
    return this.errors.errorCount === 0;
  }

  entrar() {
    if (this.formValid) {
      this.$router.push("/home");
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container-login {
  width: 500px;
  background-color: #fff;
  border-radius: 20px;
  padding-top: 50px;
  padding-bottom: 50px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 400px;
  margin: 0 auto;
}

.container-botoes {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200px;
}

.botao-entrar {
  margin-top: 20px;
}

.texto-cadastro {
  color: #555555;
}
</style>
