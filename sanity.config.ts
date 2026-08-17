import React from 'react'
import {defineConfig, buildLegacyTheme} from 'sanity'
import type {DocumentActionComponent} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {deleteAction} from './schemaTypes/components/DeleteDocumentAction'

const myTheme = buildLegacyTheme({
  '--black': '#1a1a1a',
  '--white': '#ffffff',
  '--brand-primary': '#6366f1',
  '--component-bg': '#ffffff',
  '--component-text-color': '#1a1a1a',
  '--default-button-color': '#6366f1',
  '--default-button-primary-color': '#6366f1',
  '--main-navigation-color': '#0f172a',
  '--main-navigation-color--inverted': '#ffffff',
})

export default defineConfig({
  name: 'default',
  title: 'Akasha',

  projectId: 'dcflbleb',
  dataset: 'production',

  theme: myTheme,

  // 文章与分类加一个醒目的「删除」按钮（编辑页顶部操作区）
  document: {
    actions: (prev: DocumentActionComponent[], {schemaType}: {schemaType: string}) =>
      schemaType === 'post' || schemaType === 'category' ? [...prev, deleteAction] : prev,
  },

  studio: {
    components: {
      logo: () =>
        React.createElement(
          'div',
          {
            style: {
              fontWeight: 'bold',
              fontSize: '16px',
              padding: '0 8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ffffff',
            },
          },
          React.createElement('span', null, '🌌'),
          React.createElement('span', null, 'Akasha Admin')
        ),
    },
  },

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .id('root')
          .title('内容管理')
          .items([
            // 文章：增删改查，正文 = 一段完整 HTML（可粘贴或上传 .html 文件）
            S.documentTypeListItem('post').title('文章'),
            // 分类：增删改查
            S.documentTypeListItem('category').title('分类'),
            S.divider(),
            // 设置（单例）：首页头像/签名 + 关于页内容
            S.listItem()
              .id('settings')
              .title('设置')
              .child(
                S.editor().id('siteSettings').schemaType('siteSettings').documentId('siteSettings')
              ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
