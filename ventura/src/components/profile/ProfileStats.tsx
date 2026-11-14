interface ProfileStatsProps {
  itineraries: number;
  cities: number;
  saved: number;
}

export const ProfileStats = ({ itineraries, cities, saved }: ProfileStatsProps) => (
  <dl className="grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card py-4">
    {[
      { label: "Itineraries", value: itineraries },
      { label: "Cities", value: cities },
      { label: "Saved", value: saved },
    ].map(({ label, value }) => (
      <div key={label} className="flex flex-col items-center">
        <dd className="text-display text-[30px] tabular">{value}</dd>
        <dt className="eyebrow mt-1">{label}</dt>
      </div>
    ))}
  </dl>
);
