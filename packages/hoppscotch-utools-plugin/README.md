# Hoppscotch uTools Plugin

基于 [Hoppscotch](https://hoppscotch.io/) 的 uTools 插件版本，提供强大的 API 测试功能。

## 功能特性

### ✅ 支持的功能
- **HTTP 请求测试** - 支持所有 HTTP 方法 (GET, POST, PUT, DELETE, PATCH 等)
- **WebSocket 连接** - 实时 WebSocket 通信测试
- **MQTT 协议** - MQTT 消息队列测试
- **Server-Sent Events** - SSE 事件流测试
- **环境变量管理** - 多环境配置和切换
- **集合管理** - API 请求分组和组织
- **历史记录** - 请求历史查看和搜索
- **代码生成** - 生成多种语言的代码片段
- **导入导出** - 支持 Postman、Insomnia 等格式

### ❌ 不支持的功能
- **团队协作** - 移除多用户和团队功能
- **云端同步** - 使用 uTools 的本地数据库
- **OAuth 登录** - 使用本地用户模式
- **PWA 功能** - 移除 Service Worker 和离线缓存
- **GraphQL** - 默认禁用（可配置启用）

## 安装使用

### 方式一：从 uTools 插件市场安装
1. 打开 uTools
2. 输入 "插件市场" 或按 `Tab` 键
3. 搜索 "Hoppscotch" 或 "API测试"
4. 点击安装

### 方式二：手动安装
1. 下载插件文件 (.upx)
2. 打开 uTools 设置
3. 选择 "插件管理" -> "安装本地插件"
4. 选择下载的插件文件

## 开发构建

### 环境要求
- Node.js >= 16
- pnpm
- uTools 开发环境

### 安装依赖
```bash
cd packages/hoppscotch-utools-plugin
pnpm install
```

### 开发模式
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

### 在 uTools 中调试
1. 打开 uTools 设置
2. 选择 "插件管理" -> "开发者模式"
3. 添加插件目录: `packages/hoppscotch-utools-plugin`

## 使用说明

### 快速开始
1. 在 uTools 中输入 `api` 或 `接口测试`
2. 选择 Hoppscotch 插件
3. 开始使用 API 测试功能

### 关键功能
- **请求构建**: 设置 URL、方法、头部、参数和请求体
- **环境管理**: 创建和切换不同的环境配置
- **集合组织**: 将相关的 API 请求组织成集合
- **历史查看**: 查看和重复之前的请求

### 数据存储
- 所有数据存储在 uTools 本地数据库中
- 支持 uTools 的数据同步功能
- 数据隐私完全受保护

## 配置选项

### 功能开关
可以在 `src/config/features.ts` 中调整功能开关：

```typescript
export const utoolsConfig = {
  features: {
    graphql: false,        // GraphQL 支持
    teamCollaboration: false,  // 团队协作
    cloudSync: false,          // 云同步
    // ... 更多配置
  }
}
```

### 界面配置
```typescript
ui: {
  showHeader: false,     // 隐藏顶部导航
  defaultLocale: 'zh-CN', // 默认中文
  defaultTheme: 'system', // 跟随系统主题
}
```

## 技术架构

### 基础架构
- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite (禁用 sourcemap)
- **路由模式**: Hash 路由
- **存储方案**: uTools DB API

### 平台适配
- **认证系统**: 本地用户模式
- **存储系统**: uTools 数据库适配
- **网络请求**: 浏览器和代理拦截器
- **外部链接**: uTools 系统浏览器

### 文件结构
```
src/
├── main.ts              # 主入口文件
├── platform/            # 平台适配层
│   ├── auth.ts          # 认证适配
│   └── storage.ts       # 存储适配
├── config/              # 配置文件
│   └── features.ts      # 功能配置
├── utils/               # 工具函数
│   └── utools-api.ts    # uTools API 封装
└── components/          # 自定义组件
```

## 更新日志

### v2025.1.0
- ✨ 首次发布 uTools 插件版本
- ✅ 完整支持 HTTP/WebSocket/MQTT 协议
- ✅ 本地化数据存储和中文界面
- ✅ 优化 uTools 环境下的用户体验
- ❌ 移除团队协作和云端功能

## 贡献指南

欢迎提交 Issues 和 Pull Requests！

### 开发流程
1. Fork 本项目
2. 创建功能分支
3. 提交代码变更
4. 创建 Pull Request

### 报告问题
请在 GitHub Issues 中报告 bug 或功能请求。

## 许可证

MIT License - 详见 [LICENSE](../../LICENSE) 文件

## 相关链接

- [Hoppscotch 官网](https://hoppscotch.io/)
- [uTools 官网](https://u-tools.cn/)
- [项目 GitHub](https://github.com/your-username/hoppscotch-utools-v2)
- [参考项目](https://github.com/baiy/hoppscotch-utools)