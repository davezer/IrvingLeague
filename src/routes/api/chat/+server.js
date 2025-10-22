// src/routes/api/chat/+server.js
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$lib/server/env';
import { retrieveHybrid } from '$lib/rag/retrieve';
import { createClient } from '@supabase/supabase-js';

const SYSTEM = [
  'You are the Irving Champions League assistant.',
  'Use ONLY the provided context (from irvingleague.club).',
  'Prefer structured lines (prefixes like STANDING:, TRADE:, BADGE:) over prose.',
  'Do not infer standings or win-loss records unless a STANDING: line is in context.',
  'Only count trades that are explicitly marked completed/accepted/processed; ignore rejected/pending/canceled.',
  'If needed info is not present in the context, say: “I don’t know, ask Dave to fix this.”',
  'Be concise.',
  // ↓ NEW: response style rules
  'When multiple structured lines describe the same fact (e.g., MOST_EXPENSIVE_PLAYER + FANTASY_TEAM), merge them into ONE short sentence.',
  'Do NOT repeat keys verbatim. Prefer natural phrasing with bold where helpful.',
  'When answering, do not print keys like "Player:" or "Drafted BY:". Use one short natural sentence. If a subfield is unknown, omit it.',
  'If any subfield is unknown, omit it instead of printing “I don’t know, ask Dave to fix this.”',
  'Examples:',
  '  Input lines:',
  '    MOST_EXPENSIVE_PLAYER: Bijan Robinson (ATL) — $69',
  '    FANTASY_TEAM: Milford Jayhawks',
  '  Output: 💰 **Most expensive**: **Bijan Robinson (ATL)** for **$69** — to **Milford Jayhawks**.'
].join('\n');

// Nickname expansion (tweak as needed)
const TEAM_ALIASES = {
  // Dave Oliverio — Lehigh Crucible
  '\\blehigh\\b|\\bdave\\b|\\boliverio\\b': 'Lehigh Crucible',
  // Jeff Cohn — Ultimate City Warriors
  '(ultimate\\s*city|\\bucw\\b|\\bjeff\\b|\\bjeff\\s+cohn\\b)': 'Ultimate City Warriors',
  // Jamie Cohn — Dagobah Lightsabres (allow "lightsabers")
  '(dagobah\\s*lightsab(?:res|ers)\\b|\\bjamie\\b|\\bjamie\\s+cohn\\b)': 'Dagobah Lightsabres',
  // Kenny Case — Rebel Radio Lone Rangers
  '(rebel\\s*radio\\s*lone\\s*rangers|\\brebel\\s*radio\\b|\\blone\\s*rangers\\b|\\brrlr\\b|\\bkenny\\s*case\\b|\\bkenny\\b)': 'Rebel Radio Lone Rangers',
  // Clifton McVay — Salem Hipsterjacks
  '(hipsterjacks?\\b|\\bcliff\\b|\\bclifton\\b|\\bclifton\\s+mcvay\\b|\\bmcvay\\b)': 'Salem Hipsterjacks',
  // Kevin Flanagan — Nakatomi Plaza CC
  '(nakatomi\\s*plaza\\s*cc\\b|\\bnakatomi\\b|\\bnpcc\\b|\\bkevin\\s*flanagan\\b|\\bflanagan\\b|\\bkevin\\b)': 'Nakatomi Plaza CC',
  // Drew Goodwin — Amherst Union
  '(amherst\\s*union\\b|\\bdrew\\b|\\bdrew\\s+goodwin\\b|\\bgoodwin\\b)': 'Amherst Union',
  // Jason Gray — Milford Jayhawks
  '(milford\\s*jayhawks\\b|\\bjayhawks\\b|\\bjason\\s*gray\\b|\\bjason\\b|\\bgray\\b|\\bjay\\b)': 'Milford Jayhawks',
  // Romano DeSimone — Jacksonville Vincitori
  '(jacksonville\\s*vincitori?\\b|\\bromano\\b|\\bromano\\s+desimone\\b|\\bdesimone\\b)': 'Jacksonville Vincitori',
  // James Barmore — Dunedin Homers
  '(dunedin\\s*homers\\b|\\bdunedin\\b|\\bjames\\s*barmore\\b|\\bbarmore\\b)': 'Dunedin Homers',
  // Brian James — Kodachromes
  '(\\bkodachromes\\b|\\bkodas?\\b|\\bkodies\\b|\\bbrian\\s+james\\b)': 'Kodachromes',
  // Brian Marx — Tallahassee Tribe
  '(tallahassee\\s*tribe\\b|\\btallahassee\\b|\\bbrian\\s*marx\\b|\\bmarx\\b)': 'Tallahassee Tribe',
  // Adam Lopiano — Saskatchewan Mounties
  '(saskatchewan\\s*mounties\\b|\\bmounties\\b|\\bsaskatchewan\\b|\\badam\\s+lopiano\\b|\\blopiano\\b|\\badam\\b)': 'Saskatchewan Mounties',
  // Brad Thornton — Crescent Lake Henry Pussycats
  '(crescent\\s*lake\\s*henry\\s*pussycats\\b|\\bbrad\\b|\\bbrad\\s+thornton\\b|\\bthornton\\b)': 'Crescent Lake Henry Pussycats'
};

