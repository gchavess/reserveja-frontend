<template>
  <modal
    :modalAberta="modalAberta"
    :titulo="tituloModal"
    @fecharModal="fecharModal()"
    @confirmar="confirmar()"
  >
    <div class="container-modal">
      <span class="span-14">
        Ao convidar um participante, ele poderá entrar na sala.
      </span>

      <select class="select" v-model="participanteSelecionado">
        <option
          v-for="(option, index) in listaUsuarios"
          :value="option"
          :key="index"
        >
          {{ option.name }}
        </option>
      </select>
    </div>
  </modal>
</template>

<script>
import { Component, Vue, Prop, Watch } from "vue-facing-decorator";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";
import Modal from "@/components/Modal/Modal.vue";
import InputText from "@/components/InputText/InputText.vue";
import RoomService from "@/services/RoomService.js";
import UserService from "@/services/UserService.js";

@Component({
  components: { ButtonLabel, Modal, InputText },
})
export default class ConvidarParticipanteModal extends Vue {
  @Prop()
  modalAberta = false;

  @Prop()
  tableRoomId;

  @Prop()
  dataFiltrada;

  reserva = {};

  participanteSelecionado = null;
  listaUsuarios = [];

  get tituloModal() {
    return "Convidar Participante";
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

    this.getUsers();
  }

  async getUsers() {
    const response = await UserService.getUsers();
    this.listaUsuarios = response;
  }

  fecharModal() {
    this.$emit("modalAberta", false);
  }

  async confirmar() {
    const roomId = this.$route.params.id;
    try {
      if (this.participanteSelecionado?.id) {
        await RoomService.createUserRoom({
          roomId: Number(roomId),
          userId: this.participanteSelecionado?.id,
        });
      }

      this.$emit("modalAberta", false);
    } catch (error) {
      alert(error?.response?.data?.message);
    }
  }
}
</script>

<style scoped>
.container-modal {
  width: 500px;
}
</style>
