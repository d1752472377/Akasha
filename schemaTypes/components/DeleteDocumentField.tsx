import {Button, Card, Flex, Text} from '@sanity/ui'
import {useDocumentOperation, useFormValue} from 'sanity'

/**
 * 表单内嵌「危险区」删除按钮（文章/分类共用）：
 * 删除当前文档（发布版本 + 草稿），不可恢复。
 * 成功/失败反馈交给文档面板：成功自动返回列表，失败面板会弹出错误提示。
 */
export default function DeleteDocumentField() {
  const rawId = useFormValue(['_id']) as string | undefined
  const docType = useFormValue(['_type']) as string | undefined

  // 新建文档（还没有 _id）时整个隐藏
  if (!rawId || !docType) return null

  return <DeleteButton rawId={rawId} docType={docType} />
}

function DeleteButton({rawId, docType}: {rawId: string; docType: string}) {
  const publishedId = rawId.replace(/^drafts\./, '')
  const {del} = useDocumentOperation(publishedId, docType)

  const handleDelete = () => {
    if (!window.confirm('确定要删除这篇文档吗？此操作不可恢复。')) return
    // v6 的 del 操作需要显式的 versions：
    // 正在编辑草稿（有 drafts. 前缀）→ 传草稿 id，删除发布版 + 草稿
    // 仅草稿从未发布 → 传草稿 id，走 version.discard 丢弃草稿
    // 编辑已发布且无草稿 → 空数组，删除发布版
    const versions = rawId.startsWith('drafts.') ? [rawId] : []
    try {
      const result = del.execute(versions) as unknown
      if (result && typeof (result as Promise<unknown>).catch === 'function') {
        // 失败时文档面板会弹出提示，这里只吞掉未处理的 rejection
        ;(result as Promise<unknown>).catch(() => {})
      }
    } catch {
      // 同步抛错同样交给面板处理
    }
  }

  return (
    <Card padding={4} radius={2} border>
      <Flex align="center" justify="space-between" gap={4}>
        <Text size={1} muted>
          删除后不可恢复，发布版本与草稿会一起删除。
        </Text>
        <Button tone="critical" text="删除" disabled={!!del.disabled} onClick={handleDelete} />
      </Flex>
    </Card>
  )
}
