<script setup>
import { ref } from 'vue'

// ตั้งค่า Title ของหน้า
useHead({
    title: 'ตารางเวลาละหมาด - มัสยิดดารุสสลาม'
})

// ข้อมูลตารางเวลาละหมาด (สามารถแก้ไขเวลาตรงนี้ได้เลย)
const prayerTimes = ref([
    { name: 'ซุบฮิ (Fajr)', time: '04:45' },
    { name: 'ดุฮ์ริ (Dhuhr)', time: '12:20' },
    { name: 'อัสริ (Asr)', time: '15:30' },
    { name: 'มักริบ (Maghrib)', time: '18:15' },
    { name: 'อีชา (Isha)', time: '19:30' }
])
</script>

<template>
    <div class="min-h-screen flex flex-col bg-gray-50 pt-28">

        <div class="flex-grow max-w-4xl mx-auto px-6 w-full mb-16">

            <div class="text-center mb-8">
                <h1 class="text-3xl md:text-4xl font-bold text-[#155d3a]">ตารางเวลาละหมาด (ประจำเดือน)</h1>
                <div class="w-16 h-1 bg-[#facc15] mx-auto mt-4 rounded-full"></div>
                <p class="text-gray-500 mt-6">เวลาอาจมีการเปลี่ยนแปลงตามการดูดวงจันทร์ กรุณาตรวจสอบอีกครั้ง</p>
            </div>

            <div class="bg-white rounded-xl shadow-md overflow-hidden max-w-3xl mx-auto">

                <div class="bg-[#155d3a] text-white font-semibold px-6 py-4 grid grid-cols-2 gap-4">
                    <div>เวลาละหมาด</div>
                    <div>เวลา (น.)</div>
                </div>

                <div class="flex flex-col">
                    <div v-for="(prayer, index) in prayerTimes" :key="index"
                        class="px-6 py-5 grid grid-cols-2 gap-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <div class="text-gray-700">{{ prayer.name }}</div>
                        <div class="text-gray-900 font-bold">{{ prayer.time }}</div>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>