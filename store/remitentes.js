import remitentes from '~/pages/admin/remitentes'

let unsubscribe = null

export const state = () => ({
  remitentes: [],
  onRemitentes: false,
  remitentesLength: 0,
  remitentesObject: {},
  searchResult: []
})

export const getters = {
  showRemitentes (state) {
    if (state.remitentes) {
      return state.remitentes
    }
    return null
  },
  showOnRemitentes (state) {
    return state.onRemitentes
  },
  showRemitentesLength (state) {
    if (state.remitentesLength) {
      return state.remitentesLength
    } else return null
  },
  showRemitentesObject (state) {
    if (state.remitentesObject) {
      return state.remitentesObject
    } else return null
  },
  showSearchResults(state){
    if(state.searchResult){
      return state.searchResult
    }
    else return null

  }
}

export const actions = {
  async getRemitentes ({ dispatch }, page) {
    let fixPage = page - 1
    if (fixPage < 0) {
      fixPage = 0
    }
    let start = 10 * fixPage

    if (start < 0) {
      start = 0
    }

    unsubscribe = await this.$fireStore.collection('remitentes').
      orderBy('index').
      startAfter(start).
      limit(10).
      onSnapshot((query) => {
        const data = []

        dispatch('updateOnRemitentes', true)
        query.forEach((e) => data.push(e.data()))
        console.log('start: ', start)
        if (data.length > 0) {
          dispatch('updateRemitentes', data)
          let pageObject = {
            [fixPage]: {
              array: data,
              fetched: true,
            },
          }
          dispatch('updateRemitentesObject', pageObject)

          return
        }
        dispatch('updateRemitentes', [])
      })
  },
  async getRemitentesById ({ dispatch }, {page, id}) {
    console.log('page: ', page,'id: ', id)
    let fixPage = page - 1
    if (fixPage < 0) {
      fixPage = 0
    }
    let start = 10 * fixPage

    if (start < 0) {
      start = 0
    }

    await this.$fireStore.collection('remitentes').
      where('id', '>=', '' + id).
      orderBy('id').
      startAfter(start).
      limit(1).
      onSnapshot((query) => {
        const data = []

        dispatch('updateOnRemitentes', true)
        query.forEach((e) => data.push(e.data()))
        console.log('snapshot: ', data)
        if (data.length > 0) {
          dispatch('updateRemitentes', data)
          let pageObject = {
            [fixPage]: {
              array: data,
              fetched: true,
            },
          }
          dispatch('updateRemitentesObject', pageObject)

          return
        }
        dispatch('updateRemitentes', [])
      })
  },
  async getRemitentesLength ({ dispatch }) {
    this.$fireStore.collection('numberOfDocuments').
      get().
      then((res) => {
        let numberString = JSON.stringify(res.docs[0].data())
        let number = JSON.parse(numberString)

        let remitentesPaginationObject = {}
        let fakeArray = [
          { id: '0' },
          { id: '0' },
          { id: '0' },
          { id: '0' },
          { id: '0' },
          { id: '0' },
          { id: '0' },
          { id: '0' },
          { id: '0' },
          { id: '0' },
        ]
        dispatch('updateRemitentesLength', number.number)
        let pages = Math.ceil(number.number / 10)
        for (let i = 0; i < pages; i++) {
          if (i !== 0) {
            remitentesPaginationObject[i] = { array: fakeArray, fetched: false }
          }
        }
        dispatch('updateRemitentesObject', remitentesPaginationObject)
      })
  },
  async searchRemitente ({ dispatch }, {id}) {

    await this.$fireStore.collection('remitentes').
    where('id', '>=', '' + id).
    orderBy('id').
    limit(10).
    onSnapshot((query) => {
      const data = []

      dispatch('updateOnRemitentes', true)
      query.forEach((e) => data.push(e.data()))
      console.log('snapshot: ', data)
      if (data.length > 0) {
        dispatch('searchResult', data)
      }
    })
  },



  updateRemitentes ({ commit }, remitentes) {
    return commit('SET_REMITENTES', remitentes)
  },
  updateOnRemitentes ({ commit }, boolean) {
    commit('SET_ON_REMITENTES', boolean)
  },
  updateRemitentesLength ({ commit }, length) {
    commit('SET_REMITENTES_LENGTH', length)
  },
  updateRemitentesObject ({ commit }, object) {
    commit('SET_REMITENTES_OBJECT', object)
  },
  searchResult ({ commit }, object) {
    commit('SET_SEARCH_RESULT', object)
  },

  stopRemitentes () {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  },
}

export const mutations = {
  SET_REMITENTES (state, remitentes) {
    return (state.remitentes = state.remitentes.concat(remitentes))
  },
  SET_ON_REMITENTES (state, boolean) {
    return (state.onRemitentes = boolean)
  },
  SET_REMITENTES_LENGTH (state, length) {
    return (state.remitentesLength = length)
  },
  SET_REMITENTES_OBJECT (state, object) {
    return (state.remitentesObject = { ...state.remitentesObject, ...object })
  },
  SET_SEARCH_RESULT(state, object) {
    return (state.searchResult =  [...object] )
  },
}
