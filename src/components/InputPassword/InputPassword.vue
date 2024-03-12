<template>
  <input
    type="password"
    v-model="value"
    :placeholder="placeholder"
    :class="{ 'input-error': passwordError, input: true }"
  />
</template>

<script>
import { Component, Vue, Watch, Prop } from "vue-facing-decorator";

@Component({
  components: {},
  emits: ["value"],
})
export default class InputPassword extends Vue {
  @Prop({ default: "Digite sua senha" })
  placeholder;

  value = "";
  passwordError = false;

  @Watch("value")
  valueWatcher() {
    this.validatePassword();
    this.$emit("value", this.value);
  }

  validatePassword() {
    const minLength = 6;
    this.passwordError = this.value.length < minLength;
  }
}
</script>

<style></style>
