/* ════════════════════════════════════════════════════════════════════════
   CONFIG — the only file you should need to edit as the room grows.

   TABLE OF CONTENTS
   [1] ROOM_OBJECTS     the clickable things and where they lead
   [2] WELCOME_OPTIONS  the guest-chair conversation
   [3] WHY_AI           the "why there's AI" note (welcome footnote)
   [4] ABOUT            the about-me text (the desk chair)
   [5] CONTACT          the message form copy (the pencil holder)
   [6] GUESTBOOK        the guest book: prompt, thanks, and entries
   [7] DIRECTORY        the plain-list index + its order
   [8] DOOR             door image geometry (only if you regenerate it)

   ── Anatomy of an object ───────────────────────────────────────────────
   id       unique name, no spaces
   label    what the object is, e.g. "The desk lamp" (used by screen
            readers and the editor — visitors see `title` instead)
   title    the examine-card heading: what this is ABOUT
   flavor   the card text — your voice, speaking to the visitor
   image    optional preview at the top of the card. Put a screenshot
            or logo at this path; if the file doesn't exist yet, the
            card simply shows without an image. (See README.)
   links    the card's buttons: { label, url, embed }. An empty url hides
            that button until you fill it in. Add `embed: true` to open the
            link INSIDE the office (a framed panel with a "Back to the room"
            bar) instead of a new tab — only works for sites that allow
            framing (your own pages and PDFs do; LinkedIn and Buy Me a Coffee
            don't, so leave those without embed and they open a new tab).
   tags     which welcome answers make it shimmer: work, accompaniment,
            projects, creative — or "everyone" for all of them.
            An object can carry several tags.
   order    OPTIONAL number — where this sits in the directory list
            (lower = higher up). No `order` = falls to the end.
   hitbox   clickable rectangle, % of the image: [left, top, width, height]
   outline  the glowing shape, % polygon: [[x, y], [x, y], ...]
   shapes   OPTIONAL — for an object that shows in two (or more) separate
            pieces (e.g. a chair split by the desk). A list of
            { hitbox, outline } pairs; click or hover any piece and they
            all light together. Use this INSTEAD of hitbox/outline:
              shapes: [ { hitbox:[…], outline:[…] },
                        { hitbox:[…], outline:[…] } ]
            Trace each piece separately with ?edit and paste them in.

   → To trace a new hitbox + outline, open the site with ?edit on the
     URL (e.g. index.html?edit) and click around the object. The editor
     generates these two lines for you. Full steps in the README.

   The object with welcome: true opens the welcome dialog instead.
   ════════════════════════════════════════════════════════════════════════ */

/* [1] ─── ROOM OBJECTS ─────────────────────────────────────────────────── */
const ROOM_OBJECTS = [
  
  {
    id: "rug",
    order: 5,
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
        url: "https://consensus.samarehjack.com", embed: true }
    ],
    tags: ["projects"],
