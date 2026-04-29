export default defineEventHandler(async (event) => {
  try {
    const { PrismaClient } = await import('@prisma/client')
    const { PrismaPg } = await import('@prisma/adapter-pg')
    const pg = await import('pg')

    const pool = new pg.default.Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
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
    } finally {
      await prisma.$disconnect()
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
})
