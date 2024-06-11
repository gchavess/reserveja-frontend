<template>
  <div class="container">
    <div class="toolbar">
      <button-label
        :label="modoAdministrador ? 'Modo Usuário' : 'Modo Administrador'"
        :widthCemPorCentro="false"
        :cor="'primaria'"
        class="ml-4"
        @click="modoAdministrador = !modoAdministrador"
      ></button-label>

      <div class="tag-usuario centralizar">
        <span class="span-24">{{ usuario?.name }}</span>
        <i
          class="fa-solid fa-ellipsis-vertical pl-4"
          style="color: #555555"
        ></i>
      </div>
    </div>

    <div class="content-salas mt-4 ml-4">
      <div class="coluna-container">
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
                    @click="modalAbertaReservarSala = true"
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
    @modalAberta="modalAbertaReservarSala = $event"
  ></reservar-sala-modal>
</template>

<script>
import { Component, Vue } from "vue-facing-decorator";
import Cadeira from "@/components/Cadeira/Cadeira.vue";
import ReservarSalaModal from "@/views/SalaView/modal/ReservarSalaModal.vue";
import TableRoomService from "@/services/TableRoomService.js";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";

@Component({
  components: { Cadeira, ReservarSalaModal, ButtonLabel },
})
export default class SalaView extends Vue {
  modalAbertaReservarSala = false;
  mesaHover = null;

  usuario;

  modoAdministrador = false;

  listaMesas = [];

  mounted() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));

    this.getTableRooms();
  }

  async getTableRooms() {
    console.log("gettt");
    try {
      const response = await TableRoomService.getTableRoom();
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
      console.log("listaMesas:", this.listaMesas);
    } catch (error) {
      console.error(error);
    }
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
</style>
