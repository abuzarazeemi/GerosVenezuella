<template>
  <div v-if="showOnRemitentes">
    <v-row class="mb-4 d-flex flex-wrap" no-gutters>
      <v-col cols="12" lg="6" class="pr-lg-2 py-0 ">
        <SearchRemitente />
      </v-col>
      <v-col cols="12" lg="6" class="pl-lg-2 mt-4 mt-lg-0 py-0">
        <SelectDestinatario />
      </v-col>
    </v-row>
    <v-row class="mb-2 d-flex flex-wrap" no-gutters>
      <v-col cols="12" lg="6" class="pr-lg-2 py-0">
        <AmountSend />
      </v-col>
      <v-col cols="12" lg="6" class="pl-lg-2 mt-4 mt-lg-0 py-0">
        <PaymentMethod @paymentMethod="paymentMethod" />
      </v-col>
    </v-row>
    <v-row class="mb-2 d-flex flex-wrap" no-gutters>
      <v-col cols="12" lg="12" class="lg-2 py-0 ">
        <ResumeOrder :payment_mode="payment_method"/>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SearchRemitente from '~/components/dashboard/reportar/SearchRemitente'
import SelectDestinatario from '~/components/dashboard/reportar/SelectDestinatario'
import AmountSend from '~/components/dashboard/reportar/AmountSend'
import ResumeOrder from '~/components/dashboard/reportar/ResumeOrder'
import PaymentMethod from '~/components/dashboard/reportar/PaymentMethod'
export default {
  components: {
    SearchRemitente, SelectDestinatario, AmountSend, ResumeOrder, PaymentMethod
  },
  data() {
    return {
      payment_method: {type: "", text: ""}
    }
  },
  computed: {
    ...mapGetters('remitentes', ['showOnRemitentes'])
  },
  methods: {
    paymentMethod(method) {
      this.payment_method.type = method.type
      this.payment_method.text = method.text
    }
  },
}
</script>
