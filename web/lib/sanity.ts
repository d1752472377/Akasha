import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

// 与 Studio（sanity.cli.ts）保持一致；公开数据集，构建时直读 CDN，无需 token
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'dcflbleb'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

/** 封面等常规图片对象 -> URL builder */
export function urlFor(source: unknown) {
  return builder.image(source as SanityImageSource)
}

/** 正文（Portable Text）里的图片 -> 带尺寸/格式的 URL，非法数据返回 null */
export function bodyImageUrl(value: unknown): string | null {
  const ref = (value as {asset?: {_ref?: string} | null} | null | undefined)?.asset?._ref
  if (!ref) return null
  const source: SanityImageSource = {_type: 'image', asset: {_type: 'reference', _ref: ref}}
  return builder.image(source).width(1200).auto('format').url()
}
