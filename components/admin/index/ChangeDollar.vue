<template>
  <div>
    <v-fade-transition>
      <v-overlay
        v-if="overlay"
        absolute
        color="grey"
      >
        <v-btn color="primary" @click="overlay = false">
          cambiar dolar
        </v-btn>
      </v-overlay>
    </v-fade-transition>
    <div class="d-flex justify-space-between align-center mb-4">
      <span color="black" class="body-1 font-weight-bold p-color">MONITOR DOLAR VENEZUELA</span>
    </div>
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="bs"
        label="Bolívares por Dólar"
        type="number"
        dense
        outlined
      />
      <v-btn block depressed color="primary" class="white--text" @click="setNewBolivares">
        cambiar dolar
      </v-btn>
    </v-form>
  </div>
</template>
<script>
export default {
  data: () => ({
    valid: false,
    overlay: true,
    bs: null,
  }),
  methods: {
    async setNewBolivares () {
      if (this.$refs.form.validate()) {
        this.$nuxt.$emit('LOADING_OPEN')
        const send = {
          bolivares: this.bs,
          timestamp: Number(new Date())
        }

        try {
          await this.$fireStore.collection('bolivaresPorDollar').add(send)
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Tasas cambiadas correctamente',
            color: 'success'
          })
          this.overlay = true
          this.$refs.form.reset()
          this.$nuxt.$emit('LOADING_CLOSE')
        } catch (e) {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Error al setear tasas nuevas',
            color: 'pink'
          })
          this.$nuxt.$emit('LOADING_CLOSE')
        }
      }
    }
  }
}
</script>
