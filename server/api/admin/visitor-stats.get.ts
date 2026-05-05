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

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // Default range for chart: last 7 days
    let chartStartDate = new Date(today)
    chartStartDate.setDate(chartStartDate.getDate() - 7)
    let chartEndDate = new Date(now)

    // If month/year filter is provided, change chart range to that month
    if (filterMonth !== null && filterYear !== null) {
      chartStartDate = new Date(filterYear, filterMonth - 1, 1)
      chartEndDate = new Date(filterYear, filterMonth, 0, 23, 59, 59)
    }

    const [totalVisits, todayVisits, topPages, recentVisitors] = await Promise.all([
      prisma.visitorLog.count(),
      prisma.visitorLog.count({
        where: {
          createdAt: {
            gte: today
          }
        }
      }),
      prisma.visitorLog.groupBy({
        by: ['path'],
        where: (filterMonth !== null && filterYear !== null) ? {
          createdAt: {
            gte: chartStartDate,
            lte: chartEndDate
          }
        } : undefined,
        _count: {
          path: true
        },
        orderBy: {
          _count: {
            path: 'desc'
          }
        },
        take: 10
      }),
      prisma.visitorLog.findMany({
        where: (filterMonth !== null && filterYear !== null) ? {
          createdAt: {
            gte: chartStartDate,
            lte: chartEndDate
          }
        } : undefined,
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })
    ])

    // Fetch stats for the chart range
    let recentStats = []
    try {
      const rawStats = await prisma.$queryRaw`
        SELECT 
          CAST("createdAt" AS DATE) as date, 
          COUNT(*)::int as count 
        FROM "VisitorLog" 
        WHERE "createdAt" >= ${chartStartDate} AND "createdAt" <= ${chartEndDate}
        GROUP BY CAST("createdAt" AS DATE)
        ORDER BY date ASC
      `
      recentStats = Array.isArray(rawStats) ? rawStats : []
    } catch (rawError) {
      console.error('[Stats API] Raw Query Error:', rawError)
    }

    return {
      totalVisits,
      todayVisits,
      recentStats,
      topPages,
      recentVisitors,
      period: {
        start: chartStartDate,
        end: chartEndDate
      }
    }
  } catch (error: any) {
    console.error('[Stats API] Main Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error'
    })
  }
})
