import {useDocumentOperation} from 'sanity'
import type {DocumentActionComponent} from 'sanity'

/**
 * 文档操作区的「删除」按钮（注册给 post / category）：
 * 确认后删除当前文档（发布版本 + 草稿），与表单内「危险区」按钮等价。
 */
export const deleteAction: DocumentActionComponent = (props) => {
  const {id, type, draft, onComplete} = props
  const {del} = useDocumentOperation(id, type)

  return {
    label: '删除',
    title: '删除该文档（不可恢复）',
    tone: 'critical',
    disabled: del.disabled,
    onHandle: () => {
      if (!window.confirm('确定要删除这篇文档吗？此操作不可恢复。')) return
      // 有草稿时把草稿 id 一并交给删除动作（v6 del 需要显式的 versions）
      const versions = draft?._id ? [draft._id] : []
      del.execute(versions)
      if (typeof onComplete === 'function') onComplete()
    },
  }
}
