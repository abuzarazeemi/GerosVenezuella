<template>
  <v-card class="pa-6 b-shadow">
    <!-- <div id="overlay" style="display: block" v-if="isSearch">
      <v-progress-circular
        id="overlay-loader"
        color="amber darken-2"
        class="my-2"
        indeterminate
        size="50"
      />
    </div> -->
    <div class="d-flex justify-space-between align-center mb-4">
      <span class="body-1 font-weight-bold p-color">HISTORIAL DE ORDENES</span>
    </div>

    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-content-space-between align-center flex-wrap">
        <div style="width: 250px; margin-top: -5px; margin-bottom: 20px">
          <v-select
            v-model="select"
            :items="search"
            label="Buscar por"
            dense
            hide-details
          />
        </div>
        <div
          v-if="
            select &&
            select !== 'Fecha' &&
            select !== 'Mostrar Todas' &&
            select !== 'Punto de Venta'
          "
        >
          <div
            v-if="select == 'Banco'"
            style="width: 250px; margin-top: -5px; margin-bottom: 20px"
          >
            <v-select
              v-model="searchParam"
              :items="banks"
              :label="`Escriba el ${select}`"
              dense
              hide-details
            />
          </div>
          <div
            v-else
            style="width: 250px; margin-top: -5px; margin-bottom: 20px"
          >
            <v-text-field
              v-model="searchParam"
              type="text"
              :label="`Escriba el ${select}`"
            />
          </div>
        </div>
        <div
          v-if="select == 'Banco'"
          style="width: 250px; margin-top: -5px; margin-bottom: 20px"
        >
          <v-select
            v-model="seleccione"
            :items="['Mostrar Todas', 'Fecha']"
            label="Seleccione"
            dense
            hide-details
          />
        </div>
        <div
          v-if="select == 'Banco' && seleccione == 'Fecha'"
          style="width: 250px; margin-top: -1px; margin-bottom: 20px"
        >
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="showDates"
                label="Rango de fechas"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="date" scrollable range locale="es-es">
              <v-spacer />
              <v-btn text color="primary" @click="modal = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </div>
        <div
          v-if="select == 'Monto'"
          style="width: 250px; margin-top: -5px; margin-bottom: 20px"
        >
          <v-select
            v-model="seleccione"
            :items="['Mostrar Todas', 'Fecha']"
            label="Seleccione"
            dense
            hide-details
          />
        </div>

        <div
          v-if="select === 'Punto de Venta'"
          style="width: 250px; margin-top: -5px; margin-bottom: 20px"
        >
          <v-select
            v-model="selectPunto"
            :items="showPuntosVentas"
            label="Seleccione el punto de Venta"
            dense
            hide-details
          />
        </div>
        <div
          v-if="select == 'Punto de Venta'"
          style="width: 250px; margin-top: -5px; margin-bottom: 20px"
        >
          <v-select
            v-model="seleccione"
            :items="['Mostrar Todas', 'Fecha']"
            label="Seleccione"
            dense
            hide-details
          />
        </div>

        <!-- data picker -->
        <div
          v-if="
            select === 'Fecha' ||
            (select === 'Monto' && seleccione == 'Fecha') ||
            (selectPunto && seleccione == 'Fecha')
          "
          style="width: 250px; margin-top: -1px; margin-bottom: 20px"
        >
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="showDates"
                label="Rango de fechas"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="date" scrollable range locale="es-es">
              <v-spacer />
              <v-btn text color="primary" @click="modal = false">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </div>

        <div class="ml-4" style="margin-bottom: 20px; margin-top: -5px">
          <v-btn depressed color="warning" @click="searchEnabled">buscar</v-btn>
        </div>
      </div>
    </div>
    <div class="mt-1">
      <v-chip
        class="mb-1"
        v-if="searchResults"
        color="green"
        label
        text-color="white"
      >
        <v-icon left> mdi-label </v-icon>
        Pagadas: {{ $currencyWithoutComma(`${completada}`) }}
      </v-chip>
      <v-chip
        class="mb-1"
        v-if="searchResults"
        color="orange"
        label
        text-color="white"
      >
        <v-icon left> mdi-label </v-icon>
        Pendientes: {{ $currencyWithoutComma(`${pendientes}`) }}
      </v-chip>
      <v-chip
        class="mb-1"
        v-if="searchResults"
        color="red"
        label
        text-color="white"
      >
        <v-icon left> mdi-label </v-icon>
        Canceladas: {{ $currencyWithoutComma(`${cancelada}`) }}
      </v-chip>
      <v-chip
        class="mb-1"
        v-if="searchResults"
        color="indigo"
        label
        text-color="white"
      >
        <v-icon left> mdi-label </v-icon>
        Total: {{ $currencyWithoutComma(`${searchResults.length}`) }}
      </v-chip>
    </div>

    <div
      v-if="(!showOrders || showOrders.length === 0) && isSearch"
      class="border mt-6 h-full d-flex align-center justify-center py-10"
    >
      <v-progress-circular
        v-if="!showOrders"
        color="grey"
        class="my-2"
        indeterminate
        size="34"
      />
      <span v-else class="body-2 text--lighten-1 grey--text text-uppercase"
        >no tienes ordenes pendientes</span
      >
    </div>

    <!-- orders -->
    <div v-else class="pb-2 mt-7 h-full">
      <!-- v-for="(e, i) in renderOrders" -->
      <div
        v-for="(e, i) in paginationChunks"
        :key="i"
        class="e-panel py-3 c-hover"
        :class="colorStatus(e.status)"
      >
        <div class="body-2 px-3">
          <div class="d-flex justify-space-between align-center _resumen">
            <div>
              <div>
                <strong class="text-capitalize">{{
                  findUserPoint(e.uid)
                }}</strong>
              </div>

              <div>
                <small class="c-chip mr-1" :class="colorStatusBg(e.status)">{{
                  e.status
                }}</small>
                <!-- <small class="c-chip purple mr-2"
                  >{{ e.amount.pesos.format(0, 3, '.') }} $</small
                > -->
                <small class="c-chip purple mr-2"
                  >{{
                    Number($unFormat(`${e.amount.pesos}`)).format(0, 3, '.')
                  }}
                  $</small
                >
                <small class="c-chip primary">{{ e.destinatario.bank }}</small>
              </div>

              <div>
                <span class="text-uppercase grey--text">{{
                  e.destinatario.account
                }}</span>
              </div>

              <div class="text-uppercase grey--text">
                <span>{{
                  $moment(e.timestamp).format('DD.MM.YYYY hh:mm a')
                }}</span>
                | <span>Orden ID-{{ e.id }}</span>
              </div>
            </div>
            <div>
              <v-btn
                title="descargar PDF"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="downloadPDF(e)"
              >
                <v-icon small color="primary"> mdi-download </v-icon>
              </v-btn>
              <v-btn
                title="imprimir PDF"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="printPDF(e)"
              >
                <v-icon small color="primary">mdi-printer</v-icon>
              </v-btn>
              <v-btn
                title="copiar datos de la orden"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="copyTextClipboard(e)"
              >
                <v-icon small color="primary"
                  >mdi-clipboard-check-multiple</v-icon
                >
              </v-btn>
              <v-btn
                title="ver resumen de orden"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="showDetailOrder(e)"
              >
                <v-icon small color="primary">mdi-feature-search</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-pagination
      v-if="perPage < searchResults.length && !isSearch"
      v-model="page"
      :length="Math.ceil(this.searchResults.length / this.perPage)"
      :total-visible="7"
      color="secondary"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
    />
    <modalAdminOrder />
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import modalAdminOrder from '~/components/admin/modalAdminOrder'
import { jsPDF } from 'jspdf'
export default {
  components: {
    modalAdminOrder,
  },
  data: () => ({
    seleccione: '',
    banks: [],
    completada: 0,
    pendientes: 0,
    pagadas: 0,
    cancelada: 0,
    page: 1,
    perPage: 10,
    paginationChunks: [],
    searchParam: '',
    select: null,
    selectPunto: null,
    search: [
      'Mostrar Todas',
      'Fecha',
      'Punto de Venta',
      'Remitente',
      'Destinatario',
      'Monto',
      'Banco',
      'ID Orden',
    ],
    // date
    date: [],
    menu: false,
    modal: false,
    menu2: false,
    isSearch: false,
    searchResults: [],
    paginationLength: 0,
  }),
  computed: {
    ...mapGetters('adminOrders', ['showOrders']),
    ...mapGetters('adminOrders', ['showOnOrders']),
    ...mapGetters('adminUsers', ['showUsers']),

    showPuntosVentas() {
      if (this.showUsers) {
        return this.showUsers.map(({ company }) => company)
      }
      return []
    },
    showDates() {
      return this.date.join(' ~ ')
    },
    ordersLength() {
      if (this.showOrders) {
        return this.showOrders.length
      }
      return 0
    },
  },
  watch: {
    searchResults() {
      this.paginationLength = Math.ceil(
        this.searchResults.length / this.perPage
      )
    },
    page() {
      this.paginate()
    },
    select() {
      this.selectPunto = null
      this.searchParam = ''
      this.date = []
    },
    seleccione() {
      this.date = []
    },
  },
  created() {
    this.$fireStore
      .collection('remitentes')
      .get()
      .then((remitentes) => {
        remitentes.forEach((remitente) => {
          remitente.data()?.destinatarios?.forEach((destinatario) => {
            this.banks.findIndex((bank) => bank == destinatario.bank) == -1
              ? this.banks.push(destinatario.bank)
              : null
          })
        })
      })
    if (!this.showOrders && !this.showOrders?.length) {
      // this.getOrders()
    }
  },
  methods: {
    ...mapActions('adminOrders', ['getOrders']),

    async searchEnabled() {
      this.pendientes = 0
      this.pagadas = 0
      this.completada = 0
      this.cancelada = 0
      // this.searchResults = await this.filterByQuery()
      let myPromise = this.filterByQuery()
      myPromise.then((val) => {
        this.searchResults = val
        val.forEach((o) => {
          if (o.status == 'completada') {
            this.completada++
          } else if (o.status == 'cancelada') {
            this.cancelada++
          } else if (o.status == 'pendiente') {
            this.pendientes++
          }
        })
        this.paginate()
        this.isSearch = false
      })
    },
    async filterByQuery() {
      return new Promise((resolve, reject) => {
        this.isSearch = true
        let orders = []
        let results
        if (this.select === 'ID Orden') {
          orders = []
          this.$fireStore
            .collection('orders')
            .where('id', '==', this.searchParam.toLowerCase())
            .get()
            .then((results) => {
              results.docs.forEach((result) => {
                orders.push({ ...result.data() })
              })
              resolve(orders)
            })
        } else if (this.select === 'Banco') {
          orders = []
          this.$fireStore
            .collection('orders')
            .where('destinatario.bank', '==', this.searchParam.toUpperCase())
            .get()
            .then((results) => {
              results.docs.forEach((result) => {
                orders.push({ ...result.data() })
              })
              if (this.date.length === 2) {
                const [start, end] = this.date
                orders = orders.filter(
                  (order) =>
                    order.timestamp >= new Date(start).getTime() &&
                    order.timestamp <= new Date(end).getTime() + 86400000
                )
                orders = orders.sort((x, y) => y.timestamp - x.timestamp)
                resolve(orders)
              } else {
                orders = orders.sort((x, y) => y.timestamp - x.timestamp)
                resolve(orders)
              }
            })
        } else if (this.select === 'Monto') {
          orders = []
          this.$fireStore
            .collection('orders')
            .where('amount.pesos', '==', Number(this.searchParam))
            .get()
            .then((results) => {
              results.docs.forEach((result) => {
                orders.push({ ...result.data() })
              })
              if (this.date.length === 2) {
                const [start, end] = this.date
                orders = orders.filter(
                  (order) =>
                    order.timestamp >= new Date(start).getTime() &&
                    order.timestamp <= new Date(end).getTime() + 86400000
                )
                orders = orders.sort((x, y) => y.timestamp - x.timestamp)
                resolve(orders)
              } else {
                orders = orders.sort((x, y) => y.timestamp - x.timestamp)
                resolve(orders)
              }
            })
        } else if (this.select === 'Punto de Venta') {
          orders = []

          if (this.selectPunto) {
            let userId
            this.$fireStore
              .collection('users')
              .where('company', '==', this.selectPunto)
              .get()
              .then((getUser) => {
                getUser.docs.forEach((user) => {
                  userId = user.data().uid
                })
                this.$fireStore
                  .collection('orders')
                  .where('uid', '==', userId)
                  .get()
                  .then((ordersList) => {
                    ordersList.docs.forEach((order) => {
                      orders.push({ ...order.data() })
                    })
                    if (this.date.length === 2) {
                      const [start, end] = this.date
                      orders = orders.filter(
                        (order) =>
                          order.timestamp >= new Date(start).getTime() &&
                          order.timestamp <= new Date(end).getTime() + 86400000
                      )
                      orders = orders.sort((x, y) => y.timestamp - x.timestamp)
                      resolve(orders)
                    } else {
                      orders = orders.sort((x, y) => y.timestamp - x.timestamp)
                      resolve(orders)
                    }
                  })
              })
          }
        } else if (this.select === 'Remitente') {
          orders = []
          const query = this.searchParam.split(' ')
          if (query.length == 4) {
            this.$fireStore
              .collection('orders')
              .where('remitente.name', '==', query[0].toUpperCase())
              .where('remitente.nameSecond', '==', query[1].toUpperCase())
              .where('remitente.surname', '==', query[2].toUpperCase())
              .where('remitente.surnameSecond', '==', query[3].toUpperCase())
              .get()
              .then((results) => {
                results.forEach((result) => {
                  orders.push({ ...result.data() })
                })
                orders = orders.sort((x, y) => y.timestamp - x.timestamp)
                resolve(orders)
              })
          } else if (query.length == 3) {
            this.$fireStore
              .collection('orders')
              .where('remitente.name', '==', query[0].toUpperCase())
              .where('remitente.nameSecond', '==', query[1].toUpperCase())
              .where('remitente.surname', '==', query[2].toUpperCase())
              .get()
              .then((results) => {
                results.forEach((result) => {
                  orders.push({ ...result.data() })
                })
                orders = orders.sort((x, y) => y.timestamp - x.timestamp)
                resolve(orders)
              })
          } else if (query.length == 2) {
            this.$fireStore
              .collection('orders')
              .where('remitente.name', '==', query[0].toUpperCase())
              .where('remitente.nameSecond', '==', query[1].toUpperCase())
              .get()
              .then((results) => {
                results.forEach((result) => {
                  orders.push({ ...result.data() })
                })
                orders = orders.sort((x, y) => y.timestamp - x.timestamp)
                resolve(orders)
              })
          } else if (query.length == 1) {
            this.$fireStore
              .collection('orders')
              .orderBy('remitente.name')
              .startAt(query[0].toUpperCase())
              .get()
              .then((results) => {
                results.forEach((result) => {
                  orders.push({ ...result.data() })
                })
                orders = orders.sort((x, y) => y.timestamp - x.timestamp)
                resolve(orders)
              })
          } else {
            orders = orders.sort((x, y) => y.timestamp - x.timestamp)
            resolve(orders)
          }
        } else if (this.select === 'Destinatario') {
          orders = []
          this.$fireStore
            .collection('orders')
            .orderBy('destinatario.name')
            .startAt(this.searchParam.toUpperCase())
            .get()
            .then((results) => {
              results.forEach((result) => {
                orders.push({ ...result.data() })
              })
              orders = orders.sort((x, y) => y.timestamp - x.timestamp)
              resolve(orders)
            })
        } else if (this.select === 'Fecha') {
          orders = []
          if (this.date.length === 2) {
            const [start, end] = this.date
            this.$fireStore
              .collection('orders')
              .where('timestamp', '>=', new Date(start).getTime())
              .where('timestamp', '<=', new Date(end).getTime() + 86400000)
              .get()
              .then((results) => {
                results.forEach((result) => {
                  orders.push({ ...result.data() })
                })
                orders = orders.sort((x, y) => y.timestamp - x.timestamp)
                resolve(orders)
              })
          } else {
            orders = orders.sort((x, y) => y.timestamp - x.timestamp)
            resolve(orders)
          }
          // resolve(this.showOrders)
        } else {
          this.$fireStore
            .collection('orders')
            .orderBy('timestamp', 'desc')
            .get()
            .then((results) => {
              results.forEach((result) => {
                orders.push({ ...result.data() })
              })
              resolve(orders)
            })
        }
        // resolve(this.showOrders)
      })
    },

    paginate() {
      const page = this.page
      const perPage = this.perPage
      const from = page * perPage - perPage
      const to = page * perPage
      this.paginationChunks = this.searchResults.slice(from, to)
      // return orders.slice(from, to)
    },
    createTXT(e) {
      const a = this.$parseObject(e)
      const p = this.$parseObject(this.findUserPointComplete(a.uid))
      const r = a.remitente
      const d = a.destinatario
      return `========================\nPUNTO DE VENTA\nNombre: ${
        p.company
      }\nCiudad: ${p.city}\nDireccion: ${p.address}
\nREMITENTE\nNombre: ${r.name} ${r.nameSecond ? r.nameSecond : ''} ${
        r.surname
      } ${r.surnameSecond ? r.surnameSecond : ''}\nDocumento: ${this.$getId(
        r.tid
      )}${r.id}\nTelefono: ${r.phone}
\nDESTINATARIO\nNombre: ${d.name}\nDocumento: ${this.$getId(d.tid)}${
        d.id
      }\nBanco: ${d.bank}\nCuenta: ${d.account}
\nMETODO DE PAGO\n${a?.payment_method?.type ? a.payment_method.type : ' '}\n${
        a?.payment_method?.text ? a.payment_method.text : ' '
      }
\nMONTOS\nTasa aplicada: ${a.amount.tasa}\nEnvio: ${a.amount.pesos.format(
        0,
        3,
        '.'
      )} PESOS\nRecibe: ${this.$currencyFormat(
        a.amount.pesos / a.amount.tasa
      )} BOLIVARES\nEquivalente: ${
        a.amount.dollars ? a.amount.dollars : '0'
      } Dólar\n\nFecha creacion de la orden: ${this.$moment(a.timestamp).format(
        'DD-MM-YYYY hh:mm a'
      )}\nDefinición de la orden: ${
        a.payout.timestamp
          ? this.$moment(a.payout.timestamp).format('DD-MM-YYYY hh:mm a')
          : 'PENDIENTE POR DEFINIR'
      }\n========================`
    },
    printPDF(e) {
      const copy = this.createTXT(e)
      if (process.browser) {
        const doc = new jsPDF()
        doc.text(copy, 15, 20)
        window.open(doc.output('bloburl'))
      }
    },

    downloadPDF(e) {
      const a = this.$parseObject(e)
      const copy = this.createTXT(e)
      if (process.browser) {
        const doc = new jsPDF()
        doc.text(copy, 15, 20)
        doc.save(`${a.id.toUpperCase()}.pdf`)
      }
    },
    async copyTextClipboard(o) {
      const copy = this.createTXT(o)

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
    findUserPointComplete(uid) {
      if (this.showUsers) {
        return this.showUsers.filter((user) => user.uid === uid)[0]
      }
      return ''
    },
    showDetailOrder(order) {
      this.$nuxt.$emit('ADMIN_ORDER_OPEN', order, false)
    },
    findUserPoint(uid) {
      if (this.showUsers) {
        return this.showUsers.filter((user) => user.uid === uid)[0]?.company
      }
      return ''
    },
    colorStatus(status) {
      return {
        'b-pendiente': status === 'pendiente',
        'b-completada': status === 'completada',
        'b-cancelada': status === 'cancelada',
      }
    },
    colorStatusBg(status) {
      return {
        'bg-pendiente': status === 'pendiente',
        'bg-completada': status === 'completada',
        'bg-cancelada': status === 'cancelada',
      }
    },
  },
}
</script>
<style lang="scss" scoped>
#overlay {
  position: fixed;
  display: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  cursor: pointer;
}
#overlay-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  // font-size: 50px;
  // color: white;
  // transform: translate(-50%,-50%);
  // -ms-transform: translate(-50%,-50%);
}
.e-panel {
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
}
.b-pendiente {
  border-left: 3px solid #fbc02d;
}
.b-completada {
  border-left: 3px solid #00e676;
}
.b-cancelada {
  border-left: 3px solid #e91e63;
}
.bg-pendiente {
  background: #fbc02d;
}
.bg-completada {
  background: #00e676;
}
.bg-cancelada {
  background: #e91e63;
}
._resumen {
  width: 100%;
}
._resumen .col {
  padding: 4px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.c-chip {
  border-radius: 7px;
  padding: 0 14px;
  color: #fff;
  font-size: 9px;
}
</style>
