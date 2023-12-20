
const state = {
  stationId: '',
  stationName:''
}

const mutations = {
  SET_STATION_ID: (state, id) => {
    state.stationId = id
  },
  SET_STATION_NAME: (state, name) => {
    state.stationName = name
  }
}

const actions = {
 
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
