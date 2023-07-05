export const state = () => ({
  order: null,
  dollars: 0
})

export const getters = {
  getDollars (state) {
    return state.dollars
  },
  showOrder (state) {
    if (state.order) {
      return state.order
    }
    return false
  }
}

export const actions = {
  async setResumeOrder ({ commit }, order) {
    await commit('SET_RESUME_ORDER', order)
  }
}

export const mutations = {
  SET_RESUME_ORDER (state, order) {
    order.amount.pesos = this.$currencyWithoutComma(`${order?.amount?.pesos}`)
    return (state.order = order)
  },
  setDollars (state, dollars) {
    state.dollars = dollars
  }
}
