# @aerial-engine/hooks

用于多个 `app` 公用的 hook，继承了 `@aerial-engine/hooks` 的所有能力。业务上有通用 hooks 可以放在这里。

## 用法

### 添加依赖

```bash
# 进入目标应用目录，例如 aerial-engine-apps/xxxx-app
# cd aerial-engine-apps/xxxx-app
pnpm add @aerial-engine/hooks
```

### 使用

```ts
import { useNamespace } from '@aerial-engine/hooks';
```
