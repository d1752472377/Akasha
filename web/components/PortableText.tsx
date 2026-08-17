import {PortableText as BasePortableText} from '@portabletext/react'
import type {PortableTextComponents, PortableTextBlock} from '@portabletext/react'
import {bodyImageUrl} from '@/lib/sanity'

/**
 * 与 studio/schemaTypes/blockContent.ts 对应的渲染配置。
 * 未声明的样式（h1/normal 等）走 @portabletext/react 默认渲染。
 */
const components: PortableTextComponents = {
  block: {
    h2: ({children}) => <h2>{children}</h2>,
    h3: ({children}) => <h3>{children}</h3>,
    blockquote: ({children}) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({children, value}) => {
      const href = (value as {href?: string} | undefined)?.href ?? '#'
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({value}) => {
      const v = value as {asset?: {_ref?: string} | null; alt?: string} | null | undefined
      const src = bodyImageUrl(v)
      if (!src) return null
      return <img className="pt-image" src={src} alt={v?.alt ?? ''} loading="lazy" />
    },
  },
}

export default function PortableText({value}: {value: PortableTextBlock[]}) {
  return <BasePortableText value={value} components={components} />
}
