// `.stat` is animated on load; `.stat-card` lifts on scroll as the car passes.
// Separate elements so the two animations never fight over the same transform.
export default function StatCard({ value, label, tone, position }) {
  return (
    <div className={`stat absolute w-[calc(50%-1.5rem)] md:w-64 ${position}`}>
      <div
        className={`stat-card flex flex-col gap-1 rounded-xl p-4 shadow-lg shadow-black/10 md:p-7 ${tone}`}
      >
        <span className="text-4xl leading-none font-semibold md:text-6xl">{value}</span>
        <span className="text-sm leading-snug font-medium md:text-lg">{label}</span>
      </div>
    </div>
  );
}
