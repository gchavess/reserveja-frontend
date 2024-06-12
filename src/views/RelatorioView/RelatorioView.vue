<template>
  <div class="container">
    <div class="toolbar">
      <div class="centralizar">
        <div class="centralizar">
          <span class="title pl-4">Reserve Já</span>
        </div>
      </div>

      <div class="tag-usuario centralizar">
        <span class="span-24">{{ usuario?.name }}</span>
        <i
          class="fa-solid fa-ellipsis-vertical pl-4"
          style="color: #555555"
        ></i>
      </div>
    </div>

    <div class="search-container">
      <input-text
        v-model="searchUsuario"
        class="mt-4 input-relatorio" 
        :placeholder="'Pesquisar por usuário'"
      ></input-text>
      <input-text
        v-model="searchData"
        type="date"
        class="mt-4 input-relatorio"
        :placeholder="'Pesquisar por data'"
      ></input-text>
      <button-label
        class="ml-4 pesquisar"
        :label="'Pesquisar'"
        @click="filtrarTabela"
      ></button-label>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Sala</th>
            <th>Data Reserva</th>
            <th>Dia da Reserva</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in filteredItems" :key="index">
            <td>{{ item.col1 }}</td>
            <td>{{ item.col2 }}</td>
            <td>{{ item.col3 }}</td>
            <td>{{ item.col4 }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-facing-decorator";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";
import RoomService from "@/services/RoomService.js";
import InputText from "@/components/InputText/InputText.vue";

@Component({
  components: { ButtonLabel, InputText }
})
export default class HomeView extends Vue {
  modalCriarSalaAberta = false;
  acaoBotaoSalas = "criar";
  listaSalas = [];
  salaSelecionada = null;
  usuario = null;

  searchUsuario = '';
  searchData = '';

  items = [
    { col1: 'Michael', col2: 'SALA 01', col3: '11/06/2024', col4: '18/06/2024'},
    { col1: 'Gustavo', col2: 'SALA 01', col3: '12/06/2024', col4: '18/06/2024'},
    // Adicione mais itens conforme necessário
  ];

  mounted() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    console.log("Usuário carregado:", this.usuario);
    this.getRooms();
  }

  async getRooms() {
    try {
      const response = await RoomService.getRooms();
      this.listaSalas = response;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Usuário não autorizado. Por favor, faça login novamente.");
      } else {
        console.error("Ocorreu um erro:", error);
      }
    }
  }

  irParaRelatorio() {
    this.$router.push("/relatorio");
  }

  filtrarTabela() {
    this.filteredItems = this.items.filter(item => {
      return (!this.searchUsuario || item.col2.includes(this.searchUsuario)) &&
             (!this.searchData || item.col4 === this.searchData);
    });
  }

  data() {
    return {
      filteredItems: this.items
    };
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
  position: absolute;
  right: 0px;
  display: flex;
  align-items: center;
  margin-right: 20px;
  border-radius: 4px;
  padding: 10px;
  border: 1px solid #f4a266;
}

.search-container {
  margin-top: 50px;
  display: flex;
  gap: 6px;
  padding: 14px 20px;
}

.search-input {
  padding: 14px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.table-container {
  margin-top: -12px;
  padding: 14px 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 6px;
  text-align: center;
}

th {
  background-color: #f4a266;
  color: white;
  text-align: left;
}

.input-relatorio{
  margin-top: 1px;
  width: 200px;
  height: 50px;
}
</style>
