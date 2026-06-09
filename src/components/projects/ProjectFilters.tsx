interface ProjectFiltersProps<T extends string> {
  filters: readonly T[];
  active: T;
  onChange: (next: T) => void;
}

export function ProjectFilters<T extends string>({
  filters,
  active,
  onChange,
}: ProjectFiltersProps<T>) {
  return (
    <div
      className="reveal mb-8 flex flex-wrap justify-center gap-2"
      role="tablist"
      aria-label="Filter projects by category"
    >
      {filters.map((f) => {
        const isActive = active === f;
        return (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              isActive
                ? "bg-primary text-primary-foreground shadow-glow"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}