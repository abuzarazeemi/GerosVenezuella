<template>
  <v-card class="_card pa-6 pb-4 b-shadow justify-space-between" width="100%">
    <div class="d-flex justify-space-between align-center mb-4">
      <span color="black" class="body-1 font-weight-bold p-color"
        ><span style="color:#FB8C00">5.</span> CONFIRMACION DE LA ORDEN</span
      >
    </div>
    <v-row class="mb-2 d-flex flex-wrap justify-space-between" no-gutters>
      <v-col cols="12" lg="6" md="6" sm="12">
        <div class="ml-1 mr-1">
          <div class="_box">
            <div class="overline mb-1">remitente</div>
            <div class="body-2">
              <v-row>
                <v-col cols="12" lg="6" class="py-0 pb-1">
                  <strong>Nombre:</strong>
                  <span v-if="remitente" class="text-capitalize">
                    {{
                      `${remitente.name} ${
                        remitente.nameSecond ? remitente.nameSecond : ''
                      } ${remitente.surname} ${
                        remitente.surnameSecond ? remitente.surnameSecond : ''
                      }`
                    }}
                  </span>
                </v-col>
                <v-col cols="12" lg="6" class="py-0 pb-1">
                  <strong>Identificacion:</strong>
                  <span v-if="remitente">
                    {{ `${$getId(remitente.tid)}${remitente.id}` }}
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="py-0">
                  <strong>Telefono:</strong>
                  <span v-if="remitente"> {{ remitente.phone }} </span>
                </v-col>
              </v-row>
            </div>
          </div>
          <div class="_box">
            <div class="overline mb-1">destinatario</div>
            <div class="body-2">
              <v-row>
                <v-col cols="12" lg="6" class="py-0 pb-1">
                  <strong>Nombre:</strong>
                  <span v-if="destinatario" class="text-capitalize">
                    {{ destinatario.name }}
                  </span>
                </v-col>
                <v-col cols="12" lg="6" class="py-0 pb-1">
                  <strong>Identificacion:</strong>
                  <span v-if="destinatario">
                    {{ `${$getId(destinatario.tid)}${destinatario.id}` }}
                  </span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="6" class="py-0 pb-1">
                  <strong>Banco: </strong>
                  <span v-if="destinatario" class="text-capitalize">
                    {{ destinatario.bank }}
                  </span>
                </v-col>
                <v-col cols="12" lg="6" class="py-0 pb-1">
                  <strong>Cuenta: </strong>
                  <span v-if="destinatario"> {{ destinatario.account }} </span>
                </v-col>
              </v-row>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" lg="6" md="6" sm="12">
        <div class="ml-1 mr-1">
          <div class="_box">
            <div class="overline mb-1">monto</div>
            <div class="body-2">
              <v-row>
                <v-col cols="12" lg="6" class="py-0 pb-1">
                  <strong>Envia: </strong>
                  <!-- <span v-if="amount">
                    {{ Number(amount.pesos).format(0, 3, '.') }} $</span
                  > -->
                  <span v-if="amount">{{$currencyWithoutComma(`${amount.pesos}`)}} $</span>
                </v-col>
                <v-col cols="12" lg="6" class="py-0 pb-1">
                  <strong>Recibe:</strong>
                  <span v-if="amount">
                      <!-- {{ Number(amount.pesos / amount.tasa).toFixed(2) }} -->
                      {{$currencyFormat($unFormat(`${amount.pesos}`) / amount.tasa)}}
                    Bs</span
                  >
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" lg="6" class="py-0 pb-1">
                  <strong>Tasa: </strong>
                  <span v-if="amount"> {{ amount.tasa }} </span>
                </v-col>
                <v-col cols="12" lg="6" class="py-0 pb-1">
                  <strong>Payment Method:</strong>
                  <span v-if="payment_mode && payment_mode.type">{{payment_mode.type}}</span>
                </v-col>
              </v-row>
            </div>
          </div>
          <div>
            <v-checkbox
              v-model="aproved"
              :disabled="disabled || !payment_mode.type ? true : false"
              label="Todos los datos estan correctos"
              @change="checkboxAction($event)"
            />
            <v-btn
              :disabled="send"
              block
              depressed
              color="primary"
              :style="send ? 'background-color: #9e9e9e !important; color: white !important' : ''"
              @click="setOrderOnDatabase"
            >
              enviar orden
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: ["payment_mode"],
  data() {
    return {
      remitente: null,
      destinatario: null,
      amount: null,
      disabled: true,
      aproved: false,
      send: true,
    }
  },
  computed: {
    ...mapState('user', ['uid']),
  },
  mounted() {
    this.$nuxt.$on('REMITENTE_SET_DETAILS_ORDER', (d) => {
      if (d) {
        this.remitente = d
        return
      }
      this.remitente = null
      this.destinatario = null
      this.amount = null
      this.disabled = true
      this.aproved = false
    })
    this.$nuxt.$on('DESTINATARIO_SET_DETAILS_ORDER', (d) => {
      if (d) {
        this.destinatario = d
        return
      }
      this.destinatario = null
      this.disabled = true
      this.amount = null
      this.send = true
      this.aproved = false
    })
    this.$nuxt.$on('AMOUNT_SET_DETAILS_ORDER', (d) => {
      if (d) {
        this.amount = d
        return
      }
      this.disabled = true
      this.amount = null
      this.send = true
      this.aproved = false
    })
    this.$nuxt.$on('AMOUNT_APPROVE_ORDER', (d) => {
      if (d) {
        this.disabled = false
        return
      }
      this.disabled = true
      this.aproved = false
    })
  },
  methods: {
    ...mapActions('resumeOrder', ['setResumeOrder']),
    async setOrderOnDatabase() {
      this.$nuxt.$emit('LOADING_OPEN')

      // uncomment this line if found any difficulties with pessos field during save
      this.amount.pesos = Number(this.$unFormat(this.amount.pesos))
      this.amount.tasa = Number(this.amount.tasa)
      const order = {
        id: this.$generateToken(7),
        timestamp: Number(new Date()),
        status: 'pendiente',
        uid: this.uid,
        payout: {
          img: null,
          timestamp: null,
          payout: null,
          message: null,
        },
        payment_method: {
          type: this.payment_mode.type,
          text: this.payment_mode.text
        },
        amount: this.$parseObject(this.amount),
        remitente: this.$parseObject(this.remitente),
        destinatario: this.$parseObject(this.destinatario),
      }
      try {
        await this.$fireStore.collection('orders').add(order)
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Order Creada Satisfactoriamente',
          color: 'success',
        })
        await this.setResumeOrder(order)
        await this.$router.push('/dashboard/resumen/orden')
        this.$nuxt.$emit('LOADING_CLOSE')
      } catch (e) {
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Error al enviar la orden',
          color: 'pink',
        })
        this.$nuxt.$emit('LOADING_CLOSE')
      }
    },
    checkboxAction() {
      if (this.aproved) {
        this.$nuxt.$emit('ORDER_APROVE', 1)
        this.send = false
        return
      }
      this.send = true
      this.$nuxt.$emit('ORDER_APROVE', false)
    },
  },
}
</script>
<style lang="scss" scoped>
._box {
  padding: 15px 10px;
  margin-bottom: 16px;
  border: 1px dashed #b7c5d0;
}
</style>
