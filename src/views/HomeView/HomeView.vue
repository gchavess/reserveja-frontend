<template>
  <div class="container">
    <div class="toolbar">
      <div class="centralizar">
        <div class="centralizar">
          <span class="title pl-4">Reserve Já</span>
          <div style="position: absolute; right: 0px; display: flex; gap: 20px">
            <button-label
              :label="'Criar Sala'"
              @click="onCriarSala()"
            ></button-label>
            <button-label
              :label="'Relatório'"
              @click="irParaRelatorio()"
            ></button-label>

            <div class="tag-usuario centralizar">
              <span class="span-24">{{ usuario?.name }}</span>
              <i
                class="fa-solid fa-ellipsis-vertical pl-4"
                style="color: #555555"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top: 100px; display: flex; flex-direction: column">
      <span class="title-secondary" style="margin-left: 12px"
        >Minhas salas</span
      >

      <div class="container-cards-sala pl-4 pt-4">
        <div
          v-for="sala of listaSalas"
          :key="sala.Rooms.id"
          class="card-sala"
          @click="entrarSala(sala.Rooms.id)"
        >
          <i
            class="fa-solid fa-trash icone-excluir-sala"
            @click.stop="onExcluirSala(sala)"
          ></i>

          <div
            style="
              display: flex;
              height: 100%;
              width: 100%;
              justify-content: center;
              align-items: center;
            "
          >
            <span class="span-24" style="padding-top: 10px">
              {{ sala.Rooms?.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <criar-sala-modal
    :modalAberta="modalCriarSalaAberta"
    :acaoBotao="acaoBotaoSalas"
    :salaProp="salaSelecionada"
    @recarregar="getRooms"
    @modalAberta="modalCriarSalaAberta = $event"
  ></criar-sala-modal>
</template>

<script>
import { Component, Vue } from "vue-facing-decorator";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";
import Modal from "@/components/Modal/Modal.vue";
import InputText from "@/components/InputText/InputText.vue";
import CriarSalaModal from "@/views/HomeView/modal/CriarSalaModal.vue";
import RoomService from "@/services/RoomService.js";

@Component({
  components: { ButtonLabel, Modal, InputText, CriarSalaModal },
})
export default class HomeView extends Vue {
  modalCriarSalaAberta = false;

  acaoBotaoSalas = "criar";

  listaSalas = [];

  salaSelecionada;

  usuario;

  mounted() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.getRooms();
  }

  async getRooms() {
    try {
      const response = await RoomService.getRooms(this.usuario.id);
      this.listaSalas = response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error(
          "Usuário não autorizado. Por favor, faça login novamente."
        );
      } else {
        console.error("Ocorreu um erro:", error);
      }
    }
  }

  onCriarSala() {
    this.acaoBotaoSalas = "criar";
    this.modalCriarSalaAberta = true;
  }

  onExcluirSala(sala) {
    this.acaoBotaoSalas = "excluir";
    this.modalCriarSalaAberta = true;
    this.salaSelecionada = sala;
  }

  entrarSala(salaId) {
    this.$router.push("/sala/" + salaId);
  }

  irParaRelatorio() {
    this.$router.push("/relatorio");
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
}

.toolbar {
  width: 100%;
  background-color: #fff;
  height: 60px;
  position: absolute;
  top: 0px;
  display: flex;
  align-items: center;
}

.centralizar {
  display: flex;
  align-items: center;
}

.tag-usuario {
  align-items: center;
  margin-right: 20px;
  border-radius: 4px;
  padding: 10px;
  border: 1px solid #f4a266;
}

.container-cards-sala {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.card-sala {
  min-width: 200px;
  min-height: 200px;
  max-width: 200px;
  max-height: 200px;
  background: #fff;
  border: 1px solid #f4a266;
}
.content-card-sala {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.container-modal-crie-sala {
  width: 500px;
}

.icone-excluir-sala {
  position: absolute;
  color: #555555;
  margin-top: 10px;
  margin-left: 170px;
}
</style>
