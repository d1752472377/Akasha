import type {Metadata} from 'next'
import Header from '@/components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: {default: 'Akasha', template: '%s · Akasha'},
  description: 'Akasha —— 一个专注于内容本身的极简博客。',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <Header />
        {children}
        <footer className="site-footer">
          <div className="container">
            <span>© 2026 Akasha</span>
            <a href="https://github.com/d1752472377/Akasha" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}
