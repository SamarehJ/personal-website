# Samareh Jack — the office

A point-and-click personal site. You arrive at a door, walk up, it swings
open onto your office, and objects in the room glow, introduce themselves,
and lead elsewhere.

## File map

    index.html        page structure (door, room, cards)
    css/style.css     all styling — has a table of contents at the top
    js/config.js      ★ THE FILE YOU EDIT — objects, welcome, door geometry
    js/main.js        the machinery — commented, with a table of contents
    js/editor.js      the ?edit hotspot tracer
    assets/           office.jpg, door.jpg, previews/ (card images)

## Deploy on GitHub Pages

1. Create a repo (for a root URL, name it `YOURUSERNAME.github.io`).
2. Put the contents of this folder at the repo root and push.
3. Repo Settings → Pages → Source: "Deploy from a branch" → `main`, `/ (root)`.

No build step, no dependencies.

## Placeholders to replace (all in js/config.js)

- Buy Me a Coffee URL on the tea (`YOUR-PAGE-HERE`)
- The LinkedIn URL — I found `linkedin.com/in/samareh-jack-5b1713a` by
  search; confirm it's yours
- Resume URL — empty for now, which simply hides the button; drop a PDF
  in `assets/` and point the link at `assets/resume.pdf` when ready

The card descriptions were written from your live sites as of June 2026 —
reword freely as the sites evolve.

## Card preview images

Each examine card can show an image across its top. The config already
points at these paths — drop files there and they appear (a missing file
just means no image, never an error):

    assets/previews/tea.jpg          a photo or your BMC banner
    assets/previews/work.jpg         e.g. a resume snippet or headshot
    assets/previews/accompany.jpg    screenshot of the practice site
    assets/previews/creedal.jpg      screenshot of the essay
    assets/previews/justshowup.jpg   screenshot of the events page
    assets/previews/consensus.jpg    screenshot of the app

To make a screenshot: open the site, and use your browser's built-in
capture (Chrome: ⌘⇧P → "Capture screenshot") or any screen grab. Crop to
roughly 3:1 (they display about 540 × 220) and save with the name above.

## Tracing hotspots yourself (?edit)

Open the site with `?edit` on the URL — locally that's
`index.html?edit`; deployed it's `yoursite.github.io/?edit`.

- Click around the edge of an object; each click drops a point.
- Existing hotspots show in faint gold. Drag to pan, as usual.
- "Copy config" puts the `hitbox:` and `outline:` lines on your
  clipboard — paste them into the object's entry in `js/config.js`.
- Undo removes the last point; Clear restarts the shape.

Visitors never see the editor; it only exists behind `?edit`.

## How the entrance works

Hallway, slowly drawing you toward the door → click → the walk-up
accelerates until the door fills the screen, nameplate centered → the
door swings inward, revealing the lit room → the room steps forward to
full size and drifts to center.

The door now greets every visit — it plays on each page load (refresh to
see it again). Reduced-motion visitors get a simple fade instead of the
swing. The name is real text overlaid on the plate; if you regenerate the
door image, update the `DOOR` block in config (the `leaf` rectangle and
the `plate` center).

## How highlighting works

- Only the guest chair pulses until the welcome is answered.
- An answer pulses the relevant objects twice, then leaves a faint
  shimmer on them. Examining an object clears its shimmer. The hotspots
  themselves never turn off — hover and tap always work on everything.
- "Just wandering" pulses everything once and shimmers nothing.
- The eye button (bottom right) re-pulses everything on demand.
- All of it resets on every page load. If someone clicked the tea on a
  previous visit and then refreshes, it shimmers again until they click
  it this visit — a fresh look each time.
- "everyone"-tagged objects (the tea, later the blog) shimmer for every
  visitor, including the "just wandering" crowd.

## Adding a new object

Copy any entry in `ROOM_OBJECTS` (js/config.js), then:

1. Trace its `hitbox` and `outline` with `?edit` (above).
2. Write its `title` (what it's about) and `flavor` (your voice, to the
   visitor).
3. Add `links` — by default a link opens in a new tab; an empty url hides
   its button. Add `embed: true` to a link to open it *inside* the office
   instead (a framed panel with a "Back to the room" bar). That only works
   for pages that allow framing — your own sites and PDFs do; LinkedIn and
   Buy Me a Coffee don't, so leave those without `embed`.
4. Pick `tags` so the welcome knows who it's for: `work`,
   `accompaniment`, `projects`, `creative`, or `everyone`. Multiple
   tags are fine.
5. Optionally add an `image` preview (see above).

A commented list of everything still waiting to move in sits at the
bottom of the objects array.

Three objects open special panels instead of an examine card, set by a
flag on the object: `about: true` (the desk chair → about-me),
`contact: true` (the pencil holder → message form), and
`guestbook: true` (the books → guest book). Their copy lives in the
`ABOUT`, `CONTACT`, and `GUESTBOOK` blocks of `js/config.js`.

## About me, contact, and the guest book

- **About me** (`ABOUT` in config): a short `teaser`, then a `full`
  version behind "read more". Currently PLACEHOLDER text — replace it.
- **Contact** (`CONTACT` in config) and **guest book sign form** both POST
  to Formspree. Set your endpoint once in `FORMSPREE_ENDPOINT`
  (already wired to your `f/mnjzeodj`). Each submission carries a hidden
  `type` field (`contact` / `guestbook`) so you can tell them apart in
  your inbox. The forms submit without leaving the office.
- **Guest book** (`GUESTBOOK` in config) is **curated by you**. Visitors
  send an entry through the sign form; it arrives in your Formspree inbox;
  you add the ones you like to `GUESTBOOK.entries` by hand and push. Each
  entry is `{ note, name, link }` (link optional); newest goes at the top.
  Nothing is public until you add it, so there's no spam to moderate and
  no database to run. Two example entries are in there now — replace or
  delete them.

The three hotspots ship with ROUGH placeholder coordinates so they're
clickable immediately — re-trace each (desk chair, pencil holder, books)
with `?edit` for a clean glow.

## Updating the images

- Office: replace `assets/office.jpg`. If the framing changed, re-trace
  hotspots with `?edit`. If the dimensions changed, update the aspect
  ratio in `css/style.css` (sections [1] and [3] — two places).
- Door: replace `assets/door.jpg`, update the `DOOR` block in config
  (aspect, slab edges, nameplate center — all in % of the image).
