import { cn } from "@/lib/utils";

export function ReflexMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "brand-gradient inline-flex items-center justify-center rounded-xl text-primary-foreground",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[62%] w-[62%]" aria-hidden="true">
        <path
          d="M12 22s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M8.6 11.6h4.2m0 0-1.6-1.7m1.6 1.7-1.6 1.7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ReflexLogo({
  className,
  tagline = false,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <ReflexMark className="h-9 w-9" />
      <div className="leading-tight">
        <div className="text-lg font-extrabold tracking-tight text-foreground">Reflex</div>
        {tagline && (
          <div className="text-[11px] font-medium text-muted-foreground">
            Every delivery. Under control.
          </div>
        )}
      </div>
    </div>
  );
}
