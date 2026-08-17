import {redirect} from 'next/navigation'

interface PageProps {
  params: Promise<{slug: string}>
}

// 旧路由已迁移到 /blog/:slug，保留跳转避免旧外链失效
export default async function LegacyPostPage({params}: PageProps) {
  const {slug} = await params
  redirect(`/blog/${slug}`)
}
