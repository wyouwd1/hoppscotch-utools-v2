// uTools 插件功能配置
// 移除重复的 utoolsConfig 声明，在文件末尾有统一配置

// uTools Hoppscotch 插件功能配置系统
// 基于参考项目 baiy/hoppscotch-utools 的成功经验进行功能精简和优化

// 环境检测
export function isUtoolsEnv(): boolean {
  return !!(window as any).utools || !!(window as any).UTOOLS_ENV
}

// 功能开关配置接口
export interface FeatureConfig {
  // 核心协议支持
  protocols: {
    http: boolean          // HTTP/HTTPS 请求（核心功能）
    websocket: boolean     // WebSocket 连接
    mqtt: boolean          // MQTT 协议
    graphql: boolean       // GraphQL 查询（可选）
    grpc: boolean          // gRPC 协议（高级功能）
  }
  
  // 数据管理功能
  dataManagement: {
    collections: boolean   // API 集合管理
    environments: boolean  // 环境变量管理
    history: boolean       // 请求历史记录
    importExport: boolean  // 导入导出功能
  }
  
  // 代码生成功能
  codeGeneration: {
    enabled: boolean       // 是否启用代码生成
    languages: string[]    // 支持的语言列表
  }
  
  // UI 界面功能
  ui: {
    darkMode: boolean      // 深色模式
    compactMode: boolean   // 紧凑模式
    sidebar: boolean       // 侧边栏
    responsePreview: boolean // 响应预览
  }
  
  // 高级功能
  advanced: {
    interceptors: boolean  // 网络拦截器
    middleware: boolean    // 中间件支持
    plugins: boolean       // 插件系统
    scripting: boolean     // 脚本支持
  }
  
  // 已移除的功能（固定为 false）
  disabled: {
    teamCollaboration: boolean // 团队协作
    cloudAuth: boolean         // 云端认证
    realTimeSync: boolean      // 实时同步
    analytics: boolean         // 数据分析
    pwa: boolean              // PWA 功能
  }
}

// 默认功能配置（基于参考项目的最佳实践）
const defaultFeatures: FeatureConfig = {
  // 保留核心协议支持
  protocols: {
    http: true,       // ✅ HTTP 请求（必需）
    websocket: true,  // ✅ WebSocket（常用）
    mqtt: true,       // ✅ MQTT（IoT 开发常用）
    graphql: true,    // ✅ GraphQL（可选，但很有用）
    grpc: false       // ❌ gRPC（高级功能，可后续添加）
  },
  
  // 核心数据管理
  dataManagement: {
    collections: true,   // ✅ 集合管理（必需）
    environments: true,  // ✅ 环境变量（必需）
    history: true,       // ✅ 历史记录（重要）
    importExport: true   // ✅ 导入导出（重要）
  },
  
  // 代码生成（精简版）
  codeGeneration: {
    enabled: true,
    languages: ['javascript', 'curl', 'python', 'java'] // 常用语言
  },
  
  // UI 功能（适配 uTools）
  ui: {
    darkMode: true,        // ✅ 深色模式
    compactMode: true,     // ✅ 紧凑模式（适合 uTools）
    sidebar: true,         // ✅ 侧边栏
    responsePreview: true  // ✅ 响应预览
  },
  
  // 高级功能（选择性启用）
  advanced: {
    interceptors: true,  // ✅ 网络拦截器（重要）
    middleware: false,   // ❌ 中间件（复杂）
    plugins: false,      // ❌ 插件系统（复杂）
    scripting: false     // ❌ 脚本支持（安全考虑）
  },
  
  // 明确禁用的功能
  disabled: {
    teamCollaboration: false, // ❌ 团队协作
    cloudAuth: false,         // ❌ 云端认证
    realTimeSync: false,      // ❌ 实时同步
    analytics: false,         // ❌ 数据分析
    pwa: false               // ❌ PWA 功能
  }
}

// 用户自定义配置（可通过 uTools DB 存储）
let userFeatures: Partial<FeatureConfig> = {}

