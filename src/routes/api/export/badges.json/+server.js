// src/routes/api/export/badges.json/+server.js
import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export async function GET({ url }) {
  const season = url.searchParams.get('season') ?? new Date().getFullYear();

  // adjust query to your schema/table
  const { data, error } = await supabaseAdmin
    .from('badges')
    .select('*')
    .eq('season', Number(season))
    .order('awarded_at', { ascending: false });

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }
  return json({ season: Number(season), badges: data ?? [] });
}
