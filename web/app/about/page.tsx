import type {Metadata} from 'next'
import PortableText from '@/components/PortableText'
import {SITE_SETTINGS_QUERY} from '@/lib/queries'
import {client} from '@/lib/sanity'
import type {SiteSettings} from '@/lib/types'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY)
  return {
    title: settings?.aboutTitle || '关于',
    description: settings?.aboutDescription,
  }
}

export default async function AboutPage() {
  const settings = await client.fetch<SiteSettings | null>(SITE_SETTINGS_QUERY)

  return (
    <main className="container">
      <article className="post">
        <header className="post-header">
          <h1>{settings?.aboutTitle || '关于'}</h1>
          {settings?.aboutDescription ? (
            <p className="page-subtitle">{settings.aboutDescription}</p>
          ) : null}
        </header>

        {settings?.aboutBody?.length ? (
          <div className="post-body">
            <PortableText value={settings.aboutBody} />
          </div>
        ) : (
          <p className="empty">还没有内容：在 Sanity Studio 的「设置 → 关于」里填写。</p>
        )}
      </article>
    </main>
  )
}
