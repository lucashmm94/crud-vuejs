<template>
  <div class="text-center">
    <v-snackbar
      v-model="$store.state.snackbar.ativo"
      :timeout="timeout"
      :color="$store.state.snackbar.tipo"
      :top="$store.state.snackbar.top"
      :bottom="$store.state.snackbar.bottom"
    >
      {{ $store.state.snackbar.mensagem }}
      <v-btn color="white" text @click="$store.commit('setAtivo', false)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    timeout: 2000
  })
};
</script>
<style></style>
