<template>
  <button class="btn" :disabled="disabled">{{ label }}</button>
</template>

<script>
import { Component, Vue, Prop } from "vue-facing-decorator";

@Component({
  components: {},
  emits: [""],
})
export default class Button extends Vue {
  @Prop()
  label = "Entrar";

  @Prop()
  disabled = false;
}
</script>

<style>
.btn {
  background-color: #f4a266;
  color: white;
  padding: 14px 20px;
  margin-top: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #d68850;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
