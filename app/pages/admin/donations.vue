<template>
  <div>
    <NuxtLayout name="admin">
      <div class="mb-8 flex justify-between items-end">
        <div>
          <h3 class="text-3xl font-black text-slate-800 mb-2">ตรวจสอบการโอนเงิน</h3>
          <p class="text-slate-500">ตรวจสอบหลักฐานและยืนยันยอดเงินบริจาคจากผู้มีจิตศรัทธา</p>
        </div>
        <button @click="refresh" class="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
          <span>🔄 รีเฟรชรายการ</span>
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-50 bg-slate-50/30">
                <th class="px-8 py-6">ผู้บริจาค</th>
                <th class="px-8 py-6 text-right">จำนวนเงิน</th>
                <th class="px-8 py-6">วันที่แจ้งโอน</th>
                <th class="px-8 py-6 text-center">หลักฐานสลิป</th>
                <th class="px-8 py-6 text-center">สถานะ</th>
                <th class="px-8 py-6 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="donation in data?.donations" :key="donation.id" class="group hover:bg-slate-50/50 transition-all duration-200">
                <td class="px-8 py-6">
                  <div>
                    <p class="font-bold text-slate-800">{{ donation.donorName || 'ผู้ไม่ประสงค์ออกนาม' }}</p>
                    <p class="text-[11px] text-slate-400 mt-1 italic leading-relaxed max-w-[200px] truncate" :title="donation.blessing">{{ donation.blessing || 'ไม่มีคำอวยพร' }}</p>
                  </div>
                </td>
                <td class="px-8 py-6 text-right font-black text-emerald-600 text-lg">
                  ฿{{ donation.amount.toLocaleString() }}
                </td>
                <td class="px-8 py-6 text-slate-500 text-xs">
                  {{ new Date(donation.date).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }} น.
                </td>
                
                <!-- Slip Column with Hover Preview -->
                <td class="px-8 py-6 text-center relative">
                  <div v-if="donation.slipUrl" class="relative inline-block group/slip">
                    <!-- ปุ่มดูสลิป -->
                    <a :href="donation.slipUrl" target="_blank" class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2">
                      <span>📸 ดูสลิป</span>
                    </a>
                    
                    <!-- Hover Preview Tooltip -->
                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[110] opacity-0 invisible group-hover/slip:opacity-100 group-hover/slip:visible transition-all duration-300 pointer-events-none">
                      <div class="bg-white p-2 rounded-2xl shadow-2xl border border-slate-200 w-48 overflow-hidden">
                        <img :src="donation.slipUrl" class="w-full z-30 h-auto rounded-xl shadow-inner" />
                        <p class="text-[9px] font-black text-center mt-2 text-slate-400 uppercase tracking-tighter">ตัวอย่างสลิปโอนเงิน</p>
                      </div>
                      <!-- ลูกศรชี้ลง -->
                      <div class="w-3 h-3 bg-white border-r border-b border-slate-200 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
                    </div>
                  </div>
                  <span v-else class="text-slate-300 text-xs italic">ไม่มีหลักฐาน</span>
                </td>

                <td class="px-8 py-6 text-center">
                  <span 
                    class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                    :class="donation.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'"
                  >
                    {{ donation.status === 'completed' ? 'ยืนยันแล้ว' : 'รอยืนยัน' }}
                  </span>
                </td>
                <td class="px-8 py-6">
                  <div class="flex items-center justify-center gap-2">
                    <button 
                      v-if="donation.status !== 'completed'"
                      @click="updateStatus(donation.id, 'completed')"
                      class="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
                    >
                      ยืนยัน
                    </button>
                    <button 
                      v-else
                      @click="updateStatus(donation.id, 'pending')"
                      class="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="!data?.donations?.length">
                <td colspan="6" class="px-8 py-24 text-center">
                  <div class="text-6xl mb-6 opacity-20 text-slate-200">📥</div>
                  <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">ไม่พบรายการบริจาคที่รอการตรวจสอบ</p>
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
  layout: false,
  middleware: 'auth'
})

const { data, refresh } = await useFetch('/api/admin/donations')

async function updateStatus(id, status) {
  try {
    const res = await $fetch('/api/admin/update-donation', {
      method: 'POST',
      body: { id, status }
    })
    if (res.success) {
      await refresh()
    }
  } catch (error) {
    alert('เกิดข้อผิดพลาด: ' + error.message)
  }
}
</script>
