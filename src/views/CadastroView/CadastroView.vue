<template>
  <div class="container">
    <div class="container-login">
      <div class="content">
        <span class="title">Cadastro</span>
        <input-email class="mt-4" @value="user.email = $event" />

        <input-text
          class="mt-4"
          @value="user.name = $event"
          :placeholder="'Digite seu nome'"
        ></input-text>

        <input-password
          class="mt-4"
          @value="user.password = $event"
        ></input-password>

        <button-label
          class="botao-inscreva-se"
          :label="'Inscreva-se agora'"
          :disabled="!formValid"
          :widthCemPorCentro="true"
          @click="criarUsuario()"
        ></button-label>

        <div class="container-botoes">
          <span class="texto-cadastro"
            >Já tem uma conta?
            <router-link to="/login">Faça login</router-link></span
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
import UserService from "@/services/UserService.js";
import InputText from "@/components/InputText/InputText.vue";

@Component({
  components: { InputEmail, InputPassword, ButtonLabel, InputText },
})
export default class LoginView extends Vue {
  user = {
    email: "",
    name: "",
    password: "",
  };

  validationRules = {
    email: [{ required: true, message: "Por favor, insira seu e-mail." }],
    password: [{ required: true, message: "Por favor, insira sua senha." }],
    name: [{ required: true, message: "Por favor, insira seu nome." }],
  };

  get errors() {
    return validateForm(this.user, this.validationRules);
  }

  get formValid() {
    return this.errors.errorCount === 0;
  }

  criarUsuario() {
    if (this.formValid) {
      try {
        UserService.createUser(this.user);
        this.$router.push("/login");
      } catch (error) {
        console.error(error);
      }
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

.botao-inscreva-se {
  margin-top: 20px;
}

.texto-cadastro {
  color: #555555;
}
</style>
