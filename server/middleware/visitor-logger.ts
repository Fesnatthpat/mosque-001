import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const path = getRequestPath(event)
  console.log('[Visitor Logger] Request Path:', path)
  
  // Only log page visits (ignore API calls and static files)
  if (path.startsWith('/api') || path.includes('.')) {
    console.log('[Visitor Logger] Skipping path:', path)
    return
  }

  const userAgent = getHeader(event, 'user-agent')
  const ip = getHeader(event, 'x-forwarded-for') || event.node.req.socket.remoteAddress
  console.log('[Visitor Logger] Logging visit for:', path, 'IP:', ip)

  try {
    const result = await prisma.visitorLog.create({
      data: {
        path,
        userAgent,
        ip: typeof ip === 'string' ? ip : undefined
      }
    })
    console.log('[Visitor Logger] Success:', result.id)
  } catch (error) {
    console.error('[Visitor Logger] Failed to log visitor:', error)
  }
})
