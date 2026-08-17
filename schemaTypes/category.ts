import {defineField, defineType} from 'sanity'
import DeleteDocumentField from './components/DeleteDocumentField'

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: '分类页头部展示，可留空。',
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
    select: {title: 'title', subtitle: 'description'},
  },
})
