import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Map, CalendarDays, Camera, Users, User, type LucideIcon } from "lucide-react";
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
  { icon: CalendarDays, label: "Itinerary", path: "/itinerary", match: /^\/(itinerary|plan-trip)/ },
  { icon: Camera, label: "Camera", path: "/camera" },
  { icon: Users, label: "Guides", path: "/guides" },
  { icon: User, label: "Profile", path: "/profile", match: /^\/(profile|settings)/ },
];

const isActive = (item: NavItem, pathname: string) =>
  item.match ? item.match.test(pathname) : pathname === item.path;

export const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  const isCameraPage = pathname === "/camera";
  const isMapPage = pathname === "/map";
  const isDetailPage = /^\/(itinerary|destinations|bookings)\/.+/.test(pathname);
  const showDock = !isCameraPage && !isDetailPage;

  return (
    <div className={cn("min-h-screen bg-background", isMapPage && "h-[100dvh] overflow-hidden")}>
      <main className={cn(showDock && !isMapPage && "pb-dock")}>{children}</main>

      {showDock && (
        <nav
          aria-label="Primary"
          className="fixed left-1/2 z-50 -translate-x-1/2"
          style={{ bottom: "calc(var(--dock-offset) + env(safe-area-inset-bottom))" }}
        >
          <div className="flex h-[var(--dock-height)] items-center gap-1 rounded-full bg-ink p-2 shadow-lg">
            {navItems.map((item) => {
              const active = isActive(item, pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-12 items-center justify-center gap-2 rounded-full transition-all duration-300 ease-out",
                    active
                      ? "bg-ink-foreground px-4 text-ink"
                      : "w-12 text-ink-muted hover:text-ink-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2 : 1.75} />
                  {active && <span className="whitespace-nowrap text-[13px] font-semibold">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};
