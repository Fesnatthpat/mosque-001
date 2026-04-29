<script setup>
import { ref } from 'vue'

// สร้างตัวแปรสำหรับเก็บสถานะเปิด/ปิดเมนู
// เริ่มต้นให้เป็น false (ปิดอยู่)
const isMenuOpen = ref(false)
</script>

<template>
    <nav class="bg-[#155d3a] shadow-md fixed top-0 left-0 w-full z-50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            <div class="text-xl font-bold text-white flex items-center gap-2">
                🕌 มัสยิดบ้านสมเด็จ
            </div>

            <ul class="hidden md:flex space-x-8 text-white font-medium">
                <li>
                    <NuxtLink to="/"
                        class="pb-1 border-b-2 border-transparent hover:text-[#facc15] hover:border-[#facc15] transition-colors duration-300 block"
                        active-class="!text-[#facc15] !border-[#facc15]">หน้าแรก</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/history"
                        class="pb-1 border-b-2 border-transparent hover:text-[#facc15] hover:border-[#facc15] transition-colors duration-300 block"
                        active-class="!text-[#facc15] !border-[#facc15]">ประวัติความเป็นมา</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/timetable"
                        class="pb-1 border-b-2 border-transparent hover:text-[#facc15] hover:border-[#facc15] transition-colors duration-300 block"
                        active-class="!text-[#facc15] !border-[#facc15]">ตารางเวลาละหมาด</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/activities"
                        class="pb-1 border-b-2 border-transparent hover:text-[#facc15] hover:border-[#facc15] transition-colors duration-300 block"
                        active-class="!text-[#facc15] !border-[#facc15]">กิจกรรม</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/donate"
                        class="pb-1 border-b-2 border-transparent hover:text-[#facc15] hover:border-[#facc15] transition-colors duration-300 block"
                        active-class="!text-[#facc15] !border-[#facc15]">ร่วมบริจาค</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/contact"
                        class="pb-1 border-b-2 border-transparent hover:text-[#facc15] hover:border-[#facc15] transition-colors duration-300 block"
                        active-class="!text-[#facc15] !border-[#facc15]">ติดต่อเรา</NuxtLink>
                </li>
            </ul>

            <button @click="isMenuOpen = !isMenuOpen"
                class="md:hidden flex flex-col space-y-1.5 cursor-pointer focus:outline-none" aria-label="Toggle Menu">
                <span class="w-6 h-0.5 bg-white block transition-all duration-300"
                    :class="{ 'rotate-45 translate-y-2': isMenuOpen }"></span>
                <span class="w-6 h-0.5 bg-white block transition-all duration-300"
                    :class="{ 'opacity-0': isMenuOpen }"></span>
                <span class="w-6 h-0.5 bg-white block transition-all duration-300"
                    :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"></span>
            </button>

        </div>

        <div v-show="isMenuOpen"
            class="md:hidden bg-[#124d30] border-t border-[#1a6e45] absolute w-full left-0 shadow-lg">
            <ul class="flex flex-col px-6 py-4 text-white font-medium space-y-4 justify-center items-center">
                <li>
                    <NuxtLink @click="isMenuOpen = false" to="/"
                        class="block py-2 border-b border-transparent hover:text-[#facc15] transition-colors duration-300"
                        active-class="!text-[#facc15]">หน้าแรก</NuxtLink>
                </li>
                <li>
                    <NuxtLink @click="isMenuOpen = false" to="/history"
                        class="block py-2 border-b border-transparent hover:text-[#facc15] transition-colors duration-300"
                        active-class="!text-[#facc15]">ประวัติความเป็นมา</NuxtLink>
                </li>
                <li>
                    <NuxtLink @click="isMenuOpen = false" to="/timetable"
                        class="block py-2 border-b border-transparent hover:text-[#facc15] transition-colors duration-300"
                        active-class="!text-[#facc15]">ตารางเวลาละหมาด</NuxtLink>
                </li>
                <li>
                    <NuxtLink @click="isMenuOpen = false" to="/activities"
                        class="block py-2 border-b border-transparent hover:text-[#facc15] transition-colors duration-300"
                        active-class="!text-[#facc15]">กิจกรรม</NuxtLink>
                </li>
                <li>
                    <NuxtLink @click="isMenuOpen = false" to="/donate"
                        class="block py-2 border-b border-transparent hover:text-[#facc15] transition-colors duration-300"
                        active-class="!text-[#facc15]">ร่วมบริจาค</NuxtLink>
                </li>
                <li>
                    <NuxtLink @click="isMenuOpen = false" to="/contact"
                        class="block py-2 border-b border-transparent hover:text-[#facc15] transition-colors duration-300"
                        active-class="!text-[#facc15]">ติดต่อเรา</NuxtLink>
                </li>
            </ul>
        </div>
    </nav>
</template>