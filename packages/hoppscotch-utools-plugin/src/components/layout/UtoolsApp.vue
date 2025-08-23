<template>
  <div class=\"utools-hoppscotch-app\">
    <!-- 简化的导航栏 -->
    <nav class=\"app-navigation\" v-if=\"showNavigation\">
      <div class=\"nav-tabs\">
        <router-link 
          v-for=\"tab in navigationTabs\" 
          :key=\"tab.path\"
          :to=\"tab.path\"
          class=\"nav-tab\"
          :class=\"{ active: $route.path === tab.path }\"
        >
          <Icon :icon=\"tab.icon\" class=\"tab-icon\" />
          <span class=\"tab-label\">{{ tab.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class=\"app-content\">
      <router-view />
    </main>

    <!-- 简化的底部状态栏 -->
    <footer class=\"app-footer\" v-if=\"showFooter\">
      <div class=\"footer-left\">
        <span class=\"app-version\">v{{ appVersion }}</span>
        <span class=\"utools-badge\">uTools 插件</span>
      </div>
      
      <div class=\"footer-right\">
        <button 
          v-if=\"isUtoolsEnv\" 
          @click=\"openSettings\" 
          class=\"footer-btn\"
          title=\"设置\"
        >
          <Icon icon=\"settings\" />
        </button>
        
        <button 
          v-if=\"isUtoolsEnv\"
          @click=\"clearData\"
          class=\"footer-btn\"
          title=\"清空数据\"
        >
          <Icon icon=\"trash\" />
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup lang=\"ts\">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Icon from '@components/Icon.vue'
import { utoolsAPI } from '@utils/utools-api'
import { getConfig } from '@config/features'

// 响应式数据
const route = useRoute()
const showNavigation = ref(getConfig('ui.showNavigation', true))
const showFooter = ref(getConfig('ui.showFooter', true))
const appVersion = ref('2025.1.0')
const isUtoolsEnv = computed(() => utoolsAPI.isUtoolsEnv())

// 导航标签页配置
const navigationTabs = computed(() => {
  const tabs = [
    {
      path: '/rest',
      icon: 'http',
      label: 'REST'
    },
    {
      path: '/realtime',
      icon: 'websocket',
      label: 'WebSocket'
    },
    {
      path: '/environments',
      icon: 'environment',
      label: '环境'
    },
    {
      path: '/collections',
      icon: 'folder',
      label: '集合'
    },
    {
      path: '/history',
      icon: 'history',
      label: '历史'
    },
    {
      path: '/settings',
      icon: 'settings',
      label: '设置'
    }
  ]
  
  // 根据功能配置过滤标签页
  return tabs.filter(tab => {
    switch (tab.path) {
      case '/realtime':
        return getConfig('features.websocket', true)
      case '/graphql':
        return getConfig('features.graphql', false)
      default:
        return true
    }
  })
})

// 方法
function openSettings() {
  // 跳转到设置页面
  if (route.path !== '/settings') {
    window.location.hash = '#/settings'
  }
}

function clearData() {
  if (confirm('确定要清空所有数据吗？此操作不可恢复。')) {
    try {
      // 清空 uTools 数据库中的所有 Hoppscotch 数据
      const docs = utoolsAPI.db.allDocs('hopp_')
      docs.forEach((doc: any) => {
        if (doc._id.startsWith('hopp_')) {
          utoolsAPI.db.remove(doc)
        }
      })
      
      utoolsAPI.showNotification('数据已清空')
      
      // 刷新页面
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('清空数据失败:', error)
      utoolsAPI.showNotification('清空数据失败')
    }
  }
}
</script>

<style scoped>
.utools-hoppscotch-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--primary-color);
  color: var(--primary-text-color);
}

/* 导航栏样式 */
.app-navigation {
  flex-shrink: 0;
  background: var(--secondary-color);
  border-bottom: 1px solid var(--divider-color);
  padding: 0;
}

.nav-tabs {
  display: flex;
  align-items: center;
  height: 48px;
  overflow-x: auto;
  overflow-y: hidden;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  text-decoration: none;
  color: var(--secondary-text-color);
  background: transparent;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.nav-tab:hover {
  background: var(--secondary-dark-color);
  color: var(--primary-text-color);
}

.nav-tab.active {
  color: var(--accent-color);
  border-bottom-color: var(--accent-color);
  background: var(--primary-color);
}

.tab-icon {
  width: 16px;
  height: 16px;
}

.tab-label {
  font-size: 13px;
  font-weight: 500;
}

/* 主要内容区域 */
.app-content {
  flex: 1;
  overflow: auto;
  position: relative;
}

/* 底部状态栏 */
.app-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 12px;
  background: var(--secondary-color);
  border-top: 1px solid var(--divider-color);
  font-size: 12px;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-version {
  color: var(--secondary-text-color);
  font-variant-numeric: tabular-nums;
}

.utools-badge {
  background: var(--accent-color);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: var(--secondary-text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.footer-btn:hover {
  background: var(--secondary-dark-color);
  color: var(--primary-text-color);
}

/* 滚动条样式 */
.nav-tabs::-webkit-scrollbar {
  height: 2px;
}

.nav-tabs::-webkit-scrollbar-track {
  background: transparent;
}

.nav-tabs::-webkit-scrollbar-thumb {
  background: var(--divider-color);
  border-radius: 1px;
}

.nav-tabs::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-text-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tab-label {
    display: none;
  }
  
  .nav-tab {
    padding: 8px 12px;
  }
}

/* uTools 环境特定样式 */
@media (max-width: 1200px) {
  .nav-tab {
    padding: 8px 12px;
  }
  
  .tab-label {
    font-size: 12px;
  }
}
</style>