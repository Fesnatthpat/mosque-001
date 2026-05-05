import { prisma } from '../../utils/prisma'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Check Authentication
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    const settings = await prisma.websiteSetting.findMany()
    const settingsMap = settings.reduce((acc, curr) => {
      try {
        acc[curr.key] = JSON.parse(curr.value)
      } catch (e) {
        acc[curr.key] = curr.value
      }
      return acc
    }, {} as Record<string, any>)
    
    return settingsMap
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error'
    })
  }
})
