<template>
  <v-app wrap>
    <v-content>
      <h3 class="font-regular headline pl-11 pt-3">{{tituloCabecalho}}</h3>
      <v-row class="justify-center">
        <v-col cols="11">
          <base-card :is-outline="true">
            <template #body>
              <v-form v-model="formValid" lazy-validation ref="form">
                <v-row align="center">
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field
                      clearable
                      v-model="titulo"
                      :rules="fieldRequired"
                      aria-label="Título"
                      label="Título*"
                      maxlength="80"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-autocomplete
                      id="idUnidade"
                      clearable
                      no-data-text="Não foi possível carregar a lista de unidades"
                      hide-selected
                      v-model="unidade"
                      :items="unidades"
                      :item-text="item => `${item.municipio.nome} / ${item.nome}`"
                      :item-value="item => item.id"
                      aria-label="Unidade*"
                      label="Unidade*"
                      :rules="fieldRequired"
                    ></v-autocomplete>
                  </v-col>
                  <v-col ref="linhaDataInicio" cols="12" md="6" sm="6">
                    <base-data-picker
                      :rules="validarDataObrigatoria"
                      label="Data Início*"
                      @dataAtualizada="dataInicio = $event;verificarDataInicioDuracaoEventoPreenchidos($event)"
                      :dataRecebida="dataInicio"
                    ></base-data-picker>
                  </v-col>
                  <v-col ref="linhaSelected" cols="12" md="6" sm="6">
                    <v-select
                      @change="verificarDataInicioDuracaoEventoPreenchidos($event)"
                      clearable
                      hide-selected
                      v-model="duracaoEvento"
                      :rules="fieldRequired"
                      :items="duracoes"
                      aria-label="Duração*"
                      label="Duração*"
                    ></v-select>
                  </v-col>
                  <v-col
                    v-show="(dataInicio && duracaoEvento) && duracaoEvento != '1 dia'"
                    cols="12"
                    md="4"
                    sm="4"
                    ref="vColDataFim"
                  >
                    <base-data-picker
                      label="Data Fim*"
                      @dataAtualizada="dataFim = $event"
                      :dataMinima="dataInicio"
                      :dataRecebida="dataFim"
                      :desabilitar="desabilitarDataFim"
                      :clearable="!desabilitarDataFim"
                      :rules="validarDataFim"
                    ></base-data-picker>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      clearable
                      aria-label="Hora Início*"
                      label="Hora Início*"
                      v-mask="'##:##'"
                      :rules="validaHoraInicio"
                      v-model="horaInicio"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" sm="6">
                    <v-text-field
                      clearable
                      aria-label="Hora Fim*"
                      label="Hora Fim*"
                      v-mask="'##:##'"
                      :rules="validaHorárioFim"
                      v-model="horaFim"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field
                      clearable
                      :rules="fieldRequired"
                      maxlength="100"
                      v-model="localEvento"
                      aria-label="Local*"
                      label="Local*"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <v-text-field
                      clearable
                      maxlength="100"
                      v-model="urlInscricao"
                      aria-label="Url para inscrições"
                      label="URL para Inscrições"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="10" sm="12">
                    <base-cropper
                      @imagemAnexo64="imagemEvento = $event"
                      :objetoBack="imagemEvento"
                    />
                  </v-col>
                  <v-col cols="12" md="2">
                    <v-checkbox label="Destaque" aria-label="Destaque" v-model="destaque"></v-checkbox>
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <span style="font-size:16px">Descrição*</span>
                    <base-rich-text
                      ref="refDescricao"
                      id="idDescricao"
                      @textoAlterado="descricao=$event.htmlValue;objetoRichTextDescricao = $event"
                      :textoRecebidoBack="descricao"
                    />
                  </v-col>
                  <v-col cols="12" md="12" sm="12">
                    <span style="font-size:16px">Programação</span>
                    <base-rich-text
                      id="idProgramacao"
                      @textoAlterado="programacao=$event.htmlValue"
                      :textoRecebidoBack="programacao"
                    />
                  </v-col>
                </v-row>

                <base-dialog :abrir="dialogRemoverPublicacao">
                  <template #titulo>Confirmar ação</template>
                  <template #mensagem>
                    <strong>{{msg14}}</strong>
                  </template>
                  <template #acoes>
                    <v-btn
                      color="primary"
                      text
                      aria-label="Sim"
                      @click="dialogRemoverPublicacao=false;removerPublicacao()"
                    >Sim</v-btn>
                    <v-btn
                      color="#686868"
                      aria-label="Não"
                      text
                      @click="dialogRemoverPublicacao=false"
                    >Não</v-btn>
                  </template>
                  >
                </base-dialog>
                <base-dialog :abrir="dialogVoltar">
                  <template #titulo>Deseja continuar?</template>
                  <template #mensagem>
                    <strong>{{msgInformacoesDescartadas}}</strong>
                  </template>
                  <template #acoes>
                    <v-btn
                      color="primary"
                      aria-label="Sim"
                      text
                      @click="dialogVoltar=false;cancelarEvento()"
                    >Sim</v-btn>
                    <v-btn color="#686868" aria-label="Não" text @click="dialogVoltar=false">Não</v-btn>
                  </template>
                  >
                </base-dialog>
              </v-form>
            </template>
          </base-card>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="11" class="text-right">
          <v-btn
            v-show="($route.params.id && $store.state.permissoes.alterar) || !$route.params.id"
            aria-label="Salvar e Publicar"
            dark
            color="success"
            @click="validarEvento('publicar')"
          >Salvar e Publicar</v-btn>
          <v-btn
            class="ml-3"
            aria-label="Remover Publicação"
            @click="dialogRemoverPublicacao = true"
            v-show="idPublicado && (($route.params.id && $store.state.permissoes.alterar )|| !$route.params.id)"
            dark
            color="#686868"
          >Remover Publicação</v-btn>
          <v-btn
            class="ml-3"
            v-show="!idPublicado && (($route.params.id && $store.state.permissoes.alterar) || !$route.params.id)"
            dark
            color="success"
            @click="validarEvento()"
            aria-label="Salvar"
          >
            <v-icon>mdi-content-save-outline</v-icon>Salvar
          </v-btn>
          <v-btn
            class="ml-3"
            dark
            color="#686868"
            @click="houveMundacaTela?dialogVoltar=true:cancelarEvento()"
            aria-label="Voltar"
          >Voltar</v-btn>
        </v-col>
      </v-row>
    </v-content>
  </v-app>
