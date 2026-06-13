/* ════════════════════════════════════════════════════════════════════════
   CONFIG — the only file you should need to edit as the room grows.

   TABLE OF CONTENTS
   [1] ROOM_OBJECTS     the clickable things and where they lead
   [2] WELCOME_OPTIONS  the guest-chair conversation
   [3] DOOR             door image geometry (only if you regenerate it)

   ── Anatomy of an object ───────────────────────────────────────────────
   id       unique name, no spaces
   label    what the object is, e.g. "The desk lamp" (used by screen
            readers and the editor — visitors see `title` instead)
   title    the examine-card heading: what this is ABOUT
   flavor   the card text — your voice, speaking to the visitor
   image    optional preview at the top of the card. Put a screenshot
            or logo at this path; if the file doesn't exist yet, the
            card simply shows without an image. (See README.)
   links    the card's buttons: { label, url }. Every link opens in a
            new tab. An empty url hides that button until you fill it in.
   tags     which welcome answers make it shimmer: work, accompaniment,
            projects, creative — or "everyone" for all of them.
            An object can carry several tags.
   hitbox   clickable rectangle, % of the image: [left, top, width, height]
   outline  the glowing shape, % polygon: [[x, y], [x, y], ...]

   → To trace a new hitbox + outline, open the site with ?edit on the
     URL (e.g. index.html?edit) and click around the object. The editor
     generates these two lines for you. Full steps in the README.

   The object with welcome: true opens the welcome dialog instead.
   ════════════════════════════════════════════════════════════════════════ */

