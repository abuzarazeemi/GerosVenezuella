<template>
  <v-card class="pa-6 pb-4 b-shadow d-flex flex-column justify-space-between">
    <div class="d-flex justify-space-between align-center mb-4">
      <span class="body-1 font-weight-bold p-color">REPORTE DETALLADO</span>
    </div>

    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-content-space-between align-center flex-wrap">
        <div style="width: 250px; margin-top: -1px; margin-bottom: 20px">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateFormatted"
                label="Buscar por"
                readonly
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker v-model="date" scrollable locale="es-es">
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
          <v-btn depressed color="warning" @click="search">buscar</v-btn>
        </div>
      </div>
    </div>

    <div class="mt-1">
      <div class="black-span body-1 grey--text mb-1 font-weight-bold">
        Ordenes del Dia: <span>{{ dateFormatted }}</span>
      </div>
      <v-chip class="mb-1" color="green" label text-color="white">
        <v-icon left> mdi-label </v-icon>
        Pagadas: {{ completada }}
      </v-chip>
      <v-chip class="mb-1" color="orange" label text-color="white">
        <v-icon left> mdi-label </v-icon>
        Pendientes: {{ pendientes }}
      </v-chip>
      <v-chip class="mb-1" color="red" label text-color="white">
        <v-icon left> mdi-label </v-icon>
        Canceladas: {{ cancelada }}
      </v-chip>
      <v-chip class="mb-1" color="indigo" label text-color="white">
        <v-icon left> mdi-label </v-icon>
        Total: {{ ordersLength }}
      </v-chip>
    </div>

    <div class="mt-4">
      <div
        class="
          d-flex
          flex-wrap
          black-span
          body-1
          grey--text
          mb-1
          font-weight-bold
        "
      >
        <div class="mr-4">
          Ordenes Recibidas:
          <span
            ><b>{{ $currencyFormat(`${ordenesRecibidas}`) }}</b></span
          >
        </div>
        <div class="mr-4">
          Ordenes Pagadas:
          <span
            ><b
              >{{
                $currencyFormat(`${previousPaidOrdersPesos + paidOrdersPesos}`)
              }}
              Pesos -
              {{ $currencyFormat(`${paidOrdersBolivares}`) }} Bolivares</b
            ></span
          >
        </div>
        <div>
          Tasa de Cambio Promedio:
          <span>{{
            paidOrdersPesos / paidOrdersBolivares
              ? $currencyFormat(
                  `${
                    (previousPaidOrdersPesos + paidOrdersPesos) /
                    paidOrdersBolivares
                  }`
                )
              : 0
          }}</span>
        </div>
      </div>
      <v-row class="black-span mt-4 body-1 grey--text mb-1">
        <v-col lg="8" md="8" sm="12" cols="12">
          <v-row>
            <v-col
              class="cols"
              style="text-align: right"
              lg="3"
              md="6"
              sm="6"
              cols="6"
            >
              <p class="font-weight-bold">Ofc. GV_KELLY</p>
              <p>Ofc. Efectivo:</p>
              <p>Ofc. Bancolombia:</p>
              <p>Ofc. Nequi:</p>
              <p>Ofc. Davivienda:</p>
              <p>Ofc. Otros:</p>
              <p class="font-weight-bold" style="color: black">Ofc. Total:</p>
            </v-col>
            <v-col class="cols" lg="3" md="6" sm="6" cols="6">
              <p>
                <span style="content: ''"></span>
              </p>
              <p>
                <span>{{ $currencyFormat(`${gv_kelly.efectivo}`) }}</span>
              </p>
              <p>
                <span>{{ $currencyFormat(`${gv_kelly.bancolombia}`) }}</span>
              </p>
              <p>
                <span>{{ $currencyFormat(`${gv_kelly.nequi}`) }}</span>
              </p>
              <p>
                <span>{{ $currencyFormat(`${gv_kelly.davivienda}`) }}</span>
              </p>
              <p>
                <span>{{ $currencyFormat(`${gv_kelly.otros}`) }}</span>
              </p>
              <p style="color: black">
                <span class="font-weight-bold"
                  >{{ $currencyFormat(`${gv_kelly.pesos}`) }} Pesos</span
                >
              </p>
            </v-col>
            <v-col
              class="cols"
              style="text-align: right"
              lg="3"
              md="6"
              sm="6"
              cols="6"
            >
              <p class="font-weight-bold">Ofc. GV_ADMIN</p>
              <p>Ofc. Efectivo:</p>
              <p>Ofc. Bancolombia:</p>
              <p>Ofc. Nequi:</p>
              <p>Ofc. Davivienda:</p>
              <p>Ofc. Otros:</p>
              <p class="font-weight-bold" style="color: black">Ofc. Total:</p>
            </v-col>
            <v-col class="cols" lg="3" md="6" sm="6" cols="6">
              <p>
                <span style="content: ''"></span>
              </p>
              <p>
                <span>{{ $currencyFormat(`${gv_admin.efectivo}`) }}</span>
              </p>
              <p>
                <span>{{ $currencyFormat(`${gv_admin.bancolombia}`) }}</span>
              </p>
              <p>
                <span>{{ $currencyFormat(`${gv_admin.nequi}`) }}</span>
              </p>
              <p>
                <span>{{ $currencyFormat(`${gv_admin.davivienda}`) }}</span>
              </p>
              <p>
                <span>{{ $currencyFormat(`${gv_admin.otros}`) }}</span>
              </p>
              <p style="color: black">
                <span class="font-weight-bold"
                  >{{ $currencyFormat(`${gv_admin.pesos}`) }} Pesos</span
                >
              </p>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="font-weight-bold" lg="4" sm="12" cols="12">
          <v-row>
            <v-col
              class="cols"
              lg="4"
              md="4"
              sm="6"
              cols="6"
              style="text-align: right"
            >
              <p>Punto de Venta:</p>
              <p>TOTAL TODOS:</p>
            </v-col>
            <v-col class="cols" lg="5" md="4" sm="6" cols="6">
              <p>
                <span>{{ $currencyFormat(`${punto_de_venta}`) }} Pesos</span>
              </p>
              <p>
                <span> {{ $currencyFormat(`${paidOrdersPesos}`) }} Pesos </span>
              </p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- <div class="mt-8" style="width: 50%">
        <div class="d-flex justify-space-between align-center mb-2">
          <span color="black" class="body-1 font-weight-bold p-color"
            >ORDENES PENDIENTES</span
          >
        </div>
        <div
          v-if="!pendingOrders || pendingOrders.length === 0"
          class="border mt-6 h-full d-flex align-center justify-center py-10"
        >
          <v-progress-circular
            v-if="!pendingOrders"
            color="grey"
            class="my-2"
            indeterminate
            size="34"
          />
          <span v-else class="body-1 text--lighten-1 grey--text text-uppercase"
            >no tienes ordenes pendientes</span
          >
        </div>

        <div v-else>
          <div
            v-for="(e, i) in pendingOrders"
            :key="i"
            class="e-panel py-3 c-hover"
          >
            <div class="body-1 px-0">
              <div class="d-flex justify-space-between align-center _resumen">
                <div>
                  <div>
                    <strong class="text-capitalize">{{
                      findUserPoint(e.uid)
                    }}</strong>
                  </div>

                  <div>
                    <span class="c-chip primary">{{
                      e.destinatario.bank
                    }}</span>
                    <span class="c-chip purple">
                      {{
                        Number($unFormat(`${e.amount.pesos}`)).format(0, 3, '.')
                      }}
                      $
                    </span>
                  </div>

                  <div>
                    <span class="c-chip grey">
                      {{ e.destinatario.account }}
                    </span>
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
                    title="copiar datos de la ordn"
                    color="transparent"
                    depressed
                    dark
                    small
                    fab
                  >
                    <v-icon small color="primary">
                      mdi-clipboard-check-multiple
                    </v-icon>
                  </v-btn>
                  <v-btn
                    title="administrar orden pendiente"
                    color="transparent"
                    depressed
                    dark
                    small
                    fab
                  >
                    <v-icon small color="primary"> mdi-feature-search </v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <div class="mt-4 mr-4 d-flex justify-end">
        <v-btn
          :disabled="orders.length ? false : true"
          class="ma-1"
          target="_blank"
          depressed
          @click="downloadXLSX"
        >
          <v-icon left color="primary"> mdi-download </v-icon>
          descargar excel
        </v-btn>
      </div>
    </div>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import * as xlsx from 'xlsx'
