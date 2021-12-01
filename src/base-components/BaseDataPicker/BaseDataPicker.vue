<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    max-width="290px"
    min-width="290px"
    allow-overflow
  >
    <template  v-slot:activator="{ on }">
      <v-text-field
        ref='campoTexto'
        :disabled="desabilitar"
        clearable
        :rules="rules"
        v-model="dataFormatada"
        :label="label"
        @keydown.enter="onKeyPress"
        v-mask="'##/##/####'"
        @change="fecharDataPicker"
        @keyup="atualizarDataPicker($event);emitirData($event)"
        @input="verificarCampoNulo($event)"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      :min="dataMinima"
      :max="dataMaxima"
      v-model="dateLocal"
      locale="pt-br"
      @input="menu = false"
      no-title
      @click:date = "atualizarCampoTexto($event)"
    ></v-date-picker>
  </v-menu>
</template>
<script>
export default {
  updated () {
    this.$emit('atualizarData', this.dateLocal)
    if (this.label === 'Data Fim*') {
      this.$refs.campoTexto.labelWidth = 54
    }
  },
  props: {
    desabilitar: [Boolean],
    dataMinima: [Date, String],
    dataMaxima: [Date, String],
    label: {
      type: String
    },
    rules: [Function, Array],
    dataRecebida: [String]
  },
  data () {
    return {
      menu: false,
      dateLocal: null,
      dataFormatada: null
    }
  },
  watch: {
    dataRecebida (value) {
      if (value) {
        this.dateLocal = this.dataRecebida.split('/').reverse().join('-')
        this.atualizarCampoTexto(value)
      }
    }
  },
  methods: {
    fecharDataPicker (event) {
      if (this.dateLocal) {
        this.menu = false
      }
    },
    verificarCampoNulo (event) {
      if (event === null || event === undefined) {
        this.dateLocal = event
        this.$emit('dataAtualizada', event)
      }
    },
    atualizarCampoTexto (event) {
      this.$emit('dataAtualizada', event)
      if (event && event.split('').includes('-')) {
        this.dataFormatada = event.split('-').reverse().join('/')
        this.dateLocal = event
      }
    },
    atualizarDataPicker (event) {
      if (event) {
        if (event.target && event.target.value.toString().length === 10) {
          this.dateLocal = event.target.value.split('/').reverse().join('-')
        } else if (this.dataRecebida) {
          this.dateLocal = this.dataRecebida.split('/').reverse().join('-')
        }
      }
    },
    onKeyPress ($event) {
      if (this.menu === false)$event.target.click()
    },
    emitirData (event) {
      if (event.target.value.toString().length === 10) {
        event = event.target.value.split('/').reverse().join('-')
        this.$emit('dataAtualizada', event)
      }
    }
  }
}
</script>
