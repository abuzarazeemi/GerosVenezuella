<template>
  <v-card
    class="_card pa-6 pb-4 b-shadow d-flex flex-column justify-space-between"
  >
    <div class="d-flex justify-space-between align-center mb-4">
      <span class="body-1 font-weight-bold p-color"><span style="color:#FB8C00">1.</span> SELECCION EL REMITENTE</span>
    </div>

    <v-btn
      v-if="$vuetify.breakpoint.lgAndUp && idSelect"
      color="#23D160"
      class="ws-edit"
      dark
      small
      absolute
      top
      right
      depressed
      @click="openDialogWs"
    >
      <span>editar WhatsApp Remitente</span>
    </v-btn>

    <v-autocomplete
      v-model="idSelect"
      :items="showSearchResults"
      :loading="isLoading"
      @update:search-input="refreshRemitentes"
      autofocus
      chips
      clearable
      hide-details
      hide-selected
      item-text="id"
      item-value="id"
      label="Escriba el numero de identidad"
      class="mb-5"
      no-data-text="No hay resultados para la busqueda"
    >
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            No hay
            <strong>Remitente</strong> con este ID
          </v-list-item-title>
        </v-list-item>
      </template>
      <template v-slot:selection="{ attr, on, item, selected }">
        <v-chip
          v-bind="attr"
          :input-value="selected"
          color="primary"
          class="white--text"
          small
          v-on="on"
        >
          <v-icon left> mdi-coin </v-icon>
          <span
            class="text-capitalize"
            v-text="`${item.name} ${item.surname} | ${$getId(item.tid)}${item.id} | WhatsApp: ${item.phone}`"
          />
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-avatar
          color="primary"
          class="headline font-weight-light white--text"
        >
          {{ item.name.charAt(0).toLocaleUpperCase() }}
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="text-capitalize font-weight-medium">
            {{ `${item.name} ${item.nameSecond ? item.nameSecond : ''} ${item.surname} ${item.surnameSecond ? item.surnameSecond : ''}` }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-capitalize" v-text="`${$getId(item.tid)}${item.id} || WhatsApp : ${item.phone}`" />
        </v-list-item-content>
        <v-list-item-action>
          <v-icon>mdi-coin</v-icon>
        </v-list-item-action>
      </template>
    </v-autocomplete>

    <!-- remitente add -->
    <v-dialog v-model="dialog" persistent max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          :style="disableBtn ? 'background-color: #9e9e9e !important; color: white !important' : ''"
          depressed
          v-bind="attrs"
          :disabled="disableBtn"
          v-on="on"
        >
          agregar nuevo remitente
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="mb-10 primary text-center">
          <p class="text-center white--text w-full headline">
            AGREGAR NUEVO REMITENTE
          </p>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <div class="d-flex flex-wrap">
              <v-col cols="12" lg="6" class="pa-0">
                <v-select
                  v-model="newRemitente.tid"
                  class="px-1"
                  :items="identidad"
                  label="Documento"
                  :rules="rul.tid"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newRemitente.id"
                  :rules="rul.id"
                  class="px-1"
                  label="Numero de Documento"
                  outlined
                  dense
                />
              </v-col>
            </div>

            <div class="d-flex flex-wrap">
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newRemitente.name"
                  class="px-1"
                  label="Nombre"
                  :rules="rul.name"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newRemitente.nameSecond"
                  class="px-1"
                  label="Segundo Nombre"
                  outlined
                  dense
                />
              </v-col>
            </div>

            <div class="d-flex flex-wrap">
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newRemitente.surname"
                  class="px-1"
                  label="Apellido"
                  :rules="rul.surname"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newRemitente.surnameSecond"
                  class="px-1"
                  label="Segundo Apellido"
                  outlined
                  dense
                />
              </v-col>
            </div>

            <div class="d-flex flex-wrap">
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newRemitente.phone"
                  class="px-1"
                  label="Celular"
                  :rules="rul.phone"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newRemitente.email"
                  class="px-1"
                  label="Email"
                  outlined
                  dense
                />
              </v-col>
            </div>

            <div class="d-flex flex-wrap">
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newRemitente.city"
                  class="px-1"
                  label="Ciudad"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newRemitente.address"
                  class="px-1"
                  label="Direccion"
                  outlined
                  dense
                />
              </v-col>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="pink" text @click="closeModal">cancelar</v-btn>
          <v-btn color="primary" text @click="saveNewRemitente">guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- remitenten update phone -->
    <v-dialog v-model="dialogWs" persistent max-width="400px">
      <v-card>
        <v-card-title class="mb-10 primary text-center">
          <p class="text-center white--text w-full headline">
            Cambiar Telefono a Remitente
          </p>
        </v-card-title>
        <v-card-text>
          <v-form ref="formWs" v-model="validWs" lazy-validation>
            <v-text-field
              v-model="currentPhone"
              :rules="rul.phone"
              label="Telefono"
              autofocus
              type="number"
              placeholder="Placeholder"
              outlined
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="pink" text @click="closeModalWs">cancelar</v-btn>
          <v-btn color="primary" text @click="editPhoneRemitente">cambiar telefono</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'SearchRemitente',
  data: () => ({
    dialog: false,
    dialogWs: false,
    currentPhone: null,
    valid: false,
    validWs: false,
    isLoading: false,
    items: [],
    identidad: ['Cedula Colombiana', 'Cedula Venezolana', 'Pasaporte'],
    idSelect: null,
    newRemitente: {
      name: null,
      nameSecond: null,
      surname: null,
      surnameSecond: null,
      phone: null,
      id: null,
      tid: null,
      timestamp: null,
      email: null,
      city: null,
      address: null,
      destinatarios: []
    },
    rul: {
      tid: [(v) => !!v || 'El documento es requerido'],
      id: [
        (v) => !!v || 'El numero es requerido',
        (v) => (v && v.length > 5) || 'El numero es muy corto'
      ],
      name: [
        (v) => !!v || 'El nombre es requerido',
        (v) => (v && v.length <= 12) || 'El nombre es muy largo'
      ],
      surname: [
        (v) => !!v || 'El apellido es requerido',
        (v) => (v && v.length <= 12) || 'El apellido es muy largo'
      ],
      phone: [
        (v) => !!v || 'El telefono es requerido.',
        (v) => (v && v.length > 5) || 'El celular es muy corto'
      ]
    }
  }),
  computed: {
    ...mapGetters('remitentes', [
      'showRemitentes',
      'showOnRemitentes',
      'showSearchResults'
    ]),
    disableBtn() {
      return !!this.idSelect;
    }
  },
  watch: {
    idSelect(val) {
      if (val) {
        const accounts = this.showSearchResults.filter(
          (e) => e.id === val
        )[0]

        this.$nuxt.$emit('REPORT_SET_LIST_ACCOUNTS', accounts)
        this.$nuxt.$emit('REMITENTE_SET_DETAILS_ORDER', accounts)
        return
      }
      this.$nuxt.$emit('REPORT_SET_LIST_ACCOUNTS', null)
      this.$nuxt.$emit('REMITENTE_SET_DETAILS_ORDER', null)
    }
  },
  methods: {
    ...mapActions('remitentes', ['getRemitentesById', 'searchRemitente']),
    async refreshRemitentes(id) {
      if (('' + id).length > 3 && id !== null) {
        await this.searchRemitente({ id })
      }
    },
    async saveNewRemitente() {
      if (this.$refs.form.validate()) {
        this.$nuxt.$emit('LOADING_OPEN')
        this.newRemitente.timestamp = Number(new Date())
        const send = { ...this.newRemitente }
        const { id, tid } = send

        const remitentesDocs = await this.$fireStore.collection('remitentes')
        .where('id', '==', id)
        .where('tid', '==', tid)
        .get()

        if (remitentesDocs.docs.length !== 0) {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'El ID ya se encuentra registrado',
            color: 'pink',
          })
          this.$nuxt.$emit('LOADING_CLOSE')
          return true
        }

        try {
          await this.$fireStore.collection('remitentes').add(send)
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Remitente creado satisfactoriamente',
            color: 'success'
          })
          this.$formatObject(this.newRemitente)
          this.newRemitente.destinatarios = []
          this.closeModal()
          this.$nuxt.$emit('LOADING_CLOSE')
        } catch (e) {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Error al crear el remitente',
            color: 'pink'
          })
          this.$nuxt.$emit('LOADING_CLOSE')
        }
      }
    },
    closeModalWs() {
      this.currentPhone = null
      this.dialogWs = false
    },
    openDialogWs() {
      this.dialogWs = true
      const r = this.showSearchResults.filter((e) => e.id === this.idSelect)[0]
      this.currentPhone = r.phone
    },
    async editPhoneRemitente() {
      if (this.$refs.formWs.validate()) {
        this.$nuxt.$emit('LOADING_OPEN')
        let r = this.showSearchResults.filter((e) => e.id === this.idSelect)[0]

        try {
          const id = await this.$fireStore.collection('remitentes')
            .where('id', '==', r.id)
            .where('timestamp', '==', r.timestamp)
            .get()

          await this.$fireStore
            .collection('remitentes')
            .doc(id.docs[0].id)
            .update({ phone: this.currentPhone })

          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Telefono actualizado correctamente',
            color: 'success'
          })

          this.closeModalWs()
          r = this.showSearchResults.filter((e) => e.id === this.idSelect)[0]
          this.$nuxt.$emit('REMITENTE_SET_DETAILS_ORDER', r)
          this.$nuxt.$emit('LOADING_CLOSE')
        } catch (e) {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Error al intentar editar el telefono',
            color: 'pink'
          })
          this.$nuxt.$emit('LOADING_CLOSE')
        }
      }
    },
    closeModal() {
      this.currentPhone = null
      this.dialog = false
      this.$refs.form.resetValidation()
    }
  }
}
</script>
<style lang="scss" scoped>
.ws-edit {
  top: 20px;
}
</style>
