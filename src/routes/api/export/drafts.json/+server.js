import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

export async function GET({ url }) {
  const season = Number(url.searchParams.get('season')) || new Date().getFullYear();

  const { data, error } = await supabaseAdmin
    .from('draft_picks') // table: draft_picks
    .select('id, season, round, pick_overall, pick_in_round, team_name, player_name, pos, nfl_team, price')
    .eq('season', season)
    .order('pick_overall', { ascending: true });

  if (error) return json({ season, picks: [], error: error.message }, { status: 500 });

  return json({ season, picks: data ?? [] }, {
    headers: { 'cache-control': 's-maxage=600, stale-while-revalidate=3600' }
  });
}
