import {getFirestore, collection, query, where, orderBy, onSnapshot} from 'firebase/firestore'
let unsubscribe = null

export const state = () => ({
  orders: null,
  onOrders: false,
  pendingOrders: [],
  dayOrders: [],
  bolivarsPayable: null,
  bolivaresPorDollar: 0,
})

export const getters = {
  getBolivaresPorDollar (state) {
    return state.bolivaresPorDollar
  },
  showOrders (state) {
    return state.orders
  },
  showOnOrders (state) {
    return state.onOrders
  },
  getPendingOrders (state) {
    return state.pendingOrders || []
  },
  getDayOrders (state) {
    return state.dayOrders || []
  },
  getBolivarsPayable (state) {
    return state.bolivarsPayable || 0
  }
}

export const actions = {

  async setBolivaresPorDollar({commit}) {
    await this.$fireStore
      .collection('bolivaresPorDollar')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .onSnapshot((query) => {
        query.forEach(doc => commit("updateBolivaresPorDollar", doc.data()))
      })
  },

  setPendingOrders({commit}) {
    let filteredOrders = []
    let db = getFirestore()
    let coll = collection(db, 'orders')
    let q = query(coll, where("status", "==", "pendiente"), orderBy('timestamp', 'desc'))
    onSnapshot(q, (snapshot) => {
      filteredOrders = []
      snapshot.docs.forEach((doc) => {
        filteredOrders.push({...doc.data()})
      })
      commit("updatePendingOrders", filteredOrders)
    })
  },
  setDayOrders({commit}) {
    const dayStart = Number(
      this.$moment.tz('America/Bogota').startOf('day').utc()._d
    )
    const dayEnd = Number(
      this.$moment.tz('America/Bogota').endOf('day').utc()._d
    )
    let filteredOrders = []
    let db = getFirestore()
    let coll = collection(db, 'orders')
    let q = query(coll, where("timestamp", ">=", dayStart), where("timestamp", "<=", dayEnd))
    onSnapshot(q, (snapshot) => {
      filteredOrders = []
      snapshot.docs.forEach(doc => {
        if (doc.timestamp != "cancelado") {
          filteredOrders.push({...doc.data()})
        }
      })
      commit("updateDayOrders", filteredOrders)
    })
  },
  setBolivarsPayable({commit}) {
    let reducer = (acc, curr) => acc + curr.data().amount.pesos / curr.data().amount.tasa
    let filteredOrders = []
    let db = getFirestore()
    let coll = collection(db, 'orders')
    let q = query(coll, where("status", "==", "pendiente"))
    onSnapshot(q, (snapshot) => {
      commit("updateBolivarsPayable", snapshot.docs.reduce(reducer, 0))
    })
  },

  async getOrders ({ dispatch }) {
    
    unsubscribe = await this.$fireStore
      .collection('orders')
      .orderBy('timestamp', 'desc')
      .onSnapshot((query) => {
        const data = []
        
        dispatch('updateOnOrders', true)

        query.forEach(e => data.push(e.data()))

        if (data.length > 0) {
          dispatch('updateOrders', data)
          return
        }

        dispatch('updateOrders', [])
      })
  },
  updateOrders ({ commit }, orders) {
    return commit('SET_ORDERS', orders)
  },
  updateOnOrders ({ commit }, boolean) {
    return commit('SET_ON_ORDERS', boolean)
  },
  stopOrders () {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }
}

export const mutations = {
  updateBolivaresPorDollar (state, bolivaresPorDollar) {
    state.bolivaresPorDollar = bolivaresPorDollar
  },

  SET_ORDERS (state, orders) {
    return (state.orders = orders)
  },
  SET_ON_ORDERS (state, boolean) {
    return (state.onOrders = boolean)
  },
  updatePendingOrders (state, value) {
    state.pendingOrders = []
    state.pendingOrders = value
  },
  updateDayOrders (state, value) {
    state.dayOrders = []
    state.dayOrders = value
  },
  updateBolivarsPayable (state, value) {
    state.bolivarsPayable = null
    state.bolivarsPayable = value
  }
}
