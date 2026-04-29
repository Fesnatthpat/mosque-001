<script setup lang="ts">
// ไม่จำเป็นต้องมีตัวแปรเพิ่มเติมสำหรับ Footer ที่เป็นข้อมูลคงที่ครับ
</script>

<template>
    <footer class="bg-[#104b2e] text-white pt-14 pb-6 mt-auto border-t-[6px] border-[#d6a848]">
        <div class="max-w-7xl mx-auto px-6">

            <div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 mb-10">

                <div>
                    <div class="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                        🕌 มัสยิดบ้านสมเด็จ
                    </div>
                    <p class="text-gray-300 leading-relaxed text-sm pr-4">
                        ศูนย์รวมจิตใจ สันติสุข และความร่มเย็นของชุมชน เรายินดีต้อนรับทุกท่านด้วยความอบอุ่นและมิตรภาพ
                    </p>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-5 text-white border-b-2 border-[#155d3a] pb-2 inline-block">
                        ลิงก์ด่วน</h3>
                    <ul class="space-y-3 text-gray-300 text-sm">
                        <li>
                            <NuxtLink to="/" class="hover:text-[#facc15] transition-colors flex items-center gap-2">
                                <span class="text-[#d6a848] text-xs">▶</span> หน้าแรก
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/history"
                                class="hover:text-[#facc15] transition-colors flex items-center gap-2">
                                <span class="text-[#d6a848] text-xs">▶</span> ประวัติความเป็นมา
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/timetable"
                                class="hover:text-[#facc15] transition-colors flex items-center gap-2">
                                <span class="text-[#d6a848] text-xs">▶</span> ตารางเวลาละหมาด
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/activities"
                                class="hover:text-[#facc15] transition-colors flex items-center gap-2">
                                <span class="text-[#d6a848] text-xs">▶</span> กิจกรรม
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/donate"
                                class="hover:text-[#facc15] transition-colors flex items-center gap-2">
                                <span class="text-[#d6a848] text-xs">▶</span> ร่วมบริจาค
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 class="text-lg font-semibold mb-5 text-white border-b-2 border-[#155d3a] pb-2 inline-block">
                        ข้อมูลติดต่อ</h3>
                    <ul class="space-y-4 text-gray-300 text-sm">
                        <li class="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#d6a848] shrink-0 mt-0.5"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>แขวงสมเด็จเจ้าพระยา เขตคลองสาน<br>กรุงเทพมหานคร 10600</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#d6a848] shrink-0" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span>02-XXX-XXXX</span>
                        </li>
                    </ul>
                </div>

            </div>

            <div class="w-full h-px bg-[#1a6e45] mb-6"></div>

            <div
                class="text-center md:flex md:justify-between md:items-center text-gray-400 text-xs space-y-2 md:space-y-0">
                <p>&copy; 2026 มัสยิดบ้านสมเด็จ. สงวนลิขสิทธิ์.</p>
                <p>ออกแบบและพัฒนาเพื่อชุมชน</p>
            </div>

        </div>
    </footer>
</template>