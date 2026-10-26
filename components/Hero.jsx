"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Car from "./Car";
import StatCard from "./StatCard";
import { HEADLINE, STATS } from "@/data/hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const clamp01 = gsap.utils.clamp(0, 1);
const CARD_LIFT = 14; // px a stat card rises while the car passes under it
const CARD_RANGE = 320; // px either side of a card where the lift is felt

export default function Hero() {
  const sectionRef = useRef(null);
  const roadRef = useRef(null);
  const trailRef = useRef(null);
  const headlineRef = useRef(null);
  const carRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const road = roadRef.current;
      const trail = trailRef.current;
      const headline = headlineRef.current;
      const car = carRef.current;
      const letters = gsap.utils.toArray(".letter", section);
      const fills = gsap.utils.toArray(".letter-fill", section);
      const stats = gsap.utils.toArray(".stat", section);
      const cards = gsap.utils.toArray(".stat-card", section);
      const hint = section.querySelector(".scroll-hint");

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        ({ conditions }) => {
          const { reduce } = conditions;

          // Section starts hidden in CSS to avoid a flash of un-animated content.
          gsap.set(section, { autoAlpha: 1 });

          /* ---------- 1. Intro: time-based, plays once on load ---------- */
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

          if (reduce) {
            intro.from([car, ...letters, ...stats, hint], { opacity: 0, duration: 0.6, stagger: 0.03 });
          } else {
            intro
              .from(car, { xPercent: -120, duration: 1.4, ease: "power4.out" })
              .from(letters, { yPercent: 70, opacity: 0, duration: 1, stagger: 0.045 }, 0.15)
              .from(stats, { y: 40, opacity: 0, scale: 0.95, duration: 0.9, stagger: 0.15 }, 0.75)
              .from(hint, { y: 10, opacity: 0, duration: 0.6 }, "-=0.4");
          }

          /* ---------- 2. Scroll: progress-driven, pinned ---------- */
          // Layout is read only here: on setup and on every ScrollTrigger refresh (e.g. resize).
          // The per-frame render() below reads nothing from the DOM.
          const m = { roadW: 1, carW: 0, travel: 0, letters: [], cards: [] };
          const measure = () => {
            m.roadW = road.offsetWidth || 1;
            m.carW = car.offsetWidth;
            // The car exits the road completely, so the trail covers every letter on any screen width.
            m.travel = m.roadW;
            m.letters = fills.map(({ parentElement: el }) => ({
              left: headline.offsetLeft + el.offsetLeft,
              width: el.offsetWidth || 1,
            }));
            m.cards = stats.map((el) => el.offsetLeft + el.offsetWidth / 2);
          };

          // quickSetters write transform/opacity directly, skipping tween overhead.
          const setCarX = gsap.quickSetter(car, "x", "px");
          const setTrail = gsap.quickSetter(trail, "scaleX");
          const setFill = fills.map((el) => gsap.quickSetter(el, "opacity"));
          const setCardY = cards.map((el) => gsap.quickSetter(el, "y", "px"));
          const setHint = gsap.quickSetter(hint.firstElementChild, "opacity");

          const state = { p: 0 };
          const render = () => {
            const carX = state.p * m.travel;
            const paint = carX + m.carW / 2; // the trail ends at the car's centre

            setCarX(carX);
            setTrail(paint / m.roadW);
            // Each letter fades in across its own width as the trail sweeps over it.
            m.letters.forEach(({ left, width }, i) => setFill[i](clamp01((paint - left) / width)));
            // Cards rise smoothly as the car approaches, settle as it leaves.
            m.cards.forEach((centre, i) => {
              const near = clamp01(1 - Math.abs(paint - centre) / CARD_RANGE);
              setCardY[i](-CARD_LIFT * near * near);
            });
            setHint(1 - clamp01(state.p * 10));
          };

          measure();
          render();

          gsap.to(state, {
            p: 1,
            ease: "none",
            onUpdate: render,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=200%",
              pin: true,
              // scrub: 1 eases the car towards the scroll position over ~1s,
              // so wheel "steps" turn into fluid motion.
              scrub: reduce ? true : 1,
              onRefresh: () => {
                measure();
                render();
              },
            },
          });
        },
      );

      // Letter widths change once the web font swaps in; re-measure then.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: sectionRef },
  );

  return (
    <div>
      <section
        ref={sectionRef}
        className="invisible relative h-svh w-full overflow-hidden bg-track"
        aria-label="Welcome to ItzFizz"
      >
        <div className="absolute inset-0 flex items-center">
          <div ref={roadRef} className="relative h-28 w-full overflow-hidden bg-road md:h-48">
            <div
              ref={trailRef}
              className="absolute inset-0 origin-left bg-trail"
              style={{ transform: "scaleX(0)" }}
            />

            <h1
              ref={headlineRef}
              aria-label="Welcome ItzFizz"
              className="absolute inset-y-0 left-[4vw] flex items-center gap-[0.08em] text-[clamp(1.6rem,6.6vw,7.5rem)] leading-none font-extrabold"
            >
              {[...HEADLINE].map((char, i) =>
                char === " " ? (
                  <span key={i} className="letter inline-block w-[0.4em]" aria-hidden="true" />
                ) : (
                  <span key={i} className="letter relative inline-block" aria-hidden="true">
                    <span className="letter-ghost">{char}</span>
                    <span className="letter-fill absolute inset-0 text-ink opacity-0">{char}</span>
                  </span>
                ),
              )}
            </h1>

            <Car ref={carRef} className="absolute top-0 left-0 z-10 h-full" />
          </div>
        </div>

        {STATS.map((stat) => (
          <StatCard key={stat.value + stat.label} {...stat} />
        ))}

        <div className="scroll-hint absolute bottom-[6%] left-[4vw] hidden md:block">
          <p className="flex items-center gap-3 text-sm font-semibold tracking-[0.3em] text-ink/70 uppercase">
            Scroll to drive
            <span className="inline-block h-px w-10 bg-ink/50" />
          </p>
        </div>
      </section>
    </div>
  );
}
