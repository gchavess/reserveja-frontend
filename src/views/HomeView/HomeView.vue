<template>
  <div class="container">
    <div class="toolbar">
      <div class="centralizar">
        <div class="centralizar">
          <span class="title pl-4">Reserve Já</span>
          <button-label
            class="ml-4"
            :label="'Criar Sala'"
            @click="entrar()"
          ></button-label>
        </div>

        <div class="tag-usuario centralizar">
          <span class="span-24">Gustavo</span>
          <i
            class="fa-solid fa-ellipsis-vertical pl-4"
            style="color: #555555"
          ></i>
        </div>
      </div>
    </div>

    <div class="container-cards-sala pl-4">
      <div v-for="sala of listaSalas" :key="sala.id" class="card-sala">
        <div class="content-card-sala">
          <div style="display: flex" class="centralizar">
            <span class="span-24">{{ sala.descricao }}</span>

            <i
              class="fa-solid fa-trash"
              style="
                position: absolute;
                padding-left: 100px;
                color: #555555;
                margin-top: -4px;
              "
            ></i>
          </div>
          <span class="span-14"
            >Número de Participantes: {{ sala.numeroParcitipantes }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-facing-decorator";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";

@Component({
  components: { ButtonLabel },
})
export default class HomeView extends Vue {
  listaSalas = [
    { id: 1, descricao: "Sala 1", numeroParcitipantes: 3 },
    { id: 1, descricao: "Sala 2", numeroParcitipantes: 90 },
    { id: 1, descricao: "Sala 3", numeroParcitipantes: 9 },
    { id: 1, descricao: "Sala 4", numeroParcitipantes: 26 },
  ];
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
  position: absolute;
  right: 0px;
  display: flex;
  align-items: center;
  margin-right: 20px;
  border-radius: 4px;
  padding: 10px;
  border: 1px solid #f4a266;
}

.container-cards-sala {
  display: flex;
  gap: 12px;
  margin-top: 100px;
}

.card-sala {
  width: 200px;
  height: 200px;
  background: #fff;
  border: 1px solid #f4a266;
}
.content-card-sala {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}
</style>
