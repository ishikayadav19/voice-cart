require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bpbmoupfjsmztolftaeh.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYm1vdXBmanNtenRvbGZ0YWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwODgzMDAsImV4cCI6MjA5MjY2NDMwMH0.Oz36ONSAVl124bmqwjwJVCe86W1h-KwACqo_9G_JOc8";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;