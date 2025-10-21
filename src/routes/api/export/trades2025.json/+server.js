import { json } from '@sveltejs/kit';
import { supabaseAdmin } from '$lib/server/supabase';

const OK_STATUSES = ['completed', 'accepted', 'processed', 'approved'];

export async function GET() {
  const season = 2025;

  const { data, error } = await supabaseAdmin
    .from('transactions') // table: transactions
    .select('id, date, type, status, league_season, teams, notes')
    .eq('league_season', season)
    .eq('type', 'trade')
    .in('status', OK_STATUSES)
    .order('date', { ascending: false });

  if (error) return json({ season, trades: [], error: error.message }, { status: 500 });

  return json({ season, trades: data ?? [] }, {
    headers: { 'cache-control': 's-maxage=120, stale-while-revalidate=600' }
  });
}
