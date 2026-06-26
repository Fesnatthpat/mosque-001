<script setup lang="ts">
/**
 * ส่วนการรับบริจาค (Donate Section)
 */
const supabase = useSupabaseClient()
const { data: settings } = await useFetch('/api/settings')

const pageData = computed(() => settings.value?.page_donate || {
    title: 'ร่วมบริจาคสมทบทุน',
    description: 'การบริจาคของคุณจะถูกนำไปใช้เพื่อทำนุบำรุงมัสยิดและช่วยเหลือผู้ยากไร้ในชุมชน',
    qr_image: '/images/qr.png',
    purposes: ['ใช้ในลดหย่อนภาษี', 'บริจาคเพื่อการกุศล'],
    bank_name: 'ชื่อบัญชี',
    bank_account: 'มัสยิดบ้านสมเด็จ (เพื่อการกุศล)'
})

const form = ref({
    amount: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    blessing: '',
    slipUrl: '',
    requestTaxInvoice: false,
    taxId: '',
    address: '',
    purpose: ''
})

const isUploading = ref(false)
const isSubmitting = ref(false)
const showTaxModal = ref(false)
const showSuccessModal = ref(false)
const isPrintTaxMode = ref(false)
const donationResult = ref<any>(null)
const localSlipPreview = ref('')

const isCopied = ref(false)
function copyAccount() {
    const textToCopy = pageData.value.bank_account || 'มัสยิดบ้านสมเด็จ (เพื่อการกุศล)'
    navigator.clipboard.writeText(textToCopy).then(() => {
        isCopied.value = true
        setTimeout(() => {
            isCopied.value = false
        }, 2000)
    }).catch(err => {
        console.error('Failed to copy: ', err)
    })
}

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
        const payload = {
            ...form.value
        }
        const response: any = await $fetch('/api/donate', {
            method: 'POST',
            body: payload
        })
        
        donationResult.value = response.donation
        showSuccessModal.value = true
        
        form.value = { 
            amount: '', 
            donorName: '', 
            donorEmail: '',
            donorPhone: '',
            blessing: '', 
            slipUrl: '',
            requestTaxInvoice: false,
            taxId: '',
            address: '',
            purpose: ''
        }
        localSlipPreview.value = ''
    } catch (error: any) {
        alert('เกิดข้อผิดพลาด: ' + error.message)
    } finally {
        isSubmitting.value = false
    }
}

function printReceipt() {
    isPrintTaxMode.value = false
    setTimeout(() => {
        window.print()
    }, 500)
}

function printTaxInvoice() {
    isPrintTaxMode.value = true
    setTimeout(() => {
        window.print()
    }, 500)
}

const bahtText = (amount: number) => {
  if (!amount) return 'ศูนย์บาทถ้วน'
  let numStr = Math.floor(amount).toString()
  const unit = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']
  const text = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
  let result = ''
  for (let i = 0; i < numStr.length; i++) {
    let n = parseInt(numStr[i])
    let u = numStr.length - 1 - i
    if (n !== 0) {
      if (u === 1 && n === 1) { /* สิบ */ }
      else if (u === 1 && n === 2) { result += 'ยี่' }
      else if (u === 0 && n === 1 && numStr.length > 1 && parseInt(numStr[numStr.length-2]) !== 0) { result += 'เอ็ด' }
      else { result += text[n] }
      result += unit[u]
    }
  }
  return result + 'บาทถ้วน'
}

watch(() => form.value.purpose, (newPurpose) => {
    if (!newPurpose || newPurpose.includes('ไม่รับ')) {
        form.value.requestTaxInvoice = false
        form.value.taxId = ''
        form.value.address = ''
    }
})
</script>

