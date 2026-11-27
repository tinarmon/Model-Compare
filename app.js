(function () {
  "use strict";

  const DATA = window.REPORT_DATA;
  if (!DATA) return;

  const urlParams = new URLSearchParams(window.location.search);
  const ALL_MODELS = [...DATA.baselines, ...DATA.candidates];

  const MOE_COLORS = ["#15616d", "#0f766e", "#0284c7", "#0369a1", "#2563eb", "#4f46e5"];
  const DENSE_COLORS = ["#d97706", "#b45309", "#ea580c", "#9a3412", "#ca8a04"];

  const TAB_ORDER = ["matrix", "charts", "cards", "groups", "excluded"];
  const TAB_TITLES = {
    matrix: "1. ตารางเทียบตรง (Apples-to-Apples)",
    charts: "2. กราฟโต้ตอบแบบ Excel / Power BI",
    cards: "3. การ์ดสรุป & คู่ Baselines",
    groups: "4. จัดกลุ่มโมเดลตามบทบาท (Groups A–D)",
    excluded: `5. บันทึกโมเดลที่คัดออก (${DATA.excluded.oversizeOsi.length + DATA.excluded.nonOsi.length} รุ่น)`
  };

  const MODEL_GROUPS = [
    {
      key: "A",
      badge: "GROUP A",
      short: "Frontier",
      title: "Frontier Coding Breakthroughs (กลุ่มตัวท็อปสายโค้ด/Agent)",
      desc: "เกณฑ์คัดเข้า: SWE-bench Pro ≥ 50% หรือ SWE-bench Verified ≥ 74% หรือ DeepSWE ≥ 40% หรือ Terminal-Bench 4.0 ≥ 20%"
    },
    {
      key: "B",
      badge: "GROUP B",
      short: "Mainstream",
      title: "Mainstream Coding & Reasoning Staples (กลุ่มใช้งานแพร่หลาย Text-only > 10 GB)",
      desc: "โมเดล OSI สาย Coding และ Reasoning ยอดนิยมบน HuggingFace/Ollama ที่มีขนาดไฟล์ Q4 > 10 GB"
    },
    {
      key: "C",
      badge: "GROUP C",
      short: "Vision VLMs",
      title: "Multimodal Vision & Enterprise VLMs (กลุ่มรับภาพได้ > 10 GB)",
      desc: "โมเดล Multimodal (Vision: Yes) สำหรับงาน UI, OCR, เอกสาร และ GUI Agent ที่มีขนาดไฟล์ Q4 > 10 GB"
    },
    {
      key: "D",
      badge: "GROUP D",
      short: "Compact ≤10G",
      title: "Compact Edge & Lightweight Specialists (กลุ่มขนาดเบา ≤ 10 GB Q4)",
      desc: "โมเดลรันเร็วบนโน้ตบุ๊ก/การ์ดจอเดียว (4.7–9.0 GB Q4) ทั้งสาย Coding, Reasoning และ Edge Vision"
    }
  ];

  function classifyModelGroup(m) {
    const s = m.codingScores || {};
    if (
      (s.swePro?.value ?? -1) >= 50 ||
      (s.sweVerified?.value ?? -1) >= 74 ||
      (s.deepSwe?.value ?? -1) >= 40 ||
      (s.terminalBench4?.value ?? -1) >= 20
    ) {
      return "A";
    }
    if (m.q4DiskGb <= 10) return "D";
    if (m.vision) return "C";
    return "B";
  }

  const LINE_AXES_ALL = [
    { key: "sweVerified", label: "SWE Verified" },
    { key: "liveCodeBench", label: "LiveCodeBench" },
    { key: "swePro", label: "SWE-bench Pro" },
    { key: "deepSwe", label: "DeepSWE v1.1" },
    { key: "terminalBench4", label: "Terminal-Bench 4.0" },
    { key: "frontierCode2", label: "FrontierCode 2.0" }
  ];

  const INITIAL_SLICER_IDS = [
    "deepseek-v4-1-flash-1017",
    "deepseek-v4-flash-0731",
    "qwen3-8-27b",
    "step-3-7-flash",
    "inkling-small-276b",
    "mimo-v2-6-flash",
    "glm-5-3-flash"
  ];

  const initialExpanded = new Set();
  const expandParam = urlParams.get("expand");
  if (expandParam) {
    expandParam.split(",").forEach((id) => {
      if (id.trim()) initialExpanded.add(id.trim());
    });
  }

  function readStoredTextSize() {
    const fromUrl = urlParams.get("size");
    if (["sm", "md", "lg"].includes(fromUrl)) return fromUrl;
    try {
      const saved = window.localStorage?.getItem("report-text-size");
      if (["sm", "md", "lg"].includes(saved)) return saved;
    } catch (_) {}
    return "md";
  }

  const state = {
    activeTab: TAB_ORDER.includes(urlParams.get("tab")) ? urlParams.get("tab") : "matrix",
    presentMode: urlParams.get("mode") === "present",
    textSize: readStoredTextSize(),
    baselineEnabled: urlParams.get("baseline") !== "off",
    baselineId: ALL_MODELS.some((m) => m.id === urlParams.get("baseline"))
      ? urlParams.get("baseline")
      : "deepseek-v4-flash-0731",
    // Matrix state
    benchKey: "swePro",
    sortCol: "score",
    sortDir: "desc",
    topChartN: 8,
    topChartOpen: true,
    sizeCap: 350,
    archFilter: "all",
    visionFilter: "all",
    contextFilter: "all",
    applesOnly: false,
    query: "",
    preset: "all",
    expandedIds: initialExpanded,
    // Interactive Chart Builder state (Excel / Power BI)
    chartView: ["all", "line", "bar", "dot"].includes(urlParams.get("chart")) ? urlParams.get("chart") : "all",
    slicerIds: new Set(INITIAL_SLICER_IDS),
    slicerPreset: "top6",
    showAllChips: false,
    lineAxisKeys: new Set(LINE_AXES_ALL.map((a) => a.key)),
    barMetric: "swePro",
    barSort: "desc",
    showRef0731: true,
    showRef1017: true,
    dotX: "q4DiskGb",
    dotY: "swePro",
    highlightedModelId: null,
    // Cards & Groups tab state
    cardFilter: "all",
    groupFilter: "all"
  };

  function esc(val) {
    return String(val ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseContextK(ctxStr) {
    const matches = [...String(ctxStr || "").matchAll(/(\d+(?:\.\d+)?)\s*([kKmM])/g)];
    if (matches.length === 0) return null;
    const last = matches[matches.length - 1];
    const num = Number(last[1]);
    return last[2].toLowerCase() === "m" ? num * 1000 : num;
  }

  function getBenchMeta(key) {
    if (key === "q4DiskGb") {
      return { key: "q4DiskGb", label: "ขนาดไฟล์ Q4 (GB)", shortLabel: "Q4 (GB)", unit: "GB" };
    }
    if (key === "contextK") {
      return { key: "contextK", label: "Context Window (Tokens)", shortLabel: "Context", unit: "K" };
    }
    return DATA.benchmarks.find((b) => b.key === key) || DATA.benchmarks[0];
  }

  function getMetricValue(m, metricKey) {
    if (metricKey === "q4DiskGb") return m.q4DiskGb;
    if (metricKey === "contextK") return parseContextK(m.context);
    return m.codingScores?.[metricKey]?.value ?? null;
  }

  function formatMetricVal(val, unit) {
    if (val === null || val === undefined) return "—";
    if (unit === "Elo") return Math.round(val).toString();
    if (unit === "GB") return Number(val).toFixed(1) + " GB";
    if (unit === "K") return val >= 1000 ? `${+(val / 1000).toFixed(1)}M` : `${Math.round(val)}K`;
    return Number(val).toFixed(1) + "%";
  }

  function formatDeltaThai(val, baseVal, unit) {
    if (val === null || val === undefined || baseVal === null || baseVal === undefined) {
      return { text: "ไม่มีผลเทียบตรง", cls: "delta-zero" };
    }
    const diff = val - baseVal;
    const sign = diff > 0 ? "+" : "";
    const formatted = unit === "Elo" ? `${sign}${Math.round(diff)} Elo` : `${sign}${diff.toFixed(1)} จุด`;
    const cls = diff > 0.05 ? "delta-pos" : diff < -0.05 ? "delta-neg" : "delta-zero";
    return { text: formatted, cls };
  }

  function getActiveBaseline() {
    return ALL_MODELS.find((m) => m.id === state.baselineId) || DATA.baselines[1];
  }

  function getShortModelName(m) {
    if (!m) return "";
    if (m.id === "deepseek-v4-flash-0731") return "0731";
    if (m.id === "deepseek-v4-1-flash-1017") return "1017";
    return m.name.replace(" (276B)", "");
  }

  function getModelColorMap(models) {
    let moeIdx = 0;
    let denseIdx = 0;
    const map = {};
    models.forEach((m) => {
      if (m.id === "deepseek-v4-1-flash-1017") map[m.id] = "#a33814";
      else if (m.id === "deepseek-v4-flash-0731") map[m.id] = "#00243d";
      else if (m.archType === "MoE") map[m.id] = MOE_COLORS[moeIdx++ % MOE_COLORS.length];
      else map[m.id] = DENSE_COLORS[denseIdx++ % DENSE_COLORS.length];
    });
    return map;
  }

  // --- Floating Tooltip & Power BI Cross-Highlight ---
  const tooltipEl = document.getElementById("chart-tooltip");
  function showTooltip(evt, html) {
    tooltipEl.innerHTML = html;
    tooltipEl.hidden = false;
    const pad = 14;
    let left = evt.clientX + pad;
    let top = evt.clientY + pad;
    const rect = tooltipEl.getBoundingClientRect();
    if (left + rect.width > window.innerWidth - 10) left = evt.clientX - rect.width - pad;
    if (top + rect.height > window.innerHeight - 10) top = evt.clientY - rect.height - pad;
    tooltipEl.style.left = `${Math.max(8, left)}px`;
    tooltipEl.style.top = `${Math.max(8, top)}px`;
  }
  function hideTooltip() {
    tooltipEl.hidden = true;
  }

  function attachChartInteractions(container) {
    container.querySelectorAll("[data-model-id]").forEach((el) => {
      const mid = el.getAttribute("data-model-id");
      const toggleHighlight = (e) => {
        e.stopPropagation();
        state.highlightedModelId = state.highlightedModelId === mid ? null : mid;
        document.getElementById("clear-highlight-btn").hidden = !state.highlightedModelId;
        renderAllCharts();
      };
      el.classList.add("svg-interactive");
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-pressed", state.highlightedModelId === mid ? "true" : "false");
      el.addEventListener("mousemove", (e) => {
        const tip = el.getAttribute("data-tip");
        if (tip) showTooltip(e, tip);
      });
      el.addEventListener("mouseleave", hideTooltip);
      el.addEventListener("blur", hideTooltip);
      el.addEventListener("click", toggleHighlight);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (e.preventDefault) e.preventDefault();
          toggleHighlight(e);
        }
      });
    });
  }

  function applyTextSize(size) {
    const valid = ["sm", "md", "lg"].includes(size) ? size : "md";
    state.textSize = valid;
    if (document.documentElement) {
      document.documentElement.dataset.textSize = valid;
    }
    document.querySelectorAll("[data-text-size]").forEach((btn) => {
      const act = btn.dataset.textSize === valid;
      btn.classList.toggle("is-active", act);
      btn.setAttribute("aria-pressed", act ? "true" : "false");
    });
    try {
      window.localStorage?.setItem("report-text-size", valid);
    } catch (_) {}
  }

  // --- Inventory Bar & Dynamic Counts ---
  function renderInventoryBar() {
    const c = DATA.candidates;
    const u160 = c.filter((m) => m.q4DiskGb < 160).length;
    const b160 = c.filter((m) => m.q4DiskGb >= 160 && m.q4DiskGb <= 200).length;
    const o200 = c.filter((m) => m.q4DiskGb > 200).length;
    const moe = c.filter((m) => m.archType === "MoE").length;
    const dense = c.filter((m) => m.archType === "Dense").length;
    const vYes = c.filter((m) => m.vision).length;
    const vNo = c.length - vYes;
    const totalOsi = c.length + DATA.excluded.oversizeOsi.length;
    const totalExcl = DATA.excluded.oversizeOsi.length + DATA.excluded.nonOsi.length;
    document.getElementById("inventory-bar").innerHTML =
      `<span>ขอบเขต: <strong>${totalOsi} OSI</strong> → <strong>${c.length} รุ่นในตาราง</strong> (&lt;160G: <strong>${u160}</strong> · 161–200G: <strong>${b160}</strong> · &gt;200G: <strong>${o200}</strong>)</span>` +
      `<span>สถาปัตยกรรม: <strong>${moe} MoE</strong> / <strong>${dense} Dense</strong></span>` +
      `<span>ใส่ภาพได้: <strong>${vYes} Vision Yes</strong> / <strong>${vNo} Text-only</strong></span>`;

    const setTxt = (sel, txt) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = txt;
    };
    setTxt('[data-preset="all"]', `ทั้งหมด (${c.length} รุ่น)`);
    setTxt('[data-arch="MoE"]', `MoE (${moe})`);
    setTxt('[data-arch="Dense"]', `Dense (${dense})`);
    setTxt('[data-card-filter="all"]', `ทั้งหมด (${SCANNABLE_CARDS.length} การ์ดเด่น)`);
    setTxt('.nav-link[data-tab="groups"]', `4. จัดกลุ่ม (${MODEL_GROUPS.length})`);
    setTxt('.nav-link[data-tab="excluded"]', `5. คัดออก (${totalExcl})`);
    const exclHeading = document.getElementById("excluded-heading");
    if (exclHeading) exclHeading.textContent = `บันทึกโมเดลที่คัดออกจากตารางหลัก (${totalExcl} รุ่น)`;
  }

  // --- Tab Switching & Presentation Mode ---
  function applyTabAndPresentation() {
    hideTooltip();
    document.querySelectorAll(".tab-panel").forEach((p) => {
      p.classList.toggle("is-active", p.id === `tab-${state.activeTab}`);
    });
    document.querySelectorAll(".nav-link[data-tab]").forEach((btn) => {
      const act = btn.dataset.tab === state.activeTab;
      btn.classList.toggle("is-active", act);
      btn.setAttribute("aria-selected", act ? "true" : "false");
      btn.setAttribute("tabindex", act ? "0" : "-1");
    });

    document.body.classList.toggle("is-present-mode", state.presentMode);
    const modeBtn = document.getElementById("mode-toggle-btn");
    modeBtn.setAttribute("aria-pressed", state.presentMode ? "true" : "false");
    modeBtn.textContent = state.presentMode ? "โหมดอ่านเต็มหน้า" : "โหมดนำเสนอ";

    const bar = document.getElementById("present-bar");
    bar.hidden = !state.presentMode;
    const idx = TAB_ORDER.indexOf(state.activeTab);
    document.getElementById("slide-status-text").textContent = `สไลด์ ${idx + 1} / ${TAB_ORDER.length} · ${TAB_TITLES[state.activeTab]}`;
    document.getElementById("slide-prev-btn").disabled = idx <= 0;
    document.getElementById("slide-next-btn").disabled = idx >= TAB_ORDER.length - 1;
  }

  // --- Tab 1: Matrix ---
  function filterCandidates() {
    const q = state.query.trim().toLowerCase();
    return DATA.candidates.filter((m) => {
      if (m.q4DiskGb > state.sizeCap) return false;
      if (state.archFilter !== "all" && m.archType !== state.archFilter) return false;
      if (state.visionFilter === "yes" && !m.vision) return false;
      if (state.visionFilter === "no" && m.vision) return false;
      if (state.contextFilter !== "all") {
        const ctxK = parseContextK(m.context) ?? 0;
        if (state.contextFilter === "128k" && ctxK < 128) return false;
        if (state.contextFilter === "256k" && ctxK < 256) return false;
        if (state.contextFilter === "1m" && ctxK < 1000) return false;
      }
      if (state.applesOnly) {
        const s = m.codingScores?.[state.benchKey];
        if (!s || s.value === null || s.value === undefined) return false;
      }
      if (q) {
        const hay = `${m.name} ${m.vendor} ${m.archDetail} ${m.license} ${m.modality}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  function syncMatrixControls() {
    const syncGroup = (sel, val, attr) => {
      document.querySelectorAll(sel).forEach((b) => {
        const act = b.dataset[attr] === val;
        b.classList.toggle("is-active", act);
        b.setAttribute("aria-pressed", act ? "true" : "false");
      });
    };
    syncGroup("[data-preset]", state.preset, "preset");
    const sizeSel = document.getElementById("size-cap-select");
    if (sizeSel) sizeSel.value = String(state.sizeCap);
    syncGroup("[data-arch]", state.archFilter, "arch");
    syncGroup("[data-vision]", state.visionFilter, "vision");
    syncGroup("[data-context]", state.contextFilter, "context");
  }

  function renderDetailRow(m, activeBench) {
    const hfUrl = m.hfRepo ? `https://huggingface.co/${m.hfRepo}` : null;
    const cards = DATA.benchmarks
      .map((bm) => {
        const sc = m.codingScores?.[bm.key];
        const isCurrent = bm.key === activeBench.key;
        if (!sc || sc.value === null || sc.value === undefined) {
          return `<div class="detail-card ${isCurrent ? "is-current" : ""}"><div class="detail-k">${esc(
            bm.shortLabel
          )}</div><div class="detail-v score-na">—</div><div class="detail-note">ยังไม่มีผลเผยแพร่ทางการ</div></div>`;
        }
        const cautionBadge = sc.caution ? ` · ⚠ ${esc(sc.labelSuffix || "Caution")}` : "";
        const alt = sc.altText ? `<div>${esc(sc.altText)}</div>` : "";
        const link = sc.url
          ? `<a href="${esc(sc.url)}" target="_blank" rel="noopener noreferrer">${esc(sc.source)}</a>`
          : esc(sc.source);
        return `<div class="detail-card ${isCurrent ? "is-current" : ""}">
          <div class="detail-k">${esc(bm.shortLabel)}${cautionBadge}</div>
          <div class="detail-v">${esc(formatMetricVal(sc.value, bm.unit))}</div>
          <div class="detail-note">${alt}${link}${sc.note ? ` — ${esc(sc.note)}` : ""}</div>
        </div>`;
      })
      .join("");

    return `<tr class="detail-row"><td colspan="8"><div class="detail-wrap">
      <div class="detail-top">
        <span><strong>${esc(m.name)}</strong> · ${esc(m.archDetail)} · Context ${esc(m.context)} · Q8 ${esc(m.q8DiskGb)} GB</span>
        ${hfUrl ? `<a href="${esc(hfUrl)}" target="_blank" rel="noopener noreferrer">Hugging Face: ${esc(m.hfRepo)} ↗</a>` : ""}
      </div>
      <div class="detail-grid">${cards}</div>
    </div></td></tr>`;
  }

  function renderMatrixRow(m, options) {
    const { isBaseline = false, isPrimaryBase = false, activeBench, deltaRef } = options;
    const isExpanded = state.expandedIds.has(m.id);
    const rowCls = ["main-row", isBaseline ? "is-baseline-row" : "", isPrimaryBase ? "is-baseline-0731" : ""]
      .filter(Boolean)
      .join(" ");

    const archPill = m.archType === "MoE" ? "pill-moe" : "pill-dense";
    const visionPill = m.vision ? "pill-vision-yes" : "pill-vision-no";
    const sizePill =
      !isBaseline && m.q4DiskGb > 200
        ? `<span class="pill pill-band-warn">&gt;200G</span>`
        : !isBaseline && m.q4DiskGb > 160
        ? `<span class="pill pill-band-warn">161–200G</span>`
        : "";
    const baseTag = isBaseline ? `<span class="pill pill-base">BASE ${esc(getShortModelName(m))}</span>` : "";

    const sc = m.codingScores?.[activeBench.key] || null;
    const altHints =
      !sc || sc.value === null || sc.value === undefined
        ? DATA.benchmarks
            .filter((bm) => bm.key !== activeBench.key && m.codingScores?.[bm.key]?.value != null)
            .slice(0, 2)
            .map((bm) => `${bm.shortLabel} ${formatMetricVal(m.codingScores[bm.key].value, bm.unit)}`)
            .join(" · ")
        : "";
    const activeScoreHtml =
      sc && sc.value !== null && sc.value !== undefined
        ? `<span class="score-main">${esc(formatMetricVal(sc.value, activeBench.unit))}</span>` +
          (sc.caution
            ? `<br/><span class="score-caution" title="${esc(sc.note || "")}">⚠ ${esc(sc.labelSuffix || "ข้อควรระวัง")}</span>`
            : "") +
          `<span class="score-src">${esc(sc.source)}</span>`
        : `<span class="score-na">—</span>${altHints ? `<span class="score-alt-hint">ผลอื่น: ${esc(altHints)}</span>` : ""}`;

    const activeVal = sc?.value ?? null;
    const baseVal = deltaRef ? deltaRef.codingScores?.[activeBench.key]?.value ?? null : null;
    const delta = !deltaRef
      ? { text: "—", cls: "delta-zero" }
      : m.id === deltaRef.id && baseVal !== null
      ? { text: "Baseline (0)", cls: "delta-zero" }
      : formatDeltaThai(activeVal, baseVal, activeBench.unit);

    const paramText =
      m.archType === "MoE" ? `${m.totalParamsB}B / ${m.activeParamsB}B active` : `${m.totalParamsB}B dense`;
    const groupMeta = isBaseline ? "" : ` · Group ${classifyModelGroup(m)}`;

    const mainHtml = `<tr class="${rowCls}">
      <td>
        <div class="model-cell-name">${baseTag}${esc(m.name)}</div>
        <div class="model-cell-meta">${esc(m.vendor)} · ${esc(m.license)}${groupMeta}</div>
      </td>
      <td><span class="pill ${archPill}">${esc(m.archType)}</span><div class="model-cell-meta">${esc(paramText)}</div></td>
      <td class="td-num"><span class="score-main">${esc(Number(m.q4DiskGb).toFixed(1))} GB</span>${sizePill}<div class="model-cell-meta">Q8: ${esc(m.q8DiskGb)} GB</div></td>
      <td><span class="pill ${visionPill}">${m.vision ? "Yes" : "No"}</span><div class="model-cell-meta">${esc(m.modality)}</div></td>
      <td class="td-num"><span class="score-main">${esc(m.context)}</span><div class="model-cell-meta">tokens</div></td>
      <td class="td-num td-active">${activeScoreHtml}</td>
      <td class="td-num"><span class="${delta.cls}">${esc(delta.text)}</span></td>
      <td class="td-action"><button type="button" class="expand-btn" data-toggle-id="${esc(m.id)}" aria-expanded="${isExpanded ? "true" : "false"}">${isExpanded ? "ซ่อน ▴" : "ดู 7 ชุด ▾"}</button></td>
    </tr>`;

    return isExpanded ? mainHtml + renderDetailRow(m, activeBench) : mainHtml;
  }

  function renderMatrix() {
    const activeBench = getBenchMeta(state.benchKey);
    const activeBase = getActiveBaseline();
    const b1017 = DATA.baselines[0];
    const b0731 = DATA.baselines[1];
    const vActive = getMetricValue(activeBase, state.benchKey);
    const v1017 = getMetricValue(b1017, state.benchKey);
    const v0731 = getMetricValue(b0731, state.benchKey);

    const effectiveDeltaRef = !state.baselineEnabled
      ? null
      : vActive !== null
      ? activeBase
      : v1017 !== null
      ? b1017
      : v0731 !== null
      ? b0731
      : activeBase;
    const pinnedBaselines = [];
    if (state.baselineEnabled) {
      if (v1017 !== null && b1017.id !== activeBase.id) pinnedBaselines.push(b1017);
      if (vActive !== null) pinnedBaselines.push(activeBase);
      else if (effectiveDeltaRef && effectiveDeltaRef.id !== b1017.id && getMetricValue(effectiveDeltaRef, state.benchKey) !== null) {
        pinnedBaselines.push(effectiveDeltaRef);
      }
    }
    const pinnedIds = new Set(pinnedBaselines.map((b) => b.id));

    const refVal = effectiveDeltaRef ? getMetricValue(effectiveDeltaRef, state.benchKey) : null;
    const refShort = effectiveDeltaRef ? getShortModelName(effectiveDeltaRef) : "";

    const dirSign = state.sortDir === "asc" ? 1 : -1;
    const getSortKeyVal = (m) => {
      if (state.sortCol === "name") return m.name;
      if (state.sortCol === "arch") return m.archType;
      if (state.sortCol === "q4DiskGb") return m.q4DiskGb;
      if (state.sortCol === "vision") return m.vision ? 1 : 0;
      if (state.sortCol === "contextK") return parseContextK(m.context);
      const val = m.codingScores?.[state.benchKey]?.value ?? null;
      if (state.sortCol === "delta") return val !== null && refVal !== null ? val - refVal : null;
      return val;
    };

    const filtered = filterCandidates()
      .filter((m) => !pinnedIds.has(m.id))
      .sort((a, b) => {
        const av = getSortKeyVal(a);
        const bv = getSortKeyVal(b);
        const aNull = av === null || av === undefined;
        const bNull = bv === null || bv === undefined;
        if (aNull !== bNull) return aNull ? 1 : -1;
        if (!aNull && !bNull) {
          if (typeof av === "string" || typeof bv === "string") {
            const cmp = String(av).localeCompare(String(bv));
            if (cmp !== 0) return cmp * dirSign;
          } else if (bv !== av) {
            return (av - bv) * dirSign;
          }
        }
        if (state.sortCol === "arch" && a.activeParamsB !== b.activeParamsB) {
          return (a.activeParamsB - b.activeParamsB) * dirSign;
        }
        return a.q4DiskGb - b.q4DiskGb;
      });

    const winnersRef = refVal !== null ? filtered.filter((m) => (m.codingScores?.[state.benchKey]?.value ?? -1) > refVal) : [];
    const scoredSorted = filtered
      .filter((m) => m.codingScores?.[state.benchKey]?.value != null)
      .sort((a, b) => b.codingScores[state.benchKey].value - a.codingScores[state.benchKey].value || a.q4DiskGb - b.q4DiskGb);
    const topPick = scoredSorted[0] || null;

    let takeawayHtml = `<div><strong>Key Takeaway (${esc(activeBench.label)}):</strong> `;
    if (state.baselineEnabled && refVal !== null && winnersRef.length > 0) {
      takeawayHtml += `พบ <strong>${winnersRef.length} รุ่น</strong> ที่ชนะ Baseline ${esc(refShort)} (${esc(
        formatMetricVal(refVal, activeBench.unit)
      )}) นำโดย <strong>${esc(topPick.name)}</strong> (${esc(
        formatMetricVal(topPick.codingScores[state.benchKey].value, activeBench.unit)
      )})`;
    } else if (topPick) {
      takeawayHtml += `อันดับ 1 ในชุดนี้คือ <strong>${esc(topPick.name)}</strong> (${esc(
        formatMetricVal(topPick.codingScores[state.benchKey].value, activeBench.unit)
      )})`;
    } else {
      takeawayHtml += `ไม่มีรุ่นที่ผ่านตัวกรองในชุดทดสอบนี้`;
    }
    takeawayHtml += `</div>`;

    if (!state.baselineEnabled) {
      takeawayHtml += `<span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--ink-secondary);">โหมดปิด Baseline (แสดงเฉพาะ Candidate)</span>`;
    } else if (effectiveDeltaRef.id !== activeBase.id && vActive === null) {
      takeawayHtml += `<span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--rust);">หมายเหตุ: ${esc(
        getShortModelName(activeBase)
      )} ไม่มีผลวัดชุดนี้ ตารางจึงสลับมาเทียบส่วนต่างกับ ${esc(refShort)} แทน (ไม่แสดงแถวว่าง)</span>`;
    } else if (v1017 === null) {
      takeawayHtml += `<span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--rust);">หมายเหตุ: Baseline 1017 ไม่มีผลวัดชุดนี้ จึงไม่แสดงแถวว่างในตาราง</span>`;
    } else {
      takeawayHtml += `<span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--rust);">เพดาน 1017: ${esc(
        formatMetricVal(v1017, activeBench.unit)
      )}</span>`;
    }
    document.getElementById("matrix-takeaway").innerHTML = takeawayHtml;

    document.getElementById("active-bench-note").innerHTML =
      `กำลังเทียบตรงบน <strong>${esc(activeBench.label)}</strong> — ${esc(activeBench.comparabilityNote)}`;
    document.getElementById("active-score-head").textContent = activeBench.label;
    document.getElementById("delta-col-head").textContent = state.baselineEnabled ? `ต่างจาก ${refShort}` : "ส่วนต่าง (ปิด Baseline)";
    refreshBaselineSelectOptions();

    document.querySelectorAll("[data-sort-col]").forEach((btn) => {
      const isActive = btn.dataset.sortCol === state.sortCol;
      btn.classList.toggle("is-sorted", isActive);
      const arrow = isActive ? (state.sortDir === "asc" ? "▴" : "▾") : "⇅";
      const ind = btn.querySelector?.(".sort-ind");
      if (ind) ind.textContent = arrow;
      btn.setAttribute("data-sort-dir", isActive ? state.sortDir : "none");
      const th = btn.closest?.("th");
      if (th) th.setAttribute("aria-sort", isActive ? (state.sortDir === "asc" ? "ascending" : "descending") : "none");
    });

    const visibleIds = [...pinnedBaselines.map((b) => b.id), ...filtered.map((m) => m.id)];
    const allExpanded = visibleIds.length > 0 && visibleIds.every((id) => state.expandedIds.has(id));
    const expandAllBtn = document.getElementById("expand-all-btn");
    expandAllBtn.textContent = allExpanded ? "ย่อรายละเอียดทุกแถว ▴" : "ขยายดูครบ 7 ชุดทดสอบทุกแถว ▾";
    expandAllBtn.dataset.allExpanded = allExpanded ? "1" : "0";

    const rowsHtml = [
      ...pinnedBaselines.map((b) =>
        renderMatrixRow(b, { isBaseline: true, isPrimaryBase: effectiveDeltaRef && b.id === effectiveDeltaRef.id, activeBench, deltaRef: effectiveDeltaRef })
      ),
      ...(filtered.length > 0
        ? filtered.map((m) => renderMatrixRow(m, { activeBench, deltaRef: effectiveDeltaRef }))
        : [
            `<tr><td colspan="8" style="text-align:center;padding:24px;color:#526777;">ไม่พบโมเดลที่ตรงกับตัวกรอง <button type="button" class="action-btn" id="inline-reset-btn" style="margin-left:8px;">รีเซ็ตตัวกรอง</button></td></tr>`
          ])
    ];

    document.getElementById("matrix-tbody").innerHTML = rowsHtml.join("");
    document.getElementById("table-status").innerHTML =
      `แสดง Baseline <strong>${pinnedBaselines.length}</strong> รุ่น + Candidate <strong>${filtered.length}</strong> จาก ${DATA.candidates.length} รุ่น`;

    renderMatrixTopChart(filtered, activeBench, effectiveDeltaRef);

    const inlineReset = document.getElementById("inline-reset-btn");
    if (inlineReset) inlineReset.addEventListener("click", resetFilters);
  }

  function renderMatrixTopChart(filtered, activeBench, deltaRef) {
    const host = document.getElementById("matrix-top-chart");
    const titleEl = document.getElementById("matrix-top-title");
    const plate = document.getElementById("matrix-top-plate");
    if (!host || !titleEl) return;
    if (plate) plate.classList.toggle("is-collapsed", !state.topChartOpen);

    const colNames = {
      name: "ชื่อโมเดล",
      arch: "สถาปัตยกรรม",
      q4DiskGb: "ขนาด Q4 (GB)",
      vision: "Vision",
      contextK: "Context Window",
      score: activeBench.label,
      delta: deltaRef ? `ส่วนต่างเทียบ ${getShortModelName(deltaRef)}` : "ส่วนต่าง"
    };
    const dirTxt = state.sortDir === "asc" ? "น้อย → มาก" : "มาก → น้อย";
    const isDeltaMode = state.sortCol === "delta" && state.baselineEnabled && deltaRef && getMetricValue(deltaRef, activeBench.key) !== null;
    const metricKey =
      state.sortCol === "q4DiskGb"
        ? "q4DiskGb"
        : state.sortCol === "contextK"
        ? "contextK"
        : activeBench.key;
    const bm = getBenchMeta(metricKey);
    const refVal = state.baselineEnabled && deltaRef ? getMetricValue(deltaRef, metricKey) : null;

    const rows = filtered
      .map((m) => {
        const raw = getMetricValue(m, metricKey);
        if (raw === null) return null;
        const val = isDeltaMode ? raw - refVal : raw;
        return { m, val, raw };
      })
      .filter(Boolean)
      .slice(0, state.topChartN);

    const metricNote = ["name", "arch", "vision"].includes(state.sortCol) ? ` · แสดงค่า ${bm.shortLabel}` : "";
    titleEl.textContent = `กราฟ Top ${Math.min(state.topChartN, rows.length || state.topChartN)} ตามการเรียง: ${colNames[state.sortCol] || activeBench.label} (${dirTxt})${metricNote}`;

    if (rows.length === 0) {
      host.innerHTML = `<div class="chart-empty">ไม่มีโมเดลที่มีค่า ${esc(bm.label)} จากตัวกรองปัจจุบัน</div>`;
      return;
    }

    const W = 980;
    const rowH = 24;
    const pad = { l: 215, r: 90, t: 22, b: 14 };
    const H = pad.t + pad.b + rows.length * rowH;
    const pw = W - pad.l - pad.r;

    let minV = 0;
    let maxV = 100;
    if (isDeltaMode) {
      const absMax = Math.max(5, ...rows.map((r) => Math.abs(r.val)));
      const step = bm.unit === "Elo" ? 20 : 5;
      const bound = Math.ceil((absMax * 1.12) / step) * step;
      minV = -bound;
      maxV = bound;
    } else {
      const vals = rows.map((r) => r.val).concat(refVal !== null ? [refVal] : []);
      const hi = Math.max(...vals);
      const lo = Math.min(...vals);
      if (bm.unit === "Elo") {
        minV = Math.floor((lo - 40) / 50) * 50;
        maxV = Math.ceil((hi + 25) / 50) * 50;
      } else if (bm.unit === "K") {
        maxV = Math.max(256, Math.ceil(hi / 128) * 128);
      } else if (bm.unit === "GB") {
        maxV = Math.max(20, Math.ceil((hi + 10) / 20) * 20);
      } else {
        maxV = Math.min(100, Math.max(20, Math.ceil((hi + 5) / 10) * 10));
      }
    }

    const sx = (v) => pad.l + ((Math.max(minV, Math.min(maxV, v)) - minV) / Math.max(1, maxV - minV)) * pw;
    const zeroX = isDeltaMode ? sx(0) : pad.l;

    let refSvg = "";
    if (isDeltaMode) {
      refSvg += `<line x1="${zeroX.toFixed(1)}" y1="${pad.t - 4}" x2="${zeroX.toFixed(1)}" y2="${H - pad.b}" stroke="#00243d" stroke-width="1.4" stroke-dasharray="4 3"/>`;
      refSvg += `<text x="${zeroX.toFixed(1)}" y="${pad.t - 8}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#00243d">Baseline ${esc(getShortModelName(deltaRef))} (0)</text>`;
    } else if (refVal !== null && refVal >= minV && refVal <= maxV) {
      const rx = sx(refVal);
      const refColor = deltaRef.id.includes("1017") ? "#a33814" : "#00243d";
      refSvg += `<line x1="${rx.toFixed(1)}" y1="${pad.t - 4}" x2="${rx.toFixed(1)}" y2="${H - pad.b}" stroke="${refColor}" stroke-width="1.4" stroke-dasharray="4 3"/>`;
      refSvg += `<text x="${rx.toFixed(1)}" y="${pad.t - 8}" text-anchor="middle" font-size="10.5" font-weight="700" fill="${refColor}">${esc(getShortModelName(deltaRef))}: ${esc(formatMetricVal(refVal, bm.unit))}</text>`;
    }

    const barsSvg = rows
      .map((r, i) => {
        const y = pad.t + i * rowH;
        const barH = 15;
        const xEnd = sx(r.val);
        const bx = isDeltaMode ? Math.min(zeroX, xEnd) : pad.l;
        const bw = Math.max(3, Math.abs(xEnd - zeroX));
        const fill = isDeltaMode
          ? r.val >= 0
            ? "#065f46"
            : "#a33814"
          : r.m.archType === "MoE"
          ? "#15616d"
          : "#d97706";
        const valText = isDeltaMode
          ? `${r.val > 0 ? "+" : ""}${bm.unit === "Elo" ? Math.round(r.val) : r.val.toFixed(1)}${bm.unit === "Elo" ? " Elo" : " จุด"}`
          : formatMetricVal(r.val, bm.unit);
        const label = `${i + 1}. ${r.m.name.replace(" (2507)", "").replace("-Instruct", "")}`;
        const valX = isDeltaMode && r.val < 0 ? bx - 6 : bx + bw + 6;
        const valAnchor = isDeltaMode && r.val < 0 ? "end" : "start";
        const tip = `<strong>#${i + 1} ${esc(r.m.name)}</strong><br/>${esc(bm.label)}: <strong>${esc(
          formatMetricVal(r.raw, bm.unit)
        )}</strong>${isDeltaMode ? ` (${esc(valText)})` : ""}<br/>${esc(r.m.archType)} · ${r.m.q4DiskGb} GB · Context ${esc(
          r.m.context
        )} · Vision ${r.m.vision ? "Yes" : "No"}`;
        return `<g class="svg-interactive" tabindex="0" role="button" data-top-model-id="${esc(r.m.id)}" data-tip="${esc(tip)}">
          <text x="${pad.l - 8}" y="${y + 12}" text-anchor="end" font-size="11.2" font-weight="600" fill="#0f1f2b">${esc(label)}</text>
          <rect x="${bx.toFixed(1)}" y="${y + 1}" width="${bw.toFixed(1)}" height="${barH}" fill="${fill}" rx="1.5"/>
          <text x="${valX.toFixed(1)}" y="${y + 12}" text-anchor="${valAnchor}" font-size="10.8" font-weight="700" fill="#0f1f2b">${esc(valText)}</text>
        </g>`;
      })
      .join("");

    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(titleEl.textContent)}">
      <line x1="${pad.l}" y1="${pad.t - 2}" x2="${pad.l}" y2="${H - pad.b}" stroke="#b7c5ce" stroke-width="1"/>
      ${barsSvg}${refSvg}
    </svg>`;

    host.querySelectorAll("[data-top-model-id]").forEach((el) => {
      const mid = el.getAttribute("data-top-model-id");
      const openRow = () => {
        if (state.expandedIds.has(mid)) state.expandedIds.delete(mid);
        else state.expandedIds.add(mid);
        hideTooltip();
        renderMatrix();
      };
      el.addEventListener("mousemove", (e) => {
        const tip = el.getAttribute("data-tip");
        if (tip) showTooltip(e, tip);
      });
      el.addEventListener("mouseleave", hideTooltip);
      el.addEventListener("blur", hideTooltip);
      el.addEventListener("click", openRow);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          if (e.preventDefault) e.preventDefault();
          openRow();
        }
      });
    });
  }

  function resetFilters() {
    state.sizeCap = 350;
    state.archFilter = "all";
    state.visionFilter = "all";
    state.contextFilter = "all";
    state.applesOnly = false;
    state.query = "";
    state.preset = "all";
    document.getElementById("search-input").value = "";
    document.getElementById("apples-only-toggle").checked = false;
    syncMatrixControls();
    renderMatrix();
  }

  // --- Tab 2: Interactive Excel / Power BI Chart Builder ---
  function renderSlicerControls() {
    const chipHost = document.getElementById("model-slicer-chips");
    const visibleDefaultSet = new Set([
      ...INITIAL_SLICER_IDS,
      "inkling-2-small",
      "reflection-beam-501b",
      "ornith-1-0-397b",
      "qwen3-5-397b-a17b",
      "glm-4-7",
      "motif-3",
      "laguna-m-1",
      "kolibri-1",
      "ornith-1-5-35b-a3b",
      "inkling-2-mini",
      "flint-40b-a2-5b",
      "qwen3-vl-235b-a22b",
      "qwen3-next-80b-a3b-thinking",
      "seed-oss-36b-instruct",
      "magistral-small-2509",
      "qwen3-6-27b",
      "qwen3-5-35b-a3b",
      "step-3-5-flash",
      "qwen3-coder-next",
      "gemma-4-31b",
      "gemma-4-26b-a4b",
      "muse-glimmer-30b",
      "glm-4-7-flash",
      "mellum-2-1-12b",
      "gpt-oss-120b"
    ]);
    chipHost.innerHTML = ALL_MODELS.map((m) => {
      const sel = state.slicerIds.has(m.id);
      const hidden = !state.showAllChips && !visibleDefaultSet.has(m.id) && !sel;
      const dotColor = m.id.includes("1017")
        ? "#a33814"
        : m.id.includes("0731")
        ? "#00243d"
        : m.archType === "MoE"
        ? "#15616d"
        : "#d97706";
      const label = m.id.includes("1017") ? "1017 Base" : m.id.includes("0731") ? "0731 Base" : m.name.replace(" (276B)", "");
      return `<button type="button" class="model-chip ${sel ? "is-selected" : ""} ${hidden ? "is-hidden-chip" : ""}" aria-pressed="${
        sel ? "true" : "false"
      }" data-slicer-id="${esc(
        m.id
      )}"><span class="dot-ind" style="background:${sel ? "#ffecd1" : dotColor}"></span>${esc(label)} (${m.q4DiskGb}G)</button>`;
    }).join("");

    document.getElementById("slicer-count").textContent = String(state.slicerIds.size);
    document.getElementById("slicer-toggle-more").textContent = state.showAllChips
      ? "ย่อรายชื่อเหลือรุ่นหลัก ▴"
      : `ดูรายชื่อครบทั้ง ${ALL_MODELS.length} รุ่น ▾`;

    document.querySelectorAll("[data-slicer]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.slicer === state.slicerPreset);
    });

    // Line axis checkboxes
    document.getElementById("line-axis-checks").innerHTML = LINE_AXES_ALL.map(
      (ax) =>
        `<label class="axis-chk"><input type="checkbox" data-line-axis="${esc(ax.key)}" ${
          state.lineAxisKeys.has(ax.key) ? "checked" : ""
        }/><span>${esc(ax.label)}</span></label>`
    ).join("");
  }

  function applySlicerPreset(key) {
    state.slicerPreset = key;
    if (key === "top6") {
      state.slicerIds = new Set(INITIAL_SLICER_IDS);
    } else if (key === "vision160") {
      state.slicerIds = new Set([
        "deepseek-v4-flash-0731",
        ...DATA.candidates.filter((m) => m.vision && m.q4DiskGb < 160 && Object.values(m.codingScores).some((v) => v)).map((m) => m.id)
      ]);
    } else if (key === "dense") {
      state.slicerIds = new Set([
        "deepseek-v4-flash-0731",
        ...DATA.candidates.filter((m) => m.archType === "Dense" && Object.values(m.codingScores).some((v) => v)).map((m) => m.id)
      ]);
    } else if (key === "moe") {
      state.slicerIds = new Set([
        "deepseek-v4-1-flash-1017",
        "deepseek-v4-flash-0731",
        ...DATA.candidates.filter((m) => m.archType === "MoE" && m.q4DiskGb >= 114 && Object.values(m.codingScores).some((v) => v)).map((m) => m.id)
      ]);
    } else if (key === "all-scored") {
      state.slicerIds = new Set(ALL_MODELS.filter((m) => Object.values(m.codingScores || {}).some((v) => v)).map((m) => m.id));
    } else if (key === "clear") {
      state.slicerIds = new Set();
    }
    state.highlightedModelId = null;
    document.getElementById("clear-highlight-btn").hidden = true;
    renderSlicerControls();
    renderAllCharts();
  }

  function applyChartView() {
    const view = state.chartView;
    const lineCard = document.getElementById("line-chart-card");
    const dotCard = document.getElementById("dot-chart-card");
    const barCard = document.getElementById("bar-chart-card");

    lineCard.classList.toggle("is-hidden", view !== "all" && view !== "line");
    lineCard.classList.toggle("is-full", view === "all" || view === "line");
    barCard.classList.toggle("is-hidden", view !== "all" && view !== "bar");
    barCard.classList.toggle("is-full", view === "bar");
    dotCard.classList.toggle("is-hidden", view !== "all" && view !== "dot");
    dotCard.classList.toggle("is-full", view === "dot");

    document.querySelectorAll("[data-chart-view]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.chartView === view);
    });
  }

  function renderAllCharts() {
    hideTooltip();
    const activeBase = getActiveBaseline();
    const refLabel = document.getElementById("ref-primary-label");
    if (refLabel) refLabel.textContent = `เส้น Baseline (${getShortModelName(activeBase)})`;
    const ref0731Chk = document.getElementById("ref-0731-chk");
    const ref1017Chk = document.getElementById("ref-1017-chk");
    if (ref0731Chk) ref0731Chk.disabled = !state.baselineEnabled;
    if (ref1017Chk) ref1017Chk.disabled = !state.baselineEnabled;
    const selectedModels = ALL_MODELS.filter((m) => state.slicerIds.has(m.id));
    const colorMap = getModelColorMap(selectedModels);
    renderLineChart(selectedModels, colorMap);
    renderBarChart(selectedModels);
    renderDotChart(selectedModels);
  }

  function renderLineChart(models, colorMap) {
    const host = document.getElementById("line-chart");
    const legHost = document.getElementById("line-legend");
    const axes = LINE_AXES_ALL.filter((ax) => state.lineAxisKeys.has(ax.key));

    if (axes.length < 2 || models.length === 0) {
      legHost.innerHTML = "";
      host.innerHTML = `<div class="chart-empty">เลือกอย่างน้อย 1 โมเดล และ 2 ชุดทดสอบบนแกน X เพื่อวาดกราฟเส้น</div>`;
      return;
    }

    const plotted = models.filter((m) => axes.some((ax) => getMetricValue(m, ax.key) !== null));
    legHost.innerHTML = plotted
      .map((m) => {
        const c = colorMap[m.id];
        const isDashed = m.id.includes("1017");
        const isHl = state.highlightedModelId === m.id;
        const dim = state.highlightedModelId && !isHl ? "opacity:0.4;" : "";
        const label = m.id.includes("1017") ? "1017 Base" : m.id.includes("0731") ? "0731 Base" : `${m.name.replace(" (276B)", "")} (${m.q4DiskGb}G)`;
        return `<span class="line-leg-item ${isHl ? "is-hl" : ""}" style="${dim}" data-model-id="${esc(m.id)}">
          <span class="line-swatch ${isDashed ? "is-dashed" : ""}" style="color:${c}"></span>
          <strong>${esc(label)}</strong> [${esc(m.archType)}]
        </span>`;
      })
      .join("");
    attachChartInteractions(legHost);

    if (plotted.length === 0) {
      host.innerHTML = `<div class="chart-empty">โมเดลที่เลือกไม่มีผลคะแนนในชุดทดสอบแกน X ที่ติ๊กไว้</div>`;
      return;
    }

    const W = 1280;
    const H = 330;
    const pad = { l: 64, r: 76, t: 28, b: 44 };
    const pw = W - pad.l - pad.r;
    const ph = H - pad.t - pad.b;

    const sx = (idx) => pad.l + (idx / (axes.length - 1)) * pw;
    const sy = (val) => pad.t + ph - (Math.max(0, Math.min(100, val)) / 100) * ph;

    let gridSvg = "";
    [0, 20, 40, 60, 80, 100].forEach((tick) => {
      const y = sy(tick);
      gridSvg += `<line x1="${pad.l}" y1="${y.toFixed(1)}" x2="${W - pad.r}" y2="${y.toFixed(1)}" stroke="#dce4e9"/>`;
      gridSvg += `<text x="${pad.l - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11.5" fill="#526777">${tick}%</text>`;
    });

    axes.forEach((ax, idx) => {
      const x = sx(idx);
      gridSvg += `<line x1="${x.toFixed(1)}" y1="${pad.t}" x2="${x.toFixed(1)}" y2="${H - pad.b}" stroke="#edf1f4"/>`;
      gridSvg += `<text x="${x.toFixed(1)}" y="${H - pad.b + 22}" text-anchor="middle" font-size="12" font-weight="700" fill="#00243d">${esc(ax.label)}</text>`;
    });

    const colEntries = axes.map(() => []);
    let pathsSvg = "";
    let markersSvg = "";

    plotted.forEach((m) => {
      const c = colorMap[m.id];
      const isDashed = m.id.includes("1017");
      const isHl = state.highlightedModelId === m.id;
      const op = state.highlightedModelId ? (isHl ? 1 : 0.18) : 0.95;
      const w = isHl ? 3.8 : m.id.includes("0731") ? 3.0 : 2.4;

      const pts = axes.map((ax, idx) => {
        const sc = m.codingScores?.[ax.key];
        const val = sc && sc.value != null ? Number(sc.value) : null;
        return val === null ? null : { idx, x: sx(idx), y: sy(val), val, axLabel: ax.label, src: sc.source };
      });

      // Strictly connect ONLY contiguous measured segments — NO dotted cross-gap bridges!
      let seg = [];
      const flushSeg = () => {
        if (seg.length > 1) {
          const d = seg.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
          pathsSvg += `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${op}" ${
            isDashed ? 'stroke-dasharray="7 5"' : ""
          } stroke-linejoin="round" stroke-linecap="round"/>`;
        }
        seg = [];
      };
      pts.forEach((pt) => {
        if (pt) seg.push(pt);
        else flushSeg();
      });
      flushSeg();

      pts.forEach((pt) => {
        if (!pt) return;
        const tip = `<strong>${esc(m.name)}</strong><br/>${esc(pt.axLabel)}: <strong>${pt.val.toFixed(1)}%</strong><br/>${esc(
          m.archType
        )} · ${m.q4DiskGb} GB · Context: ${esc(m.context)} · Vision: ${m.vision ? "Yes" : "No"}<br/>ที่มา: ${esc(pt.src)}`;
        markersSvg += `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="${isHl ? 6.5 : 5}" fill="${c}" stroke="#ffffff" stroke-width="2" opacity="${op}" data-model-id="${esc(
          m.id
        )}" data-tip="${esc(tip)}"></circle>`;
        colEntries[pt.idx].push({ pt, color: c, op, showLabel: !state.highlightedModelId || isHl });
      });
    });

    const placedLabels = [];
    const minGap = 13.5;
    colEntries.forEach((items, colIdx) => {
      const visibleItems = items.filter((it) => it.showLabel);
      if (visibleItems.length === 0) return;
      visibleItems.sort((a, b) => a.pt.y - b.pt.y);
      const ys = visibleItems.map((it) => Math.max(pad.t + 10, it.pt.y - 6));
      for (let i = 1; i < ys.length; i++) {
        if (ys[i] < ys[i - 1] + minGap) ys[i] = ys[i - 1] + minGap;
      }
      const bottomLimit = H - pad.b - 6;
      if (ys[ys.length - 1] > bottomLimit) {
        ys[ys.length - 1] = bottomLimit;
        for (let i = ys.length - 2; i >= 0; i--) {
          if (ys[i] > ys[i + 1] - minGap) ys[i] = ys[i + 1] - minGap;
        }
      }
      visibleItems.forEach((it, i) => {
        const lx = colIdx === axes.length - 1 ? it.pt.x - 9 : it.pt.x + 8;
        const anchor = colIdx === axes.length - 1 ? "end" : "start";
        placedLabels.push(
          `<text x="${lx.toFixed(1)}" y="${ys[i].toFixed(1)}" text-anchor="${anchor}" font-size="11" font-weight="700" fill="${
            it.color
          }" opacity="${it.op}" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${it.pt.val.toFixed(1)}%</text>`
        );
      });
    });

    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Interactive coding profile line chart">
      ${gridSvg}
      <line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#00243d" stroke-width="1.3"/>
      <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H - pad.b}" stroke="#00243d" stroke-width="1.3"/>
      ${pathsSvg}${markersSvg}${placedLabels.join("")}
    </svg>`;
    attachChartInteractions(host);
  }

  function renderBarChart(models) {
    const host = document.getElementById("bar-chart");
    const bm = getBenchMeta(state.barMetric);
    const activeBase = getActiveBaseline();
    document.getElementById("bar-title").textContent = `กราฟแท่ง (Bar Chart): ${bm.label}`;

    const rows = models
      .filter((m) => !DATA.baselines.some((b) => b.id === m.id) && (!state.baselineEnabled || m.id !== activeBase.id))
      .map((m) => ({ m, val: getMetricValue(m, bm.key) }))
      .filter((r) => r.val !== null);

    if (state.barSort === "desc") rows.sort((a, b) => b.val - a.val);
    else if (state.barSort === "asc") rows.sort((a, b) => a.val - b.val);
    else rows.sort((a, b) => a.m.q4DiskGb - b.m.q4DiskGb);

    if (rows.length === 0) {
      host.innerHTML = `<div class="chart-empty">ไม่มีโมเดลที่มีคะแนนในชุด ${esc(bm.label)} จากกลุ่มที่เลือก</div>`;
      return;
    }

    const vPrimary = state.baselineEnabled && state.showRef0731 ? getMetricValue(activeBase, bm.key) : null;
    const v1017 =
      state.baselineEnabled && state.showRef1017 && activeBase.id !== DATA.baselines[0].id
        ? getMetricValue(DATA.baselines[0], bm.key)
        : null;

    const W = 640;
    const rowH = 31;
    const pad = { l: 175, r: 95, t: 30, b: 30 };
    const H = pad.t + pad.b + rows.length * rowH;
    const pw = W - pad.l - pad.r;

    const allVals = rows.map((r) => r.val);
    if (vPrimary !== null) allVals.push(vPrimary);
    if (v1017 !== null) allVals.push(v1017);

    const minX = bm.unit === "Elo" ? Math.floor((Math.min(...allVals) - 40) / 50) * 50 : 0;
    const maxVal = Math.max(...allVals);
    const maxX =
      bm.unit === "Elo"
        ? Math.ceil((maxVal + 30) / 50) * 50
        : bm.unit === "GB"
        ? Math.ceil((maxVal + 20) / 50) * 50
        : bm.unit === "K"
        ? Math.ceil((maxVal + 50) / 100) * 100
        : Math.min(100, Math.ceil((maxVal + 6) / 10) * 10);

    const sx = (v) => pad.l + ((v - minX) / Math.max(1, maxX - minX)) * pw;

    let refLines = "";
    if (vPrimary !== null) {
      const x = sx(vPrimary);
      refLines += `<line x1="${x.toFixed(1)}" y1="${pad.t - 6}" x2="${x.toFixed(1)}" y2="${H - pad.b}" stroke="#00243d" stroke-width="1.6" stroke-dasharray="4 3"/>`;
      refLines += `<text x="${x.toFixed(1)}" y="${pad.t - 11}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#00243d">${esc(
        getShortModelName(activeBase)
      )} (${formatMetricVal(vPrimary, bm.unit)})</text>`;
    }
    if (v1017 !== null) {
      const x = sx(v1017);
      refLines += `<line x1="${x.toFixed(1)}" y1="${pad.t - 6}" x2="${x.toFixed(1)}" y2="${H - pad.b}" stroke="#a33814" stroke-width="1.6" stroke-dasharray="2 2"/>`;
      refLines += `<text x="${x.toFixed(1)}" y="${H - 8}" text-anchor="middle" font-size="10.5" font-weight="700" fill="#a33814">1017 (${formatMetricVal(v1017, bm.unit)})</text>`;
    }

    const barsSvg = rows
      .map((r, i) => {
        const m = r.m;
        const y = pad.t + i * rowH + 4;
        const bw = Math.max(2, sx(r.val) - pad.l);
        const color = m.archType === "MoE" ? "#15616d" : "#d97706";
        const isHl = state.highlightedModelId === m.id;
        const op = state.highlightedModelId ? (isHl ? 1 : 0.25) : 1;
        const src = bm.key === "q4DiskGb" ? "Q4 GGUF/FP4 Size" : bm.key === "contextK" ? "Max Context Window" : m.codingScores?.[bm.key]?.source || "";
        const tip = `<strong>${esc(m.name)}</strong><br/>${esc(bm.label)}: <strong>${formatMetricVal(r.val, bm.unit)}</strong><br/>${esc(
          m.archType
        )} · ${m.q4DiskGb} GB · Context: ${esc(m.context)} · Vision: ${m.vision ? "Yes" : "No"}<br/>ที่มา: ${esc(src)}`;
        return `<g opacity="${op}" data-model-id="${esc(m.id)}" data-tip="${esc(tip)}">
          <text x="${pad.l - 8}" y="${y + 13}" text-anchor="end" font-size="11.5" font-weight="600" fill="#0f1f2b">${esc(
          m.name.replace(" (276B)", "")
        )} (${m.q4DiskGb}G)</text>
          <rect x="${pad.l}" y="${y}" width="${bw.toFixed(1)}" height="19" fill="${color}" stroke="${isHl ? "#00243d" : "none"}" stroke-width="${
          isHl ? 2 : 0
        }"/>
          <text x="${(pad.l + bw + 6).toFixed(1)}" y="${y + 13}" font-size="11.5" font-weight="700" fill="#00243d" stroke="#ffffff" stroke-width="3.5" paint-order="stroke">${formatMetricVal(
          r.val,
          bm.unit
        )} [${m.archType}/${m.vision ? "Vis" : "Txt"}]</text>
        </g>`;
      })
      .join("");

    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Interactive ranking bar chart">
      <line x1="${pad.l}" y1="${pad.t - 4}" x2="${pad.l}" y2="${H - pad.b}" stroke="#00243d" stroke-width="1.2"/>
      ${refLines}${barsSvg}
    </svg>`;
    attachChartInteractions(host);
  }

  function renderDotChart(models) {
    const host = document.getElementById("scatter-chart");
    const bm = getBenchMeta(state.dotY);
    const xKey = state.dotX;
    const activeBase = getActiveBaseline();
    const xLabel =
      xKey === "q4DiskGb"
        ? "ขนาดไฟล์ Q4 (GB)"
        : xKey === "contextK"
        ? "Context Window (Tokens)"
        : "Active Parameters (B)";
    document.getElementById("scatter-title").textContent = `กราฟจุด (Dot Graph): ${xLabel} vs ${bm.label}`;

    const points = models
      .filter((m) => !(xKey === "q4DiskGb" && m.id.includes("1017"))) // 500.7G is out of 200G plot scale
      .map((m) => ({
        m,
        xVal: xKey === "q4DiskGb" ? m.q4DiskGb : xKey === "contextK" ? parseContextK(m.context) : m.activeParamsB,
        yVal: getMetricValue(m, bm.key)
      }))
      .filter((p) => p.xVal !== null && p.yVal !== null);

    if (points.length === 0) {
      host.innerHTML = `<div class="chart-empty">ไม่มีข้อมูลคะแนนสำหรับ ${esc(bm.label)} จากกลุ่มที่เลือก</div>`;
      return;
    }

    const W = 640;
    const H = 350;
    const pad = { l: 54, r: 34, t: 30, b: 46 };
    const pw = W - pad.l - pad.r;
    const ph = H - pad.t - pad.b;

    const maxX =
      xKey === "q4DiskGb"
        ? Math.max(210, Math.ceil((Math.max(...points.map((p) => p.xVal)) + 15) / 50) * 50)
        : xKey === "contextK"
        ? 1050
        : Math.ceil((Math.max(...points.map((p) => p.xVal)) + 4) / 5) * 5;
    const v1017 = state.baselineEnabled ? getMetricValue(DATA.baselines[0], bm.key) : null;
    const vals = points.map((p) => p.yVal).concat(v1017 !== null && state.showRef1017 ? [v1017] : []);
    const rawMin = Math.min(...vals);
    const rawMax = Math.max(...vals);
    const minY = bm.unit === "Elo" ? Math.floor((rawMin - 30) / 20) * 20 : Math.max(0, Math.floor((rawMin - 8) / 5) * 5);
    const maxY =
      bm.unit === "Elo"
        ? Math.ceil((rawMax + 25) / 20) * 20
        : bm.unit === "GB"
        ? Math.ceil((rawMax + 15) / 20) * 20
        : Math.min(100, Math.ceil((rawMax + 6) / 5) * 5);

    const sx = (x) => pad.l + (Math.min(x, maxX) / maxX) * pw;
    const sy = (y) => pad.t + ph - ((y - minY) / Math.max(1, maxY - minY)) * ph;

    let gridSvg = "";
    for (let i = 0; i <= 5; i++) {
      const v = minY + ((maxY - minY) * i) / 5;
      const y = sy(v);
      gridSvg += `<line x1="${pad.l}" y1="${y.toFixed(1)}" x2="${W - pad.r}" y2="${y.toFixed(1)}" stroke="#dce4e9"/>`;
      const lbl = bm.unit === "Elo" ? Math.round(v) : bm.unit === "GB" ? Math.round(v) + "G" : v.toFixed(0) + "%";
      gridSvg += `<text x="${pad.l - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11.5" fill="#526777">${lbl}</text>`;
    }

    const xTicks =
      xKey === "q4DiskGb"
        ? maxX > 250
          ? [0, 70, 140, 210, 280, 350]
          : [0, 40, 80, 120, 160, 200]
        : xKey === "contextK"
        ? [0, 128, 256, 512, 1000]
        : [0, Math.round(maxX * 0.25), Math.round(maxX * 0.5), Math.round(maxX * 0.75), maxX];
    xTicks.forEach((xt) => {
      const x = sx(xt);
      const xtLbl =
        xKey === "q4DiskGb" ? `${xt}G` : xKey === "contextK" ? (xt === 0 ? "0" : formatMetricVal(xt, "K")) : `${xt}B`;
      gridSvg += `<line x1="${x.toFixed(1)}" y1="${pad.t}" x2="${x.toFixed(1)}" y2="${H - pad.b}" stroke="#edf1f4"/>`;
      gridSvg += `<text x="${x.toFixed(1)}" y="${H - pad.b + 16}" text-anchor="middle" font-size="11.5" fill="#526777">${xtLbl}</text>`;
    });

    let refSvg = "";
    if (state.baselineEnabled && xKey === "q4DiskGb" && state.showRef0731 && activeBase.q4DiskGb <= maxX) {
      const xRef = sx(activeBase.q4DiskGb);
      refSvg += `<line x1="${xRef.toFixed(1)}" y1="${pad.t}" x2="${xRef.toFixed(1)}" y2="${H - pad.b}" stroke="#a33814" stroke-width="1.5" stroke-dasharray="5 4"/>`;
      refSvg += `<text x="${Math.max(pad.l + 4, xRef - 5)}" y="${pad.t + 12}" text-anchor="${xRef < pad.l + 95 ? "start" : "end"}" font-size="11" font-weight="700" fill="#a33814">เกณฑ์ ${esc(
        getShortModelName(activeBase)
      )} (${activeBase.q4DiskGb} GB)</text>`;
    }
    if (v1017 !== null && state.showRef1017) {
      const y1017 = sy(v1017);
      refSvg += `<line x1="${pad.l}" y1="${y1017.toFixed(1)}" x2="${W - pad.r}" y2="${y1017.toFixed(1)}" stroke="#00243d" stroke-width="1.4" stroke-dasharray="3 3"/>`;
      refSvg += `<text x="${W - pad.r - 4}" y="${y1017 - 5}" text-anchor="end" font-size="11" font-weight="700" fill="#00243d">1017 เพดาน (500.7G): ${formatMetricVal(v1017, bm.unit)}</text>`;
    }

    const sortedPts = [...points].sort((a, b) => a.xVal - b.xVal || b.yVal - a.yVal);
    const placedBoxes = [];
    const ptsSvg = sortedPts
      .map((p) => {
        const m = p.m;
        const cx = sx(p.xVal);
        const cy = sy(p.yVal);
        const isBase = m.id.includes("0731") || m.id.includes("1017");
        const stroke = m.id.includes("1017") ? "#a33814" : m.id.includes("0731") ? "#00243d" : m.archType === "MoE" ? "#15616d" : "#d97706";
        const fill = m.vision ? stroke : "#ffffff";
        const isHl = state.highlightedModelId === m.id;
        const op = state.highlightedModelId ? (isHl ? 1 : 0.22) : 1;
        const shortLabel = m.id.includes("0731") ? "0731 (Base)" : m.id.includes("1017") ? "1017 (Base)" : m.name.replace(" (2507)", "").replace(" (276B)", "").replace(" Instruct", "").replace("-Instruct", "");

        const labelW = shortLabel.length * 6.4 + 8;
        let anchor = "start";
        let lx = cx + 8;
        if (cx + 8 + labelW > W - 12 || (xKey === "q4DiskGb" && p.xVal >= 150 && p.xVal <= 159)) {
          anchor = "end";
          lx = cx - 8;
        }
        if (m.id.includes("0731")) {
          anchor = "start";
          lx = cx + 9;
        }
        const bxStart = anchor === "start" ? lx : lx - labelW;
        const bxEnd = anchor === "start" ? lx + labelW : lx;
        let ly = m.id.includes("0731") ? cy + 12 : cy + 3;
        for (let step = 0; step < 10; step++) {
          const hit = placedBoxes.some((b) => !(bxEnd < b.x1 || bxStart > b.x2) && Math.abs(ly - b.y) < 13);
          if (!hit) break;
          ly += step % 2 === 0 ? 13 : -14 * Math.ceil(step / 2);
        }
        ly = Math.max(pad.t + 12, Math.min(H - pad.b - 6, ly));
        placedBoxes.push({ x1: bxStart, x2: bxEnd, y: ly });

        const tipXVal = xKey === "contextK" ? formatMetricVal(p.xVal, "K") : p.xVal;
        const tip = `<strong>${esc(m.name)}</strong><br/>${esc(xLabel)}: ${tipXVal} · ${esc(bm.label)}: <strong>${formatMetricVal(
          p.yVal,
          bm.unit
        )}</strong><br/>${esc(m.archType)} · Context: ${esc(m.context)} · Vision: ${m.vision ? "Yes" : "No"}`;
        return `<g opacity="${op}" data-model-id="${esc(m.id)}" data-tip="${esc(tip)}">
          <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${isHl ? 8 : isBase ? 6.5 : 5.5}" fill="${fill}" stroke="${stroke}" stroke-width="${
          isHl ? 3 : 2.2
        }"></circle>
          <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${anchor}" font-size="10.8" font-weight="${isBase || isHl ? "700" : "600"}" fill="${
          isBase ? "#a33814" : "#0f1f2b"
        }" stroke="#ffffff" stroke-width="3" paint-order="stroke">${esc(shortLabel)}</text>
        </g>`;
      })
      .join("");

    host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Interactive scatter dot chart">
      ${gridSvg}
      <line x1="${pad.l}" y1="${H - pad.b}" x2="${W - pad.r}" y2="${H - pad.b}" stroke="#00243d" stroke-width="1.2"/>
      <line x1="${pad.l}" y1="${pad.t}" x2="${pad.l}" y2="${H - pad.b}" stroke="#00243d" stroke-width="1.2"/>
      ${refSvg}${ptsSvg}
      <text x="${pad.l + pw / 2}" y="${H - 8}" text-anchor="middle" font-size="11.5" font-weight="600" fill="#324656">${esc(xLabel)}</text>
    </svg>`;
    attachChartInteractions(host);
  }

  // --- Hero 5-Second Verdict Cards ---
  function renderHeroCards() {
    const host = document.getElementById("bluf-grid");
    const byId = (id) => ALL_MODELS.find((m) => m.id === id);
    const b0731 = DATA.baselines[1];
    const qwen = byId("qwen3-8-27b");
    const step = byId("step-3-7-flash");
    const inkling = byId("inkling-small-276b");
    const mimo = byId("mimo-v2-6-flash");
    const glm = byId("glm-5-3-flash");
    if (!host || !b0731 || !qwen || !step || !inkling || !mimo || !glm) return;

    const bSwe = getMetricValue(b0731, "swePro");
    const qwenSwe = getMetricValue(qwen, "swePro");
    const qwenRatio = (b0731.q4DiskGb / qwen.q4DiskGb).toFixed(1);
    const qwenSweDiff = (qwenSwe - bSwe).toFixed(1);
    const stepSwe = getMetricValue(step, "swePro");
    const inkSwe = getMetricValue(inkling, "swePro");

    host.innerHTML = `
      <article class="bluf-card">
        <div class="bluf-head">
          <h2 class="bluf-model">${esc(qwen.name)}</h2>
          <span class="bluf-tier">#1 DENSE ${Number(qwen.q4DiskGb).toFixed(1)}G · Vision ${qwen.vision ? "Yes" : "No"}</span>
        </div>
        <div class="bluf-metric-row">
          <span class="m-pill win">SWE-Pro ${esc(formatMetricVal(qwenSwe, "%"))} (${qwenSwe >= bSwe ? "+" : ""}${qwenSweDiff})</span>
          <span class="m-pill">LCB ${esc(formatMetricVal(getMetricValue(qwen, "liveCodeBench"), "%"))}</span>
          <span class="m-pill warn">⚠ TB 4.0 ${esc(formatMetricVal(getMetricValue(qwen, "terminalBench4"), "%"))}</span>
        </div>
        <p class="bluf-say">เล็กกว่า 0731 ถึง ${qwenRatio}× แต่ชนะ SWE-Pro และรับภาพ UI ได้ (ระวังงาน CLI ลึก)</p>
      </article>

      <article class="bluf-card is-moe">
        <div class="bluf-head">
          <h2 class="bluf-model">Step-3.7 (${Math.round(step.q4DiskGb)}G) / Inkling (${Math.round(inkling.q4DiskGb)}G)</h2>
          <span class="bluf-tier">#2 MOE &lt;160G · Vision ${step.vision && inkling.vision ? "Yes" : "No"}</span>
        </div>
        <div class="bluf-metric-row">
          <span class="m-pill win">SWE-Pro ${esc(formatMetricVal(stepSwe, "%"))} / ${esc(formatMetricVal(inkSwe, "%"))}</span>
          <span class="m-pill">LCB ${esc(formatMetricVal(getMetricValue(inkling, "liveCodeBench"), "%"))}</span>
          <span class="m-pill warn">⚠ TB 4.0 ${esc(formatMetricVal(getMetricValue(inkling, "terminalBench4"), "%"))}</span>
        </div>
        <p class="bluf-say">สาย MoE เล็กกว่า 0731 ทั้งคู่ รับภาพครบ ชนะ 0731 บน SWE-Pro (+${(stepSwe - bSwe).toFixed(1)} / +${(inkSwe - bSwe).toFixed(1)} จุด)</p>
      </article>

      <article class="bluf-card is-upper">
        <div class="bluf-head">
          <h2 class="bluf-model">MiMo-V2.6 (V) / GLM-5.3 (T)</h2>
          <span class="bluf-tier">#3 ขอบบน ${Math.round(mimo.q4DiskGb)}–${Math.round(glm.q4DiskGb)}G · AGENT/CLI</span>
        </div>
        <div class="bluf-metric-row">
          <span class="m-pill win">DeepSWE ${esc(formatMetricVal(getMetricValue(mimo, "deepSwe"), "%"))}</span>
          <span class="m-pill win">TB 4.0 ${esc(formatMetricVal(getMetricValue(glm, "terminalBench4"), "%"))}</span>
          <span class="m-pill warn">${glm.vision ? "GLM รับภาพได้" : "GLM ไม่รับภาพ"}</span>
        </div>
        <p class="bluf-say">เก่งใกล้ 1017 ที่สุดในช่วง ${Math.round(mimo.q4DiskGb)}–${Math.round(glm.q4DiskGb)} GB (MiMo รับภาพได้ · GLM เด่น CLI)</p>
      </article>`;
  }

  // --- Tab 3: Scannable Cards (Option B) + Dual Baselines + Glossary ---
  const SCANNABLE_CARDS = [
    {
      id: "qwen3-8-27b",
      tierCls: "is-dense",
      say: "ตัวจริงอันดับ 1 สายเบา ใส่ภาพ UI ได้ แต่ระวังงาน CLI ลึก (Terminal-Bench 4.0 = 5.6%)",
      bars: [
        { key: "swePro", label: "SWE-bench Pro" },
        { key: "liveCodeBench", label: "LiveCodeBench (Vals)" },
        { key: "deepSwe", label: "DeepSWE v1.1" }
      ]
    },
    {
      id: "qwen3-6-27b",
      tierCls: "is-dense",
      say: "ตัวสำรองสาย Dense ที่มีผล SWE Verified ทางการ (77.2%) และชนะ 0731 บน SWE-Pro เล็กน้อย",
      bars: [
        { key: "swePro", label: "SWE-bench Pro" },
        { key: "liveCodeBench", label: "LiveCodeBench v6" },
        { key: "sweVerified", label: "SWE Verified" }
      ]
    },
    {
      id: "gemma-4-31b",
      tierCls: "is-dense",
      say: "เก่งอัลกอริทึมเดี่ยว (LCB 80.0%) แต่แก้ Repo หลายไฟล์ (SWE-Pro 35.7%) ตามหลัง Qwen3.8-27B",
      bars: [
        { key: "swePro", label: "SWE-bench Pro" },
        { key: "liveCodeBench", label: "LiveCodeBench v6" }
      ]
    },
    {
      id: "muse-glimmer-30b",
      tierCls: "is-dense",
      say: "Dense 29.6B จาก Meta (Apache-2.0) ใส่ภาพได้ ทำ SWE-Pro 51.2% และ SWE Verified 76.0% ในขนาด 18.5 GB",
      bars: [
        { key: "swePro", label: "SWE-bench Pro" },
        { key: "sweVerified", label: "SWE Verified" }
      ]
    },
    {
      id: "step-3-7-flash",
      tierCls: "",
      say: "อันดับ 3 บน SWE-Pro รองจาก Qwen3.8-27B และ Ornith-1.5 (ลดขนาดจาก 0731 ลง 45 GB) รองรับ Vision 1.8B ViT ครบ",
      bars: [
        { key: "swePro", label: "SWE-bench Pro" },
        { key: "sweVerified", label: "SWE Verified" }
      ]
    },
    {
      id: "ornith-1-5-35b-a3b",
      tierCls: "",
      say: "MoE 35B/3B (MIT · 21.5 GB) ทำ SWE-Pro 59.6% (+7.0 จุดเหนือ 0731) และ SWE Verified 79.0% พร้อม Context สูงสุด 1M",
      bars: [
        { key: "swePro", label: "SWE-bench Pro" },
        { key: "sweVerified", label: "SWE Verified" }
      ]
    },
    {
      id: "inkling-2-mini",
      tierCls: "",
      say: "Looped MoE 26.4B/5.4B eff. (19.5 GB · Vision Yes · 1M) ทำ DeepSWE 48.2% (#1 <100B), FrontierCode 15.1% และ SWE Verified 79.2% ชนะ 0731",
      bars: [
        { key: "sweVerified", label: "SWE Verified" },
        { key: "deepSwe", label: "DeepSWE v1.1" },
        { key: "frontierCode2", label: "FrontierCode 2.0" }
      ]
    },
    {
      id: "flint-40b-a2-5b",
      tierCls: "",
      say: "MoE สาย Agent 39.8B/2.5B (23.4 GB · 262K · Text-only) ทำ LiveCodeBench v6 80.3% และ SWE Verified 74.2% พร้อมความเร็วรันสูง",
      bars: [
        { key: "liveCodeBench", label: "LiveCodeBench v6" },
        { key: "sweVerified", label: "SWE Verified" }
      ]
    },
    {
      id: "inkling-small-276b",
      tierCls: "",
      say: "เด่น SWE Verified (80.2%) + LCB (85.9%) แต่รุ่นฐานได้ Terminal-Bench 4.0 เพียง 0.9%",
      bars: [
        { key: "swePro", label: "SWE-bench Pro" },
        { key: "liveCodeBench", label: "LiveCodeBench (Vals)" },
        { key: "sweVerified", label: "SWE Verified" }
      ]
    },
    {
      id: "mimo-v2-6-flash",
      tierCls: "is-upper",
      say: "ช่วง 172 GB (Omni Vision: Yes) ทำ DeepSWE 67.9% (+13.5 จุดเหนือ 0731) และ FrontierCode 21.6%",
      bars: [
        { key: "deepSwe", label: "DeepSWE v1.1" },
        { key: "terminalBench4", label: "Terminal-Bench 4.0" }
      ]
    },
    {
      id: "glm-5-3-flash",
      tierCls: "is-upper",
      say: "ช่วง 180 GB (Text-only) เด่น Terminal-Bench 4.0 ที่ 32.8% เกือบเท่า 1017 (33.8%) แต่ไม่รับภาพ",
      bars: [
        { key: "liveCodeBench", label: "LiveCodeBench (Vals)" },
        { key: "terminalBench4", label: "Terminal-Bench 4.0" }
      ]
    }
  ];

  function renderScannableCards() {
    const activeBase = getActiveBaseline();
    const baseShort = getShortModelName(activeBase);
    const cardsTakeaway = document.getElementById("cards-takeaway");
    if (cardsTakeaway) {
      cardsTakeaway.innerHTML = state.baselineEnabled
        ? `<div><strong>วิธีสแกนหน้านี้ใน 30 วินาที:</strong> เส้นขีดสีดำบนหลอดคะแนนคือระดับของ <strong>Baseline ${esc(
            baseShort
          )}</strong> · ด้านล่างสุดมีคำอธิบายว่าทำไมคะแนน TB 4.0 ถึงต่ำกว่า LiveCodeBench</div>`
        : `<div><strong>วิธีสแกนหน้านี้ใน 30 วินาที:</strong> โหมดปิด Baseline (แสดงคะแนนดิบของแต่ละรุ่น) · เปิดสวิตช์ Baseline ด้านบนเมื่อต้องการเทียบส่วนต่าง</div>`;
    }
    const host = document.getElementById("scannable-cards-grid");
    const list = SCANNABLE_CARDS.map((cfg) => ({ cfg, m: ALL_MODELS.find((x) => x.id === cfg.id) })).filter((x) => {
      if (!x.m) return false;
      if (state.cardFilter === "vision") return x.m.vision;
      if (state.cardFilter === "Dense" || state.cardFilter === "MoE") return x.m.archType === state.cardFilter;
      return true;
    });

    host.innerHTML = list
      .map(({ cfg, m }) => {
        const fillCls = cfg.tierCls;
        const barsHtml = cfg.bars
          .map((b) => {
            const val = m.codingScores?.[b.key]?.value;
            if (val == null) return "";
            const refVal = state.baselineEnabled ? activeBase.codingScores?.[b.key]?.value ?? null : null;
            const diffTxt =
              refVal !== null
                ? ` (${val - refVal >= 0 ? "+" : ""}${(val - refVal).toFixed(1)} จุด vs ${esc(baseShort)})`
                : "";
            const tickHtml =
              refVal !== null
                ? `<div class="sc-tick" style="left:${Math.min(100, refVal)}%" title="Baseline ${esc(baseShort)}: ${refVal.toFixed(1)}%"></div>`
                : "";
            return `<div>
              <div class="sc-bar-lbl"><span>${esc(b.label)}</span><code>${val.toFixed(1)}%${diffTxt}</code></div>
              <div class="sc-track"><div class="sc-fill ${fillCls}" style="width:${Math.min(100, val)}%"></div>${tickHtml}</div>
            </div>`;
          })
          .join("");

        return `<article class="sc-card ${cfg.tierCls}">
          <div class="sc-top">
            <div><h3 class="sc-title">${esc(m.name)}</h3><div class="sc-sub">${esc(m.vendor)} · ${esc(m.license)} · ${m.q4DiskGb} GB Q4 · Context ${esc(m.context)}</div></div>
            <div class="sc-tags">
              <span class="pill ${m.archType === "MoE" ? "pill-moe" : "pill-dense"}">${esc(m.archType)}</span>
              <span class="pill ${m.vision ? "pill-vision-yes" : "pill-vision-no"}">Vision: ${m.vision ? "Yes" : "No"}</span>
            </div>
          </div>
          <div class="sc-bars">${barsHtml}</div>
          <div class="sc-say"><strong>พรีเซนต์:</strong> ${esc(cfg.say)}</div>
        </article>`;
      })
      .join("");
  }

  function renderBaselinesAndGlossary() {
    document.getElementById("baseline-grid").innerHTML = DATA.baselines
      .map((b, idx) => {
        const is0731 = idx === 1;
        const chips = DATA.benchmarks
          .map((bm) => {
            const sc = b.codingScores?.[bm.key];
            if (!sc) return null;
            return `<span class="score-chip">${esc(bm.shortLabel)}: <strong>${esc(formatMetricVal(sc.value, bm.unit))}</strong>${
              sc.labelSuffix ? ` (${esc(sc.labelSuffix)})` : ""
            }</span>`;
          })
          .filter(Boolean)
          .join("");
        return `<article class="baseline-card ${is0731 ? "is-0731" : ""}">
          <div class="base-head">
            <div><h3 class="base-name">${esc(b.name)}</h3><p class="base-sub">${esc(b.shortName)} · ${esc(b.license)} · ${esc(b.release)}</p></div>
            <span class="base-tag">${is0731 ? "Baseline 0731" : "Baseline 1017"}</span>
          </div>
          <div class="base-specs">
            <div class="spec-box"><div class="spec-k">สถาปัตยกรรม</div><div class="spec-v">${esc(b.archType)}</div></div>
            <div class="spec-box"><div class="spec-k">พารามิเตอร์</div><div class="spec-v">${b.totalParamsB}B / ${b.activeParamsB}B</div></div>
            <div class="spec-box"><div class="spec-k">ขนาด Q4</div><div class="spec-v">${b.q4DiskGb} GB</div></div>
            <div class="spec-box"><div class="spec-k">Context</div><div class="spec-v">${esc(b.context)}</div></div>
            <div class="spec-box"><div class="spec-k">ใส่ภาพ (Vision)</div><div class="spec-v">${b.vision ? "Yes" : "No"}</div></div>
          </div>
          <div class="base-scores">${chips}</div>
          <p class="base-note">${esc(b.roleSummary)}</p>
        </article>`;
      })
      .join("");

    document.getElementById("glossary-grid").innerHTML = [
      { t: "SWE-bench Pro vs Verified", d: "Pro (1,865 ข้อหลายภาษา/private repo) ทนการท่องจำข้อสอบได้ดีที่สุด ส่วน Verified (500 ข้อ Python) มีความเสี่ยงปนเปื้อนสูง และ 1017 รายงานเฉพาะ subset 97/99 ข้อ" },
      { t: "ทำไม TB 4.0 คะแนนต่ำกว่า LCB มาก", d: "Terminal-Bench 4.0 วัดงาน CLI/DevOps ระดับยากในสภาพแวดล้อมจริง คะแนน Open-weight จึงอยู่ช่วง 0.9%–33.8% (ห้ามนำไปปนกับ TB v2.1 ที่อยู่ ~70–90%)" },
      { t: "DeepSWE & FrontierCode 2.0", d: "DeepSWE วัดงานแก้บั๊กแบบ Agent หลายขั้นตอน ส่วน FrontierCode 2.0 เป็นชุดปิด 132 งานที่ Artificial Analysis ตรวจระดับ PR จริง" }
    ]
      .map((g) => `<article class="gloss-card"><h3>${esc(g.t)}</h3><p>${esc(g.d)}</p></article>`)
      .join("");
  }

  function renderGroups() {
    const grouped = Object.fromEntries(MODEL_GROUPS.map((g) => [g.key, []]));
    DATA.candidates.forEach((m) => grouped[classifyModelGroup(m)].push(m));

    const rankScore = (m) => {
      const s = m.codingScores || {};
      return (
        (s.swePro?.value ?? 0) * 1.4 +
        (s.deepSwe?.value ?? 0) * 1.2 +
        (s.sweVerified?.value ?? 0) +
        (s.liveCodeBench?.value ?? 0) * 0.8 +
        (s.terminalBench4?.value ?? 0) * 1.5 +
        (s.codingElo ? (s.codingElo.value - 1200) * 0.15 : 0)
      );
    };

    const setTxt = (sel, txt) => {
      const el = document.querySelector(sel);
      if (el) el.textContent = txt;
    };
    setTxt('[data-group-filter="all"]', `ทั้งหมด (${MODEL_GROUPS.length} กลุ่ม · ${DATA.candidates.length} รุ่น)`);
    MODEL_GROUPS.forEach((g) => {
      setTxt(`[data-group-filter="${g.key}"]`, `${g.badge} · ${g.short} (${grouped[g.key].length})`);
    });
    document.querySelectorAll("[data-group-filter]").forEach((btn) => {
      const act = btn.dataset.groupFilter === state.groupFilter;
      btn.classList.toggle("is-active", act);
      btn.setAttribute("aria-pressed", act ? "true" : "false");
    });

    const takeaway = document.getElementById("groups-takeaway");
    if (takeaway) {
      const counts = MODEL_GROUPS.map((g) => `<strong>${g.badge}</strong> ${grouped[g.key].length} รุ่น`).join(" · ");
      takeaway.innerHTML = `<div><strong>ภาพรวมการจัดกลุ่ม (${DATA.candidates.length}/${DATA.candidates.length} รุ่น OSI):</strong> ${counts} — แบ่งกลุ่มชัดเจนแบบไม่ซ้ำซ้อนเพื่อเลือกตามบทบาทงาน</div>`;
    }

    const visibleGroups = MODEL_GROUPS.filter((g) => state.groupFilter === "all" || g.key === state.groupFilter);
    const body = document.getElementById("groups-body");
    if (!body) return;

    body.innerHTML = visibleGroups
      .map((g) => {
        const items = [...grouped[g.key]].sort((a, b) => rankScore(b) - rankScore(a) || a.q4DiskGb - b.q4DiskGb);
        const moeCnt = items.filter((m) => m.archType === "MoE").length;
        const denseCnt = items.length - moeCnt;
        const visCnt = items.filter((m) => m.vision).length;
        const minQ4 = Math.min(...items.map((m) => m.q4DiskGb));
        const maxQ4 = Math.max(...items.map((m) => m.q4DiskGb));
        const scoredCnt = items.filter((m) => Object.values(m.codingScores || {}).some((v) => v)).length;

        const rowsHtml = items
          .map((m) => {
            const tags = DATA.benchmarks
              .map((bm) => {
                const sc = m.codingScores?.[bm.key];
                if (!sc || sc.value === null || sc.value === undefined) return null;
                return `<span class="group-score-tag">${esc(bm.shortLabel)}: ${esc(formatMetricVal(sc.value, bm.unit))}</span>`;
              })
              .filter(Boolean)
              .join("");
            const scoresCell = tags ? `<div class="group-scores">${tags}</div>` : `<span class="score-na">ยังไม่มีผล Coding ทางการ</span>`;
            return `<tr>
              <td><div class="model-cell-name">${esc(m.name)}</div><div class="model-cell-meta">${esc(m.vendor)} · ${esc(m.license)} · ${esc(m.release)}</div></td>
              <td><span class="pill ${m.archType === "MoE" ? "pill-moe" : "pill-dense"}">${esc(m.archType)}</span></td>
              <td class="td-num"><strong>${m.q4DiskGb} GB</strong></td>
              <td class="td-num">${esc(m.context)}</td>
              <td><span class="pill ${m.vision ? "pill-vision-yes" : "pill-vision-no"}">${m.vision ? "Yes" : "No"}</span></td>
              <td>${scoresCell}</td>
            </tr>`;
          })
          .join("");

        return `<section class="group-section is-group-${g.key}" data-group-key="${g.key}">
          <div class="group-head">
            <div>
              <div class="group-title-row">
                <span class="group-badge">${esc(g.badge)}</span>
                <h3 class="group-title">${esc(g.title)}</h3>
              </div>
              <p class="group-desc">${esc(g.desc)}</p>
            </div>
            <div class="group-meta">
              <span class="group-stat">${items.length} รุ่น (${moeCnt} MoE / ${denseCnt} Dense)</span>
              <span class="group-stat">Vision: ${visCnt} · Q4 ${minQ4}–${maxQ4}G</span>
              ${
                scoredCnt > 0
                  ? `<button type="button" class="action-btn" data-plot-group="${g.key}">เทียบกลุ่มนี้ในกราฟ (${scoredCnt}) ↗</button>`
                  : ""
              }
            </div>
          </div>
          <div class="table-wrap group-table-wrap">
            <table class="audit-table">
              <thead>
                <tr>
                  <th>โมเดล / ค่าย / License</th>
                  <th>สถาปัตยกรรม</th>
                  <th class="col-size">ขนาด Q4</th>
                  <th class="col-context">Context</th>
                  <th>Vision</th>
                  <th>คะแนน Coding ที่วัดได้</th>
                </tr>
              </thead>
              <tbody>${rowsHtml}</tbody>
            </table>
          </div>
        </section>`;
      })
      .join("");
  }

  function renderExcludedAudit() {
    const exclTakeaway = document.getElementById("excluded-takeaway");
    if (exclTakeaway) {
      exclTakeaway.innerHTML = `<div><strong>ความโปร่งใสในการคัดกรอง:</strong> คัดรุ่น OSI ขนาด &gt; 350 GB ออก <strong>${DATA.excluded.oversizeOsi.length} รุ่น</strong> และรุ่น Non-OSI/Closed API ออก <strong>${DATA.excluded.nonOsi.length} รุ่น</strong> เพื่อให้ตารางหลักเทียบเฉพาะโมเดลที่ติดตั้งเองได้จริงและเสรี 100%</div>`;
    }
    document.getElementById("excluded-body").innerHTML = `
      <div class="audit-panel">
        <h3>ตัดออกเพราะขนาด Q4 เกิน 350 GB (OSI แท้ ${DATA.excluded.oversizeOsi.length} รุ่น)</h3>
        <table class="audit-table">
          <thead><tr><th>โมเดล</th><th>License</th><th>Arch</th><th>Q4</th><th>Vision</th></tr></thead>
          <tbody>${DATA.excluded.oversizeOsi
            .map((m) => `<tr><td>${esc(m.name)}</td><td>${esc(m.license)}</td><td>${esc(m.archType)}</td><td>${m.q4DiskGb}G</td><td>${m.vision ? "Yes" : "No"}</td></tr>`)
            .join("")}</tbody>
        </table>
      </div>
      <div class="audit-panel">
        <h3>ตัดออกเพราะไม่ใช่ OSI / Closed API (${DATA.excluded.nonOsi.length} รุ่น)</h3>
        <table class="audit-table">
          <thead><tr><th>โมเดล</th><th>License</th><th>เหตุผล</th></tr></thead>
          <tbody>${DATA.excluded.nonOsi
            .map((m) => `<tr><td>${esc(m.name)}</td><td>${esc(m.license)}</td><td>${esc(m.reason)}</td></tr>`)
            .join("")}</tbody>
        </table>
      </div>`;
  }

  function formatBaselineOptLabel(m, label, activeBench) {
    const val = getMetricValue(m, state.benchKey);
    if (val !== null) {
      return `${label} (${m.q4DiskGb}G · ${formatMetricVal(val, activeBench.unit)})`;
    }
    const otherCount = DATA.benchmarks.filter((b) => getMetricValue(m, b.key) !== null).length;
    const status = otherCount > 0 ? `${otherCount} ชุดอื่น` : "ไม่มีผล";
    return `${label} (${m.q4DiskGb}G · ${status})`;
  }

  function refreshBaselineSelectOptions() {
    const baseSel = document.getElementById("baseline-select");
    if (!baseSel) return;
    const activeBench = getBenchMeta(state.benchKey);
    baseSel.innerHTML =
      `<optgroup label="Baselines หลัก">${DATA.baselines
        .map((b) => `<option value="${esc(b.id)}">${esc(formatBaselineOptLabel(b, getShortModelName(b), activeBench))}</option>`)
        .join("")}</optgroup>` +
      `<optgroup label="ใช้ Candidate เป็น Baseline">${DATA.candidates
        .map((m) => `<option value="${esc(m.id)}">${esc(formatBaselineOptLabel(m, m.name, activeBench))}</option>`)
        .join("")}</optgroup>`;
    baseSel.value = state.baselineId;
    baseSel.disabled = !state.baselineEnabled;
  }

  function populateSelects() {
    refreshBaselineSelectOptions();
    const baseToggle = document.getElementById("baseline-toggle");
    if (baseToggle) baseToggle.checked = state.baselineEnabled;

    const sizeSel = document.getElementById("size-cap-select");
    if (sizeSel) {
      sizeSel.innerHTML = [350, 300, 250, 200, 150, 100]
        .map((cap) => {
          const n = DATA.candidates.filter((m) => m.q4DiskGb <= cap).length;
          return `<option value="${cap}">≤ ${cap} GB (${n})</option>`;
        })
        .join("");
      sizeSel.value = String(state.sizeCap);
    }

    document.getElementById("bench-select").innerHTML = DATA.benchmarks
      .map((b) => `<option value="${esc(b.key)}">${esc(b.label)}</option>`)
      .join("");
    document.getElementById("bench-select").value = state.benchKey;

    const metricOpts =
      DATA.benchmarks.map((b) => `<option value="${esc(b.key)}">${esc(b.label)}</option>`).join("") +
      `<option value="q4DiskGb">ขนาดไฟล์ Q4 (GB)</option>` +
      `<option value="contextK">Context Window (Tokens)</option>`;
    document.getElementById("bar-metric-select").innerHTML = metricOpts;
    document.getElementById("bar-metric-select").value = state.barMetric;

    document.getElementById("dot-y-select").innerHTML = DATA.benchmarks
      .map((b) => `<option value="${esc(b.key)}">แกน Y: ${esc(b.label)}</option>`)
      .join("");
    document.getElementById("dot-y-select").value = state.dotY;
  }

  function bindEvents() {
    // Tabs (click + WAI-ARIA ArrowLeft/ArrowRight roving keyboard support)
    const tabBtns = Array.from(document.querySelectorAll(".nav-link[data-tab]"));
    tabBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        state.activeTab = btn.dataset.tab;
        applyTabAndPresentation();
      });
      btn.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const nextIdx = (i + (e.key === "ArrowRight" ? 1 : -1) + tabBtns.length) % tabBtns.length;
        state.activeTab = tabBtns[nextIdx].dataset.tab;
        applyTabAndPresentation();
        if (tabBtns[nextIdx].focus) tabBtns[nextIdx].focus();
      });
    });

    // Presentation mode & Print
    document.getElementById("mode-toggle-btn").addEventListener("click", () => {
      state.presentMode = !state.presentMode;
      applyTabAndPresentation();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    document.getElementById("print-btn").addEventListener("click", () => window.print());
    function goToSlide(idx) {
      if (idx < 0 || idx >= TAB_ORDER.length) return;
      state.activeTab = TAB_ORDER[idx];
      applyTabAndPresentation();
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    document.getElementById("slide-prev-btn").addEventListener("click", () => {
      goToSlide(TAB_ORDER.indexOf(state.activeTab) - 1);
    });
    document.getElementById("slide-next-btn").addEventListener("click", () => {
      goToSlide(TAB_ORDER.indexOf(state.activeTab) + 1);
    });
    document.getElementById("slide-exit-btn").addEventListener("click", () => {
      state.presentMode = false;
      applyTabAndPresentation();
    });
    document.addEventListener("keydown", (e) => {
      if (!state.presentMode) return;
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      const idx = TAB_ORDER.indexOf(state.activeTab);
      if (e.key === "ArrowRight") {
        goToSlide(idx + 1);
      } else if (e.key === "ArrowLeft") {
        goToSlide(idx - 1);
      } else if (e.key === "Escape") {
        state.presentMode = false;
        applyTabAndPresentation();
      }
    });

    // Text size selector
    document.querySelectorAll("[data-text-size]").forEach((btn) => {
      btn.addEventListener("click", () => applyTextSize(btn.dataset.textSize));
    });

    // Global Baseline On/Off toggle & picker
    const baseSel = document.getElementById("baseline-select");
    const baseToggle = document.getElementById("baseline-toggle");
    if (baseToggle) {
      baseToggle.addEventListener("change", (e) => {
        state.baselineEnabled = e.target.checked;
        if (baseSel) baseSel.disabled = !state.baselineEnabled;
        renderMatrix();
        renderAllCharts();
        renderScannableCards();
      });
    }
    if (baseSel) {
      baseSel.addEventListener("change", (e) => {
        state.baselineId = e.target.value;
        const chosen = getActiveBaseline();
        if (getMetricValue(chosen, state.benchKey) === null) {
          const firstScored = DATA.benchmarks.find((b) => getMetricValue(chosen, b.key) !== null);
          if (firstScored) {
            state.benchKey = firstScored.key;
            const bSel = document.getElementById("bench-select");
            if (bSel) bSel.value = firstScored.key;
          }
        }
        renderMatrix();
        renderAllCharts();
        renderScannableCards();
      });
    }

    // Matrix toolbar, sorting & filters
    document.querySelectorAll("[data-sort-col]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const col = btn.dataset.sortCol;
        if (state.sortCol === col) {
          state.sortDir = state.sortDir === "desc" ? "asc" : "desc";
        } else {
          state.sortCol = col;
          state.sortDir = ["name", "arch", "q4DiskGb"].includes(col) ? "asc" : "desc";
        }
        renderMatrix();
      });
    });
    document.getElementById("bench-select").addEventListener("change", (e) => {
      state.benchKey = e.target.value;
      renderMatrix();
    });
    document.getElementById("adv-filter-btn").addEventListener("click", (e) => {
      const drawer = document.getElementById("adv-drawer");
      drawer.hidden = !drawer.hidden;
      e.currentTarget.setAttribute("aria-expanded", drawer.hidden ? "false" : "true");
    });
    document.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.preset = btn.dataset.preset;
        if (state.preset === "all") { state.sizeCap = 350; state.archFilter = "all"; state.visionFilter = "all"; state.contextFilter = "all"; }
        else if (state.preset === "vision-under160") { state.sizeCap = 150; state.archFilter = "all"; state.visionFilter = "yes"; state.contextFilter = "all"; }
        else if (state.preset === "dense-compact") { state.sizeCap = 350; state.archFilter = "Dense"; state.visionFilter = "all"; state.contextFilter = "all"; }
        else if (state.preset === "moe-vs-0731") { state.sizeCap = 350; state.archFilter = "MoE"; state.visionFilter = "all"; state.contextFilter = "all"; }
        syncMatrixControls();
        renderMatrix();
      });
    });
    const sizeSel = document.getElementById("size-cap-select");
    if (sizeSel) {
      sizeSel.addEventListener("change", (e) => {
        state.sizeCap = Number(e.target.value);
        state.preset = "";
        syncMatrixControls();
        renderMatrix();
      });
    }
    document.querySelectorAll("[data-arch]").forEach((b) => b.addEventListener("click", () => { state.archFilter = b.dataset.arch; state.preset = ""; syncMatrixControls(); renderMatrix(); }));
    document.querySelectorAll("[data-vision]").forEach((b) => b.addEventListener("click", () => { state.visionFilter = b.dataset.vision; state.preset = ""; syncMatrixControls(); renderMatrix(); }));
    document.querySelectorAll("[data-context]").forEach((b) => b.addEventListener("click", () => { state.contextFilter = b.dataset.context; state.preset = ""; syncMatrixControls(); renderMatrix(); }));
    document.getElementById("apples-only-toggle").addEventListener("change", (e) => { state.applesOnly = e.target.checked; renderMatrix(); });
    document.getElementById("search-input").addEventListener("input", (e) => { state.query = e.target.value; renderMatrix(); });
    document.getElementById("reset-filters-btn").addEventListener("click", resetFilters);

    document.getElementById("matrix-tbody").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-toggle-id]");
      if (!btn) return;
      const id = btn.dataset.toggleId;
      if (state.expandedIds.has(id)) state.expandedIds.delete(id);
      else state.expandedIds.add(id);
      renderMatrix();
    });
    document.getElementById("expand-all-btn").addEventListener("click", (e) => {
      const isAll = e.currentTarget.dataset.allExpanded === "1";
      const ids = Array.from(document.querySelectorAll("#matrix-tbody [data-toggle-id]")).map((el) => el.dataset.toggleId);
      ids.forEach((id) => (isAll ? state.expandedIds.delete(id) : state.expandedIds.add(id)));
      renderMatrix();
    });
    const topNSel = document.getElementById("matrix-top-n");
    if (topNSel) {
      topNSel.addEventListener("change", (e) => {
        state.topChartN = Number(e.target.value) || 8;
        renderMatrix();
      });
    }
    const topToggle = document.getElementById("matrix-top-toggle");
    if (topToggle) {
      topToggle.addEventListener("click", () => {
        state.topChartOpen = !state.topChartOpen;
        topToggle.textContent = state.topChartOpen ? "ซ่อนกราฟ ▴" : "แสดงกราฟ Top ▾";
        topToggle.setAttribute("aria-expanded", state.topChartOpen ? "true" : "false");
        const plate = document.getElementById("matrix-top-plate");
        if (plate) plate.classList.toggle("is-collapsed", !state.topChartOpen);
      });
    }

    // Power BI / Excel Charts Slicer Events
    document.querySelectorAll("[data-chart-view]").forEach((b) => {
      b.addEventListener("click", () => { state.chartView = b.dataset.chartView; applyChartView(); });
    });
    document.querySelectorAll("[data-slicer]").forEach((b) => {
      b.addEventListener("click", () => applySlicerPreset(b.dataset.slicer));
    });
    document.getElementById("slicer-toggle-more").addEventListener("click", () => {
      state.showAllChips = !state.showAllChips;
      renderSlicerControls();
    });
    document.getElementById("model-slicer-chips").addEventListener("click", (e) => {
      const chip = e.target.closest("[data-slicer-id]");
      if (!chip) return;
      const id = chip.dataset.slicerId;
      if (state.slicerIds.has(id)) state.slicerIds.delete(id);
      else state.slicerIds.add(id);
      state.slicerPreset = "";
      renderSlicerControls();
      renderAllCharts();
    });
    document.getElementById("line-axis-checks").addEventListener("change", (e) => {
      const k = e.target.getAttribute("data-line-axis");
      if (!k) return;
      if (e.target.checked) state.lineAxisKeys.add(k);
      else state.lineAxisKeys.delete(k);
      renderAllCharts();
    });
    document.getElementById("bar-metric-select").addEventListener("change", (e) => { state.barMetric = e.target.value; renderAllCharts(); });
    document.getElementById("bar-sort-select").addEventListener("change", (e) => { state.barSort = e.target.value; renderAllCharts(); });
    document.getElementById("ref-0731-chk").addEventListener("change", (e) => { state.showRef0731 = e.target.checked; renderAllCharts(); });
    document.getElementById("ref-1017-chk").addEventListener("change", (e) => { state.showRef1017 = e.target.checked; renderAllCharts(); });
    document.getElementById("dot-x-select").addEventListener("change", (e) => { state.dotX = e.target.value; renderAllCharts(); });
    document.getElementById("dot-y-select").addEventListener("change", (e) => { state.dotY = e.target.value; renderAllCharts(); });
    document.getElementById("clear-highlight-btn").addEventListener("click", () => {
      state.highlightedModelId = null;
      document.getElementById("clear-highlight-btn").hidden = true;
      renderAllCharts();
    });

    // Tab 3 cards filter
    document.querySelectorAll("[data-card-filter]").forEach((b) => {
      b.addEventListener("click", () => {
        state.cardFilter = b.dataset.cardFilter;
        document.querySelectorAll("[data-card-filter]").forEach((x) => x.classList.toggle("is-active", x === b));
        renderScannableCards();
      });
    });

    // Tab 4 model groups filter & plot-in-charts handoff
    document.querySelectorAll("[data-group-filter]").forEach((b) => {
      b.addEventListener("click", () => {
        state.groupFilter = b.dataset.groupFilter;
        renderGroups();
      });
    });
    const groupsBody = document.getElementById("groups-body");
    if (groupsBody) {
      groupsBody.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-plot-group]");
        if (!btn) return;
        const gKey = btn.dataset.plotGroup;
        const groupScoredIds = DATA.candidates
          .filter((m) => classifyModelGroup(m) === gKey && Object.values(m.codingScores || {}).some((v) => v))
          .map((m) => m.id);
        const groupModels = DATA.candidates.filter((m) => groupScoredIds.includes(m.id));
        const hasScoresOn = (k) => groupModels.some((m) => getMetricValue(m, k) !== null);
        const bestMetric =
          DATA.benchmarks
            .map((b) => ({ key: b.key, n: groupModels.filter((m) => getMetricValue(m, b.key) !== null).length }))
            .sort((a, b) => b.n - a.n)[0]?.key || state.barMetric;
        if (!hasScoresOn(state.barMetric)) {
          state.barMetric = bestMetric;
          document.getElementById("bar-metric-select").value = bestMetric;
        }
        if (!hasScoresOn(state.dotY)) {
          state.dotY = bestMetric;
          document.getElementById("dot-y-select").value = bestMetric;
        }
        const nextIds = new Set(groupScoredIds);
        if (state.baselineEnabled) nextIds.add(getActiveBaseline().id);
        state.slicerIds = nextIds;
        state.slicerPreset = "";
        state.highlightedModelId = null;
        document.getElementById("clear-highlight-btn").hidden = true;
        state.activeTab = "charts";
        renderSlicerControls();
        renderAllCharts();
        applyTabAndPresentation();
        window.scrollTo({ top: 0, behavior: "instant" });
      });
    }
  }

  function init() {
    applyTextSize(state.textSize);
    document.getElementById("report-date").textContent = `อัปเดต ${DATA.meta.updatedAt}`;
    renderHeroCards();
    renderInventoryBar();
    populateSelects();
    renderSlicerControls();
    renderMatrix();
    renderAllCharts();
    renderScannableCards();
    renderBaselinesAndGlossary();
    renderGroups();
    renderExcludedAudit();
    applyChartView();
    applyTabAndPresentation();
    bindEvents();
  }

  init();
})();
