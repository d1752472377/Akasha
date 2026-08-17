import {Button, Card, Stack, Text} from '@sanity/ui'
import {useToast} from '@sanity/ui/toast'
import {useDocumentOperation, useFormValue} from 'sanity'

/**
 * 表单内嵌的「危险区」删除按钮（文章/分类共用）：
 * 直接渲染在表单底部，不依赖任何菜单。删除当前文档（发布版本 + 草稿），不可恢复。
 * 该字段不实际存储数据（组件从不产生 patch）。
 */
export default function DeleteDocumentField() {
  const rawId = useFormValue(['_id']) as string | undefined
  const docType = useFormValue(['_type']) as string | undefined

  // 新建文档（还没有 _id）时整个隐藏
  if (!rawId || !docType) return null

  return <DeleteButton rawId={rawId} docType={docType} />
}

function DeleteButton({rawId, docType}: {rawId: string; docType: string}) {
  const toast = useToast()
  const publishedId = rawId.replace(/^drafts\./, '')
  const {del} = useDocumentOperation(publishedId, docType)

  const handleDelete = () => {
    if (!window.confirm('确定要删除这篇文档吗？此操作不可恢复。')) return
    try {
      // 无参 execute()：删除发布版本 + 草稿（v6 的 del 操作语义）
      const result = del.execute() as unknown
      if (result && typeof (result as Promise<unknown>).catch === 'function') {
        ;(result as Promise<unknown>)
          .then(() => toast.push({status: 'success', title: '已删除'}))
          .catch((err: unknown) =>
            toast.push({
              status: 'error',
              title: '删除失败',
              description: err instanceof Error ? err.message : String(err),
            })
          )
      } else {
        toast.push({status: 'success', title: '已删除'})
      }
    } catch (err) {
      toast.push({
        status: 'error',
        title: '删除失败',
        description: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return (
    <Card tone="critical" padding={4} radius={2} border>
      <Stack space={3}>
        <Text size={1} weight="semibold">
          危险区
        </Text>
        <Text size={1} muted>
          删除当前文档（发布版本与草稿），不可恢复。
        </Text>
        <Button
          tone="critical"
          text="删除这篇文档"
          disabled={!!del.disabled}
          onClick={handleDelete}
        />
      </Stack>
    </Card>
  )
}
