<template>
  <div>
    <v-container v-if="showOrder" class="mt-5">
      <div
        class="pa-4 body-1 white--text d-flex flex-column flex-lg-row justify-space-between align-center"
        :class="{
          'yellow darken-2': showOrder.status === 'pendiente',
          pink: showOrder.status === 'cancelada',
          'accent-3 green': showOrder.status === 'completada',
        }"
      >
        <span
          >Resumen de la orden {{ `${showOrder.id.toLocaleUpperCase()}` }}</span
        >
        <span> {{ `${showOrder.status.toLocaleUpperCase()}` }} </span>
      </div>
      <v-card
        class="_card pa-6 mt-4 b-shadow body-2"
        :class="{
          'b-pendiente': showOrder.status === 'pendiente',
          'b-cancelada': showOrder.status === 'cancelada',
          'b-completada': showOrder.status === 'completada',
        }"
      >
        <div class="overline mb-2">Montos</div>
        <v-row>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <strong class="pr-1">Tasa aplicada: </strong>
            <span> {{ showOrder.amount.tasa }} </span>
          </v-col>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <strong class="pr-1">Envio: </strong>
            <!-- <span class="text-capitalize"
              >{{ showOrder.amount.pesos.format(0, 3, '.') }} $</span
            > -->
            <span>{{showOrder.amount.pesos}} Pesos</span>
          </v-col>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <p>
              <strong class="pr-1">Recibe: </strong>
              <span
                >{{
                  $currencyFormat($unFormat(`${showOrder.amount.pesos}`) / showOrder.amount.tasa)
                }}
                Bs</span
              >
            </p>
            <p>
              <strong class="pr-1">Equivalente: </strong>
              <span>{{showOrder.amount.dollars}} Dólar</span>
            </p>
          </v-col>
        </v-row>
        <div class="overline mb-2 mt-10">datos del remitente</div>
        <v-row>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <strong class="pr-1">Nombre: </strong>
            <span class="text-capitalize">
              {{
                `${showOrder.remitente.name} ${
                  showOrder.remitente.nameSecond
                    ? showOrder.remitente.nameSecond
                    : ''
                } ${showOrder.remitente.surname} ${
                  showOrder.remitente.surnameSecond
                    ? showOrder.remitente.surnameSecond
                    : ''
                }`
              }}
            </span>
          </v-col>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <strong class="pr-1">Identificacion: </strong>
            <span>{{
              `${$getId(showOrder.remitente.tid)}${showOrder.remitente.id}`
            }}</span>
          </v-col>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <strong class="pr-1">Telefono: </strong>
            <span> {{ showOrder.remitente.phone }} </span>
          </v-col>
        </v-row>
        <div class="overline mb-2 mt-10">datos del destinatario</div>
        <v-row>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <strong class="pr-1">Nombre: </strong>
            <span class="text-capitalize">{{
              showOrder.destinatario.name
            }}</span>
          </v-col>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <strong class="pr-1">Identificacion: </strong>
            <span>{{
              `${$getId(showOrder.destinatario.tid)}${
                showOrder.destinatario.id
              }`
            }}</span>
          </v-col>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <strong>Banco: </strong>
            <span> {{ showOrder.destinatario.bank }} </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <strong class="pr-1">Cuenta: </strong>
            <span class="text-capitalize">{{
              showOrder.destinatario.account
            }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <p class="overline mt-4">detalles de la orden</p>
            <p>
              <strong class="pr-1">Orden creada: </strong>
              <span class="text-capitalize">{{
                $moment(showOrder.timestamp).format('DD-MM-YYYY hh:mm a')
              }}</span>
            </p>
            <p>
              <strong class="pr-1">Estado: </strong>
              <strong
                class="text-capitalize"
                :class="{
                  'text--darken-2 yellow--text ':
                    showOrder.status === 'pendiente',
                  'pink--text': showOrder.status === 'cancelada',
                  'text--accent-3 green--text':
                    showOrder.status === 'completada',
                }"
              >
                {{ showOrder.status }}
              </strong>
            </p>
            <p v-if="showOrder.status !== 'pendiente'">
              <strong class="pr-1">Definición de la orden: </strong>
              <span class="text-capitalize">{{
                $moment(showOrder.payout.timestamp).format('DD-MM-YYYY hh:mm a')
              }}</span>
            </p>
            <p v-if="showOrder.status === 'cancelada'">
              <strong class="pr-1">Motivo de cancelacion: </strong>
              <span class="text-capitalize">{{
                showOrder.payout.message
              }}</span>
            </p>
          </v-col>
          <v-col cols="12" lg="4" class="py-0 pb-1">
            <p class="overline mt-4">metodo de pago</p>
            <p v-if="showOrder.payment_method && showOrder.payment_method.type">
              <span class="text-capitalize">{{
                showOrder.payment_method.type
              }}</span>
            </p>
            <p v-if="showOrder.payment_method && showOrder.payment_method.text">
              <strong class="pr-1">Mensaje: </strong>
              <span class="text-capitalize">{{
                showOrder.payment_method.text
              }}</span>
            </p>
          </v-col>
          <v-col cols="12" lg="4" class="py-0 pb-1 mt-5 mt-lg-0">
            <div class="d-flex flex-column justify-center align-center h-full">
              <v-btn
                class="ma-1"
                target="_blank"
                color="indigo"
                dark
                depressed
                @click="printPDF"
              >
                <v-icon left> mdi-printer </v-icon>
                imprimir PDF
              </v-btn>
              <v-btn
                class="ma-1"
                target="_blank"
                color="indigo"
                dark
                depressed
                @click="downloadPDF"
              >
                <v-icon left> mdi-download </v-icon>
                descargar PDF
              </v-btn>
              <v-btn
                class="ma-1"
                target="_blank"
                color="indigo"
                dark
                depressed
                @click="copyTextClipboard"
              >
                <v-icon left> mdi-clipboard-check-multiple </v-icon>
                copiar datos de la orden
              </v-btn>
              <v-btn
                v-if="showOrder.status === 'completada'"
                class="mx-1"
                :href="showOrder.payout.img"
                target="_blank"
                color="#00E676"
                dark
                depressed
              >
                ver capture del pago
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
      <div class="mt-7 d-flex justify-center justify-lg-end">
        <v-btn to="/dashboard/movimientos" color="orange" text>
          ver todos los movimientos
        </v-btn>
      </div>
    </v-container>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { jsPDF } from 'jspdf'

