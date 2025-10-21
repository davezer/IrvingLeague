import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export async function GET({ url }) {
  const season = Number(url.searchParams.get('season')) || new Date().getFullYear();

  const { data, error } = await supabaseAdmin
    .from('standings') // table: standings
    .select('team_id, team_name, wins, losses, ties, points_for, points_against, rank, season')
    .eq('season', season)
    .order('rank', { ascending: true });

  if (error) return json({ season, standings: [], error: error.message }, { status: 500 });

  return json({ season, standings: data ?? [] }, {
    headers: { 'cache-control': 's-maxage=60, stale-while-revalidate=300' }
  });
}
