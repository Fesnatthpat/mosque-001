<script setup>
import { ref } from 'vue'

// ตั้งค่า Title ของหน้า
useHead({
    title: 'ร่วมบริจาค - มัสยิดดารุสสลาม'
})

// ตัวแปรสำหรับแสดงข้อความ "คัดลอกแล้ว"
const copied = ref(false)

// ฟังก์ชันสำหรับคัดลอกเลขบัญชี
const copyAccountNumber = async () => {
    try {
        await navigator.clipboard.writeText('123-1-23456-7')
        copied.value = true
        // ซ่อนข้อความคัดลอกแล้วหลังจากผ่านไป 3 วินาที
        setTimeout(() => {
            copied.value = false
        }, 3000)
    } catch (err) {
        console.error('Failed to copy text: ', err)
    }
}

// ฟังก์ชันเมื่อกดส่งฟอร์ม (คุณสามารถนำไปต่อยอดส่งเข้า API ทีหลังได้)
const submitDonation = () => {
    alert('ขอบคุณสำหรับการบริจาค ข้อมูลของคุณถูกส่งเรียบร้อยแล้ว')
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 pt-28 pb-20">
        <div class="max-w-5xl mx-auto px-6">

            <div class="text-center mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-[#155d3a] tracking-tight mb-4">ร่วมบริจาคและสนับสนุน</h1>
                <p class="text-gray-500 text-lg">
                    "การบริจาคไม่ได้ทำให้ทรัพย์สินลดน้อยลง" ร่วมเป็นส่วนหนึ่งในการบำรุงรักษาและดำเนินกิจกรรมของมัสยิด
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-8">

                <div class="md:col-span-5">
                    <div
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 border-t-4 border-t-[#d6a848] p-8 flex flex-col items-center">

                        <h2 class="text-lg font-bold text-gray-800 mb-1">สแกนเพื่อบริจาค</h2>
                        <p class="text-gray-500 text-sm mb-6">พร้อมเพย์ (PromptPay)</p>

                        <div class="border border-dashed border-gray-300 p-4 rounded-xl mb-6 bg-white">
                            <img src="/images/qr.png" alt="QR Code พร้อมเพย์" class="w-48 h-48 object-contain">
                        </div>

                        <div class="bg-[#f4f7f6] w-full rounded-xl p-5 text-sm text-gray-700 space-y-2">
                            <div class="flex justify-between">
                                <span class="font-bold">ชื่อบัญชี:</span>
                                <span>มัสยิดดารุสสลาม</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="font-bold">เลขที่บัญชี:</span>
                                <div class="flex items-center gap-2">
                                    <span id="account-number">123-1-23456-7</span>
                                    <button @click="copyAccountNumber"
                                        class="text-[#155d3a] hover:text-[#d6a848] transition-colors"
                                        title="คัดลอกเลขบัญชี">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-bold">ธนาคาร:</span>
                                <span>อิสลามแห่งประเทศไทย</span>
                            </div>
                        </div>

                        <p v-if="copied" class="text-green-600 text-xs mt-3 font-semibold">คัดลอกเลขบัญชีแล้ว!</p>

                    </div>
                </div>

                <div class="md:col-span-7">
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">

                        <div class="flex items-center gap-3 mb-8">
                            <div class="w-1.5 h-6 bg-[#155d3a] rounded-full"></div>
                            <h2 class="text-xl font-bold text-gray-800">แจ้งข้อมูลการบริจาค</h2>
                        </div>

                        <form @submit.prevent="submitDonation" class="space-y-5">

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">ชื่อ - นามสกุล (หรือ
                                    "ไม่ประสงค์ออกนาม")</label>
                                <input type="text" placeholder="ระบุชื่อของคุณ"
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155d3a]/30 focus:border-[#155d3a] transition-colors">
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">จำนวนเงินบริจาค
                                    (บาท)</label>
                                <input type="number" placeholder="0.00"
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155d3a]/30 focus:border-[#155d3a] transition-colors">
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">คำอธิษฐาน /
                                    ข้อความเพิ่มเติม</label>
                                <textarea rows="3" placeholder="ขอพระองค์ตอบแทนความดีงาม..."
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#155d3a]/30 focus:border-[#155d3a] transition-colors resize-none"></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">แนบหลักฐานการโอนเงิน
                                    (สลิป)</label>
                                <div
                                    class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                    <input type="file" accept="image/png, image/jpeg"
                                        class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer">
                                    <p class="text-xs text-gray-400 mt-3">รองรับไฟล์รูปภาพ JPG, PNG</p>
                                </div>
                            </div>

                            <button type="submit"
                                class="w-full py-3.5 bg-[#d6a848] hover:bg-[#c2963d] text-white font-bold rounded-lg shadow-md transition-colors mt-4">
                                ส่งข้อมูลการบริจาค
                            </button>

                        </form>

                    </div>
                </div>

            </div>
        </div>
    </div>
</template>