<script>
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';
  const BOT_AVATAR = '/milo.jpg';
  import ChatBubble from './ChatBubble.svelte';

  // minimized by default
  let open = true;
  let q = '';
  let chatting = false;
  // messages: { role:'user'|'assistant', text:string }[]
  let messages = [];

  let bottom;

  const STORAGE_KEY = 'iclChatOpen';   // remember open/closed between navigations
  let showBadge = true;                // red "1" until first open of this load

  onMount(() => {
    if (!browser) return;

    // restore minimized/open state (default = minimized)
    const saved = localStorage.getItem(STORAGE_KEY);
    open = saved !== null ? saved === 'true' : false;

    // If it starts open (rare), greet when empty
    if (open && messages.length === 0) {
      greetOnce();
      showBadge = false;
    }
  });

  function toggle() {
    open = !open;
    if (browser) localStorage.setItem(STORAGE_KEY, String(open));

    if (open) {
      // First open of this page load? greet if thread empty
      if (messages.length === 0) greetOnce();   // <-- fix
      showBadge = false;
      scrollToBottom('smooth');
    }
  }

  async function greetOnce() {
    const greeting =
      `👋 Hi — I’m **Irving Bot**!\n\n` +
      `I can quickly look up standings, draft budgets, trades, badges, and specific draft picks.\n` +
      `Try: *"who was the 5th overall pick?"* or *"Warriors draft budget"*.`;

    messages = [...messages, { role: 'assistant', text: greeting }];
    await tick();
    await scrollToBottom('smooth');
  }

  async function scrollToBottom(behavior = 'auto') {
    await tick();
    bottom?.scrollIntoView({ behavior, block: 'end' });
  }

  const REVEAL_MODE = 'fast';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function typeOut(text, idx) {
    if (REVEAL_MODE === 'instant') {
      messages[idx].text = text; messages = messages;
      await scrollToBottom('smooth'); return;
    }
    if (REVEAL_MODE === 'fast') {
      const words = text.split(/\s+/); const chunk = 5;
      for (let i = 0; i < words.length; i += chunk) {
        messages[idx].text = words.slice(0, i + chunk).join(' ');
        messages = messages; await scrollToBottom(); await sleep(8);
      }
      await scrollToBottom('smooth'); return;
    }
    const MIN = 2, MAX = 6;
    messages[idx].text = '';
    for (let i = 0; i < text.length; i += 3) {
      messages[idx].text += text.slice(i, i + 3);
      messages = messages; if (i % 18 === 0) await scrollToBottom();
      await sleep(MIN + Math.random() * (MAX - MIN));
    }
    await scrollToBottom('smooth');
  }

  async function ask() {
    if (!q.trim() || chatting) return;
    chatting = true;

    messages = [
      ...messages,
      { role: 'user',      text: q },
      { role: 'assistant', text: '__TYPING__' }
    ];
    const idx = messages.length - 1;
    const userQ = q;
    q = '';
    await scrollToBottom('smooth');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: userQ })
      });

      if (!res.ok) {
        messages[idx].text = 'Sorry — I had trouble answering that.';
        messages = messages; await scrollToBottom('smooth'); return;
      }

      const ct = res.headers.get('content-type') || '';
      let finalText = 'Sorry — no answer.';
      if (ct.includes('application/json')) {
        const data = await res.json();
        finalText = data?.answer || finalText;
      } else {
        finalText = await res.text();
      }

      await typeOut(finalText, idx);
    } catch {
      messages[idx].text = "Sorry — I couldn't reach the assistant.";
      messages = messages; await scrollToBottom('smooth');
    } finally {
      chatting = false;
    }
  }
</script>

