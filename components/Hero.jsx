"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import StatCard from "./StatCard";
import { HEADLINE, STATS } from "@/data/hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const clamp01 = gsap.utils.clamp(0, 1);

// Road coverage (0–1) at which each stat card appears, in STATS order.
const CARD_THRESHOLDS = [0.5, 0.6, 0.7, 0.8];
const LETTER_RISE = 45; // yPercent a letter rises from as the trail uncovers it
const REAR_INSET = 0.04; // rear bumper position as a fraction of the car width (image has a soft edge)

export default function Hero() {
  const sectionRef = useRef(null);
  const roadRef = useRef(null);
  const revealRef = useRef(null);
  const revealInnerRef = useRef(null);
  const headlineRef = useRef(null);
  const carRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const road = roadRef.current;
      const reveal = revealRef.current;
      const revealInner = revealInnerRef.current;
      const headline = headlineRef.current;
      const car = carRef.current;
      const letters = gsap.utils.toArray(".letter", section);
      const stats = gsap.utils.toArray(".stat", section);
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
          gsap.set(stats, { autoAlpha: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.92 });

          /* ---------- 1. Intro: the car rolls onto the road ---------- */
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(car, reduce ? { opacity: 0, duration: 0.6 } : { xPercent: -110, duration: 1.6, ease: "power4.out" })
            .from(hint, { y: 10, opacity: 0, duration: 0.7 }, "-=0.6");

          /* ---------- 2. Scroll: progress-driven, pinned ---------- */
          // Layout is read only here: on setup and on every ScrollTrigger refresh (e.g. resize).
          // The per-frame render() below reads nothing from the DOM.
          const m = { roadW: 1, carW: 0, letters: [] };
          const measure = () => {
            m.roadW = road.offsetWidth || 1;
            m.carW = car.offsetWidth;
            m.letters = letters.map((el) => ({
              left: headline.offsetLeft + el.offsetLeft,
              width: el.offsetWidth || 1,
            }));
          };

          // quickSetters write transforms directly, skipping tween overhead.
          const setCarX = gsap.quickSetter(car, "x", "px");
          const setRevealX = gsap.quickSetter(reveal, "x", "px");
          const setRevealInnerX = gsap.quickSetter(revealInner, "x", "px");
          const setLetterY = letters.map((el) => gsap.quickSetter(el, "yPercent"));
          const setHint = gsap.quickSetter(hint.firstElementChild, "opacity");

          // Cards are triggered (not scrubbed) once their threshold is crossed,
          // so each one gets a full, eased entrance; scrolling back hides them again.
          const cardShown = stats.map(() => false);
          const toggleCard = (i, show) => {
            cardShown[i] = show;
            gsap.to(stats[i], {
              autoAlpha: show ? 1 : 0,
              y: show || reduce ? 0 : 40,
              scale: show || reduce ? 1 : 0.92,
              duration: show ? 0.8 : 0.4,
              ease: show ? "back.out(1.6)" : "power2.in",
              overwrite: true,
            });
          };

          const state = { p: 0 };
          const render = () => {
            // The car drives fully off the road, so the trail covers every letter on any width.
            const carX = state.p * (m.roadW + 40); // +40 clears the drop shadow too
            // Trail edge follows the car's rear bumper, capped once the whole road is covered.
            const paint = Math.min(carX + m.carW * REAR_INSET, m.roadW);
            const coverage = paint / m.roadW;

            setCarX(carX);
            // Mask: the outer layer slides in from the left, the inner layer slides the
            // opposite way, so the headline stays put and only shows where the trail is.
            setRevealX(paint - m.roadW);
            setRevealInnerX(m.roadW - paint);

            m.letters.forEach(({ left, width }, i) => {
              const t = clamp01((paint - left) / (width * 1.5));
              setLetterY[i](reduce ? 0 : LETTER_RISE * (1 - t) * (1 - t));
            });

            CARD_THRESHOLDS.forEach((threshold, i) => {
              const show = coverage >= threshold;
              if (show !== cardShown[i]) toggleCard(i, show);
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
              end: "+=250%",
              pin: true,
              anticipatePin: 1,
              // scrub eases the car towards the scroll position, so wheel "steps"
              // turn into one fluid drive.
              scrub: reduce ? true : 1.2,
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
          <div ref={roadRef} className="relative h-28 w-full overflow-hidden bg-road md:h-52">
            {/* lane markings */}
            <div className="lane absolute inset-x-0 top-1/2 h-1 -translate-y-1/2" />
            <div className="absolute inset-x-0 top-2 h-px bg-white/10 md:top-3" />
            <div className="absolute inset-x-0 bottom-2 h-px bg-white/10 md:bottom-3" />

            {/* trail + headline mask */}
            <div
              ref={revealRef}
              className="absolute inset-0 overflow-hidden bg-trail"
              style={{ transform: "translateX(-100%)" }}
            >
              <div ref={revealInnerRef} className="absolute inset-0" style={{ transform: "translateX(100%)" }}>
                <h1
                  ref={headlineRef}
                  aria-label="Welcome ItzFizz"
                  className="absolute inset-y-0 left-[4vw] flex items-center gap-[0.08em] text-[clamp(1.6rem,6.6vw,7.5rem)] leading-none font-extrabold text-ink"
                >
                  {[...HEADLINE].map((char, i) =>
                    char === " " ? (
                      <span key={i} className="inline-block w-[0.4em]" aria-hidden="true" />
                    ) : (
                      <span key={i} className="letter inline-block" aria-hidden="true">
                        {char}
                      </span>
                    ),
                  )}
                </h1>
              </div>
            </div>

            <div
              ref={carRef}
              className="car absolute top-[6%] left-0 z-10 aspect-[735/388] h-[88%]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimizer */}
              <img src={`${BASE_PATH}/car.png`} alt="" className="h-full w-full" draggable="false" />
            </div>
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
