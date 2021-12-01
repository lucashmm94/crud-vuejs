<template>
  <v-row justify="center">
    <v-dialog v-model="abrir" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">
          <slot name="titulo"></slot>
        </v-card-title>
        <v-card-text>
          <slot name="mensagem"></slot>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <slot name="acoes"></slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  props: {
    abrir: {
      type: Boolean,
      default: false
    }
  }
}
</script>
