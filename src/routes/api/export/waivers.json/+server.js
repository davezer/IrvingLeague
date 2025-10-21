import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

const OK_STATUSES = ['completed', 'processed', 'approved'];
const TYPES = ['waiver', 'add', 'drop', 'faab', 'claim'];

export async function GET({ url }) {
  const season = Number(url.searchParams.get('season')) || new Date().getFullYear();

  const { data, error } = await supabaseAdmin
    .from('transactions') // table: transactions
    .select('id, date, type, status, league_season, teams, player, amount, notes')
    .eq('league_season', season)
    .in('type', TYPES)
    .in('status', OK_STATUSES)
    .order('date', { ascending: false });

  if (error) return json({ season, waivers: [], error: error.message }, { status: 500 });

  return json({ season, waivers: data ?? [] }, {
    headers: { 'cache-control': 's-maxage=120, stale-while-revalidate=600' }
  });
}
