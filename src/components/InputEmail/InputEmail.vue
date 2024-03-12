<template>
  <input
    type="email"
    v-model="value"
    placeholder="Digite seu e-mail"
    :class="{ 'input-error': emailError, input: true }"
  />
</template>

<script>
import { Component, Vue, Watch } from "vue-facing-decorator";

@Component({
  components: {},
  emits: ["value"],
})
export default class InputEmail extends Vue {
  value = "";
  emailError = false;

  @Watch("value")
  valueWatcher() {
    this.validateEmail();
    this.$emit("value", this.value);
  }

  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = !emailRegex.test(this.value);
  }
}
</script>

<style></style>
