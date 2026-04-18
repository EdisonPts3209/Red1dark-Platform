/**
 * Red1dark Platform - Supabase Client
 * Подключение к базе данных
 */

const SUPABASE_URL = 'https://mkhltqvqlzmimtjjtkzn.supabase.co';
// Вставь свой ключ ниже вместо заглушки
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1raGx0cXZxbHptaW10amp0a3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDE5MzcsImV4cCI6MjA5MjExNzkzN30.bBU809v6-6pcb2eG3ujIC6drBBlBaLHPscLiI5zjZDw'; 

// Проверка наличия библиотеки
if (typeof supabase === 'undefined') {
    console.error('❌ Библиотека Supabase не подключена! Проверь index.html');
} else {
    const { createClient } = supabase;
    window.red1db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('🔴 Red1dark DB: Connected to Supabase');
}