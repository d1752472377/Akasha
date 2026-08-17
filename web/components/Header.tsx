'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

const NAV_LINKS = [
  {href: '/', label: '主页', isActive: (path: string) => path === '/'},
  {
    href: '/posts',
    label: '文章',
    isActive: (path: string) =>
      path.startsWith('/posts') || path.startsWith('/blog') || path.startsWith('/category'),
  },
  {href: '/about', label: '关于', isActive: (path: string) => path.startsWith('/about')},
]

/** 全局顶栏：左侧 Logo，右侧导航链接（高亮当前页面） */
export default function Header() {
  const pathname = usePathname()

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="logo">
          Akasha
        </Link>
        <nav className="nav" aria-label="主导航">
          {NAV_LINKS.map((link) => {
            const active = link.isActive(pathname)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? 'nav-link nav-link-active' : 'nav-link'}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
