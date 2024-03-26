<template>
  <div class="modal" :class="{ 'is-active': modalAberta }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-content">
      <div class="box">
        <span class="title-secondary">{{ titulo }}</span>

        <div class="divider mt-4 mb-4"></div>

        <slot></slot>

        <div class="divider mt-4 mb-4"></div>

        <div class="footer-modal">
          <button-label
            :label="'Fechar'"
            :widthCemPorCentro="false"
            :cor="'secundaria'"
            @click="fecharModal()"
          ></button-label>

          <button-label
            :label="'Confirmar'"
            :widthCemPorCentro="false"
            :cor="'primaria'"
            class="ml-4"
            @click="confirmar()"
          ></button-label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue, Prop } from "vue-facing-decorator";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";

@Component({
  components: { ButtonLabel },
  emits: ["fecharModal", "confirmar"],
})
export default class Modal extends Vue {
  @Prop()
  titulo = "";

  @Prop()
  modalAberta = false;

  confirmar() {
    this.$emit("confirmar");
  }

  fecharModal() {
    this.$emit("fecharModal", true);
  }
}
</script>

<style>
.modal {
  display: none;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.modal.is-active {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  max-width: 80%;
}

.footer-modal {
  display: flex;
  justify-content: flex-end;
}
</style>
