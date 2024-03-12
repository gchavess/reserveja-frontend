<template>
  <div class="container">
    <div class="container-login">
      <div class="content">
        <span class="title">Redefinir sua senha</span>
        <input-email @value="user.email = $event" />

        <button-label
          :label="'Redefinir'"
          :disabled="!formValid"
        ></button-label>

        <div class="container-botoes"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-facing-decorator";
import InputEmail from "@/components/InputEmail/InputEmail.vue";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";
import { validateForm } from "@/utils/FormUtils.js";

@Component({
  components: { InputEmail, ButtonLabel },
})
export default class LoginView extends Vue {
  user = {
    email: "",
  };

  validationRules = {
    email: [{ required: true, message: "Por favor, insira seu e-mail." }],
  };

  get errors() {
    return validateForm(this.user, this.validationRules);
  }

  get formValid() {
    return this.errors.errorCount === 0;
  }
}
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container-login {
  width: 500px;
  height: calc(100vh - 200px);
  background-color: #fff;
  border-radius: 20px;
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

.texto-cadastro {
  color: #555555;
}
</style>
