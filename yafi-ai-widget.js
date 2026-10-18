/**
 * YAFI AI AGENT WIDGET
 * Sleek, Floating AI Assistant Powered by Real Conversational AI
 * Multi-lingual: Fluent Bengali (বাংলা), English & Banglish
 * Engineered for Yafi Ahmed's Portfolio
 */

(function () {
  if (window.YafiAIWidgetInitialized) return;
  window.YafiAIWidgetInitialized = true;

  // Retrieve data from portfolio-data.js if available
  function getBotInfo() {
    const d = (window.PortfolioData && window.PortfolioData.data) ? window.PortfolioData.data : {};
    const ai = d.aiSettings || {};
    return {
      name: ai.botName || 'Yafi AI',
      subtitle: (ai.botTitle && ai.botTitle !== 'Autonomous Cognitive Systems Agent') ? ai.botTitle : '',
      welcome: ai.welcomeMessage || 'Hello! I am **Yafi AI**, the conversational assistant on Yafi Ahmed\'s portfolio. How can I assist you today?',
      botAvatar: ai.botAvatar || 'yafi_avatar.png',
      buttonIcon: ai.buttonIcon || 'ai_orb_icon.jpg'
    };
  }

  const botInfo = getBotInfo();

  // Multi-turn conversation history with system prompt
  const conversationHistory = [
    {
      role: 'system',
      content: `You are Yafi AI, a helpful, polite, and brilliant AI assistant living on Yafi Ahmed's personal portfolio website (Dhaka, Bangladesh).
You are fluent in both Bengali (বাংলা) and English.
CRITICAL RULES:
1. GREETING & RELIGION RULE: NEVER use religion-specific greetings such as 'নমস্কার' (Nomoshkar), 'প্রণাম' (Pronam), or 'আদাব' (Adab) unless the user explicitly greets you with that term first. Do NOT assume religion. Start conversations neutrally, politely, and universally (e.g. "হ্যালো! কেমন আছেন?", "Hello! How can I assist you today?").
2. If the user writes in Bengali or asks you to speak in Bengali (e.g. "তুমি বাংলায় কথা বলো", "কেমন আছো?"), ALWAYS reply in natural, friendly, accurate, and fluent Bengali (বাংলা).
3. If the user writes in English, reply in crisp English.
4. If the user writes in Banglish, reply warmly in Banglish or Bengali.
5. You know all about Yafi Ahmed:
   - Aerospace Robotics Engineer & Autonomous Systems Builder based in Dhaka, Bangladesh.
   - Builds Autonomous Drones (Pixhawk 6X, PX4 RTOS, carbon-fiber composite airframes, Jetson Orin Nano Edge AI vision, 35+ min flight endurance).
   - Conceptualizes Next-Gen Spacecraft (deep-space exploratory cruisers, ion propulsion).
   - Builds Agentic AI Swarms, Orivino SaaS platform, and robotics hardware (Jetson, Raspberry Pi 5, Arduino Giga/Mega, ESP32-S3).
   - Contact: ahmedyafi01@gmail.com, WhatsApp, LinkedIn, GitHub, Fiverr.
6. In addition to Yafi Ahmed's work, you can answer ANY general questions: programming, math, science, general advice, translation, writing, and creative ideation. Keep responses conversational, concise, and structured.`
    }
  ];

  // Inject CSS Styles
  const style = document.createElement('style');
  style.id = 'yafi-ai-widget-styles';
  style.textContent = `
    /* FLOATING AI ORB */
    .yafi-ai-bubble {
      position: fixed;
      bottom: 26px;
      right: 26px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #1e1b4b 0%, #0f172a 60%, #030712 100%);
      box-shadow: 0 0 20px rgba(168, 85, 247, 0.45), 0 8px 32px rgba(0, 0, 0, 0.7);
      cursor: grab;
      z-index: 999990;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      touch-action: none;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
      border: 1.5px solid rgba(168, 85, 247, 0.4);
    }

    .yafi-ai-bubble:hover {
      transform: scale(1.08);
      border-color: #c084fc;
      box-shadow: 0 0 30px rgba(168, 85, 247, 0.75), 0 10px 35px rgba(0, 0, 0, 0.85);
    }

    .yafi-ai-bubble:active {
      cursor: grabbing;
      transform: scale(0.96);
    }

    /* ORB PULSE RINGS */
    .yafi-ai-ring {
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      border-radius: 50%;
      border: 1.5px solid rgba(168, 85, 247, 0.35);
      animation: yafiRingPulse 3s infinite ease-out;
      pointer-events: none;
    }

    @keyframes yafiRingPulse {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.55); opacity: 0; }
    }

    .yafi-ai-orb-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      box-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
    }

    .yafi-ai-orb-inner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      transition: transform 0.35s ease;
      display: block;
    }

    .yafi-ai-bubble:hover .yafi-ai-orb-inner img {
      transform: scale(1.12);
    }

    .yafi-ai-star-svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 0 8px rgba(168, 85, 247, 0.9));
      transition: transform 0.4s ease;
    }

    .yafi-ai-bubble:hover .yafi-ai-star-svg {
      transform: rotate(25deg) scale(1.1);
    }

    .yafi-ai-orb-badge {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #10b981;
      border: 2px solid #09090e;
      box-shadow: 0 0 8px #10b981;
    }

    /* CHAT DRAWER MODAL */
    .yafi-chat-drawer {
      position: fixed;
      bottom: 95px;
      right: 26px;
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 540px;
      max-height: calc(100vh - 120px);
      background: rgba(11, 11, 18, 0.96);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(168, 85, 247, 0.2);
      z-index: 999995;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: translateY(16px) scale(0.97);
      pointer-events: none;
      transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Plus Jakarta Sans", sans-serif;
    }

    .yafi-chat-drawer.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    /* DRAWER HEADER */
    .yafi-drawer-header {
      padding: 0.85rem 1.1rem;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .yafi-drawer-brand {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .yafi-brand-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(56, 189, 248, 0.2));
      border: 1px solid rgba(168, 85, 247, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .yafi-drawer-title-wrap h3 {
      font-size: 0.88rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      line-height: 1.2;
    }

    .yafi-drawer-title-wrap p {
      font-size: 0.66rem;
      color: #10b981;
      margin: 2px 0 0;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .yafi-live-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 6px #10b981;
    }

    .yafi-drawer-controls {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .yafi-ctrl-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.74rem;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .yafi-ctrl-btn:hover {
      background: rgba(168, 85, 247, 0.25);
      border-color: #a855f7;
      color: #fff;
    }

    /* DRAWER BODY CHAT FEED */
    .yafi-drawer-messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      font-size: 0.82rem;
      line-height: 1.5;
    }

    .yafi-msg {
      max-width: 86%;
      padding: 0.7rem 0.95rem;
      border-radius: 14px;
      word-break: break-word;
      animation: yafiMsgFade 0.2s ease forwards;
    }

    @keyframes yafiMsgFade {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .yafi-msg.bot {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      border-bottom-left-radius: 4px;
    }

    .yafi-msg.bot strong {
      color: #ffffff;
      font-weight: 700;
    }

    .yafi-msg.user {
      align-self: flex-end;
      background: linear-gradient(135deg, #7c3aed, #db2777);
      color: #ffffff;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
    }

    /* QUICK CHIPS */
    .yafi-drawer-chips {
      padding: 0.45rem 0.85rem;
      display: flex;
      gap: 0.4rem;
      overflow-x: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      background: rgba(0, 0, 0, 0.2);
      scrollbar-width: none;
    }

    .yafi-drawer-chips::-webkit-scrollbar {
      display: none;
    }

    .yafi-chip-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      border-radius: 20px;
      padding: 0.28rem 0.65rem;
      font-size: 0.68rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .yafi-chip-btn:hover {
      background: rgba(168, 85, 247, 0.2);
      border-color: #a855f7;
      color: #fff;
    }

    /* DRAWER FOOTER INPUT */
    .yafi-drawer-footer {
      padding: 0.75rem 0.95rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
    }

    .yafi-input-box {
      display: flex;
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 0.25rem 0.35rem 0.25rem 0.75rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .yafi-input-box:focus-within {
      border-color: #a855f7;
      box-shadow: 0 0 14px rgba(168, 85, 247, 0.3);
    }

    .yafi-input-box input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #fff;
      font-size: 0.8rem;
      font-family: inherit;
    }

    .yafi-input-box input::placeholder {
      color: #64748b;
    }

    .yafi-btn-send {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #a855f7, #ec4899);
      border: none;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }

    .yafi-btn-send:hover {
      transform: scale(1.05);
    }

    .yafi-drawer-subnote {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.4rem;
      font-size: 0.64rem;
      color: #64748b;
    }

    .yafi-drawer-subnote a {
      color: #a855f7;
      text-decoration: none;
      font-weight: 600;
    }

    .yafi-drawer-subnote a:hover {
      text-decoration: underline;
    }

    /* TYPING INDICATOR */
    .yafi-typing {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 0.4rem 0.7rem;
    }

    .yafi-typing span {
      width: 5px;
      height: 5px;
      background: #a855f7;
      border-radius: 50%;
      animation: yafiTypingBounce 1.2s infinite ease-in-out;
    }

    .yafi-typing span:nth-child(2) { animation-delay: 0.2s; }
    .yafi-typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes yafiTypingBounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1.1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // 1. Draggable Floating Orb with configurable logo or Gemini 4-Point AI Star
  const orb = document.createElement('div');
  orb.className = 'yafi-ai-bubble';
  orb.id = 'yafi-ai-bubble';
  orb.setAttribute('role', 'button');
  orb.setAttribute('aria-label', 'Chat with Yafi AI');
  const orbIconSrc = botInfo.buttonIcon || 'ai_orb_icon.jpg';
  orb.innerHTML = `
    <div class="yafi-ai-ring"></div>
    <div class="yafi-ai-orb-inner">
      <img src="${orbIconSrc}" alt="AI" class="yafi-ai-orb-img" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='block';" />
      <svg viewBox="0 0 24 24" fill="none" class="yafi-ai-star-svg" style="display:none;">
        <defs>
          <linearGradient id="yafiStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8" />
            <stop offset="50%" stop-color="#c084fc" />
            <stop offset="100%" stop-color="#f43f5e" />
          </linearGradient>
        </defs>
        <path d="M12 2C12 7.52 16.48 12 22 12C16.48 12 12 16.48 12 22C12 16.48 7.52 12 2 12C7.52 12 12 7.52 12 2Z" fill="url(#yafiStarGrad)" />
      </svg>
    </div>
    <div class="yafi-ai-orb-badge"></div>
  `;
  document.body.appendChild(orb);

  // 2. Chat Drawer
  const drawer = document.createElement('div');
  drawer.className = 'yafi-chat-drawer';
  drawer.id = 'yafi-chat-drawer';
  drawer.innerHTML = `
    <div class="yafi-drawer-header">
      <div class="yafi-drawer-brand">
        <div class="yafi-brand-icon-wrap" style="overflow:hidden;padding:0;">
          ${botInfo.botAvatar ? `<img src="${botInfo.botAvatar}" alt="${botInfo.name}" style="width:100%;height:100%;border-radius:9px;object-fit:cover;" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='block';" />` : ''}
          <svg viewBox="0 0 24 24" fill="none" style="width:18px;height:18px;${botInfo.botAvatar ? 'display:none;' : ''}">
            <path d="M12 2C12 7.52 16.48 12 22 12C16.48 12 12 16.48 12 22C12 16.48 7.52 12 2 12C7.52 12 12 7.52 12 2Z" fill="url(#yafiStarGrad)" />
          </svg>
        </div>
        <div class="yafi-drawer-title-wrap">
          <h3>${botInfo.name}</h3>
          ${botInfo.subtitle ? `<p><span class="yafi-live-indicator"></span> ${botInfo.subtitle}</p>` : ''}
        </div>
      </div>
      <div class="yafi-drawer-controls">
        <a href="ai-assistant.html" class="yafi-ctrl-btn" title="Open Full Studio" target="_self">↗</a>
        <button type="button" class="yafi-ctrl-btn" id="yafi-drawer-close" aria-label="Close">✕</button>
      </div>
    </div>

    <div class="yafi-drawer-messages" id="yafi-chat-messages">
      <div class="yafi-msg bot" id="yafi-welcome-bubble">
        ${formatMarkdown(botInfo.welcome)}
      </div>
    </div>

    <div class="yafi-drawer-footer">
      <form id="yafi-drawer-form" onsubmit="return false;">
        <div class="yafi-input-box">
          <input type="text" id="yafi-drawer-input" placeholder="Ask anything (বাংলা / English)..." autocomplete="off" />
          <button type="submit" class="yafi-btn-send" id="yafi-drawer-send" aria-label="Send">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
      <div class="yafi-drawer-subnote">
        <span>Powered by Gemini &amp; Yafi AI</span>
        <a href="ai-assistant.html">Open Full Studio ↗</a>
      </div>
    </div>
  `;
  document.body.appendChild(drawer);

  // Markdown Formatter helper
  function formatMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:4px;font-family:monospace;color:#38bdf8;">$1</code>');
  }

  // Draggable Orb Logic (Mouse + Touch)
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  let hasMoved = false;

  function onPointerDown(e) {
    const evt = e.touches ? e.touches[0] : e;
    isDragging = true;
    hasMoved = false;
    startX = evt.clientX;
    startY = evt.clientY;

    const rect = orb.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    orb.style.left = initialLeft + 'px';
    orb.style.top = initialTop + 'px';
    orb.style.right = 'auto';
    orb.style.bottom = 'auto';

    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const evt = e.touches ? e.touches[0] : e;
    const dx = evt.clientX - startX;
    const dy = evt.clientY - startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMoved = true;
    }

    if (hasMoved) {
      if (e.cancelable) e.preventDefault();
      const w = window.innerWidth;
      const h = window.innerHeight;
      let newLeft = Math.max(10, Math.min(w - 68, initialLeft + dx));
      let newTop = Math.max(10, Math.min(h - 68, initialTop + dy));
      orb.style.left = newLeft + 'px';
      orb.style.top = newTop + 'px';
    }
  }

  function onPointerUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('touchend', onPointerUp);

    if (!hasMoved) {
      toggleDrawer();
    }
  }

  orb.addEventListener('mousedown', onPointerDown);
  orb.addEventListener('touchstart', onPointerDown, { passive: true });

  // Drawer Toggle
  function toggleDrawer(forceOpen) {
    const isOpen = drawer.classList.contains('open');
    const targetState = forceOpen !== undefined ? forceOpen : !isOpen;

    if (targetState) {
      const rect = orb.getBoundingClientRect();
      const isMobile = window.innerWidth < 640;
      if (!isMobile) {
        if (rect.left < window.innerWidth / 2) {
          drawer.style.left = Math.max(16, rect.left) + 'px';
          drawer.style.right = 'auto';
        } else {
          drawer.style.right = Math.max(16, window.innerWidth - rect.right) + 'px';
          drawer.style.left = 'auto';
        }
        if (rect.top < window.innerHeight / 2) {
          drawer.style.top = (rect.bottom + 12) + 'px';
          drawer.style.bottom = 'auto';
        } else {
          drawer.style.bottom = (window.innerHeight - rect.top + 12) + 'px';
          drawer.style.top = 'auto';
        }
      }
      drawer.classList.add('open');
      const input = document.getElementById('yafi-drawer-input');
      if (input) setTimeout(() => input.focus(), 250);
    } else {
      drawer.classList.remove('open');
    }
  }

  const closeBtn = document.getElementById('yafi-drawer-close');
  if (closeBtn) closeBtn.addEventListener('click', () => toggleDrawer(false));

  // Chat Query Handling
  const form = document.getElementById('yafi-drawer-form');
  const input = document.getElementById('yafi-drawer-input');
  const chatMessages = document.getElementById('yafi-chat-messages');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSend();
    });
  }


  function handleSend() {
    if (!input) return;
    const q = input.value.trim();
    if (!q) return;
    input.value = '';
    executeQuery(q);
  }

  // REAL AI CALL TO STREAMING / REAL-TIME ENDPOINT
  async function executeQuery(text) {
    appendMessage(text, 'user');
    conversationHistory.push({ role: 'user', content: text });

    // Show typing
    const typing = document.createElement('div');
    typing.className = 'yafi-msg bot';
    typing.innerHTML = `<div class="yafi-typing"><span></span><span></span><span></span></div>`;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      // Call Real AI API (Pollinations open free LLM endpoint)
      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversationHistory,
          model: 'openai',
          seed: 42
        })
      });

      if (!res.ok) throw new Error('Network error');
      const aiReply = await res.text();
      typing.remove();

      conversationHistory.push({ role: 'assistant', content: aiReply });
      appendMessage(aiReply, 'bot');
    } catch (err) {
      typing.remove();
      // Intelligent fallback in Bengali / English
      const isBangla = /[\u0980-\u09FF]/.test(text) || text.includes('বাংলা');
      let fallback = '';
      if (isBangla) {
        fallback = 'হ্যাঁ, অবশ্যই! আমি বাংলায় কথা বলতে পারি। আমি ইয়াফি আহমেদের পোর্টফোলিও এআই অ্যাসিস্ট্যান্ট। কীভাবে আপনাকে সাহায্য করতে পারি বলুন?';
      } else {
        fallback = 'I am here to help you! How can I assist you with Yafi Ahmed\'s projects, aerospace drones, or AI systems today?';
      }
      conversationHistory.push({ role: 'assistant', content: fallback });
      appendMessage(fallback, 'bot');
    }
  }

  function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `yafi-msg ${sender}`;
    msg.innerHTML = sender === 'bot' ? formatMarkdown(text) : escapeHtml(text);
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Live Sync with PortfolioData updates
  window.addEventListener('yafi_data_updated', function (e) {
    try {
      const newD = (e && e.detail) || (window.PortfolioData && window.PortfolioData.data) || {};
      const newAi = newD.aiSettings || {};
      const orbImg = orb.querySelector('.yafi-ai-orb-inner img');
      if (orbImg) {
        orbImg.src = newAi.buttonIcon || 'ai_orb_icon.jpg';
        orbImg.style.display = 'block';
      }
      const headerAvatar = drawer.querySelector('.yafi-brand-icon-wrap img');
      if (headerAvatar && newAi.botAvatar) {
        headerAvatar.src = newAi.botAvatar;
        headerAvatar.style.display = 'block';
      }
    } catch (err) {}
  });
})();
