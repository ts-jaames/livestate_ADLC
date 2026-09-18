/* Client ESOA — sight, not action. Reads register.csv same-origin.
   Client view = Y and Client label only. Every item traces to an ID.
   Does not write, capture, ingest, or decide. */

import { mountFootingChart } from "./footing-chart.js";

const REGISTER = "data/register.csv";
const NEXT_GATE = "data/next_gate.json";
const DECISIONS = "data/decisions.csv";
const ASKS = "data/asks.csv";
const HISTORY = "data/footing_history.csv";
const CONTRACT_COLUMNS = [
  "ID", "Area", "Risk", "Clarifying statement", "Type", "Collapse",
  "Uncertainty", "Test effort", "Priority cue", "Status", "Client view", "Client label"
];

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

function countsTowardFooting(status) {
  return status === "Validated" || status === "Committed";
}

/* When register.csv gains a Gates column, gate scope and footing become
   per-increment and fully data-driven. Until then, v1 gating risks are
   Client view = Y AND Collapse = High AND Uncertainty = High. */
function isGating(rec) {
  return rec["Client view"] === "Y"
    && rec["Collapse"] === "High"
    && rec["Uncertainty"] === "High";
}

function bandFor(pct, inTestCount) {
  if (pct === 100) return "Load-bearing";
  if (pct > 0) return "Partial";
  if (inTestCount > 0) return "Testing";
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
    host.innerHTML = "<p class=\"empty\">No load-bearing risks in the client view.</p>";
    return;
  }
  host.innerHTML = rows.map((r) => {
    const label = r["Client label"] === ""
      ? "<span class=\"muted\">no client label in register</span>"
      : escapeHtml(r["Client label"]);
    return "<li class=\"risk\" data-id=\"" + escapeHtml(r["ID"] || "") + "\">" +
      "<span class=\"risk__tick\" aria-hidden=\"true\"></span>" +
      "<span class=\"risk__id\">" + escapeHtml(r["ID"] || "") + "</span>" +
      "<span>" + label + "</span></li>";
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
  const name = (cfg && cfg.name || "").trim();
  const unlocks = (cfg && cfg.unlocks || "").trim();
  if (name) {
    nameEl.textContent = name;
    nameEl.classList.remove("is-unset");
  } else {
    nameEl.textContent = "Owner to set";
    nameEl.classList.add("is-unset");
  }
  unlocksEl.textContent = unlocks
    ? "Committing unlocks " + unlocks
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
  fetch(REGISTER).then((res) => {
    if (!res.ok) throw new Error("HTTP " + res.status + " fetching " + REGISTER);
    return res.text();
  }),
  fetch(NEXT_GATE).then((res) => res.ok ? res.json() : {}),
  fetch(DECISIONS).then((res) => res.ok ? res.text() : "ID,When,Decision,Source\n"),
  fetch(ASKS).then((res) => res.ok ? res.text() : "ID,Ask,Came,Status\n"),
  fetch(HISTORY).then((res) => res.ok ? res.text() : "Date,Pct\n")
]).then(([registerText, gateCfg, decisionsText, asksText, historyText]) => {
  const records = recordsFromCsv(registerText, CONTRACT_COLUMNS);
  const client = records.filter((r) => r["Client view"] === "Y");
  const gating = client.filter(isGating);
  const live = renderFooting(gating);
  renderGate(gateCfg);
  renderRisks(document.getElementById("gate-risks"), gating);
  renderRisks(document.getElementById("high-risks"), gating);
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
