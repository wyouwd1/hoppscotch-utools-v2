import { BehaviorSubject, Subject } from "rxjs"
import * as E from "fp-ts/Either"
import { AuthPlatformDef, AuthEvent, HoppUser } from "@hoppscotch/common/platform/auth"

// uTools 本地用户认证适配器
// 移除所有团队协作、云端认证、多用户功能，仅保留本地用户模式

// 本地用户流管理
const currentUser$ = new BehaviorSubject<HoppUser | null>(null)
const authEvents$ = new Subject<AuthEvent>()

// 创建 uTools 本地用户（单用户模式）
function createLocalUser(): HoppUser | null {
  try {
    const utoolsUser = (window as any).utools?.getUser?.() || { nickname: 'uTools 用户' }
    return {
      uid: 'local_user', // 固定的本地用户ID
      displayName: utoolsUser.nickname || 'uTools 用户',
      email: null, // uTools 环境无邮箱概念
      photoURL: null, // 无头像
      provider: 'utools-local', // 本地提供商
      accessToken: undefined, // 无访问令牌
      // refreshToken: null, // 无刷新令牌 (在真正的HoppUser中可能不存在)
      emailVerified: false // 无邮箱验证
    }
  } catch (error) {
    console.warn('创建本地用户失败:', error)
    // 返回默认本地用户
    return {
      uid: 'local_user',
      displayName: 'uTools 用户',
      email: null,
      photoURL: null,
      provider: 'utools-local',
      accessToken: undefined,
      // refreshToken: null,
      emailVerified: false
    }
  }
}

// 初始化本地用户认证
function initLocalAuth() {
  const user = createLocalUser()
  if (user) {
    currentUser$.next(user)
    authEvents$.next({ event: "login", user })
    console.log('uTools 本地用户认证初始化完成:', user.displayName)
  }
}

// uTools 认证适配器定义（精简版）
export const def: AuthPlatformDef = {
  // 核心用户流方法
  getCurrentUserStream: () => currentUser$,
  getAuthEventsStream: () => authEvents$,
  
  // 当前用户获取（总是返回本地用户）
  getCurrentUser: () => currentUser$.value,
  
  // 初始化认证（自动登录本地用户）
  async performAuthInit() {
    console.log('初始化 uTools 本地认证系统...')
    initLocalAuth()
  },
  
  // 后端集成（uTools 环境无后端）
  getBackendHeaders: () => ({}),
  willBackendHaveAuthError: () => false,
  onBackendGQLClientShouldReconnect: () => {},
  getGQLClientOptions: () => ({}),
  axiosPlatformConfig: () => ({}),
  getDevOptsBackendIDToken: () => null,
  
  // 等待确认（本地环境立即确认）
  async waitProbableLoginToConfirm() {
    return Promise.resolve()
  },
  
  // === 已移除的云端功能 ===
  // 所有 OAuth 登录方法都返回错误
  async signInWithEmail() {
    console.warn('uTools 插件不支持云端邮箱登录')
    throw new Error('uTools 插件仅支持本地用户模式，不支持云端登录')
  },
  
  isSignInWithEmailLink: () => false,
  
  async signInWithEmailLink() {
    throw new Error('uTools 插件不支持邮箱链接登录')
  },
  
  async processMagicLink() {
    throw new Error('uTools 插件不支持魔法链接登录')
  },
  
  async verifyEmailAddress() {
    throw new Error('uTools 插件不支持邮箱验证功能')
  },
  
  async signInUserWithGoogle() {
    throw new Error('uTools 插件不支持 Google 登录，仅支持本地用户模式')
  },
  
  async signInUserWithGithub() {
    throw new Error('uTools 插件不支持 GitHub 登录，仅支持本地用户模式')
  },
  
  async signInUserWithMicrosoft() {
    throw new Error('uTools 插件不支持 Microsoft 登录，仅支持本地用户模式')
  },
  
  // 登出（在本地模式下无操作）
  async signOutUser() {
    console.log('uTools 本地用户模式，无需登出操作')
    // 注意：不重置用户状态，保持本地用户持续登录
  },
  
  // 用户信息编辑（本地模式不支持）
  setEmailAddress(email: string) {
    throw new Error('uTools 本地模式不支持修改邮箱地址')
  },
  
  setDisplayName(name: string) {
    throw new Error('uTools 本地模式不支持修改显示名称，请在 uTools 设置中修改')
  },
  
  // 认证提供商（仅本地模式）
  async getAllowedAuthProviders() {
    return E.right(['UTOOLS_LOCAL']) // 仅支持 uTools 本地认证
  },
  
  // 邮箱不可编辑
  isEmailEditable: false
}

// 自动初始化（在 uTools 环境中）
if ((window as any).utools || (window as any).UTOOLS_ENV) {
  // 延迟初始化，确保 uTools API 可用
  setTimeout(() => {
    initLocalAuth()
  }, 100)
}