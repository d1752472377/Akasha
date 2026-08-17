import {defineField, defineType} from 'sanity'

/**
 * 站点设置（保持只有一份文档即可）：
 * 「首页」分组 = 个人卡片头像与签名；「关于」分组 = 关于页内容。
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'home', title: '首页'},
    {name: 'about', title: '关于'},
  ],
  fields: [
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      group: 'home',
      options: {hotspot: true},
      description: '首页个人卡片的头像。',
    }),
    defineField({
      name: 'signature',
      title: 'Signature',
      type: 'text',
      group: 'home',
      rows: 3,
      description: '头像旁的简短签名。',
    }),
    defineField({
      name: 'aboutTitle',
      title: 'Title',
      type: 'string',
      group: 'about',
      description: '关于页标题，留空默认「关于」。',
    }),
    defineField({
      name: 'aboutDescription',
      title: 'Description',
      type: 'text',
      group: 'about',
      rows: 2,
      description: '关于页标题下的副文案，可留空。',
    }),
    defineField({
      name: 'aboutBody',
      title: 'Body',
      type: 'blockContent',
      group: 'about',
      description: '关于页正文（富文本）。',
    }),
  ],
  preview: {
    select: {title: 'signature', media: 'avatar'},
    prepare({title, media}) {
      return {title: title || 'Site Settings', media}
    },
  },
})
