<template>
  <div>
    <v-file-input
      clearable
      v-model="imagemEvento"
      accept=".jpg"
      prepend-icon
      append-icon="mdi-camera"
      aria-label="Imagem*"
      label="Imagem*"
      :rules="ruleUpload"
      @change="setupCropper"
    ></v-file-input>
    <v-dialog v-model="dialog" persistent width="520px">
      <v-card max-width="520" raised="raised">
        <v-card-title>
          <v-icon color="secondary" center>mdi-camera</v-icon>
          <span>Recorte sua imagem</span>
        </v-card-title>
        <v-card-text>
          <v-row v-if="objectUrl">
            <v-col class="text-center" cols="12" sm="6">
              <div class="overline">Original</div>
              <div class="image-container elevation-4">
                <img class="image-preview" ref="source" :src="objectUrl" />
              </div>
              <div class="d-flex justify-center">
                <v-btn icon="icon" small="small" @click="rotateLeft">
                  <v-icon small="small">mdi-rotate-left</v-icon>
                </v-btn>
                <v-btn icon="icon" small="small" @click="rotateRight">
                  <v-icon small="small">mdi-rotate-right</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col class="text-center" cols="12" sm="6">
              <div class="overline">Selecionada</div>
              <div class="image-container elevation-4">
                <img class="image-preview" :src="previewCropped" />
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn small @click="emitirFotoCortada()" color="success" :disabled="!objectUrl">
            <v-icon left="left">mdi-send</v-icon>
            <span>Recortar</span>
          </v-btn>
          <v-btn small @click="emitirImagemOriginal()" color="#686868" :disabled="!objectUrl">
            <v-icon left="left" style="color:white">mdi-cancel</v-icon>
            <span style="color:white">Manter Original</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import mensagensCadastro from '../../utils/mensagens-cadastro'
import Cropper from 'cropperjs'
import debounce from 'lodash/debounce'
export default {
  watch: {
    objetoBack (value) {
      this.base64toFile(
        value.base64Arquivo,
        value.nomeArquivo,
        'image/jpeg'
      ).then(result => {
        this.imagemEvento = result
      })
    }
  },
  props: {
    objetoBack: Object
  },
  data () {
    return {
      dialog: false,
      cropper: null,
      objectUrl: null,
      previewCropped: null,
      imagemEvento: null,
      debouncedUpdatePreview: debounce(this.updatePreview, 257),
      ruleUpload: [
        v => !!v || mensagensCadastro.MSG01,
        v => (v && v.type === 'image/jpeg') || mensagensCadastro.MSG04,
        v => (v && v.size < 300000) || mensagensCadastro.MSG03
      ]
    }
  },
  methods: {
    base64toFile (url, filename, mimeType) {
      return fetch(url)
        .then(function (res) {
          return res.arrayBuffer()
        })
        .then(function (buf) {
          return new File([buf], filename, { type: mimeType })
        })
    },
    rotateLeft () {
      this.cropper.rotate(-90)
    },
    rotateRight () {
      this.cropper.rotate(90)
    },
    setupCropper (imagemEvento) {
      if (imagemEvento === undefined) return
      if (imagemEvento.type !== 'image/jpeg' || imagemEvento.size > 300000) return
      if (this.cropper) {
        this.cropper.destroy()
      }
      if (this.objectUrl) {
        window.URL.revokeObjectURL(this.objectUrl)
      }
      if (!imagemEvento) {
        this.cropper = null
        this.objectUrl = null
        this.previewCropped = null
        return
      } else {
        this.dialog = true
      }
      this.objectUrl = window.URL.createObjectURL(imagemEvento)
      this.$nextTick(this.setupCropperInstance)
    },
    setupCropperInstance () {
      this.cropper = new Cropper(this.$refs.source, {
        aspectRatio: 1,
        crop: this.debouncedUpdatePreview
      })
    },
    updatePreview (event) {
      const canvas = this.cropper.getCroppedCanvas()
      this.previewCropped = canvas.toDataURL('image/jpeg')
    },
    emitirFotoCortada () {
      this.dialog = false
      this.$emit('imagemAnexo64', {
        nomeArquivo: this.imagemEvento.name,
        extensaoArquivo: this.imagemEvento.type.split('/')[1],
        base64Arquivo: this.previewCropped
      })
    },
    emitirImagemOriginal () {
      this.dialog = false
      toBase64(this.imagemEvento).then(result => {
        this.$emit('imagemAnexo64', {
          nomeArquivo: this.imagemEvento.name,
          extensaoArquivo: this.imagemEvento.type.split('/')[1],
          base64Arquivo: result
        })
      })
    }
  }
}
const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
</script>

<style lang="scss" scoped>
.image-container {
  display: inline-block;
}
.image-preview {
  display: block;
  max-height: 229px;
  max-width: 100%;
}
</style>
