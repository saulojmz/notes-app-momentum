import { createClaudePlanner, findHost } from "./claude";
import { createDemoPlanner } from "./demo";
import { createServerPlanner, serverConfigured } from "./server";
import type { PlannerAI } from "./types";

export type { PlannerAI, TurnResult } from "./types";
export { PlannerAIError } from "./types";
export { createDemoPlanner } from "./demo";

let chosen: Promise<PlannerAI> | null = null;

/**
 * Pick the best available planner, once per session:
 * 1. Claude, when a Ventura host bridge or artifact runtime is present
 * 2. the `travel-chat` edge function, when Supabase is configured
 * 3. the offline planner, which always works
 */
export const getPlannerAI = (): Promise<PlannerAI> => {
  if (!chosen) {
    chosen = (async () => {
      const host = findHost();
      if (host && (await host.available().catch(() => false))) return createClaudePlanner(host);
      if (serverConfigured()) return createServerPlanner();
      return createDemoPlanner();
    })();
  }
  return chosen;
};

/** After a permanent failure (e.g. the viewer declined Claude), stay offline. */
export const fallBackToDemo = (): PlannerAI => {
  const demo = createDemoPlanner();
  chosen = Promise.resolve(demo);
  return demo;
};
