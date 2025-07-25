# @aerial-engine/types

用于多个 `app` 公用的工具类型，继承了 `@aerial-engine-core/typings` 的所有能力。业务上有通用的类型定义可以放在这里。

## 用法

### 添加依赖

```bash
# 进入目标应用目录，例如 aerial-engine-apps/xxxx-app
# cd aerial-engine-apps/xxxx-app
pnpm add @aerial-engine/types
```

### 使用

```ts
// 推荐加上 type
import type { SelectOption } from '@aerial-engine/types';
```