<style>
  .icl-floating { position: fixed; right: 16px; bottom: 16px; z-index: 2147483000; display: grid; gap: 8px; }

  /* Launcher (minimized button) */
  .launcher {
    position: relative;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 14px; border-radius: 999px;
    background: var(--blueOne,#1971ff); color: #fff;
    border: 1px solid rgba(255,255,255,.15);
    box-shadow: 0 8px 24px rgba(0,0,0,.18);
    cursor: pointer; font-weight: 600;
  }
  .badge {
    position: absolute; top: -6px; right: -6px;
    min-width: 18px; height: 18px; padding: 0 5px;
    border-radius: 999px; background: #e11d48; color: #fff;
    font-size: 11px; line-height: 18px; text-align: center;
    border: 2px solid #0b0b0b;
  }
  :global(body.light) .badge { border-color: #fff; }

  /* Panel */
  .panel {
    width:min(360px,92vw); height:min(60vh,520px);
    background:#121212; color:#eaeaea; border:1px solid #2a2a2a;
    border-radius:14px; box-shadow:0 18px 46px rgba(0,0,0,.35);
    display:grid; grid-template-rows:auto 1fr auto; overflow:hidden;
  }
  :global(body.light) .panel { background:#fff; color:#222; border-color:#ddd; }

  .hdr { display:flex; align-items:center; gap:8px; padding:10px 12px; font-weight:650; font-size:.95rem;
    border-bottom:1px solid #2a2a2a; background: rgba(0,0,0,.08); }
  :global(body.light) .hdr { background:#f7f7f7; border-bottom-color:#eee; }
  .spacer { flex:1; }
  .iconbtn { border:0; background:transparent; color:inherit; cursor:pointer; padding:6px 8px; border-radius:8px; }
  .iconbtn:hover { background: rgba(0,0,0,.08); }
  :global(body.light) .iconbtn:hover { background: rgba(0,0,0,.06); }

  /* Messages */
  .msgs { padding: 12px; overflow: auto; scroll-behavior: smooth; overscroll-behavior: contain; }
  .row { display: flex; gap: 8px; margin: 6px 0; align-items: flex-end; }
  .row.user { justify-content: flex-end; }
  .row.assistant { justify-content: flex-start; }

  /* Assistant avatar */
  .row.assistant .avatar {
    width: 26px; height: 26px; border-radius: 50%;
    object-fit: cover; flex: 0 0 26px;
    border: 1px solid rgba(255,255,255,.12);
    margin-top: 0;
  }
  :global(body.light) .row.assistant .avatar { border-color: #ddd; }

  /* Typing bubble like assistant bubble */
  .typing-bubble {
    display: inline-block; width: fit-content; max-width: min(72ch, 80%);
    padding: 8px 10px; border-radius: 14px; border-top-left-radius: 8px;
    background: var(--bubble-assistant, #343434); color: #eaeaea;
    border: 1px solid rgba(255,255,255,.06); box-shadow: 0 2px 6px rgba(0,0,0,.08);
    line-height: normal; font-size: 0.9rem;
  }
  :global(body.light) .typing-bubble {
    background: var(--bubble-assistant-light, #f2f3f5); color: #222; border-color: rgba(0,0,0,.06);
  }
  .typing { display:inline-flex; gap:4px; vertical-align:middle; }
  .typing > span { width:6px; height:6px; border-radius:50%; background: currentColor; opacity:.35; animation: icl-bounce 1.2s infinite; }
  .typing > span:nth-child(2){ animation-delay:.15s }
  .typing > span:nth-child(3){ animation-delay:.3s }
  @keyframes icl-bounce { 0%,80%,100%{ transform:translateY(0); opacity:.35 } 40%{ transform:translateY(-4px); opacity:.8 } }

  .hdr .avatar { width: 18px; height: 18px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,.2); }

  /* Composer */
  .panel .composer { display: flex; gap: 8px; padding: 10px; border-top: 1px solid #2a2a2a; background: transparent; }
  :global(body.light) .panel .composer { border-top-color: #eee; }

  .panel .composer .in,
  .panel .composer .btn { font: inherit; box-sizing: border-box; appearance: none; -webkit-appearance: none; -moz-appearance: none; }

  .panel .composer .in {
    flex: 1; min-height: 42px; padding: 10px 12px; background: transparent; color: inherit;
    border: 1px solid #333; border-radius: 10px; outline: none;
  }
  :global(body.light) .panel .composer .in { background: #fff; color: #222; border-color: #ddd; }
  .panel .composer .in::placeholder { opacity: .7; }

  .panel .composer .in:focus { border-color: #1971ff; box-shadow: 0 0 0 2px rgba(25,113,255,.35); }

  .panel .composer .btn {
    min-height: 42px; padding: 0 14px; border-radius: 10px; border: 1px solid #333;
    background: var(--bubble-user, #1971ff); color: #fff; font-weight: 600; cursor: pointer;
  }
  :global(body.light) .panel .composer .btn { border-color: #ccc; }
  .panel .composer .btn:hover:not([disabled]) { filter: brightness(1.08); }
  .panel .composer .btn[disabled] { opacity: .6; cursor: default; }

  @media (max-width: 480px) {
    .typing-bubble { max-width: 90%; }
  }
</style>

<div class="icl-floating">
  {#if open}
    <section class="panel" role="dialog" aria-label="Irving Bot" aria-live="polite">
      <header class="hdr">
        <img class="avatar" src={BOT_AVATAR} alt="Irving Bot avatar" /> Irving Bot — BETA v0.1
        <span class="spacer"></span>
        <button class="iconbtn" type="button" aria-label="Minimize chat" title="Minimize" on:click={toggle}>—</button>
      </header>

      <div class="msgs">
        {#each messages as m}
          <div class={"row " + m.role}>
            {#if m.role === 'assistant'}
              <img class="avatar" src={BOT_AVATAR} alt="Irving Bot avatar" />
            {/if}

            {#if m.role === 'assistant' && m.text === '__TYPING__'}
              <div class="typing-bubble">
                <span class="typing" aria-label="Assistant typing">
                  <span></span><span></span><span></span>
                </span>
              </div>
            {:else}
              <ChatBubble role={m.role} text={m.text} compact />
            {/if}
          </div>
        {/each}
        <div bind:this={bottom} aria-hidden="true"></div>
      </div>

      <form class="composer" on:submit|preventDefault={ask}>
        <input class="in" bind:value={q} placeholder="Ask about this site…" autocomplete="off" />
        <button class="btn" type="submit" disabled={chatting}>{chatting ? 'Sending…' : 'Ask'}</button>
      </form>
    </section>
  {:else}
    <button class="launcher" type="button" aria-label="Open Irving Bot" on:click={toggle}>
      <img class="avatar" src={BOT_AVATAR} alt="Irving Bot avatar" /> Chat
      {#if showBadge}<span class="badge" aria-label="New message">1</span>{/if}
    </button>
  {/if}
</div>
