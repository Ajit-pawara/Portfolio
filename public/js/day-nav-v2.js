/* HexBounty Day Navigator v3 — scroll / click / key + passkey gate */
(function(){
  'use strict';

  /* ═══════ helpers ═══════ */
  var TOTAL = 90;
  var PASS_HASH = '5b8af9e5e961575968f7b58564fdd527b898ca76cf364fe1ca8b3c582753796c';

  function dayHref(n) {
    var s = n < 10 ? '0' + n : '' + n;
    return 'day' + s + '.html';
  }
  function revHref(s, e) {
    return 'revision_day' + (s<10?'0'+s:s) + '_' + (e<10?'0'+e:e) + '.html';
  }

  /* ═══════ detect current page ═══════ */
  var path = window.location.pathname.split('/').pop();
  var current = null, revStart = null, revEnd = null, isRev = false;
  var m;

  if ((m = path.match(/^day(\d+)\.html$/i))) current = parseInt(m[1],10);
  else if ((m = path.match(/^revision_day(\d+)_(\d+)\.html$/i))) { isRev = true; revStart = parseInt(m[1],10); revEnd = parseInt(m[2],10); }

  var pageTitle = isRev ? 'Revision ' + revStart + '-' + revEnd : 'Day ' + current;

  /* ═══════ nav link helpers ═══════ */
  function getPrevHref() {
    if (isRev) {
      if (revStart > 1) { var pS=revStart-10, pE=revStart-1; if(pS<1) pS=1; return revHref(pS,pE); }
      return null;
    }
    return current > 1 ? dayHref(current-1) : null;
  }
  function getNextHref() {
    if (isRev) {
      if (revEnd < TOTAL) { var nS=revEnd+1, nE=revEnd+10; if(nE>TOTAL) nE=TOTAL; return revHref(nS,nE); }
      return null;
    }
    return current < TOTAL ? dayHref(current+1) : null;
  }
  function targetNeedsPass(href) {
    if (!href) return false;
    var d = href.match(/day(\d+)\.html/i);
    if (d) return parseInt(d[1],10) > 10;
    var r = href.match(/revision_day(\d+)_(\d+)\.html/i);
    if (r) return parseInt(r[2],10) > 10;
    return false;
  }

  /* ═══════ passkey gate ═══════ */
  function isUnlocked() { return sessionStorage.getItem('content_unlocked') === 'true'; }

  /* gateOverlay(mode, cb)
     mode = 'page' (direct access - Go Back goes to prev page)
     mode = 'nav'  (mid-navigation - Go Back dismisses gate, stays on current page) */
  function gateOverlay(mode, cb) {
    if (isUnlocked()) { if (cb) setTimeout(cb,10); return; }

    var body = document.body;
    var scrollY = window.scrollY;
    body.style.position = 'fixed';
    body.style.top = '-' + scrollY + 'px';
    body.style.left = '0';
    body.style.right = '0';
    body.style.overflow = 'hidden';

    /* styles */
    var os = document.createElement('style');
    os.textContent =
      '#hex-gate{position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;' +
      'background:rgba(10,14,15,0.97);display:flex;align-items:center;justify-content:center;' +
      'font-family:"IBM Plex Mono",monospace;}' +
      '#hex-gate-inner{text-align:center;max-width:380px;padding:32px;}' +
      '#hex-gate-inner .lock-icon{font-size:44px;margin-bottom:16px;}' +
      '#hex-gate-inner h3{color:#e6edf0;font-size:18px;margin-bottom:6px;}' +
      '#hex-gate-inner p{color:#7d8590;font-size:12px;margin-bottom:20px;line-height:1.5;}' +
      '#hex-gate-inner input{width:100%;padding:10px 14px;font-size:14px;' +
      'background:#070a0b;border:1px solid #1c2528;border-radius:6px;' +
      'color:#e6edf0;font-family:"IBM Plex Mono",monospace;text-align:center;outline:none;box-sizing:border-box;}' +
      '#hex-gate-inner input:focus{border-color:#4fd1ff;}' +
      '#hex-gate-inner .gate-error{color:#ff5c5c;font-size:11px;margin-top:10px;}' +
      '#hex-gate-inner .gate-btn-row{display:flex;gap:8px;margin-top:10px;}' +
      '#hex-gate-inner .gate-btn-row button{flex:1;padding:10px 14px;font-size:13px;' +
      'background:transparent;border:1px solid #4fd1ff;border-radius:6px;color:#4fd1ff;' +
      'cursor:pointer;font-family:"IBM Plex Mono",monospace;transition:all 0.15s;}' +
      '#hex-gate-inner .gate-btn-row button:hover{background:rgba(79,209,255,0.1);}' +
      '#hex-gate-inner .gate-btn-row .gate-back{border-color:#1c2528;color:#7d8590;}' +
      '#hex-gate-inner .gate-btn-row .gate-back:hover{background:#1c2528;color:#e6edf0;}';
    document.head.appendChild(os);

    function hashPwd(pwd) {
      return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd))
        .then(function(buf){ return Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join(''); });
    }

    /* "Go Back" label depends on mode */
    var backLabel = mode === 'nav' ? 'Cancel' : '\u2190 Go Back';

    var gate = document.createElement('div');
    gate.id = 'hex-gate';
    gate.innerHTML =
      '<div id="hex-gate-inner">' +
        '<div class="lock-icon">&#x1f512;</div>' +
        '<h3>Content Locked</h3>' +
        '<p>This content requires a security passkey.<br>Enter the passkey to unlock all protected material for this session.</p>' +
        '<input type="password" id="hex-gate-input" placeholder="Enter passkey" autofocus>' +
        '<div id="hex-gate-error" class="gate-error"></div>' +
        '<div class="gate-btn-row">' +
          '<button class="gate-back" id="hex-gate-back">' + backLabel + '</button>' +
          '<button id="hex-gate-btn">Unlock</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(gate);

    var inp = document.getElementById('hex-gate-input');
    var err = document.getElementById('hex-gate-error');
    var btn = document.getElementById('hex-gate-btn');
    var backBtn = document.getElementById('hex-gate-back');

    function closeGate() {
      var g = document.getElementById('hex-gate');
      if (g) g.remove();
      var s = document.querySelector('style:last-of-type');
      if (s && s.textContent.indexOf('#hex-gate') > -1) s.remove();
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.overflow = '';
      window.scrollTo(0, scrollY);
    }

    function doUnlock() {
      hashPwd(inp.value).then(function(hash){
        if (hash === PASS_HASH) {
          sessionStorage.setItem('content_unlocked', 'true');
          closeGate();
          if (cb) setTimeout(cb, 50);
        } else {
          err.textContent = '[ERROR] ACCESS DENIED: INVALID CONTENT PASSWORD.';
          inp.value = '';
          inp.focus();
        }
      });
    }

    btn.addEventListener('click', doUnlock);
    backBtn.addEventListener('click', function(){ closeGate(); });
    inp.addEventListener('keydown', function(e){ if (e.key === 'Enter') doUnlock(); });
    setTimeout(function(){ inp.focus(); }, 150);
  }

  /* ── gate current page if needed (direct/fresh access) ── */
  if (current !== null && current > 10 && !isUnlocked()) gateOverlay('page', null);
  else if (isRev && revEnd !== null && revEnd > 10 && !isUnlocked()) gateOverlay('page', null);

  /* ── navigate with passkey check ── */
  function navigateTo(href) {
    if (!href) return;
    if (targetNeedsPass(href) && !isUnlocked()) {
      gateOverlay('nav', function(){ window.location.href = href; });
    } else {
      window.location.href = href;
    }
  }

  /* ═══════ inject nav CSS ═══════ */
  var style = document.createElement('style');
  style.textContent =
    '#hex-nav{position:fixed;bottom:0;left:0;right:0;z-index:99999;' +
    'background:rgba(10,14,15,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);' +
    'border-top:1px solid #1c2528;padding:10px 16px;' +
    'display:flex;align-items:center;justify-content:center;gap:12px;' +
    'font-family:"IBM Plex Mono",monospace;font-size:13px;' +
    'transition:transform 0.3s ease,opacity 0.3s ease;}' +
    '#hex-nav .hn-arr{background:transparent;border:1px solid #1c2528;border-radius:8px;' +
    'color:#7d8590;cursor:pointer;padding:6px 14px;font-size:18px;' +
    'transition:all 0.15s;line-height:1;user-select:none;display:inline-flex;align-items:center;' +
    'font-family:inherit;outline:none;}' +
    '#hex-nav .hn-arr:hover{background:#1c2528;color:#39ff88;border-color:#39ff88;}' +
    '#hex-nav .hn-arr:active{transform:scale(0.88);}' +
    '#hex-nav .hn-arr.hn-disabled{opacity:0.2;cursor:default;pointer-events:none;}' +
    '#hex-nav .hn-arr.hn-disabled:hover{background:transparent;color:#7d8590;border-color:#1c2528;}' +
    '#hex-nav .hn-arr.bounce{animation:hn-bounce 0.35s ease !important;}' +
    '@keyframes hn-bounce{0%{transform:scale(1);}25%{transform:scale(0.85);color:#39ff88;border-color:#39ff88;}' +
    '50%{transform:scale(1.12);color:#39ff88;border-color:#39ff88;}100%{transform:scale(1);}}' +
    '#hex-nav .hn-label{color:#7d8590;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;' +
    'min-width:100px;text-align:center;transition:color 0.3s;}' +
    '#hex-nav .hn-boundary{color:#4fd1ff;}' +
    '#hex-nav .hn-input{background:#070a0b;border:1px solid #1c2528;border-radius:6px;' +
    'color:#e6edf0;font-family:"IBM Plex Mono",monospace;font-size:13px;' +
    'padding:5px 10px;width:64px;text-align:center;outline:none;transition:border-color 0.15s;}' +
    '#hex-nav .hn-input:focus{border-color:#4fd1ff;}' +
    '#hex-nav .hn-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}' +
    '#hex-nav .hn-input[type=number]{-moz-appearance:textfield;}' +
    '#hex-nav .hn-sep{color:#1c2528;font-size:16px;user-select:none;}' +
    '#hex-nav .hn-go{background:transparent;border:1px solid #1c2528;border-radius:6px;' +
    'color:#7d8590;cursor:pointer;padding:5px 12px;font-size:12px;' +
    'transition:all 0.15s;font-family:"IBM Plex Mono",monospace;}' +
    '#hex-nav .hn-go:active{transform:scale(0.88);}' +
    '#hex-nav .hn-go:hover{background:#1c2528;color:#4fd1ff;border-color:#4fd1ff;}' +
    '#hex-nav .hn-spacer{flex:1;}' +
    /* scroll cue at bottom of page */
    '#hex-scroll-cue{position:fixed;bottom:70px;left:0;right:0;text-align:center;z-index:99990;' +
    'pointer-events:none;opacity:0;transition:opacity 0.5s;}' +
    '#hex-scroll-cue.show{opacity:1;}' +
    '#hex-scroll-cue span{display:inline-block;padding:6px 16px;border-radius:20px;' +
    'background:rgba(79,209,255,0.1);border:1px solid rgba(79,209,255,0.3);' +
    'color:#4fd1ff;font-family:"IBM Plex Mono",monospace;font-size:11px;}' +
    '@media(max-width:500px){#hex-nav{gap:6px;padding:8px 10px;flex-wrap:wrap;}' +
    '#hex-nav .hn-arr{padding:4px 10px;font-size:16px;}' +
    '#hex-nav .hn-label{font-size:10px;min-width:70px;}' +
    '#hex-nav .hn-input{width:50px;font-size:12px;padding:4px 6px;}}';
  document.head.appendChild(style);

  /* ═══════ render nav bar ═══════ */
  var prevHref = getPrevHref();
  var nextHref = getNextHref();

  var container = document.createElement('div');
  container.id = 'hex-nav';
  container.innerHTML =
    '<span class="hn-spacer"></span>' +
    (prevHref
      ? '<button class="hn-arr" id="hn-prev" title="Previous">\u25C0</button>'
      : '<span class="hn-arr hn-disabled">\u25C0</span>') +
    '<span class="hn-label" id="hn-label">' + pageTitle + '</span>' +
    (nextHref
      ? '<button class="hn-arr" id="hn-next" title="Next">\u25B6</button>'
      : '<span class="hn-arr hn-disabled">\u25B6</span>') +
    '<span class="hn-sep">|</span>' +
    '<input class="hn-input" id="hn-jump" type="number" min="1" max="' + TOTAL + '" placeholder="#" title="Jump to day">' +
    '<button class="hn-go" id="hn-go-btn">Go</button>' +
    '<span class="hn-spacer"></span>';
  document.body.appendChild(container);

  /* ═══════ wire buttons ═══════ */
  var prevBtn = document.getElementById('hn-prev');
  var nextBtn = document.getElementById('hn-next');
  if (prevBtn) prevBtn.addEventListener('click', function(){ navigateTo(prevHref); });
  if (nextBtn) nextBtn.addEventListener('click', function(){ navigateTo(nextHref); });

  /* bounce on any .hn-arr click */
  document.addEventListener('click', function(e){
    var t = e.target.closest('.hn-arr');
    if (t && t.id) {
      t.classList.remove('bounce');
      void t.offsetWidth;
      t.classList.add('bounce');
    }
  });

  /* ═══════ wire jump ═══════ */
  var inp = document.getElementById('hn-jump');
  var go  = document.getElementById('hn-go-btn');
  function jumpTo() {
    var v = parseInt(inp.value, 10);
    if (v >= 1 && v <= TOTAL) { navigateTo(dayHref(v)); }
    else { inp.style.borderColor = '#ff5c5c'; setTimeout(function(){ inp.style.borderColor = ''; }, 400); }
  }
  go.addEventListener('click', jumpTo);
  inp.addEventListener('keydown', function(e){ if (e.key === 'Enter') jumpTo(); });

  /* ═══════ keyboard shortcuts ═══════ */
  document.addEventListener('keydown', function(e){
    if (/^(input|textarea|select)$/i.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowLeft' && prevHref) navigateTo(prevHref);
    if (e.key === 'ArrowRight' && nextHref) navigateTo(nextHref);
  });

  /* ═══════ SCROLL NAVIGATION ═══════ */
  var scrollCooldown = false;

  /* scroll cue — shows "scroll to continue" near boundary */
  var cue = document.createElement('div');
  cue.id = 'hex-scroll-cue';
  cue.innerHTML = nextHref ? '<span>\u25BC Scroll for next page \u25BC</span>' : '';
  document.body.appendChild(cue);

  function updateScrollCue() {
    var sb = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
    var st = window.scrollY;
    var show = false;
    if (nextHref && sb < 120 && sb > 0) show = true;
    if (prevHref && st < 80 && st > 0) show = true;
    cue.classList.toggle('show', show);
  }

  window.addEventListener('wheel', function(e){
    if (document.getElementById('hex-gate')) return;
    if (scrollCooldown) return;

    var doc = document.documentElement;
    var scrollBottom = doc.scrollHeight - window.scrollY - window.innerHeight;
    var scrollTop = window.scrollY;

    if (e.deltaY > 0 && scrollBottom < 50 && nextHref) {
      scrollCooldown = true;
      setTimeout(function(){ scrollCooldown = false; }, 1000);
      navigateTo(nextHref);
    } else if (e.deltaY < 0 && scrollTop < 30 && prevHref) {
      scrollCooldown = true;
      setTimeout(function(){ scrollCooldown = false; }, 1000);
      navigateTo(prevHref);
    }
  });

  window.addEventListener('scroll', updateScrollCue);
  updateScrollCue();

  /* ═══════ auto-hide nav on scroll ═══════ */
  var lastScrollY = window.scrollY;
  var hideTimeout = null;
  window.addEventListener('scroll', function(){
    var nav = document.getElementById('hex-nav');
    if (!nav) return;
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      nav.style.transform = 'translateY(100%)';
      nav.style.opacity = '0';
    } else {
      nav.style.transform = 'translateY(0)';
      nav.style.opacity = '1';
    }
    lastScrollY = window.scrollY;
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(function(){
      nav.style.transform = 'translateY(0)';
      nav.style.opacity = '1';
    }, 2000);
  });

  /* ═══════ bottom padding ═══════ */
  var wrap = document.querySelector('.wrap');
  if (wrap) wrap.style.paddingBottom = '120px';
})();
