// scripts/test-db.js
import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const SCHEMA = process.env.DB_SCHEMA || 'public'; // set to 'site' if you used a custom schema

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { db: { schema: SCHEMA } }
);

async function tableCount(table) {
  const { error, count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  return { table, error, count };
}

async function main() {
  console.log(`[schema=${SCHEMA}] Checking tables...`);

  // 1) Count rows for each table
  for (const t of ['managers', 'trades', 'waivers', 'standings']) {
    const { table, error, count } = await tableCount(t);
    console.log({ table, count, error: error?.message ?? null });
  }

  // 2) Write test: upsert 1 manager, then read it back
  console.log('Writing a dummy manager row...');
  const dummy = { id: 9999, name: 'Health Check', avatar: null, user_id: 'test-9999' };
  const { error: upErr } = await supabase.from('managers').upsert(dummy, { onConflict: 'id' });
  if (upErr) {
    console.error('Upsert error:', upErr);
  } else {
    const { data, error: rdErr } = await supabase.from('managers').select('*').eq('id', 9999).single();
    console.log('Readback:', rdErr ? rdErr.message : data);
  }

  // 3) Clean up dummy row (optional)
  await supabase.from('managers').delete().eq('id', 9999);
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
