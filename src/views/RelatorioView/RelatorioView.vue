<template>
  <div class="container">
    <div class="toolbar">
      <i
        class="fa fa-chevron-left"
        style="margin-left: 20px; color: #555555"
        @click="voltar()"
      ></i>
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

    <div style="margin-top: 100px">
      <span class="title-secondary" style="margin-left: 16px">Relatório</span>

      <div class="search-container">
        <select
          class="select input"
          v-model="searchUsuario"
          style="width: 200px"
        >
          <option
            v-for="(option, index) in listaUsuarios"
            :value="option"
            :key="index"
          >
            {{ option.name }}
          </option>
        </select>
        <input-text
          v-model="searchData"
          type="date"
          class="mt-4 input-relatorio"
          :placeholder="'Pesquisar por data'"
        ></input-text>
        <button-label
          class="ml-4 pesquisar"
          :label="'Limpar Filtros'"
          @click="
            searchUsuario = '';
            searchData = '';
          "
        ></button-label>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Sala</th>
              <th>Data da Reserva</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredItems" :key="index">
              <td>{{ item?.User?.name }}</td>
              <td>{{ item?.Room?.name }}</td>
              <td>{{ formatarData(item?.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from "vue-facing-decorator";
import ButtonLabel from "@/components/ButtonLabel/ButtonLabel.vue";
import InputText from "@/components/InputText/InputText.vue";
import UserReserveTableRoomService from "@/services/UserReserveTableRoomService";
import UserService from "@/services/UserService";

@Component({
  components: { ButtonLabel, InputText },
})
export default class HomeView extends Vue {
  modalCriarSalaAberta = false;
  acaoBotaoSalas = "criar";
  salaSelecionada = null;
  usuario = null;

  searchUsuario = "";
  searchData = "";

  items = [];
  listaUsuarios = [];

  mounted() {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));

    this.getRooms();
    this.getUsers();
  }

  async getRooms() {
    try {
      const response = await UserReserveTableRoomService.getRelatorio();
      this.items = response;
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

  async getUsers() {
    const response = await UserService.getUsers();
    this.listaUsuarios = response;
  }

  irParaRelatorio() {
    this.$router.push("/relatorio");
  }

  get filteredItems() {
    return this.items.filter((item) => {
      const userMatch = this.searchUsuario?.name
        ? item?.User?.name
            ?.toLowerCase()
            .includes(this.searchUsuario.name.toLowerCase())
        : true;

      const dateMatch = this.searchData
        ? item?.date.includes(this.searchData)
        : true;

      return userMatch && dateMatch;
    });
  }

  formatarData(data) {
    let novaData = new Date(data);
    novaData.setDate(novaData.getDate() + 1);

    return novaData.toLocaleDateString("pt-BR");
  }

  voltar() {
    this.$router.push("/home");
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
  padding: 14px 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 6px;
  text-align: center;
}

th {
  background-color: #f4a266;
  color: white;
  text-align: left;
}

.input-relatorio {
  margin-top: 1px;
  width: 200px;
  height: 50px;
}
</style>
