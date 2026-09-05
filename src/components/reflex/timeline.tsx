import { format } from "date-fns";
import type { TimelineEntry } from "@/lib/reflex/types";
import { StatusBadge } from "./status-badge";

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="relative space-y-4 border-l pl-5">
      {entries.map((e, i) => (
        <li key={`${e.status}-${e.at}-${i}`} className="relative">
          <span className="absolute top-1.5 -left-[26px] h-3 w-3 rounded-full border-2 border-card bg-primary" />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={e.status} />
            <span className="text-xs text-muted-foreground">
              {format(new Date(e.at), "dd MMM yyyy • HH:mm")}
            </span>
          </div>
          {e.note && <p className="mt-1 text-sm text-muted-foreground">{e.note}</p>}
        </li>
      ))}
    </ol>
  );
}
