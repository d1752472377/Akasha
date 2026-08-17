import Image from 'next/image'
import {urlFor} from '@/lib/sanity'
import type {SiteSettings} from '@/lib/types'

/** 首页第一层：个人 / Banner 占位卡片（独立白框 + 阴影），头像 + 签名 */
export default function ProfileCard({settings}: {settings: SiteSettings | null}) {
  const avatarUrl = settings?.avatar
    ? urlFor(settings.avatar)
        .width(160)
        .height(160)
        .fit('crop')
        .crop('center')
        .auto('format')
        .url()
    : null

  return (
    <section className="profile-card">
      {avatarUrl ? (
        <Image className="avatar" src={avatarUrl} alt="头像" width={80} height={80} priority />
      ) : (
        <div className="avatar avatar-placeholder" aria-hidden="true">
          A
        </div>
      )}
      <div className="profile-text">
        <h1 className="profile-name">Akasha</h1>
        <p className="profile-signature">{settings?.signature ?? '记录、思考、分享。'}</p>
      </div>
    </section>
  )
}
