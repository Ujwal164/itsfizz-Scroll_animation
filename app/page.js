import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="flex h-[70svh] flex-col items-center justify-center gap-3 bg-road px-4 text-center text-white">
        <p className="text-sm font-medium tracking-[0.3em] text-trail uppercase">End of the road</p>
        <h2 className="text-3xl font-extrabold md:text-5xl">Scroll back up to replay the ride.</h2>
      </section>
    </main>
  );
}
