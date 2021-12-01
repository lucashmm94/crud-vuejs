const state = {
  pesquisar: false,
  cadastrar: false,
  alterar: false,
  excluir: false,
  consultar: false
}
const mutations = {
  updatePesquisar (estado, value) {
    if (estado) {
      state.pesquisar = value
    }
  },
  updateCadastrar (estado, value) {
    if (estado) {
      state.cadastrar = value
    }
  },
  updateAlterar (estado, value) {
    if (estado) {
      state.alterar = value
    }
  },
  updateExcluir (estado, value) {
    if (estado) {
      state.excluir = value
    }
  },
  updateConsultar (estado, value) {
    if (estado) {
      state.consultar = value
    }
  }
}
const getters = {
  getPesquisar () {
    return state.pesquisar
  },
  getCadastrar () {
    return state.cadastrar
  },
  getAlterar () {
    return state.alterar
  },
  getExcluir () {
    return state.excluir
  },
  getConsultar () {
    return state.consultar
  }
}

export default {
  getters,
  state,
  mutations
}