function expandTeamAliases(q) {
  let out = q;
  for (const [pat, full] of Object.entries(TEAM_ALIASES)) {
    out = out.replace(new RegExp(pat, 'ig'), full);
  }
  return out;
}

const WORD_ALIASES = {
  // verbs around drafting
  drafted: ['taken', 'selected', 'picked', 'chosen', 'bought', 'won', 'acquired', 'spent on'],
  // price phrasing
  price: ['cost', 'go for', 'went for', 'sell for', 'sold for', 'paid', 'spent', 'buy for', 'purchase price', 'fee'],
  // picks
  'overall pick': ['overall selection', 'overall choice'],
  // auctions/budget
  'auction budget': ['draft cash', 'draft money', 'draft budget', 'future budget'],
  // transactions
  trade: ['traded', 'deal', 'swap'],
  waiver: ['waiver wire', 'claimed', 'pickup', 'picked up'],
  roster: ['lineup', 'squad', 'team sheet'],
  manager: ['owner', 'coach', 'gm']
};
function expandWordAliases(text) {
  let out = text;
  const entries = Object.entries(WORD_ALIASES)
    .flatMap(([canonical, arr]) => arr.map((a) => [a, canonical]))
    .sort((a, b) => b[0].length - a[0].length); // longest first
  for (const [alias, canonical] of entries) {
    const re = new RegExp(`\\b${alias.replace(/\s+/g, '\\s+')}\\b`, 'ig');
    out = out.replace(re, canonical);
  }
  return out;
}

