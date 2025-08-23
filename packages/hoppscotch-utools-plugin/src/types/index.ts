// 基础类型定义

// Vue相关基础类型
export interface Ref<T = any> {
  value: T
}

export function ref<T>(value: T): Ref<T> {
  return { value }
}

// RxJS基础类型替代
export class BehaviorSubject<T> {
  private _value: T
  
  constructor(initialValue: T) {
    this._value = initialValue
  }
  
  get value(): T {
    return this._value
  }
  
  next(value: T): void {
    this._value = value
  }
  
  subscribe(observer: (value: T) => void): { unsubscribe: () => void } {
    observer(this._value)
    return { unsubscribe: () => {} }
  }
  
  asObservable(): BehaviorSubject<T> {
    return this
  }
}

export class Subject<T> {
  next(value: T): void {
    // 基础实现
  }
  
  subscribe(observer: (value: T) => void): { unsubscribe: () => void } {
    return { unsubscribe: () => {} }
  }
  
  asObservable(): Subject<T> {
    return this
  }
}

// fp-ts Either类型替代
export namespace E {
  export interface Left<E> {
    _tag: 'Left'
    left: E
  }
  
  export interface Right<A> {
    _tag: 'Right'
    right: A
  }
  
  export type Either<E, A> = Left<E> | Right<A>
  
  export function left<E>(e: E): Left<E> {
    return { _tag: 'Left', left: e }
  }
  
  export function right<A>(a: A): Right<A> {
    return { _tag: 'Right', right: a }
  }
  
  export function isLeft<E, A>(ma: Either<E, A>): ma is Left<E> {
    return ma._tag === 'Left'
  }
  
  export function isRight<E, A>(ma: Either<E, A>): ma is Right<A> {
    return ma._tag === 'Right'
  }
}

// 平台相关类型定义
export interface HoppUser {
  uid: string
  displayName: string
  email: string | null
  photoURL: string | null
  provider?: string
  accessToken: string | undefined
  refreshToken: string | null
  idToken?: string | undefined
  emailVerified?: boolean
}

export interface AuthEvent {
  event: 'login' | 'logout' | 'token_refresh'
  user?: HoppUser
}

export interface AuthPlatformDef {
  getCurrentUserStream: () => BehaviorSubject<HoppUser | null>
  getAuthEventsStream: () => Subject<AuthEvent>
  getProbableUserStream?: () => BehaviorSubject<HoppUser | null>
  getCurrentUser?: () => HoppUser | null
  getProbableUser?: () => HoppUser | null
  performAuthInit?: () => Promise<void> | void
  waitProbablyLoggedInState?: () => Promise<void>
  signInUserWithGithub?: () => Promise<void>
  signInUserWithGoogle?: () => Promise<void>
  signInUserWithMicrosoft?: () => Promise<void>
  signInWithEmail?: (email: string, password: string) => Promise<void>
  signUpUserWithEmail?: (email: string, password: string) => Promise<void>
  signOutUser?: () => Promise<void>
  sendMagicLink?: (email: string) => Promise<void>
  probablyLoggedIn?: () => boolean
  getBackendHeaders?: () => Record<string, string>
  willBackendHaveAuthError?: () => boolean
  onBackendGQLClientShouldReconnect?: () => void
  getGQLClientOptions?: () => any
  axiosPlatformConfig?: () => any
  getDevOptsBackendIDToken?: () => string | null
  waitProbableLoginToConfirm?: () => Promise<void>
  isSignInWithEmailLink?: () => boolean
  signInWithEmailLink?: (email: string, link: string) => Promise<void>
  processMagicLink?: (url: string) => Promise<void>
  verifyEmailAddress?: () => Promise<void>
  setEmailAddress?: (email: string) => Promise<any>
  setDisplayName?: (name: string) => Promise<any>
  getAllowedAuthProviders?: () => Promise<any>
  isEmailEditable?: boolean
  axiosOAuthRedirectInterceptor?: (axios: any) => void
}

export interface SettingsPlatformDef {
  init?: () => void
  initSettingsSync?: () => void
}

export interface CollectionsPlatformDef {
  initCollectionsSync?: () => void
}

export interface EnvironmentsPlatformDef {
  initEnvironmentsSync?: () => void
}

export interface HistoryPlatformDef {
  initHistorySync?: () => void
}

// 模拟的 Hoppscotch 应用创建函数
export interface HoppAppConfig {
  ui?: any
  auth?: AuthPlatformDef
  kernelIO?: any
  instance?: any
  sync?: any
  kernelInterceptors?: any
  platformFeatureFlags?: any
  limits?: any
  backend?: any
  additionalLinks?: any[]
}

export function createHoppApp(selector: string, config: HoppAppConfig): Promise<any> {
  console.log('模拟创建 Hoppscotch 应用:', selector, config)
  // 这里是一个基础模拟，实际使用时需要真正的 @hoppscotch/common
  return Promise.resolve({
    mount: () => console.log('应用已挂载')
  })
}

// 模拟的后端定义
export const stdBackendDef = {
  name: 'utools-backend',
  init: () => console.log('后端初始化')
}

// 模拟的内核IO
export const kernelIO = {
  name: 'utools-kernel-io',
  init: () => console.log('内核IO初始化')
}

// 模拟的拦截器服务
export const ProxyKernelInterceptorService = {
  name: 'proxy-interceptor',
  type: 'proxy'
}

export const BrowserKernelInterceptorService = {
  name: 'browser-interceptor',
  type: 'browser'
}