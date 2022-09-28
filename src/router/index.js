import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import ArticleList from '@/components/ArticleList'
import CateMana from '@/components/CateMana'
import PostArticle from '@/components/PostArticle'
import UserMana from '@/components/UserMana'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '登录',
      hidden: true,
      component: Login
    }, {
      path: '/home',
      component: Home,
      name: '实时数据',
      children: [
        {
          path: '/dataView',
          iconCls: 'fa fa-television',
          name: '实时数据',
          component: () => import('@/components/datav/dataView'),
        }
      ]
    },{
      path: '/home',
      component: Home,
      name: '设备管理',
      children: [
        {
          path: '/cateMana',
          iconCls: 'fa fa-reorder',
          name: '设备管理',
          component: CateMana
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: '数据统计',
      iconCls: 'fa fa-bar-chart',
      children: [
        {
          path: '/charts',
          iconCls: 'fa fa-bar-chart',
          name: '数据统计',
          component: () => import('@/components/mix-chart'),
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: '数据管理',
      iconCls: 'fa fa-file-text-o',
      children: [
        {
          path: '/articleList',
          name: '导出数据',
          component: ArticleList,
          meta: {
            keepAlive: true
          }
        }, {
          path: '/postArticle',
          name: '录入数据',
          component: PostArticle,
          meta: {
            keepAlive: false
          }
        }
      ]
    },  {
      path: '/home',
      component: Home,
      name: '用户管理',
      children: [
        {
          path: '/user',
          iconCls: 'fa fa-user-o',
          name: '用户管理',
          component: UserMana
        }
      ]
    }, {
      path: '/home',
      component: Home,
      name: '操作日志',
      iconCls: 'fa fa-bar-chart',
      children: [
        {
          path: '/log',
          iconCls: 'fa fa-hand-pointer-o',
          name: '操作日志',
          component: () => import('@/components/log'),
        }
      ]
    }
  ]
})
