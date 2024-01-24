import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import dataV from '@jiaminghi/data-view'
import 'element-ui/lib/theme-chalk/index.css'
// import './styles/element-variables.scss'
import 'font-awesome/css/font-awesome.min.css'
import './utils/filter_utils.js'
import './icons' // icon
import '@/permission' // permission control


import "./assets/css/common.css";
import "./assets/css/flex-layout.css";
import "./assets/css/site.css";



Vue.use(ElementUI)
Vue.use(dataV)
Vue.config.productionTip = false
window.bus = new Vue();
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
