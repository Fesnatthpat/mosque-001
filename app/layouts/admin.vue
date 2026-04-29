<template>
  <div class="min-h-screen bg-slate-50 flex font-['Prompt'] text-slate-800">
    <!-- Mobile Header -->
    <header class="md:hidden fixed top-0 left-0 w-full bg-slate-900 text-white h-16 flex items-center justify-between px-6 z-[100] shadow-lg">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-lg">🕌</div>
        <span class="font-bold text-sm tracking-tight">Mosque Admin</span>
      </div>
      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 active:scale-95 transition-all">
        <span v-if="!isMobileMenuOpen" class="text-2xl">≡</span>
        <span v-else class="text-xl">✕</span>
      </button>
    </header>

    <!-- Sidebar (Desktop & Mobile) -->
    <aside 
      class="fixed inset-y-0 left-0 w-72 bg-slate-900 text-white shadow-2xl z-[90] transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col"
      :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-8 hidden md:block">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30">🕌</div>
          <div>
            <h1 class="font-bold text-lg leading-tight tracking-wide">Mosque Admin</h1>
            <p class="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-widest">Management System</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-4 space-y-2 mt-20 md:mt-2">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.to"
          :to="link.to" 
          @click="isMobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group"
          :class="route.path === link.to ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'"
        >
          <span class="text-xl">{{ link.icon }}</span>
          <span class="font-medium">{{ link.label }}</span>
        </NuxtLink>

        <div class="pt-8 pb-2 px-4">
          <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Other</p>
        </div>

        <NuxtLink to="/" class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all duration-200">
          <span class="text-xl">🏠</span>
          <span class="font-medium">กลับหน้าหลัก</span>
        </NuxtLink>
      </nav>

      <div class="p-6 border-t border-slate-800 mt-auto">
        <div class="flex items-center gap-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <div class="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-white uppercase">AD</div>
          <div class="overflow-hidden">
            <p class="text-sm font-semibold truncate text-slate-200">Admin</p>
            <p class="text-[11px] text-emerald-400">Main Account</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile menu -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="isMobileMenuOpen = false"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] md:hidden transition-opacity"
    ></div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden pt-16 md:pt-0">
      <!-- Desktop Header -->
      <header class="hidden md:flex h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-10">
        <h2 class="text-xl font-bold text-slate-800 tracking-tight">{{ pageTitle }}</h2>
        <div class="flex items-center gap-4">
          <div class="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1.5 uppercase tracking-tighter">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </div>
          <div class="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">🔔</div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-50">
        <div class="max-w-6xl mx-auto">
          <!-- Mobile Title (only on mobile) -->
          <div class="md:hidden mb-6">
            <h2 class="text-2xl font-black text-slate-800 tracking-tight">{{ pageTitle }}</h2>
            <div class="w-10 h-1 bg-emerald-500 mt-2 rounded-full"></div>
          </div>
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
const route = useRoute()
const isMobileMenuOpen = ref(false)

const navLinks = [
  { to: '/admin', label: 'ภาพรวมแดชบอร์ด', icon: '📊' },
  { to: '/admin/donations', label: 'ตรวจสอบการโอนเงิน', icon: '🛡️' },
  { to: '/admin/settings', label: 'ตั้งค่าเว็บไซต์', icon: '⚙️' }
]

const pageTitle = computed(() => {
  const current = navLinks.find(link => link.to === route.path)
  return current ? current.label : 'Admin Panel'
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800;900&display=swap');

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
body { font-family: 'Prompt', sans-serif; overflow: hidden; }
</style>