</template>

<script>
import mensagensCadastro from '../utils/mensagens-cadastro'
import mensagensEditar from '../utils/mensagens-editar'

export default {
  created () {
    this.getUnidades()
    if (this.$route.params.id) {
      this.editarEvento(this.$route.params.id)
    }
  },
  data () {
    return {
      terminouRequisicaoHttp: true,
      tituloCabecalho: this.$route.params.id
        ? 'Alterar Curso e Evento'
        : 'Novo Curso e Evento',
      objetoRichTextDescricao: {
        htmlValue: '',
        textValue: ''
      },
      formValid: true,
      idPublicado: null,
      dataPublicacao: null,
      dataAtualizacaoPublicacao: null,
      urlInscricao: null,
      imagemEvento: null,
      desabilitarDataFim: true,
      descricao: null,
      programacao: null,
      destaque: false,
      duracoes: [
        '1 dia',
        '2 dias',
        '3 dias',
        '4 dias',
        '5 dias',
        'Personalizar'
      ],
      dialogVoltar: false,
      duracaoEvento: null,
      tituloDialog: 'Deseja continuar?',
      msg14: mensagensEditar.MSG14,
      msgInformacoesDescartadas: this.$route.params.id
        ? mensagensEditar.MSG02
        : mensagensCadastro.MSG02,
      dialogRemoverPublicacao: false,
      houveMundacaTela: false,
      diferenca: 0,
      titulo: null,
      dataInicio: null,
      dataFim: null,
      horaInicio: null,
      horaFim: null,
      unidade: null,
      localEvento: null,
      unidades: [],
      validarDataObrigatoria: [
        v => this.validarDataDigitada(v),
        v => !!v || mensagensCadastro.MSG01
      ],
      validarDataFim: [
        v => this.validarDataDigitada(v),
        v => this.dataFimMaiorInicio(v) || mensagensCadastro.MSG05,
        v => !!v || mensagensCadastro.MSG01
      ],
      validaHoraInicio: [
        v => !!v || mensagensCadastro.MSG01,
        v =>
          v
            ? /^([0-1][0-9]|[2][0-3]):[0-5][0-9]$/.test(v) ||
              mensagensCadastro.MSG11
            : true
      ],
      fieldRequired: [v => !!v || mensagensCadastro.MSG01],
      validaHorárioFim: [
        v => !!v || mensagensCadastro.MSG01,
        v => this.horarioFimMaiorInicio() || mensagensCadastro.MSG06,
        v =>
          v
            ? /^([0-1][0-9]|[2][0-3]):[0-5][0-9]$/.test(v) ||
              mensagensCadastro.MSG11
            : true
      ]
    }
  },
  computed: {
    dataHoraInicioFormatada () {
      return (
        this.formatarDataPadraoBrasil(this.dataInicio) + ' ' + this.horaInicio
      )
    },
    dataHoraFimFormatada () {
      return this.formatarDataPadraoBrasil(this.dataFim) + ' ' + this.horaFim
    }
  },
  watch: {
    titulo (value, oldValue) {
      if (oldValue != null) {
        this.houveMundacaTela = value !== oldValue
      }
    },
    unidade (value, oldValue) {
      if (this.$route.params.id && oldValue != null) {
        this.houveMundacaTela = value !== oldValue
      } else if (!this.$route.params.id) {
        this.houveMundacaTela = value !== oldValue
      }
    },
    dataInicio (value, oldValue) {
      if (oldValue != null) {
        this.houveMundacaTela = value !== oldValue
      }
    },
    duracaoEvento (value, oldValue) {
      if (this.$route.params.id && oldValue != null) {
        this.houveMundacaTela = value !== oldValue
      } else if (!this.$route.params.id) {
        this.houveMundacaTela = value !== oldValue
      }
    },
    dataFim (value, oldValue) {
      if (oldValue != null) {
        this.houveMundacaTela = value !== oldValue
      }
    },
    horaInicio (value, oldValue) {
      if (oldValue != null) {
        this.houveMundacaTela = value !== oldValue
      }
    },
    horaFim (value, oldValue) {
      if (oldValue != null) {
        this.houveMundacaTela = value !== oldValue
      }
    },
    localEvento (value, oldValue) {
      if (oldValue != null) {
        this.houveMundacaTela = value !== oldValue
      }
    },
    urlInscricao (value, oldValue) {
      if (oldValue != null) {
        this.houveMundacaTela = value !== oldValue
      }
    },
    imagemEvento (value, oldValue) {
      if (this.$route.params.id) {
        if (oldValue != null) {
          this.houveMundacaTela = value !== oldValue
        }
      } else {
        this.houveMundacaTela = value !== oldValue
      }
    },
    descricao (value, oldValue) {
      if (this.$route.params.id) {
        if (oldValue != null) {
          this.houveMundacaTela = value !== oldValue
        }
      } else {
        this.houveMundacaTela = value !== oldValue
      }
    },
    programacao (value, oldValue) {
      if (this.$route.params.id) {
        if (oldValue != null) {
          this.houveMundacaTela = value !== oldValue
        }
      } else {
        this.houveMundacaTela = value !== oldValue
      }
    }
  },
  methods: {
    validarDataDigitada (data) {
      if (data) {
        if (data.split('')[3] === 0 && data.split('')[4] === 2) {
          return /^(0[1-9]|[12][0-9])\/(0[1-9]|1[012])\/(19|20)\d{2}$/.test(
            data
          )
            ? true
            : 'Data Inválida!'
        } else {
          return /^(((0[1-9]|[12][0-9]|3[01])([-./])(0[13578]|10|12)([-./])(\d{4}))|(([0][1-9]|[12][0-9]|30)([-./])(0[469]|11)([-./])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([-./])(02)([-./])(\d{4}))|((29)(\.|-|\/)(02)([-./])([02468][048]00))|((29)([-./])(02)([-./])([13579][26]00))|((29)([-./])(02)([-./])([0-9][0-9][0][48]))|((29)([-./])(02)([-./])([0-9][0-9][2468][048]))|((29)([-./])(02)([-./])([0-9][0-9][13579][26])))$/.test(
            data
          )
            ? true
            : 'Data Inválida!'
        }
      } else {
        return true
      }
    },
    removerPublicacao () {
      this.$services.removerPublicacao({ id: this.$route.params.id })
        .then(response => {
          this.mostrarMensagemEventoRemovido()
          this.$router.push('/')
        })
        .catch(error => {
          console.error(error)
        })
    },
    salvarEvento (isPublicar) {
      this.terminouRequisicaoHttp = false
      if (isPublicar) {
        this.$services.publicarEvento(this.preparaObjetoParaBack())
          .then(response => {
            this.mostrarMensagemEventoPublicado()
            this.$router.push('/')
          })
          .catch(error => {
            this.mostrarMensagemErroAoPublicar()
            this.$router.push('/')
            console.error(error)
          }).finally(final => { this.terminouRequisicaoHttp = true })
      } else if (this.$route.params.id) {
        this.$services.atualizarEvento(this.preparaObjetoParaBack())
          .then(response => {
            this.mostrarMensagemEventoAtualizado()
            this.$router.push('/')
          })
          .catch(error => {
            console.error(error)
          }).finally(final => { this.terminouRequisicaoHttp = true })
      } else {
        this.$services.salvarEvento(this.preparaObjetoParaBack())
          .then(resp => {
            this.mostrarMensagemEventoCadastrado()
            this.$router.push('/')
          })
          .catch(error => {
            console.error(error)
          }).finally(final => { this.terminouRequisicaoHttp = true })
      }
    },
    validarEvento (publicar) {
      if (!this.$route.params.id) {
        this.$refs.refDescricao.verificarCampoObrigatorio(this.objetoRichTextDescricao)
      }
      if (this.$refs.form.validate() && !this.$refs.refDescricao.mensagemErroDescricao && this.terminouRequisicaoHttp) {
        this.salvarEvento(publicar)
      }
    },
    preparaObjetoParaBack () {
      let campoUnidade = document.getElementById('idUnidade')
      if (this.urlInscricao) {
        if (!this.urlInscricao.startsWith('http://')) { this.urlInscricao = 'http://' + this.urlInscricao }
      }
      var calendario = {
        id: this.id,
        dtHrInicio: this.dataHoraInicioFormatada,
        dtHrFim: this.dataHoraFimFormatada,
        endereco: this.localEvento,
        descricao: this.descricao,
        titulo: this.titulo,
        unidade: this.unidade,
        destaque: this.destaque,
        detalhes: this.programacao,
        imagemDestacada: this.imagemEvento,
        urlInscricao: this.urlInscricao,
        idPublicacao: this.idPublicado,
        dataPublicacao: this.dataPublicacao,
        dataAtualizacaoPublicacao: this.dataAtualizacaoPublicacao,
        unidadeDTO: {
          id: this.unidade,
          nome: campoUnidade.value
        }
      }
      return calendario
    },
    cancelarEvento () {
      this.$router.push('/')
    },
    formatarDataPadraoBrasil (date) {
      if (!date) return null
      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    horarioFimMaiorInicio () {
      if (this.horaInicio && this.horaFim) {
        var horaFim = this.horaFim.split(':').join('')
        var horaInicio = this.horaInicio.split(':').join('')
        return horaFim > horaInicio
      } else {
        return true
      }
    },
    dataFimMaiorInicio (dataFinal) {
      if (dataFinal) {
        dataFinal = dataFinal
          .split('/')
          .reverse()
          .join('-')
      }
      if (this.dataFim && this.dataInicio) {
        let inicioArray = this.dataInicio.split('-')
        let fimArray = dataFinal.split('-')
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
    converterDateParaFormatoAmericano (date) {
      var dd = date.getDate()
      var mm = date.getMonth() + 1
      var yyyy = date.getFullYear()
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      var today = yyyy + '-' + mm + '-' + dd
      return today
    },
    editarEvento (idRecebido) {
      let calendarioEdicao = {}
      this.$services.editarEvento({ id: idRecebido })
        .then(response => {
          calendarioEdicao = response.data.body
          this.setarValoresParaEdicao(calendarioEdicao)
        })
        .catch(error => {
          console.error(error)
        })
    },
    mostrarMensagemEventoCadastrado () {
      window.parent.postMessage(
        { enable: true, message: mensagensCadastro.MSG08, type: 'success' },
        '*'
      )
    },
    mostrarMensagemEventoAtualizado () {
      window.parent.postMessage(
        { enable: true, message: mensagensEditar.MSG08, type: 'success' },
        '*'
      )
    },
    mostrarMensagemEventoPublicado () {
      window.parent.postMessage(
        { enable: true, message: mensagensCadastro.MSG09, type: 'success' },
        '*'
      )
    },
    mostrarMensagemEventoRemovido () {
      window.parent.postMessage(
        { enable: true, message: mensagensEditar.MSG15, type: 'success' },
        '*'
      )
    },
    mostrarMensagemErroAoPublicar () {
      window.parent.postMessage(
        { enable: true, message: mensagensCadastro.MSG14, type: 'error' },
        '*'
      )
    },
    setarValoresParaEdicao (calendario) {
      this.id = calendario.id
      this.idPublicado = calendario.idPublicacao
      this.titulo = calendario.titulo
      this.unidade = calendario.unidade
      this.dataInicio = calendario.dtHrInicio
        .split(' ')[0]
        .split('/')
        .reverse()
        .join('-')
      this.dataFim = calendario.dtHrFim
        .split(' ')[0]
        .split('/')
        .reverse()
        .join('-')
      this.horaInicio = this.adicionarZeroEsquerdaHora(
        calendario.dtHrInicio.split(' ')[1]
      )
      this.horaFim = this.adicionarZeroEsquerdaHora(
        calendario.dtHrFim.split(' ')[1]
      )
      this.imagemEvento = calendario.imagemDestacada
      this.urlInscricao = calendario.urlInscricao
      this.localEvento = calendario.endereco
      this.descricao = calendario.descricao
      this.destaque = calendario.destaque
      this.programacao = calendario.detalhes
      this.dataPublicacao = calendario.dataPublicacao
      this.dataAtualizacaoPublicacao = this.dataAtualizacaoPublicacao
      this.calcularDuracao(this.dataInicio, this.dataFim)
    },
    calcularDuracao (dataInicio, dataFim) {
      var dataInicioLocal = new Date(
        dataInicio.slice(0, 4),
        dataInicio.slice(5, 7) - 1,
        dataInicio.slice(8, 10)
      )
      var dataFimLocal = new Date(
        dataFim.slice(0, 4),
        dataFim.slice(5, 7) - 1,
        dataFim.slice(8, 10)
      )
      var diferenca = Math.abs(
        dataFimLocal.getTime() - dataInicioLocal.getTime()
      )
      this.diferenca = diferenca / 86400000
      if (this.diferenca === 0) this.duracaoEvento = '1 dia'
      if (this.diferenca === 1) this.duracaoEvento = '2 dias'
      if (this.diferenca === 2) this.duracaoEvento = '3 dias'
      if (this.diferenca === 3) this.duracaoEvento = '4 dias'
      if (this.diferenca === 4) this.duracaoEvento = '5 dias'
      if (this.diferenca > 4) this.duracaoEvento = 'Personalizar'
    },
    adicionarZeroEsquerdaHora (horas) {
      if (horas.length === 4) {
        return '0' + horas
      } else {
        return horas
      }
    },
    verificarDataInicioDuracaoEventoPreenchidos (event) {
      if (this.duracaoEvento && this.dataInicio) {
        this.calcularDataFim(event)
      }
    },
    calcularDataFim (event) {
      var dataProcessada = new Date(this.dataInicio)
      if (
        this.duracaoEvento &&
        this.dataInicio &&
        this.duracaoEvento !== '1 dia'
      ) {
        this.$refs.linhaDataInicio.className = 'col-sm-4 col-md-4 col-12'
        this.$refs.linhaSelected.className = 'col-sm-4 col-md-4 col-12'
        switch (this.duracaoEvento) {
          case 'Personalizar':
            event === 'Personalizar'
              ? dataProcessada.setDate(dataProcessada.getDate() + 1)
              : dataProcessada.setDate(
                dataProcessada.getDate() + this.diferenca + 1
              )
            this.desabilitarDataFim = false
            break
          case '2 dias':
            dataProcessada.setDate(dataProcessada.getDate() + 2)
            this.desabilitarDataFim = true
            break
          case '3 dias':
            dataProcessada.setDate(dataProcessada.getDate() + 3)
            this.desabilitarDataFim = true
            break
          case '4 dias':
            dataProcessada.setDate(dataProcessada.getDate() + 4)
            this.desabilitarDataFim = true
            break
          case '5 dias':
            dataProcessada.setDate(dataProcessada.getDate() + 5)
            this.desabilitarDataFim = true
            break
        }
      } else {
        this.$refs.linhaDataInicio.className = 'col-sm-6 col-md-6 col-12'
        this.$refs.linhaSelected.className = 'col-sm-6 col-md-6 col-12'
        dataProcessada.setDate(dataProcessada.getDate() + 1)
      }
      dataProcessada = this.converterDateParaFormatoAmericano(dataProcessada)
      let isDataValida = this.validarDataDigitada(
        this.formatarDataPadraoBrasil(this.dataInicio)
      )
      isDataValida === true
        ? (this.dataFim = dataProcessada)
        : (this.dataFim = this.dataInicio)
    },
    async getUnidades () {
      await this.$services.getUnidades().then(response => {
        this.unidades = response.data.body
      })
      this.unidades.sort(function (a, b) {
        if (a.municipio.nome > b.municipio.nome) return 1
        if (a.municipio.nome < b.municipio.nome) return -1
        return 0
      })
    }
  }
}
</script>

<style>
</style>
