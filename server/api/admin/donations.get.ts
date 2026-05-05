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

    const query = getQuery(event)
    const filterMonth = query.month ? parseInt(query.month as string) : null
    const filterYear = query.year ? parseInt(query.year as string) : null

    let whereClause: any = {}
    
    if (filterMonth !== null && filterYear !== null) {
      const startDate = new Date(filterYear, filterMonth - 1, 1)
      const endDate = new Date(filterYear, filterMonth, 0, 23, 59, 59)
      whereClause = {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    }

    const donations = await prisma.donation.findMany({
      where: whereClause,
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
