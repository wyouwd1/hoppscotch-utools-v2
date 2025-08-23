// uTools Cookie 管理模块
// 在 uTools 环境中自动同意 Cookie 协议，简化用户体验

// Cookie 同意状态接口
export interface CookieConsentStatus {
  necessary: boolean      // 必要Cookie（始终为true）
  analytics: boolean      // 分析Cookie（uTools环境为false）
  marketing: boolean      // 营销Cookie（uTools环境为false）
  preferences: boolean    // 偏好Cookie（uTools环境为true）
  timestamp: number       // 同意时间戳
  version: string         // 协议版本
  source: 'user' | 'auto' // 同意来源
}

// uTools 环境的默认同意配置
const DEFAULT_CONSENT: CookieConsentStatus = {
  necessary: true,     // ✅ 必要Cookie - 应用运行必需
  analytics: false,    // ❌ 分析Cookie - uTools环境无需数据分析
  marketing: false,    // ❌ 营销Cookie - uTools环境无营销需求
  preferences: true,   // ✅ 偏好Cookie - 保存用户设置
  timestamp: Date.now(),
  version: '1.0.0',
  source: 'auto'       // 自动同意
}

// Cookie 同意管理器
export class UtoolsCookieManager {
  private consentStatus: CookieConsentStatus | null = null
  private readonly STORAGE_KEY = 'hopp_cookie_consent'
  
  constructor() {
    this.loadConsentStatus()
  }
  
