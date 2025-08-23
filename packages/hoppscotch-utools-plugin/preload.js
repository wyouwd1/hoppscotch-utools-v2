// uTools preload script for Hoppscotch plugin
// 为主进程提供 uTools API 访问能力

const { ipcRenderer } = require('electron')

// uTools API 封装
window.utools = {
  // 数据库操作
  db: {
    put: (doc) => {
      try {
        return utools.db.put(doc)
      } catch (error) {
        console.warn('uTools DB put error:', error)
        return { ok: false, error }
      }
    },
    
    get: (id) => {
      try {
        return utools.db.get(id)
      } catch (error) {
        console.warn('uTools DB get error:', error)
        return null
      }
    },
    
    remove: (doc) => {
      try {
        return utools.db.remove(doc)
      } catch (error) {
        console.warn('uTools DB remove error:', error)
        return { ok: false, error }
      }
    },
    
    allDocs: (prefix) => {
      try {
        const result = utools.db.allDocs(prefix)
        return result || []
      } catch (error) {
        console.warn('uTools DB allDocs error:', error)
        return []
      }
    }
  },

  // 用户信息
  getUser: () => {
    try {
      return utools.getUser() || { nickname: 'Local User' }
    } catch (error) {
      console.warn('uTools getUser error:', error)
      return { nickname: 'Local User' }
    }
  },

  // 通知
  showNotification: (message) => {
    try {
      return utools.showNotification(message)
    } catch (error) {
      console.warn('uTools showNotification error:', error)
    }
  },

  // 隐藏主窗口
  hideMainWindow: () => {
    try {
      return utools.hideMainWindow()
    } catch (error) {
      console.warn('uTools hideMainWindow error:', error)
    }
  },

  // 显示主窗口
  showMainWindow: () => {
    try {
      return utools.showMainWindow()
    } catch (error) {
      console.warn('uTools showMainWindow error:', error)
    }
  },

  // 获取剪贴板内容
  getCopyedText: () => {
    try {
      return utools.getCopyedText() || ''
    } catch (error) {
      console.warn('uTools getCopyedText error:', error)
      return ''
    }
  }
}

// 为 Vue 应用提供全局变量
window.UTOOLS_ENV = true
window.IS_UTOOLS_PLUGIN = true

// localStorage 适配器，将数据存储到 uTools DB
const originalLocalStorage = window.localStorage
window.localStorage = {
  getItem: (key) => {
    try {
      const doc = utools.db.get(`hopp_${key}`)
      return doc?.data ? JSON.stringify(doc.data) : null
    } catch (error) {
      console.warn('localStorage getItem error:', error)
      return originalLocalStorage.getItem(key)
    }
  },
  
  setItem: (key, value) => {
    try {
      let data = value
      try {
        data = JSON.parse(value)
      } catch {
        // 如果不是 JSON，直接存储字符串
      }
      
      const existing = utools.db.get(`hopp_${key}`)
      utools.db.put({
        _id: `hopp_${key}`,
        data: data,
        _rev: existing?._rev
      })
    } catch (error) {
      console.warn('localStorage setItem error:', error)
      originalLocalStorage.setItem(key, value)
    }
  },
  
  removeItem: (key) => {
    try {
      const doc = utools.db.get(`hopp_${key}`)
      if (doc) {
        utools.db.remove(doc)
      }
    } catch (error) {
      console.warn('localStorage removeItem error:', error)
      originalLocalStorage.removeItem(key)
    }
  },
  
  clear: () => {
    try {
      // 获取所有 hopp_ 前缀的文档并删除
      const docs = utools.db.allDocs('hopp_')
      docs.forEach(doc => {
        if (doc._id.startsWith('hopp_')) {
          utools.db.remove(doc)
        }
      })
    } catch (error) {
      console.warn('localStorage clear error:', error)
      originalLocalStorage.clear()
    }
  },
  
  get length() {
    try {
      const docs = utools.db.allDocs('hopp_')
      return docs.length
    } catch (error) {
      return originalLocalStorage.length
    }
  },
  
  key: (index) => {
    try {
      const docs = utools.db.allDocs('hopp_')
      const doc = docs[index]
      return doc?._id?.replace('hopp_', '') || null
    } catch (error) {
      return originalLocalStorage.key(index)
    }
  }
}

// sessionStorage 使用内存存储
window.sessionStorage = window.sessionStorage || {
  _data: {},
  getItem: function(key) { return this._data[key] || null },
  setItem: function(key, value) { this._data[key] = value },
  removeItem: function(key) { delete this._data[key] },
  clear: function() { this._data = {} },
  get length() { return Object.keys(this._data).length },
  key: function(index) { return Object.keys(this._data)[index] || null }
}

console.log('uTools preload script loaded successfully')