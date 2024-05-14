<template>
  <div class="container">
    <div class="toolbar"></div>

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
              <cadeira
                @click="modalAbertaReservarSala = true"
                v-if="colunaIndex == 0 && !mesa.itemAuxiliar"
                :lado="'direita'"
                :ocupado="mesa.ocupado"
                :style="`${
                  listaMesas[colunaIndex][mesaIndex - 1]?.itemAuxiliar ||
                  listaMesas[colunaIndex][mesaIndex - 1] == undefined
                    ? 'margin-top: 80px;'
                    : ''
                }`"
              ></cadeira>
              <div style="display: flex; flex-direction: column">
                <div v-if="!mesa.itemAuxiliar">
                  <cadeira
                    @click="modalAbertaReservarSala = true"
                    :ocupado="mesa.ocupado"
                    v-if="
                      mesaIndex == 0 ||
                      listaMesas[colunaIndex][mesaIndex - 1]?.itemAuxiliar
                    "
                  ></cadeira>
                  <div style="display: flex; align-items: center">
                    <div
                      class="mesa"
                      :style="
                        !(
                          listaMesas[colunaIndex + 1] &&
                          listaMesas[colunaIndex + 1][mesaIndex]?.id
                        ) &&
                        listaMesas[colunaIndex] &&
                        !listaMesas[colunaIndex][mesaIndex]?.itemAuxiliar
                          ? ''
                          : ''
                      "
                    ></div>
                    <div
                      v-if="
                        !(
                          listaMesas[colunaIndex + 1] &&
                          listaMesas[colunaIndex + 1][mesaIndex]?.id
                        ) &&
                        listaMesas[colunaIndex] &&
                        !listaMesas[colunaIndex][mesaIndex]?.itemAuxiliar &&
                        listaMesas[colunaIndex][mesaIndex] == mesaHover
                      "
                      class="hover-div"
                    >
                      <i
                        class="fas fa-plus"
                        style="color: white; font-size: 28px"
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
                  v-if="mesa.itemAuxiliar"
                  style="height: 80px; width: 80px"
                ></div>

                <cadeira
                  :lado="'cima'"
                  :ocupado="mesa.ocupado"
                  v-if="listaMesas[colunaIndex][mesaIndex + 1]?.itemAuxiliar"
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

@Component({
  components: { Cadeira, ReservarSalaModal },
})
export default class SalaView extends Vue {
  modalAbertaReservarSala = false;
  mesaHover = null;

  listaMesas = [
    [
      { id: 1, ocupado: false },
      { id: 2, ocupado: true },
      { id: 3, itemAuxiliar: true },
      { id: 1, ocupado: true },
      { id: 2, ocupado: true },
      { id: 3, itemAuxiliar: true },
      { id: 1, ocupado: true },
      { id: 2, ocupado: true },
    ],
    [
      { id: 1, ocupado: true },
      { id: 2, ocupado: true },
      { id: 3, itemAuxiliar: true },
      { id: 1, ocupado: true },
      { id: 2, ocupado: true },
      { id: 3, itemAuxiliar: true },
    ],
    [
      { id: 1, ocupado: true },
      { id: 2, ocupado: true },
      { id: 3, itemAuxiliar: true },
      { id: 1, ocupado: true },
      { id: 2, ocupado: true },
    ],
    [
      { id: 1, ocupado: true },
      { id: 2, ocupado: true },
      { id: 3, itemAuxiliar: true },
      { id: 1, ocupado: true },
      { id: 2, ocupado: true },
    ],
  ];
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
</style>
