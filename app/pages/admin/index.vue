<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="text-sm font-medium text-gray-500 mb-1">ยอดบริจาคทั้งหมด</div>
          <div class="text-3xl font-bold text-slate-900">฿{{ data?.totalAmount?.toLocaleString() || 0 }}</div>
          <div class="mt-2 text-sm text-green-600 font-medium">อัปเดตล่าสุด: วันนี้</div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="text-sm font-medium text-gray-500 mb-1">จำนวนรายการ</div>
          <div class="text-3xl font-bold text-slate-900">{{ data?.donations?.length || 0 }} รายการ</div>
          <div class="mt-2 text-sm text-blue-600 font-medium">จากผู้บริจาคทั้งหมด</div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div class="text-sm font-medium text-gray-500 mb-1">สถานะระบบ</div>
          <div class="text-3xl font-bold text-green-600">Online</div>
          <div class="mt-2 text-sm text-gray-500 font-medium">Supabase Connected</div>
        </div>
      </div>

      <!-- Recent Donations Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 class="font-semibold text-gray-800">รายการบริจาคล่าสุด</h2>
          <div class="flex gap-2">
            <button @click="refresh" class="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1">
              <span>🔄 รีเฟรช</span>
            </button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th class="px-6 py-3">ผู้บริจาค</th>
                <th class="px-6 py-3 text-right">จำนวนเงิน</th>
                <th class="px-6 py-3">วันที่</th>
                <th class="px-6 py-3">คำอวยพร</th>
                <th class="px-6 py-3">หลักฐาน</th>
                <th class="px-6 py-3">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="donation in data?.donations" :key="donation.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-medium text-gray-900">{{ donation.donorName || 'ผู้ไม่ประสงค์ออกนาม' }}</td>
                <td class="px-6 py-4 text-right text-gray-700 font-bold">฿{{ donation.amount.toLocaleString() }}</td>
                <td class="px-6 py-4 text-gray-500 text-sm">{{ new Date(donation.date).toLocaleDateString('th-TH') }}</td>
                <td class="px-6 py-4 text-gray-500 text-sm italic">{{ donation.blessing || '-' }}</td>
                <td class="px-6 py-4 text-center">
                  <a v-if="donation.slipUrl" :href="donation.slipUrl" target="_blank" class="text-blue-500 hover:underline text-xs font-bold">ดูสลิป</a>
                  <span v-else class="text-gray-300">-</span>
                </td>
                <td class="px-6 py-4">
                  <span 
                    class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
                    :class="donation.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
                  >
                    {{ donation.status === 'completed' ? 'สำเร็จ' : 'รอยืนยัน' }}
                  </span>
                </td>
              </tr>
              <tr v-if="!data?.donations?.length">
                <td colspan="6" class="px-6 py-20 text-center">
                  <div class="text-4xl mb-4 opacity-20">📥</div>
                  <p class="text-slate-400 font-medium mb-4">ยังไม่มีข้อมูลการบริจาคในระบบ</p>
                  <button 
                    @click="seedData" 
                    :disabled="seeding"
                    class="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg"
                  >
                    {{ seeding ? 'กำลังสร้างข้อมูล...' : '✨ สร้างข้อมูลตัวอย่าง' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const { data, refresh } = await useFetch('/api/admin/donations')
const seeding = ref(false)

async function seedData() {
  seeding.value = true
  try {
    await $fetch('/api/admin/setup-db')
    await refresh()
    alert('สร้างข้อมูลจำลองสำเร็จ! 🎉')
  } catch (error) {
    alert('เกิดข้อผิดพลาดในการสร้างข้อมูล')
  } finally {
    seeding.value = false
  }
}
</script>
