<script lang="ts">
  //@ts-nocheck
  import { enhance } from "$app/forms";
  import minesCellsBg from "$lib/assets/mines-cells-bg.png";
  
  export let data;
  export let form;
  
  $: isVerifying = false;
  $: inRequest = false;
  $: timeRemains = 0;
  
  // 👇 Popup Notice Variables
  $: showNotice = false;
  $: noticeTimer = null;
  
  let loopStarted = false;
  let delayText = '';
  let timer = 0;
  let hideTitle = false;
  
  let waitingTexts = [
    "Checking connection...",
    "Fetching data...",
    "Processing request...",
    "Optimizing response...",
    "Finalizing...",
    "Establishing secure session...",
    "Compiling resources...",
    "Verifying user permissions...",
    "Assembling results...",
    "Resolving dependencies...",
    "Crunching numbers...",
    "Calibrating modules...",
    "Synchronizing data...",
    "Decrypting response...",
    "Cleaning up temp files...",
    "Reticulating splines...",
    "Preheating servers... 🔥",
    "Summoning data gnomes... 🧙‍♂️",
    "Stirring the digital soup...",
  ];
  
  // 👇 Check if notice should show (45 min interval) - FOR AUTO-SHOW ONLY
  function shouldShowNotice() {
    if (typeof window === 'undefined') return false;
    const lastShown = localStorage.getItem('aviator_notice_last');
    const now = Date.now();
    const fortyFiveMin = 45 * 60 * 1000;
    
    if (!lastShown || (now - parseInt(lastShown)) >= fortyFiveMin) {
      return true;
    }
    return false;
  }
  
  // 👇 Auto-show notice after login (respects 45-min timer)
  function displayNotice() {
    if (shouldShowNotice()) {
      showNotice = true;
      localStorage.setItem('aviator_notice_last', Date.now().toString());
      
      noticeTimer = setTimeout(() => {
        showNotice = false;
      }, 10000);
    }
  }
  
  // 👇 Manual show rules (ALWAYS shows, ignores timer)
  function showRulesManual() {
    showNotice = true;
    if (noticeTimer) clearTimeout(noticeTimer);
    
    noticeTimer = setTimeout(() => {
      showNotice = false;
    }, 10000);
  }
  
  // 👇 Manual close handler
  function closeNotice() {
    showNotice = false;
    if (noticeTimer) clearTimeout(noticeTimer);
  }
  
  function hideUserID(usr) {
    usr = String(usr);
    return usr.slice(0,2) + Array(usr.slice(2, -3).length).fill('X').join('') + usr.slice(-3)
  }
  
  async function startSignalLoop() {
    inRequest = true;
    for (let i = 0; i < 2; i++) {
      delayText = waitingTexts[Math.floor(Math.random() * waitingTexts.length)];
      await new Promise(r=>setTimeout(r, Math.floor(Math.random() * (1000 - 800 + 1)) + 200));
    }
    inRequest = false;
    delayText = '';
    loopStarted = true;
    let fn = () => {
      timeRemains--;
      if (timeRemains <= 0) {
        document.querySelector('#sigFormBtn')?.click();
        timeRemains = 60;
      }
    }
    fn();
    timer = setInterval(fn, 1000);
  }
  
  // 👇 Show notice after successful login
  $: if (data?.usr && !showNotice) {
    displayNotice();
  }
  // ✅ REMOVED onMount block to avoid import error
</script>

<svelte:head>
  <title>1Win Aviator Hack</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;900&display=swap');
  </style>
</svelte:head>

