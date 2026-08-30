/* ═══════════════════════════════════════════════════════════
   WEIHAO WU — PORTFOLIO V3 · script
   Vanilla JS. No dependencies. Data comes from data.json
   (auto-refreshed hourly by GitHub Actions); an embedded
   snapshot keeps the page alive if the fetch ever fails.
   ═══════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const GITHUB_USER = "Wayhhow";

  /* ── embedded fallback snapshot (kept in sync with data.json) ── */
  const FALLBACK = {
    stats: { total_stars: 32, public_repos: 18, languages_count: 4, achievements: 1 },
    lang_stats: [
      { name: "JavaScript", count: 7, pct: 84 },
      { name: "HTML", count: 7, pct: 7 },
      { name: "Python", count: 3, pct: 6 },
      { name: "CSS", count: 5, pct: 3 }
    ],
    contribString: "2025-08-30:0,2025-08-31:0,2025-09-01:0,2025-09-02:0,2025-09-03:0,2025-09-04:0,2025-09-05:0,2025-09-06:0,2025-09-07:0,2025-09-08:0,2025-09-09:0,2025-09-10:0,2025-09-11:0,2025-09-12:0,2025-09-13:0,2025-09-14:0,2025-09-15:0,2025-09-16:0,2025-09-17:0,2025-09-18:0,2025-09-19:0,2025-09-20:0,2025-09-21:0,2025-09-22:0,2025-09-23:0,2025-09-24:0,2025-09-25:0,2025-09-26:0,2025-09-27:0,2025-09-28:0,2025-09-29:0,2025-09-30:0,2025-10-01:0,2025-10-02:0,2025-10-03:0,2025-10-04:0,2025-10-05:0,2025-10-06:0,2025-10-07:0,2025-10-08:0,2025-10-09:0,2025-10-10:0,2025-10-11:0,2025-10-12:0,2025-10-13:0,2025-10-14:0,2025-10-15:0,2025-10-16:0,2025-10-17:0,2025-10-18:0,2025-10-19:0,2025-10-20:0,2025-10-21:0,2025-10-22:0,2025-10-23:0,2025-10-24:0,2025-10-25:0,2025-10-26:0,2025-10-27:0,2025-10-28:0,2025-10-29:0,2025-10-30:0,2025-10-31:0,2025-11-01:0,2025-11-02:0,2025-11-03:0,2025-11-04:0,2025-11-05:0,2025-11-06:0,2025-11-07:0,2025-11-08:0,2025-11-09:0,2025-11-10:0,2025-11-11:0,2025-11-12:0,2025-11-13:0,2025-11-14:0,2025-11-15:0,2025-11-16:0,2025-11-17:0,2025-11-18:0,2025-11-19:0,2025-11-20:0,2025-11-21:0,2025-11-22:0,2025-11-23:0,2025-11-24:0,2025-11-25:0,2025-11-26:0,2025-11-27:0,2025-11-28:0,2025-11-29:0,2025-11-30:0,2025-12-01:0,2025-12-02:0,2025-12-03:0,2025-12-04:0,2025-12-05:0,2025-12-06:0,2025-12-07:0,2025-12-08:0,2025-12-09:0,2025-12-10:0,2025-12-11:3,2025-12-12:0,2025-12-13:0,2025-12-14:0,2025-12-15:0,2025-12-16:1,2025-12-17:0,2025-12-18:0,2025-12-19:0,2025-12-20:0,2025-12-21:0,2025-12-22:0,2025-12-23:0,2025-12-24:0,2025-12-25:0,2025-12-26:0,2025-12-27:0,2025-12-28:0,2025-12-29:0,2025-12-30:0,2025-12-31:0,2026-01-01:0,2026-01-02:0,2026-01-03:0,2026-01-04:0,2026-01-05:0,2026-01-06:0,2026-01-07:0,2026-01-08:0,2026-01-09:0,2026-01-10:0,2026-01-11:0,2026-01-12:0,2026-01-13:0,2026-01-14:0,2026-01-15:0,2026-01-16:0,2026-01-17:0,2026-01-18:0,2026-01-19:0,2026-01-20:0,2026-01-21:0,2026-01-22:0,2026-01-23:0,2026-01-24:0,2026-01-25:0,2026-01-26:0,2026-01-27:0,2026-01-28:1,2026-01-29:0,2026-01-30:0,2026-01-31:0,2026-02-01:0,2026-02-02:0,2026-02-03:0,2026-02-04:0,2026-02-05:0,2026-02-06:0,2026-02-07:0,2026-02-08:0,2026-02-09:0,2026-02-10:0,2026-02-11:0,2026-02-12:0,2026-02-13:0,2026-02-14:0,2026-02-15:0,2026-02-16:0,2026-02-17:0,2026-02-18:0,2026-02-19:1,2026-02-20:0,2026-02-21:0,2026-02-22:0,2026-02-23:0,2026-02-24:0,2026-02-25:0,2026-02-26:1,2026-02-27:0,2026-02-28:0,2026-03-01:0,2026-03-02:0,2026-03-03:0,2026-03-04:0,2026-03-05:0,2026-03-06:0,2026-03-07:0,2026-03-08:0,2026-03-09:0,2026-03-10:0,2026-03-11:0,2026-03-12:0,2026-03-13:0,2026-03-14:0,2026-03-15:0,2026-03-16:0,2026-03-17:0,2026-03-18:0,2026-03-19:0,2026-03-20:0,2026-03-21:0,2026-03-22:0,2026-03-23:0,2026-03-24:0,2026-03-25:0,2026-03-26:0,2026-03-27:0,2026-03-28:0,2026-03-29:0,2026-03-30:0,2026-03-31:0,2026-04-01:0,2026-04-02:0,2026-04-03:0,2026-04-04:0,2026-04-05:0,2026-04-06:0,2026-04-07:0,2026-04-08:0,2026-04-09:0,2026-04-10:0,2026-04-11:0,2026-04-12:1,2026-04-13:13,2026-04-14:75,2026-04-15:0,2026-04-16:13,2026-04-17:11,2026-04-18:0,2026-04-19:0,2026-04-20:0,2026-04-21:2,2026-04-22:23,2026-04-23:3,2026-04-24:0,2026-04-25:0,2026-04-26:4,2026-04-27:4,2026-04-28:1,2026-04-29:0,2026-04-30:1,2026-05-01:3,2026-05-02:0,2026-05-03:0,2026-05-04:0,2026-05-05:0,2026-05-06:0,2026-05-07:3,2026-05-08:6,2026-05-09:1,2026-05-10:15,2026-05-11:14,2026-05-12:0,2026-05-13:5,2026-05-14:13,2026-05-15:8,2026-05-16:4,2026-05-17:8,2026-05-18:0,2026-05-19:3,2026-05-20:0,2026-05-21:0,2026-05-22:3,2026-05-23:0,2026-05-24:0,2026-05-25:0,2026-05-26:13,2026-05-27:5,2026-05-28:0,2026-05-29:0,2026-05-30:24,2026-05-31:17,2026-06-01:0,2026-06-02:1,2026-06-03:0,2026-06-04:3,2026-06-05:4,2026-06-06:0,2026-06-07:7,2026-06-08:0,2026-06-09:2,2026-06-10:0,2026-06-11:3,2026-06-12:0,2026-06-13:0,2026-06-14:0,2026-06-15:0,2026-06-16:0,2026-06-17:5,2026-06-18:0,2026-06-19:0,2026-06-20:0,2026-06-21:0,2026-06-22:0,2026-06-23:0,2026-06-24:0,2026-06-25:0,2026-06-26:0,2026-06-27:0,2026-06-28:0,2026-06-29:5,2026-06-30:0,2026-07-01:0,2026-07-02:0,2026-07-03:0,2026-07-04:0,2026-07-05:0,2026-07-06:0,2026-07-07:0,2026-07-08:1,2026-07-09:2,2026-07-10:0,2026-07-11:0,2026-07-12:0,2026-07-13:0,2026-07-14:0,2026-07-15:0,2026-07-16:0,2026-07-17:0,2026-07-18:4,2026-07-19:0,2026-07-20:0,2026-07-21:0,2026-07-22:0,2026-07-23:0,2026-07-24:0,2026-07-25:0,2026-07-26:4,2026-07-27:7,2026-07-28:0,2026-07-29:0,2026-07-30:0,2026-07-31:8,2026-08-01:0,2026-08-02:13,2026-08-03:1,2026-08-04:7,2026-08-05:0,2026-08-06:0,2026-08-07:0,2026-08-08:0,2026-08-09:0,2026-08-10:3,2026-08-11:0,2026-08-12:6,2026-08-13:0,2026-08-14:0,2026-08-15:0,2026-08-16:3,2026-08-17:0,2026-08-18:0,2026-08-19:0,2026-08-20:5,2026-08-21:2,2026-08-22:4,2026-08-23:4,2026-08-24:7,2026-08-25:5,2026-08-26:7,2026-08-27:3,2026-08-28:1,2026-08-29:0,2026-08-30:0",
    projects: [
      { name: "ai-video-shot-prompt-skill", lang: "Python", stars: 18, url: "https://github.com/Wayhhow/ai-video-shot-prompt-skill" },
      { name: "trae-forum-enhancer", lang: "JavaScript", stars: 3, url: "https://github.com/Wayhhow/trae-forum-enhancer" },
      { name: "survey-map", lang: "JavaScript", stars: 3, url: "https://github.com/Wayhhow/survey-map" },
      { name: "wayhhow.github.io", lang: "HTML", stars: 1, url: "https://github.com/Wayhhow/wayhhow.github.io" },
      { name: "Socratic-Questioning-Engine-Skill", lang: "Code", stars: 1, url: "https://github.com/Wayhhow/Socratic-Questioning-Engine-Skill" },
      { name: "mathforkids", lang: "JavaScript", stars: 1, url: "https://github.com/Wayhhow/mathforkids" },
      { name: "CGVST", lang: "HTML", stars: 1, url: "https://github.com/Wayhhow/CGVST" },
      { name: "Synapse", lang: "Python", stars: 1, url: "https://github.com/Wayhhow/Synapse" }
    ]
  };

  /* ── curated copy for repos whose auto-description is generic ── */
  const DESC_OVERRIDES = {
    "wayhhow.github.io": "My corner of the internet, redesigned as a print-inspired playground — no neon required.",
    "Socratic-Questioning-Engine-Skill": "An Agent Skill that turns LLMs into better questioners — the Socratic method as a reusable reasoning engine.",
    "mathforkids": "A small, friendly math-practice app for young learners.",
    "CGVST": "为我们的橙光志愿队制作的团队介绍网页。"
  };
  const NAME_OVERRIDES = {
    "wayhhow.github.io": "This Very Site",
    "ai-video-shot-prompt-skill": "AI Video Shot Prompt Skill",
    "Socratic-Questioning-Engine-Skill": "Socratic Questioning Engine"
  };

  /* ═══════════ helpers ═══════════ */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  function prettyName(repo) {
    if (NAME_OVERRIDES[repo]) return NAME_OVERRIDES[repo];
    const ACRONYMS = { ai: "AI", fpga: "FPGA", gis: "GIS", html: "HTML", css: "CSS", js: "JS", api: "API", ui: "UI", io: "IO" };
    return repo
      .replace(/[-_]+/g, " ")
      .trim()
      .split(" ")
      .map(w => ACRONYMS[w.toLowerCase()] || (w.length <= 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
      .join(" ");
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function countUp(el, target, dur) {
    if (REDUCED) { el.textContent = target; return; }
    const from = parseInt(el.textContent, 10) || 0;
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / (dur || 900), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (target - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }

  /* ═══════════ preloader ═══════════ */
  function runLoader() {
    const loader = $("#loader");
    const num = $("#loadNum");
    if (!loader) { document.body.classList.add("loaded"); return; }
    if (REDUCED) { loader.remove(); document.body.classList.add("loaded"); return; }
    const DUR = 1050;
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / DUR, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      num.textContent = Math.round(eased * 100);
      if (p < 1) { requestAnimationFrame(tick); return; }
      num.textContent = "100";
      setTimeout(() => {
        loader.classList.add("done");
        document.body.classList.add("loaded");
        setTimeout(() => loader.remove(), 850);
      }, 130);
    })(t0);
  }

  /* ═══════════ clocks ═══════════ */
  function startClocks() {
    const els = ["#navClock", "#heroClock", "#footClock"].map(s => $(s)).filter(Boolean);
    if (!els.length) return;
    const fmt = (withSec) => {
      const d = new Date();
      const pad = n => String(n).padStart(2, "0");
      return withSec ? pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds())
                     : pad(d.getHours()) + ":" + pad(d.getMinutes());
    };
    const update = () => {
      els[0].textContent = fmt(true);
      els.slice(1).forEach(el => { el.textContent = fmt(false); });
    };
    update();
    setInterval(update, 1000);
  }

  /* ═══════════ marquee ═══════════ */
  function buildMarquee() {
    const track = $("#marqueeTrack");
    if (!track) return;
    const terms = ["JAVASCRIPT", "PYTHON", "VERILOG", "FPGA", "GIS & MAPS", "OPEN SOURCE", "ACCESSIBILITY", "LINUX"];
    const items = terms.concat(terms).map((t, i) =>
      '<span class="' + (i % 2 ? "outline" : "") + '">' + t + "</span>" +
      '<svg viewBox="0 0 100 100"><use href="#sym-mark"/></svg>'
    ).join("");
    const chunk = '<div class="marquee-chunk">' + items + "</div>";
    track.innerHTML = chunk + chunk;
  }

  /* ═══════════ riso cover generator (per-project poster) ═══════════ */
  function hashStr(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h);
  }

  function coverSVG(name) {
    const h = hashStr(name);
    const PALETTES = [
      ["#e8492a", "#f2ede3", "#181510"],
      ["#2b45c9", "#f2ede3", "#e8492a"],
      ["#f2b32b", "#181510", "#e8492a"],
      ["#181510", "#f2ede3", "#e8492a"],
      ["#e8492a", "#181510", "#f2b32b"]
    ];
    const [bg, fg, ac] = PALETTES[h % PALETTES.length];
    const v = (h >> 3) % 4;
    const initial = esc(prettyName(name).charAt(0).toUpperCase());
    const checker = () => {
      let cells = "";
      for (let i = 0; i < 12; i++) {
        if ((i + (h >> 5)) % 2) continue;
        cells += '<rect x="' + (i * 22) + '" y="0" width="22" height="16" fill="' + fg + '" opacity="0.9"/>';
      }
      return cells;
    };
    let art = "";
    if (v === 0) {
      art =
        '<text x="-8" y="176" font-family="Anton, sans-serif" font-size="190" fill="' + fg + '">' + initial + "</text>" +
        '<circle cx="216" cy="42" r="34" fill="none" stroke="' + ac + '" stroke-width="7"/>' +
        '<g transform="translate(176 96) scale(0.34)" fill="' + ac + '"><use href="#sym-spark"/></g>' +
        '<g transform="translate(0 172)">' + checker() + "</g>";
    } else if (v === 1) {
      art =
        '<circle cx="132" cy="94" r="62" fill="' + fg + '"/>' +
        '<text x="132" y="118" text-anchor="middle" font-family="Anton, sans-serif" font-size="84" fill="' + bg + '">' + initial + "</text>" +
        '<g stroke="' + ac + '" stroke-width="6" stroke-linecap="round">' +
        '<path d="M14 20 H70"/><path d="M14 38 H56"/><path d="M14 56 H64"/></g>' +
        '<g transform="translate(206 20) scale(0.3)" fill="' + ac + '"><use href="#sym-mark"/></g>';
    } else if (v === 2) {
      let rows = "";
      for (let i = 0; i < 5; i++) {
        rows += '<text x="16" y="' + (46 + i * 32) + '" font-family="Anton, sans-serif" font-size="30" letter-spacing="4" fill="' + (i % 2 ? ac : fg) + '" opacity="' + (i % 2 ? 0.75 : 1) + '">' + esc(name.toUpperCase().slice(0, 14)) + "</text>";
      }
      art = rows +
        '<circle cx="216" cy="160" r="26" fill="' + fg + '"/>' +
        '<text x="216" y="174" text-anchor="middle" font-family="Anton, sans-serif" font-size="34" fill="' + bg + '">' + initial + "</text>";
    } else {
      art =
        '<path d="M0 188 A 120 120 0 0 1 240 188 Z" fill="' + fg + '"/>' +
        '<path d="M40 188 A 80 80 0 0 1 200 188 Z" fill="' + ac + '" opacity="0.85"/>' +
        '<text x="120" y="172" text-anchor="middle" font-family="Anton, sans-serif" font-size="76" fill="' + bg + '">' + initial + "</text>" +
        '<g transform="translate(16 16) scale(0.36)" fill="' + fg + '"><use href="#sym-star5"/></g>' +
        '<g transform="translate(196 16) scale(0.3)" fill="' + fg + '"><use href="#sym-spark"/></g>';
    }
    return '<svg viewBox="0 0 264 188" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(name) + ' cover">' +
      '<rect width="264" height="188" fill="' + bg + '"/>' + art + "</svg>";
  }

  /* ═══════════ work list ═══════════ */
  function workRowHTML(p, i) {
    const name = prettyName(p.name);
    const desc = DESC_OVERRIDES[p.name] || p.desc || "";
    const stars = p.stars > 0
      ? '<span class="stars"><svg viewBox="0 0 100 100"><use href="#sym-star5"/></svg><span class="proj-stars-num">' + p.stars + "</span></span>"
      : "";
    return (
      '<a class="work-row reveal in" href="' + esc(p.url) + '" target="_blank" rel="noopener" data-repo="' + esc(p.name) + '" data-cursor="view">' +
        '<span class="no">' + String(i + 1).padStart(2, "0") + "</span>" +
        '<span class="name">' + esc(name) + '<svg class="arrow-svg" viewBox="0 0 100 100"><use href="#sym-up-right"/></svg></span>' +
        '<span class="meta">' + stars + '<span class="lang">' + esc(p.lang || "Code") + "</span></span>" +
        '<span class="desc">' + esc(desc) + "</span>" +
      "</a>"
    );
  }

  function renderProjects(projects) {
    const list = $("#workList");
    if (!list || !Array.isArray(projects) || !projects.length) return;
    list.innerHTML = projects.map(workRowHTML).join("");
    bindRowPreview();
  }

  /* ═══════════ stats ═══════════ */
  function renderStats(stats) {
    if (!stats) return;
    const map = { "#stat-stars": stats.total_stars, "#stat-repos": stats.public_repos, "#stat-langs": stats.languages_count, "#stat-achv": stats.achievements };
    Object.entries(map).forEach(([sel, val]) => {
      const el = $(sel);
      if (el && typeof val === "number") countUp(el, val, 900);
    });
  }

  /* ═══════════ contribution grid ═══════════ */
  function levelClass(n) {
    if (!n) return "";
    if (n <= 2) return " l1";
    if (n <= 4) return " l2";
    if (n <= 9) return " l3";
    return " l4";
  }

  function renderContrib(contrib) {
    const grid = $("#contrib-grid");
    if (!grid) return;
    const totalEl = $("#contribTotal");
    const entries = Object.entries(contrib || {}).sort(([a], [b]) => a.localeCompare(b));
    if (!entries.length) {
      grid.innerHTML = '<p class="mono" style="color:var(--ink-soft)">No contribution data right now — go make some.</p>';
      if (totalEl) totalEl.textContent = "0";
      return;
    }
    const total = entries.reduce((s, [, n]) => s + n, 0);
    if (totalEl) countUp(totalEl, total, 1100);

    const offset = new Date(entries[0][0] + "T00:00:00").getDay();
    const weeks = [];
    let week = Array(offset).fill(null);
    entries.forEach(([date, n]) => {
      week.push({ date, n });
      if (week.length === 7) { weeks.push(week); week = []; }
    });
    if (week.length) { while (week.length < 7) week.push(null); weeks.push(week); }

    grid.innerHTML = weeks.map(w =>
      '<div class="week">' + w.map(d => {
        if (!d) return '<span class="day"></span>';
        const label = d.n + " contribution" + (d.n === 1 ? "" : "s") + " — " +
          new Date(d.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return '<span class="day' + levelClass(d.n) + '" data-tip="' + esc(label) + '"></span>';
      }).join("") + "</div>"
    ).join("");

    if (REDUCED) {
      $$(".day", grid).forEach(d => d.classList.add("on"));
    } else {
      $$(".week", grid).forEach((wEl, i) => {
        setTimeout(() => $$(".day", wEl).forEach(d => d.classList.add("on")), 80 + i * 14);
      });
    }
    bindContribTips();
  }

  function bindContribTips() {
    const tip = $("#contribTip");
    const grid = $("#contrib-grid");
    if (!tip || !grid) return;
    grid.addEventListener("mouseover", e => {
      const day = e.target.closest(".day[data-tip]");
      if (!day) return;
      tip.textContent = day.getAttribute("data-tip");
      tip.classList.add("show");
    });
    grid.addEventListener("mousemove", e => {
      if (!tip.classList.contains("show")) return;
      tip.style.left = e.clientX + "px";
      tip.style.top = e.clientY + "px";
    });
    grid.addEventListener("mouseleave", () => tip.classList.remove("show"));
  }

  /* ═══════════ language bars ═══════════ */
  function renderLangs(langs) {
    const wrap = $("#langBars");
    if (!wrap || !Array.isArray(langs) || !langs.length) return;
    wrap.innerHTML = langs.map(l =>
      '<div class="lang-row">' +
        '<span class="name"><span class="swatch" style="background:var(--ink)"></span>' + esc(l.name) + "</span>" +
        '<span class="track"><span class="fill" style="width:0%"></span></span>' +
        '<span class="pct">' + l.pct + "%</span>" +
      "</div>"
    ).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      $$(".lang-row", wrap).forEach((row, i) => {
        const fill = $(".fill", row);
        if (fill) setTimeout(() => { fill.style.width = langs[i].pct + "%"; }, REDUCED ? 0 : 80 * i);
      });
    }));
  }

  /* ═══════════ scroll reveals ═══════════ */
  function initReveals() {
    const els = $$(".reveal");
    if (REDUCED || !("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(el => io.observe(el));
  }

  /* ═══════════ cursor + floating cover ═══════════ */
  function initCursor() {
    if (!FINE_POINTER || REDUCED) return;
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    const cover = $("#floatingCover");
    if (!dot || !ring) return;

    let mx = innerWidth / 2, my = innerHeight / 2;
    let rx = mx, ry = my;
    let cx = mx, cy = my;
    let coverOn = false;

    addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });

    (function loop() {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      dot.style.transform = "translate(" + (mx - 4) + "px," + (my - 4) + "px)";
      ring.style.transform = "translate(" + (rx - ring.offsetWidth / 2) + "px," + (ry - ring.offsetHeight / 2) + "px)";
      if (coverOn) {
        cx += (mx - cx) * 0.14;
        cy += (my - cy) * 0.14;
        cover.style.transform = "translate(" + (cx + 26) + "px," + (cy - 200) + "px) rotate(-2deg) scale(1)";
      }
      requestAnimationFrame(loop);
    })();

    document.addEventListener("mouseover", e => {
      const view = e.target.closest('[data-cursor="view"]');
      const link = e.target.closest("a, button, .tag, .day");
      ring.classList.toggle("is-view", !!view);
      ring.classList.toggle("is-link", !view && !!link);
    });

    /* floating riso preview over work rows */
    function bindRowPreview() {
      if (getComputedStyle(cover).display === "none") return;
      $$(".work-row").forEach(row => {
        if (row.__bound) return;
        row.__bound = true;
        row.addEventListener("mouseenter", () => {
          cover.innerHTML = coverSVG(row.getAttribute("data-repo") || row.querySelector(".name").textContent);
          coverOn = true;
          cx = mx; cy = my;
          cover.classList.add("show");
        });
        row.addEventListener("mouseleave", () => {
          coverOn = false;
          cover.classList.remove("show");
        });
      });
    }
    window.__bindRowPreview = bindRowPreview;
    bindRowPreview();
  }

  /* expose for renderProjects after data loads */
  function bindRowPreview() { if (window.__bindRowPreview) window.__bindRowPreview(); }

  /* ═══════════ click sparkle burst ═══════════ */
  function initBursts() {
    if (REDUCED) return;
    document.addEventListener("pointerdown", e => {
      if (e.target.closest("a, button, input")) return;
      for (let i = 0; i < 5; i++) {
        const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        s.setAttribute("viewBox", "0 0 100 100");
        s.setAttribute("class", "burst");
        s.innerHTML = '<use href="#sym-spark"/>';
        s.style.left = e.clientX - 9 + "px";
        s.style.top = e.clientY - 9 + "px";
        const angle = (Math.PI * 2 * i) / 5 + Math.random();
        const dist = 26 + Math.random() * 30;
        const size = 10 + Math.random() * 14;
        s.style.width = size + "px";
        s.style.height = size + "px";
        document.body.appendChild(s);
        s.animate([
          { transform: "translate(0,0) rotate(0deg) scale(0.4)", opacity: 1 },
          { transform: "translate(" + Math.cos(angle) * dist + "px," + Math.sin(angle) * dist + "px) rotate(" + (Math.random() * 180 - 90) + "deg) scale(1)", opacity: 0 }
        ], { duration: 480 + Math.random() * 200, easing: "cubic-bezier(0.22,1,0.36,1)" }).onfinish = () => s.remove();
      }
    });
  }

  /* ═══════════ nav / menu / misc chrome ═══════════ */
  function initChrome() {
    const nav = $("#nav");
    addEventListener("scroll", () => {
      if (nav) nav.classList.toggle("scrolled", scrollY > 30);
    }, { passive: true });

    const burger = $("#navBurger");
    const overlay = $("#menuOverlay");
    function setMenu(open) {
      overlay.classList.toggle("open", open);
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
      document.body.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }
    if (burger && overlay) {
      burger.addEventListener("click", () => setMenu(!overlay.classList.contains("open")));
      $$("a", overlay).forEach(a => a.addEventListener("click", () => setMenu(false)));
    }

    const toTop = $("#toTop");
    if (toTop) toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: REDUCED ? "auto" : "smooth" }));
  }

  /* ═══════════ data pipeline ═══════════ */
  function parseContribString(str) {
    const out = {};
    String(str).split(",").forEach(pair => {
      const i = pair.lastIndexOf(":");
      if (i > 0) out[pair.slice(0, i)] = parseInt(pair.slice(i + 1), 10) || 0;
    });
    return out;
  }

  async function loadData() {
    try {
      const res = await fetch("data.json", { cache: "no-store" });
      if (res.ok) {
        const d = await res.json();
        if (d && d.stats) return d;
      }
    } catch (e) { /* offline / file:// — fall through */ }
    return {
      stats: FALLBACK.stats,
      lang_stats: FALLBACK.lang_stats,
      contributions: parseContribString(FALLBACK.contribString),
      projects: FALLBACK.projects.map(p => Object.assign({ desc: "" }, p))
    };
  }

  /* ═══════════ boot ═══════════ */
  async function init() {
    runLoader();
    startClocks();
    buildMarquee();
    initChrome();
    initReveals();
    initCursor();
    initBursts();

    const data = await loadData();
    renderStats(data.stats);
    if (Array.isArray(data.projects) && data.projects.length) renderProjects(data.projects);
    renderContrib(data.contributions);
    renderLangs(data.lang_stats);
    bindRowPreview();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
