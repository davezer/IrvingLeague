// src/routes/api/badges-index/+server.js
import { json } from '@sveltejs/kit';
import { managers, leagueName } from '$lib/utils/leagueInfo';

// -------- Persona definitions
const personaDefs = {
    'The Wolf': 'Max Chaos. Always pouncing on the possibilities.',
    'The Littlefinger':
        'The Schemer. Edges found in backchannels and fine print.',
    'The Flacco':
        'Steady and unflashy until it’s time to sling it deep and steal a week.',
    'The Kornacki':
        'Data first tactician. Charts, trends, and probability trees all the way.',
};

// -------- League descriptions factory
const leagueDefs = (lname) => ({
    Irving: `Winner of the historic Irving League—merged into ${lname}.`,
    DTSP: `Champion of DTSP—legacy honors recognized in ${lname}.`,
});

// -------- Helpers
const slugify = (s) =>
    String(s || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

const THIS_YEAR = new Date().getFullYear();
const toInt = (v) => {
    const n = Number(String(v ?? '').trim());
    return Number.isFinite(n) ? n : null;
};
function getStartYear(m) {
    const candidates = [
        toInt(m?.startYear),
        toInt(m?.joinYear),
        toInt(m?.since),
        toInt(m?.fantasyStart),
    ].filter(Boolean);

    // fallback: earliest championship year
    const champYears = String(m?.championship?.years || '')
        .split(',')
        .map(toInt)
        .filter(Boolean);
    if (champYears.length) candidates.push(Math.min(...champYears));

    return candidates.length ? Math.min(...candidates) : null;
}
const tenureFromStart = (start, now = THIS_YEAR) =>
    !start ? 0 : Math.max(0, now - start); // use +1 if you count inclusively

export async function GET() {
    const list = Array.isArray(managers) ? managers : [];

    // -------- Personas
    const personaMap = new Map();
    for (const m of list) {
        const p = m?.persona?.trim();
        if (!p) continue;
        if (!personaMap.has(p)) personaMap.set(p, []);
        personaMap.get(p).push(m);
    }

    const personaBadges = [...personaMap.entries()].map(([p, ms]) => ({
        id: `persona-${slugify(p)}`,
        type: 'persona',
        name: `${p}`,
        definition: personaDefs[p] || `Managers with the “${p}” persona.`,
        icon: `/${p}.png`,
        earned: ms.map((m) => ({
            managerId: m.managerID,
            managerName: m.name,
            teamName: m.teamName,
            teamLogo: m.photo,
        })),
    }));

    // -------- Weekly (base list)
    const weeklyBadges = [
        {
            id: 'ides',
            type: 'weekly',
            name: 'The Ides',
            definition:
                'Awarded for being the highest scoring loser of the week. You loser.',
            icon: '/ides.png',
            earned: [],
        },
        {
            id: 'bde',
            type: 'weekly',
            name: 'BDE',
            definition: 'Awarded to the highest scoring team of the week.',
            icon: '/bde.png',
            earned: [],
        },
        {
            id: 'hbk',
            type: 'weekly',
            name: 'The HBK',
            definition: 'You lost by 1.0 or less.',
            icon: '/heartbreaker.png',
            earned: [],
        },
    ];

    const luckBadges = [
        {
            id: 'doyle',
            type: 'luck',
            name: 'The Doyle',
            definition: 'Luckiest Week (includes Parlays)',
            icon: '/doyle.png',
            earned: [],
        },
        {
            id: 'lowblow',
            type: 'luck',
            name: 'The Low Blow',
            definition: 'Unluckiest Week (includes Parlays)',
            icon: '/lowblow.png',
            earned: [],
        },
    ];

    // -------- Stains (separate bucket; awarded on demand via awardWeekly)
    const stainsBadges = [
        // examples; feel free to edit/remove or start empty
        {
            id: 'suck',
            type: 'stains',
            name: 'The Sucko',
            definition: 'Awarded to the lowest scoring team of the week.',
            icon: '/stains.png',
            earned: [],
        },
        {
            id: 'byebye',
            type: 'stains',
            name: 'The Bye Bye Bye',
            definition: 'You left a bye week player in your starting lineup.',
            icon: '/stains.png',
            earned: [],
        },
        {
            id: 'zerohour',
            type: 'stains',
            name: 'The Zero Hour',
            definition: 'You started a player a player who scored Zero Points.',
            icon: '/stains.png',
            earned: [],
        },
        {
            id: 'captain',
            type: 'stains',
            name: "The Cap'n Hindsight",
            definition: 'You left the game winning player on your bench.',
            icon: '/stains.png',
            earned: [],
        },
        {
            id: 'traderape',
            type: 'stains',
            name: 'The Trade Rape',
            definition: 'You transacted a TERRIBLE trade.',
            icon: '/stains.png',
            earned: [],
        },
        {
            id: 'badbeat',
            type: 'stains',
            name: 'The Bad Beat',
            definition:
                'GM explains why his Opponents victory is tarnished and stain-worthy',
            icon: '/stains.png',
            earned: [],
        },
    ];
    // -------- Shared award helper (works for weekly + stains)
    const byId = Object.fromEntries(list.map((m) => [m.managerID, m]));
    function awardWeekly({
        badgeId,
        managerId,
        season,
        week,
        points,
        opponent,
        opponentPoints,
        explanation,
        nominatedBy,
    }) {
        const badge =
            weeklyBadges.find((b) => b.id === badgeId) ||
            stainsBadges.find((b) => b.id === badgeId) ||
            luckBadges.find((b) => b.id === badgeId);

        const m = byId[managerId];
        if (!badge || !m) return;

        badge.earned.push({
            managerId,
            managerName: m.name,
            teamName: m.teamName,
            teamLogo: m.photo,
            season: season ?? null,
            week: week ?? null,
            points: points ?? null,
            opponent: opponent ?? null,
            opponentPoints: opponentPoints ?? null,
            explanation: explanation ?? null,
            nominatedBy: nominatedBy ?? null,
        });
    }

    // -------- Example awards (weekly + stains). Edit as needed.
    awardWeekly({
        badgeId: 'captain',
        managerId: '1254577895943192576',
        season: 2025,
        week: 1,
        explanation: 'Coleman / Nico +17 & Sampson / Mason +5 = +22',
        nominatedBy: '76521957268799488',
    });
    awardWeekly({
        badgeId: 'captain',
        managerId: '1254577682394386432',
        season: 2025,
        week: 1,
        explanation:
            'Jakobi Myers / RJ Harvey = +6.4 , also your QB decisions were ridic',
        nominatedBy: '76521957268799488',
    });
    awardWeekly({
        badgeId: 'suck',
        managerId: '1256320322135674880',
        season: 2025,
        week: 1,
        points: 68.78,
    });
    awardWeekly({
        badgeId: 'zerohour',
        managerId: '857309838424809472',
        season: 2025,
        week: 1,
        explanation: 'DET DEF scored zero points',
        nominatedBy: '76521957268799488',
    });
    awardWeekly({
        badgeId: 'zerohour',
        managerId: '1260985941263126528',
        season: 2025,
        week: 1,
        explanation: 'Xavier Worthy (got injured in game)',
        nominatedBy: '76521957268799488',
    });
    awardWeekly({
        badgeId: 'zerohour',
        managerId: '1253772062900621312',
        season: 2025,
        week: 1,
        explanation: 'BAL RAVENs DEF -2 (NEGATIVE!)',
        nominatedBy: '76521957268799488',
    });
    awardWeekly({
        badgeId: 'bde',
        managerId: '1254578120531390464',
        season: 2025,
        week: 1,
        points: 124.66,
        opponent: '1256320322135674880',
        opponentPoints: 68.78,
    });
    awardWeekly({
        badgeId: 'ides',
        managerId: '1254577895943192576',
        season: 2025,
        week: 1,
        points: 97.38,
        opponent: '1253515645044133888',
        opponentPoints: 110.66,
    });

    awardWeekly({
        badgeId: 'bde',
        managerId: '1253772062900621312',
        season: 2025,
        week: 2,
        points: 146.04,
        opponent: '1005329348477419520',
        opponentPoints: 117.94,
    });
    awardWeekly({
        badgeId: 'ides',
        managerId: '1005329348477419520',
        season: 2025,
        week: 2,
        points: 117.94,
        opponent: '1253772062900621312',
        opponentPoints: 146.04,
    });
    awardWeekly({
        badgeId: 'captain',
        managerId: '1254577682394386432',
        season: 2025,
        week: 2,
        explanation: 'Stafford or Young over G. Smith',
        nominatedBy: '1253772062900621312',
    });
    awardWeekly({
        badgeId: 'suck',
        managerId: '1256695342544453632',
        season: 2025,
        week: 2,
        points: 72.58,
        explanation: 'Won Week 2 Sucko Award by 0.02 points',
        nominatedBy: '1253772062900621312',
    });
    awardWeekly({
        badgeId: 'traderape',
        managerId: '1253772062900621312',
        season: 2025,
        week: 2,
        explanation:
            'Traded Mathew Golden + $15 for Nick Chubb. Jeff DID NOT like this',
        nominatedBy: '76521957268799488',
    });
    awardWeekly({
        badgeId: 'zerohour',
        managerId: '1254584226238447616',
        season: 2025,
        week: 2,
        explanation: 'Reed (injury) and Den DEF',
        nominatedBy: '1253772062900621312',
    });

    awardWeekly({
        badgeId: 'badbeat',
        managerId: '1256320322135674880',
        season: 2025,
        week: 3,
        points: 120.84,
        opponent: '1254577682394386432',
        opponentPoints: 126.26,
        explanation:
            'It was looking like a surefire win until garbage time touchdowns from Montgomery and Andrews stole the win for Salem.',
    });
    awardWeekly({
        badgeId: 'bde',
        managerId: '1253515645044133888',
        season: 2025,
        week: 3,
        points: 126.86,
        opponent: '1260985941263126528',
        opponentPoints: 84.46,
    });
    awardWeekly({
        badgeId: 'ides',
        managerId: '1256320322135674880',
        season: 2025,
        week: 3,
        points: 120.84,
        opponent: '1254577682394386432',
        opponentPoints: 126.26,
    });
    awardWeekly({
        badgeId: 'zerohour',
        managerId: '1260985941263126528',
        season: 2025,
        week: 3,
        explanation: 'Started Xavier Worthy who was OUT, and scored ZERO',
        nominatedBy: '1253515645044133888',
    });
    awardWeekly({
        badgeId: 'suck',
        managerId: '1254584226238447616',
        season: 2025,
        week: 3,
        points: 82.66,
        opponent: '1256695342544453632',
        opponentPoints: 106.76,
    });

    awardWeekly({
        badgeId: 'bde',
        managerId: '1258962574360182785',
        season: 2025,
        week: 4,
        points: 135.26,
        opponent: '1254584226238447616',
        opponentPoints: 104.5,
    });
    awardWeekly({
        badgeId: 'ides',
        managerId: '1256320322135674880',
        season: 2025,
        week: 4,
        points: 117.4,
        opponent: '1253772062900621312',
        opponentPoints: 128.54,
    });
    awardWeekly({
        badgeId: 'suck',
        managerId: '1254577895943192576',
        season: 2025,
        week: 4,
        points: 86.82,
        opponent: '792114259365597184',
        opponentPoints: 126.78,
    });
    awardWeekly({
        badgeId: 'zerohour',
        managerId: '1253772062900621312',
        season: 2025,
        week: 4,
        explanation: 'Started BAL DEF who scored NEGATIVE 3 POINTS',
        nominatedBy: '1253772062900621312',
    });
    awardWeekly({
        badgeId: 'zerohour',
        managerId: '1254577682394386432',
        season: 2025,
        week: 4,
        explanation: 'Started GB DEF who scored NEGATIVE 3 POINTS',
        nominatedBy: '1253772062900621312',
    });
    awardWeekly({
        badgeId: 'zerohour',
        managerId: '1253772062900621312', //dave
        season: 2025,
        week: 5,
        explanation: 'Started BAL DEF who scored NEGATIVE 2 POINTS. AGAIN!',
        nominatedBy: '1253772062900621312',
    });
    awardWeekly({
        badgeId: 'bde',
        managerId: '1256695342544453632', //barmore
        season: 2025,
        week: 5,
        points: 139.12
    });
    awardWeekly({
        badgeId: 'ides',
        managerId: '1258962574360182785', //lopiano
        season: 2025,
        week: 5,
        points: 119.76,
        opponent: '1256695342544453632',
        opponentPoints: 139.12,
    });
    awardWeekly({
        badgeId: 'suck',
        managerId: '1256320322135674880', //kodachromes
        season: 2025,
        week: 5,
        points: 83,
    });
    awardWeekly({
        badgeId: 'captain',
        managerId: '1253772062900621312', //dave
        season: 2025,
        week: 5,
        explanation: 'Darnold or Montgomery or Shaheed or Chubb',
        nominatedBy: '1253515645044133888', //jamie
    });
    awardWeekly({
        badgeId: 'captain',
        managerId: '1256320322135674880', //kodachromes
        season: 2025,
        week: 5,
        explanation: 'Kareem Hunt over Tyjae Spears',
        nominatedBy: '1253515645044133888', //jamie
    });
    awardWeekly({
        badgeId: 'captain',
        managerId: '1254577682394386432', //salem
        season: 2025,
        week: 4,
        explanation: 'RJ harvey',
        nominatedBy: '1253515645044133888', //jamie
    });
    awardWeekly({
        badgeId: 'zerohour',
        managerId: '1254577895943192576', //kevin
        season: 2025,
        week: 5,
        explanation: 'Zach Ertz',
        nominatedBy: '1253772062900621312', //dave
    });
       awardWeekly({
        badgeId: 'lowblow',
        managerId: '1254577895943192576', //kevin
        season: 2025,
        week: 5,
        explanation: 'Lost to a team that had a kicker score 18 points. Without this insane performance, a win could have been on the table.',
        nominatedBy: '76521957268799488', //jeff
    });

    // -------- Championships → Legacy
    const byLeague = new Map();
    for (const m of list) {
        const c = m?.championship;
        const years = (c?.years || '').trim();
        const league = (c?.league || '').trim();
        if (!league || !years) continue;

        const yearList = years
            .split(',')
            .map((y) => y.trim())
            .filter(Boolean);
        if (!byLeague.has(league)) byLeague.set(league, []);
        byLeague.get(league).push({ ...m, _years: yearList });
    }

    const leagueDescriptions = leagueDefs(leagueName || 'this league');

    const champBadges = [...byLeague.entries()].map(([league, ms]) => {
        const key = league.trim().toLowerCase();
        const icon =
            key === 'irving'
                ? '/Irving.png'
                : key === 'dtsp'
                  ? '/DTSP.png'
                  : '/trophy.svg';
        return {
            id: `championship-${slugify(league)}`,
            type: 'championship',
            name: `${league} Champion`,
            definition:
                leagueDescriptions[league] ||
                `Champion of ${league}—legacy honors recognized here.`,
            icon,
            earned: ms.map((m) => ({
                managerId: m.managerID,
                managerName: m.name,
                teamName: m.teamName,
                teamLogo: m.photo,
                years: m._years,
            })),
        };
    });

    // -------- Legacy (pre-2025 only)
    const legacyBadges = champBadges
        .map((b) => {
            const earnedLegacy = (b.earned || [])
                .map((e) => {
                    const legacyYears = (e.years || []).filter(
                        (yr) => Number(yr) < 2025
                    );
                    return legacyYears.length
                        ? { ...e, years: legacyYears }
                        : null;
                })
                .filter(Boolean);
            if (!earnedLegacy.length) return null;
            return {
                ...b,
                id: `${b.id}-legacy`,
                type: 'legacy',
                name: `${b.name} (Legacy)`,
                definition: `${b.definition} (awarded prior to 2025)`,
                earned: earnedLegacy,
            };
        })
        .filter(Boolean);

    // -------- Years of Service (Yearly Badges: only 10 & 20)
    const yearlyBadges = (() => {
        const YEAR_THRESHOLDS = [10, 20];
        const iconFor = (y) => (y === 10 ? '/Ten.png' : '/Twenty.png');

        const defs = YEAR_THRESHOLDS.map((y) => ({
            id: `years-${y}`,
            type: 'yearly',
            name: `${y} Years of Service`,
            definition: `Awarded to managers with at least ${y} years of league service.`,
            icon: iconFor(y),
            earned: [],
        }));

        const defsById = Object.fromEntries(defs.map((d) => [d.id, d]));

        for (const m of list) {
            const startYear = getStartYear(m);
            const tenure = tenureFromStart(startYear);
            if (!tenure || tenure < 10) continue;

            const best = [...YEAR_THRESHOLDS]
                .reverse()
                .find((y) => tenure >= y);
            if (best) {
                defsById[`years-${best}`].earned.push({
                    managerId: m.managerID,
                    managerName: m.name,
                    teamName: m.teamName,
                    teamLogo: m.photo,
                    years: tenure,
                });
            }
        }

        return Object.values(defsById);
    })();

    // -------- Utilities for sections
    const addCount = (arr) =>
        arr.map((b) => ({ ...b, count: (b.earned || []).length }));
    const sortByName = (arr) =>
        [...arr].sort((a, b) => a.name.localeCompare(b.name));

    const personas = sortByName(addCount(personaBadges));
    const weekly = addCount(weeklyBadges);
    const yearly = addCount(yearlyBadges);
    const legacy = sortByName(addCount(legacyBadges));
    const stains = sortByName(addCount(stainsBadges)); // NEW
    const luck = sortByName(addCount(luckBadges)); // NEW

    // -------- byManager index (now includes stains)
    const byManager = {};
    const addToIndex = (badge) => {
        const bucket =
            badge.type === 'persona'
                ? 'personas'
                : badge.type === 'championship'
                  ? 'legacy'
                  : badge.type; // weekly | yearly | legacy | stains | luck

        for (const e of badge.earned || []) {
            const id = e.managerId;
            if (!id) continue;
            if (!byManager[id])
                byManager[id] = {
                    personas: [],
                    weekly: [],
                    yearly: [],
                    legacy: [],
                    stains: [],
                    luck: [],
                };

            // nominator
            const nomId = e.nominatedBy ?? null;
            const nomMeta = nomId ? byId[nomId] : null;

            // ✅ opponent
            const oppId = e.opponent ?? null;
            const oppMeta = oppId ? byId[oppId] : null;

            byManager[id][bucket].push({
                badgeId: badge.id,
                badgeName: badge.name,
                icon: badge.icon,
                years: e.years || null,
                season: e.season ?? null,
                week: e.week ?? null,

                // points (this manager)
                points: e.points ?? null,

                // ✅ opponent payload
                opponent: oppId ?? null,
                opponentPoints: e.opponentPoints ?? null,
                opponentName: oppMeta?.name ?? null,
                opponentTeamName: oppMeta?.teamName ?? null,
                opponentTeamLogo: oppMeta?.photo ?? null,

                // explanation / nominator
                explanation: e.explanation ?? null,
                nominatedBy: nomId ?? null,
                nominatedByName: nomMeta?.name ?? null,
                nominatedByTeamName: nomMeta?.teamName ?? null,
                nominatedByTeamLogo: nomMeta?.photo ?? null,
            });
        }
    };

    [...personas, ...weekly, ...yearly, ...legacy, ...stains, ...luck].forEach(
        addToIndex
    );

    // -------- Response
    return json(
        {
            sections: { personas, weekly, yearly, legacy, stains, luck },
            byManager,
        },
        { headers: { 'cache-control': 'no-store' } }
    );
}
