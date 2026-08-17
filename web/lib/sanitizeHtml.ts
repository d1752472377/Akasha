/**
 * 文章正文 HTML 清洗（渲染前调用）：
 *
 * 1. 去掉 <!DOCTYPE> / <html> / <head> / <body> 等文档级外壳（保留内部内容）
 * 2. 去掉 <title> / <meta> / <link> / <base> / <script> / <noscript> 与注释
 * 3. 去掉 on* 行内事件属性
 * 4. <style> 保留，但所有选择器重写到 .post-body 作用域内，并丢弃 html / body / :root
 *    这类页面级选择器——文章自带样式只作用于正文，不再影响页眉页脚等站点外壳
 */

function splitTopLevel(selector: string): string[] {
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const ch of selector) {
    if (ch === '(' || ch === '[') depth++
    if (ch === ')' || ch === ']') depth--
    if (ch === ',' && depth === 0) {
      parts.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  parts.push(current)
  return parts
}

/** 页面级选择器（会作用于整个页面布局）直接丢弃 */
function isPageLevelSelector(selector: string): boolean {
  return /^(html|body|:root)(\s|$|[.:#[])/i.test(selector.trim())
}

export function scopeCss(css: string, scope = '.post-body'): string {
  let out = ''
  let i = 0
  while (i < css.length) {
    const open = css.indexOf('{', i)
    if (open === -1) {
      out += css.slice(i)
      break
    }
    const prelude = css.slice(i, open)
    // 括号配对（支持 @media 等嵌套块）
    let depth = 1
    let j = open + 1
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++
      else if (css[j] === '}') depth--
      j++
    }
    const decls = css.slice(open + 1, j - 1)
    const p = prelude.trim()
    let block: string
    if (!p) {
      block = css.slice(i, j)
    } else if (p.startsWith('@')) {
      // @media / @supports / @container 等：递归处理内部；@keyframes / @font-face 原样保留
      block = /^@(media|supports|container|layer|scope|starting-style)/i.test(p)
        ? prelude + '{' + scopeCss(decls, scope) + '}'
        : css.slice(i, j)
    } else {
      const kept = splitTopLevel(p)
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && !isPageLevelSelector(s))
        .map((s) => `${scope} ${s}`)
      block = kept.length > 0 ? `${kept.join(', ')}{${decls}}` : ''
    }
    out += block
    i = j
  }
  return out
}

export function sanitizeArticleHtml(raw: string): string {
  let html = raw
  // 注释
  html = html.replace(/<!--[\s\S]*?-->/g, '')
  // script / noscript（含内容）
  html = html.replace(/<(script|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
  // title（有闭合标签）
  html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
  // meta / link / base（void 标签）
  html = html.replace(/<(meta|link|base)\b[^>]*\/?>/gi, '')
  // 文档级外壳标签（保留内部内容）
  html = html.replace(/<!doctype[^>]*>/gi, '')
  html = html.replace(/<\/?(html|head|body)[^>]*>/gi, '')
  // 行内事件属性
  html = html.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  // <style> 作用域化到 .post-body
  html = html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_m, css: string) => {
    return `<style>${scopeCss(css)}</style>`
  })
  return html
}
