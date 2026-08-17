/** @type {import('next').NextConfig} */
const nextConfig = {
  // ISR：构建时预渲染，之后按 revalidate 周期后台再生成，访客始终拿到页面。
  // 注意：ISR 需要 Node 运行时（Vercel / Railway / Fly.io / VPS / Docker）。
  // Cloudflare Pages 原生不支持 ISR；坚持 Cloudflare 需引入 @opennextjs/cloudflare 适配器。
  images: {
    // 让内置图片优化器接管 Sanity CDN 图片
    remotePatterns: [{protocol: 'https', hostname: 'cdn.sanity.io'}],
  },
}

export default nextConfig
