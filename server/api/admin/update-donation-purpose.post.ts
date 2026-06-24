import { prisma } from '../../utils/prisma'

/**
 * API สำหรับแอดมินแก้ไขวัตถุประสงค์การบริจาค (Update Donation Purpose API)
 */
export default defineEventHandler(async (event) => {
  // ตรวจสอบสิทธิ์ (ถ้ามี middleware ตรวจจับแล้วก็ผ่านได้)
  const user = event.context.user
  
  try {
    const body = await readBody(event)
    const { id, purpose } = body

    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'ข้อมูลไม่ครบถ้วน (ต้องการรหัสอ้างอิง)' })
    }

    const updated = await prisma.donation.update({
      where: { id: parseInt(id) },
      data: { purpose }
    })

    return { success: true, data: updated }
  } catch (error: any) {
    console.error('Update Donation Purpose Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'ไม่สามารถอัปเดตข้อมูลได้'
    })
  }
})
