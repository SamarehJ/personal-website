/* ════════════════════════════════════════════════════════════════════════
   SAMAREH JACK — THE OFFICE · main logic

   You shouldn't need to edit this file; the room is configured in
   js/config.js. This file is organized so you CAN read and change it:

   TABLE OF CONTENTS
   [1] Setup — element handles, session storage helpers
   [2] Hotspots — built from ROOM_OBJECTS
   [3] Highlight model — beckon / reveal / shimmer rules
   [4] Examine card — object popups
   [5] Welcome flow — the guest chair conversation
   [6] Modal plumbing — open/close/escape, shared by both cards
   [7] Room layout & panning — sizing, centering, drag-to-pan
   [8] The door — idle, walk-up, swing, step-in
   [9] Boot — what runs on page load
   ════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* [1] ─── SETUP ──────────────────────────────────────────────────────── */

  var reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ?edit on the URL switches the site into polygon-tracing mode
     (see js/editor.js). Main logic skips the door and stays out of
     the editor's way. */
  var EDIT_MODE = new URLSearchParams(window.location.search).has("edit");

  var viewport = document.getElementById("viewport");
  var room = document.getElementById("room");
  var roomImg = document.getElementById("room-img");
  var lookAround = document.getElementById("look-around");

  var doorOverlay = document.getElementById("door-overlay");
  var doorZoom = document.getElementById("door-zoom");
  var doorPos = document.getElementById("door-pos");
  var doorLeaf = document.getElementById("door-leaf");
  var doorLeafImg = document.getElementById("door-leaf-img");
  var doorPlate = document.getElementById("door-plate");

  var examineBackdrop = document.getElementById("examine-backdrop");
  var examineImage = document.getElementById("examine-image");
  var examineTitle = document.getElementById("examine-title");
  var examineText = document.getElementById("examine-text");
  var examineActions = document.getElementById("examine-actions");
  var examineStay = document.getElementById("examine-stay");

  var welcomeBackdrop = document.getElementById("welcome-backdrop");
  var welcomeTitle = document.getElementById("welcome-title");
  var welcomeOptions = document.getElementById("welcome-options");
  var welcomeResponse = document.getElementById("welcome-response");
  var welcomeActions = document.getElementById("welcome-actions");
  var welcomeDone = document.getElementById("welcome-done");

  /* Session storage: remembers, within one browser tab session,
     that you entered, what you answered, and what you've examined.
     A new tab or window starts fresh (so the door plays again). */
  function ss(key, val) {
    if (arguments.length === 2) { sessionStorage.setItem(key, val); return val; }
    return sessionStorage.getItem(key);
  }
  function welcomeSeen() { return ss("welcomeSeen") === "1"; }
  function visited() {
    try { return JSON.parse(ss("visited")) || []; } catch (e) { return []; }
  }
  function markVisited(id) {
    var v = visited();
    if (v.indexOf(id) === -1) { v.push(id); ss("visited", JSON.stringify(v)); }
  }
  function visitorChoice() {
    try { return JSON.parse(ss("visitorChoice")); } catch (e) { return null; }
  }

  /* [2] ─── HOTSPOTS ───────────────────────────────────────────────────
     For each object in config: an invisible button (the hitbox) and a
     glow layer (the room image clipped to the object's outline).      */

  var glowWraps = {};   /* id → glow element, for the highlight model */

  ROOM_OBJECTS.forEach(function (obj) {
    var hit = document.createElement("button");
    hit.className = "hitbox";
    hit.style.left = obj.hitbox[0] + "%";
    hit.style.top = obj.hitbox[1] + "%";
    hit.style.width = obj.hitbox[2] + "%";
    hit.style.height = obj.hitbox[3] + "%";
    hit.setAttribute("aria-label", obj.label);
    hit.addEventListener("click", function () {
      if (obj.welcome) openWelcome();
      else openExamine(obj);
    });

    var wrap = document.createElement("div");
    wrap.className = "glow-wrap";
    var shape = document.createElement("div");
    shape.className = "glow-shape";
    shape.style.clipPath =
      "polygon(" +
      obj.outline.map(function (p) { return p[0] + "% " + p[1] + "%"; }).join(", ") +
      ")";
    wrap.appendChild(shape);

    room.appendChild(hit);
    room.appendChild(wrap);   /* must directly follow its hitbox (CSS `+`) */
    glowWraps[obj.id] = wrap;
  });

  /* [3] ─── HIGHLIGHT MODEL ────────────────────────────────────────────
     The room's grammar:
       beckon  — only the welcome chair, until the welcome is answered
       reveal  — pulse twice: "these are for you"
       shimmer — faint standing marker on relevant, not-yet-examined
                 objects; examining one clears it
     Hover/tap always works on everything, regardless of any of this. */

  function setState(wrap, cls) {
    wrap.classList.remove("beckon", "reveal", "shimmer");
    if (cls) wrap.classList.add(cls);
  }

  /* Is this object relevant to the visitor's welcome answer? */
  function isRelevant(obj, choice) {
    if (!choice || choice.wander) return false;
    if (obj.tags.indexOf("everyone") !== -1) return true;
    return obj.tags.some(function (t) { return choice.tags.indexOf(t) !== -1; });
  }

  /* Put every object into its correct resting state. Safe to call
     any time; used after welcome, after examining, after pulses. */
  function applyStandingState() {
    var choice = visitorChoice();
    var seen = visited();
    ROOM_OBJECTS.forEach(function (obj) {
      var wrap = glowWraps[obj.id];
      if (obj.welcome) {
        setState(wrap, welcomeSeen() ? null : "beckon");
      } else if (isRelevant(obj, choice) && seen.indexOf(obj.id) === -1) {
        setState(wrap, "shimmer");
      } else {
        setState(wrap, null);
      }
    });
  }

  /* Pulse a set of objects twice, then settle into standing state. */
  function pulseThenSettle(ids) {
    ids.forEach(function (id) {
      var wrap = glowWraps[id];
      setState(wrap, null);
      void wrap.offsetWidth;            /* flush, so the animation restarts */
      wrap.classList.add("reveal");
      wrap.addEventListener("animationend", function handler() {
        wrap.removeEventListener("animationend", handler);
        applyStandingState();
      });
    });
    if (reducedMotion) setTimeout(applyStandingState, 50);
  }

  lookAround.addEventListener("click", function () {
    pulseThenSettle(ROOM_OBJECTS.map(function (o) { return o.id; }));
  });

  /* [4] ─── EXAMINE CARD ──────────────────────────────────────────────── */

  var lastFocus = null;   /* restore keyboard focus after a card closes */

  function openExamine(obj) {
    lastFocus = document.activeElement;

    examineTitle.textContent = obj.title || obj.label;
    examineText.textContent = obj.flavor || "";

    /* Preview image: show if configured; hide itself if missing. */
    examineImage.hidden = true;
    if (obj.image) {
      examineImage.onload = function () { examineImage.hidden = false; };
      examineImage.onerror = function () { examineImage.hidden = true; };
      examineImage.src = obj.image;
    }

    /* Rebuild this card's link buttons (everything opens a new tab;
       a link with an empty url is simply not shown). */
    examineActions.querySelectorAll(".btn-primary").forEach(function (b) { b.remove(); });
    (obj.links || []).forEach(function (link) {
      if (!link.url) return;
      var b = document.createElement("button");
      b.className = "btn btn-primary";
      b.textContent = link.label;
      b.addEventListener("click", function () {
        window.open(link.url, "_blank", "noopener");
        closeModal(examineBackdrop);
      });
      examineActions.insertBefore(b, examineStay);
    });

    markVisited(obj.id);
    applyStandingState();               /* examining clears this shimmer */
    examineBackdrop.hidden = false;
    examineStay.focus();
  }

  examineStay.addEventListener("click", function () { closeModal(examineBackdrop); });

  /* [5] ─── WELCOME FLOW ──────────────────────────────────────────────── */

  function openWelcome() {
    lastFocus = document.activeElement;
    welcomeTitle.textContent = "Welcome. What brings you by?";
    welcomeResponse.hidden = true;
    welcomeActions.hidden = true;
    welcomeOptions.hidden = false;
    welcomeOptions.innerHTML = "";

    WELCOME_OPTIONS.forEach(function (opt) {
      var b = document.createElement("button");
      b.textContent = opt.text;
      b.addEventListener("click", function () { chooseOption(opt); });
      welcomeOptions.appendChild(b);
    });

    welcomeBackdrop.hidden = false;
  }

  function chooseOption(opt) {
    welcomeOptions.hidden = true;
    welcomeTitle.textContent = "Glad you're here.";
    welcomeResponse.textContent = opt.response;
    welcomeResponse.hidden = false;
    welcomeActions.hidden = false;
    welcomeDone.focus();

    ss("welcomeSeen", "1");
    ss("visitorChoice", JSON.stringify({ tags: opt.tags, wander: !!opt.wander }));
  }

  /* After the card closes: chair stops beckoning; the visitor's
     relevant objects (or everything, for a wanderer) pulse twice. */
  function settleAfterWelcome() {
    var choice = visitorChoice();
    if (!choice) { applyStandingState(); return; }
    var ids = ROOM_OBJECTS
      .filter(function (o) {
        if (o.welcome) return false;
        return choice.wander || isRelevant(o, choice);
      })
      .map(function (o) { return o.id; });
    applyStandingState();
    pulseThenSettle(ids);
  }

  welcomeDone.addEventListener("click", function () {
    closeModal(welcomeBackdrop);
    settleAfterWelcome();
  });

  /* [6] ─── MODAL PLUMBING ────────────────────────────────────────────── */

  function closeModal(backdrop) {
    backdrop.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* Click outside a card closes it (and still settles the welcome
     if an answer was chosen). */
  [examineBackdrop, welcomeBackdrop].forEach(function (bd) {
    bd.addEventListener("click", function (e) {
      if (e.target !== bd) return;
      var choseWelcome =
        bd === welcomeBackdrop && welcomeSeen() && !welcomeActions.hidden;
      closeModal(bd);
      if (choseWelcome) settleAfterWelcome();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!examineBackdrop.hidden) closeModal(examineBackdrop);
    else if (!welcomeBackdrop.hidden) {
      var chose = welcomeSeen() && !welcomeActions.hidden;
      closeModal(welcomeBackdrop);
      if (chose) settleAfterWelcome();
    }
  });

  /* [7] ─── ROOM LAYOUT & PANNING ─────────────────────────────────────── */

  /* The resting view is the room's layout size, which is cover × the
     --enter-zoom token (set in css). To begin the step-in exactly at
     cover (filling the screen, no black bars), we start the room scaled
     DOWN by 1/enter-zoom, then animate the transform back to 1. */
  function enterZoom() {
    var v = getComputedStyle(document.documentElement)
              .getPropertyValue("--enter-zoom");
    var n = parseFloat(v);
    return (n && n > 0) ? n : 1.06;
  }

  function centerScroll(offsetX) {
    viewport.scrollLeft =
      (room.offsetWidth - viewport.clientWidth) / 2 + (offsetX || 0);
    viewport.scrollTop =
      (room.offsetHeight - viewport.clientHeight) / 2;
  }

  /* The pan hint: land slightly left of center, glide to center —
     one continuous motion that quietly says "this view moves". */
  function driftToCenter() {
    var overflow = (room.offsetWidth - viewport.clientWidth) / 2;
    var delta = Math.min(room.offsetWidth * 0.05, Math.max(overflow, 0));
    if (delta < 8 || reducedMotion) { centerScroll(0); return; }
    centerScroll(-delta);
    var from = viewport.scrollLeft;
    var to = from + delta;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / 1100, 1);
      var eased = 1 - Math.pow(1 - t, 3);   /* ease-out cubic */
      viewport.scrollLeft = from + (to - from) * eased;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Drag-to-pan with the mouse. Touch devices pan natively. */
  var dragging = false, sx = 0, sy = 0, sl = 0, st = 0;
  viewport.addEventListener("mousedown", function (e) {
    if (e.target.closest(".hitbox") || e.target.closest(".card")) return;
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    sl = viewport.scrollLeft; st = viewport.scrollTop;
  });
  window.addEventListener("mousemove", function (e) {
    if (!dragging) return;
    viewport.scrollLeft = sl - (e.clientX - sx);
    viewport.scrollTop = st - (e.clientY - sy);
  });
  window.addEventListener("mouseup", function () { dragging = false; });

  /* [8] ─── THE DOOR ──────────────────────────────────────────────────
     Sequence:  idle (slow one-way push toward the door)
              → click: walk up until the frame leaves the screen,
                       nameplate gliding to center
              → the door swings INWARD on its left hinge, revealing
                       the lit room behind it (the dark backdrop is on
                       the swinging layer, so it leaves with the door)
              → the room steps forward from full view to full size
              → drifts to center. Done.                               */

  var doorPhase = "idle";   /* idle | approaching | opening | done */

  /* Size and place the hallway image to cover the screen, with the
     nameplate around 40% down. (The nameplate itself is positioned in
     CSS, as a % of this image.) Returns the measurements the walk-up
     math needs. */
  function layoutDoor() {
    var vw = doorOverlay.clientWidth, vh = doorOverlay.clientHeight;
    var w = Math.max(vw, vh * DOOR.aspect);
    var h = w / DOOR.aspect;
    var left = (vw - w) / 2;
    var top = vh * 0.40 - (DOOR.plate.cy / 100) * h;
    top = Math.min(0, Math.max(vh - h, top));   /* never show past edges */
    doorPos.style.left = left + "px";
    doorPos.style.top = top + "px";
    doorPos.style.width = w + "px";
    doorPos.style.height = h + "px";
    doorPos.style.transformOrigin = DOOR.plate.cx + "% " + DOOR.plate.cy + "%";

    /* The swinging leaf: a box over the leaf region, with its copy of the
       image offset so only the leaf shows through. */
    var lx = (DOOR.leaf.x1 / 100) * w;
    var ly = (DOOR.leaf.y1 / 100) * h;
    var lw = ((DOOR.leaf.x2 - DOOR.leaf.x1) / 100) * w;
    var lh = ((DOOR.leaf.y2 - DOOR.leaf.y1) / 100) * h;
    doorLeaf.style.left = lx + "px";
    doorLeaf.style.top = ly + "px";
    doorLeaf.style.width = lw + "px";
    doorLeaf.style.height = lh + "px";
    doorLeafImg.style.width = w + "px";
    doorLeafImg.style.height = h + "px";
    doorLeafImg.style.left = -lx + "px";
    doorLeafImg.style.top = -ly + "px";

    /* Nameplate, placed within the leaf box so it swings with the leaf. */
    doorPlate.style.left =
      ((DOOR.plate.cx - DOOR.leaf.x1) / (DOOR.leaf.x2 - DOOR.leaf.x1) * 100) + "%";
    doorPlate.style.top =
      ((DOOR.plate.cy - DOOR.leaf.y1) / (DOOR.leaf.y2 - DOOR.leaf.y1) * 100) + "%";
    doorPlate.style.width = "42%";
    doorPlate.style.transform = "translate(-50%, -50%)";
    doorPlate.style.fontSize = (w * 0.024) + "px";

    return { vw: vw, vh: vh, w: w, h: h, left: left, top: top };
  }

  /* The walk-up: scale about the nameplate until the door slab covers
     the whole screen, while translating the nameplate to screen center. */
  function approachDoor() {
    var m = layoutDoor();
    var leafW = ((DOOR.leaf.x2 - DOOR.leaf.x1) / 100) * m.w;
    var leafH = ((DOOR.leaf.y2 - DOOR.leaf.y1) / 100) * m.h;
    /* Where the plate sits inside the leaf (as fractions) */
    var fx = (DOOR.plate.cx - DOOR.leaf.x1) / (DOOR.leaf.x2 - DOOR.leaf.x1);
    var fy = (DOOR.plate.cy - DOOR.leaf.y1) / (DOOR.leaf.y2 - DOOR.leaf.y1);
    /* Smallest scale at which the leaf fills the screen with the plate
       pinned at (50% width, 42% height), plus a small safety margin. */
    var s = Math.max(
      (0.50 * m.vw) / (fx * leafW),
      (0.50 * m.vw) / ((1 - fx) * leafW),
      (0.42 * m.vh) / (fy * leafH),
      (0.58 * m.vh) / ((1 - fy) * leafH)
    ) * 1.02;

    /* Freeze the idle drift where it currently is, then take over. */
    var drift = getComputedStyle(doorPos).transform;
    doorPos.classList.remove("drifting");
    doorPos.style.transform = drift === "none" ? "" : drift;

    var plateX = m.left + (DOOR.plate.cx / 100) * m.w;
    var plateY = m.top + (DOOR.plate.cy / 100) * m.h;
    doorZoom.style.transformOrigin = plateX + "px " + plateY + "px";
    doorZoom.style.transform =
      "translate(" + (0.50 * m.vw - plateX) + "px, " +
                     (0.42 * m.vh - plateY) + "px) scale(" + s + ")";
  }

  /* The room waits behind the door already filling the screen (cover),
     centered. */
  function prepareRoomBehindDoor() {
    centerScroll(0);
    if (!reducedMotion)
      room.style.transform = "scale(" + (1 / enterZoom()) + ")";
  }

  /* Stepping forward: from cover (fills the page) to the resting view
     (a little tighter) — one gentle push in, no pulse. */
  function stepIntoRoom() {
    viewport.classList.add("inside");
    if (reducedMotion) {
      room.style.transform = "";          /* rest at the enter-zoom view */
      centerScroll(0);
      finishEntry();
      return;
    }
    room.classList.add("stepping");
    room.style.transform = "scale(1)";    /* layout already includes the zoom */
    room.addEventListener("transitionend", function handler() {
      room.removeEventListener("transitionend", handler);
      room.classList.remove("stepping");
      room.style.transform = "";
      driftToCenter();
      finishEntry();
    });
  }

  function finishEntry() {
    ss("entered", "1");
    lookAround.hidden = false;
    requestAnimationFrame(function () { lookAround.classList.add("shown"); });
  }

  function beginEntrance() {
    if (doorPhase !== "idle") return;
    doorPhase = "approaching";
    doorOverlay.classList.add("approaching");
    prepareRoomBehindDoor();

    if (reducedMotion) {
      doorPhase = "opening";
      doorOverlay.classList.add("opening");
      doorLeaf.addEventListener("animationend", function () {
        doorOverlay.hidden = true;
        doorPhase = "done";
        stepIntoRoom();
      });
      return;
    }

    approachDoor();
    doorZoom.addEventListener("transitionend", function handler() {
      doorZoom.removeEventListener("transitionend", handler);
      setTimeout(function () {            /* a beat at the threshold */
        doorPhase = "opening";
        doorOverlay.classList.add("opening");   /* transparent + swing opens */
        setTimeout(stepIntoRoom, 340);    /* step in mid-swing */
        doorLeaf.addEventListener("animationend", function () {
          doorOverlay.hidden = true;
          doorPhase = "done";
        });
      }, 200);
    });
  }

  doorOverlay.addEventListener("click", beginEntrance);
  doorOverlay.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); beginEntrance(); }
  });

  /* [9] ─── BOOT ──────────────────────────────────────────────────────── */

  function skipDoor() {
    doorOverlay.hidden = true;
    doorPhase = "done";
    viewport.classList.add("inside");
    centerScroll(0);
    lookAround.hidden = false;
    lookAround.classList.add("shown");
  }

  function boot() {
    applyStandingState();
    if (EDIT_MODE) {
      skipDoor();                  /* editor needs the room, not the door */
      lookAround.hidden = true;
    } else if (ss("entered") === "1") {
      skipDoor();                  /* already came in this session */
    } else {
      layoutDoor();
      centerScroll(0);
    }
  }

  window.addEventListener("resize", function () {
    if (doorPhase === "idle") layoutDoor();
    if (doorPhase === "done") centerScroll(0);
  });

  if (roomImg.complete) boot();
  else roomImg.addEventListener("load", boot);
})();
