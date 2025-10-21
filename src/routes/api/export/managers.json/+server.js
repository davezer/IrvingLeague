import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('managers') // table: managers
    .select('id, manager_name, team_name, short_name, since_season, avatar_url, bio, links')
    .order('manager_name', { ascending: true });

  if (error) return json({ managers: [], error: error.message }, { status: 500 });

  return json({ managers: data ?? [] }, {
    headers: { 'cache-control': 's-maxage=3600, stale-while-revalidate=86400' }
  });
}