hitbox: [18.7, 74.3, 47.3, 17.7],
outline: [
  [27.3, 74.8], [60.4, 75.5], [65.5, 91.5], [19.2, 91.5], [26.7, 75]
]
  },
  
  {
    id: "guest-chair",
    welcome: true,
    label: "The guest chair",
    tags: [],
hitbox: [15.7, 52, 25.2, 33.3],
outline: [
  [24.4, 84.6], [25.1, 84.8], [25.2, 83.9], [25.5, 82.9], [26.4, 79], [26.6, 77.2], [26.9, 76.3], [26.9, 76.1], [27, 75.9], [27.2, 74.8], [27.3, 74.5], [27.4, 74.5], [27.6, 74.5], [30.8, 73.2], [36.9, 70.6], [38.9, 79.7], [39.2, 79.6], [39.4, 79.5], [38.9, 75.5], [38.5, 72.9], [38.1, 70.3], [40.2, 69], [40.2, 68.2], [39.9, 67.8], [40.1, 67.6], [40.4, 67.1], [40.4, 66.2], [40.3, 64.9], [39.7, 64.5], [38.5, 63.8], [37.6, 63.4], [37.4, 61.7], [38.2, 61.5], [38.4, 61.2], [38.4, 60.6], [38.1, 60.3], [37.7, 60.3], [33.2, 61.8], [32.7, 61.7], [32.1, 61.7], [30.9, 61.9], [30.6, 62], [30.9, 58.6], [31, 58.1], [31.1, 57.7], [30.4, 57.6], [28.6, 58], [27.4, 56.2], [26.7, 55.6], [25.8, 55], [23.1, 53.7], [22, 53.2], [21.7, 53.2], [21.7, 53.9], [18.9, 53], [18.1, 52.7], [17.6, 52.5], [17.1, 52.6], [16.3, 53.2], [16.2, 53.3], [17.8, 61.9], [19.4, 69.8], [19.4, 70.1], [20.1, 70.9], [20.7, 71.4], [20.1, 74.5], [19.2, 79.8], [19.8, 80], [20.5, 77.3], [20.7, 76.4], [21.2, 73.8], [21.5, 72.9], [21.6, 72.4], [25.6, 74.5], [26, 74.5], [25.6, 76.8], [25.7, 77.1], [25.5, 77.4], [25.3, 78.6], [25.4, 78.7], [25.3, 78.8], [24.9, 81.1], [25.2, 81.3], [24.9, 81.4], [24.8, 82.3], [24.8, 82.6], [24.7, 82.7], [24.5, 83.7]
]
  },

  {
    id: "computer",
    order: 2,
    label: "The computer",
    title: "My professional work",
    flavor:
      "Where I've worked and what I've built — my resume and my " +
      "LinkedIn, if you'd like the official record.",
    image: "assets/previews/work.jpg",
    links: [
      { label: "Read my resume",
        url: "assets/resume.pdf", embed: true },
      { label: "Open my LinkedIn",
        url: "https://www.linkedin.com/in/samareh-jack-5b1713a/" }
    ],
    tags: ["work"],
hitbox: [54.7, 37.3, 9.7, 15],
outline: [
  [56.1, 38.1], [63.8, 37.8], [63.9, 37.9], [62.9, 48.4], [62.4, 48.6], [62.9, 50.4], [62.9, 50.8], [62.8, 51.2], [62.4, 51.3], [60.8, 51.8], [57.6, 51.3], [57.6, 51.2], [59.2, 50.6], [59.4, 50.6], [59.9, 50.6], [60.8, 50.9], [60.6, 48.9], [55.4, 49.9], [55.3, 49.9], [55.2, 49.8], [56, 38.2], [56.1, 38.2]
]
  },

  {
    id: "couch",
    order: 3,
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
        url: "https://accompany.samarehjack.com", embed: true }
    ],
    tags: ["accompaniment"],
hitbox: [66.7, 48.3, 33.3, 47.2],
outline: [
  [83.7, 48.9], [84.9, 48.8], [85.6, 48.9], [90, 50.5], [91.7, 51.4], [99.9, 55.4], [99.8, 89.5], [83.5, 90.1], [82.5, 94.9], [81.4, 94.9], [80.9, 94.1], [80.6, 89.4], [68.9, 70.1], [68.6, 71.3], [68.3, 71.6], [67.9, 71.4], [67.7, 71], [67.7, 67.7], [67.2, 67.1], [67.3, 54.1], [67.4, 53.9], [67.5, 53.7], [68.5, 53.5], [76.1, 53.4], [76.7, 50.9], [76.8, 50], [77, 49.6], [77.6, 49.9], [78.8, 50.5], [80.4, 51], [81.6, 51.1], [82.6, 51], [83.1, 49.9]
]
  },
  
  {
    id: "desk-lamp",
    order: 6,
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
        url: "https://ai.samarehjack.com", embed: true }
    ],
    tags: ["projects"],
