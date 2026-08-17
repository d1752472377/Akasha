import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import Giscus from '@/components/Giscus'
import PortableText from '@/components/PortableText'
import {formatDate} from '@/lib/format'
import {POST_BY_SLUG_QUERY, POST_NEIGHBORS_QUERY, POST_SLUGS_QUERY} from '@/lib/queries'
import {client, urlFor} from '@/lib/sanity'
import {sanitizeArticleHtml} from '@/lib/sanitizeHtml'
import type {Post, PostNeighbor} from '@/lib/types'

interface PageProps {
  params: Promise<{slug: string}>
}

// ISR：构建时预生成全部文章页，之后每 60 秒后台再生成；新文章首次访问时按需生成
export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(POST_SLUGS_QUERY)
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  const post = await client.fetch<Post | null>(POST_BY_SLUG_QUERY, {slug})
  if (!post) return {title: '未找到'}
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function PostPage({params}: PageProps) {
  const {slug} = await params
  const [post, neighbors] = await Promise.all([
    client.fetch<Post | null>(POST_BY_SLUG_QUERY, {slug}),
    client.fetch<PostNeighbor[]>(POST_NEIGHBORS_QUERY),
  ])
  if (!post) notFound()

  // neighbors 按发布时间倒序：前一条 = 更新的文章，后一条 = 更早的文章
  const index = neighbors.findIndex((item) => item.slug === slug)
  const prev = index > 0 ? neighbors[index - 1] : null
  const next = index >= 0 && index < neighbors.length - 1 ? neighbors[index + 1] : null

  return (
    <main className="container">
      <article className="post">
        {post.contentHtml ? (
          // 正文是完整 HTML：先清洗（去文档级标签、<style> 作用域化到 .post-body）再注入
          <div
            className="post-body"
            dangerouslySetInnerHTML={{__html: sanitizeArticleHtml(post.contentHtml)}}
          />
        ) : post.body?.length ? (
          // 历史文章：早期富文本兜底渲染
          <>
            <header className="post-header">
              <h1>{post.title}</h1>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              {post.categories?.length ? (
                <ul className="categories">
                  {post.categories.map((category) => (
                    <li key={category._id}>
                      <Link href={`/category/${category.slug}`}>{category.title}</Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </header>

            {post.coverImage ? (
              <Image
                className="post-cover"
                src={urlFor(post.coverImage).width(1200).auto('format').url()}
                alt={post.coverImage.alt ?? post.title}
                width={1200}
                height={630}
                priority
              />
            ) : null}

            <div className="post-body">
              <PortableText value={post.body} />
            </div>

            {post.tags?.length ? (
              <ul className="tags">
                {post.tags.map((tag) => (
                  <li key={tag}>#{tag}</li>
                ))}
              </ul>
            ) : null}
          </>
        ) : (
          <p className="empty">这篇文章还没有内容：请到后台填写 HTML 正文，或上传 .html 文件。</p>
        )}
      </article>

      <nav className="post-pagination">
        {prev ? (
          <Link className="pagination-prev" href={`/blog/${prev.slug}`}>
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="pagination-next" href={`/blog/${next.slug}`}>
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <Giscus />
    </main>
  )
}
