/* Footing over time. Visual language from ESOA RangeFigure (record.js).
   Plots weighted footing % and the band ladder — not cost or estimate. */

var BANDS = ["No footing", "Testing", "Partial", "Load-bearing"];

function el(name, attrs, text) {
  var node = document.createElementNS("http://www.w3.org/2000/svg", name);
  if (attrs) {
    Object.keys(attrs).forEach(function (k) {
      if (attrs[k] != null) node.setAttribute(k, attrs[k]);
    });
  }
  if (text != null) node.appendChild(document.createTextNode(text));
  return node;
}

function tag(name, cls, text) {
  var node = document.createElement(name);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function ms(iso) {
  return Date.parse(iso + "T00:00:00Z");
}

function addDays(iso, n) {
  var d = new Date(ms(iso));
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function fmtWhen(iso) {
  var d = new Date(ms(iso));
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC"
  });
}

function FootingFigure(host) {
  this.host = host;
  this.points = [];
  this.live = null;

  var head = tag("div", "fig__head");
  head.appendChild(tag("span", "fig__k", "Footing over time"));
  host.appendChild(head);

  var note = tag("div", "fig__note");
  note.setAttribute("aria-live", "polite");
  this.noteWhen = tag("span", "fig__when");
  this.noteFig = tag("span", "fig__figure");
  this.noteBand = tag("span", "fig__spread");
  this.noteMoved = tag("p", "fig__moved");
  var line = tag("div", "fig__noteline");
  line.appendChild(this.noteWhen);
  line.appendChild(this.noteFig);
  line.appendChild(this.noteBand);
  note.appendChild(line);
  note.appendChild(this.noteMoved);
  host.appendChild(note);

  var plot = tag("div", "fig__plot");
  this.svg = el("svg", {
    class: "fig__svg",
    tabindex: "0",
    role: "img",
    "aria-label": "Footing over time. Weighted percent and band ladder. Near-empty at day zero is correct."
  });
  plot.appendChild(this.svg);
  host.appendChild(plot);
  this.plot = plot;

  var self = this;
  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      if (self.points.length) self.draw();
    }).observe(plot);
  }
}

FootingFigure.prototype.setData = function (points, live) {
  this.points = points.slice().sort(function (a, b) {
    return a.t < b.t ? -1 : a.t > b.t ? 1 : 0;
  });
  this.live = live || null;
  this.draw();
};

FootingFigure.prototype.frame = function () {
  var w = Math.max(280, this.plot.clientWidth || 640);
  var narrow = w < 520;
  var padL = narrow ? 92 : 112;
  var padR = narrow ? 28 : 40;
  var top = 18;
  var bandH = narrow ? 120 : 148;
  var axisY = top + bandH;
  var rowH = 17;
  var trackY = axisY + 52;
  var h = trackY + rowH * BANDS.length + 6;

  var first = this.points[0] ? this.points[0].t : "2026-09-18";
  var last = this.points.length ? this.points[this.points.length - 1].t : first;
  var from = addDays(first, -7);
  var to = addDays(last, 21);
  var x0 = ms(from);
  var x1 = ms(to);

  return {
    w: w,
    h: h,
    padL: padL,
    padR: padR,
    top: top,
    axisY: axisY,
    trackY: trackY,
    rowH: rowH,
    from: from,
    to: to,
    row: function (band) {
      var i = BANDS.indexOf(band);
      if (i < 0) i = 0;
      return trackY + i * rowH;
    },
    X: function (t) {
      var k = (ms(t) - x0) / (x1 - x0);
      return padL + k * (w - padL - padR);
    },
    Y: function (pct) {
      return axisY - (pct / 100) * (bandH - 8);
    }
  };
};