<!-- 👇 Glassy Popup Notice -->
{#if showNotice}
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn" 
    on:click={closeNotice}
    role="dialog"
    aria-modal="true"
    aria-labelledby="notice-title"
  >
    <div 
      class="relative max-w-md w-full bg-white/10 backdrop-blur-md border border-cyan-400/30 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20 animate-slideUp"
      on:click|stopPropagation
    >
      <!-- Close Button -->
      <button 
        on:click={closeNotice}
        class="absolute top-3 right-3 text-cyan-300 hover:text-white transition-colors text-2xl font-bold leading-none focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-full w-8 h-8 flex items-center justify-center"
        aria-label="Close notice"
      >
        &times;
      </button>
      
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <svg class="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      
      <!-- Title -->
      <h3 id="notice-title" class="text-center text-xl font-bold text-white mb-3" style="font-family: 'Orbitron', monospace;">
        ⚠️ Important Rules
      </h3>
      
      <!-- Message -->
      <p class="text-cyan-100 text-center leading-relaxed" style="font-family: 'Orbitron', monospace;">
        Minimum bet: <span class="text-cyan-300 font-semibold">$5</span>. 
        <br class="sm:hidden"/>
        Place your bet first, then click <span class="text-amber-300 font-semibold">"Start Signal"</span>. 
        <br/>
        <span class="text-cyan-400/80 text-sm">Signals won't work if rules aren't followed.</span>
      </p>
      
      <!-- Progress Bar (10s visual) -->
      <div class="mt-5 h-1.5 bg-white/10 rounded-full overflow-hidden" aria-hidden="true">
        <div class="h-full bg-gradient-to-r from-cyan-400 to-amber-400 animate-progress" style="animation-duration: 10s;"></div>
      </div>
      
      <!-- Close Hint -->
      <p class="text-center text-cyan-300/60 text-xs mt-3">
        Tap <span class="font-bold">&times;</span> to close early
      </p>
    </div>
  </div>
{/if}

<!-- 👇 Floating Rules Button (Glassy Transparent) -->
{#if data?.usr}
  <button 
    on:click={showRulesManual}
    class="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-cyan-400/30 rounded-xl text-cyan-300 hover:text-white hover:bg-white/20 hover:border-cyan-300/50 transition-all duration-300 shadow-lg shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400 animate-pulse-once"
    aria-label="View game rules"
    title="Show Rules"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <span class="font-semibold text-sm" style="font-family: 'Orbitron', monospace;">Rules</span>
  </button>
{/if}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div role="button" tabindex="-1" class="top-banner {hideTitle ? 'hidden' : ''}" on:click={function(){let c = (parseInt(this.dataset.count) || 0) + 1; this.dataset.count = c; if (c > 3) {hideTitle = true}}}>AVIATOR PREDICTOR</div>

<img class="logo mx-auto {hideTitle ? 'mt-6' : 'mt-20'} mb-3 rounded-full w-24 h-24" src="https://iili.io/FKNWLwQ.png" alt="Logo">
<div class="hack-text">HACK</div>

{#if data.usr}
  <div class="text-center text-white text-lg" style="font-family: 'Orbitron', monospace;">
    Logged in as:
    <span class="text-[#00f0ff] text-shadow-cyan-600 text-shadow-md">
      User - {hideUserID(data.usr)}
    </span>
  </div>

  <div class="relative text-white mx-auto w-52 h-52 my-6">
    <div class="cf w-full h-full flex items-center justify-center text-4xl font-bold rounded-full {form?.coef ? 'active' : ''}">
      {form?.coef?.toFixed(2) || '0.00'}x
    </div>
    <div class="ld absolute w-full h-full top-0 left-0 rounded-full border-transparent border-2 border-r-violet-600 border-l-rose-800 scale-[0.5] rotate-[90deg] {form?.coef ? 'active' : ''}"></div>
    <div class="ld absolute w-full h-full top-0 left-0 rounded-full border-transparent border-2 border-t-blue-600 border-b-pink-600 scale-[0.6] rotate-[75deg] {form?.coef ? 'active' : ''}"></div>
    <div class="ld absolute w-full h-full top-0 left-0 rounded-full border-transparent border-2 border-r-teal-600 border-l-yellow-600 scale-[0.7] rotate-[60deg] {form?.coef ? 'active' : ''}"></div>
    <div class="ld absolute w-full h-full top-0 left-0 rounded-full border-transparent border-2 border-t-fuchsia-600 border-b-indigo-600 scale-[0.8] rotate-[45deg] {form?.coef ? 'active' : ''}"></div>
    <div class="ld absolute w-full h-full top-0 left-0 rounded-full border-transparent border-2 border-r-red-400 border-l-lime-400 scale-[0.9] rotate-[30deg] {form?.coef ? 'active' : ''}"></div>
    <div class="ld absolute w-full h-full top-0 left-0 rounded-full border-transparent border-2 border-t-cyan-400 border-b-amber-400 rotate-[15deg] {form?.coef ? 'active' : ''}"></div>
  </div>

  <form id="sigForm" action="?/getSignal" method="post" use:enhance={()=>{
    inRequest = true
    return async ({ result, update }) => {
      await update();
      inRequest = false;
    }
  }}>
    <div class="text-white text-center">{delayText}</div>
    <button id="sigFormBtn" type="submit" class="hidden" aria-label="submit"></button>
    <button disabled={inRequest} type="button" class="block w-[350px] mx-auto py-3 my-5 rounded-xl text-2xl text-white font-bold cursor-pointer hover:saturate-150 active:scale-75 transition duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-30 shadow hover:shadow-cyan-400 scale-90" style="background: linear-gradient(93.73deg,#108de7,#0855c4);font-family: 'Orbitron', monospace;" on:click={()=>{loopStarted ? (()=>{document.querySelector('#sigFormBtn')?.click();timeRemains = 60})() : startSignalLoop()}}>{loopStarted ? 'Refresh Signal' : 'Start Signal'}</button>
    {#if timeRemains}
      <div class="max-w-[350px] w-[calc(100%-30px)] h-5 mx-auto rounded-2xl bg-cyan-950 relative overflow-hidden">
        <div role="progressbar" class="w-full h-full bg-cyan-700 transition ease-out duration-300" style="transform: translateX({timeRemains/60*100 - 100}%);"></div>
        <span class="absolute w-full h-full flex items-center justify-center text-white top-0 left-0 text-xs">Auto Updating in {timeRemains}s</span>
      </div>
    {/if}
  </form>

{:else}
  <form class="flex max-w-[300px] mx-auto py-7 flex-col gap-5" style="font-family: 'Orbitron', monospace;" action="?/verifyUID" method="post" use:enhance={()=>{
    form = undefined;
    isVerifying = true;
    return async ({ result, update }) => {
      await update();
      isVerifying = false;
      if (result?.type === 'success' && data?.usr) {
        displayNotice();
      }
    }
  }}>
    <input class="text-cyan-400 bg-cyan-950/50 hover:bg-cyan-950 focus:bg-cyan-950 outline-2 outline-transparent focus:outline-cyan-400 outline-offset-2 text-xl border border-cyan-600 px-3 py-2 rounded-xl transition duration-300 ease-in-out" type="number" name="uid" placeholder="Enter 1WIN UID" required>
    <button type="submit" disabled={isVerifying} class="text-white bg-cyan-600 shadow shadow-transparent hover:bg-cyan-400 hover:shadow-cyan-700 text-xl font-bold px-3 py-1 rounded-xl outline-2 outline-transparent outline-offset-2 active:scale-75 focus:outline-cyan-400 disabled:opacity-30 transition ease-in-out duration-300">
      {#if isVerifying}
        <span class="block w-[25px] h-[25px] my-0.5 text-transparent mx-auto rounded-full border-2 border-transparent border-b-white animate-spin">O</span>
      {:else}
        Verify
      {/if}
    </button>
  </form>
  
  {#if form?.verified == false}
    <div role="alert" class="verify-alert bg-cyan-800 text-lg text-cyan-300 my-5 p-5 rounded-lg outline-2 outline-cyan-600 outline-offset-3 max-w-4xl w-[calc(100%-40px)] mx-auto" style="font-family: 'Orbitron', monospace;">
      <b>⚠️ Attention Needed: No Deposit Found!</b>
      <br>
      It looks like your 1win account doesn't have any funds yet.
      To unlock signal access, a minimum deposit of <b>$5</b> is required.
      <br>
      🚫 <b>Signals remain inaccessible until a deposit is made.</b>
      💸 <b>Deposit $15 or more</b> and receive up to <b>500% bonus</b> on your main account!
      <br>
      👉 <b>No deposit means no signals.</b>
      <br>
      <b>Add funds now and start winning!</b>
    </div>
  {/if}
{/if}

<style lang="postcss">
  @reference "tailwindcss";
  
  :global(html) {
    background: radial-gradient(circle at center, #1a1a1a 0%, #111 100%);
    @apply min-h-full;
  }
  
  .top-banner {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Orbitron', monospace;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: 2px;
    color: #00f0ff;
    background: rgba(0,0,0,0.6);
    padding: 10px 5px;
    border-radius: 12px;
    box-shadow: 0 0 5px #00f0ff, 0 0 5px #00f0ff, 0 0 5px #00f0ff;
    text-shadow: 0 0 5px #00f0ff, 0 0 15px #00aaff;
    user-select: none;
    z-index: 1000;
    white-space: nowrap;
  }
  
  .logo {
    filter: drop-shadow(0px 0px 5px theme(--color-cyan-600));
    transition: transform 0.3s;
  }
  
  .logo:hover {
    transform: scale(1.1);
  }
  
  .hack-text {
    font-family: 'Orbitron', monospace;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: 4px;
    background: linear-gradient(90deg, #00f0ff, #0088ff, #00f0ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 20px #00f0ff, 0 0 40px #0088ff;
    margin-bottom: 10px;
    user-select: none;
    text-align: center;
  }
  
  @keyframes getAttention {
    from { box-shadow: 0px 0px 30px 20px theme(--color-cyan-600); }
    to { box-shadow: 0px 0px 0px 0px theme(--color-cyan-600); }
  }
  
  .verify-alert { animation: getAttention 3s ease-out forwards; }
  
  .ld.active {
    animation: spin 2s linear infinite;
    filter: contrast(150%) saturate(500%);
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  /* 👇 Popup Notice Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0; 
      transform: translateY(20px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }
  
  /* 👇 Rules Button Animation */
  @keyframes pulseOnce {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
  .animate-slideUp { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-progress { animation: progress linear forwards; }
  .animate-pulse-once { animation: pulseOnce 0.5s ease-out 1s forwards; }
  
  /* Glass effect enhancement */
  .backdrop-blur-md {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
</style>
