import { asyncRouterMap, constantRouterMap } from '@/router/index';

// Create a Set for O(1) menu name lookup instead of complex caching
function hasPermission(menus, route) {
  if (!Array.isArray(menus) || !route) {
    return false;
  }
  
  if (!route.name) {
    return true;
  }
  
  // Initialize menu name set if not exists
  if (!hasPermission.menuNameSet) {
    hasPermission.menuNameSet = new Set(menus.map(menu => menu.name));
  }
  
  const hasMenu = hasPermission.menuNameSet.has(route.name);
  
  if (hasMenu) {
    const menu = menus.find(m => m.name === route.name);
    applyMenuProperties(route, menu);
    return true;
  } else {
    route.sort = 0;
    if (route.hidden === true) {
      route.sort = -1;
      return true;
    }
    return false;
  }
}

// Clear cache when menus change
hasPermission.clearCache = () => {
  hasPermission.menuNameSet = null;
};

// Apply menu properties to route
function applyMenuProperties(route, menu) {
  if (menu?.title) {
    route.meta.title = menu.title;
  }
  if (menu?.icon) {
    route.meta.icon = menu.icon;
  }
  if (menu?.hidden !== undefined) {
    route.hidden = menu.hidden !== 0;
  }
  if (menu?.sort !== undefined && menu.sort !== '') {
    route.sort = Number(menu.sort) || 0;
  }
}

// Sort routers by sort property (descending order)
function sortRouters(accessedRouters) {
  const compare = (property) => (a, b) => {
    const valA = a[property] ?? 0;
    const valB = b[property] ?? 0;
    return valB - valA;
  };
  
  accessedRouters.forEach(router => {
    if (router.children?.length > 0) {
      router.children.sort(compare('sort'));
    }
  });
  accessedRouters.sort(compare('sort'));
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
    },
    CLEAR_PERMISSION_CACHE: () => {
      hasPermission.clearCache();
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        try {
          const { menus, username } = data;
          
          // Admin account returns all menus (uncomment if needed)
          // if (username === 'admin') {
          //   const allRouters = JSON.parse(JSON.stringify(asyncRouterMap));
          //   sortRouters(allRouters);
          //   commit('SET_ROUTERS', allRouters);
          //   resolve();
          //   return;
          // }
          
          const accessedRouters = asyncRouterMap
            .filter(route => hasPermission(menus, route))
            .map(route => {
              if (route.children?.length > 0) {
                const filteredChildren = route.children.filter(child => 
                  hasPermission(menus, child)
                );
                return {
                  ...route,
                  children: filteredChildren
                };
              }
              return route;
            })
            .filter(route => 
              !route.children || route.children.length > 0
            );
          
          sortRouters(accessedRouters);
          commit('SET_ROUTERS', accessedRouters);
          resolve();
        } catch (error) {
          console.error('Error generating routes:', error);
          commit('SET_ROUTERS', []);
          resolve();
        }
      });
    }
  }
};

export default permission;