// uTools API 工具函数

// 初始化 uTools 工具函数
export function initUtoolsUtils(): void {
  console.log('初始化 uTools 工具函数...')
  
  // 检查 uTools 环境
  if (!(window as any).utools) {
    console.warn('当前不在 uTools 环境中')
    return
  }
  
  // 设置 uTools 相关的全局变量
  ;(window as any).UTOOLS_ENV = true
  
  console.log('uTools 工具函数初始化完成')
}

// uTools 数据库操作封装
export const utoolsDB = {
  get: (key: string) => {
    try {
      return (window as any).utools?.db?.get?.(key) || null
    } catch (error) {
      console.warn('uTools DB get error:', error)
      return null
    }
  },
  
  put: (doc: any) => {
    try {
      return (window as any).utools?.db?.put?.(doc) || { ok: false }
    } catch (error) {
      console.warn('uTools DB put error:', error)
      return { ok: false, error }
    }
  },
  
  remove: (doc: any) => {
    try {
      return (window as any).utools?.db?.remove?.(doc) || { ok: false }
    } catch (error) {
      console.warn('uTools DB remove error:', error)
      return { ok: false, error }
    }
  },
  
  allDocs: (prefix: string) => {
    try {
      return (window as any).utools?.db?.allDocs?.(prefix) || []
    } catch (error) {
      console.warn('uTools DB allDocs error:', error)
      return []
    }
  }
}

// uTools 通知功能
export function showUtoolsNotification(message: string): void {
  try {
    if ((window as any).utools?.showNotification) {
      (window as any).utools.showNotification(message)
    } else {
      console.log('uTools 通知:', message)
    }
  } catch (error) {
    console.warn('显示 uTools 通知失败:', error)
  }
}

// uTools 用户信息
export function getUtoolsUser(): any {
  try {
    return (window as any).utools?.getUser?.() || { nickname: 'uTools 用户' }
  } catch (error) {
    console.warn('获取 uTools 用户信息失败:', error)
    return { nickname: 'uTools 用户' }
  }
}

// uTools 外部链接处理
export function openExternalUrl(url: string): void {
  try {
    if ((window as any).utools?.shellOpenExternal) {
      (window as any).utools.shellOpenExternal(url)
    } else if (window.open) {
      window.open(url, '_blank')
    } else {
      console.log('打开链接:', url)
    }
  } catch (error) {
    console.warn('打开外部链接失败:', error)
  }
}

// uTools 文件操作
export function selectFile(options?: any): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      if ((window as any).utools?.showOpenDialog) {
        const result = (window as any).utools.showOpenDialog({
          properties: ['openFile'],
          filters: [{ name: 'All Files', extensions: ['*'] }],
          ...options
        })
        resolve(result?.[0] || null)
      } else {
        resolve(null)
      }
    } catch (error) {
      console.warn('选择文件失败:', error)
      resolve(null)
    }
  })
}

// uTools 环境检测
export function isUtoolsEnvironment(): boolean {
  return !!(window as any).utools || !!(window as any).UTOOLS_ENV
}

// localStorage 兼容适配
export function initLocalStorageAdapter(): void {
  if (!isUtoolsEnvironment()) return
  
  // 如果需要，可以在这里重写 localStorage 来使用 uTools DB
  const originalLocalStorage = window.localStorage
  
  // 可以选择性地替换 localStorage 实现
  // 这里保持原始实现，让上层代码决定使用哪种存储
}
