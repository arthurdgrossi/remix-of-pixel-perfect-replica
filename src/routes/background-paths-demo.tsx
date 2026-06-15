import { createFileRoute } from "@tanstack/react-router";

import { BackgroundPaths } from "@/components/ui/background-paths";

export const Route = createFileRoute("/background-paths-demo")({
  component: DemoBackgroundPaths,
});

/** Isolated preview of the full <BackgroundPaths /> showcase. */
function DemoBackgroundPaths() {
  return <BackgroundPaths title="Background Paths" />;
}
