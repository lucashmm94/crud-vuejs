<template>
  <v-card
    class="mx-auto"
    :max-width="width"
    :elevation="3"
    :outlined="isOutline"
  >
    <v-card-text>
      <slot name="body"></slot>
    </v-card-text>
    <v-card-actions>
      <slot name="footer"></slot>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data: () => ({
  }),
  props: {
    width: {
      type: String
    },
    isOutline: {
      type: Boolean,
      default: false
    }
  }
}
</script>
