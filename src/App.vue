<template>
  <v-app app>
    <router-view>
    </router-view>
    <base-Snackbar/>
  </v-app>
</template>

<script>

import BaseSnackbar from './base-components/BaseSnackbar/BaseSnackbar'

export default {
  name: 'App',
  data: () => ({

  }),
  components: {
    BaseSnackbar
  },
  updated () {
    this.getFromStore()
  },
  mounted () {
    this.getFromStore()
  },
  methods: {
    getFromStore () {
      let json = this.$store.state.authentication.usuario.projetos
      const SIGLA = process.env.VUE_APP_NOME_FUNCIONALIDADE
      const NOME = process.env.VUE_APP_SIGLA_PROJETO
      if (json) {
        json.forEach(element => {
          if (element.sigla === SIGLA) {
            element.perfis[0].funcionalidades.forEach(func => {
              if (func.nome === NOME) {
                func.acoes.forEach(acao => {
                  this.setPermission(acao.descricao)
                })
              }
            })
          }
        })
      }
    },
    setPermission (action) {
      switch (action) {
        case 'Pesquisar':
          this.$store.commit('updatePesquisar', true)
          break
        case 'Cadastrar':
          this.$store.commit('updateCadastrar', true)
          break
        case 'Alterar':
          this.$store.commit('updateAlterar', true)
          break
        case 'Excluir':
          this.$store.commit('updateExcluir', true)
          break
        case 'Consultar':
          this.$store.commit('updateConsultar', true)
          break
        default:
          console.log(action)
      }
    }
  }
}

</script>
