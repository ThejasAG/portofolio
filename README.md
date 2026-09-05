# Portfolio

A personal portfolio built with Next.js, TypeScript, Tailwind and Framer Motion.

> **The site is built; the content is not.** Every piece of personal
> information is a `CONTENT_REQUIRED` placeholder. Nothing about your
> experience, projects or achievements has been invented — see
> [Content you must fill in](#content-you-must-fill-in).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Structure

```
app/
  layout.tsx            root layout, fonts, SEO metadata, theme script
  page.tsx              the single-page portfolio
  globals.css           design tokens, typography, reduced-motion rules
  work/[slug]/page.tsx  generated case-study pages
  sitemap.ts robots.ts not-found.tsx

components/
  Shell.tsx             loading screen + nav + cursor wrapper
  LoadingScreen.tsx Navbar.tsx Hero.tsx IntroStatement.tsx
  Projects.tsx ProjectCard.tsx ProjectVisual.tsx
  TechnicalCases.tsx About.tsx Experience.tsx Skills.tsx
  Achievements.tsx Contact.tsx Footer.tsx
  Cursor.tsx MagneticButton.tsx MaskReveal.tsx SectionReveal.tsx
  SectionHeading.tsx ThemeToggle.tsx PageTransition.tsx

data/                   ← all content lives here
  profile.ts projects.ts caseStudies.ts experience.ts
  skills.ts achievements.ts sections.ts

lib/
  motion.ts             shared animation variants
  useReducedMotion.ts   reduced-motion + pointer media queries
```

## Editing content

All content is in `data/`. You should not need to touch component code.

| What | Where |
| --- | --- |
| Name, title, statement, email, links, SEO | `data/profile.ts` |
| Projects and their case studies | `data/projects.ts` |
| "Problems I've solved" write-ups | `data/caseStudies.ts` |
| Roles and education | `data/experience.ts` |
| Skill groups | `data/skills.ts` |
| Certifications, awards | `data/achievements.ts` |
| Section names and numbering | `data/sections.ts` |

Three pieces of prose live in components because they are copy, not data:
the About paragraphs (`components/About.tsx`), the scroll statement
(`components/IntroStatement.tsx`, the `SENTENCE` constant — wrap a word in
`[brackets]` to accent it), and the closing line (`components/Contact.tsx`,
`CLOSING`).

### Project images

Put files in `public/images/projects/` and set `image` in `data/projects.ts`
to e.g. `/images/projects/vya.png`. Until then each project shows a
labelled placeholder panel rather than a broken image. `imageBack` adds a
second layer for the parallax stack.

### Resume

Place the real file at `public/resume.pdf`, then set `resume: "/resume.pdf"`
in `data/profile.ts`. While it is `null` the resume buttons render visibly
disabled and say the file is not added — no link to a 404.

### Case study pages

Set `caseStudy: true` and fill the `study` object on a project.
`/work/<slug>` is then statically generated. Projects without it simply
have no case-study link.

## Content you must fill in

Most of the portfolio is written. What remains is information that exists
only in your head — search the repo for `CONTENT_REQUIRED`:

**Vya employment facts** (the work itself is written; only the employment
details are missing)
- `data/experience.ts` — employer name as it should appear publicly, your
  job title, the dates, and the location
- `data/projects.ts` — the `role` fields on the Vya entry (two places)
- `data/caseStudies.ts` — what you concluded about where parallel test
  execution was and was not worth using

**Links and deployment**
- `data/profile.ts` — `github` (your profile URL) and `seo.siteUrl` (your
  real domain, needed before deploying — canonical URLs, Open Graph and the
  sitemap are built from it)
- `public/resume.pdf` — add the file, then set `resume: "/resume.pdf"`

**Education**
- `data/experience.ts` — your degree dates

**Images** — every `imageAlt` is a placeholder until you add the
corresponding screenshot to `public/images/projects/`. Until then each
project shows a labelled placeholder panel rather than a broken image.

`data/achievements.ts` is intentionally empty; the section hides itself
until you add verifiable entries.

## Deploy

Any Node host works. On Vercel: push to a Git repo, import it, accept the
detected Next.js settings. Set `seo.siteUrl` to the production URL first.

```bash
npm run build && npm run start   # verify the production build locally
```

## Notes on behaviour

- **Motion** respects `prefers-reduced-motion`: animations are skipped and
  a CSS rule forces any server-rendered `initial` styles back to visible,
  so content is never hidden behind an animation that will not run.
- **The custom cursor** only appears on fine-pointer devices and never
  hides the native cursor unless it has mounted. Magnetic buttons and
  cursor-following effects are disabled on touch.
- **Dark mode** is set before first paint by an inline script, so there is
  no wrong-theme flash. The toggle overrides the system preference and
  persists in `localStorage`.
