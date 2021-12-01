<template>
  <v-content wrap>
    <h3 class="font-regular headline pl-11 pt-3">Cursos e Eventos</h3>
    <v-row class="justify-center">
      <v-col cols="11">
        <v-expansion-panels focusable v-model="panel" multiple>
          <v-expansion-panel>
            <v-expansion-panel-header>Pesquisa</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-form ref="filtroPesquisa">
                <v-row align="center">
                  <v-col cols="12" md="6">
                    <v-text-field
                      aria-label="Título"
                      clearable
                      v-model="titulo"
                      label="Título"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <base-data-picker
                      :rules="validarData"
                      clearable
                      :date="dataPublicacao"
                      label="Data de Publicação"
                      @dataAtualizada="dataPublicacao = $event"
                    ></base-data-picker>
                  </v-col>
                  <v-col cols="12" md="6">
                    <base-data-picker
                      :rules="validarData"
                      clearable
                      label="Data Início"
                      @dataAtualizada="dataInicio = $event"
                    ></base-data-picker>
                  </v-col>
                  <v-col cols="12" md="6">
                    <base-data-picker
                      clearable
                      label="Data Fim"
                      :rules="validaDataFim"
                      @dataAtualizada="dataFim = $event"
                      :dataMinima="dataInicio"
                    ></base-data-picker>
                  </v-col>
                  <v-col cols="12" md="12" class="text-right">
                    <v-btn
                      aria-label="Pesquisar"
                      color="success"
                      dark
                      class="mr-4"
                      v-show="$store.state.permissoes.pesquisar"
                      @click="pesquisar($event);isPesquisaInicial = false"
                    >
                      <v-icon>mdi-magnify</v-icon>Pesquisar
                    </v-btn>
                    <v-btn
                      aria-label="Limpar"
                      color="#686868"
                      dark
                      @click="limparFormulario()"
                    >Limpar</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>Lista de Cursos e Eventos</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" md="12" class="text-right">
                  <v-btn
                    v-show="$store.state.permissoes.cadastrar"
                    aria-label="Novo"
                    @click="cadastrarEvento()"
                    dark
                    color="success"
                    class="mr-4"
                  >
                    <v-icon>mdi-plus</v-icon>Novo
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-data-table
                    no-data-text="Olá! Eu não tenho nenhum registro para te mostrar."
                    :sort-by.sync="onChangeSortBy"
                    :sort-desc.sync="onChangeSortDesc"
                    :page.sync="onChangePage"
                    :server-items-length.sync="total"
                    :items-per-page.sync="onChangeSize"
                    :headers="headers"
                    :items="eventos"
                    item-key="id"
                    class="elevation-1"
                    :hide-default-footer="hideTableFooter"
                    :hide-default-header="hideTableHeader"
                    :footer-props="{
                showFirstLastPage: true,
              }"
                  >
                    <template v-slot:item.action="{ item }">
                      <v-icon v-if="$store.state.permissoes.consultar" small class="mr-2" @click="editarEvento(item)">edit</v-icon>
                      <v-icon v-if="$store.state.permissoes.excluir"  small class="mr-2" @click="dialog=true;itemExclusao = item">delete</v-icon>
                    </template>
                    <template v-slot:item.dtHrInicio="{ item }">{{item.dtHrInicio.split(' ')[0]}}</template>
                    <template v-slot:item.dtHrFim="{ item }">{{item.dtHrFim.split(' ')[0]}}</template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <base-dialog :abrir="dialog">
      <template #titulo>Confirmar ação</template>
      <template #mensagem>
        <strong>{{msg03}}</strong>
      </template>
      <template #acoes>
        <v-btn aria-label="Sim" color="primary" text @click="dialog=false;excluirEvento()">Sim</v-btn>
        <v-btn aria-label="Não" color="#686868" text @click="dialog=false">Não</v-btn>
      </template>
      >
    </base-dialog>
  </v-content>
</template>

