<template>
  <div class="min-h-screen bg-slate-50 flex font-['Prompt'] text-slate-800 text-sm">
    <aside
      class="w-72 bg-slate-900 text-white flex-shrink-0 shadow-2xl z-20 hidden md:flex flex-col transition-all duration-300">
      <div class="p-8">
        <div class="flex items-center gap-3 mb-2">
          <div
            class="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30">
            🕌
          </div>
          <div>
            <h1 class="font-bold text-lg leading-tight tracking-wide">Mosque Admin</h1>
            <p class="text-[10px] text-slate-400 font-medium mt-0.5">ระบบจัดการมัสยิด</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-4 space-y-2 mt-2">
        <NuxtLink to="/admin" class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group"
          :class="route.path === '/admin' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'">
          <span class="text-xl">📊</span>
          <span class="font-medium">แดชบอร์ด</span>
        </NuxtLink>

        <NuxtLink to="/admin/donations" class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group"
          :class="route.path === '/admin/donations' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'">
          <span class="text-xl">🛡️</span>
          <span class="font-medium">ตรวจสอบการโอนเงิน</span>
        </NuxtLink>

        <NuxtLink to="/admin/settings"
          class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group"
          :class="route.path === '/admin/settings' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'">
          <span class="text-xl">⚙️</span>
          <span class="font-medium">ตั้งค่าเว็บไซต์</span>
        </NuxtLink>

        <div class="pt-8 pb-2 px-4">
          <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Other</p>
        </div>

        <NuxtLink to="/"
          class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200">
          <span class="text-xl">🏠</span>
          <span class="font-medium">กลับหน้าหลัก</span>
        </NuxtLink>
      </nav>

      <div class="p-6 border-t border-slate-800">
        <div
          class="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer">
          <div
            class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-white">
            AD</div>
          <div class="overflow-hidden">
            <p class="text-sm font-semibold truncate text-slate-200">Administrator</p>
            <p class="text-[11px] text-emerald-400">Main Account</p>
          </div>
        </div>
      </div>
    </aside>

    <main class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
      <header
        class="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
        <h2 class="text-xl font-bold text-slate-800 tracking-tight">{{ pageTitle }}</h2>
        <div class="flex items-center gap-4">
          <div
            class="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Online
          </div>
          <button
            class="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors relative">
            🔔
            <span class="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
        <div class="max-w-6xl mx-auto">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const pageTitle = computed(() => {
  if (route.path === '/admin') return 'ภาพรวมแดชบอร์ด'
  if (route.path === '/admin/donations') return 'ตรวจสอบรายการบริจาค'
  if (route.path === '/admin/settings') return 'ตั้งค่าเว็บไซต์'
  return 'Admin Panel'
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800;900&display=swap');

/* ตั้งค่า Scrollbar ให้ดูสะอาดตา */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}

body {
  font-family: 'Prompt', sans-serif;
}
</style>
