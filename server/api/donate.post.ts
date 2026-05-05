import { prisma } from '../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { amount, donorName, donorEmail, donorPhone, blessing, slipUrl, taxId, address } = body

    try {
      const donation = await prisma.donation.create({
        data: {
          amount: parseFloat(amount),
          donorName,
          donorEmail,
          donorPhone,
          blessing,
          slipUrl,
          taxId,
          address,
          status: 'pending'
        }
      })
      return { success: true, donation }
    } catch (dbError: any) {
      console.error('[Donation API] Database Error:', dbError)
      throw createError({
        statusCode: 500,
        statusMessage: 'ไม่สามารถบันทึกข้อมูลการบริจาคได้ กรุณาลองใหม่อีกครั้ง'
      })
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Internal Server Error'
    })
  }
})
