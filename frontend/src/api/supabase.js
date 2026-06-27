import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aaprfltogeoscifrhvpi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable__9EjoxtuVcz0P6m0QawPuA_Af3llEN7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
