<script setup>
import { ref } from 'vue'

useHead({
    title: 'กิจกรรม - มัสยิดดารุสสลาม'
})

// ข้อมูลจำลอง (เพิ่ม fullDescription สำหรับแสดงใน Popup)
const activities = ref([
    {
        id: 1,
        title: 'โครงการสอนศาสนาภาคฤดูร้อน',
        date: '10 พ.ค. 2026',
        description: 'ขอเชิญชวนเยาวชนในชุมชนเข้าร่วมโครงการเรียนรู้หลักการศาสนาและอ่านอัลกุรอานในช่วงปิดเทอม เพื่อใช้เวลาว่างให้เป็นประโยชน์และเสริมสร้างจริยธรรมที่ดีงาม',
        fullDescription: 'ขอเชิญชวนเยาวชนในชุมชนเข้าร่วมโครงการเรียนรู้หลักการศาสนาและอ่านอัลกุรอานในช่วงปิดเทอม เพื่อใช้เวลาว่างให้เป็นประโยชน์และเสริมสร้างจริยธรรมที่ดีงาม โครงการนี้จะจัดขึ้นทุกวันจันทร์ถึงศุกร์ เวลา 09.00 - 12.00 น. โดยมีวิทยากรผู้ทรงคุณวุฒิมาให้ความรู้ ทั้งเรื่องการอ่านอัลกุรอานที่ถูกต้อง (ตัจญ์วีด) ประวัติศาสตร์อิสลาม และมารยาทในชีวิตประจำวัน ฟรีตลอดโครงการ!',
        image: '/images/4.jpg'
    },
    {
        id: 2,
        title: 'กิจกรรมทำความสะอาดมัสยิด (Big Cleaning)',
        date: '25 เม.ย. 2026',
        description: 'รวมพลังสัปปุรุษและเยาวชนร่วมกันทำความสะอาด ปรับปรุงภูมิทัศน์บริเวณรอบมัสยิด เพื่อเตรียมความพร้อมต้อนรับเดือนรอมฎอนอันประเสริฐ',
        fullDescription: 'รวมพลังสัปปุรุษและเยาวชนร่วมกันทำความสะอาด ปรับปรุงภูมิทัศน์บริเวณรอบมัสยิด เพื่อเตรียมความพร้อมต้อนรับเดือนรอมฎอนอันประเสริฐ กิจกรรมเริ่มตั้งแต่เวลา 08.00 น. เป็นต้นไป โดยแบ่งพื้นที่รับผิดชอบทั้งในอาคารมัสยิด ลานจอดรถ และห้องน้ำ ทางมัสยิดมีอุปกรณ์ทำความสะอาดและอาหารกลางวัน (ข้าวหมกไก่) เลี้ยงรับรองผู้เข้าร่วมกิจกรรมทุกท่าน',
        image: '/images/2.jpg'
    },
    {
        id: 3,
        title: 'มอบถุงยังชีพแก่ผู้ยากไร้ในชุมชน',
        date: '15 เม.ย. 2026',
        description: 'คณะกรรมการมัสยิดดารุสสลามร่วมกับผู้นำชุมชน ลงพื้นที่แจกถุงยังชีพและข้าวสารอาหารแห้ง เพื่อบรรเทาความเดือดร้อนให้แก่พี่น้องที่ประสบปัญหาทางเศรษฐกิจ',
        fullDescription: 'คณะกรรมการมัสยิดดารุสสลามร่วมกับผู้นำชุมชน ลงพื้นที่แจกถุงยังชีพและข้าวสารอาหารแห้ง เพื่อบรรเทาความเดือดร้อนให้แก่พี่น้องที่ประสบปัญหาทางเศรษฐกิจ โดยครั้งนี้เราได้รับการสนับสนุนเงินบริจาคจากพี่น้องสัปปุรุษ จัดทำถุงยังชีพจำนวน 150 ชุด ภายในประกอบด้วย ข้าวสาร 5 กก., น้ำมันพืช, ปลากระป๋อง, อินทผลัม และยารักษาโรคเบื้องต้น',
        image: '/images/3.jpg'
    }
])

// ตัวแปรสำหรับ Popup
const isModalOpen = ref(false)
const selectedActivity = ref(null)

// ฟังก์ชันเปิด Popup
const openModal = (activity) => {
    selectedActivity.value = activity
    isModalOpen.value = true
    // ล็อกไม่ให้หน้าเว็บด้านหลังเลื่อนได้เวลาเปิด Popup
    if (typeof window !== 'undefined') {
        document.body.style.overflow = 'hidden'
    }
}

// ฟังก์ชันปิด Popup
const closeModal = () => {
    isModalOpen.value = false
    // คืนค่าให้หน้าเว็บเลื่อนได้ปกติ
    if (typeof window !== 'undefined') {
        document.body.style.overflow = 'auto'
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 pt-28 pb-20 relative">
        <div class="max-w-7xl mx-auto px-6">

            <div class="text-center mb-14">
                <h1 class="text-3xl md:text-4xl font-bold text-[#155d3a] tracking-tight">กิจกรรมของเรา</h1>
                <div class="w-16 h-1.5 bg-[#facc15] mx-auto mt-5 rounded-full"></div>
                <p class="text-gray-500 mt-5 max-w-2xl mx-auto text-lg">
                    ติดตามข่าวสารและภาพบรรยากาศกิจกรรมต่างๆ ที่จัดขึ้นเพื่อชุมชนและสังคม
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                <div v-for="activity in activities" :key="activity.id"
                    class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col overflow-hidden">

                    <div class="h-60 bg-gray-200 overflow-hidden relative">
                        <img :src="activity.image" :alt="activity.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out">
                        <div
                            class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-[#155d3a] shadow-sm">
                            {{ activity.date }}
                        </div>
                    </div>

                    <div class="p-7 flex flex-col flex-grow">
                        <h3
                            class="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#155d3a] transition-colors duration-300">
                            {{ activity.title }}
                        </h3>

                        <p class="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-grow">
                            {{ activity.description }}
                        </p>

                        <button @click="openModal(activity)"
                            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#155d3a]/10 text-[#155d3a] font-semibold rounded-xl hover:bg-[#155d3a] hover:text-white transition-all duration-300 w-fit">
                            อ่านเพิ่มเติม
                            <svg xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">

            <div @click="closeModal" class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"></div>

            <div
                class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[fadeIn_0.3s_ease-out]">

                <button @click="closeModal"
                    class="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow backdrop-blur-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div class="w-full h-64 sm:h-80 bg-gray-200 relative shrink-0">
                    <img :src="selectedActivity.image" :alt="selectedActivity.title" class="w-full h-full object-cover">
                </div>

                <div class="p-6 sm:p-8 overflow-y-auto">
                    <div
                        class="inline-block bg-[#155d3a]/10 text-[#155d3a] font-semibold px-4 py-1.5 rounded-full text-sm mb-4">
                        📅 {{ selectedActivity.date }}
                    </div>

                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 leading-tight">
                        {{ selectedActivity.title }}
                    </h2>

                    <p class="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                        {{ selectedActivity.fullDescription }}
                    </p>
                </div>

                <div class="p-6 border-t border-gray-100 flex justify-end shrink-0 bg-gray-50">
                    <button @click="closeModal"
                        class="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors">
                        ปิดหน้าต่าง
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<style>
/* สร้าง Animation เล็กๆ ให้ Popup เด้งขึ้นมาแบบนุ่มนวล */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>