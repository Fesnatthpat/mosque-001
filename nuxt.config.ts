import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  
  // เพิ่ม Modules ของ Google Fonts เข้ามา
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxtjs/supabase'
  ],

  supabase: {
    redirect: false,
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  },
  
  // ตั้งค่าให้ดึงฟอนต์ Prompt มาใช้งาน
  googleFonts: {
    families: {
      Prompt: [300, 400, 500, 600, 700], 
    },
    display: 'swap',
    download: true, // โหลดมาเก็บไว้ในเครื่องเลยเพื่อความเร็ว
  }
});