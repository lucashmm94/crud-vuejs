<template>
  <div>
    <Editor
      v-model="editor"
      id="idEditor"
      @text-change="emitirHtml($event);verificarCampoObrigatorio($event)"
      editorStyle="height: 160px"
    >
      <template slot="toolbar">
        <span v-show="false"></span>
        <span class="ql-formats">
          <select id="tamanho" class="ql-size" title="Tamanho" aria-labelledby="tamanho">
            <option value="small">Pequena</option>
            <option selected></option>
            <option value="large">Ampla</option>
            <option value="huge">Imensa</option>
          </select>
        </span>
        <span class="ql-formats">
          <button class="ql-bold"  title="Negrito" aria-label="Negrito"/>
          <button class="ql-italic"  title="Itálico" aria-label="Itálico"/>
          <button class="ql-underline"  title="Sublinhado" aria-label="Sublinhado"/>
          <button class="ql-strike"  title="Riscado" aria-label="Riscado"/>
        </span>
        <span class="ql-formats">
          <button class="ql-align" value title="Alinhar à esquerda" aria-label="Alinhar à esquerda"/>
          <button class="ql-align" value="center" title="Centralizar" aria-label="Centralizar"/>
          <button class="ql-align" value="right" title="Alinhar à direita" aria-label="Alinhar à direita"/>
          <button class="ql-align" value="justify" title="Justificado" aria-label="Justificado"/>
        </span>
        <span class="ql-formats">
          <button class="ql-header" value="1" title="Cabeçalho Título" aria-label="Cabeçalho Título"/>
          <button class="ql-header" value="2" title="Cabeçalho Sub-Título" aria-label="Cabeçalho Sub Titulo"/>
        </span>
        <span class="ql-formats">
          <button class="ql-list" value="ordered" title="Lista ordenada" aria-label="Lista Ordenada"/>
          <button class="ql-list" value="bullet" title="Lista não ordenada" aria-label="Lista Não Ordenada"/>
          <button class="ql-list" value="check" title="Lista checada" aria-label="Lista Checada" />
        </span>
        <span class="ql-formats">
          <button class="ql-script" value="sub" title="Logaritmo" aria-label="Logaritmo"></button>
          <button class="ql-script" value="super" title="Potência" aria-label="Potência"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-indent" value="-1" title="Identar à esquerda" aria-label="Identar à esquerda"></button>
          <button class="ql-indent" value="+1" title="Identar a direita" aria-label="Identar a direita"></button>
        </span>
        <span class="ql-formats">
          <select class="ql-color" id="corFonte" aria-labelledby="corFonte">
            <option selected></option>
            <option value="red"></option>
            <option value="orange"></option>
            <option value="yellow"></option>
            <option value="green"></option>
            <option value="blue"></option>
            <option value="purple"></option>
          </select>
          <select class="ql-background" id="corFundo" aria-labelledby="corFundo">
            <option selected></option>
            <option value="red"></option>
            <option value="yellow"></option>
            <option value="green"></option>
            <option value="blue"></option>
            <option value="purple"></option>
            <option value="black"></option>
          </select>
        </span>
        <span class="ql-formats">
          <button class="ql-link" title="Link" aria-label="Link"></button>
          <button class="ql-image" title="Imagem" aria-label="Imagem"></button>
          <button class="ql-video" title="Video" aria-label="Video"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-clean" title="Limpar Formatação" aria-label="Limpar Formatação"></button>
        </span>
      </template>
    </Editor>
    <p
      v-show="mensagemErroDescricao"
      class="mensagemErro"
    >Campo obrigatório não informado!</p>
  </div>
</template>

<script>
import Editor from 'primevue/editor'

export default {
  mounted () {
    this.trocarLetrasBotoes()
  },
  props: {
    id: {
      type: String
    },
    textoRecebidoBack: {
      type: String
    }
  },
  data () {
    return {
      mensagemErroDescricao: false,
      editor: null
    }
  },
  methods: {
    verificarCampoObrigatorio (objeto) {
      if (this.id === 'idDescricao') {
        let container = document.getElementById('idEditor')
        let toolbar = container.firstElementChild
        let content = container.lastElementChild

        let isImagemVideo = objeto.htmlValue.includes('src')

        if (objeto.textValue.length > 0 || isImagemVideo) {
          this.mensagemErroDescricao = false
          content.style.border = ''
          toolbar.style.border = ''
        } else {
          this.mensagemErroDescricao = true
          content.style.border = '2px solid red'
          toolbar.style.borderTop = '2px solid red'
          toolbar.style.borderLeft = '2px solid red'
          toolbar.style.borderRight = '2px solid red'
        }
        this.$emit('mensagemErroDescricao', this.mensagemErroDescricao)
        return !this.mensagemErroDescricao
      }
    },
    emitirHtml (objeto) {
      this.$emit('textoAlterado', { 'htmlValue': objeto.htmlValue, 'textValue': objeto.textValue })
    },
    trocarLetrasBotoes () {
      let bntNegritos = document.getElementsByClassName('ql-bold')
      let btnItalicos = document.getElementsByClassName('ql-italic')
      let btnSublinhado = document.getElementsByClassName('ql-underline')
      let btnRiscado = document.getElementsByClassName('ql-strike')
      for (let item of bntNegritos) {
        item.innerHTML = '<b>N</b>'
      }
      for (let item of btnItalicos) {
        item.innerHTML = '<i>I</i>'
      }
      for (let item of btnSublinhado) {
        item.innerHTML = '<u>S</u>'
      }
      for (let item of btnRiscado) {
        item.innerHTML = '<del>V</del>'
      }
    }
  },
  watch: {
    textoRecebidoBack (value) {
      this.editor = value
    },
    editor (value, oldValue) {
      var content = document.getElementById('idEditor').children[1].firstElementChild
      if (value) {
        if (value.trim().length > 1073741824) {
          content.innerHTML = oldValue
        }
      }
    }
  },
  components: {
    Editor
  }
}
</script>

<style >
.mensagemErro {
  color: #ff5252;
  font-size: 12px;
  font-family: "Roboto", sans-serif;
  padding-left: 12px;
}
</style>
