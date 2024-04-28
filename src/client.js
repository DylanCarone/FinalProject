import {createClient} from "@supabase/supabase-js"
const URL = "https://qhhydklqgbczyscwdwjl.supabase.co"
const API_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaHlka2xxZ2JjenlzY3dkd2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzOTczMDEsImV4cCI6MjAyODk3MzMwMX0.SlluzvCN_cyLh0eojrP4uFqxhYq303qk9b5ghy44JyM"

export const supabase = createClient(URL, API_KEY);