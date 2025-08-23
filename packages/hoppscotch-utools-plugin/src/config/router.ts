// uTools 插件路由配置
import { RouteRecordRaw } from 'vue-router'

// 简化的路由配置，移除不需要的页面
export const utoolsRoutes: RouteRecordRaw[] = [
  // 主页面路由
  {
    path: '/',
    name: 'home',
    redirect: '/rest'
  },
  
  // REST API 页面 (主要功能)
  {
    path: '/rest',
    name: 'rest',
    component: () => import('@hoppscotch/common/pages/r/index.vue')
  },
  
  // WebSocket 页面
  {
    path: '/realtime',
    name: 'realtime',
    component: () => import('@hoppscotch/common/pages/realtime/index.vue')
  },
  
  // 环境变量页面
  {
    path: '/environments',
    name: 'environments',
    component: () => import('@hoppscotch/common/pages/settings/environments.vue')
  },
  
  // 集合页面
  {
    path: '/collections',
    name: 'collections',
    component: () => import('@hoppscotch/common/pages/collections/index.vue')
  },
  
  // 历史页面
  {
    path: '/history',
    name: 'history', 
    component: () => import('@hoppscotch/common/pages/history/index.vue')
  },
  
  // 设置页面
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@hoppscotch/common/pages/settings/index.vue')
  },
  
  // GraphQL 页面 (可选，基于配置)
  {
    path: '/graphql',
    name: 'graphql',
    component: () => import('@hoppscotch/common/pages/graphql/index.vue'),
    beforeEnter: (to, from, next) => {
      // 检查 GraphQL 功能是否启用
      import('@config/features').then(({ getConfig }) => {
        if (getConfig('features.graphql', false)) {
          next()
        } else {
          // GraphQL 禁用时重定向到 REST
          next('/rest')
        }
      })
    }
  },
  
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
]

// 禁用的路由 (uTools 环境不支持)
export const disabledRoutes = [
  '/teams',           // 团队协作
  '/login',           // 登录页面 
  '/signup',          // 注册页面
  '/logout',          // 登出页面
  '/account',         // 账户管理
  '/admin',           // 管理后台
  '/billing',         // 付费管理
  '/profile',         // 个人资料
  '/organizations',   // 组织管理
  '/workspace',       // 工作区
  '/dashboard',       // 仪表板
]

// 路由配置选项
export const utoolsRouterOptions = {
  // 使用 Hash 路由模式
  history: 'hash' as const,
  
  // 基础路径
  base: './',
  
  // 默认路由
  defaultRoute: '/rest',
  
  // 滚动行为
  scrollBehavior(to: any, from: any, savedPosition: any) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
}

// 路由守卫
export const setupRouterGuards = (router: any) => {
  // 全局前置守卫
  router.beforeEach((to: any, from: any, next: any) => {
    // 检查是否为禁用的路由
    if (disabledRoutes.includes(to.path)) {
      console.warn(`路由 ${to.path} 在 uTools 环境中不可用，重定向到主页`)
      next(utoolsRouterOptions.defaultRoute)
      return
    }
    
    // 检查功能开关
    import('@config/features').then(({ isFeatureEnabled }) => {
      // GraphQL 功能检查
      if (to.path.startsWith('/graphql') && !isFeatureEnabled('graphql')) {
        console.warn('GraphQL 功能已禁用，重定向到 REST 页面')
        next('/rest')
        return
      }
      
      // WebSocket 功能检查
      if (to.path.startsWith('/realtime') && !isFeatureEnabled('websocket')) {
        console.warn('WebSocket 功能已禁用，重定向到 REST 页面')
        next('/rest')
        return
      }
      
      next()
    }).catch(() => {
      // 配置加载失败时允许继续
      next()
    })
  })
  
  // 全局后置守卫
  router.afterEach((to: any) => {
    // 更新页面标题
    const title = getPageTitle(to.path)
    if (title && document.title !== title) {
      document.title = title
    }
  })
}

// 获取页面标题
function getPageTitle(path: string): string {
  const baseTitile = 'Hoppscotch • API 测试工具'
  
  const titleMap: Record<string, string> = {
    '/rest': 'REST API',
    '/realtime': 'WebSocket',
    '/graphql': 'GraphQL',
    '/environments': '环境变量',
    '/collections': 'API 集合',
    '/history': '历史记录',
    '/settings': '设置'
  }
  
  const pageTitle = titleMap[path]
  return pageTitle ? `${pageTitle} - ${baseTitile}` : baseTitile
}

// 导出配置
export default {
  routes: utoolsRoutes,
  options: utoolsRouterOptions,
  setupGuards: setupRouterGuards,
  disabledRoutes
}