// uTools 插件中文本地化配置

// 导入基础的中文语言包
import zhCN from '@hoppscotch/common/locales/zh-CN.json'

// uTools 特定的中文翻译
const utoolsZhCN = {
  // 继承基础中文翻译
  ...zhCN,
  
  // uTools 特定翻译
  utools: {
    plugin: {
      name: 'Hoppscotch',
      description: 'API 测试工具 - 快速、美观的接口调试工具',
      version: 'uTools 插件版本',
      author: 'Hoppscotch Community',
    },
    
    navigation: {
      rest: 'REST API',
      realtime: 'WebSocket',
      graphql: 'GraphQL',
      environments: '环境变量',
      collections: 'API 集合',
      history: '历史记录',
      settings: '设置',
    },
    
    messages: {
      initialized: 'Hoppscotch 已就绪',
      error: '发生错误，请检查控制台',
      data_cleared: '数据已清空',
      clear_data_confirm: '确定要清空所有数据吗？此操作不可恢复。',
      clear_data_failed: '清空数据失败',
      feature_disabled: '此功能在 uTools 环境中不可用',
      route_not_available: '该页面在 uTools 环境中不可用，已重定向到主页',
      graphql_disabled: 'GraphQL 功能已禁用',
      websocket_disabled: 'WebSocket 功能已禁用',
    },
    
    auth: {
      local_user: 'uTools 用户',
      no_login_required: 'uTools 环境下无需登录',
      github_not_supported: 'uTools 环境不支持 GitHub 登录',
      google_not_supported: 'uTools 环境不支持 Google 登录',
      microsoft_not_supported: 'uTools 环境不支持 Microsoft 登录',
      email_not_supported: 'uTools 环境不支持邮箱登录',
      password_reset_not_supported: 'uTools 环境不支持密码重置',
      email_verification_not_supported: 'uTools 环境不支持邮箱验证',
      magic_link_not_supported: 'uTools 环境不支持魔法链接',
      email_not_editable: 'uTools 环境下邮箱不可编辑',
      display_name_not_editable: 'uTools 环境下显示名称不可编辑',
    },
    
    storage: {
      get_failed: '获取数据失败',
      set_failed: '保存数据失败',
      remove_failed: '删除数据失败',
      clear_failed: '清空数据失败',
      sync_initialized: '数据同步系统已初始化',
      collection_sync_initialized: '集合数据同步已初始化',
      environment_sync_initialized: '环境变量数据同步已初始化',
      history_sync_initialized: '历史记录数据同步已初始化',
      settings_sync_initialized: '设置数据同步已初始化',
    },
    
    settings: {
      default_language: '默认语言设置为中文',
      cookie_consent: 'Cookie 使用协议已默认同意',
      locale_setting_failed: '设置默认语言失败',
      cookie_setting_failed: '设置 Cookie 同意失败',
    },
    
    features: {
      http_enabled: 'HTTP 请求功能已启用',
      websocket_enabled: 'WebSocket 功能已启用',
      mqtt_enabled: 'MQTT 功能已启用',
      graphql_enabled: 'GraphQL 功能已启用',
      graphql_disabled_notice: 'GraphQL 功能已禁用，可在配置中启用',
      collections_enabled: '集合管理功能已启用',
      environments_enabled: '环境变量功能已启用',
      history_enabled: '历史记录功能已启用',
      scripts_enabled: '请求脚本功能已启用',
      team_collaboration_disabled: '团队协作功能在 uTools 环境中不可用',
      cloud_sync_disabled: '云端同步功能在 uTools 环境中不可用（使用 uTools 本地同步）',
      oauth_disabled: 'OAuth 登录功能在 uTools 环境中不可用',
      pwa_disabled: 'PWA 功能在 uTools 环境中不可用',
    },
    
    ui: {
      header_hidden: '顶部导航已隐藏以适配 uTools',
      footer_simplified: '底部状态栏已简化',
      layout_optimized: '页面布局已针对 uTools 优化',
      scroll_optimized: '滚动条样式已优化',
      theme_system: '跟随系统主题',
      window_title: 'Hoppscotch • API 测试工具',
    },
    
    network: {
      browser_interceptor: '浏览器拦截器',
      proxy_interceptor: '代理拦截器',
      interceptor_default: '默认使用浏览器拦截器',
      timeout_setting: '请求超时时间',
      cors_enabled: 'CORS 处理已启用',
      request_timeout: '请求超时',
      connection_failed: '连接失败',
      network_error: '网络错误',
    },
    
    performance: {
      lazy_loading_enabled: '懒加载已启用',
      virtual_scrolling_enabled: '虚拟滚动已启用',
      cache_enabled: '缓存已启用',
      memory_cleanup: '内存清理',
      optimization_applied: '性能优化已应用',
    },
    
    links: {
      external_link_handler: '外部链接将在系统浏览器中打开',
      link_handler_initialized: '链接处理器已初始化',
      open_in_browser: '在浏览器中打开',
      asset_path_resolved: '资源路径已解析',
    }
  },
  
  // 覆盖一些基础翻译以适配 uTools
  app: {
    ...zhCN.app,
    name: 'Hoppscotch',
    short_description: 'API 测试工具',
    description: '快速、美观的 API 接口调试工具 - uTools 插件版本',
  },
  
  navigation: {
    ...zhCN.navigation,
    // 移除不支持的导航项
    teams: undefined,
    account: undefined,
    login: undefined,
    logout: undefined,
  },
  
  auth: {
    ...zhCN.auth,
    // 覆盖认证相关翻译
    login_success: '已使用 uTools 用户身份登录',
    logout_success: 'uTools 环境下无需登出',
    not_logged_in: '使用 uTools 本地用户模式',
    email_unverified: 'uTools 环境下无需邮箱验证',
  },
  
  settings: {
    ...zhCN.settings,
    // 移除不支持的设置项
    account: undefined,
    sync: undefined,
    experiments: undefined,
  }
}

