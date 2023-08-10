import { createClient } from '@supabase/supabase-js'


export async function load() {
    const supabase = createClient(
        'https://ohpabiusperaoagnmbtz.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocGFiaXVzcGVyYW9hZ25tYnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTE2ODg1NTAsImV4cCI6MjAwNzI2NDU1MH0.9vRQBdIpOUMSk1V7mNC0KG0eENS76XWMpVHnKq3JBbE')
    const { data } = await supabase.from("countries").select();
    return {
        countries: data ?? [],
    };
}