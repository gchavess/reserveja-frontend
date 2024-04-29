<template>
  <modal
    :modalAberta="modalAberta"
    :titulo="tituloModal"
    @fecharModal="fecharModal()"
    @confirmar="fecharModal()"
  >
    <div class="container-modal"></div>
  </modal>
</template>

<script>
import { Component, Vue, Prop } from "vue-facing-decorator";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";
import Modal from "@/components/Modal/Modal.vue";
import InputText from "@/components/InputText/InputText.vue";

@Component({
  components: { ButtonLabel, Modal, InputText },
})
export default class ReservarSalaModal extends Vue {
  @Prop()
  modalAberta = false;

  sala = {
    nome: "",
  };

  get tituloModal() {
    return "Reservar Sala";
  }

  fecharModal() {
    this.$emit("modalAberta", false);
  }
}
</script>

<style scoped>
.container-modal {
  width: 500px;
}
</style>
