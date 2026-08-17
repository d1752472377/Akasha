export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('zh-CN', {year: 'numeric', month: 'long', day: 'numeric'})
}
