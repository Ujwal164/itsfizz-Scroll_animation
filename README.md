# ItzFizz — Scroll-Driven Hero

A hero section where a car drives along a road as you scroll. A green trail follows the car and reveals **W E L C O M E  I T Z F I Z Z**, while impact stats sit around the road.

## Stack

| Tech | Role |
| --- | --- |
| Next.js 16 (App Router, static export) + React 19 | Components, build, static HTML for GitHub Pages |
| Tailwind CSS v4 | Layout, colours, responsive sizing |
| GSAP + ScrollTrigger + `@gsap/react` | Load intro, pinned scroll animation, React-safe cleanup |
| GitHub Actions | Build and deploy to GitHub Pages |

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static site in ./out
```

## How the animation works

All animation lives in [`components/Hero.jsx`](components/Hero.jsx).

**1. Load intro (time-based)** — one GSAP timeline:
- the car glides in from off-screen (`power4.out`)
- headline letters rise and fade in one by one (`stagger: 0.045`)
- the four stat cards follow one by one (`stagger: 0.15`)

**2. Scroll (progress-based)** — a single tween drives `state.p` from 0 to 1, tied to a pinned `ScrollTrigger` (`end: "+=200%"`, `scrub: 1`). The `scrub` value smooths the progress towards the scroll position, so wheel steps become fluid motion. Every frame, `render()` maps `p` to:
- **car**: `x` from 0 to the road width (the car drives off-screen)
- **trail**: `scaleX` up to the car's centre (transform, not width, so no reflow)
- **letters**: each letter's fill fades in across its own width as the trail passes over it
- **stat cards**: lift slightly while the car passes beneath them

**Performance**
- Only `transform` and `opacity` are animated.
- Layout is read only in `measure()`, which runs on setup and on ScrollTrigger refresh (resize, font load). It is never read during scroll.
- `gsap.quickSetter` writes values directly, without creating tweens per frame.

**Accessibility**
- `prefers-reduced-motion` gets a simple fade intro and an unsmoothed scrub.
- The headline has an `aria-label`, so screen readers read "Welcome ItzFizz" instead of single letters.

## Deploy (GitHub Pages)

1. Push this project to the `main` branch of a GitHub repo.
2. In the repo, go to **Settings → Pages → Source** and choose **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it at `https://<user>.github.io/<repo>/`.

## Structure

```
app/          layout, page, global styles, favicon
components/   Hero (animation logic), Car (inline SVG), StatCard
data/hero.js  headline text and stats content
```
