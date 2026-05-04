<template>
  <div>
    <NuxtLayout name="admin">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ผู้เข้าชมทั้งหมด</div>
            <div class="text-3xl font-black text-emerald-600 tracking-tight">{{ stats?.totalVisits?.toLocaleString() || 0 }}</div>
          </div>
          <div class="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ตั้งแต่เริ่มบันทึกข้อมูล</div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">ผู้เข้าชมวันนี้</div>
            <div class="text-3xl font-black text-blue-600 tracking-tight">{{ stats?.todayVisits?.toLocaleString() || 0 }}</div>
          </div>
          <div class="mt-4 text-[10px] text-blue-500 font-bold uppercase tracking-tighter">รีเฟรชล่าสุด: {{ new Date().toLocaleTimeString('th-TH') }}</div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hidden lg:flex flex-col justify-between">
          <div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">เฉลี่ยต่อวัน (7 วันล่าสุด)</div>
            <div class="text-3xl font-black text-amber-500 tracking-tight">
              {{ Math.round((stats?.recentStats?.reduce((acc, curr) => acc + curr.count, 0) || 0) / 7) }}
            </div>
          </div>
          <div class="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">คำนวณจากข้อมูลย้อนหลัง</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Weekly Chart (Simple CSS implementation) -->
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
          <h2 class="font-bold text-slate-800 tracking-tight mb-6">สถิติย้อนหลัง 7 วัน</h2>
          <div class="flex items-end justify-between h-48 gap-2">
            <div v-for="day in last7Days" :key="day.date" class="flex-1 flex flex-col items-center gap-2 group">
              <div 
                class="w-full bg-emerald-100 group-hover:bg-emerald-500 transition-all duration-300 rounded-t-lg relative"
                :style="{ height: `${(day.count / maxVisits) * 100}%` }"
              >
                <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ day.count }}
                </div>
              </div>
              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                {{ day.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- Top Pages -->
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div class="px-8 py-6 border-b border-slate-50">
            <h2 class="font-bold text-slate-800 tracking-tight">หน้าเพจที่มีผู้เข้าชมสูงสุด</h2>
          </div>
          <div class="p-4">
            <div v-for="(page, index) in stats?.topPages" :key="page.path" class="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all">
              <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <div class="text-sm font-bold text-slate-700">{{ page.path }}</div>
                <div class="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full" :style="{ width: `${(page._count.path / stats.topPages[0]._count.path) * 100}%` }"></div>
                </div>
              </div>
              <div class="text-xs font-black text-slate-400">
                {{ page._count.path }} ครั้ง
              </div>
            </div>
          </div>
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

const { data: stats } = await useFetch('/api/admin/visitor-stats')

const last7Days = computed(() => {
  const days = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const found = stats.value?.recentStats?.find(s => s.date.startsWith(dateStr))
    days.push({
      date: dateStr,
      label: d.toLocaleDateString('th-TH', { weekday: 'short' }),
      count: found ? found.count : 0
    })
  }
  return days
})

const maxVisits = computed(() => {
  const counts = last7Days.value.map(d => d.count)
  return Math.max(...counts, 10)
})
</script>
