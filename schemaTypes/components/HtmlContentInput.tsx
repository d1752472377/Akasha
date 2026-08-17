import {useRef, useState} from 'react'
import {Button, Flex, Stack, Text, TextArea} from '@sanity/ui'
import {PatchEvent, set} from 'sanity'

/**
 * contentHtml 字段的自定义输入组件（做法 A）：
 * 在默认多行文本框的基础上，加一个「上传 HTML 文件」按钮。
 * 选择 .html 文件后读取内容并写回当前字段——与手动粘贴完全等价，
 * 落库的始终是同一段 HTML 字符串，写完后仍可在文本框里继续编辑。
 */

// 字段级组件 props（宽松类型，兼容不同 Sanity 版本的 StringInputProps）
interface HtmlContentInputProps {
  value?: string
  onChange: (patch: unknown) => void
  readOnly?: boolean
  elementProps?: Record<string, unknown>
}

export default function HtmlContentInput({
  value,
  onChange,
  readOnly,
  elementProps,
}: HtmlContentInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const writeValue = (next: string) => {
    onChange(PatchEvent.from(set(next)))
  }

  const handleFileSelected = (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return

    // 覆盖式写入：已有内容时先确认
    if (
      value &&
      value.trim() !== '' &&
      !window.confirm('当前已有内容，上传将覆盖，是否继续？')
    ) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const content = String(reader.result ?? '')
      writeValue(content)
      setNotice(`已从 ${file.name} 读取 ${content.length} 个字符`)
      window.setTimeout(() => setNotice(null), 8000)
    }
    reader.readAsText(file)
  }

  return (
    <Stack space={3}>
      <TextArea
        {...elementProps}
        value={value ?? ''}
        rows={16}
        readOnly={readOnly}
        font="monospace"
        onChange={(event) => writeValue(event.currentTarget.value)}
      />
      <Flex align="center" gap={3}>
        <Button
          mode="ghost"
          tone="primary"
          text="上传 HTML 文件"
          disabled={readOnly}
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,text/html"
          style={{display: 'none'}}
          onChange={(event) => {
            handleFileSelected(event.target.files)
            event.target.value = '' // 允许再次选择同一个文件
          }}
        />
        {notice ? (
          <Text size={1} muted>
            {notice}
          </Text>
        ) : null}
      </Flex>
    </Stack>
  )
}
