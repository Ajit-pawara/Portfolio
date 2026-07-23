/* HexBounty Day Navigator — left/right/jump navigation for all 90 days + revisions */
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
    '#hex-nav a{' +
      'text-decoration:none;color:inherit;display:inline-flex;align-items:center;justify-content:center;' +
    '}' +
    '#hex-nav .hn-arr{' +
      'background:transparent;border:1px solid #1c2528;border-radius:8px;' +
      'color:#7d8590;cursor:pointer;padding:6px 14px;font-size:18px;' +
      'transition:all 0.15s;line-height:1;user-select:none;display:inline-flex;align-items:center;' +
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

  var prevHtml = prevHref
    ? '<a href="' + prevHref + '" class="hn-arr" id="hn-prev" title="Previous (\u2190)">\u25C0</a>'
    : '<span class="hn-arr hn-disabled">\u25C0</span>';

  var nextHtml = nextHref
    ? '<a href="' + nextHref + '" class="hn-arr" id="hn-next" title="Next (\u2192)">\u25B6</a>'
    : '<span class="hn-arr hn-disabled">\u25B6</span>';

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

  /* ── add bounce on click for feedback ── */
  function bounce(el) {
    el.classList.remove('bounce');
    /* force reflow so the animation restarts */
    void el.offsetWidth;
    el.classList.add('bounce');
  }

  document.addEventListener('click', function(e){
    var target = e.target.closest('.hn-arr');
    if (target && target.id) {
      bounce(target);
    }
  });

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
