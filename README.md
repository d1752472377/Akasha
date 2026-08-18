# Akasha

一个极简博客：Sanity 管内容，Next.js 管渲染（ISR）。

- **内容**：Sanity（Headless CMS，项目 dcflbleb / production）
- **前端**：Next.js（App Router，ISR 增量静态再生成）
- **线上**：https://blog.dovislab.com （Vercel）
- **评论**：Giscus（GitHub Discussions）

## 结构

```
Akasha/
├── schemaTypes/            # Sanity Studio（仓库根目录即 Studio）
│   ├── components/         # 自定义组件：contentHtml 上传、危险区删除
│   ├── post.ts             # 文章（正文 = contentHtml，一段完整 HTML）
│   ├── category.ts         # 分类
│   └── siteSettings.ts     # 设置（单例：首页头像/签名 + 关于页）
├── templates/              # 文章 HTML 写作规范与示例（见下）
├── web/                    # Next.js 前端（npm workspace）
│   ├── app/                # 首页 / posts / blog/:slug / category/:slug / about / api/revalidate
│   ├── components/         # Header / PostList / ProfileCard / PortableText / Giscus
│   └── lib/                # Sanity client / GROQ / 类型 / 正文 HTML 清洗
└── .mcp.json               # Sanity 官方 MCP（AI 工具可直接读写 Schema 与数据）
```

前端只通过 Sanity 公开 API（GROQ）读内容，不 import 任何 Studio 代码；两端只共享 projectId/dataset，完全解耦。

## 数据模型

| 类型 | 说明 |
| --- | --- |
| **post** 文章 | 标题 / slug / 摘要 / 封面 / 分类（多选）/ 发布时间 + `contentHtml`（一段完整 HTML 正文） |
| **category** 分类 | 标题 / slug / 描述 |
| **siteSettings** 设置（单例） | 「首页」头像与签名、「关于」标题/副文案/正文 |

后台结构菜单：**文章 | 分类 | 设置**。
文章与分类表单底部带「危险区」删除卡片（发布版与草稿一起删，不可恢复）。

### 文章正文（contentHtml）

正文是**一段完整 HTML 字符串**，后台可以：

- 直接粘贴 HTML 文本；
- 点「上传 HTML 文件」读入 .html（覆盖式，带确认）。

渲染前会自动清洗（`web/lib/sanitizeHtml.ts`）：

- 去掉 `<!DOCTYPE>` / `<html>` / `<head>` / `<body>` / `<meta>` / `<title>` / `<script>` 等文档级标签；
- 文章里的 `<style>` 自动作用域化到正文（`.post-body`），`html` / `body` / `:root` 等页面级选择器丢弃——文章样式不会影响页眉页脚。

所以可以直接粘贴整页 HTML（包括 AI 生成的整页模板）。写作规范、推荐类清单与 AI 生成约束见 **`templates/README.md`**（含可直接复制的示例 `templates/standard-article.html`）。

## 快速开始

```bash
npm install          # 根目录一次装齐两个 workspace

npm run dev          # 内容后台 http://localhost:3333
npm run dev:web      # 博客前端 http://localhost:3000
                     # （3000 被占用时 Next 会自动换 3001）
```

## 内容发布与刷新

- 页面 ISR `revalidate = 60`，Sanity 客户端直读 API（`useCdn: false`）→ 发布后最多 60 秒生效；
- 配置 webhook（见下）后发布立即刷新：文章 → 文章页 + 列表页；分类 → 分类页 + 列表页；设置 → 首页 + 关于页；
- `REVALIDATE_SECRET` 未配置时 `/api/revalidate` 返回 500（只影响即时刷新，不影响正常浏览）。

## 环境变量

```bash
cp web/.env.local.example web/.env.local
```

- Sanity 两项有默认值（本项目 ID），可不配；
- Giscus 四项配置好后才有评论，未配置时页面显示占位提示；
- REVALIDATE_SECRET：Sanity webhook 即时刷新的密钥（线上已用：`https://blog.dovislab.com/api/revalidate?secret=...`）。

## 配置 Giscus 评论

1. 仓库 Settings → General → Features：勾选 **Discussions**
2. 到 https://github.com/apps/giscus 把 App 安装到该仓库
3. 打开 https://giscus.app，填入仓库并选好分类，复制 **repo_id** 与 **category_id** 到 web/.env.local
4. 重新构建部署

## 内容发布后即时刷新（webhook，推荐）

1. web/.env.local 与 Vercel 环境变量配同一个 REVALIDATE_SECRET
2. Sanity → API → Webhooks → 新建 webhook：
   - URL：`https://blog.dovislab.com/api/revalidate?secret=你的密钥`（或自定义请求头 `x-webhook-secret`）
   - 订阅：create / update / delete（dataset: production）

## 部署

- **前端**：Vercel（已部署，见仓库 Vercel 项目），Root Directory 填 `web`，环境变量配 REVALIDATE_SECRET；
  本仓库也支持 Node 运行时自托管（Railway / Fly.io / VPS / Docker）：`npm run build:web && npm run start:web`。
- **Studio**：`npm run deploy` 部署到 `*.sanity.studio`；本地开发用 `npm run dev`（localhost:3333）。

## AI 辅助开发（MCP）

仓库根目录的 .mcp.json 指向 Sanity 官方远程 MCP（https://mcp.sanity.io），Cursor / Claude Code 等工具可直接读写 Schema 与数据。DeepSeek Harness 对应配置：

```yaml
mcp_servers:
  sanity:
    type: http
    url: https://mcp.sanity.io
```

## 后续路线（按需再加）

- 标签聚合页、文章系列（当前正文为自由 HTML，标签可放入正文内）
- 代码高亮、目录（TOC）、RSS、sitemap
- Sanity TypeGen：Schema 变更自动生成 TS 类型，替代手工维护的 web/lib/types.ts
- 若数据集改为私有，给 web 加 SANITY_API_READ_TOKEN
