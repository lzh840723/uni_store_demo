# UniStore Demo

UniStore 是一个使用 **Next.js App Router** + **Node.js (Express + Prisma)** 构建的多入口演示项目，覆盖 Storefront、Admin、CMS 三个入口及 Feature Flag、角色切换、模拟电商流程等场景。项目以 pnpm monorepo 组织，支持可选的 Unleash 与 Keystone 集成。

## 项目结构

```text
apps/
  web/                # Next.js 前端 (App Router)
    app/(store)       # Storefront 流程
    app/(admin)       # 管理后台页面
    app/(cms)         # CMS 前台
    components/       # Navbar / RoleSwitcher / Charts 等 UI
    lib/              # API SDK、flag helper、zustand store
  backend/
    node-api/         # Express + Prisma 后端，REST API
infra/
  docker-compose.yml  # Postgres / Redis / Unleash / Node API 容器编排
scripts/
  seed.node.ts        # 演示数据播种脚本
```

## 快速开始

1. 安装依赖
   ```bash
   pnpm i
   ```
2. 启动基础设施（Postgres / Redis / Unleash / Node API 容器）
   ```bash
   docker compose -f infra/docker-compose.yml up -d
   ```
3. 创建并填充环境变量
   ```bash
   cp .env.example .env.local
   cp apps/backend/node-api/.env.example apps/backend/node-api/.env
   ```
4. 同步数据库并播种数据
   ```bash
   pnpm --filter ./apps/backend/node-api prisma:migrate
   pnpm --filter ./apps/backend/node-api prisma:generate
   pnpm run seed:node
   ```
5. 启动服务
   ```bash
   pnpm --filter ./apps/backend/node-api dev   # Node API (http://localhost:9101)
   pnpm --filter ./apps/web dev                # Next.js (http://localhost:3000)
   ```

## 核心特性

- **Storefront 流程**：商品列表 → 详情 → 加入购物车 → Checkout → 订单确认（模拟支付）。
- **Admin 后台**：商品 / 订单 / 用户 / CMS CRUD + 近 7 日订单 & GMV 图表（Recharts）。
- **CMS 模块**：文章列表与详情，后台支持发布 / 编辑 / 删除。
- **Auth & Role Switcher**：通过前端按钮快速切换 Admin / Customer（Cookie 持久化，middleware 守卫 /admin 路由）。
- **Feature Flags**：优先读取 Unleash，未启用时回落到本地 env；FlagToggle 会写入 cookie + localStorage，影响导航和服务端守卫。
- **演示降级**：若 Node API 不可用，前台将自动回退到 `lib/mock` 假数据；写操作仍需真实 API。

## 常用命令

```bash
pnpm i                               # 安装 monorepo 依赖
pnpm --filter ./apps/web dev         # 启动 Next.js 开发服务
pnpm --filter ./apps/backend/node-api dev  # 启动 Node API
pnpm run seed:node                   # 播种演示数据
pnpm --filter ./apps/web build       # 生产构建
```

## 环境变量

`.env.example` 提供最小集合；重要键：
- `API_BASE_URL` / `NEXT_PUBLIC_API_URL`：Node API 地址（默认为 `http://localhost:9101`）。
- `DATABASE_URL`：PostgreSQL 连接串。
- `FLAG_COMMERCE` / `FLAG_CMS` / `FLAG_ANALYTICS`：本地 Feature Flag 默认值。
- `UNLEASH_*`：可选的 Unleash 服务端配置。

## 测试与后续计划

- TODO：补充 Vitest 单元测试、Playwright E2E（覆盖 Storefront、Admin、CMS核心路径）。
- TODO：扩展 `lib/mock` 以支持 Node API 不可用时的完全前端演示模式。

欢迎根据 PRD 继续扩展后端模块、Keystone 集成以及更多自动化测试。
