<script setup>
import { ref, computed } from 'vue'

const isMenuOpen = ref(false)

// ดึงข้อมูลการตั้งค่าจาก API
const { data: settings } = await useFetch('/api/admin/settings')

// แยกส่วนชื่อและโลโก้สำหรับ Navbar โดยเฉพาะ
const navbarTitle = computed(() => settings.value?.page_navbar?.title || settings.value?.mosque_name || 'มัสยิดบ้านสมเด็จ')
const navbarLogo = computed(() => settings.value?.page_navbar?.logo || settings.value?.logo_url || '')
const navbarIcon = computed(() => settings.value?.page_navbar?.icon || '')
</script>

<template>
    <nav class="bg-[#155d3a] shadow-md fixed top-0 left-0 w-full z-50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            <NuxtLink to="/" class="text-xl font-bold text-white flex items-center gap-3 group">
                <!-- ลำดับความสำคัญ: Icon เฉพาะ Navbar -> Logo เฉพาะ Navbar -> Emoji พื้นฐาน -->
                <div v-if="navbarLogo" class="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5 shadow-sm group-hover:scale-110 transition-transform overflow-hidden">
                    <img :src="navbarLogo" alt="Navbar Logo" class="w-full h-full object-contain">
                </div>
                <div v-else-if="navbarIcon" class="text-2xl group-hover:scale-110 transition-transform">
                    <img :src="navbarIcon" alt="Icon" class="w-8 h-8 object-contain">
                </div>
                <span v-else class="text-2xl group-hover:scale-110 transition-transform">🕌</span>

                <span class="group-hover:text-[#facc15] transition-colors">{{ navbarTitle }}</span>
            </NuxtLink>

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
            </ul>
        </div>
    </nav>
</template>