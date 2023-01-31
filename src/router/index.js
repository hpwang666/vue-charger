import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import device from '@/components/device'
import Charger from '@/components/charger/charger'

Vue.use(Router)


export const constantRoutes = [
  {
    path: '/login',
    name: '登录',
    hidden: true,
    component: Login
  }, 
  {
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
    meta : {
      roles: ['admin'] 
    },
    children: [
      {
        path: 'device',
        iconCls: 'fa fa-reorder',
        name: '设备管理',
        component: device,
        meta : {
          roles: ['admin'] 
        }
      }
    ]
  }, {
    path: '/home',
    component: Home,
    name: '数据统计0',
    iconCls: 'fa fa-bar-chart',
    meta : {
      roles: ['admin'] 
    },
    children: [
      {
        path: 'charts',
        iconCls: 'fa fa-bar-chart',
        name: '数据统计',
        component: () => import('@/components/mix-chart'),
        meta : {
          roles: ['admin'] 
        }
      }
    ]
  }, {
    path: '/home',
    component: Home,
    name: '组织机构',
    iconCls: 'fa fa-file-text-o',
    meta: {
      roles: ['superAdmin','city','group','com','prj'] 
    },
    children: [
      {
        path: 'city',
        name: '城市管理',
        component: () => import('@/components/depart/city'),
        meta: {
          roles: ['superAdmin','city'] 
        }
      }, 
      {
        path: 'cityAccount',
        name: '城市账户管理',
        hidden: true,
        component: () => import('@/components/depart/account'),
        meta: {
          roles: ['superAdmin','city'] 
        }
      }, 
      {
        path: 'group',
        name: '集团管理',
        component: () => import('@/components/depart/group'),
        meta: {
          roles: ['superAdmin','city','group'] 
        }
      }, 
      {
        path: 'groupAccount',
        name: '集团账户管理',
        hidden: true,
        component: () => import('@/components/depart/account'),
        meta: {
          roles: ['superAdmin','city','group'] 
        }
      }, 
      {
        path: 'company',
        name: '公司管理',
        component: () => import('@/components/depart/company'),
        meta: {
          roles: ['superAdmin','city','group','com'] 
        }
      },
      {
        path: 'comAccount',
        name: '公司账户管理',
        hidden: true,
        component: () => import('@/components/depart/account'),
        meta: {
          roles: ['superAdmin','city','group','com'] 
        }
      }, 
      {
        path: 'project',
        name: '项目管理',
        iconCls: 'fa fa-file-text-o',
        component: () => import('@/components/depart/project'),
        meta: {
          roles: ['superAdmin','city','group','com','prj'] 
        }
      },
      {
        path: 'prjAccount',
        name: '项目账户管理',
        hidden: true,
        component: () => import('@/components/depart/account'),
        meta: {
          roles: ['superAdmin','city','group','com','prj'] 
        }
      }, 
    ]
  },  {
    path: '/home',
    component: Home,
    name: '电桩管理0',
    children: [
      {
        path: 'chargers',
        iconCls: 'fa fa-cab',
        name: '电站电桩',
        component: Charger,
        meta : {
          roles: ['admin','city','group','com','prj'] 
        }
      },
      {
        path: 'chargerEdit',
        hidden: true,
        name: '电桩编辑',
        component: () => import('@/components/charger/chargerEdit'),
        meta : {
          roles: ['admin','city','group','com','prj'] 
        }
      }
    ]
  },
  {
    path: '/home',
    component: Home,
    name: '操作日志0',
    meta : {
      roles: ['superAdmin'] 
    },
    children: [
      {
        path: 'log',
        iconCls: 'fa fa-hand-pointer-o',
        name: '操作日志',
        component: () => import('@/components/log'),
        meta : {
          roles: ['superAdmin'] 
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