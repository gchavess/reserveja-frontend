<template>
  <input
    v-model="value"
    :placeholder="placeholder"
    :class="{ 'input-error': inputError, input: true }"
  />
</template>

<script>
import { Component, Vue, Watch, Prop } from "vue-facing-decorator";

@Component({
  components: {},
  emits: ["value"],
})
export default class InputText extends Vue {
  @Prop()
  placeholder = "Digite";

  value = "";
  inputError = false;

  @Watch("value")
  valueWatcher() {
    this.validateInput();
    this.$emit("value", this.value);
  }

  validateInput() {
    if (this.value == "") {
      this.inputError = true;
    } else {
      this.inputError = false;
    }
  }
}
</script>

<style></style>
