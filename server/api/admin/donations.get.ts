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

    const donations = await prisma.donation.findMany({
      orderBy: { date: 'desc' }
    })
    
    // คำนวณยอดเฉพาะรายการที่ "สำเร็จ" (completed)
    const totalAmount = donations
      .filter(d => d.status === 'completed')
      .reduce((sum, d) => sum + d.amount, 0)
    
    return {
      donations,
      totalAmount
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error'
    })
  }
})
