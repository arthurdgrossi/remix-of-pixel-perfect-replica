import { createFileRoute } from "@tanstack/react-router";

import { DottedSurface } from "@/components/ui/dotted-surface";

export const Route = createFileRoute("/dotted-surface-demo")({
  component: DemoOne,
});

/**
 * Isolated preview of <DottedSurface /> at /dotted-surface-demo.
 * Mirrors the upstream demo, adapted to the project (route component, brand
 * fonts/tokens, and a stable color-mix glow instead of the `--theme()` form).
 */
function DemoOne() {
  return (
    <main className="relative min-h-dvh bg-background text-foreground">
      <DottedSurface className="size-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full blur-[30px]"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in oklab, var(--color-foreground) 10%, transparent), transparent 50%)",
          }}
        />
        <h1 className="font-mono text-4xl font-semibold tracking-tight">Dotted Surface</h1>
      </div>
    </main>
  );
}
