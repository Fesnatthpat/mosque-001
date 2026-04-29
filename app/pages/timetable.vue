<script setup lang="ts">
const { data: settings } = await useFetch('/api/admin/settings')

const timetable = computed(() => settings.value?.page_timetable || {
    fajr: '05:00',
    sunrise: '06:15',
    dhuhr: '12:30',
    asr: '15:45',
    maghrib: '18:45',
    isha: '20:00'
})

const prayers = computed(() => [
    { name: 'ซุบฮิ (Fajr)', time: timetable.value.fajr, icon: '🌅' },
    { name: 'ชูรูก (Sunrise)', time: timetable.value.sunrise, icon: '☀️' },
    { name: 'ดุฮริ (Dhuhr)', time: timetable.value.dhuhr, icon: '☀️' },
    { name: 'อัศริ (Asr)', time: timetable.value.asr, icon: '🌤️' },
    { name: 'มัฆริบ (Maghrib)', time: timetable.value.maghrib, icon: '🌇' },
    { name: 'อิชา (Isha)', time: timetable.value.isha, icon: '🌙' }
])
</script>

<template>
    <div class="min-h-screen bg-gray-50 pt-32 pb-20 font-['Prompt']">
        <div class="max-w-5xl mx-auto px-6">
            <div class="text-center mb-16">
                <h1 class="text-4xl md:text-5xl font-black text-[#155d3a] mb-4 uppercase tracking-tighter">ตารางเวลาละหมาด</h1>
                <div class="w-24 h-1.5 bg-[#facc15] mx-auto rounded-full"></div>
                <p class="mt-6 text-slate-500 font-medium">เวลาละหมาดประจำวันสำหรับมัสยิดบ้านสมเด็จ</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div 
                    v-for="prayer in prayers" 
                    :key="prayer.name"
                    class="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                >
                    <div class="text-5xl mb-6 group-hover:scale-120 transition-transform duration-500">{{ prayer.icon }}</div>
                    <h3 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">{{ prayer.name }}</h3>
                    <div class="text-4xl font-black text-slate-800 tracking-tight">{{ prayer.time }}</div>
                </div>
            </div>

            <div class="mt-16 p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-6">
                <div class="text-4xl">🕌</div>
                <div>
                    <h4 class="font-bold text-emerald-800">หมายเหตุ</h4>
                    <p class="text-sm text-emerald-600 leading-relaxed">เวลาที่แสดงเป็นเวลาโดยประมาณ อาจมีการคลาดเคลื่อนตามตำแหน่งพิกัดและฤดูกาล กรุณายึดตามเสียงอาซานจากมัสยิดเป็นหลัก</p>
                </div>
            </div>
        </div>
    </div>
</template>
