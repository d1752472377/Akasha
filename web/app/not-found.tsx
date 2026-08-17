import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container">
      <div className="not-found">
        <h1>404</h1>
        <p>页面不存在。</p>
        <Link href="/">回到首页</Link>
      </div>
    </main>
  )
}
