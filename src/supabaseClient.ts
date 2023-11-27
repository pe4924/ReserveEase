import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;

console.log(`Supabase URL: ${SUPABASE_URL}`);
// APIキーの存在を確認するだけで、実際の値は出力しない
console.log(`Supabase API Key is defined: ${!!SUPABASE_API_KEY}`);

if (!SUPABASE_URL || !SUPABASE_API_KEY) {
  throw new Error("Supabase URL and API key must be defined");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