<template>
    <section id="donate" class="bg-gray-50 py-20 font-['Prompt'] border-b border-slate-100">
        <div class="max-w-6xl mx-auto px-6">
            <div v-reveal class="text-center mb-12">
                <h2 class="text-4xl md:text-5xl font-black text-[#155d3a] mb-4 uppercase">{{ pageData.title }}</h2>
                <div class="w-20 h-1.5 bg-[#facc15] mx-auto rounded-full shadow-sm"></div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                
                <div v-reveal class="bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-xl overflow-hidden border border-slate-100 p-6 md:p-12 text-center">
                    <p class="text-slate-600 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                        {{ pageData.description }}
                    </p>

                    <div class="mb-8 inline-block p-4 md:p-6 bg-emerald-50 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-emerald-200">
                        <img :src="pageData.qr_image" alt="QR Code สำหรับบริจาค"
                            class="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain mx-auto rounded-2xl shadow-sm">
                    </div>

                    <div class="space-y-4 max-w-sm mx-auto">
                        <div class="bg-slate-900 p-5 rounded-2xl flex items-center justify-center gap-4 shadow-lg">
                            <span class="text-3xl shrink-0">🏦</span>
                            <div class="text-left flex-1">
                                <p class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{{ pageData.bank_name || 'ชื่อบัญชี' }}</p>
                                <div class="flex items-center justify-between gap-3 mt-0.5">
                                    <p class="font-bold text-white text-lg leading-tight">{{ pageData.bank_account || 'มัสยิดบ้านสมเด็จ (เพื่อการกุศล)' }}</p>
                                    <button @click="copyAccount" class="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all shrink-0" title="คัดลอก">
                                        <svg v-if="isCopied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-reveal class="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-8 md:p-12">
                    <h3 class="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                        <span class="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">📝</span>
                        แจ้งข้อมูลการโอนเงิน
                    </h3>

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

                        <!-- <div class="space-y-2">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">คำอวยพร / ข้อความ</label>
                            <textarea v-model="form.blessing" rows="3" placeholder="ข้อความถึงมัสยิด..." class="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium"></textarea>
                        </div> -->

                        <div class="space-y-4" v-if="pageData.purposes && pageData.purposes.length > 0">
                            <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block">วัตถุประสงค์การบริจาค (เลือกได้เพียง 1 ข้อ)</label>
                            <div class="flex flex-col sm:flex-row flex-wrap gap-4">
                                <label v-for="(purpose, idx) in pageData.purposes" :key="idx" class="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all flex-1 min-w-[200px]">
                                    <input type="radio" v-model="form.purpose" :value="purpose" name="donationPurpose" class="w-5 h-5 text-emerald-500 border-slate-300 focus:ring-emerald-500" />
                                    <span class="text-sm font-bold text-slate-700">{{ purpose }}</span>
                                </label>
                            </div>
                        </div>

                        <div v-if="form.purpose && !form.purpose.includes('ไม่รับ')" class="space-y-4">
                            <button 
                                type="button"
                                @click="showTaxModal = true"
                                class="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all group"
                            >
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📄</div>
                                    <div class="text-left">
                                        <p class="text-sm font-bold text-slate-700">ขอใบกำกับภาษี / ใบอนุโมทนาบัตร</p>
                                        <p class="text-[10px] text-slate-400 font-medium">กรอกข้อมูลเพื่อลดหย่อนภาษี</p>
                                    </div>
                                </div>
                                <div v-if="form.requestTaxInvoice" class="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</div>
                                <div v-else class="text-slate-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                </div>
                            </button>

                            <transition name="fade">
                                <div v-if="form.requestTaxInvoice" class="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <div class="text-emerald-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                        </div>
                                        <p class="text-xs font-bold text-emerald-700">บันทึกข้อมูลใบกำกับภาษีแล้ว</p>
                                    </div>
                                    <button type="button" @click="form.requestTaxInvoice = false" class="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest">ยกเลิก</button>
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
    </section>

    <!-- ==================== 5. Tax Invoice Modal ==================== -->
    <Teleport to="body">
        <transition name="fade">
            <div v-if="showTaxModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showTaxModal = false"></div>
                <div class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div class="h-2 bg-emerald-500 w-full"></div>
                    <div class="p-8 md:p-10">
                        <div class="flex items-center justify-between mb-8">
                            <div>
                                <h4 class="text-2xl font-black text-slate-800">ข้อมูลใบกำกับภาษี</h4>
                                <p class="text-sm text-slate-400 font-medium">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อความถูกต้อง</p>
                                <p class="text-xs text-rose-500 font-bold mt-1.5">*หมายเหตุ: ใบเสร็จรับเงิน / ใบกำกับภาษีฉบับจริงจะถูกจัดส่งทางไปรษณีย์ภายใน 7-14 วันทำการ</p>
                            </div>
                            <button @click="showTaxModal = false" class="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all">✕</button>
                        </div>

                        <div class="space-y-6">
                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ชื่อ-นามสกุล (ตามบัตรประชาชน)</label>
                                <input v-model="form.donorName" type="text" placeholder="ระบุชื่อ-นามสกุล..." class="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold shadow-sm" />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">เบอร์โทรศัพท์</label>
                                    <input v-model="form.donorPhone" type="tel" placeholder="08X-XXX-XXXX" class="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold shadow-sm" />
                                </div>
                                <div class="space-y-2">
                                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">อีเมล์</label>
                                    <input v-model="form.donorEmail" type="email" placeholder="example@mail.com" class="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold shadow-sm" />
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขประจำตัวผู้เสียภาษี</label>
                                <input v-model="form.taxId" type="text" placeholder="เลข 13 หลัก..." class="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold shadow-sm" />
                            </div>

                            <div class="space-y-2">
                                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ที่อยู่สำหรับการจัดส่งเอกสาร</label>
                                <textarea v-model="form.address" rows="3" placeholder="ระบุที่อยู่โดยละเอียด..." class="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium shadow-sm"></textarea>
                            </div>
                        </div>

                        <div class="mt-4 flex gap-4">
                            <button @click="showTaxModal = false" class="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">ยกเลิก</button>
                            <button @click="form.requestTaxInvoice = true; showTaxModal = false" class="flex-1 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">บันทึกข้อมูล</button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- ==================== 6. Success Modal & Receipt ==================== -->
        <transition name="fade">
            <div v-if="showSuccessModal" class="fixed inset-0 z-[110] flex items-center justify-center p-6">
                <div class="absolute inset-0 bg-emerald-900/40 backdrop-blur-md"></div>
                
                <div class="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-y-auto max-h-[85vh] print:shadow-none print:m-0 print:overflow-visible print:max-h-none print:max-w-3xl print:bg-transparent print:rounded-none">
                    <button @click="showSuccessModal = false" class="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-200 transition-all z-10 print:hidden font-bold">✕</button>
                    
                    <div class="hidden print:block w-full max-w-3xl mx-auto mt-4 font-['Prompt'] bg-[#ffcce6] p-10 border-2 border-slate-800 relative" style="-webkit-print-color-adjust: exact; print-color-adjust: exact;">
                        <div class="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-slate-800 rounded-tl-2xl"></div>
                        <div class="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-slate-800 rounded-tr-2xl"></div>
                        <div class="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-slate-800 rounded-bl-2xl"></div>
                        <div class="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-slate-800 rounded-br-2xl"></div>

                        <div class="flex justify-end items-start text-slate-900 font-bold text-sm mb-4">
                            <div class="flex items-end">
                                <span class="mr-2">เลขที่</span>
                                <span class="border-b border-dotted border-slate-800 inline-block w-32 text-center text-lg font-mono">{{ donationResult?.id?.toString().padStart(4, '0') || '----' }}</span>
                            </div>
                        </div>

                        <div class="text-center mt-2 mb-8 relative">
                            <h1 class="text-4xl font-black text-slate-900 mb-2" style="font-family: serif; letter-spacing: 1px;">มัสยิดนูรุ้ลมูบีน</h1>
                            <p class="text-sm text-slate-900 font-medium">1134 ซอยอิสรภาพ 9 ถนนอิสรภาพ<br/>เขตธนบุรี กรุงเทพมหานคร 10600</p>
                            
                            <div class="my-3 border-b-2 border-slate-800 w-2/3 mx-auto"></div>
                            
                            <p class="text-[11px] text-slate-900 uppercase font-bold tracking-wider leading-tight">
                                MUSJIDNOORLUMUBEEN BANSOMDEJTHONBUREE<br/>
                                1134 SOI ISSARAPAB 9 ISSARAPAB ROAD<br/>
                                BANGKOK 10600 THAILAND
                            </p>
                        </div>

                        <div class="text-center mb-8 relative z-10">
                            <span class="inline-block px-10 py-3 border-2 border-slate-900 bg-[#e6ffed] font-black text-2xl text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" style="-webkit-print-color-adjust: exact; print-color-adjust: exact;">
                                ใบเสร็จรับเงิน
                            </span>
                        </div>

                        <div class="flex justify-end mb-6 text-slate-900 font-bold text-sm">
                            <div class="flex items-end">
                                <span class="mr-2">วันที่</span>
                                <span class="border-b border-dotted border-slate-800 inline-block w-48 text-center text-base">
                                    {{ donationResult?.date ? new Date(donationResult.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) }}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-6 text-slate-900 font-bold text-base">
                            <div class="flex items-end">
                                <span class="w-32 whitespace-nowrap">ได้รับเงินจาก</span>
                                <span class="flex-1 border-b border-dotted border-slate-800 text-center px-4 text-lg">{{ donationResult?.donorName || 'ผู้ไม่ประสงค์ออกนาม' }}</span>
                            </div>
                            <div class="flex items-end">
                                <span class="w-32 whitespace-nowrap">ที่อยู่</span>
                                <span class="flex-1 border-b border-dotted border-slate-800 text-center px-4 text-base text-slate-700 font-medium">{{ donationResult?.address || '-' }}</span>
                            </div>
                            <div class="flex flex-col gap-3">
                                <div class="flex items-end">
                                    <span class="w-32 whitespace-nowrap">จำนวนเงิน</span>
                                    <span class="flex-1 border-b border-dotted border-slate-800 px-4 text-xl font-black text-center">
                                        {{ donationResult?.amount?.toLocaleString() }}
                                    </span>
                                    <span class="w-16 text-right">บาท</span>
                                </div>
                                <div class="flex items-end">
                                    <span class="w-32 whitespace-nowrap"></span>
                                    <span class="flex-1 border-b border-dotted border-slate-800 px-4 text-center text-sm text-slate-700 font-bold">
                                        ({{ bahtText(donationResult?.amount) }})
                                    </span>
                                    <span class="w-16 text-right"></span>
                                </div>
                            </div>
                            <div class="flex items-end">
                                <span class="w-32 whitespace-nowrap">เพื่อ</span>
                                <span class="flex-1 border-b border-dotted border-slate-800 text-center px-4 text-lg">{{ donationResult?.blessing || 'บำรุงมัสยิด' }}</span>
                            </div>
                        </div>

                        <div class="mt-10 mb-12 text-center text-slate-800 text-sm leading-loose px-8">
                            "ทางคณะกรรมการมัสยิดได้รับไว้ด้วยความขอบคุณยิ่ง ขอเอกองค์อัลเลาะห์ (ซ.บ.)<br/>
                            ได้โปรดประทานพรให้ท่านและครอบครัว จงประสบแต่ความสุข ความเจริญ<br/>
                            และสัมฤทธิ์ผลในสิ่งอันพึงปรารถนาทุกประการเทอญ"
                        </div>

                        <div class="flex justify-between px-12 text-slate-900 font-bold text-base mt-16">
                            <div class="text-center">
                                <div class="w-48 border-b border-dotted border-slate-800 mb-2"></div>
                                <p>เหรัญญิก</p>
                            </div>
                            <div class="text-center">
                                <div class="w-48 border-b border-dotted border-slate-800 mb-2"></div>
                                <p>ผู้รับเงิน</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 md:p-8 text-center mt-6 md:mt-0 print:hidden">
                        <div class="w-16 h-16 md:w-20 md:h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center text-3xl md:text-4xl mx-auto mb-4">
                            🎉
                        </div>
                        
                        <h3 class="text-xl md:text-2xl font-black text-slate-800 mb-1">บริจาคสำเร็จ!</h3>
                        <p class="text-sm md:text-base text-slate-500 font-medium mb-6">ขออัลลอฮ์ทรงตอบแทนความดีงามแก่ท่าน</p>

                        <div class="bg-slate-50 rounded-[2rem] p-6 mb-8 text-left space-y-3 border border-slate-100">
                            <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขที่อ้างอิง</span>
                                <span class="text-sm font-bold text-slate-700 font-mono">#{{ donationResult?.id?.toString().padStart(6, '0') || '----' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs font-bold text-slate-400">ชื่อผู้บริจาค:</span>
                                <span class="text-sm font-bold text-slate-700">{{ donationResult?.donorName || 'ผู้ไม่ประสงค์ออกนาม' }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-xs font-bold text-slate-400">จำนวนเงิน:</span>
                                <div class="text-right">
                                  <span class="text-lg font-black text-emerald-600">{{ donationResult?.amount?.toLocaleString() }} บาท</span>
                                  <p class="text-[10px] text-emerald-600/80 font-bold mt-0.5" v-if="donationResult?.amount">({{ bahtText(donationResult?.amount) }})</p>
                                </div>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-xs font-bold text-slate-400">วันที่:</span>
                                <span class="text-sm font-bold text-slate-700">{{ donationResult?.date ? new Date(donationResult.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-' }}</span>
                            </div>
                            <div v-if="donationResult?.taxId" class="flex justify-between pt-3 border-t border-dashed border-slate-200">
                                <span class="text-xs font-bold text-slate-400">เลขผู้เสียภาษี:</span>
                                <span class="text-sm font-bold text-slate-700">{{ donationResult?.taxId }}</span>
                            </div>
                            
                            <div class="pt-4 border-t border-slate-200 mt-4">
                                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">หลักฐานการโอนเงิน</p>
                                <div class="w-full h-40 bg-white rounded-xl overflow-hidden border border-slate-200">
                                    <img :src="donationResult?.slipUrl" class="w-full h-full object-contain" alt="สลิปการโอนเงิน" />
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-3">
                            <button @click="printReceipt" class="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                <span>🖨️</span> พิมพ์ใบเสร็จ / บันทึกเป็น PDF
                            </button>
                            <button v-if="donationResult?.taxId" @click="printTaxInvoice" class="w-full py-4 bg-amber-500 text-white font-black rounded-2xl shadow-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-2">
                                <span>📑</span> พิมพ์ใบกำกับภาษี (ชั่วคราว)
                            </button>

                            <button @click="showSuccessModal = false" class="w-full py-4 bg-emerald-50 text-emerald-600 font-bold rounded-2xl hover:bg-emerald-100 transition-all">
                                ปิดหน้าต่าง
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

@media print {
    body * {
        visibility: hidden;
    }
    .print\:block {
        display: block !important;
    }
    .fixed, .fixed * {
        visibility: visible;
    }
    .fixed {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        padding: 0;
        margin: 0;
    }
    .bg-emerald-900\/40 {
        display: none !important;
    }
    .max-w-lg {
        max-width: 100% !important;
    }
    button {
        display: none !important;
    }
}
</style>
