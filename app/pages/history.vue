<script setup lang="ts">
// สามารถตั้งค่า Title ของหน้าเว็บได้ที่นี่ (ตัวเลือกเสริมสำหรับ Nuxt)
useHead({
    title: 'ประวัติความเป็นมา - มัสยิดดารุสสลาม'
})
</script>


<template>
    <div>
        <div class="min-h-screen bg-gray-50 pt-28 pb-16">
            <div class="max-w-4xl mx-auto px-6">

                <div class="text-center mb-10">
                    <h1 class="text-3xl md:text-4xl font-bold text-[#155d3a]">ประวัติความเป็นมา</h1>
                    <div class="w-16 h-1 bg-[#facc15] mx-auto mt-4 rounded-full"></div>
                </div>

                <p class="text-gray-700 text-lg leading-relaxed mb-8">
                    มัสยิดบ้านสมเด็จ ก่อตั้งขึ้นเมื่อปี พ.ศ. ... โดยการร่วมแรงร่วมใจของสัปปุรุษในชุมชน
                    ที่มีความมุ่งมั่นจะสร้างสถานที่อันทรงเกียรติสำหรับการเคารพภักดีต่อองค์อัลลอฮ์ (ซ.บ.)
                </p>

                <div class="mb-10 flex justify-center">
                    <img src="/images/home5.jpg" alt="ภาพประวัติมัสยิดบ้านสมเด็จ"
                        class="w-full max-w-3xl rounded-xl shadow-md object-cover">
                </div>

                <p class="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
                    เริ่มต้นจากอาคารไม้เล็กๆ ที่ใช้เป็นสถานที่ละหมาดและสอนศาสนาให้แก่เยาวชน
                    ปัจจุบันได้รับการบูรณะและพัฒนาจนกลายเป็นศูนย์กลางของชุมชน ที่ไม่เพียงแต่เป็นที่ประกอบศาสนกิจ
                    แต่ยังเป็นแหล่งเรียนรู้และช่วยเหลือสังคม
                </p>

            </div>
        </div>
    </div>
</template>