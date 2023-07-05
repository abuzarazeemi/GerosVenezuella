<template>
  <v-card
    class="pa-6 pb-4 b-shadow d-flex flex-column"
    height="100%"
  >
    <div class="d-flex justify-space-between align-center mb-4">
      <span color="black" class="body-1 font-weight-bold p-color"><span style="color:#FB8C00">4.</span> METODO DE PAGO</span>
    </div>

    <p>
      <v-select
          v-model="paymentInfo.type"
          :items="paymentOptions"
          label="Seleccione el Metodo de Pago"
          @input="getField"
          solo
      ></v-select>
    </p>
    <p>
      <v-textarea
        solo
        v-model="paymentInfo.text"
        name="input-7-4"
        label="Comentario Adicional"
        @blur="getField"
      ></v-textarea>
    </p>
  </v-card>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
// import login from "~/pages/login";
export default {
  data () {
    return {
      paymentInfo: {type: "", text: ""},
      paymentOptions: ['Efectivo', 'Bancolombia', 'Nequi', 'Davivienda', 'Otros'],
    }
  },
  methods: {
    async getField() {
      this.$emit('paymentMethod', this.paymentInfo)
    }
    
  }
}
</script>
