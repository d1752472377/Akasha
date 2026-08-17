import type {Metadata} from 'next'
import Link from 'next/link'
import {formatDate} from '@/lib/format'
import {CATEGORIES_QUERY, POSTS_QUERY} from '@/lib/queries'
import {client} from '@/lib/sanity'
import type {Category, PostSummary} from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: '文章',
  description: 'Akasha 的全部文章。',
}

export default async function PostsPage() {
  const [posts, categories] = await Promise.all([
    client.fetch<PostSummary[]>(POSTS_QUERY),
    client.fetch<Category[]>(CATEGORIES_QUERY),
  ])

  return (
    <div className="posts-page">
      {/* 左侧悬浮分类列表 */}
      <aside className="posts-sidebar">
        <h2>分类</h2>
        {categories.length === 0 ? (
          <p className="empty">暂无分类</p>
        ) : (
          <ul>
            {categories.map((category) => (
              <li key={category._id}>
                <Link href={`/category/${category.slug}`}>
                  <span>{category.title}</span>
                  <span className="posts-sidebar-count">{category.count ?? 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* 右侧主内容区：文章列表 */}
      <main className="posts-main">
        <header className="posts-header">
          <h1>文章</h1>
          <span>{posts.length} 篇</span>
        </header>

        {posts.length === 0 ? (
          <p className="empty">还没有文章。</p>
        ) : (
          <ol className="posts-list">
            {posts.map((post, index) => (
              <li key={post._id}>
                <Link className="posts-item" href={`/blog/${post.slug}`}>
                  <span className="posts-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="posts-body">
                    <span className="posts-title">{post.title}</span>
                    {post.excerpt ? <span className="posts-excerpt">{post.excerpt}</span> : null}
                  </span>
                  <time className="posts-date" dateTime={post.publishedAt}>
                    {formatDate(post.publishedAt)}
                  </time>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  )
}
