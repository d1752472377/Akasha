import Link from 'next/link'
import PostList from '@/components/PostList'
import ProfileCard from '@/components/ProfileCard'
import {CATEGORIES_QUERY, POSTS_QUERY, SITE_SETTINGS_QUERY} from '@/lib/queries'
import {client} from '@/lib/sanity'
import type {Category, PostSummary, SiteSettings} from '@/lib/types'

export const revalidate = 60

export default async function HomePage() {
  const [settings, posts, categories] = await Promise.all([
    client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
    client.fetch<PostSummary[]>(POSTS_QUERY),
    client.fetch<Category[]>(CATEGORIES_QUERY),
  ])

  return (
    <div className="site-wrapper">
      <main className="home-main">
        {/* 第一层：个人 / Banner 占位卡片（白框 + 阴影，头像 + 签名） */}
        <ProfileCard settings={settings} />

        {/* 第二层：左右双栏内容区 */}
        <div className="home-columns">
          {/* 左侧主内容区：最近更新 */}
          <section className="panel">
            <div className="panel-header">
              <h2>最近更新</h2>
              <Link href="/posts" className="view-all">
                查看全部 {posts.length} 篇
              </Link>
            </div>
            <PostList posts={posts.slice(0, 10)} />
          </section>

          {/* 右侧侧边栏区：分类 */}
          <aside className="panel">
            <div className="panel-header">
              <h2>分类</h2>
              <span className="view-all">{categories.length} 个</span>
            </div>
            {categories.length === 0 ? (
              <p className="empty">还没有分类。在 Sanity Studio 里创建 Category 文档。</p>
            ) : (
              <ul className="category-sidebar-list">
                {categories.map((category) => (
                  <li key={category._id}>
                    <Link className="category-sidebar-link" href={`/category/${category.slug}`}>
                      <span>{category.title}</span>
                      <span className="category-sidebar-count">{category.count ?? 0} 篇</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