export default {
  data: () => ({
    status: {
      pendiente: false,
      cancelada: false,
      completada: true,
    },
  }),
  computed: {
    ...mapGetters('user', ['showUser']),
    ...mapGetters('resumeOrder', ['showOrder']),
    ...mapGetters('resumeOrder', ['getDollars']),
  },
  methods: {
    createTXT() {
      const a = this.showOrder
      const r = a.remitente
      const d = a.destinatario
      return `========================\nREMITENTE\nNombre: ${r.name} ${
        r.nameSecond ? r.nameSecond : ''
      } ${r.surname} ${
        r.surnameSecond ? r.surnameSecond : ''
      }\nDocumento: ${this.$getId(r.tid)}${r.id}\nTelefono: ${r.phone}
\nDESTINATARIO\nNombre: ${d.name}\nDocumento: ${this.$getId(d.tid)}${
        d.id
      }\nBanco: ${d.bank}\nCuenta: ${d.account}
\nMETODO DE PAGO\n${a?.payment_method?.type ? a.payment_method.type : ' '}\n${a?.payment_method?.text ? a.payment_method.text : ' '}
\nMONTOS\nTasa aplicada: ${a.amount.tasa}\nEnvio: ${Number(this.$unFormat(a.amount.pesos)).format(0, 3, '.')} PESOS\nRecibe: ${this.$currencyFormat(this.$unFormat(`${a.amount.pesos}`) / a.amount.tasa)
      }  BOLIVARES\nEquivalente: ${a.amount.dollars ? a.amount.dollars : '0'} Dólar\n\nFecha creacion de la orden: ${this.$moment(
        a.timestamp
      ).format('DD-MM-YYYY hh:mm a')}\nDefinición de la orden: ${
        a.payout.timestamp
          ? this.$moment(a.payout.timestamp).format('DD-MM-YYYY hh:mm a')
          : 'PENDIENTE POR DEFINIR'
      }\n========================`
    },
    downloadPDF() {
      const a = this.showOrder
      const copy = this.createTXT()
      if (process.browser) {
        const doc = new jsPDF()
        doc.text(copy, 15, 20)
        doc.save(`${a.id.toUpperCase()}.pdf`)
      }
    },
    printPDF() {
      const copy = this.createTXT()
      if (process.browser) {
        const doc = new jsPDF()
        doc.text(copy, 15, 20)
        window.open(doc.output('bloburl'))
      }
    },
    async copyTextClipboard() {
      const copy = this.createTXT()

      try {
        await this.$copyText(copy)
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Datos copiados al portapapeles',
          color: 'success',
        })
      } catch (e) {
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'No se puedieron copiar los datos',
          color: 'pink',
        })
      }
    },
    calcPercentage() {
      return (
        (this.showOrder.amount.pesos * this.showUser.percentage) /
        100
      ).format(0, 3, '.')
    },
  },
}
</script>
<style lang="scss" scoped>
._card {
  border-bottom: 2px solid;
}
.b-pendiente {
  border-bottom-color: #fbc02d;
}
.b-cancelada {
  border-bottom-color: #e91e63;
}
.b-completada {
  border-bottom-color: #00e676;
}
</style>
