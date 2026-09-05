import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function QrCode({
  value,
  size = 160,
  className,
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void import("qrcode").then((mod) =>
      mod.default
        .toDataURL(value, { width: size * 2, margin: 1, color: { dark: "#0F172A", light: "#FFFFFF" } })
        .then((url) => {
          if (active) setSrc(url);
        })
        .catch(() => undefined),
    );
    return () => {
      active = false;
    };
  }, [value, size]);

  return (
    <div
      className={cn("flex items-center justify-center rounded-xl border bg-card p-2", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={`QR code for ${value}`} className="h-full w-full" />
      ) : (
        <span className="text-xs text-muted-foreground">Generating…</span>
      )}
    </div>
  );
}
