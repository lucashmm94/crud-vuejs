import Vue from "vue";
import axios from "axios";
const services = {
  pesquisarEvento: filtro => {
    return Vue.prototype.$axios("/evento/filtro", { params: filtro });
  },
  excluirEvento(idEvento) {
    return Vue.prototype.$axios.delete("/evento", { params: idEvento });
  },
  editarEvento: idEvento => {
    return Vue.prototype.$axios("/evento/find-by-id", { params: idEvento });
  },
  publicarEvento(evento) {
    return Vue.prototype.$axios.post("/publicacao", evento);
  },
  atualizarEvento(evento) {
    return Vue.prototype.$axios.put("/evento", evento);
  },
  salvarEvento(evento) {
    return Vue.prototype.$axios.post("/evento", evento);
  },
  getUnidades() {
    return Vue.prototype.$axios("/evento/lista-unidade");
  },
  removerPublicacao(idEvento) {
    return Vue.prototype.$axios.delete("/publicacao", { params: idEvento });
  }
};

export default services;