// 获取功能配置
export function getFeatureConfig(): FeatureConfig {
  // 合并默认配置和用户配置
  return {
    protocols: { ...defaultFeatures.protocols, ...userFeatures.protocols },
    dataManagement: { ...defaultFeatures.dataManagement, ...userFeatures.dataManagement },
    codeGeneration: { ...defaultFeatures.codeGeneration, ...userFeatures.codeGeneration },
    ui: { ...defaultFeatures.ui, ...userFeatures.ui },
    advanced: { ...defaultFeatures.advanced, ...userFeatures.advanced },
    disabled: { ...defaultFeatures.disabled, ...userFeatures.disabled }
  }
}

// 检查功能是否启用
export function isFeatureEnabled(path: string): boolean {
  const config = getFeatureConfig()
  const keys = path.split('.')
  let value = config as any
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      return false
    }
  }
  
  return Boolean(value)
}

// 设置功能开关
export async function setFeatureEnabled(path: string, enabled: boolean): Promise<void> {
  const keys = path.split('.')
  let target = userFeatures as any
  
  // 创建嵌套对象路径
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!target[key] || typeof target[key] !== 'object') {
      target[key] = {}
    }
    target = target[key]
  }
  
  // 设置值
  target[keys[keys.length - 1]] = enabled
  
  // 保存到 uTools DB
  try {
    if ((window as any).utools?.db?.put) {
      (window as any).utools.db.put({
        _id: 'hopp_feature_config',
        data: userFeatures,
        timestamp: Date.now()
      })
    }
  } catch (error) {
    console.warn('保存功能配置失败:', error)
  }
}

// 从 uTools DB 加载用户配置
export async function loadUserFeatureConfig(): Promise<void> {
  try {
    if ((window as any).utools?.db?.get) {
      const doc = (window as any).utools.db.get('hopp_feature_config')
      if (doc && doc.data) {
        userFeatures = doc.data
        console.log('已加载用户功能配置:', userFeatures)
      }
    }
  } catch (error) {
    console.warn('加载功能配置失败:', error)
  }
}

// 重置为默认配置
export async function resetFeatureConfig(): Promise<void> {
  userFeatures = {}
  try {
    if ((window as any).utools?.db?.remove) {
      const doc = (window as any).utools.db.get('hopp_feature_config')
      if (doc) {
        (window as any).utools.db.remove(doc)
      }
    }
  } catch (error) {
    console.warn('重置功能配置失败:', error)
  }
}

// 获取启用的协议列表
export function getEnabledProtocols(): string[] {
  const config = getFeatureConfig()
  return Object.entries(config.protocols)
    .filter(([_, enabled]) => enabled)
    .map(([protocol, _]) => protocol)
}

// 兼容原有的 getConfig 函数
const legacyConfig = {
  ui: {
    windowTitle: 'Hoppscotch • API 测试工具'
  },
  features: {
    exportAsGIST: false,
    cookies: true,
    serviceWorker: false
  },
  network: {
    defaultInterceptor: 'browser'
  },
  storage: {
    maxCollectionSize: 10
  }
}

export function getConfig(path: string, defaultValue?: any): any {
  const keys = path.split('.')
  let value = legacyConfig as any
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key]
    } else {
      return defaultValue
    }
  }
  
  return value !== undefined ? value : defaultValue
}

// 初始化功能配置系统
if (isUtoolsEnv()) {
  // 在 uTools 环境中自动加载配置
  setTimeout(() => {
    loadUserFeatureConfig()
  }, 100)
}

