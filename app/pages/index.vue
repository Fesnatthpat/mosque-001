<script setup lang="ts">
import { ref, computed } from 'vue'

// 1. สร้างตัวแปรเก็บยอดบริจาครวม (คุณสามารถแก้ไขตัวเลขตรงนี้ หรือเชื่อมต่อ API ในอนาคตได้)
const donationAmount = ref(1250500)

// 2. ฟังก์ชันช่วยจัดรูปแบบตัวเลขให้มีลูกน้ำ (เช่น 1,250,500)
const formattedAmount = computed(() => {
    return new Intl.NumberFormat('th-TH').format(donationAmount.value)
})
</script>

<template>
    <div class="bg-gray-50 font-sans min-h-screen">

        <header
            class="h-[80vh] flex justify-center items-center text-center text-white px-5 bg-center bg-cover bg-no-repeat bg-[linear-gradient(rgba(10,61,42,0.7),rgba(17,94,65,0.85)),url('../images/background.jpg')]">
            <div class="max-w-[800px] flex flex-col items-center">
                <h1
                    class="text-[2.2rem] md:text-[3.5rem] mb-[15px] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)] font-bold leading-tight">
                    ยินดีต้อนรับสู่ มัสยิดบ้านสมเด็จ
                </h1>
                <p class="text-[1.1rem] md:text-[1.3rem] mb-[30px] text-[#f1f1f1]">
                    ศูนย์รวมจิตใจ สันติสุข และความร่มเย็นของชุมชน
                </p>

                <div
                    class="mb-[30px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg w-full max-w-sm mx-auto transform hover:scale-105 transition-transform duration-300">
                    <p class="text-green-100 text-sm md:text-base mb-1 font-medium">ยอดบริจาคสมทบทุนบำรุงมัสยิด</p>
                    <div class="text-3xl md:text-4xl font-bold text-[#facc15] tracking-wide drop-shadow-md">
                        {{ formattedAmount }} <span class="text-lg md:text-xl text-white font-normal">บาท</span>
                    </div>
                </div>

                <a href="#about"
                    class="inline-block px-8 py-3 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300">
                    เรียนรู้เพิ่มเติม
                </a>
            </div>
        </header>

        <section id="about" class="max-w-7xl mx-auto px-5 py-16 text-center">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">เกี่ยวกับมัสยิดของเรา</h2>
                <div class="w-16 h-1 bg-green-700 mx-auto rounded"></div>
            </div>
            <p class="text-gray-600 text-lg max-w-3xl mx-auto mb-10">
                มัสยิดแห่งนี้สร้างขึ้นเพื่อเป็นสถานที่ประกอบศาสนกิจและศูนย์กลางในการทำกิจกรรมต่างๆ ของชุมชน
                เรายินดีต้อนรับทุกท่านด้วยความอบอุ่นและมิตรภาพ
            </p>

            <div class="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[30px] mt-8">
                <div class="group overflow-hidden rounded-xl shadow-sm h-[250px] md:h-auto md:aspect-[4/3]">
                    <img src="/images/2.jpg" alt="รูปภาพมัสยิด 1"
                        class="w-full h-full object-cover block transition-transform duration-500 ease-in-out group-hover:scale-110">
                </div>
                <div class="group overflow-hidden rounded-xl shadow-sm h-[250px] md:h-auto md:aspect-[4/3]">
                    <img src="/images/3.jpg" alt="รูปภาพมัสยิด 2"
                        class="w-full h-full object-cover block transition-transform duration-500 ease-in-out group-hover:scale-110">
                </div>
                <div class="group overflow-hidden rounded-xl shadow-sm h-[250px] md:h-auto md:aspect-[4/3]">
                    <img src="/images/4.jpg" alt="รูปภาพมัสยิด 3"
                        class="w-full h-full object-cover block transition-transform duration-500 ease-in-out group-hover:scale-110">
                </div>
            </div>
        </section>

    </div>
</template>