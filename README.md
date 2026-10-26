# ItzFizz — Scroll-Driven Hero

A hero section where a car drives along a road as you scroll. A green trail follows the car and reveals **W E L C O M E  I T Z F I Z Z**, and impact stats pop in once half the road is covered.

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

**1. Load intro (time-based)**: the car rolls onto the road from off-screen (`power4.out`), then the "Scroll to drive" hint fades in.

**2. Scroll (progress-based)**: a single tween drives `state.p` from 0 to 1, tied to a pinned `ScrollTrigger` (`end: "+=250%"`, `scrub: 1.2`). The `scrub` value smooths the progress towards the scroll position, so wheel steps become one fluid drive. Every frame, `render()` maps `p` to:
- **car**: `x` from the left edge until it drives off the road
- **trail + headline**: the green trail is a mask made of two layers moving in opposite directions (outer `x = edge - roadWidth`, inner `x = roadWidth - edge`). The headline sits inside it, so text is **hidden until the car passes** and appears exactly where the trail is. Each letter also rises into place as it is uncovered.
- **stat cards**: hidden at first. Once the trail covers **50%, 60%, 70% and 80%** of the road, the cards pop in one by one (`back.out` ease). Scrolling back hides them again.

**Performance**
- Only `transform` and `opacity` are animated.
- Layout is read only in `measure()`, which runs on setup and on ScrollTrigger refresh (resize, font load). It is never read during scroll.
- `gsap.quickSetter` writes values directly, without creating tweens per frame.

**Accessibility**
- `prefers-reduced-motion` gets fades only and an unsmoothed scrub.
- The headline has an `aria-label`, so screen readers read "Welcome ItzFizz" instead of single letters.

## Deploy (GitHub Pages)

1. Push this project to the `main` branch of a GitHub repo.
2. In the repo, go to **Settings → Pages → Source** and choose **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it at `https://<user>.github.io/<repo>/`.

## Structure

```
app/          layout, page, global styles
components/   Hero (animation logic), StatCard
public/car.png  top-down car image
data/hero.js  headline text and stats content
```
