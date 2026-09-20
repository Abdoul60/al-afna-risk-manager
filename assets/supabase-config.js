// ============================================================
// CONFIGURATION SUPABASE — À REMPLIR UNE SEULE FOIS
// ============================================================
// 1. Va sur ton projet Supabase → Settings → API
// 2. Copie "Project URL" et colle-le dans SUPABASE_URL ci-dessous
// 3. Copie "anon public key" et colle-la dans SUPABASE_ANON_KEY
// 4. Sauvegarde ce fichier — toutes les pages du site l'utiliseront
// ============================================================

const SUPABASE_URL = "https://rmcdkowbmybfnhrbetbu.supabase.co";       // ex: https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY2Rrb3dibXliZm5ocmJldGJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNzE2MDEsImV4cCI6MjEwMDc0NzYwMX0.ZHXr-M7RAEOKRgt7hVNbqOjJcJmz8aFgd82_ZwhQXeo";       // ex: eyJhbGciOi...

// Ne pas toucher en dessous : ceci crée le client réutilisé partout
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
