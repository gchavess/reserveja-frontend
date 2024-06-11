<template>
  <button
    class="btn"
    :disabled="disabled"
    :style="{
      width: widthCemPorCentro ? '100%' : 'auto',
      backgroundColor: color,
    }"
  >
    {{ label }}
  </button>
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

  @Prop()
  widthCemPorCentro = false;

  @Prop()
  cor = "primaria";

  get color() {
    if (this.cor == "primaria") {
      return "#f4a266";
    } else if (this.cor == "secundaria") {
      return "#C9C9C9";
    } else {
      return "#f4a266";
    }
  }
}
</script>

<style>
.btn {
  color: white;
  padding: 14px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  height: 50px;
}

.btn:hover {
  background-color: #d68850;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