hitbox: [31.2, 36.9, 8.1, 13.1],
outline: [
  [34.8, 38.7], [34.9, 38.8], [34.8, 39.4], [34, 40.3], [33.7, 40.9], [33.7, 41.6], [33.7, 42], [33.9, 42], [34.8, 41.7], [36.5, 41.1], [38.7, 40.1], [38.8, 40], [38.6, 40], [38.2, 39.4], [37.9, 39.1], [37.5, 38.9], [37.2, 38.9], [36.6, 38.9], [36.2, 38.9], [36, 38.6], [35.8, 38], [35.6, 37.7], [35.3, 37.5], [35.1, 37.4], [35, 37.6], [34.7, 37.8], [34.7, 38.1], [34.6, 38.3], [34.4, 38.3], [34.3, 38.4], [33.6, 38.9], [33, 39.4], [32.5, 40], [32.1, 40.8], [31.9, 41.7], [31.9, 42.6], [32.1, 43.6], [32.5, 44.9], [32.8, 46.3], [33, 46.6], [32.8, 46.6], [33, 46.8], [32.8, 47.2], [33, 47.5], [33, 47.7], [32.6, 48.4], [32.1, 48.5], [31.7, 48.8], [31.7, 49.3], [32.1, 49.4], [33, 49.5], [34.6, 49.4], [34.5, 49.1], [34.5, 48.8], [34.6, 48.6], [33.5, 48.2], [33.3, 47.8], [33.3, 47.5], [33.4, 47.5], [33.4, 47.2], [33.3, 47.1], [33.2, 46.9], [33.3, 46.8], [33.2, 46.6], [33, 45.8], [32.6, 44.5], [32.3, 43.2], [32.2, 42.3], [32.2, 42], [32.2, 41.4], [32.3, 41], [32.4, 40.7], [32.5, 40.3], [32.7, 40.1], [33, 39.8], [33.3, 39.5], [33.7, 39.3], [34.1, 39], [34.3, 38.9], [34.5, 38.7]
]
  },

  {
    id: "books",
    order: 8,
    guestbook: true,
    label: "The books under the lamp",
    tags: [],
hitbox: [29.9, 48.4, 8.1, 4.1],
outline: [
  [30.4, 51.9], [30.4, 51.2], [30.6, 50.9], [30.6, 50.3], [30.8, 50.2], [30.8, 49.6], [31.1, 49.4], [31.5, 49], [31.6, 48.9], [31.6, 49.2], [31.6, 49.4], [31.9, 49.5], [32.4, 49.6], [33, 49.6], [33.7, 49.6], [34.1, 49.5], [34.4, 49.5], [34.6, 49.3], [34.7, 49.4], [34.8, 49.5], [35.6, 49.6], [36.4, 49.5], [36.4, 49.3], [36.6, 49.2], [36.7, 49], [37.2, 49], [37.2, 49.8], [37.2, 49.8], [37.2, 50.3], [37.5, 50.3], [37.5, 51.2], [36.8, 52]
]
  },

  {
    id: "coat",
    order: 4,
    label: "The coat by the window",
    title: "Just Show Up",
    flavor:
      "Free and low-cost family events near home — Madison, Wisconsin " +
      "for now. No planning, no digging through feeds: see what's on, " +
      "grab your coat, and just show up. Currently in development - not fully populated or functioning yet.",
    image: "assets/previews/justshowup.jpg",
    links: [
      { label: "See what's on",
        url: "https://justshowup.fyi", embed: true }
    ],
    tags: ["projects"],
hitbox: [23.4, 30.3, 6.1, 18.7],
outline: [
  [24.7, 34.3], [24.8, 32.3], [25.2, 31], [25.6, 30.8], [26.2, 30.9], [26.6, 31.3], [27, 33.1], [27.1, 33.6], [27.6, 34.7], [27.8, 35], [27.8, 35.8], [28.4, 38.5], [28.8, 40.5], [28.9, 42], [28.9, 43.2], [28.8, 44.6], [28.9, 45.5], [29.1, 47.5], [28.7, 47.7], [28.2, 47.7], [27.8, 47.5], [27.8, 48.1], [27.4, 48.3], [27.1, 48.4], [26.6, 48.5], [26.4, 48.3], [26.2, 47.9], [26.2, 47.3], [26, 48], [24.3, 47.8], [24.4, 46.7], [24.3, 45.5], [24.3, 43], [24.3, 39.8], [24.3, 38.2], [24.2, 37], [23.9, 35.6]
]
  },

  {
    id: "desk-chair",
    order: 1,
    about: true,
    label: "The desk chair",
    tags: [],
shapes: [ { hitbox: [40.8, 56, 13.6, 11.5],
outline: [
  [42.9, 66.5], [43.1, 66.8], [43.5, 66.7], [43.6, 66.5], [43.6, 66.1], [43.5, 65.9], [43.5, 65.7], [43.5, 65.7], [44.8, 65.1], [46.3, 64.4], [47.1, 64], [47.4, 64], [48.1, 64.5], [49.2, 65.2], [49.9, 65.8], [50.4, 66.1], [50.3, 66.2], [50.2, 66.7], [50.3, 67], [50.6, 67.1], [50.8, 66.9], [51, 66.7], [51, 66.2], [50.8, 66.2], [50.8, 65.4], [49.4, 63.8], [51, 63.8], [52.9, 63.8], [52.9, 63.9], [52.9, 64.1], [52.8, 64.3], [52.9, 64.6], [53, 64.7], [53.2, 64.8], [53.4, 64.8], [53.4, 64.5], [53.5, 64.4], [53.5, 64.2], [53.3, 64.1], [53.3, 63.1], [51.1, 62.7], [49.5, 62.5], [48.2, 62.4], [47.9, 62.3], [47.8, 61.9], [47.9, 61.7], [47.9, 61.2], [47.9, 60.9], [47.9, 60.6], [48.2, 60.6], [49.8, 59.9], [52, 59.6], [53.8, 59], [53.9, 56.5], [41.7, 56.5], [41.4, 57], [41.4, 57.2], [41.5, 57.3], [41.4, 57.6], [41.3, 57.9], [41.3, 58.3], [41.5, 58.6], [41.8, 59], [42, 59.3], [42.1, 59.4], [42.8, 59.6], [43.9, 59.7], [45.1, 59.9], [45.1, 59.9], [44.9, 60], [44.9, 60.2], [45, 60.3], [45, 60.5], [45.1, 60.3], [45.7, 60.5], [46.2, 60.5], [46.7, 60.6], [46.9, 60.6], [46.9, 60.8], [46.9, 60.9], [47, 61.1], [47.1, 61.9], [47, 61.9], [47, 62.2], [41.9, 62.7], [41.9, 63.2], [41.9, 63.6], [41.8, 63.8], [41.9, 64], [41.9, 64.1], [42.1, 64.3], [42.3, 64.3], [42.3, 64.3], [42.5, 64.1], [42.5, 63.9], [42.5, 63.8], [42.4, 63.7], [42.4, 63.4], [44.9, 63.7], [43, 65.1], [42.9, 65.1], [43, 65.8], [43, 65.9], [42.8, 66], [42.8, 66.3]
] },
  { hitbox: [39.8, 42.3, 10.2, 7.7],
outline: [
  [46.8, 49.1], [46.8, 48.9], [47.5, 48.8], [48.2, 48.6], [48.2, 48.7], [48.5, 48.7], [48.8, 48.5], [49.1, 48.3], [49.2, 48.1], [49.4, 47.8], [49.4, 47.5], [49.4, 46.7], [49.4, 45.8], [49.3, 45], [49.3, 44.4], [49.1, 44.1], [48.9, 43.6], [48.7, 43.3], [48.3, 43.1], [47.7, 42.9], [46.9, 42.8], [45.5, 42.9], [43.2, 43.1], [42.6, 43.1], [41.9, 43.1], [41.6, 43.1], [41.1, 43.1], [40.9, 43.1], [40.7, 43.2], [40.5, 43.4], [40.3, 43.5], [40.3, 43.8], [40.3, 45.2], [40.5, 47.6], [40.5, 48.6], [40.6, 48.9], [40.7, 49.1], [40.9, 49.2], [41.2, 49.3], [42, 49.3], [41.9, 49.6], [42.7, 49.6], [42.8, 49.3], [46.4, 48.9], [46.4, 49], [46.1, 49], [46.1, 49.2]
] } ]
  },

  {
    id: "hibiscus-tea",
    order: 7,
    label: "The hibiscus tea",
    title: "Buy me a tea",
    flavor:
      "Hibiscus — my favorite. If what I'm building here means something " +
      "to you, you can put the kettle on for the next cup.",
    image: "assets/previews/tea.jpg",
    links: [
      { label: "Support me",
        url: "https://buymeacoffee.com/samarehjack" }   
    ],
    tags: [],
hitbox: [47.7, 48.4, 4.4, 3.8],
outline: [
  [48.2, 51], [48.3, 50.9], [48.5, 50.9], [48.8, 50.8], [48.7, 50.7], [48.5, 50.6], [48.4, 50.5], [48.3, 50.2], [48.2, 49.9], [48.2, 49.6], [48.4, 49.5], [48.5, 49.5], [48.6, 49.5], [48.8, 49.5], [48.7, 49.1], [49, 49], [49.2, 49], [49.4, 48.9], [49.7, 48.9], [50.1, 48.9], [50.4, 48.9], [50.7, 49], [50.9, 49.1], [50.9, 49.2], [50.9, 49.6], [50.9, 49.7], [50.9, 50.2], [50.8, 50.5], [50.7, 50.7], [51, 50.7], [51.3, 50.8], [51.5, 50.9], [51.6, 51], [51.5, 51.2], [51.3, 51.4], [51, 51.5], [50.9, 51.6], [50.9, 51.7], [48.9, 51.8], [48.9, 51.7], [48.7, 51.5], [48.5, 51.3], [48.3, 51.2]
]
  },

  {
    id: "pencil-holder",
    order: 20,
    contact: true,
    label: "The pencil holder",
    tags: [],
hitbox: [37.1, 46, 4.1, 6.3],
outline: [
  [38.2, 51.8], [39, 51.8], [39.7, 51.8], [40, 51.7], [40.1, 51.2], [40.3, 51.1], [40.6, 50.7], [40.8, 50.2], [40.8, 49.8], [40.7, 49.6], [40.5, 49.3], [40.1, 49.2], [40, 49.1], [39.8, 49], [40.1, 48.5], [40.3, 47.7], [40.3, 47.6], [40.2, 47.5], [40, 47.3], [40, 47.3], [39.8, 47.3], [39.8, 47.1], [39.6, 47.1], [39.4, 47.6], [39.2, 47.6], [39.1, 47.3], [38.9, 47.6], [38.9, 48], [38.4, 46.5], [38.2, 46.6], [38.4, 47.9], [38, 47.7], [38, 47], [37.8, 47], [37.8, 47.2], [37.6, 47.3], [37.7, 47.7], [37.8, 47.9], [37.9, 48.1], [38.2, 48.9], [38.1, 48.9]
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
      "of where I've been and what I've done."
  },
  {
    text: "I'm interested in accompaniment",
    tags: ["accompaniment"],
    response:
      "I call it professional accompaniment: short-term support while " +
      "you get unstuck, designed from the start to end."
  },
  {
    text: "Show me the apps and ideas",
    tags: ["projects"],
    response:
      "An idea for AI built values-first, a way to find free things to " +
      "do nearby, and an app for deciding together. They're all here."
  },
/*  {
    text: "I came for the music, leather creations, and writing",
    tags: ["creative"],
    response:
      "Singing, Bahá'í writings set to melodies, handmade shoes, ambigrams, " +
      "and books are on their way — that side of the room is still " +
      "being unpacked. Come back soon."
  },*/
  {
    text: "Just wandering",
    wander: true,
    tags: [],
    response:
      "The best way to visit. Anything that glows when you pass over " +
      "it will tell you about itself."
  }
];

