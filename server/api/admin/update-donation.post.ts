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

    const body = await readBody(event)
    const { id, status } = body

    if (!id || !status) {
      throw createError({ statusCode: 400, message: 'ID and Status are required' })
    }

    const updated = await prisma.donation.update({
      where: { id: parseInt(id) },
      data: { status }
    })
    return { success: true, donation: updated }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error'
    })
  }
})
