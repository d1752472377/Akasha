import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import PostList from '@/components/PostList'
import {CATEGORY_BY_SLUG_QUERY, CATEGORY_SLUGS_QUERY, POSTS_BY_CATEGORY_QUERY} from '@/lib/queries'
import {client} from '@/lib/sanity'
import type {Category, PostSummary} from '@/lib/types'

interface PageProps {
  params: Promise<{slug: string}>
}

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(CATEGORY_SLUGS_QUERY)
  return slugs.map((slug) => ({slug}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  const category = await client.fetch<Category | null>(CATEGORY_BY_SLUG_QUERY, {slug})
  if (!category) return {title: '分类'}
  return {
    title: category.title,
    description: category.description,
  }
}

export default async function CategoryPage({params}: PageProps) {
  const {slug} = await params
  const category = await client.fetch<Category | null>(CATEGORY_BY_SLUG_QUERY, {slug})
  if (!category) notFound()

  const posts = await client.fetch<PostSummary[]>(POSTS_BY_CATEGORY_QUERY, {id: category._id})

  return (
    <main className="container">
      <header className="page-header">
        <h1>{category.title}</h1>
        {category.description ? <p className="page-subtitle">{category.description}</p> : null}
        <p className="page-count">共 {posts.length} 篇</p>
      </header>

      <PostList posts={posts} />

      <p className="back-home">
        <Link href="/">← 回到首页</Link>
      </p>
    </main>
  )
}
