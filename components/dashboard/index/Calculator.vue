<template>
  <v-col cols="12" lg="5" class="pr-lg-2 py-0">
    <v-card
      class="_card pa-6 pb-4 b-shadow d-flex flex-column justify-space-between"
    >
      <div class="d-flex justify-space-between align-center">
        <span color="black" class="body-1 font-weight-bold p-color"
          >CALCULAR ENVIO</span
        >
      </div>

      <div class="mt-4 d-flex flex-column align-center">
        <div>
          <small class="caption text--lighten-1 grey--text">
            TASA ACTUAL
          </small>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                dark
                color="grey"
                class="pl-1"
                v-bind="attrs"
                v-on="on"
              >
                mdi-information
              </v-icon>
            </template>
            <span v-if="!showOnTasas">cargando</span>
            <div v-else>
              <p>10.000 - 100.000 > {{ showTasas.tasas.a }}</p>
              <p>101.000 - 150.000 > {{ showTasas.tasas.b }}</p>
              <p>151.000 - 200.000 > {{ showTasas.tasas.c }}</p>
              <p>mas de 201.000 > {{ showTasas.tasas.d }}</p>
            </div>
          </v-tooltip>
        </div>
        <v-progress-circular
          v-if="!showOnTasas"
          color="grey"
          class="my-2"
          indeterminate
          size="34"
        />
        <span
          v-else
          ref="tasa"
          class="display-1 font-weight-bold primary--text py-2"
        >
          {{ showTasas.tasas.a }}
        </span>
        <span v-if="showTasas" class="caption text--lighten-1 grey--text">
          {{ `actualizada ${$moment(showTasas.timestamp).fromNow()}` }}
        </span>

        <div class="">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="pesos"
                class="centered-input"
                label="Pesos"
                hide-details
                @keyup="calcChange(true)"
              />
                <!-- @keypress="limitChartInput($event)" -->
              <p class="mt-1">
                <small class="primary--text">Cantidad que envian</small>
              </p>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="bs"
                class="centered-input"
                label="Bolivares"
                hide-details
                @keyup="calcChange(false)"
              />
                <!-- @keypress="limitChartInput($event)" -->
              <p class="mt-1">
                <small class="primary--text">Cantidad que reciben</small>
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="dollars"
                class="centered-input"
                label="Dolar Venezuela"
                hide-details
                @input="updateBolivares"
              />
              <p class="mt-1">
                <small class="primary--text">Dólar Equivalente</small>
              </p>
            </v-col>
            <v-col cols="12" sm="6">
              <p class="mt-3 text-center">
                <span>Bolivares por Dollar</span>
              </p>
              <p class="text-center">
                <span class="primary--text">{{getBolivaresPorDollar.bolivares}}</span>
              </p>
            </v-col>
          </v-row>
        </div>
      </div>
      <div
        class="_chip primary white--text d-flex justify-space-between pa-2 rounded"
        label
      >
        <span class="pr-4">Ganancias</span>
        <div>
          {{ percentage }} $
          <v-icon class="_chip-icon ml-3" color="white"> mdi-label </v-icon>
        </div>
      </div>
    </v-card>
  </v-col>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => ({
    dollars: null,
    pesos: null,
    bs: null,
    show: null,
    percentage: 0,
  }),
  computed: {
    ...mapGetters('user', ['showUser']),
    ...mapGetters('tasas', ['showTasas', 'showOnTasas']),
    ...mapGetters('adminOrders', ['getBolivaresPorDollar']),
  },
  created() {
    this.setBolivaresPorDollar()
  },
  methods: {
    ...mapActions('adminOrders', ['setBolivaresPorDollar']),
    updateBolivares () {
      let dollars = this.dollars.replace(/,/g, "")
      this.bs = this.$currencyFormat(dollars * +this.getBolivaresPorDollar.bolivares)
      this.calcChange(false, false)
    },
    calcChange(z, check=true) {
      const t = this.showTasas.tasas
      let tasa = t.a

      if (z) {
        const pesos = this.pesos.split('.').join('')

        this.pesos = this.$currencyWithoutComma(pesos)

        if (pesos <= 100000) {
          tasa = t.a
          this.$refs.tasa.textContent = t.a
        }
        if (pesos >= 101000) {
          tasa = t.b
          this.$refs.tasa.textContent = t.b
        }
        if (pesos >= 151000) {
          tasa = t.c
          this.$refs.tasa.textContent = t.c
        }
        if (pesos >= 201000) {
          tasa = t.d
          this.$refs.tasa.textContent = t.d
        }
        this.bs = this.$currencyFormat(pesos / tasa)

        this.dollars = this.$currencyFormat((pesos / tasa) / this.getBolivaresPorDollar.bolivares)

        this.calcPercentage()
        return
      }

      // const bs = this.bs.split('.').join('')

      let bs = this.bs.split('.').join('')
      bs = bs.replace(/,/g, ".")
      if (check) {
        this.dollars = this.$currencyFormat(bs / this.getBolivaresPorDollar.bolivares)
      }

      let a = Number(this.$calcAmount(bs, tasa, false))

      if (a <= 100000) {
        tasa = t.a
        a = Number(this.$calcAmount(bs, tasa, false))
        this.$refs.tasa.textContent = t.a
      }
      if (a >= 101000) {
        tasa = t.b
        a = Number(this.$calcAmount(bs, tasa, false))
        this.$refs.tasa.textContent = t.b
      }
      if (a >= 151000) {
        tasa = t.c
        a = Number(this.$calcAmount(bs, tasa, false))
        this.$refs.tasa.textContent = t.c
      }
      if (a >= 201000) {
        tasa = t.d
        a = Number(this.$calcAmount(bs, tasa, false))
        this.$refs.tasa.textContent = t.d
      }

      // this.pesos = a.format(0, 3, '.')
      this.pesos = this.$currencyWithoutComma(`${a}`)

      this.calcPercentage()
    },
    calcPercentage() {
      return (this.percentage = (
        (this.pesos.split('.').join('') * this.showUser.percentage) /
        100
      ).format(0, 3, '.'))
    },
    limitChartInput(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    },
  },
}
</script>
<style lang="scss" scoped>
._card {
  height: 390px;
}
._chip {
  width: 100% !important;
}
._chip-icon {
  transform: rotate(180deg);
}
@media (max-width: 1264px) {
  ._card {
    height: initial;
  }
}
</style>
