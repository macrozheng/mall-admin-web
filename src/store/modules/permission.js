import { asyncRouterMap, constantRouterMap } from '@/router/index';

//判断是否有权限访问该菜单
function hasPermission(menus, route) {
  if (!route.name) {
    return true;
  }
  
  // 使用 Map 缓存菜单查找，提高性能
  if (!hasPermission.menuMap) {
    hasPermission.menuMap = new Map();
  }
  
  const cacheKey = `${JSON.stringify(menus)}-${route.name}`;
  if (hasPermission.menuMap.has(cacheKey)) {
    const cached = hasPermission.menuMap.get(cacheKey);
    if (cached.found) {
      applyMenuProperties(route, cached.menu);
    }
    return cached.result;
  }
  
  let currMenu = null;
  for (let i = 0; i < menus.length; i++) {
    if (route.name === menus[i].name) {
      currMenu = menus[i];
      break;
    }
  }
  
  if (currMenu !== null) {
    applyMenuProperties(route, currMenu);
    hasPermission.menuMap.set(cacheKey, { found: true, menu: currMenu, result: true });
    return true;
  } else {
    route.sort = 0;
    if (route.hidden !== undefined && route.hidden === true) {
      route.sort = -1;
      hasPermission.menuMap.set(cacheKey, { found: false, menu: null, result: true });
      return true;
    } else {
      hasPermission.menuMap.set(cacheKey, { found: false, menu: null, result: false });
      return false;
    }
  }
}

// 应用菜单属性到路由
function applyMenuProperties(route, menu) {
  if (menu.title != null && menu.title !== '') {
    route.meta.title = menu.title;
  }
  if (menu.icon != null && menu.icon !== '') {
    route.meta.icon = menu.icon;
  }
  if (menu.hidden != null) {
    route.hidden = menu.hidden !== 0;
  }
  if (menu.sort != null && menu.sort !== '') {
    route.sort = menu.sort;
  }
}

//对菜单进行排序
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    let router = accessedRouters[i];
    if(router.children && router.children.length > 0){
      router.children.sort(compare("sort"));
    }
  }
  accessedRouters.sort(compare("sort"));
}

//降序比较函数
function compare(p){
  return function(m,n){
    let a = m[p];
    let b = n[p];
    return b - a;
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menus } = data;
        const { username } = data;
        const accessedRouters = asyncRouterMap.filter(v => {
          //admin帐号直接返回所有菜单
          // if(username==='admin') return true;
          if (hasPermission(menus, v)) {
            if (v.children && v.children.length > 0) {
              v.children = v.children.filter(child => {
                if (hasPermission(menus, child)) {
                  return child
                }
                return false;
              });
              return v
            } else {
              return v
            }
          }
          return false;
        });
        //对菜单进行排序
        sortRouters(accessedRouters);
        commit('SET_ROUTERS', accessedRouters);
        resolve();
      })
    }
  }
};

export default permission;

