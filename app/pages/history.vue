<script setup lang="ts">
const { data: settings } = await useFetch('/api/admin/settings')

const pageData = computed(() => settings.value?.page_history || {
    title: 'ประวัติความเป็นมา',
    content_top: 'มัสยิดบ้านสมเด็จ ก่อตั้งขึ้นเมื่อปี พ.ศ. ... โดยการร่วมแรงร่วมใจของสัปปุรุษในชุมชน...',
    image: '/images/home5.jpg',
    content_bottom: 'ปัจจุบันได้รับการบูรณะและพัฒนาจนกลายเป็นศูนย์กลางของชุมชน...'
})

useHead({
    title: `${pageData.value.title} - มัสยิดบ้านสมเด็จ`
})
</script>

<template>
    <div>
        <div class="min-h-screen bg-gray-50 pt-28 pb-16">
            <div class="max-w-4xl mx-auto px-6">

                <div class="text-center mb-10">
                    <h1 class="text-3xl md:text-4xl font-bold text-[#155d3a]">{{ pageData.title }}</h1>
                    <div class="w-16 h-1 bg-[#facc15] mx-auto mt-4 rounded-full"></div>
                </div>

                <p class="text-gray-700 text-lg leading-relaxed mb-8 whitespace-pre-line">
                    {{ pageData.content_top }}
                </p>

                <div class="mb-10 flex justify-center">
                    <img :src="pageData.image" alt="ภาพประวัติมัสยิด"
                        class="w-full max-w-3xl rounded-xl shadow-md object-cover">
                </div>

                <p class="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto whitespace-pre-line">
                    {{ pageData.content_bottom }}
                </p>

            </div>
        </div>
    </div>
</template>
