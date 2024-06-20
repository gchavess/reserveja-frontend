<template>
  <modal
    :modalAberta="modalAberta"
    :titulo="tituloModal"
    @fecharModal="fecharModal()"
    @confirmar="confirmar()"
  >
    <div class="container-modal">
      <span class="span-14"
        >Você está prestes a reservar uma mesa para o dia selecionado. Tem
        certeza que deseja continuar com a reserva?</span
      >
    </div>
  </modal>
</template>

<script>
import { Component, Vue, Prop, Watch } from "vue-facing-decorator";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";
import Modal from "@/components/Modal/Modal.vue";
import InputText from "@/components/InputText/InputText.vue";
import UserReserveTableRoomService from "@/services/UserReserveTableRoomService";

@Component({
  components: { ButtonLabel, Modal, InputText },
})
export default class ReservarSalaModal extends Vue {
  @Prop()
  modalAberta = false;

  @Prop()
  tableRoomId;

  @Prop()
  dataFiltrada;

  reserva = {};

  get tituloModal() {
    return "Reservar Mesa";
  }

  @Watch("modalAberta", { immediate: true })
  onModalAbertaChange() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));

    const roomId = this.$route.params.id;

    this.reserva = {
      userId: this.usuario.id,
      roomId: Number(roomId),
      tableRoomId: this.tableRoomId,
      date: this.dataFiltrada,
    };
  }

  fecharModal() {
    this.$emit("modalAberta", false);
  }

  async confirmar() {
    try {
      await UserReserveTableRoomService.createUserReserveTableRoomService(
        this.reserva
      );
      this.$emit("modalAberta", false);
    } catch (error) {
      console.error(error);
    }
  }
}
</script>

<style scoped>
.container-modal {
  width: 500px;
}
</style>
