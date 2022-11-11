import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // get token from cookie


const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar

  // set page title

  // determine whether the user has logged in
  const hasToken = getToken()
  console.log('getToken: '+hasToken)
  if (hasToken) {
    if (to.path === '/login'|| to.path === '/') {
      // if is logged in, redirect to the home page
      next({ path: '/home' })
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      
      if (hasRoles) {
        console.log('has roles: '+store.getters.roles)
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
         
          const  { roles } =await store.dispatch('user/getInfo').then((resp)=>{
            return resp[0];
          })
          console.log('get roles: '+roles);
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          if(accessRoutes.length>0){
            router.addRoutes(accessRoutes)
            accessRoutes.forEach(element => {
              console.log('element: '+element.name) ;
              if(element.children) {
                element.children.forEach(clild=>{
                  console.log('clild: '+clild.name) 
                });
              }
            });
             
          }
          

         

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login`)
        }
      }
    }
  } else {
    /* has no token*/
    console.log('path and redirect '+ to.path+'  '+whiteList.indexOf(to.path))
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})

