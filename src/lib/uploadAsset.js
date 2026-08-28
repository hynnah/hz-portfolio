import { supabase, ADMIN_ASSETS_BUCKET } from './supabaseClient';

/** Uploads a file to the portfolio-assets bucket and returns its public URL. */
export async function uploadAsset(file, pathPrefix) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const ext = file.name.split('.').pop();
  const path = `${pathPrefix}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(ADMIN_ASSETS_BUCKET).upload(path, file, {
    upsert: true,
    cacheControl: '3600',
  });
  if (error) throw error;

  const { data } = supabase.storage.from(ADMIN_ASSETS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
