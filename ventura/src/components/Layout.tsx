import { ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Map, CalendarCheck, Camera, Users, User, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  /** Other routes that should light up this tab. */
  match?: RegExp;
}

const navItems: NavItem[] = [
  { icon: Map, label: "Map", path: "/map" },
  { icon: CalendarCheck, label: "Today", path: "/today", match: /^\/(today|itinerary)/ },
  { icon: Camera, label: "Camera", path: "/camera" },
  { icon: Users, label: "Guides", path: "/guides" },
  { icon: User, label: "Profile", path: "/profile", match: /^\/(profile|settings)/ },
];

const isActive = (item: NavItem, pathname: string) =>
  item.match ? item.match.test(pathname) : pathname === item.path;

export const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();

  // New screens start at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const isCameraPage = pathname === "/camera";
  const isMapPage = pathname === "/map";
  // Detail pages and focused planner flows run full-screen.
  const isDetailPage = /^\/(itinerary|bookings)\/.+/.test(pathname);
  const showDock = !isCameraPage && !isDetailPage;

  return (
    <div className={cn("min-h-screen bg-background", isMapPage && "h-[100dvh] overflow-hidden")}>
      <main className={cn(showDock && !isMapPage && "pb-dock")}>{children}</main>

      {showDock && (
        <nav
          aria-label="Primary"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex h-[var(--dock-height)] max-w-2xl items-stretch">
            {navItems.map((item) => {
              const active = isActive(item, pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
