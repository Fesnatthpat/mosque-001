<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ยอดบริจาคทั้งหมด</div>
            <div class="text-3xl font-black text-emerald-600 tracking-tight">฿{{ data?.totalAmount?.toLocaleString() || 0 }}</div>
          </div>
          <div class="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">อัปเดตล่าสุด: วันนี้</div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">จำนวนรายการ</div>
            <div class="text-3xl font-black text-slate-800 tracking-tight">{{ data?.donations?.length || 0 }} รายการ</div>
          </div>
          <div class="mt-4 text-[10px] text-blue-500 font-bold uppercase tracking-tighter">รวมรายการรอยืนยัน</div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hidden lg:flex flex-col justify-between">
          <div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">สถานะฐานข้อมูล</div>
            <div class="text-3xl font-black text-emerald-500 tracking-tight">Connected</div>
          </div>
          <div class="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Supabase AWS Singapore</div>
        </div>
      </div>

      <!-- Recent Donations Table -->
      <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div class="px-6 py-5 md:px-8 md:py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h2 class="font-bold text-slate-800 tracking-tight">รายการบริจาคล่าสุด</h2>
          <button @click="refresh" class="p-2 md:px-4 md:py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <span>🔄 <span class="hidden md:inline">รีเฟรชข้อมูล</span></span>
          </button>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr class="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-50">
                <th class="px-6 py-4 md:px-8 md:py-5">ผู้บริจาค</th>
                <th class="px-6 py-4 md:px-8 md:py-5 text-right">จำนวนเงิน</th>
                <th class="px-6 py-4 md:px-8 md:py-5 hidden md:table-cell">วันที่</th>
                <th class="px-6 py-4 md:px-8 md:py-5 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="donation in data?.donations" :key="donation.id" class="group hover:bg-slate-50/50 transition-all duration-200">
                <td class="px-6 py-4 md:px-8 md:py-5">
                  <div class="font-bold text-slate-700">{{ donation.donorName || 'ผู้ไม่ประสงค์ออกนาม' }}</div>
                  <div class="text-[10px] text-slate-400 md:hidden mt-0.5">{{ new Date(donation.date).toLocaleDateString('th-TH') }}</div>
                </td>
                <td class="px-6 py-4 md:px-8 md:py-5 text-right font-black text-slate-900">
                  ฿{{ donation.amount.toLocaleString() }}
                </td>
                <td class="px-6 py-4 md:px-8 md:py-5 text-slate-500 hidden md:table-cell">
                  {{ new Date(donation.date).toLocaleDateString('th-TH') }}
                </td>
                <td class="px-6 py-4 md:px-8 md:py-5 text-center">
                  <span 
                    class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
                    :class="donation.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'"
                  >
                    {{ donation.status === 'completed' ? 'Success' : 'Pending' }}
                  </span>
                </td>
              </tr>
              <tr v-if="!data?.donations?.length">
                <td colspan="4" class="px-8 py-20 text-center">
                  <div class="text-4xl mb-4 opacity-20">📥</div>
                  <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">ยังไม่มีข้อมูลการบริจาค</p>
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
</script>
