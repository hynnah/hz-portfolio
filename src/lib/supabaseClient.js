import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase env vars are missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
      'Content will fall back to the built-in defaults and the admin panel will not work until these are set in .env.local.'
  );
}

export const supabase = url && key ? createClient(url, key) : null;

export const ADMIN_ASSETS_BUCKET = 'portfolio-assets';