/* [3] ─── WHY_AI ───────────────────────────────────────────────────────
   The note behind the welcome footnote ("Here's why I chose that.").
   Plain visitor-facing copy, kept here with the rest of the words.
   `body` is a list of paragraphs; add or remove freely. */
const WHY_AI = {
  eyebrow: "A note on the room",
  title: "Why there's AI in this office",
  body: [
    "This office doesn't exist — it was generated by AI.",

    "I don't see it as the finished product, but a great way to give you " +
    "an idea of what I'm envisioning in my mind. As I develop the site, " +
    "this image and the links will change shape and move around many times.",

    "Given that I can't afford to work with an artist or photographer to " +
    "make it real, and I don't actually know how I want the final version " +
    "to appear, I'm taking the opportunity to try out AI image generation. " +
    "Eventually, when I have a good idea of how I want the final version to " +
    "look like, and know more about what I want, I'd love for human hands " +
    "to make it real. Until then, you're standing in a sketch — and I'd " +
    "rather show you a sketch than nothing.",

    "How I think about AI more broadly is a bigger conversation. Part of " +
    "it is what I call Creedal AI — see if you can find it in the room."
  ],
  close: "Back to the room"
};

/* [4] ─── ABOUT ME (the desk chair) ────────────────────────────────────
   First click shows `teaser`; "read more" reveals `full`. Both are lists
   of paragraphs. */
