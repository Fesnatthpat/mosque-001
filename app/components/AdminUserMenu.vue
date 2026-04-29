<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

async function handleLogout() {
  await supabase.auth.signOut()
  navigateTo('/admin/login')
}
</script>

<template>
  <div class="fixed top-4 right-4 z-[200]">
    <div v-if="user" class="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 flex items-center gap-4">
      <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
        {{ user.email?.[0].toUpperCase() }}
      </div>
      <div>
        <p class="text-xs font-bold text-slate-800">{{ user.email }}</p>
        <button @click="handleLogout" class="text-[10px] font-black text-rose-500 uppercase hover:underline">
          ออกจากระบบ
        </button>
      </div>
    </div>
  </div>
</template>
