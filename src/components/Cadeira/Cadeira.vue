<template>
  <div
    :class="{ cadeira: true }"
    :style="`transform: rotate(${
      lado == 'cima' ? '180deg' : lado == 'direita' ? '-90deg' : ''
    })`"
  >
    <div :class="{ assento: true, 'cadeira-ocupada': ocupado }"></div>
    <div
      :class="{ perneira: true, esquerda: true, 'cadeira-ocupada': ocupado }"
    ></div>
    <div
      :class="{ perneira: true, direita: true, 'cadeira-ocupada': ocupado }"
    ></div>
  </div>
</template>

<script>
import { Component, Vue, Prop } from "vue-facing-decorator";

@Component({
  components: {},
  emits: [""],
})
export default class Button extends Vue {
  @Prop({ default: "baixo" }) lado;
  @Prop({ default: false }) ocupado;
}
</script>

<style>
.cadeira {
  height: 80px;
  width: 80px;
  position: relative;
}

/* Assento da cadeira */
.assento {
  position: absolute;
  top: 30px;
  left: 20px;
  width: 40px;
  height: 40px;
  background-color: green;
  border-top-left-radius: 20%;
  border-top-right-radius: 20%;
}

.cadeira-ocupada {
  background-color: red !important;
}

.perneira {
  position: absolute;
  width: 10px;
  height: 30px;
  background-color: green;
}

.cadeira:hover .assento,
.cadeira:hover .perneira {
  background-color: rgb(209, 209, 209);
}

.perneira.esquerda {
  top: 40px;
  left: 10px;
  border-bottom-left-radius: 20%;
  border-top-left-radius: 20%;
}

.perneira.direita {
  top: 40px;
  right: 10px;
  border-bottom-right-radius: 20%;
  border-top-right-radius: 20%;
}
</style>
