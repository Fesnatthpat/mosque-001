import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { key, value } = body
    
    const setting = await prisma.websiteSetting.upsert({
      where: { key },
      update: { value: JSON.stringify(value) },
      create: { key, value: JSON.stringify(value) }
    })
    
    return setting
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
