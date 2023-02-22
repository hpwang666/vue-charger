import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import permission from './modules/permission'
import org from './modules/org'
import station from './modules/station'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    permission,
    org,
    station
  },
  getters
})

export default store
  