/* [1] ─── ROOM OBJECTS ─────────────────────────────────────────────────── */
const ROOM_OBJECTS = [
  {
    id: "guest-chair",
    welcome: true,
    label: "The guest chair",
    tags: ["everyone"],
hitbox: [15.7, 52, 25.2, 33.3],
outline: [
  [24.4, 84.6], [25.1, 84.8], [25.2, 83.9], [25.5, 82.9], [26.4, 79], [26.6, 77.2], [26.9, 76.3], [26.9, 76.1], [27, 75.9], [27.2, 74.8], [27.3, 74.5], [27.4, 74.5], [27.6, 74.5], [30.8, 73.2], [36.9, 70.6], [38.9, 79.7], [39.2, 79.6], [39.4, 79.5], [38.9, 75.5], [38.5, 72.9], [38.1, 70.3], [40.2, 69], [40.2, 68.2], [39.9, 67.8], [40.1, 67.6], [40.4, 67.1], [40.4, 66.2], [40.3, 64.9], [39.7, 64.5], [38.5, 63.8], [37.6, 63.4], [37.4, 61.7], [38.2, 61.5], [38.4, 61.2], [38.4, 60.6], [38.1, 60.3], [37.7, 60.3], [33.2, 61.8], [32.7, 61.7], [32.1, 61.7], [30.9, 61.9], [30.6, 62], [30.9, 58.6], [31, 58.1], [31.1, 57.7], [30.4, 57.6], [28.6, 58], [27.4, 56.2], [26.7, 55.6], [25.8, 55], [23.1, 53.7], [22, 53.2], [21.7, 53.2], [21.7, 53.9], [18.9, 53], [18.1, 52.7], [17.6, 52.5], [17.1, 52.6], [16.3, 53.2], [16.2, 53.3], [17.8, 61.9], [19.4, 69.8], [19.4, 70.1], [20.1, 70.9], [20.7, 71.4], [20.1, 74.5], [19.2, 79.8], [19.8, 80], [20.5, 77.3], [20.7, 76.4], [21.2, 73.8], [21.5, 72.9], [21.6, 72.4], [25.6, 74.5], [26, 74.5], [25.6, 76.8], [25.7, 77.1], [25.5, 77.4], [25.3, 78.6], [25.4, 78.7], [25.3, 78.8], [24.9, 81.1], [25.2, 81.3], [24.9, 81.4], [24.8, 82.3], [24.8, 82.6], [24.7, 82.7], [24.5, 83.7]
]
  },

  {
    id: "hibiscus-tea",
    label: "The hibiscus tea",
    title: "Buy me a tea",
    flavor:
      "Hibiscus — my favorite. If what I'm building here means something " +
      "to you, you can put the kettle on for the next cup.",
    image: "assets/previews/tea.jpg",
    links: [
      { label: "Buy me a tea",
        url: "https://buymeacoffee.com/samarehjack" }   /* ← replace */
    ],
    tags: ["everyone"],
hitbox: [47.7, 48.4, 4.4, 3.8],
outline: [
  [48.7, 50.8], [48.3, 50.3], [48.2, 49.9], [48.4, 49.5], [48.7, 49.5], [48.8, 49.1], [49.1, 48.9], [50.3, 48.9], [50.8, 49], [50.9, 49.2], [50.9, 49.6], [50.7, 50.7], [51.4, 50.8], [51.6, 51], [51.5, 51.2], [50.9, 51.6], [48.8, 51.7], [48.2, 51.2], [48.2, 51], [48.7, 50.9]
]
  },

  {
    id: "computer",
    label: "The computer",
    title: "My professional work",
    flavor:
      "Where I've worked and what I've built — my resume and my " +
      "LinkedIn, if you'd like the official record.",
    image: "assets/previews/work.jpg",
    links: [
      { label: "Read my resume",
        url: "assets/resume.pdf" },
      { label: "Open my LinkedIn",
        url: "https://www.linkedin.com/in/samareh-jack-5b1713a/" }
        /* ↑ found by search — confirm this is yours */
    ],
    tags: ["work"],
hitbox: [54.7, 37.3, 9.7, 15],
outline: [
  [56.1, 38.1], [63.8, 37.8], [63.9, 37.9], [62.9, 48.4], [62.4, 48.6], [62.9, 50.4], [62.9, 50.8], [62.8, 51.2], [62.4, 51.3], [60.8, 51.8], [57.6, 51.3], [57.6, 51.2], [59.2, 50.6], [59.4, 50.6], [59.9, 50.6], [60.8, 50.9], [60.6, 48.9], [55.4, 49.9], [55.3, 49.9], [55.2, 49.8], [56, 38.2], [56.1, 38.2]
]
  },

  {
    id: "couch",
    label: "The couch",
    title: "Professional Accompaniment",
    flavor:
      "Short-term support for when something feels stuck. Not therapy, " +
      "not coaching, not consulting — I walk alongside you while you " +
      "figure out what you actually want and how to act on it. The work " +
      "is designed to end: as your own clarity returns, I step away.",
    image: "assets/previews/accompany.jpg",
    links: [
      { label: "See if it fits",
        url: "https://accompany.samarehjack.com" }
    ],
    tags: ["accompaniment"],
hitbox: [66.7, 48.3, 33.3, 47.2],
outline: [
  [83.7, 48.9], [84.9, 48.8], [85.6, 48.9], [90, 50.5], [91.7, 51.4], [99.9, 55.4], [99.8, 89.5], [83.5, 90.1], [82.5, 94.9], [81.4, 94.9], [80.9, 94.1], [80.6, 89.4], [68.9, 70.1], [68.6, 71.3], [68.3, 71.6], [67.9, 71.4], [67.7, 71], [67.7, 67.7], [67.2, 67.1], [67.3, 54.1], [67.4, 53.9], [67.5, 53.7], [68.5, 53.5], [76.1, 53.4], [76.7, 50.9], [76.8, 50], [77, 49.6], [77.6, 49.9], [78.8, 50.5], [80.4, 51], [81.6, 51.1], [82.6, 51], [83.1, 49.9]
]
  },

  {
    id: "desk-lamp",
    label: "The desk lamp",
    title: "Creedal AI",
    flavor:
      "Today's AI will deceive to protect itself, tells you what you " +
      "want to hear, and substitutes for the human connection it should " +
      "be encouraging. I believe an AI built values-first from the " +
      "ground up can truly serve people — and I'm setting out to prove it.",
    image: "assets/previews/creedal.jpg",
    links: [
      { label: "Read where I'm starting",
        url: "https://ai.samarehjack.com" }
    ],
    tags: ["projects"],
hitbox: [31.2, 36.9, 8.1, 13.1],
outline: [
  [34.8, 38.7], [34.9, 38.8], [34.8, 39.4], [34, 40.3], [33.7, 40.9], [33.7, 41.6], [33.7, 42], [33.9, 42], [34.8, 41.7], [36.5, 41.1], [38.7, 40.1], [38.8, 40], [38.6, 40], [38.2, 39.4], [37.9, 39.1], [37.5, 38.9], [37.2, 38.9], [36.6, 38.9], [36.2, 38.9], [36, 38.6], [35.8, 38], [35.6, 37.7], [35.3, 37.5], [35.1, 37.4], [35, 37.6], [34.7, 37.8], [34.7, 38.1], [34.6, 38.3], [34.4, 38.3], [34.3, 38.4], [33.6, 38.9], [33, 39.4], [32.5, 40], [32.1, 40.8], [31.9, 41.7], [31.9, 42.6], [32.1, 43.6], [32.5, 44.9], [32.8, 46.3], [33, 46.6], [32.8, 46.6], [33, 46.8], [32.8, 47.2], [33, 47.5], [33, 47.7], [32.6, 48.4], [32.1, 48.5], [31.7, 48.8], [31.7, 49.3], [32.1, 49.4], [33, 49.5], [34.6, 49.4], [34.5, 49.1], [34.5, 48.8], [34.6, 48.6], [33.5, 48.2], [33.3, 47.8], [33.3, 47.5], [33.4, 47.5], [33.4, 47.2], [33.3, 47.1], [33.2, 46.9], [33.3, 46.8], [33.2, 46.6], [33, 45.8], [32.6, 44.5], [32.3, 43.2], [32.2, 42.3], [32.2, 42], [32.2, 41.4], [32.3, 41], [32.4, 40.7], [32.5, 40.3], [32.7, 40.1], [33, 39.8], [33.3, 39.5], [33.7, 39.3], [34.1, 39], [34.3, 38.9], [34.5, 38.7]
]
  },

  {
    id: "coat",
    label: "The coat by the window",
    title: "Just Show Up",
    flavor:
      "Free and low-cost family events near home — Madison, Wisconsin " +
      "for now. No planning, no digging through feeds: see what's on, " +
      "grab your coat, and just show up.",
    image: "assets/previews/justshowup.jpg",
    links: [
      { label: "See what's on",
        url: "https://justshowup.fyi" }
    ],
    tags: ["projects"],
hitbox: [23.4, 30.3, 6.1, 18.7],
outline: [
  [24.7, 34.3], [24.8, 32.3], [25.2, 31], [25.6, 30.8], [26.2, 30.9], [26.6, 31.3], [27, 33.1], [27.1, 33.6], [27.6, 34.7], [27.8, 35], [27.8, 35.8], [28.4, 38.5], [28.8, 40.5], [28.9, 42], [28.9, 43.2], [28.8, 44.6], [28.9, 45.5], [29.1, 47.5], [28.7, 47.7], [28.2, 47.7], [27.8, 47.5], [27.8, 48.1], [27.4, 48.3], [27.1, 48.4], [26.6, 48.5], [26.4, 48.3], [26.2, 47.9], [26.2, 47.3], [26, 48], [24.3, 47.8], [24.4, 46.7], [24.3, 45.5], [24.3, 43], [24.3, 39.8], [24.3, 38.2], [24.2, 37], [23.9, 35.6]
]
  },

  {
    id: "rug",
    label: "The rug",
    title: "Consensus",
    flavor:
      "An app for groups that decide together. It starts values-first: " +
      "before any decision, the group finds what it actually shares — " +
      "not what's urgent, not what's loudest — and builds on that " +
      "common ground.",
    image: "assets/previews/consensus.jpg",
    links: [
      { label: "Find common ground",
        url: "https://consensus.samarehjack.com" }
    ],
    tags: ["projects"],
hitbox: [18.7, 74.3, 47.3, 17.7],
outline: [
  [27.3, 74.8], [60.4, 75.5], [65.5, 91.5], [19.2, 91.5], [26.7, 75]
]
  }

  /* ── Waiting to move in (no pages to link yet) ──────────────────────
       songs on video ................. tags: ["creative"]
       Bahá'í writings set to music ... tags: ["creative"]
       leatherwork & shoemaking ....... tags: ["creative"]
       ambigrams ...................... tags: ["creative"]
       books (adult & children's) ..... tags: ["creative"]
       math curriculum ................ tags: ["projects"]
       blog ........................... tags: ["everyone"]
     Copy any object above as a template; trace coordinates with ?edit.
  ─────────────────────────────────────────────────────────────────── */
];