FootingFigure.prototype.draw = function () {
  var points = this.points;
  var f = this.frame();
  var svg = this.svg;
  svg.setAttribute("viewBox", "0 0 " + f.w + " " + f.h);
  svg.setAttribute("width", f.w);
  svg.setAttribute("height", f.h);
  svg.style.height = f.h + "px";
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  var g = el("g");
  svg.appendChild(g);

  [0, 50, 100].forEach(function (k) {
    var y = f.Y(k);
    g.appendChild(el("line", {
      class: "fig__grid",
      x1: f.padL,
      x2: f.w - f.padR,
      y1: y,
      y2: y
    }));
    g.appendChild(el("text", {
      class: "fig__tick",
      x: f.padL - 8,
      y: y + 3.5,
      "text-anchor": "end"
    }, k + "%"));
  });

  g.appendChild(el("line", {
    class: "fig__axis",
    x1: f.padL,
    x2: f.w - f.padR,
    y1: f.axisY,
    y2: f.axisY
  }));

  var latest = points.length ? points[points.length - 1] : null;
  var today = latest ? latest.t : f.from;
  var todayX = f.X(today);

  g.appendChild(el("line", {
    class: "fig__today",
    x1: todayX,
    x2: todayX,
    y1: f.top - 8,
    y2: f.axisY
  }));

  g.appendChild(el("text", {
    class: "fig__date",
    x: f.X(f.from),
    y: f.axisY + 22
  }, fmtWhen(f.from)));
  g.appendChild(el("text", {
    class: "fig__date",
    x: f.X(f.to),
    y: f.axisY + 22,
    "text-anchor": "end"
  }, fmtWhen(f.to)));

  if (points.length === 1) {
    var p = points[0];
    g.appendChild(el("circle", {
      class: "fig__dot fig__dot--held",
      cx: f.X(p.t),
      cy: f.Y(p.pct),
      r: 3.5
    }));
  } else if (points.length > 1) {
    var d = points.map(function (pt, i) {
      return (i === 0 ? "M" : "L") + f.X(pt.t) + " " + f.Y(pt.pct);
    }).join(" ");
    g.appendChild(el("path", { class: "fig__edge", d: d }));
    points.forEach(function (pt) {
      g.appendChild(el("circle", {
        class: "fig__dot fig__dot--held",
        cx: f.X(pt.t),
        cy: f.Y(pt.pct),
        r: 3
      }));
    });
  }

  g.appendChild(el("text", {
    class: "fig__rowhead",
    x: f.padL - 10,
    y: f.trackY - 13,
    "text-anchor": "end"
  }, "band"));

  var liveBand = (this.live && this.live.band) || (latest && latest.band) || "No footing";
  BANDS.forEach(function (band) {
    var y = f.row(band);
    g.appendChild(el("line", {
      class: "fig__rowline",
      x1: f.padL,
      x2: f.w - f.padR,
      y1: y,
      y2: y
    }));
    var active = band === liveBand;
    g.appendChild(el("text", {
      class: "fig__rowlabel" + (active ? " is-active" : "") + (active && band === "Load-bearing" ? " is-open" : ""),
      x: f.padL - 10,
      y: y + 3.5,
      "text-anchor": "end"
    }, band));
  });

  if (latest) {
    var yBand = f.row(latest.band || "No footing");
    g.appendChild(el("circle", {
      class: "fig__stepdot",
      cx: todayX,
      cy: yBand,
      r: 2.5
    }));
  }

  this.show(latest);
};

FootingFigure.prototype.show = function (pt) {
  if (!pt) {
    this.noteWhen.textContent = "";
    this.noteFig.textContent = "";
    this.noteBand.textContent = "";
    this.noteMoved.textContent = "No footing history yet.";
    return;
  }
  this.noteWhen.textContent = fmtWhen(pt.t);
  this.noteFig.textContent = pt.pct + "%";
  this.noteFig.classList.toggle("is-loadbearing", pt.band === "Load-bearing");
  this.noteBand.textContent = pt.band || "";
  this.noteMoved.textContent = this.points.length === 1
    ? "Day zero. One point is the honest series."
    : "";
};

export function mountFootingChart(sel) {
  var host = typeof sel === "string" ? document.querySelector(sel) : sel;
  if (!host) return null;
  return new FootingFigure(host);
}