const ABOUT = {
  eyebrow: "My chair",
  title: "About me",
  teaser: [
    "This is my digital office, furnished with the things I do and make. I'm glad you stopped by. Here's where I can tell you more about me - the person behind everything else in this room - and the connecting instinct that runs through all my ideas and pursuits.",
    "If you'd like to know me better, pull up a chair and read on."
  ],
  readMore: "Read about me",
  full: [
    "I come up with ideas easily, and constraints only make me generate more of them. Once in a while a particular kind of idea hits like lightning, too intriguing and exciting to ignore. I can't help but explore it, usually by making or doing something, and the exploration turns into its own kind of adventure, a deep dig into what it would take for the idea to actually exist in the world. It often carries me into areas where I have no expertise and pushes me to expand what I know and can do. I learn as much as I need to, like a student seeing what's possible, and step away once I know enough to move the vision forward. The title that comes with the new craft doesn't much interest me, since my goal is creation, not expertise as an end.",

    "The kind of ideas that take hold of me are telling. The ones that grip hardest are about people, about what sits underneath the way we relate, decide, grow, and reach each other. They come from values I hold deeply, often in reaction to seeing those same values violated. I'll notice that something meant to serve people has been perverted into harming them in the name of help, and in the same moment I'll see the version that puts the person back at the center, built that way from the ground up instead of patched on after. Once I can see it, I can't unsee it. I don't fully know why. The seeing just stays with me until I act.",

    "Underneath those ideas are the values they come from. I trust people, and would rather leave them their autonomy than manage them with paternalism or moral judgement. What's true matters to me more than what's comfortable or flattering. Genuine connection, I believe, is something we need to be well, in a person and in a society. Whatever I make, I want useful and beautiful at once. And I love how different we all are, so I put my energy into drawing out the best in people, the optimist who builds in the safeguards rather than the cynic who turns out to be right. A great deal of this was shaped by my faith; I'm a Bahá'í.",

    "Those same values show up in how I am with people directly. Given the chance, I would rather help someone find what they already carry than hand them my version of it, and I step back as soon as they no longer need me. The pull is strongest with my own children, in the slow work of shaping a young mind, and it reaches out from there to anyone I get to teach. There's a satisfaction in it I find nowhere else.",

    "What feeds all of it is a pull to expand myself and my world by experiencing, exploring, and expressing. This is where I turn to artistic and creative pursuits like social dancing, singing, art, acting, or improv. Something in me reaches for that, and answering it meets a real need, satisfying and deepening on its own. It also widens the field of what feels possible to me, and a wider field is what lets me connect ideas from far-apart places and find what happens where they overlap.",

    "Under all of it is my intuition. The better I've come to know it, and to tell it from everything that only looks like it, the more freely ideas flow in and decisions flow out.",

    "I think each person is a bit like a prism - the light of their internal drive, seen through the facets of where and how and why. What I've shared here is the shape of mine, as I understand myself now: one instinct, rooted in my values, exploring what it means to be alive, and trying to leave the world a little better in whatever small way I can. The singular light of my intuition scattered across the wide spectrum of how I show up in the world."
  ]
};

