/* Client ESOA — sight, not action. Reads register.csv same-origin.
   Client view = Y and Client label only for named items. Every item traces
   to an ID. Does not write, capture, ingest, or decide. */

import { mountFootingChart } from "./footing-chart.js";

const REGISTER = "data/register.csv";
const NEXT_GATE = "data/next_gate.json";
const DECISIONS = "data/decisions.csv";
const ASKS = "data/asks.csv";
const HISTORY = "data/footing_history.csv";
const CONTRACT_COLUMNS = [
  "ID", "Area", "Risk", "Clarifying statement", "Type", "Collapse",
  "Uncertainty", "Test effort", "Priority cue", "Status", "Gate",
  "Client view", "Client label"
];
const BANDS = ["No footing", "Testing", "Partial", "Load-bearing"];
const SCORE = { Low: 1, Medium: 2, High: 3 };

const banner = document.getElementById("status-banner");
const app = document.getElementById("app");
const chart = mountFootingChart("#figFooting");

function parseCSV(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') { inQuotes = true; continue; }
    if (c === ",") { row.push(field); field = ""; continue; }
    if (c === "\r") continue;
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; continue; }
    field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell !== ""));
}

function recordsFromCsv(text, required) {
  const rows = parseCSV(text);
  if (!rows.length) return [];
  const headers = rows[0];
  if (required) {
    const missing = required.filter((c) => !headers.includes(c));
    if (missing.length) throw new Error("Missing columns: " + missing.join(", "));
  }
  return rows.slice(1).map((cells, index) => {
    const rec = { __index: index };
    headers.forEach((h, i) => { rec[h] = cells[i] ?? ""; });
    return rec;
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fail(message) {
  banner.hidden = false;
  banner.className = "banner error";
  banner.textContent = message;
}

function sameGate(a, b) {
  return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
}

function currentGateName(cfg) {
  return String((cfg && cfg.gate) || "").trim();
}

function countsTowardFooting(status) {
  return status === "Validated" || status === "Committed";
}

function derivedCue(rec) {
  const collapse = rec["Collapse"];
  const uncertainty = rec["Uncertainty"];
  const effort = rec["Test effort"];
  if (collapse === "High" && uncertainty === "High" && effort === "High") {
    return "Cluster - decompose";
  }
  if (collapse === "High" && uncertainty === "High") return "Attack first";
  return rec["Priority cue"];
}

function scoreProduct(rec) {
  return (SCORE[rec["Collapse"]] || 0) * (SCORE[rec["Uncertainty"]] || 0);
}

function byAttackOrder(a, b) {
  const diff = scoreProduct(b) - scoreProduct(a);
  if (diff) return diff;
  return String(a["ID"] || "").localeCompare(String(b["ID"] || ""));
}

function bandFor(pct, inTestCount) {
  if (pct === 100) return "Load-bearing";
  if (pct > 0) return "Partial";
  if (inTestCount > 0) return "Testing";
  return "No footing";
}

function bandForStatus(status) {
  if (status === "Committed") return "Load-bearing";
  if (status === "Validated") return "Partial";
  if (status === "In test") return "Testing";
  return "No footing";
}

function confFor(band) {
  if (band === "Load-bearing") return "steady";
  if (band === "Partial") return "rebuilding";
  if (band === "Testing") return "reassessing";
  return "provisional";
}

function renderRisks(host, rows) {
  if (!rows.length) {
    host.innerHTML = "<p class=\"empty\">Nothing is in front of us.</p>";
    return;
  }
  host.innerHTML = rows.map((r) => {
    const active = r["Collapse"] === "High";
    const named = (r["Client label"] || "").trim() || (r["Risk"] || "").trim();
    const label = named === ""
      ? "<span class=\"muted\">no label in register</span>"
      : escapeHtml(named);
    return "<li class=\"risk" + (active ? " is-active" : "") + "\" data-id=\"" +
      escapeHtml(r["ID"] || "") + "\">" +
      "<span class=\"risk__mark\" aria-hidden=\"true\"></span>" +
      "<span class=\"risk__id\">" + escapeHtml(r["ID"] || "") + "</span>" +
      "<span>" + label + "</span></li>";
  }).join("");
}

function renderCensus(records, currentGate) {
  const summary = document.getElementById("census-summary");
  const host = document.getElementById("census");
  const byGate = {};
  const areas = {};
  records.forEach((r) => {
    const gate = (r["Gate"] || "").trim();
    if (gate) {
      if (!byGate[gate]) byGate[gate] = [];
      byGate[gate].push(r);
    }
    const area = (r["Area"] || "").trim();
    if (area) areas[area] = true;
  });
  const gateNames = Object.keys(byGate).sort(function (a, b) {
    return a.localeCompare(b);
  });

  summary.textContent = records.length + " risks mapped across " + gateNames.length +
    " gates and " + Object.keys(areas).length + " areas.";

  host.innerHTML = gateNames.map((gate) => {
    const rows = byGate[gate];
    const counts = {};
    BANDS.forEach((b) => { counts[b] = 0; });
    rows.forEach((r) => { counts[bandForStatus(r["Status"])] += 1; });
    const areaSet = {};
    rows.forEach((r) => {
      const area = (r["Area"] || "").trim();
      if (area) areaSet[area] = true;
    });
    const areaList = Object.keys(areaSet).sort(function (a, b) {
      return a.localeCompare(b);
    });
    const active = sameGate(gate, currentGate);
    const bands = BANDS.map((b) => escapeHtml(b) + " " + counts[b]).join(" · ");
    return "<li class=\"census__row" + (active ? " is-active" : "") + "\">" +
      "<div class=\"census__line\">" +
      "<span class=\"census__name\">" + escapeHtml(gate) + "</span>" +
      "<span class=\"census__n\">" + rows.length +
      " <span class=\"census__unit\">" + (rows.length === 1 ? "risk" : "risks") + "</span></span>" +
      "</div>" +
      (active ? "<p class=\"census__bands\">" + bands + "</p>" : "") +
      (areaList.length
        ? "<p class=\"census__areas\">" + areaList.map(escapeHtml).join(" · ") + "</p>"
        : "") +
      "</li>";
  }).join("");
}

function renderDecisions(rows) {
  const host = document.getElementById("decisions");
  const data = rows.filter((r) => (r.Decision || "").trim() !== "");
  if (!data.length) {
    host.innerHTML = "<p class=\"empty\">No decisions on record yet.</p>";
    return;
  }
  host.innerHTML = data.map((r) => {
    const when = escapeHtml(r.When || "");
    const what = escapeHtml(r.Decision || "");
    const src = (r.Source || "").trim();
    return "<article class=\"log__row\" data-id=\"" + escapeHtml(r.ID || "") + "\">" +
      "<div class=\"log__line\"><span class=\"log__when\">" + when + "</span>" +
      "<span class=\"log__what\">" + what + "</span></div>" +
      (src ? "<p class=\"log__src\">captured from " + escapeHtml(src) + "</p>" : "") +
      "</article>";
  }).join("");
}

function renderAsks(rows) {
  const host = document.getElementById("asks");
  const data = rows.filter((r) => (r.Ask || "").trim() !== "");
  if (!data.length) {
    host.innerHTML = "<p class=\"empty\">No open asks.</p>";
    return;
  }
  host.innerHTML = data.map((r) => {
    const came = (r.Came || "").trim();
    return "<article class=\"asks__row\" data-id=\"" + escapeHtml(r.ID || "") + "\">" +
      "<div class=\"asks__line\"><span class=\"asks__text\">" + escapeHtml(r.Ask) + "</span></div>" +
      (came ? "<p class=\"asks__came\">" + escapeHtml(came) + "</p>" : "") +
      "</article>";
  }).join("");
}

function renderGate(cfg) {
  const nameEl = document.getElementById("gate-name");
  const unlocksEl = document.getElementById("gate-unlocks");
  const gate = currentGateName(cfg);
  const unlocks = (cfg && cfg.unlocks || "").trim();
  if (gate) {
    nameEl.textContent = gate;
    nameEl.classList.remove("is-unset");
  } else {
    nameEl.textContent = "Owner to set";
    nameEl.classList.add("is-unset");
  }
  unlocksEl.textContent = unlocks
    ? "Unlocks — " + unlocks
    : "Unlocks — owner to set.";
}

function renderFooting(gating) {
  const n = gating.length;
  const earned = gating.filter((r) => countsTowardFooting(r["Status"])).length;
  const inTest = gating.filter((r) => r["Status"] === "In test").length;
  const pct = n ? Math.round((100 * earned) / n) : 0;
  const band = bandFor(pct, inTest);

  document.body.setAttribute("data-conf", confFor(band));

  const reading = document.getElementById("reading");
  reading.classList.toggle("is-loadbearing", band === "Load-bearing");
  document.getElementById("reading-band").textContent = band;
  document.getElementById("reading-pct").textContent = pct + "%";
  document.getElementById("momentum").textContent =
    "In test · " + inTest + (n ? " · " + n + " gating" : " · no gating set");

  return { pct: pct, band: band, inTest: inTest, n: n };
}

Promise.all([
  fetch(REGISTER, { cache: "no-store" }).then((res) => {
    if (!res.ok) throw new Error("HTTP " + res.status + " fetching " + REGISTER);
    return res.text();
  }),
  fetch(NEXT_GATE).then((res) => res.ok ? res.json() : {}),
  fetch(DECISIONS).then((res) => res.ok ? res.text() : "ID,When,Decision,Source\n"),
  fetch(ASKS).then((res) => res.ok ? res.text() : "ID,Ask,Came,Status\n"),
  fetch(HISTORY).then((res) => res.ok ? res.text() : "Date,Pct\n")
]).then(([registerText, gateCfg, decisionsText, asksText, historyText]) => {
  const records = recordsFromCsv(registerText, CONTRACT_COLUMNS);
  const currentGate = currentGateName(gateCfg);
  const client = records.filter((r) => r["Client view"] === "Y");
  const gating = currentGate
    ? client.filter((r) => sameGate(r["Gate"], currentGate))
    : [];
  const front = currentGate
    ? records.filter((r) => sameGate(r["Gate"], currentGate)).slice().sort(byAttackOrder)
    : [];
  const live = renderFooting(gating);
  renderGate(gateCfg);
  renderRisks(document.getElementById("front-risks"), front);
  renderCensus(records, currentGate);
  renderDecisions(recordsFromCsv(decisionsText));
  renderAsks(recordsFromCsv(asksText));

  const history = recordsFromCsv(historyText)
    .filter((r) => (r.Date || "").trim() !== "")
    .map((r) => {
      const pct = Number(r.Pct);
      return {
        t: r.Date,
        pct: Number.isFinite(pct) ? pct : 0,
        band: bandFor(Number.isFinite(pct) ? pct : 0, 0)
      };
    });
  if (chart) chart.setData(history, live);

  banner.hidden = true;
  app.hidden = false;
}).catch((err) => {
  fail("Could not load same-origin data. Serve the repo root over HTTP. " + err.message);
});
