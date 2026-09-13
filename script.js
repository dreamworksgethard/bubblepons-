/* =========================================================
   BUBBLE PONS — Vanilla JS
   ========================================================= */

(function () {
  "use strict";

  const BUBBLE_IMG = "bubble.png";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Demo token data ---------- */

  const TOKENS = [
    { name: "Pons", symbol: "PONS", change: 42.8, marketCap: 12400000, volume: 3100000, trending: true },
    { name: "Bubble", symbol: "BUBBLE", change: 18.4, marketCap: 8200000, volume: 2100000, trending: true },
    { name: "Wave", symbol: "WAVE", change: 9.2, marketCap: 5600000, volume: 980000, trending: false },
    { name: "Cloud", symbol: "CLOUD", change: 3.1, marketCap: 4100000, volume: 720000, trending: false },
    { name: "Frog", symbol: "FROG", change: -6.4, marketCap: 2900000, volume: 1100000, trending: true },
    { name: "Pepe", symbol: "PEPE", change: 27.5, marketCap: 18500000, volume: 5400000, trending: true },
    { name: "Doge", symbol: "DOGE", change: -2.8, marketCap: 22000000, volume: 4800000, trending: false },
    { name: "Sol", symbol: "SOL", change: 6.7, marketCap: 48000000, volume: 9200000, trending: true },
    { name: "Eth", symbol: "ETH", change: 1.4, marketCap: 72000000, volume: 12500000, trending: false },
    { name: "Moon", symbol: "MOON", change: 55.2, marketCap: 1800000, volume: 2400000, trending: true },
    { name: "Pump", symbol: "PUMP", change: -14.6, marketCap: 950000, volume: 1600000, trending: true },
    { name: "Sky", symbol: "SKY", change: 0.4, marketCap: 3400000, volume: 450000, trending: false },
    { name: "Pop", symbol: "POP", change: 12.9, marketCap: 1500000, volume: 880000, trending: false },
    { name: "Mint", symbol: "MINT", change: 8.3, marketCap: 2700000, volume: 610000, trending: false },
    { name: "Blast", symbol: "BLAST", change: -9.1, marketCap: 4300000, volume: 1900000, trending: true },
    { name: "Glow", symbol: "GLOW", change: 21.6, marketCap: 2100000, volume: 1300000, trending: true },
    { name: "Orbit", symbol: "ORBIT", change: -1.2, marketCap: 6700000, volume: 840000, trending: false },
    { name: "Nova", symbol: "NOVA", change: 15.8, marketCap: 3900000, volume: 1020000, trending: false },
    { name: "Jelly", symbol: "JELLY", change: -18.3, marketCap: 780000, volume: 920000, trending: false },
    { name: "Fizz", symbol: "FIZZ", change: 33.0, marketCap: 1200000, volume: 1750000, trending: true },
    { name: "Float", symbol: "FLOAT", change: 4.6, marketCap: 2500000, volume: 390000, trending: false },
    { name: "Drift", symbol: "DRIFT", change: -4.9, marketCap: 1600000, volume: 540000, trending: false },
    { name: "Aero", symbol: "AERO", change: 11.2, marketCap: 5100000, volume: 1470000, trending: true },
    { name: "Vibe", symbol: "VIBE", change: 0.0, marketCap: 980000, volume: 210000, trending: false },
    { name: "Mist", symbol: "MIST", change: -7.7, marketCap: 640000, volume: 330000, trending: false },
    { name: "Coral", symbol: "CORAL", change: 7.5, marketCap: 3050000, volume: 670000, trending: false },
    { name: "Nimbus", symbol: "NIMBUS", change: 19.1, marketCap: 4450000, volume: 1210000, trending: true },
    { name: "Aqua", symbol: "AQUA", change: -11.5, marketCap: 1320000, volume: 760000, trending: false },
    { name: "Spark", symbol: "SPARK", change: 38.4, marketCap: 870000, volume: 990000, trending: true },
    { name: "Halo", symbol: "HALO", change: 2.2, marketCap: 2280000, volume: 410000, trending: false },
    { name: "Tide", symbol: "TIDE", change: -3.6, marketCap: 3750000, volume: 880000, trending: false },
    { name: "Bloom", symbol: "BLOOM", change: 14.0, marketCap: 1980000, volume: 550000, trending: false }
  ];

  const state = {
    timeframe: "24h",
    filter: "all",
    sizeBy: "marketCap",
    tokens: [],
    lastFocused: null
  };

  /* ---------- Helpers ---------- */

  function formatMoney(value) {
    if (value >= 1e9) return "$" + (value / 1e9).toFixed(1) + "B";
    if (value >= 1e6) return "$" + (value / 1e6).toFixed(1) + "M";
    if (value >= 1e3) return "$" + (value / 1e3).toFixed(1) + "K";
    return "$" + value.toFixed(0);
  }

  function formatChange(change) {
    const sign = change > 0 ? "+" : "";
    return sign + change.toFixed(1) + "%";
  }

  function changeClass(change) {
    if (change > 0.5) return "positive";
    if (change < -0.5) return "negative";
    return "flat";
  }

  function performanceClass(change) {
    if (change > 0.5) return "gain";
    if (change < -0.5) return "loss";
    return "neutral";
  }

  function sizeTier(px) {
    if (px >= 260) return "large";
    if (px >= 160) return "medium";
    if (px >= 90) return "small";
    return "tiny";
  }

  function getBubbleLabels(token) {
    const size = token.bubbleSize;
    const full = "$" + token.symbol;
    const fontPx = clamp(size * 0.13, 11, 26);
    const estimatedWidth = full.length * fontPx * 0.62;
    const maxWidth = size * 0.48;
    const fitsSymbol = estimatedWidth <= maxWidth && size >= 96;
    const changeBlock = fontPx * 1.75 + 6;
    const fitsChange = fitsSymbol && changeBlock <= size * 0.42 && size >= 118;
    const fitsMcap = fitsChange && size >= 280;

    return {
      symbolText: fitsSymbol ? full : token.symbol.charAt(0),
      showChange: fitsChange,
      showMcap: fitsMcap,
      compact: !fitsSymbol
    };
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function seededRandom(seed) {
    let t = seed + 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function timeframeMultiplier(tf) {
    switch (tf) {
      case "1h": return 0.22;
      case "6h": return 0.55;
      case "7d": return 1.85;
      default: return 1;
    }
  }

  function prepareTokens() {
    const mult = timeframeMultiplier(state.timeframe);
    state.tokens = TOKENS.map(function (token, index) {
      const jitter = seededRandom(index * 17 + 3);
      const change = Number((token.change * mult * (0.82 + jitter * 0.36)).toFixed(1));
      return Object.assign({}, token, {
        id: token.symbol.toLowerCase(),
        change: change,
        position: { x: 0, y: 0 },
        bubbleSize: 0
      });
    });
  }

  function layoutPositions(tokens, width, height) {
    const placed = [];
    const padding = 4;

    tokens.forEach(function (token, i) {
      const r = token.bubbleSize / 2;
      let best = null;
      let bestScore = Infinity;

      for (let attempt = 0; attempt < 80; attempt++) {
        const rx = seededRandom(i * 97 + attempt * 13 + 11);
        const ry = seededRandom(i * 53 + attempt * 29 + 7);
        const x = clamp(r + padding + rx * (width - r * 2 - padding * 2), r + 2, width - r - 2);
        const y = clamp(r + padding + ry * (height - r * 2 - padding * 2), r + 2, height - r - 2);

        let overlap = 0;
        for (let j = 0; j < placed.length; j++) {
          const other = placed[j];
          const dx = x - other.x;
          const dy = y - other.y;
          const minDist = r + other.r * 0.72;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) overlap += (minDist - dist);
        }

        const centerBias = Math.abs(x - width / 2) * 0.02 + Math.abs(y - height / 2) * 0.015;
        const score = overlap * 4 + centerBias;
        if (score < bestScore) {
          bestScore = score;
          best = { x: x, y: y, r: r };
          if (overlap === 0) break;
        }
      }

      token.position = { x: best.x, y: best.y };
      placed.push(best);
    });
  }

  function computeBubbleSize(token, metric, minMetric, maxMetric, mapW) {
    const value = token[metric];
    const t = maxMetric === minMetric ? 0.5 : (value - minMetric) / (maxMetric - minMetric);
    const minPx = mapW < 560 ? 52 : 58;
    const maxPx = mapW < 560 ? 180 : mapW < 900 ? 300 : 400;
    return Math.round(minPx + Math.pow(t, 0.72) * (maxPx - minPx));
  }

  /* ---------- Core map functions ---------- */

  function updateBubbleSizing() {
    const map = document.getElementById("bubbleMap");
    if (!map) return;

    const metric = state.sizeBy;
    const values = state.tokens.map(function (t) { return t[metric]; });
    const minMetric = Math.min.apply(null, values);
    const maxMetric = Math.max.apply(null, values);
    const mapW = map.clientWidth || 800;
    const mapH = map.clientHeight || 600;

    state.tokens.forEach(function (token) {
      token.bubbleSize = computeBubbleSize(token, metric, minMetric, maxMetric, mapW);
    });

    const sorted = state.tokens.slice().sort(function (a, b) {
      return b.bubbleSize - a.bubbleSize;
    });
    layoutPositions(sorted, mapW, mapH);
  }

  function filterBubbles() {
    const map = document.getElementById("bubbleMap");
    const empty = document.getElementById("mapEmpty");
    if (!map) return;

    const nodes = map.querySelectorAll(".token-bubble");
    let visible = 0;

    nodes.forEach(function (node) {
      const change = Number(node.dataset.change);
      const trending = node.dataset.trending === "true";
      let show = true;

      if (state.filter === "gainers") show = change > 0.5;
      if (state.filter === "losers") show = change < -0.5;
      if (state.filter === "trending") show = trending;

      node.classList.toggle("is-hidden", !show);
      node.tabIndex = show ? 0 : -1;
      node.setAttribute("aria-hidden", show ? "false" : "true");
      if (show) visible += 1;
    });

    if (empty) empty.hidden = visible > 0;
  }

  function renderBubbles() {
    const map = document.getElementById("bubbleMap");
    if (!map) return;

    prepareTokens();
    updateBubbleSizing();

    map.innerHTML = "";
    map.classList.remove("entering");

    state.tokens.forEach(function (token, index) {
      const perf = performanceClass(token.change);
      const tier = sizeTier(token.bubbleSize);
      const dur = (12 + seededRandom(index * 9) * 12).toFixed(1);
      const bob = (-6 - seededRandom(index * 5) * 12).toFixed(1);
      const drift = ((seededRandom(index * 3) - 0.5) * 16).toFixed(1);
      const rot = ((seededRandom(index * 11) - 0.5) * 4).toFixed(2);
      const delay = (-seededRandom(index * 7) * Number(dur)).toFixed(1);

      const btn = document.createElement("button");
      btn.type = "button";
      const labels = getBubbleLabels(token);
      btn.className = "token-bubble " + perf + " size-" + tier + (token.trending ? " trending" : "") + (labels.compact ? " label-compact" : "");
      btn.dataset.id = token.id;
      btn.dataset.change = String(token.change);
      btn.dataset.trending = String(token.trending);
      btn.setAttribute("role", "listitem");
      btn.setAttribute("aria-label", token.name + " " + formatChange(token.change));
      btn.style.width = token.bubbleSize + "px";
      btn.style.height = token.bubbleSize + "px";
      btn.style.left = token.position.x + "px";
      btn.style.top = token.position.y + "px";
      btn.style.setProperty("--dur", dur + "s");
      btn.style.setProperty("--bob", bob + "px");
      btn.style.setProperty("--drift", drift + "px");
      btn.style.setProperty("--rot", rot + "deg");
      btn.style.animationDuration = reducedMotion ? "0.01ms" : dur + "s";
      btn.style.animationDelay = reducedMotion ? "0s" : delay + "s";
      btn.style.zIndex = String(Math.round(token.bubbleSize));

      btn.innerHTML =
        '<span class="bubble-glow" aria-hidden="true"></span>' +
        '<span class="bubble-ripple" aria-hidden="true"></span>' +
        '<img class="bubble-image" src="' + BUBBLE_IMG + '" alt="" draggable="false">' +
        '<span class="bubble-content">' +
          '<span class="token-symbol">' + labels.symbolText + "</span>" +
          (labels.showChange
            ? '<span class="token-change ' + changeClass(token.change) + '">' + formatChange(token.change) + "</span>"
            : "") +
          (labels.showMcap
            ? '<span class="token-mcap">MC ' + formatMoney(token.marketCap) + "</span>"
            : "") +
        "</span>";

      btn.addEventListener("click", function () {
        btn.classList.remove("rippling");
        void btn.offsetWidth;
        btn.classList.add("rippling");
        openTokenDetails(token, btn);
      });

      btn.addEventListener("mouseenter", function () {
        pushNeighbors(btn);
      });

      btn.addEventListener("mouseleave", function () {
        resetNeighborPush();
      });

      map.appendChild(btn);
    });

    requestAnimationFrame(function () {
      map.classList.add("entering");
    });

    filterBubbles();
  }

  function pushNeighbors(active) {
    const map = document.getElementById("bubbleMap");
    if (!map) return;
    const ax = parseFloat(active.style.left);
    const ay = parseFloat(active.style.top);
    const ar = parseFloat(active.style.width) / 2;

    map.querySelectorAll(".token-bubble").forEach(function (node) {
      if (node === active || node.classList.contains("is-hidden")) return;
      const x = parseFloat(node.style.left);
      const y = parseFloat(node.style.top);
      const r = parseFloat(node.style.width) / 2;
      const dx = x - ax;
      const dy = y - ay;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const influence = ar + r + 24;
      if (dist < influence) {
        const force = (influence - dist) / influence;
        const nx = (dx / dist) * force * 14;
        const ny = (dy / dist) * force * 14;
        node.style.translate = nx.toFixed(1) + "px " + ny.toFixed(1) + "px";
      }
    });

    active.style.scale = "1.1";
  }

  function resetNeighborPush() {
    const map = document.getElementById("bubbleMap");
    if (!map) return;
    map.querySelectorAll(".token-bubble").forEach(function (node) {
      node.style.translate = "";
      node.style.scale = "";
    });
  }

  function openTokenDetails(token, sourceEl) {
    const panel = document.getElementById("tokenPanel");
    if (!panel) return;

    state.lastFocused = sourceEl || document.activeElement;

    const nameEl = document.getElementById("panelTokenName");
    const tickerEl = document.getElementById("panelTicker");
    const changeEl = document.getElementById("panelChange");
    const mcapEl = document.getElementById("panelMcap");
    const volEl = document.getElementById("panelVolume");
    const statusEl = document.getElementById("panelStatus");
    const glowEl = document.getElementById("panelBubbleGlow");
    const cta = document.getElementById("panelCta");

    if (nameEl) nameEl.textContent = token.name.toUpperCase();
    if (tickerEl) tickerEl.textContent = "$" + token.symbol;
    if (changeEl) {
      changeEl.textContent = formatChange(token.change);
      changeEl.className = "panel-change " + changeClass(token.change);
    }
    if (mcapEl) mcapEl.textContent = formatMoney(token.marketCap);
    if (volEl) volEl.textContent = formatMoney(token.volume);
    if (statusEl) statusEl.textContent = token.trending ? "TRENDING" : "WATCHING";
    if (glowEl) {
      glowEl.className = "panel-bubble-glow " + performanceClass(token.change);
    }
    if (cta) cta.href = "#";

    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const closeBtn = document.getElementById("panelClose");
    if (closeBtn) closeBtn.focus();
  }

  function closeTokenDetails() {
    const panel = document.getElementById("tokenPanel");
    if (!panel || !panel.classList.contains("open")) return;

    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (state.lastFocused && typeof state.lastFocused.focus === "function") {
      state.lastFocused.focus();
    }
  }

  /* Expose required API */
  window.renderBubbles = renderBubbles;
  window.filterBubbles = filterBubbles;
  window.updateBubbleSizing = updateBubbleSizing;
  window.openTokenDetails = openTokenDetails;
  window.closeTokenDetails = closeTokenDetails;

  /* ---------- Controls ---------- */

  function setupMapControls() {
    const controls = document.querySelector(".map-controls");
    if (!controls) return;

    controls.addEventListener("click", function (event) {
      const pill = event.target.closest(".pill");
      if (!pill) return;

      if (pill.dataset.timeframe) {
        setActivePill(controls, "[data-timeframe]", pill);
        state.timeframe = pill.dataset.timeframe;
        renderBubbles();
      }

      if (pill.dataset.filter) {
        setActivePill(controls, "[data-filter]", pill);
        state.filter = pill.dataset.filter;
        filterBubbles();
      }

      if (pill.dataset.sizeby) {
        setActivePill(controls, "[data-sizeby]", pill);
        state.sizeBy = pill.dataset.sizeby;
        const map = document.getElementById("bubbleMap");
        if (!map) return;

        updateBubbleSizing();
        state.tokens.forEach(function (token) {
          const node = map.querySelector('.token-bubble[data-id="' + token.id + '"]');
          if (!node) return;
          const tier = sizeTier(token.bubbleSize);
          const labels = getBubbleLabels(token);
          node.classList.remove("size-tiny", "size-small", "size-medium", "size-large", "label-compact");
          node.classList.add("size-" + tier);
          if (labels.compact) node.classList.add("label-compact");
          node.style.width = token.bubbleSize + "px";
          node.style.height = token.bubbleSize + "px";
          node.style.left = token.position.x + "px";
          node.style.top = token.position.y + "px";
          node.style.zIndex = String(Math.round(token.bubbleSize));

          const content = node.querySelector(".bubble-content");
          if (content) {
            content.innerHTML =
              '<span class="token-symbol">' + labels.symbolText + "</span>" +
              (labels.showChange
                ? '<span class="token-change ' + changeClass(token.change) + '">' + formatChange(token.change) + "</span>"
                : "") +
              (labels.showMcap
                ? '<span class="token-mcap">MC ' + formatMoney(token.marketCap) + "</span>"
                : "");
          }
        });
        filterBubbles();
      }
    });
  }

  function setActivePill(root, selector, active) {
    root.querySelectorAll(selector).forEach(function (el) {
      el.classList.toggle("active", el === active);
      el.setAttribute("aria-pressed", el === active ? "true" : "false");
    });
  }

  /* ---------- Navigation / chrome ---------- */

  function setupNavigation() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");
    const header = document.getElementById("siteHeader");

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        const open = !menu.classList.contains("open");
        menu.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });

      menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          menu.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
        });
      });
    }

    if (header) {
      var scroller = document.querySelector(".snap-scroller");
      var scrollQueued = false;
      var onScroll = function () {
        if (scrollQueued) return;
        scrollQueued = true;
        requestAnimationFrame(function () {
          scrollQueued = false;
          var y = scroller ? scroller.scrollTop : window.scrollY;
          header.classList.toggle("scrolled", y > 12);
        });
      };
      onScroll();
      (scroller || window).addEventListener("scroll", onScroll, { passive: true });
    }
  }

  function setupTokenPanel() {
    const panel = document.getElementById("tokenPanel");
    if (!panel) return;

    const closeBtn = document.getElementById("panelClose");
    const backdrop = document.getElementById("panelBackdrop");

    if (closeBtn) closeBtn.addEventListener("click", closeTokenDetails);
    if (backdrop) backdrop.addEventListener("click", closeTokenDetails);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeTokenDetails();
    });
  }

  function setupSkyDecor() {
    const bg = document.getElementById("bgBubbles");
    const particles = document.getElementById("particles");

    if (bg && !bg.childElementCount) {
      for (let i = 0; i < 6; i++) {
        const img = document.createElement("img");
        img.src = BUBBLE_IMG;
        img.alt = "";
        img.className = "bg-bubble";
        img.decoding = "async";
        img.loading = "lazy";
        const size = 40 + seededRandom(i * 19) * 120;
        img.style.width = size + "px";
        img.style.left = seededRandom(i * 23) * 100 + "%";
        img.style.top = seededRandom(i * 29) * 100 + "%";
        img.style.animationDuration = (18 + seededRandom(i * 31) * 20) + "s";
        img.style.animationDelay = (-seededRandom(i * 37) * 20) + "s";
        bg.appendChild(img);
      }
    }

    if (particles && !particles.childElementCount && !reducedMotion) {
      for (let i = 0; i < 10; i++) {
        const dot = document.createElement("span");
        dot.className = "particle";
        dot.style.left = seededRandom(i * 41) * 100 + "%";
        dot.style.bottom = (-seededRandom(i * 43) * 20) + "%";
        dot.style.animationDuration = (18 + seededRandom(i * 47) * 24) + "s";
        dot.style.animationDelay = (-seededRandom(i * 53) * 20) + "s";
        particles.appendChild(dot);
      }
    }
  }

  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("visible"); });
      return;
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- How-it-works demos ---------- */

  function setupHowDemos() {
    const capBtn = document.getElementById("demoSizeCap");
    const volBtn = document.getElementById("demoSizeVol");
    const sizeDemo = document.getElementById("sizeDemo");

    function applySizeDemo(metric) {
      if (!sizeDemo) return;
      sizeDemo.querySelectorAll(".size-demo-bubble").forEach(function (el) {
        const ratio = Number(el.dataset[metric === "volume" ? "vol" : "cap"]);
        const px = Math.round(70 + ratio * 130);
        el.style.width = px + "px";
        el.style.height = px + "px";
      });
    }

    if (capBtn && volBtn) {
      applySizeDemo("marketCap");
      capBtn.addEventListener("click", function () {
        capBtn.classList.add("active");
        volBtn.classList.remove("active");
        capBtn.setAttribute("aria-pressed", "true");
        volBtn.setAttribute("aria-pressed", "false");
        applySizeDemo("marketCap");
      });
      volBtn.addEventListener("click", function () {
        volBtn.classList.add("active");
        capBtn.classList.remove("active");
        volBtn.setAttribute("aria-pressed", "true");
        capBtn.setAttribute("aria-pressed", "false");
        applySizeDemo("volume");
      });
    }

    const diveDemo = document.getElementById("diveDemo");
    const diveBubble = document.getElementById("diveBubble");
    const demoOpenPanel = document.getElementById("demoOpenPanel");

    function activateDive() {
      if (diveDemo) diveDemo.classList.add("active");
      openTokenDetails({
        name: "Pons",
        symbol: "PONS",
        change: 42.8,
        marketCap: 12400000,
        volume: 3100000,
        trending: true
      }, diveBubble || demoOpenPanel);
    }

    if (diveBubble) diveBubble.addEventListener("click", activateDive);
    if (demoOpenPanel) demoOpenPanel.addEventListener("click", activateDive);
  }

  function setupMapWindowLinks() {
    document.querySelectorAll(".js-open-map").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        var url = link.getAttribute("href") || "map.html";
        var width = Math.min(1280, screen.availWidth - 40);
        var height = Math.min(900, screen.availHeight - 60);
        var left = Math.max(0, (screen.availWidth - width) / 2);
        var top = Math.max(0, (screen.availHeight - height) / 2);
        var features = [
          "popup=yes",
          "noopener=yes",
          "noreferrer=yes",
          "width=" + Math.round(width),
          "height=" + Math.round(height),
          "left=" + Math.round(left),
          "top=" + Math.round(top)
        ].join(",");
        var win = window.open(url, "bubblePonsMap", features);
        if (!win) {
          window.open(url, "_blank", "noopener,noreferrer");
        } else {
          win.focus();
        }
      });
    });
  }

  function setupScrollNavigation() {
    var scroller = document.querySelector(".snap-scroller");
    var panels = Array.prototype.slice.call(document.querySelectorAll(".snap-panel"));
    if (!scroller || !panels.length) return;

    document.documentElement.classList.add("home-snap-root");

    var homePanel = document.getElementById("home");
    var homeScrollHint = document.getElementById("homeScrollHint");
    var homeMapSoon = document.getElementById("homeMapSoon");
    var currentIndex = 0;
    var locked = false;
    var touchStartY = 0;
    var touchLastY = 0;
    var scrollAnim = 0;
    var scrollingClassTimer = 0;
    var wheelLockUntil = 0;
    var wheelAccum = 0;
    var SNAP_MS = 420;
    var WHEEL_THRESHOLD = 28;
    var WHEEL_COOLDOWN = 480;
    var mapProgress = 0;
    var mapTarget = 0;
    var mapProgressAnim = 0;
    var mapSmoothRaf = 0;
    // Higher = more scrolling needed to finish the map zoom / coming soon.
    var isMobile = window.matchMedia("(max-width: 780px)").matches;
    var MAP_SCROLL_RANGE = reducedMotion ? 480 : isMobile ? 2600 : 4200;
    var MAP_SMOOTH_EARLY = reducedMotion ? 1 : 0.13;
    var MAP_SMOOTH_END = reducedMotion ? 1 : 0.048;

    function clamp01(value) {
      return Math.max(0, Math.min(1, value));
    }

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function easeOutQuintLocal(t) {
      return 1 - Math.pow(1 - t, 5);
    }

    function renderMapProgress(progress) {
      if (!homePanel) return;
      mapProgress = clamp01(progress);

      // 0 → ~0.5: rise + grow (sharp map)
      // 0.48 → 1: long endless Coming Soon dissolve (no hard switch)
      var reveal = clamp01(mapProgress / 0.42);
      var grow = easeInOutCubic(clamp01(mapProgress / 0.55));
      var endT = clamp01((mapProgress - 0.48) / 0.52);
      var endEase = easeOutQuintLocal(endT);
      var heroOut = clamp01(mapProgress / 0.2);
      var solid = clamp01(mapProgress / 0.24);
      var fullBleed = endEase;

      var peekY = window.matchMedia("(max-width: 780px)").matches ? 16 : 48;
      var y = peekY * (1 - easeOutCubic(reveal)) * (1 - fullBleed * 0.92);
      var scale = 1 + 0.22 * grow * (1 - fullBleed * 0.55);
      if (fullBleed > 0.92) scale = 1;
      // Blur + text ramp slowly across the long end phase.
      var blurPx = 40 * Math.pow(endT, 1.65);
      var soon = Math.pow(endEase, 1.35);
      var hint = 1 - clamp01(mapProgress / 0.18);
      var widthPx = 560 + (Math.max(window.innerWidth || 1200, 1200) - 560) * Math.max(grow * 0.85, fullBleed);
      var sideGap = Math.max(0, 2.2 * (1 - Math.max(grow, fullBleed)));
      var widthCss = "min(" + widthPx.toFixed(1) + "px, calc(100vw - " + sideGap.toFixed(2) + "rem))";
      if (window.matchMedia("(max-width: 780px)").matches) {
        widthCss = "min(" + Math.max(widthPx, window.innerWidth * 0.92).toFixed(1) + "px, calc(100vw - " + Math.max(sideGap, 0.75).toFixed(2) + "rem))";
      }
      if (fullBleed > 0.98) widthCss = "100vw";
      var fadePct = Math.max(0, (12 + 4 * grow) * (1 - fullBleed));
      var frameH = 52 + 48 * fullBleed;
      if (window.matchMedia("(max-width: 780px)").matches) {
        frameH = 42 + 58 * fullBleed;
      }

      homePanel.style.setProperty("--map-y", y.toFixed(2) + "%");
      homePanel.style.setProperty("--map-scale", scale.toFixed(4));
      homePanel.style.setProperty("--map-blur", blurPx.toFixed(2) + "px");
      homePanel.style.setProperty("--map-soon", soon.toFixed(3));
      homePanel.style.setProperty("--map-hint", hint.toFixed(3));
      homePanel.style.setProperty("--map-width", widthCss);
      homePanel.style.setProperty("--map-fade", fadePct.toFixed(1) + "%");
      homePanel.style.setProperty("--map-hero-out", heroOut.toFixed(3));
      homePanel.style.setProperty("--map-solid", solid.toFixed(3));
      homePanel.style.setProperty("--map-frame-h", frameH.toFixed(1) + "vh");
      homePanel.style.setProperty("--map-full", fullBleed.toFixed(3));

      homePanel.classList.toggle("map-engaged", mapProgress > 0.015);
      homePanel.classList.toggle("map-leaving", mapProgress > 0.04);
      homePanel.classList.toggle("map-complete", mapProgress > 0.992);

      if (homeMapSoon) {
        homeMapSoon.setAttribute("aria-hidden", soon < 0.08 ? "true" : "false");
      }
      if (homeScrollHint) {
        if (mapProgress >= 0.98) {
          homeScrollHint.setAttribute("aria-label", "Coming soon");
        } else if (mapProgress > 0.02) {
          homeScrollHint.setAttribute("aria-label", "Keep scrolling to enlarge map");
        } else {
          homeScrollHint.setAttribute("aria-label", "Scroll to explore map preview");
        }
      }
    }

    function tickMapSmooth() {
      mapSmoothRaf = 0;
      var diff = mapTarget - mapProgress;
      if (Math.abs(diff) < 0.00035) {
        renderMapProgress(mapTarget);
        return;
      }
      // Faster catch-up early; slower endless ease through Coming Soon.
      var inEnd = mapProgress > 0.48 || mapTarget > 0.48;
      var smooth = inEnd ? MAP_SMOOTH_END : MAP_SMOOTH_EARLY;
      renderMapProgress(mapProgress + diff * smooth);
      mapSmoothRaf = requestAnimationFrame(tickMapSmooth);
    }

    function applyMapProgress(progress, immediate) {
      mapTarget = clamp01(progress);
      if (immediate || reducedMotion) {
        cancelAnimationFrame(mapSmoothRaf);
        mapSmoothRaf = 0;
        renderMapProgress(mapTarget);
        return;
      }
      if (!mapSmoothRaf) mapSmoothRaf = requestAnimationFrame(tickMapSmooth);
    }

    function setMapProgress(next, immediate) {
      next = clamp01(next);
      cancelAnimationFrame(mapProgressAnim);
      if (immediate || reducedMotion || Math.abs(next - mapTarget) < 0.001) {
        applyMapProgress(next, immediate);
        return;
      }

      var from = mapTarget;
      var change = next - from;
      var start = performance.now();
      var duration = 900;

      function frame(now) {
        var t = Math.min(1, (now - start) / duration);
        applyMapProgress(from + change * easeInOutCubic(t));
        if (t < 1) mapProgressAnim = requestAnimationFrame(frame);
      }

      mapProgressAnim = requestAnimationFrame(frame);
    }

    function nudgeMapProgress(deltaPixels) {
      if (!homePanel || panels[currentIndex] !== homePanel) return false;
      var next = mapTarget + deltaPixels / MAP_SCROLL_RANGE;
      if (next <= 0 && mapTarget <= 0 && mapProgress <= 0) return false;
      if (next >= 1 && mapTarget >= 1 && mapProgress >= 0.995) return true;
      applyMapProgress(next);
      return true;
    }

    // Ease-out feels snappier than ease-in-out (less "stuck in the middle").
    function easeOutQuint(t) {
      return 1 - Math.pow(1 - t, 5);
    }

    function setScrolling(active) {
      document.body.classList.toggle("is-scrolling", active);
      clearTimeout(scrollingClassTimer);
      if (active) {
        scrollingClassTimer = setTimeout(function () {
          document.body.classList.remove("is-scrolling");
        }, SNAP_MS + 80);
      }
    }

    function animateScrollTo(to, duration) {
      cancelAnimationFrame(scrollAnim);
      var from = scroller.scrollTop;
      var change = to - from;
      if (Math.abs(change) < 1) {
        return Promise.resolve();
      }

      setScrolling(true);
      var start = performance.now();
      duration = reducedMotion ? 0 : duration;

      return new Promise(function (resolve) {
        if (duration <= 0) {
          scroller.scrollTop = to;
          setScrolling(false);
          resolve();
          return;
        }

        function frame(now) {
          var t = Math.min(1, (now - start) / duration);
          // Integer scrollTop avoids subpixel layout thrash.
          scroller.scrollTop = Math.round(from + change * easeOutQuint(t));
          if (t < 1) {
            scrollAnim = requestAnimationFrame(frame);
          } else {
            scroller.scrollTop = to;
            setScrolling(false);
            resolve();
          }
        }

        scrollAnim = requestAnimationFrame(frame);
      });
    }

    function sectionGroup(id) {
      if (!id) return id;
      if (id === "how-it-works" || id.indexOf("how-step-") === 0) return "how-it-works";
      return id;
    }

    function setActive(id) {
      var index = panels.findIndex(function (panel) { return panel.id === id; });
      if (index >= 0) currentIndex = index;

      panels.forEach(function (panel) {
        panel.classList.toggle("is-active", panel.id === id);
      });

      var group = sectionGroup(id);

      document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (item) {
        var href = item.getAttribute("href") || "";
        var target = href.slice(1);
        var active = sectionGroup(target) === group;
        item.classList.toggle("active", active);
        if (active) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });

      document.querySelectorAll(".snap-dot").forEach(function (dot) {
        var target = dot.getAttribute("data-target");
        var active = sectionGroup(target) === group;
        dot.classList.toggle("active", active);
        if (active) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function goToIndex(index, duration) {
      index = Math.max(0, Math.min(panels.length - 1, index));
      var target = panels[index];
      if (!target || locked) return Promise.resolve();
      if (index === currentIndex && Math.abs(scroller.scrollTop - target.offsetTop) < 2) {
        return Promise.resolve();
      }

      locked = true;
      wheelAccum = 0;
      currentIndex = index;
      setActive(target.id);
      if (target.id !== "home") {
        setMapProgress(0, true);
      }
      // Keep a clean hash for how-steps family links.
      var hashId = sectionGroup(target.id) === "how-it-works" && target.id !== "how-it-works"
        ? target.id
        : target.id;
      history.replaceState(null, "", "#" + hashId);

      return animateScrollTo(target.offsetTop, duration || SNAP_MS).then(function () {
        locked = false;
        wheelLockUntil = performance.now() + 120;
      });
    }

    function goToSection(id) {
      var index = panels.findIndex(function (panel) { return panel.id === id; });
      if (index < 0 && sectionGroup(id) === "how-it-works") {
        index = panels.findIndex(function (panel) { return panel.id === "how-it-works"; });
      }
      if (index < 0) return;
      if (id === "home") setMapProgress(0, true);
      goToIndex(index, SNAP_MS);
    }

    function panelCanScroll(panel, direction) {
      if (!panel || !panel.classList.contains("how-step-final")) return false;
      var max = panel.scrollHeight - panel.clientHeight;
      if (max <= 4) return false;
      if (direction > 0) return panel.scrollTop < max - 2;
      return panel.scrollTop > 2;
    }

    function onWheel(event) {
      var delta = event.deltaY;
      if (event.deltaMode === 1) delta *= 16;
      if (event.deltaMode === 2) delta *= scroller.clientHeight;
      if (Math.abs(delta) < 1) return;

      var panel = panels[currentIndex];
      var direction = delta > 0 ? 1 : -1;

      if (panelCanScroll(panel, direction)) {
        wheelAccum = 0;
        return;
      }

      // Home map zoom is continuous — consume wheel while progress can change.
      if (homePanel && panel === homePanel) {
        if (direction > 0 || mapProgress > 0) {
          event.preventDefault();
          if (locked) return;
          nudgeMapProgress(delta);
          return;
        }
      }

      event.preventDefault();
      if (locked || performance.now() < wheelLockUntil) return;

      // Accumulate trackpad deltas so one gesture = one section.
      if ((wheelAccum > 0 && delta < 0) || (wheelAccum < 0 && delta > 0)) {
        wheelAccum = 0;
      }
      wheelAccum += delta;

      if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;

      wheelAccum = 0;
      wheelLockUntil = performance.now() + WHEEL_COOLDOWN;
      goToIndex(currentIndex + direction, SNAP_MS);
    }

    function onTouchStart(event) {
      if (!event.changedTouches || !event.changedTouches.length) return;
      touchStartY = event.changedTouches[0].clientY;
      touchLastY = touchStartY;
    }

    function onTouchMove(event) {
      if (!event.changedTouches || !event.changedTouches.length) return;
      if (!homePanel || panels[currentIndex] !== homePanel) return;
      var y = event.changedTouches[0].clientY;
      var delta = touchLastY - y;
      touchLastY = y;
      if (Math.abs(delta) < 1) return;
      if (delta > 0 || mapProgress > 0) {
        if (event.cancelable) event.preventDefault();
        nudgeMapProgress(delta * 1.35);
      }
    }

    function onTouchEnd(event) {
      if (!event.changedTouches || !event.changedTouches.length || locked) return;
      if (homePanel && panels[currentIndex] === homePanel) return;
      var delta = touchStartY - event.changedTouches[0].clientY;
      if (Math.abs(delta) < 48) return;

      var direction = delta > 0 ? 1 : -1;
      var panel = panels[currentIndex];
      if (panelCanScroll(panel, direction)) return;
      goToIndex(currentIndex + direction, SNAP_MS);
    }

    if (homeScrollHint) {
      homeScrollHint.addEventListener("click", function (event) {
        event.preventDefault();
        if (locked) return;
        if (mapProgress >= 0.96) return;
        setMapProgress(Math.min(1, mapProgress + 0.12));
      });
    }

    document.querySelectorAll(".js-show-coming-soon").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        if (locked) return;
        setMapProgress(1);
      });
    });

    applyMapProgress(0);

    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: false });
    scroller.addEventListener("touchend", onTouchEnd, { passive: true });

    document.querySelectorAll(".nav-scroll").forEach(function (link) {
      link.addEventListener("click", function (event) {
        var href = link.getAttribute("href") || "";
        if (!href.startsWith("#")) return;
        event.preventDefault();
        goToSection(href.slice(1));
        var menu = document.getElementById("navMenu");
        var toggle = document.getElementById("navToggle");
        if (menu) menu.classList.remove("open");
        if (toggle) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
        }
      });
    });

    document.querySelectorAll(".snap-dot").forEach(function (dot) {
      dot.addEventListener("click", function () {
        goToSection(dot.getAttribute("data-target"));
      });
    });

    document.addEventListener("keydown", function (event) {
      if (locked) return;
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        if (homePanel && panels[currentIndex] === homePanel && mapProgress < 1) {
          setMapProgress(Math.min(1, mapProgress + (mapProgress > 0.48 ? 0.06 : 0.1)));
          return;
        }
        goToIndex(currentIndex + 1, SNAP_MS);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        if (homePanel && panels[currentIndex] === homePanel && mapProgress > 0) {
          setMapProgress(Math.max(0, mapProgress - (mapProgress > 0.48 ? 0.06 : 0.1)));
          return;
        }
        goToIndex(currentIndex - 1, SNAP_MS);
      }
    });

    if (location.hash) {
      var hashId = location.hash.slice(1);
      var hashIndex = panels.findIndex(function (panel) { return panel.id === hashId; });
      if (hashIndex >= 0) {
        currentIndex = hashIndex;
        setActive(hashId);
        scroller.scrollTop = panels[hashIndex].offsetTop;
      } else {
        setActive("home");
      }
    } else {
      setActive("home");
    }
  }

  /* ---------- Init ---------- */

  function init() {
    setupSkyDecor();
    setupNavigation();
    setupTokenPanel();
    setupReveal();
    setupMapControls();
    setupMapWindowLinks();
    setupScrollNavigation();

    if (document.getElementById("bubbleMap")) {
      renderBubbles();

      let resizeTimer;
      window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          renderBubbles();
        }, 180);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
