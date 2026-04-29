import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const settings = await prisma.websiteSetting.findMany()
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = JSON.parse(curr.value)
      return acc
    }, {} as Record<string, any>)
    
    return settingsMap
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
