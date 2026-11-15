import { useEffect, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Compass, Inbox, Landmark, Luggage, Map as MapIcon, MessagesSquare, Plus, Smartphone, Ticket, type LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useInbox } from "@/features/trips";
import { cn } from "@/lib/utils";

const NAV: { to: string; label: string; icon: LucideIcon; match?: RegExp }[] = [
  { to: "/trips", label: "Trips", icon: Luggage, match: /^\/trips/ },
  { to: "/plan", label: "Plan with AI", icon: MessagesSquare, match: /^\/plan/ },
  { to: "/explore", label: "Explore", icon: Compass, match: /^\/explore/ },
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/library", label: "Discoveries", icon: Landmark },
  { to: "/inbox", label: "From your phone", icon: Inbox },
  { to: "/bookings", label: "Guide bookings", icon: Ticket },
];

/** Sidebar shell: product name, one action, navigation, the account. */
export const Shell = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { items } = useInbox();

  useEffect(() => {
    document.getElementById("desk-main")?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background text-foreground">
      <aside className="flex w-[248px] shrink-0 flex-col border-r border-border px-3 pb-3 pt-5">
        <Link to="/trips" className="px-3 text-display text-[26px] leading-none">
          Ventura
        </Link>
        <Button className="mx-1 mt-6 h-10 justify-start gap-2 px-3" onClick={() => navigate("/plan")}>
          <Plus />
          Plan a trip
        </Button>

        <nav aria-label="Primary" className="mt-6 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, match }) => {
            const active = match ? match.test(pathname) : pathname === to;
            const count = to === "/inbox" ? items.length : 0;
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-9 items-center gap-2.5 rounded-[var(--radius-control)] px-3 text-sm transition-colors",
                  active ? "bg-card font-medium text-foreground shadow-xs ring-1 ring-border" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
                <span className="flex-1">{label}</span>
                {count > 0 && <span className="text-xs tabular-nums text-muted-foreground">{count}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <p className="flex items-center gap-2 px-3 text-xs text-muted-foreground">
            <Smartphone className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Phone synced
          </p>
          <Link
            to="/profile"
            className={cn(
              "flex items-center gap-2.5 rounded-[var(--radius-control)] px-2 py-2 transition-colors hover:bg-secondary",
              pathname === "/profile" && "bg-card shadow-xs ring-1 ring-border",
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-ink text-xs font-medium text-ink-foreground">AT</AvatarFallback>
            </Avatar>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">Alex Turner</span>
              <span className="block truncate text-xs text-muted-foreground">Profile and settings</span>
            </span>
          </Link>
        </div>
      </aside>

      <main id="desk-main" className="min-w-0 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

/** Page heading used across desktop pages. */
export const PageHeader = ({ eyebrow, title, children, className }: { eyebrow?: ReactNode; title: ReactNode; children?: ReactNode; className?: string }) => (
  <header className={cn("flex items-end justify-between gap-6 pb-8", className)}>
    <div className="min-w-0 space-y-2">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="text-display text-[44px] leading-[1.05]">{title}</h1>
    </div>
    {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
  </header>
);

/** Standard page padding and width. */
export const Page = ({ children, className, wide }: { children: ReactNode; className?: string; wide?: boolean }) => (
  <div className={cn("mx-auto w-full px-10 pb-16 pt-10", wide ? "max-w-[1440px]" : "max-w-[1200px]", className)}>{children}</div>
);
