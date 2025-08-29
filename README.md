# Template Engine Webapp

## 简介

Template Engine 是基于 Vue Engine webapp 改造的中后台前端。它采用了最新的 Vue 3、Vite、TypeScript 等主流技术开发，开箱即用，可用于中后台前端开发，也适合学习参考。

## 特性

- **最新技术栈**：使用 Vue3/vite 等前端前沿技术开发
- **TypeScript**：应用程序级 JavaScript 的语言
- **主题**：提供多套主题色彩，可配置自定义主题
- **国际化**：内置完善的国际化方案
- **权限**：内置完善的动态路由权限生成方案

## 预览

测试账号：engine/123456

### 使用 Gitpod

在 Gitpod（适用于 GitHub 的免费在线开发环境）中打开项目，并立即开始编码。

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/nicheengine/aerial-engine-webapp)

## 文档

## 安装使用

1. 获取项目代码

```bash
git clone https://github.com/nicheengine/aerial-engine-webapp.git
```

2. 安装依赖

```bash
cd aerial-engine-webapp
npm i -g corepack
pnpm install
```

3. 运行

```bash
pnpm dev
```

4. 打包

```bash
pnpm build
```

## 更新日志

[CHANGELOG](https://github.com/nicheengine/aerial-engine-webapp/releases)

## 如何贡献

非常欢迎你的加入！[提一个 Issue](https://github.com/nicheengine/aerial-engine-webapp/issues/new/choose) 或者提交一个 Pull Request。

**Pull Request 流程：**

1. Fork 代码
2. 创建自己的分支：`git checkout -b feature/xxxx`
3. 提交你的修改：`git commit -am 'feat(function): add xxxxx'`
4. 推送您的分支：`git push origin feature/xxxx`
5. 提交 `pull request`

## Git 贡献提交规范

参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

- `feat` 增加新功能
- `fix` 修复问题/BUG
- `style` 代码风格相关无影响运行结果的
- `perf` 优化/性能提升
- `refactor` 重构
- `revert` 撤销修改
- `test` 测试相关
- `docs` 文档/注释
- `chore` 依赖更新/脚手架配置修改等
- `ci` 持续集成
- `types` 类型定义文件更改

## 浏览器支持

本地开发推荐使用 `Chrome 80+` 浏览器

支持现代浏览器，不支持 IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: |
| last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 许可证

[MIT © Engine-2020](./LICENSE)
