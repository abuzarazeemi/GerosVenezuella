<template>
  <div>
    <div class="d-flex justify-center align-center nd-main" min-width="169" min-height="169">
      <img src="../static/girosVenezuela_2.png" alt="logo">
    </div>
    <v-card
      class="py-2 pb-2 mb-4 b-shadow"
      min-width="auto"
    >
      <v-btn to="/dashboard" class="pa-1 ma-0" elevation="0" width="50px" color="#ffffff">
        <v-icon
          light
        >
          mdi-menu
        </v-icon>
      
      </v-btn>
      <small class="body-2 grey--text font-weight-medium">
        {{ setTime }}
      </small>
    </v-card>

    <div class="d-flex flex-column flex-wrap justify-space-between align-center pb-4 flex-sm-nowrap flex-sm-row" height="auto">
      <v-card
        class="pa-4 pb-4 b-shadow layout-mobile"
        min-width="auto"
        height="350"
      >
        <v-btn
          class="text-capitalize mx-auto my-auto btn-layout-mobile"
          elevation="2"
          color="success"
          href="https://wa.me/573137082046"
        >
          WhatsApp
          <v-icon
            dark
            right
          >
            mdi-whatsapp
          </v-icon>
        </v-btn>
      </v-card>
      <v-card
        class="b-shadow pa-6 pb-4 layout-mobile"
        height="100%"
        width="85%"
        min-width="200"
      >
        <div class="map-layout">
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1988.523902064813!2d-74.100499!3d4.585442!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xdd8e03ef3390a747!2zNMKwMzUnMDcuNiJOIDc0wrAwNicwMS44Ilc!5e0!3m2!1sen!2sus!4v1658105245621!5m2!1sen!2sus" width="100%" height="200" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          <p>Direccion: Calle dddd 17 #17-42, Barrio Antonio Nariño, Ciudad Puerto Tejada, Municipio Cauca</p>
          <p>Código Postal: 191501</p>
          <p>Teléfono de Oficina: +57 (602)828.53.58</p>
          <p>Celular/Whatsapp: (+57) 313.708.20.46</p>
        </div>
        <small class="body-2 grey--text font-weight-medium">
          {{ setTime }} xxxx
        </small>
      </v-card>
    </div>
    <CalculatorGeneral />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import CalculatorGeneral from '~/components/CalculatorGeneral'
export default {
  components: {
    CalculatorGeneral
  },
  computed: {
    ...mapGetters('time', ['showTime']),
    setTime () {
      if (this.showTime) {
        return this.$moment(this.time).tz('America/Bogota').format('LL -  h:mm a')
      } else {
        return null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.nd-main {
  width: 100%;
  margin: 0;
  padding: 40px 0;
  background: rgb(21,52,98);
  background: linear-gradient(0deg, #01224E 60%, #0B85EB 99%);
  img{
    width: 22%;
  }
}
.layout-mobile{
  @media (max-width: 600px) {
      width: 100% !important;
  height: auto !important;
  margin: auto !important;
  margin-bottom: 1rem !important;
  .btn-layout-mobile{
  width: 100% !important;
  }
  }
}
.map-layout {
  width: 100%;
  p{
    color: #757575;
  }
}
</style>
