const state = {
  main: 0
}

const mutations = {
  DECREMENT_MAIN_COUNTER (state) {
    state.main--
  },
  INCREMENT_MAIN_COUNTER (state) {
    state.main++
  }
}

const actions = {
  someAsyncTask ({commit}) {
    // do something async
    commit('INCREMENT_MAIN_COUNTER')
  },
  setInvoices ({commit}, invoices) {
    commit('INCREMENT_MAIN_COUNTER', invoices)
  }
}

export default {
  state,
  mutations,
  actions
}
