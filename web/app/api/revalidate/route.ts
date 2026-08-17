import {revalidatePath} from 'next/cache'
import {NextRequest, NextResponse} from 'next/server'

const SECRET = process.env.REVALIDATE_SECRET

/** Sanity webhook 的标准 payload 里带 _type 与 slug（删除事件也会带上文档快照） */
interface SanityWebhookBody {
  _type?: string
  slug?: {current?: string}
}

function checkSecret(request: NextRequest): boolean {
  const fromHeader = request.headers.get('x-webhook-secret')
  const fromQuery = new URL(request.url).searchParams.get('secret')
  return Boolean(SECRET) && (fromHeader === SECRET || fromQuery === SECRET)
}

async function handleRequest(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json({message: 'REVALIDATE_SECRET is not configured'}, {status: 500})
  }
  if (!checkSecret(request)) {
    return NextResponse.json({message: 'Invalid secret'}, {status: 401})
  }

  // 首页总是刷新（新文章出现、排序变化、分类文章数变化、删除）
  revalidatePath('/')

  // 具体页面（含删除后变 404 的情况）
  const body = (await request.json().catch(() => null)) as SanityWebhookBody | null
  const slug = body?.slug?.current
  if (slug) {
    if (body?._type === 'post') {
      revalidatePath('/blog/' + slug)
      revalidatePath('/posts')
    } else if (body?._type === 'category') {
      revalidatePath('/category/' + slug)
      revalidatePath('/posts')
    }
  }

  // 站点设置（首页卡片 / 关于页）
  if (body?._type === 'siteSettings') {
    revalidatePath('/')
    revalidatePath('/about')
  }

  return NextResponse.json({revalidated: true})
}

export const POST = handleRequest

// GET 仅用于本地/手动验证，Sanity webhook 发的是 POST
export const GET = handleRequest
