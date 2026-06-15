import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Editorial section eyebrow: a tabular mono index ([02]) + hairline rule + a
 * spaced mono label. One consistent "spec-sheet" system across every section,
 * which reads as deliberate rather than the default "uppercase tracked label"
 * repeated everywhere. `tone="feature"` adapts it for the dark navy band.
 */
export function SectionLabel({
  index,
  children,
  className,
  tone = "default",
}: {
  index: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "feature";
}) {
  const onFeature = tone === "feature";
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "font-mono text-xs font-medium tabular-nums",
          onFeature ? "text-feature-accent" : "text-accent",
        )}
      >
        [{index}]
      </span>
      <span aria-hidden className={cn("h-px w-6", onFeature ? "bg-white/25" : "bg-border")} />
      <span className={cn("spec-label", onFeature ? "text-feature-muted" : "text-muted-foreground")}>
        {children}
      </span>
    </div>
  );
}