function normalizeQuery(q) {
  const base = expandTeamAliases(q.trim());
  const rewrites = [
    [/^who won\??$/i, 'which team won the most recent championship'],
    [/^who (is|'s) in first( place)?\??$/i, 'which team is currently in first place in the standings'],
    [/^who has the most badges\??$/i, 'which team has the most badges this season']
  ];
  for (const [pat, rep] of rewrites) if (pat.test(base)) return rep;
  let q2 = base.replace(/^who\b/i, 'which team');
  q2 = q2
    .replace(/most badges( this season)?/i, 'has the most badges this season')
    .replace(/most trades( this season)?/i, 'has made the most trades this season')
    .replace(/\bdraft (money|dollars?|budget|cash)\b/gi, 'auction budget')
    .replace(/who has the most (titles|rings)/i, 'which team has the most championships')
    .replace(/who won (week|wk)\s*(\d+)/i, 'which team won week $2');
  return q2;
}

async function embedIntent(ai, text) {
  const INTENTS = [
    'price_of_player',
    'who_drafted',
    'round_of_player',
    'pick_of_player',
    'overall_pick',
    'round_pick',
    'parlay',
    'trade',
    'waiver',
    'badges',
    'roster',
    'manager',
    'auction_budget'
  ];
  const qEmb = (await ai.embeddings.create({ model: 'text-embedding-3-small', input: text })).data[0].embedding;
  const iEmbs = await ai.embeddings.create({ model: 'text-embedding-3-small', input: INTENTS });
  let best = { idx: -1, sim: -1 };
  for (let i = 0; i < INTENTS.length; i++) {
    const v = iEmbs.data[i].embedding;
    const sim = cosine(qEmb, v);
    if (sim > best.sim) best = { idx: i, sim };
  }
  return best.sim > 0.75 ? INTENTS[best.idx] : null;
}
function cosine(a, b) {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

// ---- re-rankers (Methods 3 & 4) --------------------------------------------
function preferStructured(items, needle) {
  const hi = [],
    lo = [];
  for (const c of items) {
    const t = (c.content || '').toLowerCase();
    (t.includes(needle) ? hi : lo).push(c);
  }
  return [...hi, ...lo];
}
function prioritizeByIntent(query, items) {
  let out = items;
  const q = query.toLowerCase();
  if (/\b(standing|first place|rank|w[-\s]*l|record)\b/.test(q)) out = preferStructured(out, 'structured standings');
  if (/\btrade|transaction|waiver|pickup|drop|faab|bid|acquired|added\b/.test(q)) out = preferStructured(out, 'trade:');
  if (/\bbadge|badges?\b/.test(q)) out = preferStructured(out, 'badges summary');
  if (/\bparlay|bets?|odds\b/.test(q)) out = preferStructured(out, '/parlay');
  return out;
}

// Optional: filter down obvious noise BEFORE prompt building
function postFilterTradesInContext(text) {
  const lines = text.split('\n');
  const keep = [];
  for (const L of lines) {
    if (!/^TRADE:/i.test(L)) {
      keep.push(L);
      continue;
    }
    const ll = L.toLowerCase();
    if (ll.includes('completed') || ll.includes('accepted') || ll.includes('processed')) {
      keep.push(L);
      continue;
    }
    if (/draft:\s+.+\$\d+/i.test(L)) continue;
    keep.push(L);
  }
  return keep.join('\n');
}

/** ---------------- Draft queries handling (Supabase) ----------------- **/
let _supabase = null;
function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-only; do NOT expose to client
  if (!url || !key) {
    throw new Error('Server misconfig: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.');
  }
  _supabase = createClient(url, key);
  return _supabase;
}

/* ---------------------- Parlay helpers (JS) ------------------------- */
function isParlayQuery(q = '') {
  return /\b(parlay|bets?|wagers?|odds|lines?|props?)\b/i.test(q);
}

function extractParlayParams(msg = '') {
  const params = new URLSearchParams();

  const sm = msg.match(/\b(?:season|for|in)\s+(20\d{2})\b/i);
  if (sm) params.set('season', sm[1]);
  const wm = msg.match(/\b(?:week|wk)\s*(\d{1,2})\b/i);
  if (wm) params.set('week', wm[1]);

  const statusMap = [
    ['win', 'won'],
    ['loss', 'lost'],
    ['push', 'push'],
    ['open', 'open']
  ];
  for (const [canon, alias] of statusMap) {
    if (new RegExp(`\\b(${canon}|${alias})\\b`, 'i').test(msg)) {
      params.set('status', canon);
      break;
    }
  }

  // detect team by alias
  for (const [pattern, teamName] of Object.entries(TEAM_ALIASES)) {
    const re = new RegExp(pattern, 'i');
    if (re.test(msg)) {
      params.set('user', teamName);
      break;
    }
  }
  return params;
}


function statusMeta(s = '') {
  const t = String(s).toLowerCase();
  if (t.startsWith('win')) return { icon: '✅', label: 'WIN' };
  if (t.startsWith('loss')) return { icon: '❌', label: 'LOSS' };
  if (t.startsWith('push')) return { icon: '➖', label: 'PUSH' };
  return { icon: '⏳', label: 'OPEN' };
}

function prettyDate(d, season, week) {
  if (!d && season) return `S${season}${week ? ` • Wk ${week}` : ''}`;
  if (!d) return '';
  const s = String(d).trim().replace(/\s*—\s*/g, '-').replace(/\s+/g, ' ');

  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [, mo, da, y] = m;
    const dt = new Date(+y, +mo - 1, +da);
    return dt.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
  }
  m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (m) {
    const [, y, mo, da] = m;
    const dt = new Date(+y, +mo - 1, +da);
    return dt.toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
  }
  return s;
}




function normalizeParlayRows(rows = []) {
  const pick = (obj, ...keys) => {
    for (const k of keys) {
      if (obj[k] != null && String(obj[k]).trim() !== '') return String(obj[k]).trim();
    }
    return '';
  };
  return rows.map((r) => ({
    gm_team: pick(r, 'GM Team', 'Team', 'Owner', 'User'),
    date: pick(r, 'Date', 'day', 'when'),
    group_parlay_bet: pick(r, 'Group Parlay Bet', 'Parlay Bet', 'Bet', 'Pick', 'Selection'),
    group_parlay_result: String(pick(r, 'Group Parlay Result', 'Result', 'Outcome', 'Status') || 'Open').trim(),
    bet_category_1: pick(r, 'Bet Category 1', 'Category', 'Type', 'Market')
  }));
}


function formatParlaysMarkdownPretty(rows = [], title = 'Parlays', stats = null) {
  if (!rows || !rows.length) return `**${title}:** _none_`;

  const header = stats
    ? `\`Record: ${stats.wins}-${stats.losses}${stats.open ? ` (${stats.open} open)` : ''} • Win%: ${stats.pct}%\``
    : null;

  // Build proper Markdown list items (→ <ul><li>…</li></ul>)
  const items = rows.map((r) => {
    const { icon, label } = statusMeta(r.group_parlay_result);
    const date = prettyDate(r.date);
    const bet  = r.group_parlay_bet || '(no bet listed)';
    const type = r.bet_category_1 ? ` _${r.bet_category_1}_` : '';
    return `- ${icon} **${date}** — ${bet} — \`${label}\`${type}`;
  });

  // Blank lines ensure paragraphs/lists render as separate blocks
  return [
    `**${title}**`,
    header,
    '',                // ← blank line before list
    ...items
  ].filter(Boolean).join('\n');
}



function computeLeagueSummary(rows = []) {
  const byTeam = {};
  for (const r of rows) {
    const team = r.gm_team || 'Unknown';
    if (!byTeam[team]) byTeam[team] = { wins: 0, losses: 0, open: 0, total: 0 };
    const res = String(r.group_parlay_result).toLowerCase();
    if (res.startsWith('win')) byTeam[team].wins++;
    else if (res.startsWith('loss')) byTeam[team].losses++;
    else byTeam[team].open++;
    byTeam[team].total++;
  }
  const entries = Object.entries(byTeam).map(([team, s]) => {
    const pct = s.total ? ((s.wins / s.total) * 100).toFixed(1) : '0.0';
    return { team, ...s, pct };
  });
  entries.sort((a, b) => b.pct - a.pct || b.wins - a.wins);
  const lines = entries.map(
    (e) =>
      `- **${e.team}** — ${e.wins}-${e.losses}${e.open ? ` (${e.open} open)` : ''} • **${e.pct}%**`
  );
  return ['### 🏆 League-Wide Parlay Summary', '', ...lines].join('\n');
}

async function fetchAndFormatParlays(baseUrl, msg) {
  try {
    const params = extractParlayParams(msg);

    // League-wide summary? (detect before anything else)
    const showLeague = /\b(all|league|everyone|summary|standings|leaderboard|overall)\b/i.test(msg);

    // Capture user locally, but DO NOT send it to the API
    const userAlias = params.get('user') || '';
    params.delete('user');

    // Build URL after deleting user
    const url = `${baseUrl}/parlay.json${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return `Parlays: _source error (${res.status})_`;

    const j = await res.json();
    const rows = normalizeParlayRows(Array.isArray(j?.data) ? j.data : []);
    if (!rows.length) return 'Parlays: _none found_';

    if (showLeague) return computeLeagueSummary(rows);

    // Normalize helper for robust matching
    const norm = (s) => String(s || '').trim().toLowerCase();

    const filtered = userAlias
      ? rows.filter((r) => norm(r.gm_team) === norm(userAlias))
      : rows;

    if (!filtered.length) {
      const title = userAlias ? `${userAlias}'s Parlays` : 'Parlays';
      return `**${title}:** _none_`;
    }

    const wins   = filtered.filter((r) => norm(r.group_parlay_result).startsWith('win')).length;
    const losses = filtered.filter((r) => norm(r.group_parlay_result).startsWith('loss')).length;
    const open   = filtered.filter((r) => norm(r.group_parlay_result).startsWith('open')).length;
    const total  = filtered.length;
    const pct    = total ? ((wins / total) * 100).toFixed(1) : '0.0';
    const stats  = { wins, losses, open, total, pct };

    const titleBits = [];
    if (userAlias) titleBits.push(`${userAlias}'s Parlays`);
    const s = params.get('season'); if (s) titleBits.push(`Season ${s}`);
    const w = params.get('week');   if (w) titleBits.push(`Wk ${w}`);
    const title = titleBits.join(' • ') || 'Parlays';

    return formatParlaysMarkdownPretty(filtered, title, stats);
  } catch (e) {
    console.error('Parlay fetch error:', e);
    return 'Parlays: _unavailable_';
  }
}



