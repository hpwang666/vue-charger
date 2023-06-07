import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import request from '@/utils/request'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    roles: [],
    depart: '',
    departTree:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_DEPART_TREE: (state, departTree) => {
    state.departTree = departTree
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_DEPART: (state,depart)=>{
    state.depart = depart
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
   
    return new Promise((resolve, reject) => {
     // postRequest('/vue-element-admin/user/login', {
     ////   username: username,
      //  password: password
      //})
      request({
        url: '/sys/login',
        method: 'post',
        data:  userInfo 
      }).then(response => {
        const { result,code } = response
        if(code == 200){
          commit('SET_TOKEN', result.token)
          setToken(result.token)
          resolve('111111')
        }
        else reject()

      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
        request({
          url: '/sys/user/info',
          method: 'get'
        }).then(response => {
        const { code,result } = response
        //console.log(state.token)
        
       

        const { roles, depart ,name} =result
        //const { options } = data[1]
        //console.log(roles)
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        if(code == 200){
          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_DEPART',depart)
          resolve(result)
        }
        else reject();
        
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getDepartTree({ commit }) {
    return new Promise((resolve, reject) => {
        request({
          url: '/sys/depart/queryTreeList',
          method: 'get'
        }).then(response => {
        const { result } = response
        
        commit('SET_DEPART_TREE',result.departTree);
        resolve()
        
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
    // user logout
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: '/sys/logout',
          method: 'get'}).then(() => {
            console.log('logout');
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  
    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        removeToken() // must remove  token  first
        commit('RESET_STATE')
        resolve()
      })
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

