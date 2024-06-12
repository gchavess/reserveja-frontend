<template>
  <modal
    :modalAberta="modalAberta"
    :titulo="tituloModal"
    @fecharModal="fecharModal()"
    @confirmar="acaoBotao == 'criar' ? criarSala() : deletarSala()"
  >
    <div class="container-modal" v-if="acaoBotao == 'criar'">
      <input-text
        @value="sala.name = $event"
        :value="sala.name"
        :placeholder="'Nome da Sala'"
        :key="keyInput"
      ></input-text>
    </div>

    <div class="container-modal" v-if="acaoBotao == 'excluir'">
      <span class="span-14"
        >Tem certeza de que deseja excluir esta sala? Esta ação resultará na
        perda de todos os dados e participantes associados a esta sala.</span
      >
    </div>
  </modal>
</template>

<script>
import { Component, Vue, Prop, Watch } from "vue-facing-decorator";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";
import Modal from "@/components/Modal/Modal.vue";
import InputText from "@/components/InputText/InputText.vue";
import RoomService from "@/services/RoomService.js";

@Component({
  components: { ButtonLabel, Modal, InputText },
  emits: ["recarregar", "modalAberta"],
})
export default class CriarSalaModal extends Vue {
  @Prop()
  modalAberta = false;

  @Prop()
  acaoBotao = "criar";

  @Prop()
  salaProp;

  usuario;

  keyInput = 0;

  sala = {
    name: "",
    userId: 1,
    reservaUserId: 1,
  };

  get tituloModal() {
    if (this.acaoBotao == "criar") {
      return "Criar Sala";
    } else if (this.acaoBotao == "excluir") {
      return "Excluir Sala";
    } else {
      return "";
    }
  }

  @Watch("modalAberta")
  onModalAbertaChange() {
    if (this.modalAberta) {
      this.resetarFormulario();
    }
  }

  mounted() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
  }

  async criarSala() {
    try {
      await RoomService.createRoom({
        ...this.sala,
        userId: this.usuario.id,
        reservaUserId: this.usuario.id,
      });

      this.$emit("recarregar");
      this.fecharModal();
    } catch (error) {
      console.error(error);
    }
  }

  async deletarSala() {
    try {
      await RoomService.deleteRoom(this.salaProp.id);
      this.$emit("recarregar");
      this.fecharModal();
    } catch (error) {
      console.error(error);
    }
  }

  resetarFormulario() {
    this.keyInput++;
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
