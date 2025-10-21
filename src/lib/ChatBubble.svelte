<script lang="ts">
  import { marked } from 'marked';
  import { browser } from '$app/environment';
  import { soften } from '$lib/chat/normalize';

  export let role: 'user' | 'assistant' | 'system' = 'assistant';
  export let text = '';
  export let compact: boolean = true;   // NEW: compact mode on by default

  let html = '';
  let sanitize: (s: string) => string = (s) => s;

  // Load DOMPurify only in the browser to avoid SSR "window is not defined"
  if (browser) {
    import('dompurify').then((m) => {
      sanitize = m.default.sanitize;
      html = toHTML(text);
    });
  }

  $: html = toHTML(text);

  function shouldSkipSoften(input: string) {
  // If it already looks like markdown/structured text, don't collapse newlines
  return /(^\s*[>*-] )|(^\s*• )|(^\s*#{1,6}\s)|(^\s*```)/m.test(input);
}


  function toHTML(input: string) {
    const softened = role === 'assistant' ? soften(input) : input;

    let s =
    role === 'assistant' && !shouldSkipSoften(input) ? soften(input) : input;
      // Coalesce MOST_EXPENSIVE_PLAYER (+ optional team) into one line
  // Collapse: "Player: <name> $<price>\nDrafted BY: <team?>" → pretty one-liner
  text = text.replace(
    /^(?:[-•]\s*)?Player:\s*([^\n$]+?)\s*\$?(\d+)\s*(?:\n(?:[-•]\s*)?Drafted\s*BY:\s*(.+))?/im,
    (_, player, price, team) => {
      const cleanTeam = team && !/don[’']?t know based on the site/i.test(team) ? ` — to **${team.trim()}**` : '';
      return `💰 **Most expensive**: **${player.trim()}** for **$${price}**${cleanTeam}.`;
    }
  );

   s = s.replace(
    /^(?:[-•]\s*)?Player:\s*([^\n$]+?)\s*\$?(\d+)\s*(?:\n(?:[-•]\s*)?Drafted\s*BY:\s*(.+))?/im,
    (_, player, price, team) => {
      const cleanTeam =
        team && !/don[’']?t know based on the site/i.test(team)
          ? ` — to **${team.trim()}**`
          : '';
      return `💰 **Most expensive**: **${player.trim()}** for **$${price}**${cleanTeam}.`;
    }
  );

  // Drop "Drafted BY: I don't know..." sublines
  s = s.replace(
    /\n(?:[-•]\s*)?Drafted\s*BY:\s*I don[’']?t know based on the site\.\s*/i,
    ''
  );

  // Draft budget
  s = s.replace(/DRAFT_BUDGET:\s*\$?(\d+)/i, '💼 **Draft budget**: **$$1**');

  // Standing summary
  s = s.replace(
    /STANDING:\s*([^(\n]+)\s*\((\d+)\s*[–-]\s*(\d+)\)\s*[—-]\s*(.*)/i,
    (_, team, wins, losses, note) =>
      `🏆 **Standing**: **${team.trim()}** (${wins}–${losses}) — ${note.trim()}.`
  );

  // Generic KEY: value → bullets (skip if we already converted)
  s = s.replace(
    /^(?:[A-Z_]{3,}:\s*[^\n]+(?:\n|$))+?/gm,
    (block) => {
      const lines = block.trim().split(/\n/).map((l) => l.trim());
      if (/^💰|^💼|^🏆/.test(lines[0])) return block;
      // Use real markdown list tokens so Marked makes <ul><li>
      return lines.map((l) => `- ${l.replace(/^[A-Z_]{3,}:\s*/, '')}`).join('\n');
    }
  );

  // Remove lonely "FANTASY_TEAM: I don't know..."
  s = s.replace(/\n?FANTASY_TEAM:\s*I don[’']?t know based on the site\.\s*/i, '');


// Also normalize any dangling "Drafted BY: I don't know..." lines (remove them)
text = text.replace(/\n(?:[-•]\s*)?Drafted\s*BY:\s*I don[’']?t know based on the site\.\s*/i, '');


// Draft budget single line (DRAFT_BUDGET: $156 → 💼 Draft budget: $156)
text = text.replace(/DRAFT_BUDGET:\s*\$?(\d+)/i, '💼 **Draft budget**: **$$1**');

// Standing summary → one sentence
text = text.replace(
  /STANDING:\s*([^(\n]+)\s*\((\d+)\s*[–-]\s*(\d+)\)\s*[—-]\s*(.*)/i,
  (_, team, wins, losses, note) => `🏆 **Standing**: **${team.trim()}** (${wins}–${losses}) — ${note.trim()}.`
);

// Generic “KEY: value” list → bullets (keeps other unknown keys readable but nicer)
text = text.replace(
  /^(?:[A-Z_]{3,}:\s*[^\n]+(?:\n|$))+?/gm,
  (block) => {
    const lines = block.trim().split(/\n/).map(l => l.trim());
    // If we already turned it into a sentence above, skip.
    if (/^💰|^💼|^🏆/.test(lines[0])) return block;
    return lines.map(l => `• ${l.replace(/^[A-Z_]{3,}:\s*/, '')}`).join('\n');
  }
);

// Remove lonely “I don’t know based on the site.” when it’s just a subfield
text = text.replace(/\n?FANTASY_TEAM:\s*I don[’']?t know based on the site\.\s*/i, '');

    const raw = marked.parse(softened, { breaks: true }) as string;
    return sanitize(raw);
  }
</script>

<!-- NOTE: role class is appended so .bubble.user / .bubble.assistant rules apply -->
<div class={`bubble ${role} ${compact ? 'compact' : ''}`}>
  {@html html}
</div>

<style>
  /* Base bubble (normal) */
.bubble {
  display: inline-block;          /* <— shrink-wrap to content */
  width: fit-content;             /* <— don’t fill the row */
  max-width: min(72ch, 80%);      /* readable, responsive */
  padding: 8px 10px;              /* a hair more comfortable */
  border-radius: 14px;
  line-height: initial;
  word-break: break-word;
  white-space: pre-wrap;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(0,0,0,.08);
  border: 1px solid transparent;
  margin: 2px 0;                  /* small vertical rhythm */
}
.bubble :where(p, li, dd) { line-height: 1.35; }
.bubble p { margin: .18rem 0; }
.bubble p:first-child { margin-top: 0; }
.bubble p:last-child  { margin-bottom: 0; }


.bubble.compact {
  padding: 0px 10px;
  border-radius: 12px;
  font-size: 0.90rem;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}

.bubble.user {
  background: var(--bubble-user, #1971ff);
  color: #fff;
  border-top-right-radius: 8px;
  border-color: rgba(0,0,0,.14);
}

.bubble.assistant {
  background: var(--bubble-assistant, #343434);
  color: #eaeaea;
  border-top-left-radius: 8px;
  border-color: rgba(255,255,255,.06);
}

:global(body.light) .bubble.assistant {
  background: var(--bubble-assistant-light, #f2f3f5);
  color: #222;
  border-color: rgba(0,0,0,.06);
}
:global(body.light) .bubble.user {
  background: var(--bubble-user-light, #1971ff);
  color: #fff;
  border-color: rgba(0,0,0,.12);
}
.bubble p { margin: .2rem 0; }
.bubble p:first-child { margin-top: 0; }
.bubble p:last-child { margin-bottom: 0; }
.bubble code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  background: rgba(0,0,0,.06);
  padding: 0 .25rem;
  border-radius: 4px;
  font-size: .85em;
}
.bubble pre {
  max-width: 100%;
  overflow: auto;
  margin: .25rem 0;
  padding: .5rem .6rem;
  background: rgba(0,0,0,.08);
  border-radius: 10px;
}

  /* Selection */
  .bubble ::selection { background: rgba(255,255,255,.16); color: inherit; }
  .bubble.user ::selection { background: rgba(255,255,255,.24); color: #000; }
</style>