// uTools 插件配置（统一导出）
export const utoolsConfig = {
  // 插件元信息
  meta: {
    pluginName: 'Hoppscotch',
    version: '2025.1.0',
    description: 'API 开发测试工具 - uTools 版本',
    author: 'uTools Plugin Team',
    keywords: ['api', 'http', 'websocket', 'graphql', 'test']
  },
  
  // 功能开关
  features: {
    // 协议支持
    http: true,
    websocket: true,
    mqtt: true,
    graphql: false, // 参考项目默认禁用，可配置启用
    sse: true, // Server-Sent Events
    socketio: true,
    
    // 认证功能
    oauth: false, // 禁用 OAuth 登录
    teamCollaboration: false, // 禁用团队协作
    cloudSync: false, // 禁用云同步（使用 uTools 自身的同步）
    
    // UI 功能
    pwa: false, // 禁用 PWA
    serviceWorker: false, // 禁用 Service Worker
    notifications: true, // 使用 uTools 通知
    
    // 存储功能
    localStorage: true, // 通过 uTools DB 实现
    sessionStorage: true, // 内存实现
    cookies: true, // 默认同意
    
    // 导入导出
    importExport: true,
    codeGeneration: true, // 保留代码生成
    
    // 高级功能
    scripts: true, // 预请求和后请求脚本
    environments: true, // 环境变量
    collections: true, // 集合管理
    history: true, // 历史记录
    
    // 开发者功能
    devTools: false, // 禁用开发者工具
    inspect: false, // 禁用检查工具
  },
  
  // UI 适配配置
  ui: {
    showHeader: false,     // uTools 环境隐藏顶部
    compactMode: true,     // 紧凑模式
    defaultLanguage: 'zh-CN',
    theme: 'auto',         // 自动主题
    layout: 'sidebar',     // 侧边栏布局
    
    // 页面布局
    showFooter: true, // 保留底部，但简化
    showSidebar: true, // 保留侧边栏
    
    // 主题
    defaultTheme: 'system', // 跟随系统主题
    allowThemeChange: true,
    
    // 语言
    defaultLocale: 'zh-CN', // 默认中文
    allowLocaleChange: true,
    
    // 窗口
    windowTitle: 'Hoppscotch • API 测试工具',
    windowIcon: './icon.png',
  },
  
  // 路由配置
  router: {
    mode: 'hash', // 使用 Hash 路由
    base: './', // 相对路径
    
    // 禁用的路由
    disabledRoutes: [
      '/teams', // 团队页面
      '/login', // 登录页面
      '/settings/account', // 账户设置
      '/admin', // 管理后台
    ],
    
    // 默认页面
    defaultRoute: '/', // 默认到首页
  },
  
  // 存储配置
  storage: {
    prefix: 'hopp_', // uTools DB 键前缀
    
    // 数据限制
    maxHistoryEntries: 1000,
    maxCollectionSize: 10 * 1024 * 1024, // 10MB
    maxEnvironmentVariables: 500,
    
    // 自动清理
    autoCleanup: true,
    cleanupInterval: 7 * 24 * 60 * 60 * 1000, // 7天
  },
  
  // 网络配置
  network: {
    // 请求拦截器
    interceptors: ['browser', 'proxy'], // 可用的拦截器
    defaultInterceptor: 'browser',
    
    // 超时设置
    timeout: 30000, // 30秒
    
    // 代理设置
    proxy: {
      enabled: false,
      url: '',
    },
  },
  
  // 安全配置
  security: {
    // Cookie 设置
    cookieConsent: 'accepted', // 默认同意
    
    // CORS 处理
    corsEnabled: true,
    
    // 敏感数据处理
    maskSensitiveData: true,
    sensitiveKeys: ['password', 'token', 'secret', 'key', 'auth'],
  },
  
  // 性能优化配置
  performance: {
    // 懒加载
    lazyLoading: true,     // 懒加载
    virtualScroll: true,   // 虚拟滚动
    debounceMs: 300,       // 防抖时间
    maxHistoryItems: 1000, // 最大历史记录数
    
    // 虚拟滚动
    virtualScrolling: true,
    virtualScrollThreshold: 100,
    
    // 缓存
    enableCache: true,
    cacheSize: 50, // 缓存的请求数量
  },
  
  // 开发配置
  development: {
    debug: false,
    verbose: false,
    devTools: false,
  }
}