export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { id, status } = body

    if (!id || !status) {
      throw createError({ statusCode: 400, message: 'ID and Status are required' })
    }

    const { PrismaClient } = await import('@prisma/client')
    const { PrismaPg } = await import('@prisma/adapter-pg')
    const pg = await import('pg')

    const pool = new pg.default.Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
      const updated = await prisma.donation.update({
        where: { id: parseInt(id) },
        data: { status }
      })
      return { success: true, donation: updated }
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
