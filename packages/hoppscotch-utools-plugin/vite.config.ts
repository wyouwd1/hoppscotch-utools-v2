import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import * as path from "path"

export default defineConfig({
  // uTools 插件使用相对路径
  base: "./",
  
  define: {
    // For 'util' polyfill required by dep of '@apidevtools/swagger-parser'
    "process.env": {},
    "process.platform": '"browser"',
    // uTools 环境标识
    "window.UTOOLS_ENV": true,
    "window.IS_UTOOLS_PLUGIN": true,
  },
  
  server: {
    port: 3333,
    host: "0.0.0.0"
  },
  
  preview: {
    port: 3333,
  },
  
  build: {
    // 禁用 sourcemap 以减小包大小
    sourcemap: false,
    emptyOutDir: true,
    // 输出到 dist 目录供 uTools 使用
    outDir: "dist",
    rollupOptions: {
      maxParallelFileOps: 2,
      output: {
        // 禁用文件名哈希以便 uTools 加载
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
  },
  
  worker: {
    format: "es",
  },
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@platform": path.resolve(__dirname, "./src/platform"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@components": path.resolve(__dirname, "./src/components"),
      stream: "stream-browserify",
      util: "util",
    },
    dedupe: ["vue"],
  },
  
  plugins: [
    Vue(),
  ],
  
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
})