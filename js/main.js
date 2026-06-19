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
  var doorImg = document.getElementById("door-img");           /* the hallway photo */
  var doorLeaf = document.getElementById("door-leaf");
  var doorPlate = document.getElementById("door-plate");        /* rides the zoom */
  var doorLeafPlate = document.getElementById("door-leaf-plate"); /* on the swing */

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

  var whyBackdrop = document.getElementById("why-backdrop");
  var whyLink = document.getElementById("why-link");
  var whyClose = document.getElementById("why-close");
  var whyEyebrow = document.getElementById("why-eyebrow");
  var whyTitle = document.getElementById("why-title");
  var whyBody = document.getElementById("why-body");
  var whyCard = whyBackdrop.querySelector(".card");

  var siteWrapper = document.getElementById("site-wrapper");
  var wrapperFrame = document.getElementById("wrapper-frame");
  var wrapperTitle = document.getElementById("wrapper-title");
  var wrapperBack = document.getElementById("wrapper-back");
  var wrapperNewtab = document.getElementById("wrapper-newtab");

  var aboutBackdrop = document.getElementById("about-backdrop");
  var aboutEyebrow = document.getElementById("about-eyebrow");
  var aboutTitle = document.getElementById("about-title");
  var aboutTeaser = document.getElementById("about-teaser");
  var aboutFull = document.getElementById("about-full");
  var aboutMore = document.getElementById("about-more");
  var aboutClose = document.getElementById("about-close");
  var aboutCard = aboutBackdrop.querySelector(".card");

  var contactBackdrop = document.getElementById("contact-backdrop");
  var contactEyebrow = document.getElementById("contact-eyebrow");
  var contactTitle = document.getElementById("contact-title");
  var contactIntro = document.getElementById("contact-intro");
  var contactForm = document.getElementById("contact-form");
  var contactSubmit = document.getElementById("contact-submit");
  var contactClose = document.getElementById("contact-close");
  var contactStatus = document.getElementById("contact-status");
  var contactDoneActions = document.getElementById("contact-done-actions");
  var contactDoneClose = document.getElementById("contact-done-close");

  var guestbookBackdrop = document.getElementById("guestbook-backdrop");
  var guestbookEyebrow = document.getElementById("guestbook-eyebrow");
  var guestbookTitle = document.getElementById("guestbook-title");
  var guestbookEntries = document.getElementById("guestbook-entries");
  var guestbookListView = document.getElementById("guestbook-list-view");
  var guestbookSignView = document.getElementById("guestbook-sign-view");
  var guestbookSignOpen = document.getElementById("guestbook-sign-open");
  var guestbookClose = document.getElementById("guestbook-close");
  var guestbookPrompt = document.getElementById("guestbook-prompt");
  var guestbookSubmit = document.getElementById("guestbook-submit");
  var guestbookBack = document.getElementById("guestbook-back");
  var guestbookThanks = document.getElementById("guestbook-thanks");
  var guestbookDoneActions = document.getElementById("guestbook-done-actions");
  var guestbookDoneClose = document.getElementById("guestbook-done-close");
  var guestbookCard = guestbookBackdrop.querySelector(".card");

  var directoryOpen = document.getElementById("directory-open");
  var directoryBackdrop = document.getElementById("directory-backdrop");
  var directoryEyebrow = document.getElementById("directory-eyebrow");
  var directoryTitle = document.getElementById("directory-title");
  var directoryIntro = document.getElementById("directory-intro");
  var directoryList = document.getElementById("directory-list");
  var directoryClose = document.getElementById("directory-close");

  /* State lives in memory only, so every page load is a fresh visit:
     the door plays each time, and the shimmer resets — something you
     clicked on a previous visit shimmers again until you click it THIS
     visit. Nothing is remembered across refreshes by design. */
  var state = { welcomeSeen: false, choice: null, visited: [] };
  function welcomeSeen() { return state.welcomeSeen; }
  function visited() { return state.visited; }
  function markVisited(id) {
    if (state.visited.indexOf(id) === -1) state.visited.push(id);
  }
  function visitorChoice() { return state.choice; }

  /* [2] ─── HOTSPOTS ───────────────────────────────────────────────────
     For each object in config: an invisible button (the hitbox) and a
     glow layer (the room image clipped to the object's outline).      */

  var glowWraps = {};   /* id → ARRAY of glow elements (one per shape) */

  /* What a click on any of an object's parts does. */
  function activate(obj) {
    if (obj.welcome) openWelcome();
    else if (obj.about) openAbout(obj);
    else if (obj.contact) openContact(obj);
    else if (obj.guestbook) openGuestbook(obj);
    else openExamine(obj);
  }

  /* Light (or unlight) every one of an object's parts together, so a
     two-piece object — e.g. a chair split by the desk — responds as one. */
  function setHover(id, on) {
    glowWraps[id].forEach(function (w) { w.classList.toggle("lit", on); });
  }

  ROOM_OBJECTS.forEach(function (obj) {
    /* An object is one or more shapes, each its own hitbox + glow outline.
       Multi-part objects use `shapes: [{hitbox, outline}, ...]`; a plain
       `hitbox`/`outline` is treated as a single shape. */
    var shapes = obj.shapes || [{ hitbox: obj.hitbox, outline: obj.outline }];
    var wraps = [];

    shapes.forEach(function (s) {
      var hit = document.createElement("button");
      hit.className = "hitbox";
      hit.style.left = s.hitbox[0] + "%";
      hit.style.top = s.hitbox[1] + "%";
      hit.style.width = s.hitbox[2] + "%";
      hit.style.height = s.hitbox[3] + "%";
      hit.setAttribute("aria-label", obj.label);
      hit.addEventListener("click", function () { activate(obj); });

      /* Hover (or keyboard focus) on any part lights ALL of the object's
         parts. Focus only when keyboard-driven, so a closing card doesn't
         leave the object lit when focus returns to its hitbox. */
      hit.addEventListener("mouseenter", function () { setHover(obj.id, true); });
      hit.addEventListener("mouseleave", function () { setHover(obj.id, false); });
      hit.addEventListener("focus", function () {
        if (hit.matches(":focus-visible")) setHover(obj.id, true);
      });
      hit.addEventListener("blur", function () { setHover(obj.id, false); });

      var wrap = document.createElement("div");
      wrap.className = "glow-wrap";
      var glow = document.createElement("div");
      glow.className = "glow-shape";
      glow.style.clipPath =
        "polygon(" +
        s.outline.map(function (p) { return p[0] + "% " + p[1] + "%"; }).join(", ") +
        ")";
      wrap.appendChild(glow);

      room.appendChild(hit);
      room.appendChild(wrap);
      wraps.push(wrap);
    });

    glowWraps[obj.id] = wraps;
  });

  /* [3] ─── HIGHLIGHT MODEL ────────────────────────────────────────────
     The room's grammar:
       beckon  — only the welcome chair, until the welcome is answered
       reveal  — pulse twice: "these are for you"
       shimmer — faint standing marker on relevant, not-yet-examined
                 objects; examining one clears it
     Hover/tap always works on everything, regardless of any of this. */

  function setState(id, cls) {
    glowWraps[id].forEach(function (w) {
      w.classList.remove("beckon", "reveal", "shimmer");
      if (cls) w.classList.add(cls);
    });
  }

  /* Is this object relevant to the visitor's welcome answer?
     "everyone"-tagged things (the tea, later the blog) shimmer for every
     visitor — including the "just wandering" crowd. Tagged matches only
     apply to visitors who picked a matching answer. */
  function isRelevant(obj, choice) {
    if (!choice) return false;
    var tags = obj.tags || [];            /* no tags = never shimmers */
    if (tags.indexOf("everyone") !== -1) return true;
    if (choice.wander) return false;
    return tags.some(function (t) { return choice.tags.indexOf(t) !== -1; });
  }

  /* Put every object into its correct resting state. Safe to call
     any time; used after welcome, after examining, after pulses. */
  function applyStandingState() {
    var choice = visitorChoice();
    var seen = visited();
    ROOM_OBJECTS.forEach(function (obj) {
      if (obj.welcome) {
        setState(obj.id, welcomeSeen() ? null : "beckon");
      } else if (isRelevant(obj, choice) && seen.indexOf(obj.id) === -1) {
        setState(obj.id, "shimmer");
      } else {
        setState(obj.id, null);
      }
    });
  }

  /* Pulse a set of objects twice, then settle into standing state. */
  function pulseThenSettle(ids) {
    ids.forEach(function (id) {
      var wraps = glowWraps[id];
      wraps.forEach(function (w) {
        w.classList.remove("beckon", "reveal", "shimmer");
        void w.offsetWidth;             /* flush, so the animation restarts */
        w.classList.add("reveal");
      });
      wraps[0].addEventListener("animationend", function handler() {
        wraps[0].removeEventListener("animationend", handler);
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

    /* Rebuild this card's link buttons. An empty url is simply not shown.
       embed:true opens the link INSIDE the office (the wrapper); everything
       else opens a new tab. Either way the card closes first, so a later
       "Back to the room" returns to the room, not this popup. */
    examineActions.querySelectorAll(".btn-primary").forEach(function (b) { b.remove(); });
    (obj.links || []).forEach(function (link) {
      if (!link.url) return;
      var b = document.createElement("button");
      b.className = "btn btn-primary";
      b.textContent = link.label;
      b.addEventListener("click", function () {
        closeModal(examineBackdrop);
        if (link.embed) openWrapper(link.url, obj.title || obj.label);
        else window.open(link.url, "_blank", "noopener");
      });
      examineActions.insertBefore(b, examineStay);
    });

    markVisited(obj.id);
    applyStandingState();               /* examining clears this shimmer */
    examineBackdrop.hidden = false;
    examineStay.focus();
  }

  examineStay.addEventListener("click", function () { closeModal(examineBackdrop); });

  /* ─── THE SITE WRAPPER ───────────────────────────────────────────────
     Opens an embed:true link inside the office. The room stays mounted
     underneath; closing the wrapper just hides it and reveals the room
     exactly as it was — never the door, never the examine card (which the
     link click already closed). */
  function openWrapper(url, title) {
    lastFocus = document.activeElement;        /* so we return where we came from */
    wrapperTitle.textContent = title || "";
    wrapperNewtab.href = url;
    wrapperFrame.src = url;
    siteWrapper.hidden = false;
    wrapperBack.focus();
  }
  function closeWrapper() {
    if (siteWrapper.hidden) return;
    siteWrapper.hidden = true;
    wrapperFrame.src = "about:blank";          /* stop the embedded page */
    /* Back to wherever it opened from — a room hotspot, or the directory. */
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    else if (!lookAround.hidden) lookAround.focus();
  }
  wrapperBack.addEventListener("click", closeWrapper);
  /* Clicking the dimmed office around the panel also returns to the room. */
  siteWrapper.addEventListener("click", function (e) {
    if (e.target === siteWrapper) closeWrapper();
  });

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

    state.welcomeSeen = true;
    state.choice = { tags: opt.tags, wander: !!opt.wander };
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

  /* Fill the "why AI" card from config (WHY_AI) — same source as the rest
     of the visitor-facing words. */
  function renderWhy() {
    whyEyebrow.textContent = WHY_AI.eyebrow;
    whyTitle.textContent = WHY_AI.title;
    whyClose.textContent = WHY_AI.close;
    whyBody.innerHTML = "";
    WHY_AI.body.forEach(function (para) {
      var p = document.createElement("p");
      p.className = "card-body";
      p.textContent = para;
      whyBody.appendChild(p);
    });
  }
  renderWhy();

  /* The "why AI" footnote button opens a card layered over the welcome. */
  function openWhy() {
    lastFocus = document.activeElement;
    whyBackdrop.hidden = false;
    whyCard.scrollTop = 0;                       /* always open at the top */
    whyClose.focus({ preventScroll: true });     /* …focusing must not scroll it down */
  }
  whyLink.addEventListener("click", openWhy);
  whyClose.addEventListener("click", function () { closeModal(whyBackdrop); });

  /* Render a list of items into a container. A string becomes a .card-body
     paragraph; a nested array becomes a bulleted list. */
  function renderParas(container, items) {
    container.innerHTML = "";
    (items || []).forEach(function (item) {
      if (Array.isArray(item)) {
        var ul = document.createElement("ul");
        ul.className = "card-list";
        item.forEach(function (point) {
          var li = document.createElement("li");
          li.textContent = point;
          ul.appendChild(li);
        });
        container.appendChild(ul);
      } else {
        var p = document.createElement("p");
        p.className = "card-body";
        p.textContent = item;
        container.appendChild(p);
      }
    });
  }

  /* ─── ABOUT ME (the desk chair) ──────────────────────────────────────
     Teaser first; "read more" swaps in the full text. */
  aboutEyebrow.textContent = ABOUT.eyebrow;
  aboutTitle.textContent = ABOUT.title;
  aboutMore.textContent = ABOUT.readMore;
  renderParas(aboutTeaser, ABOUT.teaser);
  renderParas(aboutFull, ABOUT.full);

  function openAbout(obj) {
    lastFocus = document.activeElement;
    markVisited(obj.id);
    applyStandingState();
    aboutFull.hidden = true;            /* always start on the teaser */
    aboutTeaser.hidden = false;
    aboutMore.hidden = false;
    aboutBackdrop.hidden = false;
    aboutCard.scrollTop = 0;
    aboutMore.focus({ preventScroll: true });
  }
  aboutMore.addEventListener("click", function () {
    aboutTeaser.hidden = true;
    aboutFull.hidden = false;
    aboutMore.hidden = true;
    aboutCard.scrollTop = 0;
  });
  aboutClose.addEventListener("click", function () { closeModal(aboutBackdrop); });

  /* ─── FORM POST (contact + guest book) ───────────────────────────────
     AJAX to Formspree so the visitor never leaves the office. */
  function postForm(form, onResult) {
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var submitBtn = form.querySelector("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;
    fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    }).then(function (res) {
      if (submitBtn) submitBtn.disabled = false;
      onResult(res.ok);
    }).catch(function () {
      if (submitBtn) submitBtn.disabled = false;
      onResult(false);
    });
  }
  var SEND_ERROR =
    "Something went wrong sending that — please try again in a moment.";

  /* ─── CONTACT (the pencil holder) ─────────────────────────────────────── */
  contactEyebrow.textContent = CONTACT.eyebrow;
  contactTitle.textContent = CONTACT.title;
  contactIntro.textContent = CONTACT.intro;
  contactSubmit.textContent = CONTACT.submit;

  function openContact(obj) {
    lastFocus = document.activeElement;
    markVisited(obj.id);
    applyStandingState();
    contactForm.reset();
    contactForm.hidden = false;
    contactStatus.hidden = true;
    contactStatus.classList.remove("is-error");
    contactDoneActions.hidden = true;
    contactBackdrop.hidden = false;
    contactForm.querySelector("input[name=name]").focus({ preventScroll: true });
  }
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    postForm(contactForm, function (ok) {
      contactStatus.hidden = false;
      if (ok) {
        contactForm.hidden = true;
        contactStatus.textContent = CONTACT.success;
        contactStatus.classList.remove("is-error");
        contactDoneActions.hidden = false;     /* a way back to the room */
      } else {
        contactStatus.textContent = SEND_ERROR;
        contactStatus.classList.add("is-error");
      }
    });
  });
  contactClose.addEventListener("click", function () { closeModal(contactBackdrop); });
  contactDoneClose.addEventListener("click", function () { closeModal(contactBackdrop); });

  /* ─── GUEST BOOK (the books) ──────────────────────────────────────────── */
  guestbookEyebrow.textContent = GUESTBOOK.eyebrow;
  guestbookTitle.textContent = GUESTBOOK.title;
  guestbookSignOpen.textContent = GUESTBOOK.signLabel;
  guestbookSubmit.textContent = GUESTBOOK.submit;
  guestbookPrompt.textContent = GUESTBOOK.prompt;

  function renderGuestbookEntries() {
    guestbookEntries.innerHTML = "";
    var entries = GUESTBOOK.entries || [];
    if (!entries.length) {
      var empty = document.createElement("p");
      empty.className = "gb-empty";
      empty.textContent = "No entries yet — yours could be the first.";
      guestbookEntries.appendChild(empty);
      return;
    }
    entries.forEach(function (entry) {
      var wrap = document.createElement("div");
      wrap.className = "gb-entry";
      var note = document.createElement("p");
      note.className = "gb-note";
      note.textContent = "“" + (entry.note || "") + "”";
      wrap.appendChild(note);
      var by = document.createElement("p");
      by.className = "gb-by";
      var name = entry.name || "Anonymous";
      if (entry.link && /^https?:\/\//i.test(entry.link)) {
        by.appendChild(document.createTextNode("— "));
        var a = document.createElement("a");
        a.href = entry.link;
        a.target = "_blank";
        a.rel = "noopener";
        a.textContent = name;
        by.appendChild(a);
      } else {
        by.textContent = "— " + name;
      }
      wrap.appendChild(by);
      guestbookEntries.appendChild(wrap);
    });
  }
  renderGuestbookEntries();

  function showGuestbookList() {
    guestbookSignView.hidden = true;
    guestbookThanks.hidden = true;
    guestbookDoneActions.hidden = true;
    guestbookListView.hidden = false;
    guestbookCard.scrollTop = 0;
  }
  function openGuestbook(obj) {
    lastFocus = document.activeElement;
    markVisited(obj.id);
    applyStandingState();
    guestbookSignView.reset();
    guestbookThanks.classList.remove("is-error");
    showGuestbookList();
    guestbookBackdrop.hidden = false;
    guestbookSignOpen.focus({ preventScroll: true });
  }
  guestbookSignOpen.addEventListener("click", function () {
    guestbookListView.hidden = true;
    guestbookThanks.hidden = true;
    guestbookSignView.hidden = false;
    guestbookCard.scrollTop = 0;
    guestbookSignView.querySelector("input[name=name]").focus({ preventScroll: true });
  });
  guestbookBack.addEventListener("click", showGuestbookList);
  guestbookSignView.addEventListener("submit", function (e) {
    e.preventDefault();
    postForm(guestbookSignView, function (ok) {
      guestbookThanks.hidden = false;
      if (ok) {
        guestbookSignView.hidden = true;
        guestbookListView.hidden = true;
        guestbookThanks.textContent = GUESTBOOK.thanks;
        guestbookThanks.classList.remove("is-error");
        guestbookDoneActions.hidden = false;       /* a way back to the room */
        guestbookCard.scrollTop = 0;
      } else {
        guestbookThanks.textContent = SEND_ERROR;   /* shown below the form */
        guestbookThanks.classList.add("is-error");
      }
    });
  });
  guestbookClose.addEventListener("click", function () { closeModal(guestbookBackdrop); });
  guestbookDoneClose.addEventListener("click", function () { closeModal(guestbookBackdrop); });

  /* ─── DIRECTORY (the plain-list index / hub) ─────────────────────────
     Built from DIRECTORY.order (your chosen order), then any non-welcome
     object you didn't list, so nothing goes missing. Each row shows the
     object's title and its link(s): external links open out, in-room ones
     (about / contact / guest book) open their panel OVER the directory and
     return here on close. */
  function directoryObjects() {
    /* Non-welcome objects, sorted by each object's `order` number. Objects
       without an `order` fall to the end, keeping their ROOM_OBJECTS order. */
    return ROOM_OBJECTS
      .filter(function (o) { return !o.welcome; })
      .map(function (o, i) {
        return { o: o, i: i, k: (typeof o.order === "number" ? o.order : Infinity) };
      })
      .sort(function (a, b) { return (a.k - b.k) || (a.i - b.i); })
      .map(function (x) { return x.o; });
  }

  function makeDirLink(label, arrow, onClick, href) {
    var el;
    if (href) {                         /* a real navigation → a real <a> */
      el = document.createElement("a");
      el.href = href;
      el.target = "_blank";
      el.rel = "noopener";
    } else {
      el = document.createElement("button");
      el.type = "button";
      el.addEventListener("click", onClick);
    }
    el.className = "dir-link";
    el.textContent = label + " " + arrow;
    return el;
  }

  function renderDirectory() {
    directoryEyebrow.textContent = DIRECTORY.eyebrow;
    directoryTitle.textContent = DIRECTORY.title;
    directoryIntro.textContent = DIRECTORY.intro;
    directoryList.innerHTML = "";

    directoryObjects().forEach(function (obj) {
      var row = document.createElement("div");
      row.className = "dir-row";
      var name = document.createElement("span");
      name.className = "dir-name";
      name.textContent =
        obj.about ? "About me" :
        obj.contact ? "Contact" :
        obj.guestbook ? "Guest book" :
        (obj.title || obj.label);
      row.appendChild(name);

      if (obj.links && obj.links.length) {
        obj.links.forEach(function (link) {
          if (!link.url) return;
          if (link.embed) {
            row.appendChild(makeDirLink(link.label, "→", function () {
              openWrapper(link.url, obj.title || obj.label);
            }));
          } else {
            row.appendChild(makeDirLink(link.label, "↗", null, link.url));
          }
        });
      } else if (obj.about) {
        row.appendChild(makeDirLink(ABOUT.readMore || "Read about me", "→",
          function () { openAbout(obj); }));
      } else if (obj.contact) {
        row.appendChild(makeDirLink("Get in touch", "→",
          function () { openContact(obj); }));
      } else if (obj.guestbook) {
        row.appendChild(makeDirLink(GUESTBOOK.signLabel || "Sign the guest book", "→",
          function () { openGuestbook(obj); }));
      }
      directoryList.appendChild(row);
    });
  }
  renderDirectory();

  function openDirectory() {
    lastFocus = document.activeElement;
    directoryBackdrop.hidden = false;
    directoryBackdrop.querySelector(".card").scrollTop = 0;
    var first = directoryList.querySelector(".dir-link");
    (first || directoryClose).focus({ preventScroll: true });
  }
  directoryOpen.addEventListener("click", openDirectory);
  directoryClose.addEventListener("click", function () { closeModal(directoryBackdrop); });

  /* [6] ─── MODAL PLUMBING ────────────────────────────────────────────── */

  function closeModal(backdrop) {
    backdrop.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* Click outside a card closes it (and still settles the welcome
     if an answer was chosen). */
  [examineBackdrop, welcomeBackdrop, whyBackdrop,
   aboutBackdrop, contactBackdrop, guestbookBackdrop, directoryBackdrop].forEach(function (bd) {
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
    /* The wrapper sits above everything, so it closes first. */
    if (!siteWrapper.hidden) closeWrapper();
    /* The why card layers over the welcome, so it closes next. */
    else if (!whyBackdrop.hidden) closeModal(whyBackdrop);
    else if (!examineBackdrop.hidden) closeModal(examineBackdrop);
    else if (!aboutBackdrop.hidden) closeModal(aboutBackdrop);
    else if (!contactBackdrop.hidden) closeModal(contactBackdrop);
    else if (!guestbookBackdrop.hidden) closeModal(guestbookBackdrop);
    else if (!directoryBackdrop.hidden) closeModal(directoryBackdrop);
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

  /* How far left of center the room is first revealed, giving the settle
     somewhere to glide from. Capped so it stays a hint, never a lurch. */
  function driftDelta() {
    var overflow = (room.offsetWidth - viewport.clientWidth) / 2;
    return Math.min(room.offsetWidth * 0.05, Math.max(overflow, 0));
  }

  /* The pan hint: the room is revealed slightly left of center (set while
     it's still hidden behind the door, so there's no snap), and this glides
     it the rest of the way to center — one continuous motion that quietly
     says "this view moves". Animates FROM the current position; it never
     teleports first, which is what used to cause a jolt at the end of the
     step-in. */
  function driftToCenter() {
    var to = (room.offsetWidth - viewport.clientWidth) / 2;   /* true center */
    var from = viewport.scrollLeft;
    if (reducedMotion || Math.abs(to - from) < 8) { centerScroll(0); return; }
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / 2400, 1);   /* slow, unhurried glide */
      /* ease-in-out cubic: eases in AND out, gentle at both ends */
      var eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      viewport.scrollLeft = from + (to - from) * eased;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Drag-to-pan with the mouse — horizontal only; the vertical axis stays
     locked at center (see #viewport.inside), so you can't drag to the
     photo's top or bottom edge. Touch devices pan horizontally natively. */
  var dragging = false, sx = 0, sl = 0;
  viewport.addEventListener("mousedown", function (e) {
    if (e.target.closest(".hitbox") || e.target.closest(".card")) return;
    dragging = true;
    sx = e.clientX;
    sl = viewport.scrollLeft;
  });
  window.addEventListener("mousemove", function (e) {
    if (!dragging) return;
    viewport.scrollLeft = sl - (e.clientX - sx);
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

    /* The approach nameplate, painted on the full image so it's visible as
       you walk up (it rides the zoom). The swinging leaf gets its own
       matching plate at open time. */
    doorPlate.style.left = DOOR.plate.cx + "%";
    doorPlate.style.top = DOOR.plate.cy + "%";
    doorPlate.style.fontSize = (w * 0.024) + "px";

    return { vw: vw, vh: vh, w: w, h: h, left: left, top: top };
  }

  /* Build the swinging leaf from wherever the door image is ON SCREEN right
     now (after the walk-up zoom). The leaf is a top-level panel — not inside
     the zoomed/translated #door-zoom — so its 3D isn't flattened by a parent
     transform. We crop its background to exactly the door leaf and drop a
     matching nameplate on it, so it's pixel-identical to what's underneath
     the instant we swap and swing. */
  function openLeaf() {
    var r = doorImg.getBoundingClientRect();   /* full image, on screen, post-zoom */
    var L = DOOR.leaf;
    var lx = r.left + (L.x1 / 100) * r.width;
    var ly = r.top  + (L.y1 / 100) * r.height;
    var lw = ((L.x2 - L.x1) / 100) * r.width;
    var lh = ((L.y2 - L.y1) / 100) * r.height;

    doorLeaf.style.left = lx + "px";
    doorLeaf.style.top = ly + "px";
    doorLeaf.style.width = lw + "px";
    doorLeaf.style.height = lh + "px";
    doorLeaf.style.backgroundImage = "url('assets/door.jpg')";
    doorLeaf.style.backgroundSize = r.width + "px " + r.height + "px";
    doorLeaf.style.backgroundPosition =
      (-(L.x1 / 100) * r.width) + "px " + (-(L.y1 / 100) * r.height) + "px";

    /* Matching plate, positioned by where it sits inside the leaf box. */
    doorLeafPlate.style.left =
      ((DOOR.plate.cx - L.x1) / (L.x2 - L.x1) * 100) + "%";
    doorLeafPlate.style.top =
      ((DOOR.plate.cy - L.y1) / (L.y2 - L.y1) * 100) + "%";
    doorLeafPlate.style.fontSize = (r.width * 0.024) + "px";

    doorLeaf.hidden = false;
    /* force layout so the swap + animation start cleanly */
    void doorLeaf.offsetWidth;
    doorOverlay.classList.add("opening");   /* hide #door-zoom, reveal room */
    doorLeaf.classList.add("swing");
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
    /* Reveal the room a touch left of center. It's still hidden behind the
       door when this runs, so the offset can't be seen as a jump; the
       step-in holds it there and driftToCenter glides it home. */
    var d = reducedMotion ? 0 : driftDelta();
    centerScroll(d < 8 ? 0 : -d);
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
    viewport.removeAttribute("inert");   /* the room is interactive now */
    lookAround.hidden = false;
    directoryOpen.hidden = false;
    requestAnimationFrame(function () {
      lookAround.classList.add("shown");
      directoryOpen.classList.add("shown");
    });
    lookAround.focus();                  /* move focus off the (hidden) door */
  }

  function beginEntrance() {
    if (doorPhase !== "idle") return;
    doorPhase = "approaching";
    doorOverlay.classList.add("approaching");
    prepareRoomBehindDoor();

    if (reducedMotion) {
      doorPhase = "opening";
      openLeaf();
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
        openLeaf();                       /* lift the leaf out and swing it */
        setTimeout(stepIntoRoom, 340);    /* step into the room mid-swing */
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
    if (EDIT_MODE) {
      skipDoor();                  /* editor needs the room, not the door */
      lookAround.hidden = true;
      return;                      /* no beckon/shimmer glow while tracing */
    }
    applyStandingState();
    layoutDoor();                  /* the door greets every visit */
    centerScroll(0);
    /* The room sits behind the door: make it non-interactive so a keyboard
       visitor can't tab to (or activate) hotspots through the closed door,
       and focus the door so Enter/Space opens it on arrival. */
    viewport.setAttribute("inert", "");
    doorOverlay.focus();
  }

  window.addEventListener("resize", function () {
    if (doorPhase === "idle") layoutDoor();
    if (doorPhase === "done") centerScroll(0);
  });

  if (roomImg.complete) boot();
  else roomImg.addEventListener("load", boot);
})();
