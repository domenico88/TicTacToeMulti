import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://whfnjglnsyascyxlxozq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZm5qZ2xuc3lhc2N5eGx4b3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyMzg0MjcsImV4cCI6MjA0NDgxNDQyN30.iyIDzp9NDG8ZNkDEhkL9LYjCmJYaAdRXb87CGrTkxjA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