  // 加载Cookie同意状态
  private loadConsentStatus(): void {
    try {
      // 首先尝试从 uTools DB 加载
      if ((window as any).utools?.db?.get) {
        const doc = (window as any).utools.db.get(this.STORAGE_KEY)
        if (doc && doc.data) {
          this.consentStatus = doc.data
          console.log('已从 uTools DB 加载 Cookie 同意状态:', this.consentStatus)
          return
        }
      }
      
      // 备选：从 localStorage 加载
      const stored = localStorage.getItem(this.STORAGE_KEY)\n      if (stored) {\n        this.consentStatus = JSON.parse(stored)\n        console.log('已从 localStorage 加载 Cookie 同意状态:', this.consentStatus)\n        return\n      }\n      \n      // 如果没有存储的状态，在 uTools 环境中自动同意\n      if ((window as any).utools || (window as any).UTOOLS_ENV) {\n        this.setAutoConsent()\n      }\n    } catch (error) {\n      console.warn('加载 Cookie 同意状态失败:', error)\n      // 发生错误时也自动同意（确保应用正常运行）\n      if ((window as any).utools || (window as any).UTOOLS_ENV) {\n        this.setAutoConsent()\n      }\n    }\n  }\n  \n  // 设置自动同意\n  private setAutoConsent(): void {\n    this.consentStatus = {\n      ...DEFAULT_CONSENT,\n      timestamp: Date.now()\n    }\n    \n    this.saveConsentStatus()\n    \n    console.log('✅ uTools 环境已自动同意 Cookie 协议:', this.consentStatus)\n    \n    // 触发同意事件\n    this.dispatchConsentEvent('auto-accept')\n  }\n  \n  // 保存同意状态\n  private saveConsentStatus(): void {\n    if (!this.consentStatus) return\n    \n    try {\n      // 优先保存到 uTools DB\n      if ((window as any).utools?.db?.put) {\n        (window as any).utools.db.put({\n          _id: this.STORAGE_KEY,\n          data: this.consentStatus,\n          timestamp: Date.now()\n        })\n      }\n      \n      // 同时保存到 localStorage 作为备份\n      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.consentStatus))\n      \n    } catch (error) {\n      console.warn('保存 Cookie 同意状态失败:', error)\n    }\n  }\n  \n  // 触发同意事件\n  private dispatchConsentEvent(action: string): void {\n    try {\n      const event = new CustomEvent('cookieConsentChanged', {\n        detail: {\n          action,\n          status: this.consentStatus,\n          timestamp: Date.now()\n        }\n      })\n      window.dispatchEvent(event)\n    } catch (error) {\n      console.warn('触发 Cookie 同意事件失败:', error)\n    }\n  }\n  \n  // 获取当前同意状态\n  public getConsentStatus(): CookieConsentStatus | null {\n    return this.consentStatus\n  }\n  \n  // 检查是否已同意指定类型的Cookie\n  public hasConsent(type: keyof CookieConsentStatus): boolean {\n    if (!this.consentStatus) return false\n    if (type === 'timestamp' || type === 'version' || type === 'source') return true\n    return Boolean(this.consentStatus[type])\n  }\n  \n  // 检查是否已完成Cookie同意流程\n  public isConsentComplete(): boolean {\n    return this.consentStatus !== null\n  }\n  \n  // 手动设置同意状态（用于设置页面）\n  public setConsent(consent: Partial<CookieConsentStatus>): void {\n    this.consentStatus = {\n      ...DEFAULT_CONSENT,\n      ...consent,\n      timestamp: Date.now(),\n      source: 'user'\n    }\n    \n    this.saveConsentStatus()\n    this.dispatchConsentEvent('user-update')\n    \n    console.log('用户更新 Cookie 同意状态:', this.consentStatus)\n  }\n  \n  // 重置同意状态\n  public resetConsent(): void {\n    this.consentStatus = null\n    \n    try {\n      // 清除 uTools DB\n      if ((window as any).utools?.db?.remove) {\n        const doc = (window as any).utools.db.get(this.STORAGE_KEY)\n        if (doc) {\n          (window as any).utools.db.remove(doc)\n        }\n      }\n      \n      // 清除 localStorage\n      localStorage.removeItem(this.STORAGE_KEY)\n      \n    } catch (error) {\n      console.warn('清除 Cookie 同意状态失败:', error)\n    }\n    \n    this.dispatchConsentEvent('reset')\n    console.log('已重置 Cookie 同意状态')\n  }\n  \n  // 获取同意摘要（用于调试和显示）\n  public getConsentSummary(): string {\n    if (!this.consentStatus) return '未设置 Cookie 同意状态'\n    \n    const summary = [\n      `必要Cookie: ${this.consentStatus.necessary ? '✅' : '❌'}`,\n      `偏好Cookie: ${this.consentStatus.preferences ? '✅' : '❌'}`,\n      `分析Cookie: ${this.consentStatus.analytics ? '✅' : '❌'}`,\n      `营销Cookie: ${this.consentStatus.marketing ? '✅' : '❌'}`,\n      `同意时间: ${new Date(this.consentStatus.timestamp).toLocaleString()}`,\n      `同意方式: ${this.consentStatus.source === 'auto' ? '自动同意' : '用户同意'}`\n    ]\n    \n    return summary.join('\\n')\n  }\n}\n\n// 全局Cookie管理器实例\nexport const cookieManager = new UtoolsCookieManager()\n\n// 便捷函数\nexport function hasNecessaryCookies(): boolean {\n  return cookieManager.hasConsent('necessary')\n}\n\nexport function hasAnalyticsCookies(): boolean {\n  return cookieManager.hasConsent('analytics')\n}\n\nexport function hasPreferencesCookies(): boolean {\n  return cookieManager.hasConsent('preferences')\n}\n\nexport function isConsentComplete(): boolean {\n  return cookieManager.isConsentComplete()\n}\n\n// 初始化Cookie管理（在uTools环境中自动调用）\nexport function initCookieConsent(): void {\n  if ((window as any).utools || (window as any).UTOOLS_ENV) {\n    console.log('🍪 初始化 uTools Cookie 管理...')\n    \n    // 确保已完成同意流程\n    if (!cookieManager.isConsentComplete()) {\n      console.log('🍪 检测到 uTools 环境，自动同意 Cookie 协议')\n    } else {\n      console.log('🍪 Cookie 同意状态已存在:', cookieManager.getConsentSummary())\n    }\n    \n    // 设置全局变量供其他模块使用\n    ;(window as any).__HOPP_COOKIE_CONSENT__ = {\n      hasConsent: cookieManager.hasConsent.bind(cookieManager),\n      isComplete: cookieManager.isConsentComplete.bind(cookieManager),\n      getStatus: cookieManager.getConsentStatus.bind(cookieManager)\n    }\n  }\n}\n\n// 自动初始化\nif (typeof window !== 'undefined') {\n  // 延迟初始化，确保 uTools API 可用\n  setTimeout(() => {\n    initCookieConsent()\n  }, 50)\n}