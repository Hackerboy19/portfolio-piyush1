/**
 * Fixed-size pulse skeleton matching the ProjectCard footprint so the
 * grid reserves the same layout box pre-mount — eliminates CLS when the
 * filter switches or when the route first hydrates.
 */
export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl glass shadow-soft"
        >
          <div className="aspect-[4/3] w-full animate-pulse bg-muted/60" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted/70" />
            <div className="h-3 w-full animate-pulse rounded bg-muted/50" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-muted/50" />
            <div className="flex gap-2 pt-2">
              <div className="h-5 w-14 animate-pulse rounded-full bg-muted/60" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted/60" />
              <div className="h-5 w-12 animate-pulse rounded-full bg-muted/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}