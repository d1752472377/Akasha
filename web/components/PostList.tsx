import Link from 'next/link'
import {formatDate} from '@/lib/format'
import type {PostSummary} from '@/lib/types'

/** 简洁文章列表（标题 + 日期），用于首页「最近更新」与分类页 */
export default function PostList({posts}: {posts: PostSummary[]}) {
  if (posts.length === 0) return <p className="empty">暂无文章。</p>
  return (
    <ul className="post-list-simple">
      {posts.map((post) => (
        <li key={post._id}>
          <Link className="post-list-link" href={`/blog/${post.slug}`}>
            <span className="post-list-title">{post.title}</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </Link>
        </li>
      ))}
    </ul>
  )
}