<script>
import mensagensPesquisa from '../utils/mensagens-pesquisa'
export default {
  mounted () {
    this.dataInicioPesquisa = '01/01/2000'
    this.pesquisar()
  },
  computed: {
    onChangeSize: {
      get () {
        return this.size
      },
      set (value) {
        value === -1 ? (this.size = this.total) : (this.size = value)
        this.pesquisar()
        this.size > 15 ? (this.size = -1) : (this.size = this.size)
      }
    },
    onChangePage: {
      get () {
        return this.page
      },
      set (value) {
        this.page = value
        this.pesquisar()
      }
    },
    onChangeSortBy: {
      get () {
        return this.sortBy
      },
      set (value) {
        if (value === undefined) value = null
        this.sortBy = value
        this.pesquisar()
      }
    },
    onChangeSortDesc: {
      get () {
        return this.sortDesc
      },
      set (value) {
        if (value === undefined) value = null
        this.sortDesc = value
        this.pesquisar()
      }
    }
  },
  data () {
    return {
      isPesquisaInicial: true,
      panel: [0, 1],
      validarData: [v => this.validarDataDigitada(v)],
      validaDataFim: [
        v => this.validarDataDigitada(v),
        v => this.dataFimMaiorInicio() || 'Data início maior que data fim!'
      ],
      msg03: mensagensPesquisa.MSG03,
      dialog: false,
      sortBy: 'id',
      sortDesc: true,
      titulo: null,
      dataPublicacao: null,
      dataInicio: null,
      dataFim: null,
      headers: [
        { text: 'Título', value: 'titulo', align: 'start' },
        {
          text: 'Data/Hora da Publicação',
          value: 'dataPublicacao',
          align: 'start'
        },
        {
          text: 'Data/Hora da Modificação',
          value: 'dataAtualizacaoPublicacao',
          align: 'start'
        },
        { text: 'Data Início', value: 'dtHrInicio', align: 'start' },
        { text: 'Data Fim', value: 'dtHrFim', align: 'start' },
        { text: 'Ações', value: 'action', align: 'start' }
      ],
      hideTableFooter: true,
      hideTableHeader: true,
      eventos: [],
      total: 0,
      size: 5,
      page: 1,
      tituloPesquisa: null,
      dataInicioPesquisa: null,
      dataFimPesquisa: null,
      dataPublicacaoPesquisa: null,
      itemExclusao: null
    }
  },
  methods: {
    editarEvento (item) {
      this.$router.push({ path: `/editar/${item.id}` })
    },
    limparFormulario () {
      this.hideTableHeader = true
      this.hideTableFooter = true
      this.$refs.filtroPesquisa.reset()
      this.dataInicioPesquisa = undefined
      this.dataFimPesquisa = undefined
      this.dataPublicacaoPesquisa = undefined
      this.eventos = []
    },
    pesquisar (event) {
      if (this.titulo || this.dataFim || this.dataInicio || this.dataPublicacao || this.isPesquisaInicial) {
        if (this.$refs.filtroPesquisa.validate()) {
          this.eventos = []
          this.prepararObjetoParaPesquisar(event)
          this.$services.pesquisarEvento({
            titulo: this.tituloPesquisa,
            dataInicio: this.dataInicioPesquisa,
            dataFim: this.dataFimPesquisa,
            dataPublicacao: this.dataPublicacaoPesquisa,
            page: this.page - 1,
            size: this.size,
            column: this.sortBy,
            sortDesc: this.sortDesc

          })
            .then(response => {
              if (response.data.body.length === 0 && event) {
                window.parent.postMessage({ enable: true, message: mensagensPesquisa.MSG02, type: 'red' }, '*')
                this.hideTableHeader = true
                this.hideTableFooter = true
              } else {
                this.hideTableHeader = false
                this.hideTableFooter = false
                this.total = response.data.total
                this.eventos = response.data.body
              }
            })
            .catch(error => {
              console.log(error)
            })
        }
      } else {
        if (event !== undefined) {
          window.parent.postMessage(
            { enable: true, message: mensagensPesquisa.MSG01, type: 'red' },
            '*'
          )
        }
      }
    },
    cadastrarEvento () {
      this.$router.push('/cadastro')
    },
    excluirEvento () {
      this.$services.excluirEvento({ id: this.itemExclusao.id }).then(resp => {
        window.parent.postMessage({ enable: true, message: mensagensPesquisa.MSG04, type: 'success' }, '*')
        this.pesquisar()
      }).catch(erro => { console.log(erro) })
    },
    dataFimMaiorInicio () {
      if (this.dataFim && this.dataInicio) {
        let inicioArray = this.dataInicio.split('-')
        let fimArray = this.dataFim.split('-')

        let dataInicio = new Date(
          inicioArray[0],
          inicioArray[1] - 1,
          inicioArray[2]
        )
        let dataFim = new Date(fimArray[0], fimArray[1] - 1, fimArray[2])

        return dataFim >= dataInicio
      } else {
        return true
      }
    },
    validarDataDigitada (data) {
      if (data) {
        if (data.split('')[3] === 0 && data.split('')[4] === 2) {
          return /^(0[1-9]|[12][0-9])\/(0[1-9]|1[012])\/(19|20)\d{2}$/.test(data) ? true : 'Data Inválida!'
        } else {
          return /^(((0[1-9]|[12][0-9]|3[01])([-./])(0[13578]|10|12)([-./])(\d{4}))|(([0][1-9]|[12][0-9]|30)([-./])(0[469]|11)([-./])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([-./])(02)([-./])(\d{4}))|((29)(\.|-|\/)(02)([-./])([02468][048]00))|((29)([-./])(02)([-./])([13579][26]00))|((29)([-./])(02)([-./])([0-9][0-9][0][48]))|((29)([-./])(02)([-./])([0-9][0-9][2468][048]))|((29)([-./])(02)([-./])([0-9][0-9][13579][26])))$/.test(data) ? true : 'Data Inválida!'
        }
      } else {
        return true
      }
    },
    prepararObjetoParaPesquisar (event) {
      if (this.size === -1) this.size = this.total
      if (event) {
        this.page = 1
        this.tituloPesquisa = this.titulo
        if (this.dataInicio) {
          this.dataInicioPesquisa = this.dataInicio
            .split('-')
            .reverse()
            .join('/')
        }
        if (this.dataFim) {
          this.dataFimPesquisa = this.dataFim
            .split('-')
            .reverse()
            .join('/')
        }
        if (this.dataPublicacao) {
          this.dataPublicacaoPesquisa = this.dataPublicacao
            .split('-')
            .reverse()
            .join('/')
        }
      }
    }
  }
}
</script>

<style >
</style>
