<script setup lang="ts">
const supabase = useSupabaseClient()
const { data: settings } = await useFetch('/api/admin/settings')

const pageData = computed(() => settings.value?.page_donate || {
    title: 'ร่วมบริจาคสมทบทุน',
    description: 'การบริจาคของคุณจะถูกนำไปใช้เพื่อทำนุบำรุงมัสยิดและช่วยเหลือผู้ยากไร้ในชุมชน',
    qr_image: '/images/qr.png'
})

// ฟอร์มบริจาค
const form = ref({
    amount: '',
    donorName: '',
    blessing: '',
    slipUrl: '',
    requestTaxInvoice: false,
    taxId: '',
    address: ''
})

const isUploading = ref(false)
const isSubmitting = ref(false)
const localSlipPreview = ref('')

async function handleSlipUpload(event: any) {
    const file = event.target.files[0]
    if (!file) return

    isUploading.value = true
    localSlipPreview.value = URL.createObjectURL(file)

    const fileExt = file.name.split('.').pop()
    const fileName = `slip_${Date.now()}.${fileExt}`
    const filePath = `slips/${fileName}`

    try {
        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath)

        form.value.slipUrl = publicUrl
    } catch (error: any) {
        alert('อัปโหลดสลิปล้มเหลว: ' + error.message)
    } finally {
        isUploading.value = false
    }
}

async function submitDonation() {
    if (!form.value.amount || !form.value.slipUrl) {
        alert('กรุณากรอกจำนวนเงินและแนบสลิปการโอนเงินครับ')
        return
    }

    isSubmitting.value = true
    try {
        await $fetch('/api/donate', {
            method: 'POST',
            body: form.value
        })
        alert('ส่งข้อมูลการบริจาคเรียบร้อยแล้ว! ขออัลลอฮ์ทรงตอบแทนความดีท่าน 🎉')
        // Reset form
        form.value = { amount: '', donorName: '', blessing: '', slipUrl: '' }
        localSlipPreview.value = ''
    } catch (error: any) {
        alert('เกิดข้อผิดพลาด: ' + error.message)
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 pt-28 pb-16 font-['Prompt']">
        <div class="max-w-6xl mx-auto px-6">
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-5xl font-black text-[#155d3a] mb-4 uppercase">{{ pageData.title }}</h1>
                <div class="w-20 h-1.5 bg-[#facc15] mx-auto rounded-full shadow-sm"></div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                <!-- ฝั่งซ้าย: ข้อมูลการโอน (QR Code) -->
                <div class="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-xl overflow-hidden border border-slate-100 p-6 md:p-12 text-center">
                    <p class="text-slate-600 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                        {{ pageData.description }}
                    </p>

                    <div class="mb-8 inline-block p-4 md:p-6 bg-emerald-50 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-emerald-200">
                        <img :src="pageData.qr_image" alt="QR Code สำหรับบริจาค"
                            class="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain mx-auto rounded-2xl shadow-sm">
                    </div>

                    <div class="space-y-4 max-w-sm mx-auto">
                        <div class="bg-slate-900 p-5 rounded-2xl flex items-center justify-center gap-4 shadow-lg">
                            <span class="text-3xl">🏦</span>
                            <div class="text-left">
                                <p class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">ชื่อบัญชี</p>
                                <p class="font-bold text-white text-lg leading-tight">มัสยิดบ้านสมเด็จ (เพื่อการกุศล)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ฝั่งขวา: ฟอร์มกรอกข้อมูลและแนบสลิป -->
                <div class="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 md:p-12">
                    <h2 class="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                        <span class="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">📝</span>
                        แจ้งข้อมูลการโอนเงิน
                    </h2>

                    <form @submit.prevent="submitDonation" class="space-y-8">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ชื่อผู้บริจาค</label>
                                <input v-model="form.donorName" type="text" placeholder="ระบุชื่อ (หรือไม่ระบุก็ได้)" class="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold" />
                            </div>
                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">จำนวนเงิน (บาท) *</label>
                                <input v-model="form.amount" type="number" step="0.01" required placeholder="ระบุจำนวนเงิน..." class="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-emerald-600 text-xl" />
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">คำอวยพร / ข้อความ</label>
                            <textarea v-model="form.blessing" rows="3" placeholder="ข้อความถึงมัสยิด..." class="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium"></textarea>
                        </div>

                        <div class="space-y-4">
                            <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all" @click="form.requestTaxInvoice = !form.requestTaxInvoice">
                                <div class="w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all" :class="form.requestTaxInvoice ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'">
                                    <span v-if="form.requestTaxInvoice" class="text-white text-xs">✓</span>
                                </div>
                                <span class="text-sm font-bold text-slate-700">ต้องการใบกำกับภาษี / ใบอนุโมทนาบัตร</span>
                            </div>

                            <transition name="fade">
                                <div v-if="form.requestTaxInvoice" class="space-y-4 p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100">
                                    <div class="space-y-2">
                                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขประจำตัวผู้เสียภาษี / เลขบัตรประชาชน</label>
                                        <input v-model="form.taxId" type="text" placeholder="ระบุเลข 13 หลัก..." class="w-full px-5 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold shadow-sm" />
                                    </div>
                                    <div class="space-y-2">
                                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ที่อยู่สำหรับการจัดส่ง / ออกเอกสาร</label>
                                        <textarea v-model="form.address" rows="3" placeholder="ระบุที่อยู่โดยละเอียด..." class="w-full px-5 py-4 bg-white border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium shadow-sm"></textarea>
                                    </div>
                                </div>
                            </transition>
                        </div>

                        <div class="space-y-4">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">แนบรูปภาพสลิป *</label>
                            <div class="relative group">
                                <div v-if="localSlipPreview" class="relative w-full h-64 rounded-[2rem] overflow-hidden border-4 border-white shadow-md mb-4 bg-slate-100">
                                    <img :src="localSlipPreview" class="w-full h-full object-contain" />
                                    <div v-if="isUploading" class="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                        <div class="flex flex-col items-center gap-3">
                                            <div class="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span class="text-white text-xs font-bold uppercase tracking-widest">กำลังอัปโหลด...</span>
                                        </div>
                                    </div>
                                    <button type="button" @click="localSlipPreview = ''; form.slipUrl = ''" class="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur text-rose-500 rounded-full shadow-lg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">✕</button>
                                </div>
                                <label v-else class="flex flex-col items-center justify-center w-full h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:bg-slate-100 transition-all group">
                                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                        <span class="text-4xl mb-4 group-hover:scale-110 transition-transform">📸</span>
                                        <p class="mb-2 text-sm text-slate-500 font-bold uppercase tracking-widest">คลิกเพื่อแนบรูปสลิป</p>
                                        <p class="text-[10px] text-slate-400">JPG, PNG หรือ PDF</p>
                                    </div>
                                    <input type="file" @change="handleSlipUpload" class="hidden" accept="image/*" />
                                </label>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            :disabled="isSubmitting || isUploading"
                            class="w-full py-5 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-lg"
                        >
                            <span v-if="isSubmitting" class="flex items-center justify-center gap-3">
                                <div class="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                กำลังส่งข้อมูล...
                            </span>
                            <span v-else>ยืนยันการบริจาค ✨</span>
                        </button>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>
