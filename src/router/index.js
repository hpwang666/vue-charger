import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import device from '@/components/device'
import UserMana from '@/components/UserMana'

Vue.use(Router)


export const constantRoutes = [
  {
    path: '/login',
    name: '登录',
    hidden: true,
    component: Login
  }, {
    path: '/home',
    component: Home,
    name: '实时数据0',
    children: [
      {
        path: 'dataView',
        iconCls: 'fa fa-television',
        name: '实时数据',
        component: () => import('@/components/datav/dataView'),
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/components/404'),
    hidden: true
  }
]

export const asyncRoutes = [
  {
    path: '/home',
    component: Home,
    name: '设备管理0',
    children: [
      {
        path: 'device',
        iconCls: 'fa fa-reorder',
        name: '设备管理',
        component: device,
        meta : {
          roles: ['admin','editor'] 
        }
      }
    ]
  }, {
    path: '/home',
    component: Home,
    name: '数据统计0',
    iconCls: 'fa fa-bar-chart',
    children: [
      {
        path: 'charts',
        iconCls: 'fa fa-bar-chart',
        name: '数据统计',
        component: () => import('@/components/mix-chart'),
        meta : {
          roles: ['admin','editor'] 
        }
      }
    ]
  }, {
    path: '/home',
    component: Home,
    name: '组织机构',
    iconCls: 'fa fa-file-text-o',
    children: [
      {
        path: 'city',
        name: '城市管理',
        component: () => import('@/components/org/city'),
        meta: {
          roles: ['admin','editor'] 
        }
      }, 
       {
        path: 'cityAccount',
        name: '城市账户管理',
        hidden: true,
        component: () => import('@/components/org/account'),
      }, 
      {
        path: 'group',
        name: '集团管理',
        component: () => import('@/components/org/account'),
        meta: {
          roles: ['admin','editor'] 
        }
      }, {
        path: 'company',
        name: '公司管理',
        component: () => import('@/components/org/city'),
        meta: {
          roles: ['admin','editor'] 
        }
      }, {
        path: 'prj',
        name: '项目管理',
        component: () => import('@/components/org/city'),
        meta: {
          roles: ['admin','editor'] 
        }
      }
    ]
  },  {
    path: '/home',
    component: Home,
    name: '用户管理0',
    children: [
      {
        path: 'user',
        iconCls: 'fa fa-user-o',
        name: '用户管理',
        component: UserMana,
        meta : {
          roles: ['admin','editor'] 
        }
      }
    ]
  },
  {
    path: '/home',
    component: Home,
    name: '操作日志0',
    iconCls: 'fa fa-bar-chart',
    children: [
      {
        path: 'log',
        iconCls: 'fa fa-hand-pointer-o',
        name: '操作日志',
        component: () => import('@/components/log'),
        meta : {
          roles: ['admin'] 
        }
      }
    ]
  },
    // 404 page must be placed at the end !!!

  { path: '*' ,name: '404',redirect: '/404', hidden: true }
]

const createRouter = () =>new Router({
  routes :constantRoutes
})

const router = createRouter()

export function resetRouter(){
  const newRouter = createRouter()
  router.matcher = newRouter.matcher;
}

export default router;