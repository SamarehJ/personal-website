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
  var viewport = document.getElementById("viewport");
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
      var shapes = obj.shapes || [{ outline: obj.outline }];
      shapes.forEach(function (s) {
        if (!s.outline) return;
        var poly = document.createElementNS(SVG_NS, "polygon");
        poly.setAttribute("class", "existing");
        poly.setAttribute("points",
          s.outline.map(function (p) { return p[0] + "," + p[1]; }).join(" "));
        existingGroup.appendChild(poly);
      });
    });
  }
  drawExisting();

  var currentPoly = document.createElementNS(SVG_NS, "polygon");
  currentPoly.setAttribute("class", "current");
  svg.appendChild(currentPoly);

  var pointsGroup = document.createElementNS(SVG_NS, "g");
  svg.appendChild(pointsGroup);

  /* ── Icon points ────────────────────────────────────────────────────
     A second mode: instead of tracing an outline, drop ONE point to mark
     where an object's beckon-mote should sit. Existing `icon` points show
     faint gold; the one you're placing shows bright cyan. */
  var iconLayer = document.createElementNS(SVG_NS, "g");
  svg.appendChild(iconLayer);
  var mode = "outline";   /* "outline" | "icon" */
  var iconPt = null;       /* the icon point being placed, [x, y] in % */

  function iconMarker(x, y, cls) {
    var g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("class", cls);
    var rx = 1.7 * 100 / room.offsetWidth, ry = 1.7 * 100 / room.offsetHeight;
    var ring = document.createElementNS(SVG_NS, "ellipse");
    ring.setAttribute("cx", x); ring.setAttribute("cy", y);
    ring.setAttribute("rx", rx); ring.setAttribute("ry", ry);
    ring.setAttribute("fill", "none");
    g.appendChild(ring);
    var dot = document.createElementNS(SVG_NS, "ellipse");
    dot.setAttribute("cx", x); dot.setAttribute("cy", y);
    dot.setAttribute("rx", rx * 0.32); dot.setAttribute("ry", ry * 0.32);
    g.appendChild(dot);
    return g;
  }
  function drawIcons() {
    iconLayer.innerHTML = "";
    ROOM_OBJECTS.forEach(function (obj) {
      if (obj.icon) iconLayer.appendChild(iconMarker(obj.icon[0], obj.icon[1], "existing-icon"));
    });
    if (iconPt) iconLayer.appendChild(iconMarker(iconPt[0], iconPt[1], "current-icon"));
  }

  function redraw() {
    currentPoly.setAttribute("points",
      points.map(function (p) { return p[0] + "," + p[1]; }).join(" "));
    pointsGroup.innerHTML = "";
    /* Dots are sized to a fixed pixel radius (converted into the SVG's
       0–100 space), so they stay a tiny constant size on screen no matter
       how far you've zoomed in — never covering the edge you're tracing. */
    var rPx = 1.1;
    points.forEach(function (p) {
      var c = document.createElementNS(SVG_NS, "ellipse");
      c.setAttribute("class", "pt");
      c.setAttribute("cx", p[0]);
      c.setAttribute("cy", p[1]);
      c.setAttribute("rx", rPx * 100 / room.offsetWidth);
      c.setAttribute("ry", rPx * 100 / room.offsetHeight);
      pointsGroup.appendChild(c);
    });
    drawIcons();                       /* keep markers sized to the zoom */
    if (mode === "icon") return;       /* the icon panel owns the readout */
    countEl.textContent = points.length + (points.length === 1 ? " point" : " points");
    output.value = points.length >= 3 ? snippet() : "(need at least 3 points)";
  }

  function iconSnippet() {
    return "icon: [" + round1(iconPt[0]) + ", " + round1(iconPt[1]) + "]";
  }
  function setIconPoint(x, y) {
    iconPt = [x, y];
    drawIcons();
    output.value = iconSnippet();
    countEl.textContent = "icon point set — copied to clipboard";
    if (navigator.clipboard) navigator.clipboard.writeText(output.value);
    else { output.select(); document.execCommand("copy"); }
  }

  /* ── The generated config lines ─────────────────────────────────────── */

  /* Decimal places for the copied coordinates. 2 ≈ 0.27px on the 2738px
     image (sub-pixel, smooth on any display) and is plenty; bump to 3 only
     if you trace pixel-tight detail at full zoom. 1 (the old value) snapped
     to a ~2.7px grid, which collapsed close points and distorted edges. */
  var COORD_DECIMALS = 2;
  function round1(n) {
    var f = Math.pow(10, COORD_DECIMALS);
    return Math.round(n * f) / f;
  }

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
    if (mode === "icon") { setIconPoint(x, y); return; }
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
    var x = ((t.clientX - rect.left) / rect.width) * 100;
    var y = ((t.clientY - rect.top) / rect.height) * 100;
    if (mode === "icon") { setIconPoint(x, y); return; }
    points.push([x, y]);
    redraw();
  });

  /* ── The panel ──────────────────────────────────────────────────────── */

  var panel = document.createElement("div");
  panel.id = "editor-panel";
  panel.innerHTML =
    '<h3 id="ed-drag" title="Drag to move this panel">Hotspot editor <span class="ed-grip">⠿</span></h3>' +
    '<p>Click around an object\u2019s edge to trace it. Drag or scroll to pan, ' +
    'pinch or \u2318/Ctrl-scroll to zoom in close. Drag this panel\u2019s title ' +
    'bar to move it. Gold shapes are hotspots that already exist.</p>' +
    '<div class="row">' +
    '  <button id="ed-undo">Undo point</button>' +
    '  <button id="ed-clear">Clear</button>' +
    '  <button id="ed-copy">Copy config</button>' +
    '</div>' +
    '<div class="row">' +
    '  <button id="ed-pick-icon">Pick icon point</button>' +
    '</div>' +
    '<div class="row" id="ed-zoom-row">' +
    '  <button id="ed-zoom-out" title="Zoom out">\u2212</button>' +
    '  <span id="ed-zoom-label">100%</span>' +
    '  <button id="ed-zoom-in" title="Zoom in">+</button>' +
    '  <button id="ed-zoom-reset">Reset</button>' +
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

  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      points.pop();
      redraw();
    }
  });

  document.getElementById("ed-undo").addEventListener("click", function () {
    if (mode === "icon") setMode("outline");
    points.pop(); redraw();
  });
  document.getElementById("ed-clear").addEventListener("click", function () {
    if (mode === "icon") setMode("outline");
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

  var pickBtn = document.getElementById("ed-pick-icon");
  function setMode(next) {
    mode = next;
    pickBtn.textContent = (mode === "icon") ? "Done picking" : "Pick icon point";
    document.body.classList.toggle("picking-icon", mode === "icon");
    if (mode === "icon") {
      countEl.textContent = "click where the mote should sit";
      output.value = iconPt ? iconSnippet() : "(click a point in the room)";
    } else {
      redraw();
    }
  }
  pickBtn.addEventListener("click", function () {
    setMode(mode === "icon" ? "outline" : "icon");
  });

  /* ── Zoom & pan ──────────────────────────────────────────────────────
     The room is scaled by changing its layout width; the image, hotspots
     and SVG overlay are all sized in % so they scale together and the click
     math (which reads getBoundingClientRect) stays correct at any zoom.
     Panning is the room's normal scroll — enabled on both axes in edit mode
     (style.css) so you can reach the top and bottom edges too. */
  var zoomLabel = document.getElementById("ed-zoom-label");
  var zoom = 1, baseW = 0;
  var MAX_ZOOM = 16;

  function setZoom(target, cx, cy) {
    target = Math.max(1, Math.min(MAX_ZOOM, target));
    var rect = room.getBoundingClientRect();
    if (!baseW) baseW = rect.width;            /* width at zoom 1 (first call) */
    /* The image fraction currently under the zoom anchor (cursor or center). */
    var fx = (cx - rect.left) / rect.width;
    var fy = (cy - rect.top) / rect.height;
    zoom = target;
    room.style.width = (baseW * zoom) + "px";
    /* After the resize, scroll so that same fraction sits back under the
       anchor — so you zoom INTO the point you're pointing at. */
    var nr = room.getBoundingClientRect();
    viewport.scrollLeft += (nr.left + fx * nr.width) - cx;
    viewport.scrollTop += (nr.top + fy * nr.height) - cy;
    if (zoomLabel) zoomLabel.textContent = Math.round(zoom * 100) + "%";
    redraw();                                  /* dots are sized from room width */
  }

  function zoomToCenter(factor) {
    var r = viewport.getBoundingClientRect();
    setZoom(zoom * factor, r.left + r.width / 2, r.top + r.height / 2);
  }

  /* Pinch (trackpad) and ⌘/Ctrl-scroll arrive as a wheel event with
     ctrlKey set; we take it over so it zooms the room — far past what the
     browser's own page-zoom allows — instead of the whole page. Plain
     scroll is left alone, so it still pans. */
  room.addEventListener("wheel", function (e) {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    setZoom(zoom * Math.exp(-e.deltaY * 0.01), e.clientX, e.clientY);
  }, { passive: false });

  document.getElementById("ed-zoom-in").addEventListener("click", function () { zoomToCenter(1.5); });
  document.getElementById("ed-zoom-out").addEventListener("click", function () { zoomToCenter(1 / 1.5); });
  document.getElementById("ed-zoom-reset").addEventListener("click", function () { zoomToCenter(1 / zoom); });

  redraw();
})();