import * as xlsxPopulate from 'xlsx-populate/browser/xlsx-populate'
export default {
  components: {},
  data: (vm) => ({
    pendingOrders: [],
    completada: 0,
    cancelada: 0,
    ordersLength: 0,
    pendientes: 0,
    punto_de_venta: 0,
    gv_kelly: {
      pesos: 0,
      efectivo: 0,
      otros: 0,
      davivienda: 0,
      nequi: 0,
      bancolombia: 0,
      total: 0,
    },
    gv_admin: {
      pesos: 0,
      efectivo: 0,
      otros: 0,
      davivienda: 0,
      nequi: 0,
      bancolombia: 0,
      total: 0,
    },
    paidOrdersPesos: 0,
    ordenesRecibidas: 0,
    previousPaidOrdersPesos: 0,
    paidOrdersBolivares: 0,
    exportTableData: [],
    searchResults: [],
    orders: [],
    users: [],
    modal: false,
    date: null,
    dateFormatted: null,
  }),
  computed: {
    ...mapGetters('adminUsers', ['showUsers']),
  },
  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date)
    },
  },
  created() {
    this.dateFormatted = this.formatDate(new Date())
    this.$fireStore
      .collection('users')
      .get()
      .then((users) => {
        users.forEach((user) => {
          this.users.push({ ...user.data() })
        })
      })
  },
  methods: {
    previousDayOrders() {
      this.$fireStore
        .collection('orders')
        .where('timestamp', '>=', new Date(this.date).getTime() - 86400000)
        .where('timestamp', '<=', new Date(this.date).getTime())
        .get()
        .then((orders) => {
          this.previousPaidOrdersPesos = 0
          let data
          orders.forEach((order) => {
            data = order.data()
            if (
              data?.payout?.timestamp >= new Date(this.date).getTime() &&
              data?.payout?.timestamp <=
                new Date(this.date).getTime() + 86400000 &&
              data.status == 'completada'
            ) {
              this.completada++
              this.ordersLength++
              this.previousPaidOrdersPesos += data.amount.pesos
              this.paidOrdersBolivares += data.amount.pesos / data.amount.tasa
              this.orders.push({ ...data })
            }
          })
          this.createExportTableData()
        })
    },
    search() {
      this.orders = []
      this.completada = 0
      this.cancelada = 0
      this.ordersLength = 0
      this.pendientes = 0
      this.paidOrdersPesos = 0
      this.paidOrdersBolivares = 0
      this.ordenesRecibidas = 0

      this.$fireStore
        .collection('orders')
        .where('timestamp', '>=', new Date(this.date).getTime())
        .where('timestamp', '<=', new Date(this.date).getTime() + 86400000)
        .get()
        .then((results) => {
          let data
          results.forEach((result) => {
            data = result.data()
            this.ordersLength++
            this.ordenesRecibidas += data.amount.pesos
            if (
              data.payout?.timestamp >=
              new Date(this.date).getTime() + 86400000
            ) {
              this.pendientes++
            }
            if (data.status == 'cancelada') {
              this.cancelada++
            }
            if (
              data.remitente.id != '01010101' &&
              data.payout.timestamp >= new Date(this.date).getTime() &&
              data.payout.timestamp <=
                new Date(this.date).getTime() + 86400000 &&
              data.status == 'completada'
            ) {
              this.completada++
              this.paidOrdersPesos += data.amount.pesos
              this.paidOrdersBolivares += data.amount.pesos / data.amount.tasa
              this.orders.push({ ...data })
            }
          })
          this.previousDayOrders()
          // this.createExportTableData()
        })
    },
    createExportTableData() {
      this.exportTableData = []
      let tempArray
      this.users.forEach((user) => {
        tempArray = []
        this.orders.forEach((order) => {
          order.uid == user.uid ? tempArray.push(order) : null
        })
        tempArray.length
          ? this.exportTableData.push({ user: user, orders: tempArray })
          : null
      })
      this.seperateData()
    },
    seperateData() {
      this.punto_de_venta = 0

      this.gv_kelly.pesos = 0
      this.gv_kelly.efectivo = 0
      this.gv_kelly.bancolombia = 0
      this.gv_kelly.nequi = 0
      this.gv_kelly.davivienda = 0
      this.gv_kelly.otros = 0

      this.gv_admin.pesos = 0
      this.gv_admin.efectivo = 0
      this.gv_admin.bancolombia = 0
      this.gv_admin.nequi = 0
      this.gv_admin.davivienda = 0
      this.gv_admin.otros = 0

      this.exportTableData.forEach((data) => {
        if (data.user.company == 'GV_KELLY') {
          data.orders.forEach((order) => {
            this.gv_kelly.pesos += order.amount.pesos
            if (order?.payment_method?.type == 'Efectivo') {
              this.gv_kelly.efectivo += order.amount.pesos
            } else if (order?.payment_method?.type == 'Bancolombia') {
              this.gv_kelly.bancolombia += order.amount.pesos
            } else if (order?.payment_method?.type == 'Nequi') {
              this.gv_kelly.nequi += order.amount.pesos
            } else if (order?.payment_method?.type == 'Davivienda') {
              this.gv_kelly.davivienda += order.amount.pesos
            } else if (order?.payment_method?.type == 'Otros') {
              this.gv_kelly.otros += order.amount.pesos
            }
          })
        } else if (data.user.company == 'GV_ADMIN1') {
          data.orders.forEach((order) => {
            this.gv_admin.pesos += order.amount.pesos
            if (order?.payment_method?.type == 'Efectivo') {
              this.gv_admin.efectivo += order.amount.pesos
            } else if (order?.payment_method?.type == 'Bancolombia') {
              this.gv_admin.bancolombia += order.amount.pesos
            } else if (order?.payment_method?.type == 'Nequi') {
              this.gv_admin.nequi += order.amount.pesos
            } else if (order?.payment_method?.type == 'Davivienda') {
              this.gv_admin.davivienda += order.amount.pesos
            } else if (order?.payment_method?.type == 'Otros') {
              this.gv_admin.otros += order.amount.pesos
            }
          })
        } else {
          data.orders.forEach((order) => {
            if (
              order.timestamp >= new Date(this.date).getTime() &&
              order.timestamp <= new Date(this.date).getTime() + 86400000
            ) {
              this.punto_de_venta += order.amount.pesos
            }
          })
        }
      })
    },
    downloadXLSX(e) {
      let excel_data = []
      let grand_commision = 0
      let grand_pesos = 0
      let grand_bolivares = 0
      let grand_pesos_neto = 0

      this.exportTableData.forEach((data) => {
        excel_data.push({
          A: data.user.company,
        })
        excel_data.push({
          A: 'DATE',
          B: 'ID',
          C: 'SENDER',
          D: 'RECIPIENT',
          E: 'CELL PHONE',
          F: 'PESOS',
          G: 'COMISION 4%',
          H: 'PESOS NETO',
          I: 'DOLAR',
          J: 'BOLIVARES',
          K: 'VENEZUELA',
          L: 'BANESCO',
          M: 'MERCANTIL',
          N: 'PROVINCIAL',
          O: 'OTROS',
          P: 'PAYMENT METHOD',
          Q: 'COMMENTS',
        })

        let totalPesos = 0
        let totalCommission = 0
        let totalPesosNeto = 0
        let totalDolar = 0
        let totalBolivares = 0
        let totalVenezuela = 0
        let totalBanesco = 0
        let totalMercantil = 0
        let totalProvincial = 0
        let totalOtros = 0

        data.orders.forEach((order) => {
          totalPesos += order.amount.pesos
          totalCommission += data.user.percentage
          totalPesosNeto += order.amount.pesos - data.user.percentage
          totalDolar += Number(this.unFormatDollar(order.amount.dollars))
          totalBolivares += order.amount.bs

          excel_data.push({
            A: `${new Date(order.timestamp).toLocaleDateString('en-US')}`,
            B: `${order.id}`,
            C: `${order.remitente.name} ${
              order.remitente.nameSecond ? order.remitente.nameSecond : ''
            } ${order.remitente.surname ? order.remitente.surname : ''} ${
              order.remitente.surnameSecond ? order.remitente.surnameSecond : ''
            }`,
            D: `${order.destinatario.name}`,
            E: `${order.remitente.phone}`,
            F: `${this.$currencyWithoutComma(`${order.amount.pesos}`)}`,
            G: `${data.user.percentage}`,
            H: `${this.$currencyWithoutComma(
              `${order.amount.pesos - data.user.percentage}`
            )}`,
            I: `${order?.amount?.dollars ? order.amount.dollars : '0,00'}`,
            J: `${this.$currencyFormat(
              order.amount.pesos / order.amount.tasa
            )}`,
            K: `${
              order.destinatario.bank == 'Venezuela'
                ? this.$currencyFormat(order.amount.pesos / order.amount.tasa)
                : ''
            }`,
            L: `${
              order.destinatario.bank == 'Banesco'
                ? this.$currencyFormat(order.amount.pesos / order.amount.tasa)
                : ''
            }`,
            M: `${
              order.destinatario.bank == 'BANCO MERCANTIL C.A. (0105)'
                ? this.$currencyFormat(order.amount.pesos / order.amount.tasa)
                : ''
            }`,
            N: `${
              order.destinatario.bank == 'Provincial'
                ? this.$currencyFormat(order.amount.pesos / order.amount.tasa)
                : ''
            }`,
            O: `${
              order.destinatario.bank == 'Venezuela' ||
              order.destinatario.bank == 'Banesco' ||
              order.destinatario.bank == 'BANCO MERCANTIL C.A. (0105)' ||
              order.destinatario.bank == 'Provincial'
                ? ''
                : this.$currencyFormat(order.amount.pesos / order.amount.tasa)
            }`,
            P: `${
              order?.payment_method?.type ? order.payment_method.type : ''
            }`,
            Q: `${
              order?.payment_method?.text ? order.payment_method.text : ''
            }`,
          })
          if (order.destinatario.bank == 'Venezuela') {
            totalVenezuela += order.amount.pesos / order.amount.tasa
          } else if (order.destinatario.bank == 'Banesco') {
            totalBanesco += order.amount.pesos / order.amount.tasa
          } else if (order.destinatario.bank == 'BANCO MERCANTIL C.A. (0105)') {
            totalMercantil += order.amount.pesos / order.amount.tasa
          } else if (order.destinatario.bank == 'Provincial') {
            totalProvincial += order.amount.pesos / order.amount.tasa
          } else {
            totalOtros += order.amount.pesos / order.amount.tasa
          }
        })

        grand_commision += totalCommission
        grand_pesos += totalPesos
        grand_pesos_neto += totalPesosNeto
        grand_bolivares += totalBolivares

        excel_data.push({
          A: '',
        })
        excel_data.push({
          E: 'SUMA',
          F: `${this.$currencyFormat(totalPesos)}`,
          G: `${this.$currencyFormat(totalCommission)}`,
          H: `${this.$currencyFormat(totalPesosNeto)}`,
          I: `${this.$currencyFormat(totalDolar)}`,
          J: `${this.$currencyFormat(totalBolivares)}`,
          K: `${this.$currencyFormat(totalVenezuela)}`,
          L: `${this.$currencyFormat(totalBanesco)}`,
          M: `${this.$currencyFormat(totalMercantil)}`,
          N: `${this.$currencyFormat(totalProvincial)}`,
          O: `${this.$currencyFormat(totalOtros)}`,
        })
        excel_data.push({
          A: '',
        })
        excel_data.push({
          A: '',
        })
      })
      excel_data.push({
        A: '',
      })
      excel_data.push({
        A: '',
      })
      // Grand Total
      excel_data.push({
        E: `${this.dateFormatted}`,
        F: 'PESOS',
        G: 'COMISION 4%',
        H: 'PESOS NETO',
        I: 'Bs pagados',
      })
      excel_data.push({
        E: 'TOTAL GLOBAL',
        F: `${this.$currencyFormat(grand_pesos)}`,
        G: `${this.$currencyFormat(grand_commision)}`,
        H: `${this.$currencyFormat(grand_pesos_neto)}`,
        I: `${this.$currencyFormat(grand_bolivares)}`,
      })
      let workbook = xlsx.utils.book_new()
      let sheet = xlsx.utils.json_to_sheet(excel_data, { skipHeader: true })

      xlsx.utils.book_append_sheet(workbook, sheet, 'export_data')

      let workBookOut = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'binary',
      })

      // xlsx.writeFile(workbook, 'my_first_export.xlsx', {
      //   bookType: 'xlsx',
      //   type: 'binary',
      // })

      let blob = new ArrayBuffer(workBookOut.length)
      const view = new Uint8Array(blob)
      for (let i = 0; i !== workBookOut.length; ++i) {
        view[i] = workBookOut.charCodeAt(i)
      }
      blob = new Blob([blob], { type: 'application/octet-stream' })

      xlsxPopulate.fromDataAsync(blob).then((workbook) => {
        workbook.sheets().forEach((sheet) => {
          sheet.column('A').width(10)
          sheet.column('B').width(10)
          sheet.column('C').width(33)
          sheet.column('D').width(33)
          sheet.column('E').width(16)
          sheet.column('F').width(16)
          sheet.column('G').width(11)
          sheet.column('H').width(16)
          sheet.column('I').width(16)
          sheet.column('J').width(16)
          sheet.column('K').width(16)
          sheet.column('L').width(16)
          sheet.column('M').width(16)
          sheet.column('N').width(16)
          sheet.column('O').width(26)
          sheet.column('P').width(17)
          sheet.column('Q').width(30)

          let ranges = this.createRangeForStyling(sheet)

          sheet._rows.forEach((row, index) => {
            sheet.row(index).height(20)
          })

          sheet.usedRange().style({
            fontFamily: 'Arial',
            horizontalAlignment: 'center',
            verticalAlignment: 'center',
          })

          sheet.find('DATE').forEach((user) => {
            sheet
              .range(
                `A${user.row()._node.attributes.r - 1}:B${
                  user.row()._node.attributes.r - 1
                }`
              )
              .merged(true)
            sheet
              .row(user.row()._node.attributes.r - 1)
              .cell(1)
              .style({
                fill: 'FFFF00',
              })
          })

          ranges.table_title.forEach((title) => {
            sheet.range(title).style({
              bold: true,
              fill: '5C5CFF',
            })
          })
          ranges.table_total.forEach((total) => {
            sheet.range(total).style({
              fill: '5C5CFF',
            })
          })
          ranges.grand_total_title.forEach((title) => {
            sheet.range(title).style({
              bold: true,
              fill: 'FFFF00',
            })
          })
          ranges.grand_total.forEach((total) => {
            sheet.range(total).style({
              fill: 'FFB52E',
            })
          })
        })

        workbook.outputAsync().then((workbookBlob) => {
          const downloadAnchorNode = document.createElement('a')
          downloadAnchorNode.setAttribute(
            'href',
            URL.createObjectURL(workbookBlob)
          )
          downloadAnchorNode.setAttribute(
            'download',
            `${this.dateFormatted}.xlsx`
          )
          downloadAnchorNode.click()
          downloadAnchorNode.remove()
        })
      })
    },

    createRangeForStyling(sheet) {
      let tableTitleRange = []
      sheet.find('DATE').forEach((titleRange) => {
        tableTitleRange.push(
          `A${titleRange.row()._node.attributes.r}:Q${
            titleRange.row()._node.attributes.r
          }`
        )
      })

      let tableTotalRange = []
      sheet.find('SUMA').forEach((totalRange) => {
        tableTotalRange.push(
          `E${totalRange.row()._node.attributes.r}:O${
            totalRange.row()._node.attributes.r
          }`
        )
      })

      let tableGrandTotalTitleRange = []
      sheet.find('Bs pagados').forEach((grandTotalTitleRange) => {
        tableGrandTotalTitleRange.push(
          `F${grandTotalTitleRange.row()._node.attributes.r}:I${
            grandTotalTitleRange.row()._node.attributes.r
          }`
        )
      })

      let tableGrandTotalRange = []
      sheet.find('TOTAL GLOBAL').forEach((grandTotalRange) => {
        tableGrandTotalRange.push(
          `E${grandTotalRange.row()._node.attributes.r}:I${
            grandTotalRange.row()._node.attributes.r
          }`
        )
      })

      return {
        table_title: tableTitleRange,
        table_total: tableTotalRange,
        grand_total_title: tableGrandTotalTitleRange,
        grand_total: tableGrandTotalRange,
      }
    },

    padTo2Digits(num) {
      return num.toString().padStart(2, '0')
    },

    unFormatDollar(val) {
      if (val) {
        val = val.toString()
        return val.replace(',', '.')
      } else return 0
    },

    findUserPointComplete(uid) {
      if (this.showUsers) {
        return this.showUsers.filter((user) => user.uid === uid)[0]
      }
      return ''
    },

    findUserPoint(uid) {
      if (this.showUsers) {
        return this.showUsers.filter((user) => user.uid === uid)[0].company
      }
      return ''
    },

    formatDate(date) {
      // $moment(showTasas.timestamp).fromNow()
      // $moment(order.timestamp).format('DD-MM-YYYY hh:mm a')
      // this.$moment.tz('America/Bogota').startOf('day').utc()._d
      // this.$moment.tz('America/Bogota').endOf('day').utc()._d

      // date = new Date(date)
      // return [
      //   this.padTo2Digits(date.getDate()),
      //   this.padTo2Digits(date.getMonth() + 1),
      //   date.getFullYear(),
      // ].join('/')

      return this.$moment(date).format('DD/MM/YYYY')
    },
  },
}
</script>
<style lang="scss" scoped>
.cols {
  padding-left: 0px;
  padding-right: 0px;
}
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
.black-span span {
  color: black !important;
  margin-left: 10px;
}
</style>
