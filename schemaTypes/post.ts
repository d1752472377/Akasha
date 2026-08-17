import {defineField, defineType} from 'sanity'
import DeleteDocumentField from './components/DeleteDocumentField'
import HtmlContentInput from './components/HtmlContentInput'

/**
 * 博客文章。正文（contentHtml）是一段完整的 HTML 字符串：
 * 后台可直接粘贴文本，也可以上传 .html 文件（自定义输入组件读回同一字段）。
 * 前端拿到 contentHtml 后直接注入渲染，不再有模板引擎与 JSON 结构。
 * web 端通过 GROQ 查询消费，与 Studio 代码零耦合。
 */
export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    {name: 'meta', title: '基本信息'},
    {name: 'content', title: '内容（HTML）'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'meta',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'meta',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'meta',
      rows: 3,
      description: '列表页显示的摘要，可留空。',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      group: 'meta',
      options: {hotspot: true},
      fields: [{title: 'Alternative text', name: 'alt', type: 'string'}],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'meta',
      of: [{type: 'reference', to: [{type: 'category'}]}],
      description: '文章归属的分类（可多选）。',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'contentHtml',
      title: 'Content (HTML)',
      type: 'text',
      group: 'content',
      components: {input: HtmlContentInput},
      description:
        '文章正文：一段完整的 HTML 字符串，任意合法 HTML 都会原样渲染。可以直接粘贴，也可以点「上传 HTML 文件」读入 .html（覆盖当前内容）。日常文章推荐只用 templates/README.md 里列出的 tpl-* 类（暗色模式/改版可统一生效），特殊排版可自由发挥，避免行内写死颜色。',
    }),
    defineField({
      name: 'deleteZone',
      title: '删除文档',
      type: 'string',
      components: {input: DeleteDocumentField},
      hidden: ({document}) => !document?._id,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'publishedAt', media: 'coverImage'},
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString('zh-CN') : undefined,
        media,
      }
    },
  },
  orderings: [
    {title: 'Published, New', name: 'publishedAtDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
})
