import {useDocumentOperation} from 'sanity'
import type {DocumentActionComponent} from 'sanity'

/**
 * 显眼的「删除」文档操作（注册给 post / category）：
 * 显示在文档编辑页顶部操作区，红色按钮，window.confirm 确认后执行删除。
 * 与 Studio 原生删除（编辑页 ⋮ 菜单、列表页勾选批量删除）等价，只是更醒目。
 */
export const deleteAction: DocumentActionComponent = (props) => {
  const {id, type, onComplete} = props
  const {del} = useDocumentOperation(id, type)

  return {
    label: '删除',
    title: '删除该文档（不可恢复）',
    tone: 'critical',
    disabled: del.disabled,
    onHandle: () => {
      if (!window.confirm('确定要删除这篇文档吗？此操作不可恢复。')) return
      del.execute()
      if (typeof onComplete === 'function') onComplete()
    },
  }
}
