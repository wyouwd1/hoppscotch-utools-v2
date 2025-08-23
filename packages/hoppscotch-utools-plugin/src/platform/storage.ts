import { SettingsPlatformDef } from "@hoppscotch/common/platform/settings"
import { CollectionsPlatformDef } from "@hoppscotch/common/platform/collections"
import { EnvironmentsPlatformDef } from "@hoppscotch/common/platform/environments"
import { HistoryPlatformDef } from "@hoppscotch/common/platform/history"

// uTools DB 工具函数
const utoolsDB = {
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

// 初始化参数
let isInitialized = false

// 初始化同步系统
function initUtoolsSync() {
  if (isInitialized) return
  
  console.log('初始化 uTools 数据同步系统...')
  
  // 设置默认语言为中文
  const locale = utoolsDB.get('hopp_settings_LOCALE')
  if (!locale) {
    utoolsDB.put({
      _id: 'hopp_settings_LOCALE',
      data: 'zh-CN',
      timestamp: Date.now()
    })
  }
  
  // 默认同意 Cookie
  const cookieConsent = utoolsDB.get('hopp_settings_cookieConsent')
  if (!cookieConsent) {
    utoolsDB.put({
      _id: 'hopp_settings_cookieConsent',
      data: 'accepted',
      timestamp: Date.now()
    })
  }
  
  isInitialized = true
  console.log('uTools 数据同步系统初始化完成')
}

// 设置存储适配器
export const settingsDef: SettingsPlatformDef = {
  initSettingsSync() {
    initUtoolsSync()
  }
}

// 集合存储适配器
export const collectionsDef: CollectionsPlatformDef = {
  initCollectionsSync() {
    console.log('初始化 uTools 集合数据同步...')
    // uTools 环境下不需要复杂的同步逻辑
  }
}

// 环境变量存储适配器
export const environmentsDef: EnvironmentsPlatformDef = {
  initEnvironmentsSync() {
    console.log('初始化 uTools 环境变量数据同步...')
    // uTools 环境下不需要复杂的同步逻辑
  }
}

// 历史记录存储适配器
export const historyDef: HistoryPlatformDef = {
  initHistorySync() {
    console.log('初始化 uTools 历史记录数据同步...')
    // uTools 环境下不需要复杂的同步逻辑
  }
}

// 通用存储工具函数（供其他模块使用）
export const utoolsStorage = {
  async get<T>(key: string): Promise<T | null> {
    const doc = utoolsDB.get(`hopp_${key}`)
    return doc?.data || null
  },
  
  async set<T>(key: string, value: T): Promise<void> {
    const existing = utoolsDB.get(`hopp_${key}`)
    utoolsDB.put({
      _id: `hopp_${key}`,
      data: value,
      _rev: existing?._rev,
      timestamp: Date.now()
    })
  },
  
  async remove(key: string): Promise<void> {
    const doc = utoolsDB.get(`hopp_${key}`)
    if (doc) {
      utoolsDB.remove(doc)
    }
  },
  
  async clear(prefix?: string): Promise<void> {
    const searchPrefix = prefix ? `hopp_${prefix}` : 'hopp_'
    const docs = utoolsDB.allDocs(searchPrefix)
    docs.forEach((doc: any) => {
      if (doc._id.startsWith(searchPrefix)) {
        utoolsDB.remove(doc)
      }
    })
  },
  
  async getAll(prefix?: string): Promise<Record<string, any>> {
    const searchPrefix = prefix ? `hopp_${prefix}` : 'hopp_'
    const docs = utoolsDB.allDocs(searchPrefix)
    const result: Record<string, any> = {}
    docs.forEach((doc: any) => {
      if (doc._id.startsWith(searchPrefix)) {
        const key = doc._id.replace(searchPrefix + '_', '')
        result[key] = doc.data
      }
    })
    return result
  }
}