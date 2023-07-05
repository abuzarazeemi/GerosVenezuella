<template>
  <div>
    <div class="d-flex justify-center align-center nd-main" min-width="100%">
      <img src="../static/3.png" alt="logo">
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

    <div class="d-flex flex-column flex-wrap justify-space-between align-center pb-4 flex-sm-nowrap flex-sm-row cards">
      <v-card
        class="pa-4 pb-4 b-shadow layout-mobile"
        min-width="auto"
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
        <div class="map-layout d-flex flex-sm-row flex-wrap flex-md-nowrap justify-space-between align-center pb-2">
          <img src="../static/image.jpg" alt="" class="mx-auto">
          <div>
          <p class="pb-1 pt-1"><v-icon
            light
            center
            size="20"
          >
            mdi-map-marker
          </v-icon>Direccion: Calle 5555 17 #17-42, Barrio Antonio Nariño, Ciudad Puerto Tejada, Municipio Cauca</p>
          <p class="pb-1"><v-icon
            light
            center
            size="20"
          >
            mdi-email-search
          </v-icon>Código Postal: 191501</p>
          <p class="pb-1"><v-icon
            light
            center
            size="20"
          >
            mdi-phone
          </v-icon>Teléfono de Oficina: +57 (602)828.53.58</p>
          <p class="pb-1"><v-icon
            light
            center
            size="20"
            >
            mdi-whatsapp
          </v-icon>Celular/Whatsapp: (+57) 3137082046</p>
          </div>

        </div>
        <small class="body-2 grey--text font-weight-medium">
          {{ setTime }}
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
  .btn-layout-mobile{
    filter: brightness(95%);
    &:hover{
      filter: brightness(110%);
      transition: .2s;
    }
  }
.layout-mobile{
  @media (min-width: 600px) {
    height: 460px;
  }
  @media (min-width: 960px) {
    height: 334px;
  }
  @media (min-width: 1264px) {
    height: 445px;
  }
  @media (max-width: 600px) {
      width: 100% !important;
  height: auto !important;
  margin: auto !important;
  margin-bottom: 1rem !important;
  .btn-layout-mobile{
  width: 100% !important;
    &:hover{
      filter: brightness(200%);
      transition: .2s;
    }
  }
  }
}
.cards{
  height: 100% !important;
}
.map-layout {
  width: 100%;
  gap: 40px;
  img{
    width: clamp(230px, 40%, 550px);
  }
  p{
    color: #757575;
  }
}
</style>
