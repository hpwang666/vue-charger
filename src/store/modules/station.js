
const state = {
  stationId: ''
}

const mutations = {
  SET_STATION_ID: (state, id) => {
    state.stationId = id
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
