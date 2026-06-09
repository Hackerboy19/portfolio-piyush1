interface StackBadgesProps {
  items: readonly string[];
}

export function StackBadges({ items }: StackBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s, i) => (
        <span
          key={s}
          style={{ animationDelay: `${i * 50}ms` }}
          className="rounded-full glass px-4 py-2 text-sm font-medium shadow-soft transition-transform hover:-translate-y-0.5 hover:scale-105"
        >
          {s}
        </span>
      ))}
    </div>
  );
}