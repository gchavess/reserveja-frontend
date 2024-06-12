<template>
  <div class="container">
    <div class="toolbar">
      <!--
      <button-label
        :label="modoAdministrador ? 'Modo Usuário' : 'Modo Administrador'"
        :widthCemPorCentro="false"
        :cor="'primaria'"
        class="ml-4"
        @click="modoAdministrador = !modoAdministrador"
      ></button-label>
      -->
      <i
        class="fa fa-chevron-left"
        style="margin-left: 20px; color: #555555"
        @click="voltar()"
      ></i>

      <div style="margin-left: 30px">
        <button-label
          :label="'Convidar Participante'"
          :widthCemPorCentro="false"
          :cor="'primaria'"
          class="ml-4"
          @click="abrirModalConvidarParticipar()"
        ></button-label>
      </div>

      <div class="tag-usuario centralizar">
        <span class="span-24">{{ usuario?.name }}</span>
        <i
          class="fa-solid fa-ellipsis-vertical pl-4"
          style="color: #555555"
        ></i>
      </div>
    </div>

    <div class="content-salas mt-4 ml-4">
      <div
        class="date-filter-container"
        style="position: fixed; right: 20px; margin-top: 10px"
      >
        <label for="date-filter" class="date-filter-label"
          >Selecione uma data:</label
        >
        <input
          type="date"
          id="date-filter"
          v-model="dataFiltrada"
          class="date-filter-input"
          placeholder="Escolha uma data"
        />
      </div>
      <div class="coluna-container" style="margin-top: 30px">
        <div
          v-for="(coluna, colunaIndex) of listaMesas"
          class="coluna"
          :key="colunaIndex"
        >
          <div v-for="(mesa, mesaIndex) of coluna" :key="mesaIndex">
            <div
              style="display: flex; flex-direction: row"
              @mouseover="mesaHover = mesa"
            >
              <!--
              <cadeira
                @click="modalAbertaReservarSala = true"
                v-if="colunaIndex == 0 && !mesa.objetoAuxiliar"
                :lado="'direita'"
                :ocupado="mesa.ocupado"
                :style="`${
                  listaMesas[colunaIndex][mesaIndex - 1]?.objetoAuxiliarliar ||
                  listaMesas[colunaIndex][mesaIndex - 1] == undefined
                    ? 'margin-top: 80px;'
                    : ''
                }`"
              ></cadeira>
              -->
              <div style="display: flex; flex-direction: column">
                <div v-if="!mesa.objetoAuxiliar">
                  <cadeira
                    @click="selecionarMesa(mesa)"
                    :ocupado="mesa.ocupado"
                    v-if="
                      mesaIndex == 0 ||
                      listaMesas[colunaIndex][mesaIndex - 1]?.objetoAuxiliar
                    "
                  ></cadeira>
                  <div style="display: flex; align-items: center">
                    <div class="mesa">
                      <i
                        v-if="modoAdministrador"
                        class="fa-solid fa-trash-can"
                        style="color: black; font-size: 28px"
                        @click="removerMesa(mesa)"
                      ></i>
                    </div>
                    <div
                      v-if="
                        !(
                          listaMesas[colunaIndex + 1] &&
                          listaMesas[colunaIndex + 1][mesaIndex]?.id
                        ) &&
                        listaMesas[colunaIndex] &&
                        !listaMesas[colunaIndex][mesaIndex]?.objetoAuxiliar &&
                        listaMesas[colunaIndex][mesaIndex] == mesaHover &&
                        modoAdministrador
                      "
                      class="hover-div"
                    >
                      <i
                        class="fas fa-plus"
                        style="color: white; font-size: 28px"
                        @click="adicionarMesa(mesa)"
                      ></i>
                    </div>

                    <div
                      v-else
                      style="
                        padding-left: 80px;
                        height: 80px;
                        position: fixed;
                        margin-left: 80px;
                      "
                    ></div>
                  </div>
                </div>
                <div
                  v-if="mesa.objetoAuxiliar"
                  style="height: 80px; width: 80px"
                ></div>

                <cadeira
                  :lado="'cima'"
                  :ocupado="mesa.ocupado"
                  v-if="listaMesas[colunaIndex][mesaIndex + 1]?.objetoAuxiliar"
                  @click="modalAbertaReservarSala = true"
                ></cadeira>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <reservar-sala-modal
    :modalAberta="modalAbertaReservarSala"
    :tableRoomId="tableRoom?.id"
    :dataFiltrada="dataFiltrada"
    @modalAberta="
      modalAbertaReservarSala = $event;
      if (!$event) getTableRooms();
    "
  ></reservar-sala-modal>

  <convidar-participante-modal
    :modalAberta="modalAbertaConvidarParcipante"
    @modalAberta="
      modalAbertaConvidarParcipante = $event;
      participanteSelecionado = null;
    "
  ></convidar-participante-modal>
</template>

<script>
import { Component, Vue, Watch } from "vue-facing-decorator";
import Cadeira from "@/components/Cadeira/Cadeira.vue";
import ReservarSalaModal from "@/views/SalaView/modal/ReservarSalaModal.vue";
import TableRoomService from "@/services/TableRoomService.js";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";
import ConvidarParticipanteModal from "@/views/SalaView/modal/ConvidarParticipanteModal.vue";

@Component({
  components: {
    Cadeira,
    ReservarSalaModal,
    ButtonLabel,
    ConvidarParticipanteModal,
  },
})
export default class SalaView extends Vue {
  modalAbertaReservarSala = false;
  modalAbertaConvidarParcipante = false;

  mesaHover = null;

  usuario;

  modoAdministrador = false;

  listaMesas = [];

  dataFiltrada = new Date().toISOString().substr(0, 10);

  mounted() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));

    this.getTableRooms();
  }

  @Watch("dataFiltrada")
  onDateChange() {
    this.$nextTick(() => {
      this.getTableRooms();
    });
  }

  async abrirModalConvidarParticipar() {
    this.modalAbertaConvidarParcipante = true;
  }

  async getTableRooms() {
    console.log("gettt");
    const roomId = this.$route.params.id;

    try {
      const response = await TableRoomService.getAllTablesRoomByDateAndUser(
        this.usuario.id,
        new Date(this.dataFiltrada).toISOString(),
        Number(roomId)
      );
      console.log("getTableRooms response", response);

      // Verificar se a resposta está vazia ou se não contém dados
      if (!response || response.length === 0) {
        console.log("Resposta vazia ou sem dados.");
        return;
      }

      // Objeto para armazenar os arrays de objetos agrupados por linha
      /*
      const objetosPorLinha = {};

      // Iterar sobre cada objeto na resposta
      response.forEach((obj) => {
        // Verificar se já existe um array para a linha atual
        if (!objetosPorLinha[obj.column]) {
          // Se não existir, criar um novo array com este objeto
          objetosPorLinha[obj.column] = [obj];
        } else {
          // Se já existir, adicionar este objeto ao array existente
          objetosPorLinha[obj.column].push(obj);
        }
      });

      // Converter o objeto em um array e armazenar na variável listaMesas
      this.listaMesas = Object.values(objetosPorLinha);
      */

      this.listaMesas = [
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
        [
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
          {
            id: 1,
            column: 1,
            line: 1,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 1,
            column: 2,
            line: 2,
            objetoAuxiliar: false,
            createdAt: "2024-05-22T23:04:09.000Z",
            updatedAt: "2024-05-22T23:04:09.000Z",
          },
          {
            id: 5,
            column: 1,
            line: 2,
            objetoAuxiliar: true,
            createdAt: "2024-05-22T23:04:56.000Z",
            updatedAt: "2024-05-22T23:04:56.000Z",
          },
        ],
      ];

      // Verificar a variável listaMesas
      this.listaMesas = [[response[0]], [response[1]]];

      console.log("listaMesas", this.listaMesas);
    } catch (error) {
      console.error(error);
    }
  }

  async selecionarMesa(mesa) {
    this.tableRoom = mesa;

    this.$nextTick(() => {
      console.log("this.tableRoom", this.tableRoom);

      this.modalAbertaReservarSala = true;
    });
  }

  async adicionarMesa(mesa) {
    try {
      const obj = {
        column: mesa.column + 1,
        line: mesa.line,
        objetoAuxiliar: false,
      };
      await TableRoomService.createTableRoom(obj);
      this.getTableRooms();
    } catch (error) {
      console.error(error);
    }
  }

  async removerMesa(mesa) {
    console.log("removerMesa");
    try {
      await TableRoomService.deleteTableRoom(mesa.id);
      this.getTableRooms();
    } catch (error) {
      console.error(error);
    }
  }

  voltar() {
    this.$router.push("/home");
  }
}
</script>

<style scoped>
.container {
  height: calc(100vh - 80px);
}

.toolbar {
  width: 100%;
  background-color: #fff;
  height: 60px;
  position: absolute;
  top: 0px;
  display: flex;
  align-items: center;
  z-index: 2;
}

.content-salas {
  margin-top: 60px;
  overflow: auto;
  height: 100%;
}

.coluna-container {
  display: flex;
}

.coluna {
  display: flex;
  flex-direction: column;
}

.mesa {
  background-color: #fff;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mesa i.fa-trash-can {
  color: black;
  font-size: 28px;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.mesa:hover i.fa-trash-can {
  opacity: 1;
}

.botao-acoes {
  background-color: #f4a266;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  margin-top: 80px;
}

.hover-div {
  height: 40px;
  width: 40px;
  background-color: #f4a266;
  border-radius: 50%;
  margin-left: 90px;
  position: fixed;
  justify-content: center;
  display: flex;
  align-items: center;
}

.tag-usuario {
  position: absolute;
  right: 0px;
  display: flex;
  align-items: center;
  margin-right: 20px;
  border-radius: 4px;
  padding: 10px;
  border: 1px solid #f4a266;
}

label {
  color: #555555;
  font-weight: bold;
  margin-bottom: 8px;
}

.date-filter-container {
  margin-left: 20px;
}

.date-filter-label {
  display: block;
  margin-bottom: 5px;
  font-size: 16px;
  color: #555555;
}

.date-filter-input {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #f4a266;
  border-radius: 4px;
  width: 200px;
}

.date-filter-input::placeholder {
  color: #999;
}

.date-filter-input:focus {
  outline: none;
}

.select {
  padding: 8px;
  font-size: 14px;
  border: 1px solid #f4a266;
  border-radius: 4px;
  width: 200px;
  background: white;
  color: #555555;
}

.select:focus {
  outline: none;
}
</style>
