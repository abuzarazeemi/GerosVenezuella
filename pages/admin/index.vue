<template>
  <div>
    <v-alert v-if="showOnMessage" color="deep-purple darken-3" dark>
      <div class="d-flex justify-space-between align-center">
        <span class="body-2">
          {{ showMessage.message }}
          <small>{{
            $moment(showMessage.timestamp).format('DD.MM.YYYY hh:mm a')
          }}</small>
        </span>
        <v-btn class="pink" small @click="openModalTextServer"
          >nuevo mensaje</v-btn
        >
      </div>
    </v-alert>
    <Indicadores />
    <v-row>
      <v-col cols="12" lg="8">
        <PendingOrders />
      </v-col>
      <v-col cols="12" lg="4">
        <v-row>
          <v-col cols="12">
            <v-card class="pa-6 b-shadow">
              <ChangeTasas />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card class="pa-6 b-shadow">
              <ChangeDollar />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- modal new message -->
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title class="mb-10 primary text-center">
          <p class="text-center white--text w-full headline">
            NUEVO MENSAJE GLOBAL
          </p>
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="message"
            autofocus
            outlined
            label="Escriba su Mensaje"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="pink" text @click="closeModal"> cancelar </v-btn>
          <v-btn color="primary" text @click="setMessageServer">
            enviar mensaje
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Indicadores from '~/components/admin/index/Indicadores'
import PendingOrders from '~/components/admin/index/PendingOrders'
import ChangeTasas from '~/components/admin/index/ChangeTasa'
import ChangeDollar from '~/components/admin/index/ChangeDollar'

export default {
  components: {
    Indicadores,
    PendingOrders,
    ChangeTasas,
    ChangeDollar
  },
  data: () => ({
    dialog: false,
    message: '',
  }),
  computed: {
    ...mapGetters('message', ['showMessage', 'showOnMessage']),
  },
  mounted() {
    this.setPendingOrders()
    this.setDayOrders()
    this.setBolivarsPayable()
    this.getTasas()
    this.setBolivaresPorDollar()
    // this.getOrders()
    this.getUsers()
    this.getMessage()
    this.getRemitentesLength()
    setTimeout(() => {
      this.getRemitentes(0)
    }, 400)
  },
  methods: {
    ...mapActions('adminOrders', ['setPendingOrders']),
    ...mapActions('adminOrders', ['setDayOrders']),
    ...mapActions('adminOrders', ['setBolivarsPayable']),
    ...mapActions('adminTasas', ['getTasas']),
    ...mapActions('adminOrders', ['setBolivaresPorDollar']),
    ...mapActions('adminUsers', ['getUsers']),
    // ...mapActions('adminOrders', ['getOrders']),
    ...mapActions('remitentes', ['getRemitentes']),
    ...mapActions('message', ['getMessage']),
    ...mapActions('user', ['closeSesionAdmin']),
    ...mapActions('remitentes', ['getRemitentesLength']),

    openModalTextServer() {
      this.dialog = true
    },
    async setMessageServer() {
      this.$nuxt.$emit('LOADING_OPEN')
      try {
        await this.$fireStore.collection('message').add({
          message: this.message,
          timestamp: Number(new Date()),
        })
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Mensaje seteado correctamente',
          color: 'success',
        })
        this.closeModal()
        this.$nuxt.$emit('LOADING_CLOSE')
      } catch (e) {
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Error al fijar el mensaje',
          color: 'pink',
        })
        this.$nuxt.$emit('LOADING_CLOSE')
      }
    },
    closeModal() {
      this.message = ''
      this.dialog = false
    },
  },
}
</script>
