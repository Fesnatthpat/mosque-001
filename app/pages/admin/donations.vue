<template>
  <div>
    <!-- ใช้ Layout หลักสำหรับฝั่งแอดมินที่มีแถบนำทางข้าง (Sidebar) -->
    <NuxtLayout name="admin">
      
      <!-- ==================== 1. Header (ชื่อหน้าหลักและคำโปรย) ==================== -->
      <div class="mb-8 flex justify-between items-end print:hidden">
        <div>
          <h3 class="text-3xl font-black text-slate-800 mb-2">ตรวจสอบการโอนเงิน</h3>
          <p class="text-slate-500">ตรวจสอบหลักฐานและยืนยันยอดเงินบริจาคจากผู้มีจิตศรัทธา</p>
        </div>
      </div>

      <!-- ==================== 2. Donations Management Table (ตารางจัดการรายการบริจาค) ==================== -->
      <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 print:hidden">
        <div class="overflow-x-auto overflow-y-visible">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr
                class="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-50 bg-slate-50/30">
                <th class="px-8 py-6">ผู้บริจาค</th>
                <th class="px-8 py-6 text-right">จำนวนเงิน</th>
                <th class="px-8 py-6">วันที่แจ้งโอน</th>
                <th class="px-8 py-6 text-center">หลักฐานสลิป</th>
                <th class="px-8 py-6 text-center">สถานะ</th>
                <th class="px-8 py-6 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <!-- วนลูปแสดงข้อมูลรายการบริจาคทั้งหมด -->
              <tr v-for="donation in data?.donations" :key="donation.id"
                class="group hover:bg-slate-50/50 transition-all duration-200">
                
                <!-- คอลัมน์ที่ 1: ข้อมูลผู้บริจาค (ชื่อ, เบอร์โทร, อีเมล, ใบกำกับภาษี และคำอวยพร) -->
                <td class="px-8 py-6">
                  <div>
                    <p class="font-bold text-slate-800">{{ donation.donorName || 'ผู้ไม่ประสงค์ออกนาม' }}</p>
                    
                    <!-- แสดงเบอร์โทรและอีเมลแบบป้าย Tag หากมีการกรอกข้อมูลมา -->
                    <div class="flex flex-wrap gap-2 mt-1">
                      <p v-if="donation.donorPhone" class="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold">📞 {{ donation.donorPhone }}</p>
                      <p v-if="donation.donorEmail" class="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-bold">📧 {{ donation.donorEmail }}</p>
                    </div>

                    <!-- สถานะการขอใบกำกับภาษี -->
                    <div class="mt-3 flex flex-col items-start gap-2">
                      <span v-if="donation.taxId || (donation.purpose && !donation.purpose.includes('ไม่รับ'))" class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-md text-[10px] font-bold">
                        <span>📑</span> ขอใบกำกับภาษี
                      </span>
                      <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 text-slate-400 border border-slate-200 rounded-md text-[10px] font-bold">
                        <span>❌</span> ไม่ขอรับใบกำกับภาษี
                      </span>

                      <!-- แสดงรายละเอียดที่อยู่รับใบกำกับภาษีกรณีที่ร้องขอ -->
                      <div v-if="donation.taxId" class="w-full p-2.5 bg-amber-50/40 rounded-lg border border-amber-100">
                         <p class="text-[10px] text-amber-700 font-bold leading-tight">เลขผู้เสียภาษี: {{ donation.taxId }}</p>
                         <p v-if="donation.address" class="text-[10px] text-amber-600/70 mt-1 leading-tight">{{ donation.address }}</p>
                      </div>
                    </div>
                    
                    <!-- คำอวยพร/คำดุอาอ์จากผู้ร่วมทำบุญ -->
                    <p class="text-[11px] text-slate-400 mt-2 italic leading-relaxed max-w-[200px] truncate"
                      :title="donation.blessing">{{ donation.blessing || 'ไม่มีคำอวยพร' }}</p>

                    <!-- วัตถุประสงค์การบริจาค -->
                    <div class="mt-3 bg-slate-50 border border-slate-100 p-2 rounded-lg" v-if="donation.purpose">
                      <p class="text-[10px] text-slate-500 font-bold mb-1">วัตถุประสงค์:</p>
                      <p class="text-[11px] text-emerald-600 font-black">{{ donation.purpose }}</p>
                      <button @click="openEditPurposeModal(donation)" class="mt-2 text-[10px] bg-white border border-slate-200 shadow-sm px-2 py-1 rounded text-slate-500 hover:bg-slate-100 transition-all font-bold">✏️ แก้ไข</button>
                    </div>
                    <div class="mt-3" v-else>
                      <button @click="openEditPurposeModal(donation)" class="text-[10px] bg-slate-50 border border-slate-200 px-2 py-1 rounded text-slate-500 hover:bg-slate-100 transition-all font-bold">✏️ เพิ่มวัตถุประสงค์</button>
                    </div>
                  </div>
                </td>

                <!-- คอลัมน์ที่ 2: จำนวนเงินบริจาค -->
                <td class="px-8 py-6 text-right font-black text-emerald-600 text-lg">
                  ฿{{ donation.amount.toLocaleString() }}
                </td>

                <!-- คอลัมน์ที่ 3: วันและเวลาแจ้งสลิป -->
                <td class="px-8 py-6 text-slate-500 text-xs">
                  {{ new Date(donation.date).toLocaleString('th-TH', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit' }) }} น.
                </td>

                <!-- คอลัมน์ที่ 4: สลิปหลักฐานการโอนเงิน (มีระบบ Preview เมื่อเอาเมาส์ชี้ Hover) -->
                <td class="px-8 py-6 text-center">
                  <div v-if="donation.slipUrl" class="relative inline-block group/slip">
                    <a :href="donation.slipUrl" target="_blank"
                      class="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center gap-2"
                      @mouseenter="(e) => showPreview(donation.slipUrl, e)" @mouseleave="hidePreview">
                      <span>📸 ดูสลิป</span>
                    </a>
                  </div>
                  <span v-else class="text-slate-300 text-xs italic">ไม่มีหลักฐาน</span>
                </td>

                <!-- คอลัมน์ที่ 5: ป้ายสถานะปัจจุบัน (completed = ยืนยันแล้ว, pending = รอยืนยัน) -->
                <td class="px-8 py-6 text-center">
                  <span class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
                    :class="donation.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'">
                    {{ donation.status === 'completed' ? 'ยืนยันแล้ว' : 'รอยืนยัน' }}
                  </span>
                </td>

                <!-- คอลัมน์ที่ 6: ปุ่มกดกระบวนการจัดการ (ยืนยันยอดเงิน / หรือยกเลิกเพื่อส่งคืนสเตตรออนุมัติ) -->
                <td class="px-8 py-6">
                  <div class="flex items-center justify-center gap-2">
                    <button v-if="donation.status !== 'completed'" @click="updateStatus(donation.id, 'completed')"
                      class="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/10 active:scale-95">
                      ยืนยัน
                    </button>
                    <button v-else @click="updateStatus(donation.id, 'pending')"
                      class="px-4 py-2 bg-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95">
                      ยกเลิก
                    </button>
                    <!-- ปุ่มพิมพ์ใบกำกับภาษี -->
                    <button v-if="donation.taxId || (donation.purpose && !donation.purpose.includes('ไม่รับ'))" @click="printInvoice(donation)"
                      class="px-4 py-2 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10 active:scale-95 flex items-center gap-1.5 ml-2">
                      <span>🖨️</span> พิมพ์
                    </button>
                  </div>
                </td>
              </tr>

              <!-- แสดงเมื่อไม่มีรายการใดๆ ที่แจ้งเข้ามาในระบบ -->
              <tr v-if="!data?.donations?.length">
                <td colspan="6" class="px-8 py-24 text-center">
                  <div class="text-6xl mb-6 opacity-20 text-slate-200">📥</div>
                  <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">ไม่พบรายการบริจาคที่รอการตรวจสอบ</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==================== 4. Print Template for Tax Invoice (แสดงเฉพาะตอนพิมพ์) ==================== -->
      <div class="hidden print:block w-full max-w-3xl mx-auto mt-4 font-['Prompt'] bg-[#ffcce6] p-10 border-2 border-slate-800 relative" style="-webkit-print-color-adjust: exact; print-color-adjust: exact;">
          <!-- Corner decorations -->
          <div class="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-slate-800 rounded-tl-2xl"></div>
          <div class="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-slate-800 rounded-tr-2xl"></div>
          <div class="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-slate-800 rounded-bl-2xl"></div>
          <div class="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-slate-800 rounded-br-2xl"></div>

          <div class="flex justify-end items-start text-slate-900 font-bold text-sm mb-4">
              <div class="flex items-end">
                  <span class="mr-2">เลขที่</span>
                  <span class="border-b border-dotted border-slate-800 inline-block w-32 text-center text-lg font-mono">{{ selectedInvoice?.id?.toString().padStart(4, '0') }}</span>
              </div>
          </div>

          <!-- Logo and Header -->
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

          <!-- Receipt Title -->
          <div class="text-center mb-8 relative z-10">
              <span class="inline-block px-10 py-3 border-2 border-slate-900 bg-[#e6ffed] font-black text-2xl text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]" style="-webkit-print-color-adjust: exact; print-color-adjust: exact;">
                  ใบเสร็จรับเงิน
              </span>
          </div>

          <!-- Date -->
          <div class="flex justify-end mb-6 text-slate-900 font-bold text-sm">
              <div class="flex items-end">
                  <span class="mr-2">วันที่</span>
                  <span class="border-b border-dotted border-slate-800 inline-block w-48 text-center text-base">
                      {{ selectedInvoice ? new Date(selectedInvoice.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : '' }}
                  </span>
              </div>
          </div>

          <!-- Form Fields -->
          <div class="space-y-6 text-slate-900 font-bold text-base">
              <div class="flex items-end">
                  <span class="w-32 whitespace-nowrap">ได้รับเงินจาก</span>
                  <span class="flex-1 border-b border-dotted border-slate-800 text-center px-4 text-lg">{{ selectedInvoice?.donorName || 'ผู้ไม่ประสงค์ออกนาม' }}</span>
              </div>
              <div class="flex items-end">
                  <span class="w-32 whitespace-nowrap">ที่อยู่</span>
                  <span class="flex-1 border-b border-dotted border-slate-800 text-center px-4 text-base text-slate-700 font-medium">{{ selectedInvoice?.address || '-' }}</span>
              </div>
              <div class="flex flex-col gap-3">
                  <div class="flex items-end">
                      <span class="w-32 whitespace-nowrap">จำนวนเงิน</span>
                      <span class="flex-1 border-b border-dotted border-slate-800 px-4 text-xl font-black text-center">
                          {{ selectedInvoice?.amount?.toLocaleString() }}
                      </span>
                      <span class="w-16 text-right">บาท</span>
                  </div>
                  <div class="flex items-end">
                      <span class="w-32 whitespace-nowrap"></span>
                      <span class="flex-1 border-b border-dotted border-slate-800 px-4 text-center text-sm text-slate-700 font-bold">
                          ({{ bahtText(selectedInvoice?.amount) }})
                      </span>
                      <span class="w-16 text-right"></span>
                  </div>
              </div>
              <div class="flex items-end">
                  <span class="w-32 whitespace-nowrap">เพื่อ</span>
                  <span class="flex-1 border-b border-dotted border-slate-800 text-center px-4 text-lg">{{ selectedInvoice?.purpose || selectedInvoice?.blessing || 'บำรุงมัสยิด' }}</span>
              </div>
          </div>

          <!-- Thanks Message -->
          <div class="mt-10 mb-12 text-center text-slate-800 text-sm leading-loose px-8">
              "ทางคณะกรรมการมัสยิดได้รับไว้ด้วยความขอบคุณยิ่ง ขอเอกองค์อัลเลาะห์ (ซ.บ.)<br/>
              ได้โปรดประทานพรให้ท่านและครอบครัว จงประสบแต่ความสุข ความเจริญ<br/>
              และสัมฤทธิ์ผลในสิ่งอันพึงปรารถนาทุกประการเทอญ"
          </div>

          <!-- Signatures -->
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

    </NuxtLayout>

    <!-- ==================== 3. Hover Preview Tooltip (ฟลอยท์กล่องเล็กรูปสลิปขยายเมื่อชี้เมาส์) ==================== -->
    <Teleport to="body">
      <div v-if="preview.visible" class="fixed z-[9999] pointer-events-none transition-opacity duration-200" :style="{
        left: `${preview.x}px`,
        top: `${preview.y}px`,
        transform: preview.placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)'
      }">
        <div
          class="bg-white p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200 w-64 md:w-80 ring-4 ring-black/5"
          :class="preview.placement === 'top' ? 'mb-4' : 'mt-4'">
          <img :src="preview.url" class="w-full h-auto rounded-xl" />
          <div class="mt-3 pt-3 border-t border-slate-100">
            <p class="text-[10px] font-black text-center text-slate-400 uppercase tracking-widest">หลักฐานการโอนเงิน</p>
          </div>
          <!-- ส่วนลูกศรเล็กๆ ชี้ตรงไปยังปุ่มเมาส์เพื่อความสวยงามประณีต -->
          <div class="w-4 h-4 bg-white border-slate-200 absolute left-1/2 -translate-x-1/2 rotate-45" :class="preview.placement === 'top'
            ? 'border-r border-b -bottom-2'
            : 'border-l border-t -top-2'"></div>
        </div>
      </div>
    </Teleport>

    <!-- ==================== 6. Edit Purpose Modal ==================== -->
    <Teleport to="body">
      <div v-if="editPurposeModal.visible" class="fixed inset-0 z-[1000] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="editPurposeModal.visible = false"></div>
        <div class="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl relative overflow-hidden z-10">
          <div class="p-6 md:p-8">
            <h4 class="text-xl font-black text-slate-800 mb-4">แก้ไขวัตถุประสงค์</h4>
            
            <div class="space-y-4 mb-6" v-if="availablePurposes.length > 0">
               <label v-for="(purpose, idx) in availablePurposes" :key="idx" class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                  <input type="radio" v-model="editPurposeModal.purpose" :value="purpose" name="editPurpose" class="w-4 h-4 text-emerald-500 border-slate-300 focus:ring-emerald-500" />
                  <span class="text-sm font-bold text-slate-700">{{ purpose }}</span>
               </label>
            </div>

            <div class="flex gap-3">
               <button @click="editPurposeModal.visible = false" class="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">ยกเลิก</button>
               <button @click="savePurpose" class="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">บันทึก</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
/**
 * หน้าจัดการยืนยันยอดเงินบริจาค (Admin Donations Management)
 * ทำหน้าที่:
 * 1. ดึงรายการธุรกรรมการโอนเงินของผู้บริจาคทั้งหมดจาก Database
 * 2. แสดงรายละเอียดอย่างเช่น ชื่อ, จำนวนเงิน, สลิปหลักฐาน, ข้อมูลสำหรับลดหย่อนภาษี
 * 3. ระบบ Hover Preview รูปสลิปโดยไม่ต้องเปลี่ยนหน้าหรือเปิดแท็บใหม่
 * 4. แอดมินสามารถกดปุ่ม "ยืนยัน" (เปลี่ยนสถานะเป็น Completed) หรือกด "ยกเลิก" (กลับคืน Pending) ได้ทันที
 */

// เปิดใช้งานระบบตรวจสอบสิทธิ์การเข้าถึง (Admin Protected)
definePageMeta({
  layout: false,
  middleware: 'auth'
})

// ดึงรายชื่อการบริจาคทั้งหมด
const { data, refresh } = await useFetch('/api/admin/donations')

// ดึงการตั้งค่าเว็บเพื่อนำตัวเลือกวัตถุประสงค์มาใช้งาน
const { data: settings } = await useFetch('/api/settings')
const availablePurposes = computed(() => settings.value?.page_donate?.purposes || ['ใช้ในลดหย่อนภาษี', 'บริจาคเพื่อการกุศล'])

// === โครงสร้าง State คุมพรีวิวย่อสลิปลอยฟ้า (Floating Preview) ===
const preview = ref({
  visible: false, // เปิดปิดพรีวิวรูปสลิป
  url: '',        // ลิงก์ที่อยู่ภาพสลิป
  x: 0,           // พิกัดแนวแกน X
  y: 0            // พิกัดแนวแกน Y
})

/**
 * ฟังก์ชันคำนวณตำแหน่งและแสดงสลิปพรีวิวเมื่อเมาส์ชี้ปุ่ม
 * - รับ URL ภาพและ Event ชี้เมาส์มา
 * - วัดขนาดของปุ่มที่กด (getBoundingClientRect) เพื่อวางรูปภาพกล่องพรีวิวไว้ตรงกลางปุ่ม
 * - ค้นหาพื้นที่ว่างด้านบนและด้านล่างปุ่ม เพื่อหักเหทิศทางและป้องการหลุดออกนอกขอบหน้าจอเบราว์เซอร์
 */
function showPreview(url, event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const scrollY = window.scrollY
  const previewHeight = 400 // ขนาดความสูงคาดเดาของกล่องพรีวิว

  // เริ่มต้นพิกัดไว้ที่ ด้านบน ของปุ่ม
  let y = rect.top + scrollY - 10
  let placement = 'top'

  // หากพื้นที่ด้านบนเหลือน้อยเกินไป ให้พลิกพรีวิวไปวางไว้ ด้านล่าง แทน
  if (rect.top < previewHeight) {
    y = rect.bottom + scrollY + 10
    placement = 'bottom'
  }

  preview.value = {
    visible: true,
    url: url,
    x: rect.left + (rect.width / 2),
    y: y,
    placement: placement
  }
}

// ฟังก์ชันสั่งปิดพรีวิวเมื่อยกเมาส์ออก
function hidePreview() {
  preview.value.visible = false
}

/**
 * ฟังก์ชันเปลี่ยนสถานะแจ้งบริจาค (ยืนยัน/ยกเลิกยอด)
 * - ส่งเลข ID ของ Donation และสถานะที่ต้องการ ไปที่ '/api/admin/update-donation' ด้วย POST
 * - เมื่อสำเร็จให้เรียกฟังก์ชัน refresh() เพื่ออัปเดตยอดและสเตตบนหน้าจอทันทีโดยไม่ต้องโหลดหน้าเว็บใหม่
 */
async function updateStatus(id, status) {
  try {
    const res = await $fetch('/api/admin/update-donation', {
      method: 'POST',
      body: { id, status }
    })
    if (res.success) {
      await refresh()
    }
  } catch (error) {
    alert('เกิดข้อผิดพลาด: ' + error.message)
  }
}

// === ระบบพิมพ์ใบกำกับภาษีรายบุคคล ===
const selectedInvoice = ref(null)

// ฟังก์ชันแปลงตัวเลขเป็นคำอ่านภาษาไทย (บาทถ้วน)
const bahtText = (amount) => {
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

function printInvoice(donation) {
  selectedInvoice.value = donation
  
  // หน่วงเวลาเล็กน้อยให้ Vue เรนเดอร์เทมเพลตสำหรับพิมพ์ (Print Template) ก่อนเรียก window.print()
  setTimeout(() => {
    window.print()
  }, 300)
}

// === ระบบแก้ไขวัตถุประสงค์ (Purpose) ===
const editPurposeModal = ref({
  visible: false,
  donationId: 0,
  purpose: ''
})

function openEditPurposeModal(donation) {
  editPurposeModal.value = {
    visible: true,
    donationId: donation.id,
    purpose: donation.purpose || ''
  }
}

async function savePurpose() {
  try {
    const res = await $fetch('/api/admin/update-donation-purpose', {
      method: 'POST',
      body: { 
        id: editPurposeModal.value.donationId, 
        purpose: editPurposeModal.value.purpose
      }
    })
    if (res.success) {
      editPurposeModal.value.visible = false
      await refresh()
    }
  } catch (error) {
    alert('เกิดข้อผิดพลาด: ' + error.message)
  }
}
</script>