/* [5] ─── CONTACT (the pencil holder) ──────────────────────────────────
   A short message form that posts to Formspree (FORMSPREE_ENDPOINT below).
   `success` shows in place of the form after a send. */
const CONTACT = {
  eyebrow: "Get in touch",
  title: "Leave me a note",
  intro:
    "I'm always happy to connect with people. Feel free to " +
    "say hello, ask a question, or reach out about working together..",
  submit: "Send",
  success:
    "Thank you — your note is on its way. I read everything myself and " +
    "I'll get back to you."
};

/* [6] ─── GUEST BOOK (the books under the lamp) ─────────────────────────
   The book is curated: visitors send an entry, it reaches you via
   Formspree, and YOU add it here by hand — so nothing public is ever
   un-vetted. Add new entries to the TOP of `entries`.
   Each entry: { note, name, link } — link is optional. */
const GUESTBOOK = {
  eyebrow: "Who's stopped by",
  title: "The guest book",
  prompt:
    "Thanks for coming by. Before you go, I'd love for you to write something in my guest book — tell me " +
    "which ideas here spoke to you, and why.",
  signLabel: "Write in the guest book",
  submit: "Write in the book",
  thanks:
    "Thank you so much for signing. I read every note by hand and put " +
    "them up myself, so yours should appear soon. Thanks again for " +
    "stopping by.",
  entries: [
    { note: "I always like the idea of creating something new with AI - like this website. I've heard good things about it. Good luck!",
      name: "Abeo Jack (7 years old)", link: "" },
      
    { note: "I love you. Welcome to website and also I want to create with AI and also I like to draw on the computer and also I want to spin the whole house with one finger and also I really like to drink coconut water and also I really want to put some bit of blob of computer and then flush it down the toilet.",
      name: "Zia Jack (4 years old)", link: "" }
  ]
};

/* Formspree — the contact form and the guest-book sign form both POST here.
   Each submission carries a hidden `type` field (contact / guestbook) so
   you can tell them apart in your inbox. */
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mnjzeodj";

/* [7] ─── DIRECTORY ─────────────────────────────────────────────────────
   The plain-list index, reached from the list button (bottom-right) and,
   later, a keyboard "skip to the list" link. The ORDER of the list is set
   per object, by the `order` number on each ROOM_OBJECTS entry above (low
   numbers first). Objects without an `order` fall to the end; the welcome
   chair is never listed. This block is just the heading copy. */
const DIRECTORY = {
  eyebrow: "The directory",
  title: "Everything in this room",
  intro: "Prefer a plain list? Here's all of it, in one place."
};

/* [8] ─── DOOR GEOMETRY ────────────────────────────────────────────────
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
  plate: { cx: 50.0, cy: 28.1 }
};
