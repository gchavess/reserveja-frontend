<template>
  <modal
    :modalAberta="modalAberta"
    :titulo="tituloModal"
    @fecharModal="fecharModal()"
    @confirmar="fecharModal()"
  >
    <div class="container-modal" v-if="acaoBotao == 'criar'">
      <input-text
        @value="sala.nome = $event"
        :placeholder="'Nome da Sala'"
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
import { Component, Vue, Prop } from "vue-facing-decorator";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";
import Modal from "@/components/Modal/Modal.vue";
import InputText from "@/components/InputText/InputText.vue";

@Component({
  components: { ButtonLabel, Modal, InputText },
})
export default class CriarSalaModal extends Vue {
  @Prop()
  modalAberta = false;

  @Prop()
  acaoBotao = "criar";

  sala = {
    nome: "",
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
