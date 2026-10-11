export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded bg-accent-soft text-accent">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="font-serif text-2xl font-semibold leading-tight tabular-nums">{value}</p>
      </div>
    </div>
  );
}
