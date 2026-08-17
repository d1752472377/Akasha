// 文章列表字段（列表页 / 分类页共用），详情页在尾部追加 body
const POST_FIELDS = `_id, title, "slug": slug.current, excerpt, coverImage, publishedAt, tags, "categories": categories[]->{_id, title, "slug": slug.current}`

// 全部文章，按发布时间倒序（首页「最近更新」与上一篇/下一篇都用它）
export const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) { ${POST_FIELDS} }`

// 构建时预生成全部文章路由
export const POST_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)].slug.current`

// 文章详情：正文为完整 HTML 字符串（contentHtml）；body 为最早期的富文本兜底
export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] { ${POST_FIELDS}, body, contentHtml }`

// 上一篇/下一篇：只需要 slug 与标题
export const POST_NEIGHBORS_QUERY = `*[_type == "post"] | order(publishedAt desc) { "slug": slug.current, title }`

// 分类卡片（首页）：含文章数
export const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  "count": count(*[_type == "post" && references(^._id)])
}`

export const CATEGORY_SLUGS_QUERY = `*[_type == "category" && defined(slug.current)].slug.current`

export const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description
}`

export const POSTS_BY_CATEGORY_QUERY = `*[_type == "post" && references($id)] | order(publishedAt desc) { ${POST_FIELDS} }`

// 站点设置：首页个人卡片 + 关于页
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] { avatar, signature, aboutTitle, aboutDescription, aboutBody }`
