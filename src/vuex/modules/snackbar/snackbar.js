const mutations = {
  setTipo (estado, valor) {
    if (estado) {
      estado.tipo = valor
    }
  },
  setAtivo (estado, valor) {
    if (estado) {
      state.ativo = valor
    }
  },
  setMensagem (estado, valor) {
    if (estado) {
      state.mensagem = valor
    }
  },
  setTop (estado, valor) {
    if (estado) {
      estado.bottom = false
      estado.top = valor
    }
  },
  setBottom (estado, valor) {
    if (estado) {
      estado.top = false
      estado.bottom = valor
    }
  }
}

const state = {
  ativo: false,
  mensagem: '',
  tipo: 'success',
  top: true,
  bottom: true
}

export default {
  state,
  mutations
}
