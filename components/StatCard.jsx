// Hidden until the car has covered half the road; Hero.jsx reveals each card in turn.
export default function StatCard({ value, label, tone, position }) {
  return (
    <div
      className={`stat invisible absolute flex w-[calc(50%-1.5rem)] flex-col gap-1 rounded-xl p-4 opacity-0 shadow-xl shadow-black/15 md:w-64 md:p-7 ${tone} ${position}`}
    >
      <span className="text-4xl leading-none font-semibold md:text-6xl">{value}</span>
      <span className="text-sm leading-snug font-medium md:text-lg">{label}</span>
    </div>
  );
}
