import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import request from '@/utils/request'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    depart: []
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
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
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
    const { username, password } = userInfo
   
    return new Promise((resolve, reject) => {
     // postRequest('/vue-element-admin/user/login', {
     ////   username: username,
      //  password: password
      //})
      request({
        url: '/vue-element-admin/user/login',
        method: 'post',
        data:  userInfo 
      }).then(response => {
        const { data,code } = response
        if(code == 20000){
          commit('SET_TOKEN', data)
          setToken(data)
          resolve('111111')
        }
        else reject()

      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      var bb={token:state.token}
     
      //getRequest('/vue-element-admin/user/info?token='+state.token).then(response => {
        request({
          url: '/vue-element-admin/user/info',
          method: 'get',
          params:  bb 
        }).then(response => {
        const { data,code } = response
        //console.log(state.token)
        if (!data) {
          reject('Verification failed, please Login again.')
        }
       

        const { roles, name, avatar } = data[0]
        const { options } = data[1]
        //console.log(data[1])
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        if(code == 20000){
          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_DEPART',options)
          resolve(data)
        }
        else reject();
        
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
          url: '/vue-element-admin/user/logout',
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

