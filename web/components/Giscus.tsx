'use client'

import {useEffect, useRef} from 'react'

// NEXT_PUBLIC_* 在构建时内联，SSR 与客户端看到的值一致
const giscusConfig = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? 'General',
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
}

export default function Giscus() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const {repo, repoId, category, categoryId} = giscusConfig
    const container = containerRef.current
    if (!repo || !repoId || !categoryId || !container || container.childElementCount > 0) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', repo)
    script.setAttribute('data-repo-id', repoId)
    script.setAttribute('data-category', category)
    script.setAttribute('data-category-id', categoryId)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', 'preferred_color_scheme')
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('data-loading', 'lazy')
    container.appendChild(script)
  }, [])

  const configured = Boolean(giscusConfig.repoId)

  return (
    <section className="comments">
      <h2>评论</h2>
      {configured ? (
        <div ref={containerRef} />
      ) : (
        <p className="comments-placeholder">
          评论功能尚未配置：在 GitHub 仓库开启 Discussions 并安装 giscus App，然后到{' '}
          <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">
            giscus.app
          </a>{' '}
          生成配置，填入 <code>web/.env.local</code>。
        </p>
      )}
    </section>
  )
}
