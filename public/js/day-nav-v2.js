/* HexBounty Day Navigator — left/right/jump + passkey gate for all pages */
(function(){
  'use strict';

  /* ── detect context ── */
  var path  = window.location.pathname.split('/').pop();
  var isDay = /^day(\d+)\.html$/i;
  var isRev = /^revision_day(\d+)_(\d+)\.html$/i;

  var current     = null;
  var revStart    = null;
  var revEnd      = null;
  var isRevision  = false;

  var m;
  if ((m = path.match(isDay))) {
    current = parseInt(m[1], 10);
  } else if ((m = path.match(isRev))) {
    isRevision = true;
    revStart = parseInt(m[1], 10);
    revEnd   = parseInt(m[2], 10);
  }

  var TOTAL = 90;

  /* ── PASSKEY GATE for standalone day/revision files ── */
  (function passkeyGate(){
    var needsPass = false;
    if (current !== null && current > 10) needsPass = true;
    if (isRevision && revEnd !== null && revEnd > 10) needsPass = true;

    if (!needsPass) return;

    /* already unlocked this session? */
    if (sessionStorage.getItem('content_unlocked') === 'true') return;

    var PASS_HASH = '5b8af9e5e961575968f7b58564fdd527b898ca76cf364fe1ca8b3c582753796c';

    function hashPassword(pwd) {
      var enc = new TextEncoder();
      var data = enc.encode(pwd);
      return window.crypto.subtle.digest('SHA-256', data).then(function(buf){
        var arr = Array.from(new Uint8Array(buf));
        return arr.map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
      });
    }

    function buildOverlay() {
      /* hide body content */
      var body = document.body;
      body.style.position = 'relative';
      body.style.overflow = 'hidden';

      /* inject overlay styles */
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
        'color:#e6edf0;font-family:"IBM Plex Mono",monospace;text-align:center;outline:none;' +
        'box-sizing:border-box;}' +
        '#hex-gate-inner input:focus{border-color:#4fd1ff;}' +
        '#hex-gate-inner .gate-error{color:#ff5c5c;font-size:11px;margin-top:10px;}' +
        '#hex-gate-inner button{width:100%;padding:10px 14px;margin-top:10px;font-size:13px;' +
        'background:transparent;border:1px solid #4fd1ff;border-radius:6px;color:#4fd1ff;' +
        'cursor:pointer;font-family:"IBM Plex Mono",monospace;transition:all 0.15s;}' +
        '#hex-gate-inner button:hover{background:rgba(79,209,255,0.1);}';
      document.head.appendChild(os);

      /* build gate div */
      var gate = document.createElement('div');
      gate.id = 'hex-gate';
      gate.innerHTML =
        '<div id="hex-gate-inner">' +
          '<div class="lock-icon">&#x1f512;</div>' +
          '<h3>Content Locked</h3>' +
          '<p>Day ' + current + ' requires a security passkey to access.<br>Enter the passkey to unlock all protected material for this session.</p>' +
          '<input type="password" id="hex-gate-input" placeholder="Enter passkey" autofocus>' +
          '<div id="hex-gate-error" class="gate-error"></div>' +
          '<button id="hex-gate-btn">Unlock</button>' +
        '</div>';
      document.body.appendChild(gate);

      var inp  = document.getElementById('hex-gate-input');
      var err  = document.getElementById('hex-gate-error');
      var btn  = document.getElementById('hex-gate-btn');

      function tryUnlock() {
        var pwd = inp.value;
        hashPassword(pwd).then(function(hash){
          if (hash === PASS_HASH) {
            sessionStorage.setItem('content_unlocked', 'true');
            /* remove gate and restore scrolling */
            document.getElementById('hex-gate').remove();
            document.body.style.overflow = '';
            document.body.style.position = '';
          } else {
            err.textContent = '[ERROR] ACCESS DENIED: INVALID CONTENT PASSWORD.';
            inp.value = '';
            inp.focus();
          }
        });
      }

      btn.addEventListener('click', tryUnlock);
      inp.addEventListener('keydown', function(e){
        if (e.key === 'Enter') tryUnlock();
      });
      setTimeout(function(){ inp.focus(); }, 100);
    }

    /* wait for DOM ready */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildOverlay);
    } else {
      buildOverlay();
    }
  })();

  function dayHref(n) {
    var s = n < 10 ? '0' + n : '' + n;
    return 'day' + s + '.html';
  }

  function revHref(start, end) {
    var s = start < 10 ? '0' + start : '' + start;
    var e = end   < 10 ? '0' + end   : '' + end;
    return 'revision_day' + s + '_' + e + '.html';
  }

  var pageTitle = isRevision ? 'Revision ' + revStart + '\u2013' + revEnd : 'Day ' + current;

  /* ── determine prev / next ── */
  var prevHref = null;
  var nextHref = null;

  if (isRevision) {
    if (revStart > 1) {
      var pStart = revStart - 10;
      var pEnd   = revStart - 1;
      if (pStart < 1) pStart = 1;
      prevHref = revHref(pStart, pEnd);
    }
    if (revEnd < TOTAL) {
      var nStart = revEnd + 1;
      var nEnd   = revEnd + 10;
      if (nEnd > TOTAL) nEnd = TOTAL;
      nextHref = revHref(nStart, nEnd);
    }
  } else {
    if (current > 1)  prevHref = dayHref(current - 1);
    if (current < TOTAL) nextHref = dayHref(current + 1);
  }

  /* ── inject CSS ── */
  var style = document.createElement('style');
  style.textContent =
    '#hex-nav{' +
      'position:fixed;bottom:0;left:0;right:0;z-index:99999;' +
      'background:rgba(10,14,15,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);' +
      'border-top:1px solid #1c2528;padding:10px 16px;' +
      'display:flex;align-items:center;justify-content:center;gap:12px;' +
      'font-family:"IBM Plex Mono",monospace;font-size:13px;' +
      'transition:transform 0.3s ease,opacity 0.3s ease;' +
    '}' +
    '#hex-nav .hn-arr{' +
      'background:transparent;border:1px solid #1c2528;border-radius:8px;' +
      'color:#7d8590;cursor:pointer;padding:6px 14px;font-size:18px;' +
      'transition:all 0.15s;line-height:1;user-select:none;display:inline-flex;align-items:center;' +
      'font-family:inherit;outline:none;' +
    '}' +
    '#hex-nav .hn-arr:hover{background:#1c2528;color:#39ff88;border-color:#39ff88;}' +
    '#hex-nav .hn-arr:active{transform:scale(0.88);}' +
    '#hex-nav .hn-arr.hn-disabled{opacity:0.2;cursor:default;pointer-events:none;}' +
    '#hex-nav .hn-arr.hn-disabled:hover{background:transparent;color:#7d8590;border-color:#1c2528;}' +
    '#hex-nav .hn-arr.bounce{' +
      'animation:hn-bounce 0.4s ease !important;' +
    '}' +
    '@keyframes hn-bounce{' +
      '0%{transform:scale(1);}' +
      '25%{transform:scale(0.85);color:#39ff88;border-color:#39ff88;}' +
      '50%{transform:scale(1.12);color:#39ff88;border-color:#39ff88;}' +
      '100%{transform:scale(1);}' +
    '}' +
    '#hex-nav .hn-label{' +
      'color:#7d8590;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;' +
      'min-width:100px;text-align:center;' +
    '}' +
    '#hex-nav .hn-input{' +
      'background:#070a0b;border:1px solid #1c2528;border-radius:6px;' +
      'color:#e6edf0;font-family:"IBM Plex Mono",monospace;font-size:13px;' +
      'padding:5px 10px;width:64px;text-align:center;outline:none;' +
      'transition:border-color 0.15s;' +
    '}' +
    '#hex-nav .hn-input:focus{border-color:#4fd1ff;}' +
    '#hex-nav .hn-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}' +
    '#hex-nav .hn-input[type=number]{-moz-appearance:textfield;}' +
    '#hex-nav .hn-sep{color:#1c2528;font-size:16px;user-select:none;}' +
    '#hex-nav .hn-go{' +
      'background:transparent;border:1px solid #1c2528;border-radius:6px;' +
      'color:#7d8590;cursor:pointer;padding:5px 12px;font-size:12px;' +
      'transition:all 0.15s;font-family:"IBM Plex Mono",monospace;' +
    '}' +
    '#hex-nav .hn-go:active{transform:scale(0.88);}' +
    '#hex-nav .hn-go:hover{background:#1c2528;color:#4fd1ff;border-color:#4fd1ff;}' +
    '#hex-nav .hn-spacer{flex:1;}' +
    '@media(max-width:500px){' +
      '#hex-nav{gap:6px;padding:8px 10px;flex-wrap:wrap;}' +
      '#hex-nav .hn-arr{padding:4px 10px;font-size:16px;}' +
      '#hex-nav .hn-label{font-size:10px;min-width:70px;}' +
      '#hex-nav .hn-input{width:50px;font-size:12px;padding:4px 6px;}' +
    '}';
  document.head.appendChild(style);

  /* ── render ── */
  var container = document.createElement('div');
  container.id = 'hex-nav';

  /* helper: bounce then navigate */
  function makeNavClick(href) {
    return "var el=this;el.classList.remove('bounce');void el.offsetWidth;el.classList.add('bounce');setTimeout(function(){window.location.href='" + href + "';},180);";
  }

  var prevHtml = prevHref
    ? '<button class="hn-arr" id="hn-prev" onclick="' + makeNavClick(prevHref) + '" title="Previous (\u2190)">\u25C0</button>'
    : '<span class="hn-arr hn-disabled" id="hn-prev">\u25C0</span>';

  var nextHtml = nextHref
    ? '<button class="hn-arr" id="hn-next" onclick="' + makeNavClick(nextHref) + '" title="Next (\u2192)">\u25B6</button>'
    : '<span class="hn-arr hn-disabled" id="hn-next">\u25B6</span>';

  container.innerHTML =
    '<span class="hn-spacer"></span>' +
    prevHtml +
    '<span class="hn-label" id="hn-label">' + pageTitle + '</span>' +
    nextHtml +
    '<span class="hn-sep">|</span>' +
    '<input class="hn-input" id="hn-jump" type="number" min="1" max="' + TOTAL + '" placeholder="#" title="Jump to day">' +
    '<button class="hn-go" id="hn-go-btn">Go</button>' +
    '<span class="hn-spacer"></span>';

  document.body.appendChild(container);

  /* ── wire jump input ── */
  var inp = document.getElementById('hn-jump');
  var go  = document.getElementById('hn-go-btn');

  function jump() {
    var v = parseInt(inp.value, 10);
    if (v >= 1 && v <= TOTAL) {
      window.location.href = dayHref(v);
    } else {
      inp.style.borderColor = '#ff5c5c';
      setTimeout(function(){ inp.style.borderColor = ''; }, 400);
    }
  }

  go.addEventListener('click', jump);
  inp.addEventListener('keydown', function(e){
    if (e.key === 'Enter') jump();
  });

  /* ── keyboard shortcuts ── */
  document.addEventListener('keydown', function(e){
    if (/^(input|textarea|select)$/i.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowLeft' && prevHref)  window.location.href = prevHref;
    if (e.key === 'ArrowRight' && nextHref) window.location.href = nextHref;
  });

  /* ── auto-hide on scroll ── */
  var lastScrollY = window.scrollY;
  var hideTimeout = null;
  window.addEventListener('scroll', function(){
    var nav = document.getElementById('hex-nav');
    if (!nav) return;
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      nav.style.transform = 'translateY(100%)';
      nav.style.opacity   = '0';
    } else {
      nav.style.transform = 'translateY(0)';
      nav.style.opacity   = '1';
    }
    lastScrollY = window.scrollY;
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(function(){
      nav.style.transform = 'translateY(0)';
      nav.style.opacity   = '1';
    }, 2000);
  });

  /* ── bottom padding ── */
  var wrap = document.querySelector('.wrap');
  if (wrap) wrap.style.paddingBottom = '120px';
})();