// 导出配置
export default utoolsZhCN

// 语言配置
export const localeConfig = {
  // 默认语言
  defaultLocale: 'zh-CN',
  
  // 支持的语言
  supportedLocales: ['zh-CN', 'en'],
  
  // 回退语言
  fallbackLocale: 'en',
  
  // 语言选择器配置
  languageSelector: {
    enabled: true,
    position: 'settings', // 只在设置页面显示
    options: [
      {
        code: 'zh-CN',
        name: '简体中文',
        nativeName: '简体中文'
      },
      {
        code: 'en',
        name: 'English',
        nativeName: 'English'
      }
    ]
  },
  
  // 自动检测设置
  autoDetect: {
    enabled: false, // uTools 环境下默认中文，不自动检测
    sources: ['navigator', 'utools'], // 检测来源
    priority: ['utools', 'navigator'] // 优先级
  }
}

// 初始化本地化设置
export function initUtoolsLocale(): void {
  console.log('初始化 uTools 本地化配置...')
  
  // 设置默认语言为中文
  try {
    if ((window as any).utools) {
      // 如果需要，可以在这里设置语言相关的逻辑
      document.documentElement.lang = 'zh-CN'
    }
    
    // 设置本地存储的语言偏好
    const locale = localStorage.getItem('hopp_settings_LOCALE')
    if (!locale) {
      localStorage.setItem('hopp_settings_LOCALE', 'zh-CN')
    }
    
    console.log('uTools 本地化配置完成')
  } catch (error) {
    console.warn('uTools 本地化配置失败:', error)
  }
}

// 中文本地化字符串（基础版本）
export const zhCNLocale = {
  // 应用基础
  app: {
    name: 'Hoppscotch',
    description: 'API 开发测试工具',
    loading: '正在加载...',
    error: '出现错误'
  },
  
  // HTTP 相关
  http: {
    request: '请求',
    response: '响应',
    method: '请求方法',
    url: 'URL 地址',
    headers: '请求头',
    body: '请求体',
    params: '参数'
  },
  
  // 通用按钮
  buttons: {
    send: '发送',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    copy: '复制',
    import: '导入',
    export: '导出'
  },
  
  // 状态信息
  status: {
    connecting: '正在连接...',
    connected: '已连接',
    disconnected: '已断开连接',
    loading: '加载中...',
    success: '成功',
    error: '错误'
  }
}

// 获取本地化字符串
export function t(key: string): string {
  const keys = key.split('.')
  let value = zhCNLocale as any
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key // 返回原始 key 作为备选
    }
  }
  
  return typeof value === 'string' ? value : key
}
