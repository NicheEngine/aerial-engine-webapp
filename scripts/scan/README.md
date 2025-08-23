# @aerial-engine/scan

一个 Shell 脚本工具集合，用于 aerial-engine 项目的开发和管理。

## 功能特性

- 🚀 基于 Node.js 的现代化 Shell 工具
- 📦 支持模块化开发和按需加载
- 🔍 提供依赖检查和分析功能
- 🔄 支持循环依赖扫描
- 📝 提供包发布检查功能

## 安装

```bash
# 使用 pnpm 安装
pnpm add -D @aerial-engine/scan

# 或者使用 npm
npm install -D @aerial-engine/scan

# 或者使用 yarn
yarn add -D @aerial-engine/scan
```

## 使用方法

### 全局安装

```bash
# 全局安装
pnpm add -g @aerial-engine/scan

# 使用 scan 命令
scan [command]
```

### 本地使用

```bash
# 在 package.json 中添加脚本
{
  "scripts": {
    "scan": "scan"
  }
}

# 运行命令
pnpm scan [command]
```

## 命令列表

- `scan check-deps`: 检查项目依赖
- `scan scan-circular`: 扫描循环依赖
- `scan publish-check`: 检查包发布配置