/* --------- Detects intent; returns DB intent or RAG query ------------- */
function getDraftIntent(message) {
  let text = (message || '').trim();
  text = expandTeamAliases(text);
  text = expandWordAliases(text);

  const seasonMatch = text.match(/\b(?:in|for)\s+(20\d{2})\b/i);
  const season = seasonMatch ? seasonMatch[1] : null;

  // PRICE / AUCTION AMOUNT
  {
    const playerFrom = (t) => {
      const patterns = [
        [/^\s*how\s+much\s+did\s+(.+?)\s+(?:go\s+for|cost)\b.*?(?:in\s+the\s+draft|at\s+auction)?\s*$/i, 1],
        [/^\s*what\s+did\s+(.+?)\s+go\s+for(?:\s+in\s+the\s+draft)?\s*$/i, 1],
        [/^\s*how\s+much\s+for\s+(.+?)(?:\s+in\s+the\s+draft)?\s*$/i, 1],
        [/^\s*how\s+much\s+was\s+(.+?)\s+drafted(?:\s+for)?\s*$/i, 1],
        [/^\s*for\s+how\s+much\s+(?:was\s+)?(.+?)\s+drafted\s*$/i, 1],
        [/^\s*(?:price|auction\s+price|draft\s+price)\s+for\s+(.+?)\s*$/i, 1],
        [/^\s*what\s+was\s+(.+?)['’]s?\s+(?:price|cost)\s*(?:in\s+the\s+draft)?\s*$/i, 1],
        [/^\s*how\s+much\s+was\s+(.+?)\s+(?:bought|won)\s+for\s*$/i, 1],
        [/^\s*(?:how\s+much\s+)?did\s+(.+?)\s+go\s+for\s*$/i, 1],
        [/^\s*(.+?)\s+(?:draft|auction)\s+price\s*$/i, 1]
      ];
      for (const [re, gi] of patterns) {
        const m = t.match(re);
        if (m && m[gi]) return m[gi].trim();
      }
      return null;
    };
    const player = playerFrom(text);
    if (player) return { type: 'price_of_player', player, season };
  }

  // WHO DRAFTED <PLAYER>
  {
    const m = text.match(/^\s*who\s+drafted\s+(.+)\s*$/i);
    if (m) return { type: 'who_drafted', player: m[1].trim(), season };
  }

  // WHAT ROUND/PICK WAS <PLAYER> DRAFTED
  {
    const m1 = text.match(/^\s*what\s+round\s+was\s+(.+)\s+drafted/i);
    if (m1) return { type: 'round_of_player', player: m1[1].trim(), season };
    const m2 = text.match(/^\s*(what\s+pick|where|when)\s+was\s+(.+)\s+drafted/i);
    if (m2) return { type: 'pick_of_player', player: m2[2].trim(), season };
  }

  // OVERALL PICK
  {
    const m1 = text.match(/\bwho\s+(?:was|is)\s+the\s+(\d+)(?:st|nd|rd|th)?\s+(?:overall\s+)?pick\b/i);
    if (m1) return { type: 'overall_pick', overall: Number(m1[1]), season };
    const m2 = text.match(/\bwho\s+(?:was|is)\s+pick\s+(\d+)\s+overall\b/i);
    if (m2) return { type: 'overall_pick', overall: Number(m2[1]), season };
  }

  // ROUND + PICK
  {
    const m = text.match(/\bwho\s+(?:was|is)\s+round\s+(\d+)\s+pick\s+(\d+)\b/i);
    if (m) return { type: 'round_pick', round: Number(m[1]), pick_in_round: Number(m[2]), season };
  }

  // WEBSITE / RAG-ONLY INTENTS
  if (/\b(parlay|bets?|odds|wager|lines?)\b/i.test(text)) {
    return { type: 'rag_query', query: expandTeamAliases(text.replace(/\?/g, '')) };
  }
  if (/\b(trades?|transactions?|waivers?|waiver\s+wire|faab|bid|added|acquired|dropped|pickup|picked\s*up|claimed)\b/i.test(text)) {
    return { type: 'rag_query', query: expandTeamAliases(text.replace(/\?/g, '')) };
  }
  if (/\bbadges?\b/i.test(text)) {
    return { type: 'rag_query', query: expandTeamAliases(text.replace(/\?/g, '')) };
  }
  if (/\b(rosters?|lineup|manager|owner|coach)\b/i.test(text)) {
    return { type: 'rag_query', query: expandTeamAliases(text.replace(/\?/g, '')) };
  }
  if (/\b(future\s+draft\s+money|auction\s+budget|draft\s+budget|future\s+budget)\b/i.test(text)) {
    return { type: 'rag_query', query: expandTeamAliases(text.replace(/\?/g, '')) };
  }

  return null;
}

// ----------------- Supabase helpers (draft_picks) --------------------
async function fetchDraftPickForPlayer(player, season = null) {
  const db = getSupabase();
  let q = db
    .from('draft_picks')
    .select('player_name, team_name, season, price, round, pick_no', { count: 'exact' })
    .ilike('player_name', player)
    .order('pick_no', { ascending: true })
    .limit(5);
  if (season) q = q.eq('season', String(season));
  let { data, error } = await q;

  if ((!data || !data.length) && !error) {
    let q2 = db
      .from('draft_picks')
      .select('player_name, team_name, season, price, round, pick_no', { count: 'exact' })
      .ilike('player_name', `%${player}%`)
      .order('pick_no', { ascending: true })
      .limit(5);
    if (season) q2 = q2.eq('season', String(season));
    ({ data, error } = await q2);
  }
  if (error) throw error;
  if (!data?.length) return null;
  data.sort((a, b) => (a?.pick_no ?? 1e9) - (b?.pick_no ?? 1e9));
  return data[0];
}

async function fetchDraftPickByOverall(overall, season = null) {
  const db = getSupabase();
  let q = db
    .from('draft_picks')
    .select('player_name, team_name, season, price, round, pick_no', { count: 'exact' })
    .eq('pick_no', overall)
    .order('season', { ascending: false })
    .limit(10);
  if (season) q = q.eq('season', String(season));
  const { data, error } = await q;
  if (error) throw error;
  return data?.[0] || null;
}

async function getTeamsCount(season = null) {
  const db = getSupabase();
  let q = db.from('draft_picks').select('pick_no', { count: 'exact', head: true }).eq('round', 1);
  if (season) q = q.eq('season', String(season));
  const { count, error } = await q;
  if (error) throw error;
  return count || 10;
}

async function fetchDraftPickByRoundPick(round, pick_in_round, season = null) {
  const teams = await getTeamsCount(season);
  const overall = (round - 1) * teams + pick_in_round;
  return fetchDraftPickByOverall(overall, season);
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

async function answerDraftIntent(intent) {
  if (
    intent.type === 'price_of_player' ||
    intent.type === 'who_drafted' ||
    intent.type === 'round_of_player' ||
    intent.type === 'pick_of_player'
  ) {
    const p = await fetchDraftPickForPlayer(intent.player, intent.season || null);
    if (!p) return `I don't see **${intent.player}** in the draft data${intent.season ? ` for ${intent.season}` : ''}.`;

    if (intent.type === 'price_of_player') {
      if (p.price != null) {
        return `💸 **${p.player_name}** went for **$${Number(p.price)}**${p.team_name ? ` to **${p.team_name}**` : ''}${
          p.season ? ` (Season ${p.season})` : ''
        }.`;
      }
      return `I don’t have a price stored for **${p.player_name}**${p.season ? ` (Season ${p.season})` : ''}.`;
    }
    if (intent.type === 'who_drafted') {
      return `🧢 **${p.player_name}** was drafted by **${p.team_name ?? 'Unknown'}** (Round ${p.round}, Pick ${p.pick_no}${
        p.season ? `, Season ${p.season}, $${p.price}` : ''
      }).`;
    }
    if (intent.type === 'round_of_player') {
      return `📘 **${p.player_name}** was drafted in **Round ${p.round}** (Pick ${p.pick_no}${
        p.team_name ? ` by ${p.team_name}` : ''
      }${p.season ? `, Season ${p.season}, $${p.price}` : ''}).`;
    }
    if (intent.type === 'pick_of_player') {
      return `🎯 **${p.player_name}** was drafted at **Pick ${p.pick_no}** (Round ${p.round}${
        p.team_name ? ` by ${p.team_name}` : ''
      }${p.season ? `, Season ${p.season}, $${p.price}` : ''}).`;
    }
  }

  if (intent.type === 'overall_pick') {
    const p = await fetchDraftPickByOverall(intent.overall, intent.season || null);
    if (!p) return `I don't see a ${intent.overall} overall pick${intent.season ? ` for ${intent.season}` : ''} in the draft data.`;
    const seasonText = p.season ? ` (Season ${p.season})` : '';
    const overallText = p.pick_no != null ? `${ordinal(Number(p.pick_no))} overall` : 'Overall pick';
    const roundText = p.round != null ? ` — Round ${p.round}` : '';
    const priceText = p.price != null ? ` He went for $${Number(p.price)}.` : '';
    return `📋 **${overallText}**: **${p.player_name}** to **${p.team_name ?? 'Unknown'}**${roundText}${seasonText}.${priceText}`;
    }

  if (intent.type === 'round_pick') {
    const p = await fetchDraftPickByRoundPick(intent.round, intent.pick_in_round, intent.season || null);
    if (!p)
      return `I don't see Round ${intent.round}, Pick ${intent.pick_in_round}${intent.season ? ` for ${intent.season}` : ''} in the draft data.`;
    const seasonText = p.season ? ` (Season ${p.season})` : '';
    const overallText = p.pick_no != null ? ` — ${ordinal(Number(p.pick_no))} overall` : '';
    const priceText = p.price != null ? ` He went for $${Number(p.price)}.` : '';
    return `📋 **Round ${intent.round}, Pick ${intent.pick_in_round}**: **${p.player_name}** to **${p.team_name ?? 'Unknown'}**${overallText}${seasonText}.${priceText}`;
  }

  return null; // not a draft DB intent
}

/** ------------------- Main handler ------------------- **/
export async function POST({ request }) {
  const origin = new URL(request.url).origin;
  const EXPORT_BASE = `${origin}/api/export`;

  try {
    if (!OPENAI_API_KEY) return new Response('Missing OPENAI_API_KEY', { status: 500 });

    const { message = '' } = await request.json();
    const normalized = expandTeamAliases(message.toLowerCase());

     if (isParlayQuery(normalized)) {
      const formatted = await fetchAndFormatParlays(EXPORT_BASE, normalized);
      return new Response(JSON.stringify({ answer: formatted }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }


    // 1) intent detect
    const intent = getDraftIntent(message);

    // 1a) If it’s a website-only intent, route straight to RAG with normalized query
    if (intent?.type === 'rag_query') {
      const ai = new OpenAI({ apiKey: OPENAI_API_KEY });
      const query = normalizeQuery(intent.query);

      const emb = await ai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query
      });
      const queryEmbedding = emb.data[0].embedding;

      const k = 32;
      const raw = await retrieveHybrid({
        queryText: query,
        queryEmbedding,
        k,
        supabase: typeof getSupabase === 'function' ? getSupabase() : undefined
      });
      const ranked = prioritizeByIntent(query, raw);

      let context = ranked.map((c, i) => `[${i + 1}] ${c.content} (source: ${c.url})`).join('\n\n');
      if (context.length > 16000) context = context.slice(0, 16000) + '\n\n[truncated]';
      context = postFilterTradesInContext(context);

      const resp = await ai.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-5',
        input: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: `Context:\n${context}\n\nQuestion (normalized): ${query}\nOriginal wording: ${message}` }
        ]
      });

      const answer = resp.output_text || 'Sorry — no answer.';
      return new Response(JSON.stringify({ answer }), { headers: { 'Content-Type': 'application/json' } });
    }

    // 1b) Draft DB intents
    if (intent) {
      try {
        const answer = await answerDraftIntent(intent);
        if (answer) {
          return new Response(JSON.stringify({ answer }), { headers: { 'Content-Type': 'application/json' } });
        }
      } catch (e) {
        console.error('Draft DB error:', e);
        const msg = String(e?.message || e || '');
        const friendly =
          msg.includes('SUPABASE_URL') || msg.includes('SUPABASE_SERVICE_ROLE_KEY')
            ? 'Server misconfig: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.'
            : 'Sorry — DB error.';
        return new Response(JSON.stringify({ answer: friendly }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200
        });
      }
      // fall through to RAG if no draft answer was produced
    }

    // 2) RAG over site context (default path)
    const ai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const query = normalizeQuery(message);

    const emb = await ai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query
    });
    const queryEmbedding = emb.data[0].embedding;

    const k = 32;
    const raw = await retrieveHybrid({
      queryText: query,
      queryEmbedding,
      k,
      supabase: typeof getSupabase === 'function' ? getSupabase() : undefined
    });
    const ranked = prioritizeByIntent(query, raw);

    let context = ranked.map((c, i) => `[${i + 1}] ${c.content} (source: ${c.url})`).join('\n\n');
    if (context.length > 16000) context = context.slice(0, 16000) + '\n\n[truncated]';
    context = postFilterTradesInContext(context);

    const resp = await ai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5',
      input: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: `Context:\n${context}\n\nQuestion (normalized): ${query}\nOriginal wording: ${message}` }
      ]
    });

    const answer = resp.output_text || 'Sorry — no answer.';
    return new Response(JSON.stringify({ answer }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ answer: 'Server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
