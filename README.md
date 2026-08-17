# Akasha

一个极简博客，只做博客，不做平台。

- **内容**：Sanity（Headless CMS，项目 dcflbleb / production）
- **前端**：Next.js（App Router，ISR 增量静态再生成）
- **部署**：Node 运行时（Vercel / Railway / Fly.io / VPS / Docker），需要 ISR 能力
- **评论**：Giscus（GitHub Discussions）

## 结构（解耦）

```
Akasha/
├── schemaTypes/     # Sanity Studio（仓库根目录即 Studio）
├── web/             # Next.js 前端（npm workspace）
│   ├── app/         # 路由：首页 / blog/:slug / category/:slug / about / api/revalidate
│   ├── components/  # 卡片 / 富文本渲染 / Giscus 评论
│   └── lib/         # Sanity client / GROQ 查询 / 类型
└── .mcp.json        # Sanity 官方 MCP（AI 工具可直接操作 Schema 与数据）
```

前端只通过 Sanity 公开 API（GROQ）读内容，不 import 任何 Studio 代码；两端只共享 projectId/dataset，完全解耦。

## 快速开始

```bash
# 1. 根目录一次装齐两个 workspace
npm install

# 2. 内容后台（http://localhost:3333），发布第一篇文章
npm run dev

# 3. 博客前端（http://localhost:3000）
npm run dev:web

# 4. 本地验证生产模式（ISR 需要 next start）
npm run build:web && npm run start:web
```

> 数据模型：post（文章，含分类与标签）/ category（分类）/ page（关于页等单页）/ siteSettings（头像与签名）。改结构在 schemaTypes/，改展示在 web/。

## 内容模型与关于页

- 关于页（/about）复用文章的富文本机制：在 Studio 新建 **Page** 文档，slug 填 about
- 首页个人卡片的头像与签名：新建 **Site Settings** 文档填写
- 分类：新建 **Category** 文档，写文章时关联分类、打标签

## 环境变量

```bash
cp web/.env.local.example web/.env.local
```

- Sanity 两项有默认值（本项目 ID），可不配。
- Giscus 四项配置好后才有评论，未配置时页面显示占位提示。
- REVALIDATE_SECRET：Sanity webhook 按需更新的密钥，配置后才能用 /api/revalidate。

## 配置 Giscus 评论

1. 仓库 Settings → General → Features：勾选 **Discussions**
2. 到 https://github.com/apps/giscus 把 App 安装到该仓库
3. 打开 https://giscus.app，填入仓库并选好分类，复制 **repo_id** 与 **category_id** 到 web/.env.local
4. 重新构建部署

## 渲染方式：ISR（增量静态再生成）

- 构建时用 generateStaticParams 预生成全部文章页，访客秒开
- 页面每 60 秒在后台重新生成（revalidate = 60），期间访客看旧版，无构建等待
- 发布 / 更新 / 删除内容时，Sanity webhook 调用 /api/revalidate 立即更新首页与对应文章页，不用重新构建

## 部署（ISR 需要 Node 运行时）

Cloudflare Pages 原生不支持 ISR，三选一：

### Vercel（最省事）

Next.js 官方平台，ISR 开箱即用。导入本仓库 → Framework 选 Next.js → Root Directory 填 web，环境变量配 REVALIDATE_SECRET 即可。

### 自托管（Railway / Fly.io / VPS / Docker）

```bash
npm run build:web   # 产出 .next
npm run start:web   # next start，默认监听 3000 端口
```

### 坚持 Cloudflare

引入 @opennextjs/cloudflare 适配器（ISR 由 Workers KV + Queues 支撑），需要 wrangler.toml 与 KV / Queue 绑定，配置量较大，暂不内置在本仓库。

## 内容发布后按需更新（推荐）

1. web/.env.local 与部署平台的环境变量配同一个 REVALIDATE_SECRET
2. Sanity → API → Webhooks → 新建 webhook：
   - URL：https://你的域名/api/revalidate?secret=你的密钥（或在自定义请求头加 x-webhook-secret）
   - 订阅：create / update / delete（dataset: production）

发布文章后 Sanity 会打一次 webhook，相关页面立即重新生成，无需重建部署。

### Sanity Studio

```bash
npm run deploy   # 部署到 *.sanity.studio
```

## AI 辅助开发（MCP）

仓库根目录的 .mcp.json 指向 Sanity 官方远程 MCP（https://mcp.sanity.io，HTTP/SSE），Cursor / Claude Code 等工具可直接读写 Schema 与数据。DeepSeek Harness 对应配置：

```yaml
mcp_servers:
  sanity:
    type: http
    url: https://mcp.sanity.io
```

## 后续路线（按需再加）

- 标签聚合页（/tag/:tag）、文章系列
- 代码高亮、目录（TOC）、RSS、sitemap
- Sanity TypeGen：Schema 变更自动生成 TS 类型，替代手工维护的 web/lib/types.ts
- 若数据集改为私有，给 web 加 SANITY_API_READ_TOKEN 即可
