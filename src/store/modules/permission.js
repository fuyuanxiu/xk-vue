import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  //console.log(route.name)
  
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.includes('admin')) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    AddRoutesBy({ commit }, data) {//20190918-fyx-根据菜单的name生产左侧菜单列表
      return new Promise(resolve => {
        console.log(data)
        const { roles } = data
        let accessedRouters
        accessedRouters = filterAsyncRouterAdd(asyncRouterMap, roles)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}


/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param routeName
 * @param route
 */
function hasPermissionAdd(routeName, route) {
  //console.log(route.name)

  // if (route.name) {
  //   return routeName.some(role => route.name.includes(role))
  // } else {
  //   return true
  // }
  if (route.name) {
    return routeName.some(function (role) {
      return route.name.includes(role);
    });
  } else {
    return true;
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param routerNames
 */
function filterAsyncRouterAdd(routes, routerNames) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermissionAdd(routerNames, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouterAdd(tmp.children, routerNames)
      }
      res.push(tmp)
    }
  })

  return res
}

export default permission
