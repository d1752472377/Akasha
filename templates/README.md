# 文章 HTML 正文写作规范

## 先说清楚：约束不是强制

`contentHtml` 不做内容校验，**任意合法 HTML 都会渲染**。渲染前会做一次「清洗」（`web/lib/sanitizeHtml.ts`）：

- 去掉 `<!DOCTYPE>` / `<html>` / `<head>` / `<body>` / `<meta>` / `<title>` / `<script>` 等文档级标签（保留内部内容）；
- 文章里的 `<style>` 会被**自动作用域化**：所有选择器重写到 `.post-body` 范围内，
  `html` / `body` / `:root` 这类页面级选择器直接丢弃——文章样式只影响正文，
  **不会波及站点页眉、页脚和页面布局**；
- 行内 `style` 属性原样保留。

所以：可以放心粘贴整页 HTML（AI 生成的整页模板也行），页面外壳不会被打乱。
tpl-* 类仍是推荐约定，好处是：

- 自动适配暗色模式（样式走 CSS 变量，行内写死颜色不会）；
- 想统一改版时只改 `web/app/globals.css` 一处，全站文章生效；
- 让 AI 批量生成文章时风格不漂移。

偶尔的特殊排版（表格、卡片墙、时间线等）完全可以自由写 HTML，注意三点：

1. 行内样式尽量少用，尤其别写死颜色（暗色模式下会刺眼）；
2. 保持 HTML 合法嵌套（`<p>` 里不要塞 `<div>`/`<img>`）；
3. `<style>` 可以写，但会被限制在正文作用域内（全局选择器被丢弃），站点外壳不受影响。

## 数据模型

- 文章正文 = 后台「文章」的 `contentHtml` 一个字段：**一段完整的 HTML 字符串**。
- 录入方式两种，落库同一样东西：
  1. 直接粘贴 HTML 文本到文本框；
  2. 点「上传 HTML 文件」读入 .html 文件（覆盖式，覆盖前会确认）。
- 前端拿到 `contentHtml` 后直接 `dangerouslySetInnerHTML` 注入 `.post-body` 渲染，
  不再有模板引擎、不再有 JSON 结构，样式全部来自全局 CSS（`web/app/globals.css` 的
  「文章 HTML 正文（contentHtml）专用排版类」区块）。

## 允许的 class（推荐清单，非强制；自由 HTML 也能渲染）

| class | 用途 | 建议标签 |
| --- | --- | --- |
| `tpl-title` | 文章大标题 | `<h1>` |
| `tpl-date` | 日期行（文本日期，可选） | `<div>` |
| `tpl-cat` | 分类胶囊（可选） | `<a>` |
| `tpl-lead` | 引言/导语 | `<div>` |
| `tpl-paragraph` | 段落 | `<div>`（不用 `<p>`） |
| `tpl-section` | 章节容器 | `<section>` 或 `<div>` |
| `tpl-section-title` | 章节小标题 | `<h2>` |
| `tpl-quote` | 引用块 | `<div>`（不用 `<blockquote>`） |
| `tpl-list` | 列表容器 | `<ul>` / `<ol>` |
| `tpl-list-item` | 列表项 | `<li>` |
| `tpl-cover` | 封面大图 | `<img>` |
| `tpl-cover-wrapper` | 封面容器 | `<div>` |
| `tpl-image` | 正文插图 | `<img>` |
| `tpl-image-wrapper` | 插图容器 | `<div>` |
| `tpl-note` | 文末提示/备注块 | `<div>`（不用 `<blockquote>`） |

## 生成 HTML 时的约束（可直接粘贴给 AI）

```
为一篇博客文章生成正文 HTML，遵守以下约束：

1. 只允许使用下面这些 class，不要发明新 class：
   tpl-title、tpl-date、tpl-cat、tpl-lead、tpl-paragraph、
   tpl-section、tpl-section-title、tpl-quote、
   tpl-list、tpl-list-item、
   tpl-cover、tpl-cover-wrapper、tpl-image、tpl-image-wrapper、tpl-note
2. 不要输出 <style> 标签，样式统一交给全局 CSS。
3. 段落用 <div class="tpl-paragraph">，不要用 <p>
   （段落里可能嵌套图片、引用等块级内容，<p> 会形成非法嵌套导致 hydration 报错）。
4. 引用用 <div class="tpl-quote">，文末提示用 <div class="tpl-note">，不要用 <blockquote>。
5. 标题层级、图片、列表用语义标签：<h1 class="tpl-title">、<h2 class="tpl-section-title">、
   <img ... alt="说明">、<ul class="tpl-list"><li class="tpl-list-item">。
6. 图片必须有 alt；外链加 target="_blank" rel="noopener noreferrer"。
7. 输出整段完整 HTML（含 <h1 class="tpl-title"> 开头），不要 markdown，不要代码围栏。
```

## 标准结构骨架

```html
<h1 class="tpl-title">文章标题</h1>
<div class="tpl-date">2026年8月17日</div>

<div class="tpl-lead">一段引言。</div>

<div class="tpl-section">
  <h2 class="tpl-section-title">第一小节</h2>
  <div class="tpl-paragraph">段落正文……</div>
  <div class="tpl-quote">一句引用。</div>
  <ul class="tpl-list">
    <li class="tpl-list-item">要点一</li>
  </ul>
  <div class="tpl-image-wrapper">
    <img class="tpl-image" src="https://..." alt="图片说明" />
  </div>
</div>

<div class="tpl-note">💡 文末提示。</div>
```

## 配套文件

- `templates/standard-article.html` —— 完整示例正文，可直接粘进后台或上传。
- 样式定义：`web/app/globals.css`（`.post-body .tpl-*` 区块）。
- 上传组件：`schemaTypes/components/HtmlContentInput.tsx`。
