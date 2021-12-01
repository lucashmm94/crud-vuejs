import Vue from 'vue'
import Vuex from 'vuex'
import permissoes from './modules/permissoes/permissoes'
import snackbar from './modules/snackbar/snackbar'
import { segurancaData, authenticationModule } from 'scsdp-plugin'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    snackbar,
    permissoes,
    authentication: authenticationModule
  },
  plugins: [segurancaData]
})
