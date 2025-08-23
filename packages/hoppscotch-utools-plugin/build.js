#!/usr/bin/env node

/**
 * uTools 插件构建脚本
 * 用于构建和测试 Hoppscotch uTools 插件
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 颜色输出
const colors = {
  reset: '\\x1b[0m',
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[34m',
  cyan: '\\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset)
}

// 检查依赖
function checkDependencies() {
  log('检查依赖...', 'cyan')
  
  try {
    // 检查 node_modules
    const nodeModulesPath = path.resolve(__dirname, 'node_modules')
    if (!fs.existsSync(nodeModulesPath)) {
      log('⚠️  node_modules 不存在，请先运行 pnpm install', 'yellow')
      return false
    }
    
    // 检查关键依赖
    const criticalDeps = ['vue', 'vite', '@hoppscotch/common']
    for (const dep of criticalDeps) {
      const depPath = path.resolve(nodeModulesPath, dep)
      if (!fs.existsSync(depPath)) {
        log(`❌ 缺少关键依赖: ${dep}`, 'red')
        return false
      }
    }
    
    log('✅ 依赖检查通过', 'green')
    return true
  } catch (error) {
    log(`❌ 依赖检查失败: ${error.message}`, 'red')
    return false
  }
}

// 清理构建目录
function cleanBuild() {
  log('清理构建目录...', 'cyan')
  
  const distPath = path.resolve(__dirname, 'dist')
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true })
  }
  
  log('✅ 构建目录已清理', 'green')
}

// 复制静态文件
function copyStaticFiles() {
  log('复制静态文件...', 'cyan')
  
  try {
    const distPath = path.resolve(__dirname, 'dist')
    
    // 确保 dist 目录存在
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath, { recursive: true })
    }
    
    // 复制插件配置文件
    const filesToCopy = [
      'plugin.json',
      'preload.js',
      'icon.png',
      'README.md'
    ]
    
    for (const file of filesToCopy) {
      const srcPath = path.resolve(__dirname, file)
      const destPath = path.resolve(distPath, file)
      
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath)
        log(`✓ 复制 ${file}`, 'green')
      } else {
        log(`⚠️  文件不存在: ${file}`, 'yellow')
      }
    }
    
    log('✅ 静态文件复制完成', 'green')
    return true
  } catch (error) {
    log(`❌ 复制静态文件失败: ${error.message}`, 'red')
    return false
  }
}

// 构建项目
function buildProject() {
  log('开始构建项目...', 'cyan')
  
  try {
    // 运行 vite build
    execSync('npx vite build', { 
      stdio: 'inherit', 
      cwd: __dirname 
    })
    
    log('✅ 项目构建完成', 'green')
    return true
  } catch (error) {
    log(`❌ 构建失败: ${error.message}`, 'red')
    return false
  }
}

// 验证构建结果
function validateBuild() {
  log('验证构建结果...', 'cyan')
  
  try {
    const distPath = path.resolve(__dirname, 'dist')
    
    // 检查必要文件
    const requiredFiles = [
      'index.html',
      'plugin.json',
      'preload.js'
    ]
    
    for (const file of requiredFiles) {
      const filePath = path.resolve(distPath, file)
      if (!fs.existsSync(filePath)) {
        log(`❌ 缺少必要文件: ${file}`, 'red')
        return false
      }
    }
    
    // 检查 assets 目录
    const assetsPath = path.resolve(distPath, 'assets')
    if (!fs.existsSync(assetsPath)) {
      log('⚠️  assets 目录不存在', 'yellow')
    } else {
      const assets = fs.readdirSync(assetsPath)
      log(`✓ 发现 ${assets.length} 个资源文件`, 'green')
    }
    
    // 检查文件大小
    const stats = fs.statSync(distPath)
    const indexStats = fs.statSync(path.resolve(distPath, 'index.html'))
    
    log(`✓ index.html 大小: ${(indexStats.size / 1024).toFixed(2)} KB`, 'green')
    
    log('✅ 构建结果验证通过', 'green')
    return true
  } catch (error) {
    log(`❌ 构建验证失败: ${error.message}`, 'red')
    return false
  }
}

// 生成 uTools 插件包
function generatePluginPackage() {
  log('生成 uTools 插件包...', 'cyan')
  
  try {
    const distPath = path.resolve(__dirname, 'dist')
    const packagePath = path.resolve(__dirname, 'hoppscotch-utools.upx')
    
    // 这里应该使用 uTools 的打包工具，暂时只是提示
    log('📦 请使用 uTools 开发者工具打包 dist 目录', 'yellow')
    log(`📂 构建目录: ${distPath}`, 'blue')
    log('💡 打包步骤:', 'blue')
    log('   1. 打开 uTools', 'blue')
    log('   2. 进入设置 -> 插件管理 -> 开发者模式', 'blue')
    log('   3. 添加插件目录: ' + distPath, 'blue')
    log('   4. 或者手动打包为 .upx 文件', 'blue')
    
    return true
  } catch (error) {
    log(`❌ 插件包生成失败: ${error.message}`, 'red')
    return false
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2)
  const command = args[0] || 'build'
  
  log('🚀 Hoppscotch uTools 插件构建工具', 'cyan')
  log('================================', 'cyan')
  
  switch (command) {
    case 'build':
      if (
        checkDependencies() &&
        cleanBuild() &&
        copyStaticFiles() &&
        buildProject() &&
        validateBuild()
      ) {
        generatePluginPackage()
        log('\n🎉 构建完成！插件已准备就绪', 'green')
      } else {
        log('\n💥 构建失败！请检查上述错误', 'red')
        process.exit(1)
      }
      break
      
    case 'clean':
      cleanBuild()
      break
      
    case 'check':
      checkDependencies()
      break
      
    default:
      log('使用方法:', 'yellow')
      log('  node build.js [command]', 'yellow')
      log('', 'yellow')
      log('命令:', 'yellow')
      log('  build  - 构建插件 (默认)', 'yellow')
      log('  clean  - 清理构建目录', 'yellow')
      log('  check  - 检查依赖', 'yellow')
      break
  }
}

// 运行
main()