/* [2] ─── WELCOME OPTIONS ──────────────────────────────────────────────
   `tags` decides which objects shimmer after the answer.
   An option with wander: true pulses everything once, shimmers nothing.
   Responses describe what's here in general terms — the shimmer is what
   points at things, not the words. */
const WELCOME_OPTIONS = [
  {
    text: "I'm hiring, or curious about your professional work",
    tags: ["work"],
    response:
      "Then you'll want my resume and LinkedIn — the official record " +
      "of where I've been and what I've built."
  },
  {
    text: "I'm interested in accompaniment",
    tags: ["accompaniment"],
    response:
      "I call it professional accompaniment — short-term support while " +
      "you get unstuck, designed from the start to end. There's more " +
      "here if you'd like to read."
  },
  {
    text: "Show me the apps and ideas",
    tags: ["projects"],
    response:
      "An idea for AI built values-first, a way to find free things to " +
      "do nearby, and an app for deciding together. They're all here."
  },
  {
    text: "I came for the music, leather, and writing",
    tags: ["creative"],
    response:
      "Songs, Bahá'í writings set to music, handmade shoes, ambigrams, " +
      "and books are on their way — that side of the room is still " +
      "being unpacked. Come back soon."
  },
  {
    text: "Just wandering",
    wander: true,
    tags: [],
    response:
      "The best way to visit. Anything that glows when you pass over " +
      "it will tell you about itself."
  }
];

/* [3] ─── DOOR GEOMETRY ────────────────────────────────────────────────
   Only changes if you regenerate the door image (assets/door.jpg,
   currently 1536 × 2752). All values are % of that image.
     leaf  = the door panel that swings. Match it to the painted leaf's
             edges: left edge = the hinge side, right = the handle side.
             This rectangle is both what swings AND what the walk-up zooms
             to fill the screen.
     plate = the brass nameplate center (where your name is overlaid) */
const DOOR = {
  aspect: 1536 / 2752,
  leaf:  { x1: 21.0, y1: 11.5, x2: 74.0, y2: 80.5 },
  plate: { cx: 50.0, cy: 27.8 }
};
