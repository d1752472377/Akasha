import type {PortableTextBlock} from '@portabletext/react'

/** Sanity image 文档字段的返回形状 */
export interface CoverImage {
  _type: 'image'
  asset: {_type: 'reference'; _ref: string}
  alt?: string
}

/** 文章里投影出来的分类（categories[]-> 的结果） */
export interface CategoryRef {
  _id: string
  title: string
  slug: string
}

/** 列表用的文章摘要（首页最近更新 / 分类页 / 上一篇下一篇） */
export interface PostSummary {
  _id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: CoverImage | null
  publishedAt: string
  tags?: string[]
  categories?: CategoryRef[]
}

/** 文章详情 = 摘要 + 正文 */
export interface Post extends PostSummary {
  /** 最早期的富文本正文（历史文章兜底） */
  body?: PortableTextBlock[] | null
  /** 正文：完整 HTML 字符串，直接注入渲染 */
  contentHtml?: string | null
}

export interface Category {
  _id: string
  title: string
  slug: string
  description?: string
  count?: number
}

/** 单页（关于页等） */
export interface PageDoc {
  _id: string
  title: string
  slug: string
  description?: string
  body: PortableTextBlock[]
}

/** 首页个人卡片 + 关于页（站点设置） */
export interface SiteSettings {
  avatar?: CoverImage | null
  signature?: string
  aboutTitle?: string
  aboutDescription?: string
  aboutBody?: PortableTextBlock[] | null
}

/** 上一篇/下一篇条目 */
export interface PostNeighbor {
  slug: string
  title: string
}
