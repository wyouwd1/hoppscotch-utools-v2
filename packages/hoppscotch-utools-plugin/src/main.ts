// uTools Hoppscotch 插件主入口
// 简化版本，用于测试基础构建

import { createApp } from 'vue'
import { utoolsConfig } from './config/features.js'
import { initUtoolsLocale } from './config/locale.js'
import { cookieManager } from './utils/cookie-consent.js'

// 创建简单的 Vue 应用
const app = createApp({
  template: `
    <div id="app" class="utools-hoppscotch-app">
      <h1>🚀 Hoppscotch uTools 插件</h1>
      <p>正在初始化...</p>
      <div class="status">
        <p>uTools 环境: {{ isUtoolsEnv ? '✅ 已检测' : '❌ 未检测' }}</p>
        <p>Cookie 同意: {{ cookieStatus ? '✅ 已同意' : '❌ 未同意' }}</p>
        <p>默认语言: {{ locale }}</p>
      </div>
      <div class="actions">
        <button @click="testStorage">测试存储</button>
        <button @click="testFeatures">测试功能</button>
      </div>
      <div class="logs" v-if="logs.length > 0">
        <h3>日志:</h3>
        <ul>
          <li v-for="log in logs" :key="log.id">{{ log.message }}</li>
        </ul>
      </div>
    </div>
  `,
  
  data() {
    return {
      isUtoolsEnv: !!(window as any).utools || !!(window as any).UTOOLS_ENV,
      cookieStatus: false,
      locale: 'zh-CN',
      logs: [] as Array<{ id: number, message: string }>
    }
  },
  
  mounted() {
    this.initialize()
  },
  
  methods: {
    addLog(message: string) {
      this.logs.push({
        id: Date.now(),
        message: `${new Date().toLocaleTimeString()}: ${message}`
      })
    },
    
    async initialize() {
      this.addLog('开始初始化 uTools Hoppscotch 插件...')
      
      try {
        // 初始化本地化
        initUtoolsLocale()
        this.addLog('本地化初始化完成')
        
        // 检查 Cookie 同意状态
        this.cookieStatus = cookieManager.isConsentComplete()
        this.addLog(`Cookie 同意状态: ${this.cookieStatus ? '已同意' : '未同意'}`)
        
        // 加载配置
        const config = utoolsConfig
        this.addLog(`配置加载完成: ${config.meta.pluginName} v${config.meta.version}`)
        
        this.addLog('✅ 插件初始化成功!')
        
      } catch (error) {
        this.addLog(`❌ 初始化失败: ${error.message}`)
      }
    },
    
    async testStorage() {
      this.addLog('正在测试存储功能...')
      
      try {
        if ((window as any).utools?.db) {
          // 测试 uTools DB
          const testData = { test: true, timestamp: Date.now() }
          const result = (window as any).utools.db.put({
            _id: 'test_storage',
            data: testData
          })
          
          if (result.ok) {
            this.addLog('✅ uTools DB 存储测试成功')
          } else {
            this.addLog('❌ uTools DB 存储测试失败')
          }
        } else {
          // 测试 localStorage
          localStorage.setItem('test_storage', JSON.stringify({ test: true, timestamp: Date.now() }))
          this.addLog('✅ localStorage 存储测试成功')
        }
      } catch (error) {
        this.addLog(`❌ 存储测试失败: ${error.message}`)
      }
    },
    
    testFeatures() {
      this.addLog('正在测试功能配置...')
      
      try {
        const config = utoolsConfig
        const enabledFeatures = Object.entries(config.features)
          .filter(([_, enabled]) => enabled)
          .map(([name, _]) => name)
        
        this.addLog(`✅ 已启用功能: ${enabledFeatures.join(', ')}`)
        this.addLog(`✅ UI 配置: 语言=${config.ui.defaultLanguage}, 主题=${config.ui.theme}`)
        
      } catch (error) {
        this.addLog(`❌ 功能测试失败: ${error.message}`)
      }
    }
  }
})

// 挂载应用
app.mount('#app')

console.log('🚀 uTools Hoppscotch 插件已启动')

// 简化的 CSS 样式
const styles = `
  .utools-hoppscotch-app {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    line-height: 1.6;
  }
  
  .status p {
    margin: 8px 0;
    padding: 8px;
    border-radius: 4px;
    background: #f8f9fa;
  }
  
  .actions {
    margin: 20px 0;
  }
  
  .actions button {
    margin-right: 10px;
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .actions button:hover {
    background: #0056b3;
  }
  
  .logs {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 6px;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .logs ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .logs li {
    padding: 4px 0;
    border-bottom: 1px solid #e9ecef;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 13px;
  }
`

// 添加样式到页面
const styleElement = document.createElement('style')
styleElement.textContent = styles
document.head.appendChild(styleElement)