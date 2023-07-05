<template>
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
        <small class="caption text--lighten-1 grey--text"> TASA ACTUAL </small>
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
              @keypress="limitChartInput($event)"
              @keyup="calcChange(true)"
            />
              <!-- @keyup="stopRemove($event, true)" -->
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
              <!-- @keyup="stopRemove($event, false)" -->
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
              <!-- @keyup="stopRemove($event, true)" -->
            <p class="mt-1">
              <small class="primary--text">Dólar Equivalente</small>
            </p>
          </v-col>
          <v-col cols="12" sm="6">
            <p class="mt-3 text-center">
              <span>Dólar en Venezuela</span>
            </p>
            <p class="text-center">
              <span class="primary--text">{{getBolivaresPorDollar.bolivares}} Bs</span>
            </p>
          </v-col>
        </v-row>
      </div>

      <!-- <div class="d-flex flex-wrap">
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="dollars"
            class="centered-input"
            label="Dolar Venezuela"
            hide-details
            @input="updateBolivares"
          />
          <p class="mt-1">
            <small class="primary--text">Cantidad que envian</small>
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
      </div> -->

    </div>
    <div class="d-flex justify-space-between align-center py-10">
      <span color="black" class="body-1 font-weight-bold p-color"
        >CALCULO AUTOMATICO</span
      >
    </div>
    <!-- tabs -->
    <v-tabs
      v-if="showTasas"
      v-model="tab"
      align-with-title
      color="white"
      background-color="#133d63"
      dark
    >
      <v-tabs-slider color="primary" />

      <v-tab v-for="x in 5" :key="x">
        Hasta {{ (x * 100000).toLocaleString('es-VE') }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="col in 5" :key="col">
        <v-simple-table v-if="showTasas" class="px-5">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Cantidad a enviar</th>
                <th class="text-left">Tasa</th>
                <th class="text-left">Monto a Recibir</th>
                <th class="text-left">Dólar Equivalente</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in 10" :key="row" class="py-2">
                <td>
                  {{
                    (row * 10000 + col * 100000 - 100000).toLocaleString(
                      'es-VE'
                    )
                  }}
                </td>
                <td>
                  {{ getTasa(row * 10000 + col * 100000 - 100000) }}
                </td>
                <td>
                  <!-- {{
                    (
                      (row * 10000 + col * 100000 - 100000) /
                      getTasa(row * 10000 + col * 100000 - 100000)
                    ).toFixed(2)
                  }} -->
                  {{$currencyFormat(
                    (row * 10000 + col * 100000 - 100000) / 
                    getTasa(row * 10000 + col * 100000 - 100000)
                  )}}
                  Bs
                </td>
                <!-- <td>{{getBolivaresPorDollar.bolivares}}</td> -->
                <td>{{$currencyFormat(((row * 10000 + col * 100000 - 100000) / 
                    getTasa(row * 10000 + col * 100000 - 100000) /
                    Number(getBolivaresPorDollar.bolivares)))
                    }} $</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data: () => ({
    dollars: null,
    pesos: null,
    bs: null,
    show: null,
    tab: null,
  }),
  computed: {
    ...mapGetters('tasas', ['showTasas', 'showOnTasas']),
    ...mapGetters('time', ['showTime']),
    ...mapGetters('adminOrders', ['getBolivaresPorDollar']),
    
    setTime() {
      if (this.showTime) {
        return this.$moment(this.time)
          .tz('America/Bogota')
          .format('LL -  h:mm a')
      } else {
        return null
      }
    },
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
    getTasa(z) {
      const t = this.showTasas.tasas
      if (z >= 201000) {
        return t.d
      }
      if (z >= 151000) {
        return t.c
      }
      if (z >= 101000) {
        return t.b
      }
      if (z <= 100000) {
        return t.a
      }
    },
    calcBs(z) {},
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
        // this.bs = (pesos / tasa).toFixed(2)
        this.bs = this.$currencyFormat(pesos / tasa)

        this.dollars = this.$currencyFormat((pesos / tasa) / this.getBolivaresPorDollar.bolivares)

        return
      }

      // const bs = this.bs
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
.nd-main {
  width: 100%;
  margin: 0;
  padding: 40px 0;
  background: rgb(21, 52, 98);
  background: linear-gradient(0deg, #01224e 60%, #0b85eb 99%);

  img {
    width: 15%;
  }
}
.map-layout {
  width: 100%;
}
</style>
