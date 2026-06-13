/* ════════════════════════════════════════════════════════════════════════
   POLYGON EDITOR — open index.html?edit to trace hotspots.

   How to use it:
   1. Open the site with ?edit added to the URL (e.g. index.html?edit,
      or yoursite.github.io/?edit). The door is skipped.
   2. Click around the edge of an object — each click drops a point.
      Existing hotspot outlines show in faint gold so you can see what's
      already defined. Pan the room by dragging, like normal.
   3. When the shape looks right, press "Copy config" — the hitbox and
      outline lines land on your clipboard (and in the panel's text box).
   4. Paste them into the object's entry in js/config.js.
   5. "Undo" removes the last point; "Clear" starts the shape over.

   Visitors never see any of this — it only exists behind ?edit.
   ════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  if (!new URLSearchParams(window.location.search).has("edit")) return;

  var SVG_NS = "http://www.w3.org/2000/svg";
  var room = document.getElementById("room");
  var points = [];                 /* the shape being traced, [[x,y], ...] in % */

  document.body.classList.add("editing");

  /* ── SVG overlay: existing outlines (faint) + the working shape ────── */

  var svg = document.createElementNS(SVG_NS, "svg");
  svg.id = "editor-svg";
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  room.appendChild(svg);

  var existingGroup = document.createElementNS(SVG_NS, "g");
  svg.appendChild(existingGroup);

  function drawExisting() {
    existingGroup.innerHTML = "";
    ROOM_OBJECTS.forEach(function (obj) {
      var poly = document.createElementNS(SVG_NS, "polygon");
      poly.setAttribute("class", "existing");
      poly.setAttribute("points",
        obj.outline.map(function (p) { return p[0] + "," + p[1]; }).join(" "));
      existingGroup.appendChild(poly);
    });
  }
  drawExisting();

  var currentPoly = document.createElementNS(SVG_NS, "polygon");
  currentPoly.setAttribute("class", "current");
  svg.appendChild(currentPoly);

  var pointsGroup = document.createElementNS(SVG_NS, "g");
  svg.appendChild(pointsGroup);

  function redraw() {
    currentPoly.setAttribute("points",
      points.map(function (p) { return p[0] + "," + p[1]; }).join(" "));
    pointsGroup.innerHTML = "";
    points.forEach(function (p) {
      var c = document.createElementNS(SVG_NS, "ellipse");
      c.setAttribute("class", "pt");
      c.setAttribute("cx", p[0]);
      c.setAttribute("cy", p[1]);
      c.setAttribute("rx", 0.11);
      c.setAttribute("ry", 0.11 * (room.offsetWidth / room.offsetHeight));
      pointsGroup.appendChild(c);
    });
    countEl.textContent = points.length + (points.length === 1 ? " point" : " points");
    output.value = points.length >= 3 ? snippet() : "(need at least 3 points)";
  }

  /* ── The generated config lines ─────────────────────────────────────── */

  function round1(n) { return Math.round(n * 10) / 10; }

  function snippet() {
    var xs = points.map(function (p) { return p[0]; });
    var ys = points.map(function (p) { return p[1]; });
    var pad = 0.5;   /* hitbox = bounding box, padded a little */
    var l = Math.max(0, Math.min.apply(null, xs) - pad);
    var t = Math.max(0, Math.min.apply(null, ys) - pad);
    var r = Math.min(100, Math.max.apply(null, xs) + pad);
    var b = Math.min(100, Math.max.apply(null, ys) + pad);
    return (
      "hitbox: [" + [round1(l), round1(t), round1(r - l), round1(b - t)].join(", ") + "],\n" +
      "outline: [\n  " +
      points.map(function (p) {
        return "[" + round1(p[0]) + ", " + round1(p[1]) + "]";
      }).join(", ") +
      "\n]"
    );
  }

  /* ── Clicks on the room drop points (drags still pan) ───────────────── */

  var downAt = null;
  room.addEventListener("mousedown", function (e) {
    downAt = [e.clientX, e.clientY];
  });
  room.addEventListener("click", function (e) {
    if (downAt) {
      var moved = Math.abs(e.clientX - downAt[0]) + Math.abs(e.clientY - downAt[1]);
      if (moved > 5) return;       /* that was a pan, not a point */
    }
    var rect = room.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width) * 100;
    var y = ((e.clientY - rect.top) / rect.height) * 100;
    points.push([x, y]);
    redraw();
  });

  /* Touch: a tap drops a point (scrolling still pans natively). */
  var touchStart = null;
  room.addEventListener("touchstart", function (e) {
    if (e.touches.length === 1)
      touchStart = [e.touches[0].clientX, e.touches[0].clientY];
  }, { passive: true });
  room.addEventListener("touchend", function (e) {
    if (!touchStart || e.changedTouches.length !== 1) return;
    var t = e.changedTouches[0];
    var moved = Math.abs(t.clientX - touchStart[0]) + Math.abs(t.clientY - touchStart[1]);
    touchStart = null;
    if (moved > 8) return;
    var rect = room.getBoundingClientRect();
    points.push([
      ((t.clientX - rect.left) / rect.width) * 100,
      ((t.clientY - rect.top) / rect.height) * 100
    ]);
    redraw();
  });

  /* ── The panel ──────────────────────────────────────────────────────── */

  var panel = document.createElement("div");
  panel.id = "editor-panel";
  panel.innerHTML =
    '<h3 id="ed-drag" title="Drag to move this panel">Hotspot editor <span class="ed-grip">⠿</span></h3>' +
    '<p>Click around an object\u2019s edge to trace it. Drag the room to pan, ' +
    'or drag this panel\u2019s title bar to move it out of the way. ' +
    'Gold shapes are hotspots that already exist.</p>' +
    '<div class="row">' +
    '  <button id="ed-undo">Undo point</button>' +
    '  <button id="ed-clear">Clear</button>' +
    '  <button id="ed-copy">Copy config</button>' +
    '</div>' +
    '<p id="ed-count">0 points</p>' +
    '<textarea id="ed-out" readonly spellcheck="false"></textarea>' +
    '<label><input type="checkbox" id="ed-existing" checked> show existing hotspots</label>';
  document.body.appendChild(panel);

  /* Drag the panel by its title bar, so you can park it off whatever
     you're tracing. Pointer events cover mouse and touch together. */
  (function makeDraggable() {
    var handle = document.getElementById("ed-drag");
    var dragging = false, startX = 0, startY = 0, baseX = 0, baseY = 0;
    handle.style.cursor = "move";
    handle.style.touchAction = "none";
    handle.addEventListener("pointerdown", function (e) {
      dragging = true;
      var r = panel.getBoundingClientRect();
      // Switch to explicit left/top positioning anchored at the current spot.
      baseX = r.left; baseY = r.top;
      panel.style.left = baseX + "px";
      panel.style.top = baseY + "px";
      panel.style.right = "auto";
      startX = e.clientX; startY = e.clientY;
      handle.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    handle.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var nx = baseX + (e.clientX - startX);
      var ny = baseY + (e.clientY - startY);
      // Keep it on screen.
      var maxX = window.innerWidth - panel.offsetWidth;
      var maxY = window.innerHeight - panel.offsetHeight;
      panel.style.left = Math.max(0, Math.min(maxX, nx)) + "px";
      panel.style.top = Math.max(0, Math.min(maxY, ny)) + "px";
    });
    handle.addEventListener("pointerup", function () { dragging = false; });
  })();

  var countEl = document.getElementById("ed-count");
  var output = document.getElementById("ed-out");

  document.getElementById("ed-undo").addEventListener("click", function () {
    points.pop(); redraw();
  });
  document.getElementById("ed-clear").addEventListener("click", function () {
    points = []; redraw();
  });
  document.getElementById("ed-copy").addEventListener("click", function () {
    if (points.length < 3) return;
    output.select();
    if (navigator.clipboard) navigator.clipboard.writeText(output.value);
    else document.execCommand("copy");
  });
  document.getElementById("ed-existing").addEventListener("change", function (e) {
    existingGroup.style.display = e.target.checked ? "" : "none";
  });

  redraw();
})();
