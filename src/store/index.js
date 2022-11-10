import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import permission from './modules/permission'
import org from './modules/org'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    permission,
    org
  },
  getters
})

export default store
  