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
   tags     which welcome answers make it shimmer: work, services,
            projects, creative — or "everyone" for all of them.
            An object can carry several tags.
   order    OPTIONAL number — where this sits in the directory list
            (lower = higher up). No `order` = falls to the end.
   hitbox   clickable rectangle, % of the image: [left, top, width, height]
   outline  the glowing shape, % polygon: [[x, y], [x, y], ...]
   icon     OPTIONAL [x, y] point, % of the image, where the little
            breathing "look here" mote sits. It shows whenever the object
            is calling for attention (the welcome chair, or an object that
            shimmers for the visitor's answer) and on hover, where it also
            shows the object's title. No `icon` = no mote on that object.
            Trace the spot with ?edit → "Pick icon point".
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

/* The size of the beckon mote (the "ring ping" marker), in pixels. Bigger =
   easier to spot; smaller = subtler. Applies to every object's icon. */
const ICON_SIZE = 41;

/* [1] ─── ROOM OBJECTS ─────────────────────────────────────────────────── */
const ROOM_OBJECTS = [
  
  {
    id: "computer",
    icon: [60.5, 43.4],
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
hitbox: [54.66, 37.25, 9.74, 14.98],
outline: [
  [57.56, 51.21], [59.18, 50.71], [59.31, 50.68], [59.43, 50.67], [59.65, 50.68], [59.94, 50.68], [60.14, 50.71], [60.4, 50.77], [60.53, 50.81], [60.69, 50.83], [60.8, 50.82], [60.88, 50.82], [60.87, 50.59], [60.85, 50.39], [60.63, 48.89], [55.48, 49.94], [55.37, 49.93], [55.29, 49.89], [55.22, 49.84], [55.16, 49.76], [55.16, 49.67], [55.16, 49.46], [56.17, 38.24], [56.21, 38.19], [56.23, 38.16], [63.81, 37.75], [63.86, 37.77], [63.89, 37.83], [63.9, 37.88], [62.89, 48.36], [62.87, 48.39], [62.42, 48.52], [62.84, 50.11], [62.89, 50.35], [62.92, 50.62], [62.92, 50.87], [62.88, 50.99], [62.79, 51.13], [62.73, 51.18], [60.74, 51.73], [57.59, 51.37], [57.56, 51.36]
]
  },

  {
    id: "rug",
    icon: [43.8, 81.7],
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
    icon: [25.4, 61.3],
    welcome: true,
    label: "The guest chair",
    tags: [],
hitbox: [15.7, 52.1, 25.2, 33.2],
outline: [
  [16.2, 53.5], [16.4, 53.2], [16.5, 53], [16.8, 52.8], [17, 52.7], [17.2, 52.6], [17.5, 52.6], [17.8, 52.6], [18.1, 52.7], [18.4, 52.9], [18.6, 53], [18.8, 53.1], [19.2, 53.2], [19.6, 53.3], [20, 53.5], [20.5, 53.7], [21.1, 53.9], [21.8, 54.1], [21.8, 53.5], [21.8, 53.3], [21.9, 53.2], [22, 53.2], [22.3, 53.4], [22.8, 53.6], [23.4, 53.9], [24.1, 54.2], [24.5, 54.5], [25.1, 54.7], [25.5, 54.9], [26, 55], [26.2, 55.2], [26.6, 55.4], [26.9, 55.6], [27.2, 56], [27.5, 56.3], [27.8, 56.7], [28, 57], [28.2, 57.3], [28.3, 57.6], [28.6, 58], [29.2, 57.9], [29.8, 57.7], [30.4, 57.6], [30.5, 57.5], [31.1, 57.7], [31.1, 57.9], [31.1, 58.2], [30.9, 58.5], [30.9, 59.3], [30.9, 59.5], [30.9, 59.6], [30.9, 59.7], [30.9, 59.8], [30.9, 60], [30.8, 60.1], [30.8, 60.3], [30.9, 60.8], [30.9, 62], [31.5, 61.8], [32, 61.8], [32.5, 61.7], [32.8, 61.7], [33, 61.8], [33.2, 61.9], [34.2, 61.5], [35.1, 61.2], [35.8, 61], [36.8, 60.6], [37.5, 60.4], [37.8, 60.4], [38.1, 60.4], [38.3, 60.5], [38.4, 60.6], [38.5, 60.8], [38.5, 60.9], [38.4, 61.1], [38.4, 61.3], [38, 61.5], [37.3, 61.8], [37.3, 62.1], [37.4, 62.3], [37.5, 62.4], [37.6, 62.6], [37.6, 62.9], [37.6, 63.2], [37.6, 63.4], [37.7, 63.5], [38, 63.6], [38.4, 63.8], [38.8, 64], [39.2, 64.2], [39.6, 64.4], [39.9, 64.6], [40.1, 64.8], [40.2, 64.9], [40.3, 65], [40.3, 65.4], [40.4, 65.7], [40.4, 66], [40.4, 66.2], [40.4, 66.4], [40.4, 66.8], [40.4, 67.1], [40.3, 67.6], [40.1, 67.8], [40, 67.9], [40.1, 68], [40.2, 68.1], [40.2, 68.4], [40.2, 68.7], [40.3, 68.9], [40.2, 69], [40, 69.2], [39.4, 69.5], [38.6, 69.9], [38.6, 70], [38.6, 70.1], [38.5, 70.2], [38.3, 70.3], [38.1, 70.3], [38.1, 70.3], [38.1, 70.2], [38, 70.3], [38, 70.3], [38.2, 71.4], [38.2, 71.5], [38.2, 71.7], [38.3, 71.8], [38.3, 72.2], [38.4, 72.5], [38.5, 73], [38.6, 73.4], [38.7, 73.7], [38.6, 73.9], [38.7, 74.1], [38.8, 74.3], [38.8, 74.4], [38.8, 74.8], [38.9, 75.6], [39, 75.9], [39, 76.2], [39, 76.5], [39.1, 76.6], [39.1, 76.7], [39.2, 77.3], [39.2, 77.6], [39.2, 77.9], [39.3, 78.2], [39.3, 78.5], [39.3, 78.7], [39.4, 79], [39.4, 79.3], [39.3, 79.6], [39.3, 79.7], [39, 79.7], [38.9, 79.7], [38.8, 79.2], [38.7, 78.9], [38.7, 78.7], [38.7, 78.6], [38.6, 78.5], [38.5, 78.2], [38.2, 76.8], [38.2, 76.8], [38.2, 76.7], [38.2, 76.6], [38, 76.1], [38, 75.7], [37.9, 75.3], [37.7, 74.7], [37.7, 74.6], [37.7, 74.4], [37.7, 74.3], [37.6, 74], [37.6, 73.8], [37.5, 73.7], [37.5, 73.5], [37.4, 73], [37.4, 72.9], [37.3, 72.7], [37.3, 72.6], [37.2, 72.1], [37.3, 72], [37.2, 71.9], [37.1, 71.5], [36.9, 70.6], [36, 71], [34.3, 71.6], [32.6, 72.4], [31.4, 73], [30.3, 73.4], [29.2, 73.8], [27.6, 74.4], [27.4, 74.4], [27.2, 74.6], [27, 75.8], [27, 75.8], [26.9, 76.1], [26.9, 76.2], [26.9, 76.5], [26.8, 76.9], [26.6, 77.3], [26.7, 77.5], [26.5, 78.4], [26.3, 79.7], [26.1, 80.6], [25.7, 82.2], [25.5, 83], [25.5, 83.1], [25.6, 83.2], [25.6, 83.3], [25.5, 83.4], [25.4, 83.7], [25.2, 84.7], [25.1, 84.8], [24.8, 84.8], [24.6, 84.6], [24.5, 84.2], [24.6, 84], [24.6, 83.9], [24.7, 83.7], [24.8, 82.9], [24.8, 82.4], [24.9, 81.6], [24.9, 81.5], [24.9, 81.3], [25.1, 80.4], [25.2, 79.9], [25.2, 78.8], [25.3, 78.7], [25.3, 78.5], [25.4, 78.1], [25.5, 77.8], [25.5, 77.7], [25.5, 77.4], [25.5, 77.2], [25.6, 77.1], [25.6, 76.9], [25.6, 76.7], [25.7, 76.4], [25.7, 75.9], [25.8, 75.5], [25.9, 75.1], [25.9, 74.6], [25.7, 74.6], [25.6, 74.5], [25.2, 74.2], [24.6, 74], [23.8, 73.7], [23.4, 73.5], [22.7, 73.1], [22.3, 72.8], [21.6, 72.4], [21.6, 72.7], [21.5, 73], [21.5, 73.1], [21.4, 73.4], [21.3, 73.7], [21.2, 73.7], [21.2, 74.3], [21.2, 74.5], [21, 75.3], [20.8, 76], [20.7, 76.3], [20.6, 76.3], [20.7, 76.5], [20.6, 77], [20.6, 77.1], [20.5, 77.2], [20.5, 77.3], [20.5, 77.4], [20.2, 78.4], [20.1, 79.1], [19.9, 80], [19.6, 80.4], [19.2, 80.1], [19.2, 79.6], [19.3, 79], [19.4, 78.4], [19.5, 77.8], [19.6, 77.1], [19.7, 77], [19.6, 77], [19.8, 76.4], [19.9, 76.1], [19.9, 75.5], [20, 75], [20.1, 74.5], [20.2, 74.1], [20.3, 74], [20.2, 73.9], [20.3, 73.5], [20.4, 73], [20.4, 72.7], [20.5, 72.7], [20.4, 72.7], [20.5, 72.2], [20.6, 71.8], [20.7, 71.6], [20.7, 71.5], [20.4, 71.3], [20.2, 71], [19.9, 70.7], [19.8, 70.8], [19.7, 70.7], [19.6, 70.6], [19.6, 70.5], [19.5, 70.1], [19.3, 69.4], [18.9, 67.2], [17.8, 61.4], [17.5, 60.1], [17.3, 59.3], [17.1, 58.1], [16.8, 56.8], [16.6, 55.7], [16.3, 54.6], [16.2, 54], [16.2, 53.6]
]
  },

  {
    id: "couch",
    icon: [73.19, 59.66],
    order: 3,
    label: "The couch",
    title: "Professional Accompaniment",
    flavor:
      "Short-term support for when something feels stuck. I walk alongside you while you " +
      "figure out what you actually want and how to act on it. The work " +
      "is designed to end: as your own clarity returns, I step away.",
    image: "assets/previews/accompany.jpg",
    links: [
      { label: "See if it fits",
        url: "https://accompany.samarehjack.com", embed: true }
    ],
    tags: ["services"],
hitbox: [66.7, 48.3, 33.3, 47.2],
outline: [
  [83.7, 48.9], [84.9, 48.8], [85.6, 48.9], [90, 50.5], [91.7, 51.4], [99.9, 55.4], [99.8, 89.5], [83.5, 90.1], [82.5, 94.9], [81.4, 94.9], [80.9, 94.1], [80.6, 89.4], [68.9, 70.1], [68.6, 71.3], [68.3, 71.6], [67.9, 71.4], [67.7, 71], [67.7, 67.7], [67.2, 67.1], [67.3, 54.1], [67.4, 53.9], [67.5, 53.7], [68.5, 53.5], [76.1, 53.4], [76.7, 50.9], [76.8, 50], [77, 49.6], [77.6, 49.9], [78.8, 50.5], [80.4, 51], [81.6, 51.1], [82.6, 51], [83.1, 49.9]
]
  },
  
  {
    id: "desk-lamp",
    icon: [36, 40.3],
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
hitbox: [31.09, 36.93, 8.07, 13.09],
outline: [
  [34.66, 38.42], [34.58, 38.43], [34.53, 38.37], [34.44, 38.36], [34.38, 38.39], [34.3, 38.45], [34.24, 38.53], [34.2, 38.57], [33.88, 38.75], [33.57, 38.99], [33.31, 39.16], [33.05, 39.31], [32.86, 39.49], [32.71, 39.64], [32.47, 40.02], [32.31, 40.34], [32.14, 40.69], [32.03, 41.02], [31.93, 41.44], [31.89, 41.74], [31.9, 42.22], [31.94, 42.64], [31.97, 42.86], [32.07, 43.37], [32.37, 44.65], [32.69, 45.9], [32.85, 46.46], [32.8, 46.55], [32.78, 46.66], [32.78, 46.78], [32.83, 46.87], [32.89, 46.94], [32.94, 46.98], [32.85, 47.09], [32.8, 47.18], [32.77, 47.29], [32.79, 47.45], [32.83, 47.55], [32.87, 47.61], [32.96, 47.68], [33.01, 47.72], [32.98, 47.99], [32.85, 48.17], [32.77, 48.3], [32.68, 48.41], [32.54, 48.57], [32.45, 48.58], [32.44, 48.68], [31.82, 48.71], [31.74, 48.72], [31.69, 48.77], [31.64, 48.84], [31.62, 48.92], [31.59, 49.06], [31.6, 49.22], [31.63, 49.35], [31.66, 49.41], [31.73, 49.44], [31.82, 49.47], [31.9, 49.49], [32.44, 49.52], [33.72, 49.52], [34.15, 49.49], [34.49, 49.43], [34.59, 49.38], [34.65, 49.29], [34.67, 49.22], [34.59, 49.09], [34.52, 48.93], [34.5, 48.86], [34.26, 48.79], [34.26, 48.71], [33.98, 48.57], [33.67, 48.38], [33.48, 48.15], [33.43, 47.96], [33.4, 47.8], [33.4, 47.74], [33.49, 47.67], [33.54, 47.6], [33.59, 47.47], [33.59, 47.34], [33.57, 47.19], [33.53, 47.1], [33.44, 47.04], [33.37, 47], [33.32, 46.98], [33.29, 46.87], [33.33, 46.8], [33.34, 46.66], [33.3, 46.57], [33.25, 46.5], [33.16, 46.46], [33.12, 46.45], [32.82, 45.28], [32.55, 44.2], [32.32, 43.21], [32.23, 42.73], [32.18, 42.41], [32.17, 42.2], [32.16, 41.8], [32.2, 41.52], [32.26, 41.16], [32.36, 40.84], [32.5, 40.48], [32.68, 40.14], [32.95, 39.82], [33.26, 39.54], [33.8, 39.18], [34.29, 38.93], [34.4, 38.88], [34.52, 38.87], [34.63, 38.79], [34.71, 38.72], [34.82, 38.71], [34.84, 38.73], [34.93, 38.94], [34.88, 39.14], [34.85, 39.35], [34.81, 39.4], [34.82, 39.52], [34.87, 39.54], [34.7, 39.67], [34.44, 39.87], [34.18, 40.13], [33.95, 40.39], [33.85, 40.55], [33.77, 40.7], [33.68, 40.94], [33.62, 41.08], [33.55, 41.29], [33.5, 41.49], [33.47, 41.73], [33.48, 41.98], [33.49, 42.11], [33.63, 42.11], [33.84, 42.06], [34.07, 42.02], [34.88, 41.75], [36.02, 41.3], [37.19, 40.87], [37.98, 40.54], [38.52, 40.25], [38.61, 40.16], [38.66, 40.08], [38.58, 39.9], [38.45, 39.67], [38.3, 39.44], [38.08, 39.21], [37.83, 39.05], [37.52, 38.97], [37.22, 38.95], [36.82, 38.96], [36.47, 39.02], [36.27, 39.05], [36.25, 39.01], [36.32, 38.98], [36.32, 38.95], [36.15, 38.65], [36.02, 38.63], [35.98, 38.45], [35.9, 38.11], [35.83, 37.93], [35.73, 37.78], [35.64, 37.66], [35.52, 37.58], [35.4, 37.57], [35.21, 37.58], [35.18, 37.57], [35.19, 37.54], [35.18, 37.49], [35.14, 37.45], [35.07, 37.43], [35.01, 37.44], [34.98, 37.47], [34.94, 37.53], [34.93, 37.6], [34.94, 37.67], [34.85, 37.72], [34.77, 37.82], [34.7, 37.92], [34.67, 38.02], [34.66, 38.1], [34.66, 38.25], [34.68, 38.39]
]
  },

  {
    id: "books",
    icon: [33.7, 50.8],
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
    icon: [26.5, 37.1],
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
    icon: [45, 46],
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
    icon: [49.9, 50.5],
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
hitbox: [47.69, 48.45, 4.38, 3.84],
outline: [
  [49.18, 51.77], [49.57, 51.79], [50.02, 51.79], [50.42, 51.77], [50.67, 51.75], [50.87, 51.69], [50.88, 51.64], [51.12, 51.5], [51.3, 51.38], [51.45, 51.26], [51.54, 51.15], [51.57, 51.01], [51.53, 50.96], [51.43, 50.88], [51.35, 50.83], [51.15, 50.81], [50.74, 50.8], [50.77, 50.68], [50.82, 50.55], [50.86, 50.42], [50.88, 50.29], [50.91, 50.11], [50.93, 49.97], [50.96, 49.8], [50.96, 49.66], [50.97, 49.51], [50.97, 49.38], [50.95, 49.18], [50.86, 49.08], [50.75, 49.01], [50.55, 48.98], [50.32, 48.97], [50.02, 48.95], [49.81, 48.95], [49.51, 48.96], [49.3, 48.96], [49.08, 48.99], [48.92, 49.02], [48.84, 49.08], [48.82, 49.13], [48.82, 49.2], [48.82, 49.29], [48.82, 49.43], [48.81, 49.49], [48.81, 49.52], [48.75, 49.49], [48.67, 49.46], [48.55, 49.46], [48.46, 49.48], [48.38, 49.51], [48.3, 49.56], [48.24, 49.66], [48.2, 49.75], [48.19, 49.82], [48.2, 49.91], [48.21, 50.05], [48.21, 50.15], [48.25, 50.25], [48.3, 50.36], [48.36, 50.44], [48.43, 50.5], [48.52, 50.56], [48.6, 50.62], [48.67, 50.65], [48.76, 50.7], [48.85, 50.73], [48.93, 50.75], [49, 50.76], [49, 50.78], [48.89, 50.79], [48.8, 50.79], [48.65, 50.81], [48.53, 50.84], [48.39, 50.86], [48.28, 50.92], [48.23, 50.97], [48.22, 51.03], [48.21, 51.08], [48.22, 51.14], [48.36, 51.24], [48.51, 51.36], [48.6, 51.41], [48.68, 51.48], [48.74, 51.52], [48.78, 51.54], [48.82, 51.64], [48.83, 51.72], [48.87, 51.74]
]
  },

  {
    id: "pencil-holder",
    icon: [38.9, 50.5],
    order: 20,
    contact: true,
    label: "The pencil holder",
    tags: [],
hitbox: [37.17, 46.05, 4.16, 6.32],
outline: [
  [38.16, 51.82], [38.25, 51.86], [39.68, 51.87], [39.83, 51.86], [39.92, 51.79], [40.01, 51.66], [40.06, 51.57], [40.08, 51.49], [40.1, 51.04], [40.28, 51.03], [40.38, 50.96], [40.53, 50.79], [40.66, 50.57], [40.74, 50.33], [40.81, 50.09], [40.82, 49.78], [40.81, 49.65], [40.74, 49.53], [40.66, 49.45], [40.55, 49.39], [40.4, 49.33], [40.25, 49.31], [40.08, 49.32], [40.07, 49.11], [40.04, 49.08], [39.96, 49.06], [39.79, 49.06], [39.94, 48.8], [40.01, 48.62], [40.12, 48.35], [40.24, 47.89], [40.31, 47.79], [40.31, 47.61], [40.24, 47.7], [40.22, 47.39], [40.16, 47.36], [40.08, 47.35], [40.01, 47.37], [39.98, 47.42], [39.97, 47.3], [39.8, 47.49], [39.77, 47.09], [39.7, 47.09], [39.61, 47.09], [39.61, 47.13], [39.54, 47.17], [39.51, 47.24], [39.44, 47.4], [39.44, 47.48], [39.43, 47.6], [39.43, 47.68], [39.41, 48.48], [39.33, 48.78], [39.3, 48.88], [39.29, 48.95], [39.2, 48.95], [39.23, 47.71], [39.14, 47.69], [39.14, 47.34], [38.95, 47.65], [38.93, 47.69], [38.88, 47.69], [38.89, 48.57], [38.42, 46.55], [38.18, 46.68], [38.42, 47.79], [38.33, 47.84], [38.32, 47.97], [38.1, 47.68], [37.97, 47.14], [37.96, 46.97], [37.87, 47.08], [37.95, 47.22], [37.97, 47.46], [37.83, 47.26], [37.79, 47.25], [37.67, 47.39], [37.67, 47.54], [37.75, 47.74], [37.78, 47.79], [37.79, 47.88], [37.79, 47.92], [37.85, 47.93], [37.83, 48.03], [38.23, 49.05], [38.14, 49.06], [38.08, 49.09], [38.15, 51.73]
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

/* The greeting above the choices. `title` + `intro` set the scene and,
   importantly, tell the visitor the room is a mixed bag — not one connected
   thing. `answered` replaces the title once they pick an option. */
const WELCOME_INTRO = {
  title: "Welcome to my office",
  intro:
    "Here you'll find a casual collection of some of my ideas, " +
    "projects, and offerings. What are you interested in today?",
  answered: "Glad you're here."
};

const WELCOME_OPTIONS = [
  {
    text: "I'm hiring, or curious about your professional work",
    tags: ["work"],
    response:
      "Then you'll want my resume and LinkedIn — the official record " +
      "of where I've been and what I've done."
  },
  {
    text: "I'm interested in your services",
    tags: ["services"],
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
    "I come up with ideas easily, and constraints only make me generate more of them. Once in a while an idea hits like lightning, too intriguing and exciting to ignore. I can't help but explore it, usually by making or doing something, and the exploring becomes its own kind of adventure: a deep dig into what it would take for the idea to exist in the world. It often takes me into areas I know nothing about, and pushes me to learn what the vision needs. I learn as much as I need to, like a student, and step away once I can move it forward. The title that comes with a new craft doesn't interest me much. I'm after creation, not expertise for its own sake.",

    "The ideas that grip me hardest are about people: what sits underneath how we relate, decide, grow, and reach each other. They come from values I hold, often in reaction to seeing those values violated. I'll notice that something meant to serve people has been bent into harming them in the name of help, and in the same moment I'll see the version that puts the person back at the center, built from the ground up instead of patched on after. Once I've seen it, I can't unsee it. I don't fully know why. It stays with me until I act.",

    "Those values are the ground under those ideas. I trust people, and would rather leave them their autonomy than manage them with paternalism or moral judgment. I care more about what's true than what's comfortable or flattering. I believe genuine connection is something people need to be well, personally and as a society. Whatever I make should be useful and beautiful at once. I love how different we all are, so I try to draw out the best in people, and I'd rather build in safeguards than be the cynic who turns out to be right. A great deal of this was shaped by my faith; I'm a Bahá'í.",

    "These values also show up in how I am with people directly. I would rather help someone find what they already carry than hand them my version of it, and I step back once they no longer need me. The pull is strongest with my own children, in the slow work of shaping a young mind, and it reaches out from there to anyone I get to teach.",

    "What feeds all of it is a pull to expand myself and my world through experiencing, exploring, and expressing: social dancing, singing, art, acting, improv, writing. When I answer that pull I meet a real need, and the answer satisfies on its own terms. It also widens what feels possible, which lets me connect ideas from far-apart places and see what happens where they overlap.",

    "Under all of it is my intuition. The better I know it, and the better I can tell it from things that only look like it, the more freely ideas come and the more clearly I decide.",

    "This is how I understand myself right now, after a long stretch of reflection, and I expect it to keep changing. I think each person is a bit like a prism, with the light of their own drive passing through the facets of where, how, and why. What I've shared is the shape of mine: one instinct, rooted in my values, exploring what it means to be alive and trying to leave the world a little better in whatever small way I can. The light of my intuition, spread across the many ways I show up."
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
   Each entry: { note, name, link, date } — link and date are optional.
   `date` is a free-form string shown after the name (e.g. "July 2026");
   leave it "" to show no date. */
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
  
    { note: "Yay, Samareh! I'm so happy to learn about (and experience!) all of the beautiful ways you share your gifts with the world. Thank you for making your projects easily legible in this space and for continuing to be you. What an infinite blessing.",
      name: "Leah Fulmer", link: "", date: "4 July 2026" },

    { note: "It’s very organized. I like the decoration. Hope your job helps people. Good luck.",
      name: "Shahla Imani", link: "", date: "1 July 2026" },

    { note: "I always like the idea of creating something new with AI - like this website. I've heard good things about it. Good luck!",
      name: "Abeo Jack (7 years old)", link: "", date: "20 June 2026" },

    { note: "I love you. Welcome to website and also I want to create with AI and also I like to draw on the computer and also I want to spin the whole house with one finger and also I really like to drink coconut water and also I really want to put some bit of blob of computer and then flush it down the toilet.",
      name: "Zia Jack (4 years old)", link: "", date: "20 June 2026" }
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
  intro:
    "Prefer to see everything in one list? " +
    "Here you'll find a casual collection of some of my ideas, " +
    "projects, and offerings — grouped below.",

  /* The list is grouped under these headings, in this order. An object
     joins the first category whose `id` matches one of its `tags`. Anything
     with no matching tag (about me, contact, the guest book, the tea) falls
     into the last category — so keep a catch-all heading at the bottom. */
  categories: [
    { id: "work",     label: "Work" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects & ideas" },
    { id: "creative", label: "Creative" },
    { id: "meta",     label: "About & hello" }
  ]
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
