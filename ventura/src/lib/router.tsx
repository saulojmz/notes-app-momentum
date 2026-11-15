import type { ReactNode } from "react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

/**
 * The prototype build (`npm run build:prototype`) runs inside an embedded
 * frame without a real URL, so it routes in memory and can be told where to
 * start by the frame (data-start) or a global.
 */
const startRoute = (fallback: string): string => {
  try {
    const fromFrame = window.frameElement?.getAttribute("data-start");
    const fromGlobal = (window as unknown as { __VENTURA_START__?: string }).__VENTURA_START__;
    return fromFrame || fromGlobal || fallback;
  } catch {
    return fallback;
  }
};

export const AppRouter = ({ children, start, basename }: { children: ReactNode; start: string; basename?: string }) =>
  import.meta.env.MODE === "prototype" ? (
    <MemoryRouter initialEntries={[startRoute(start)]}>{children}</MemoryRouter>
  ) : (
    <BrowserRouter basename={basename}>{children}</BrowserRouter>
  );
