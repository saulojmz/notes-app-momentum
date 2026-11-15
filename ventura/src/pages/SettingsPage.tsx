import { useNavigate } from "react-router-dom";
import { Bookmark, CalendarDays, MapPin, ChevronRight, Map as MapIcon, Landmark, Camera, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/kit";

const week = [
  { value: "3", label: "Stories saved" },
  { value: "2", label: "Guides met" },
  { value: "1", label: "City explored" },
];

const collections: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: Bookmark, title: "Saved places", detail: "45 locations" },
  { icon: CalendarDays, title: "Past trips", detail: "12 cities" },
  { icon: MapPin, title: "Shared itineraries", detail: "8 published" },
];

const achievements: { icon: LucideIcon; label: string }[] = [
  { icon: MapIcon, label: "Explorer" },
  { icon: Landmark, label: "Culture enthusiast" },
  { icon: Camera, label: "Photographer" },
];

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <TopBar onBack={() => navigate(-1)} />

      <div className="mx-auto max-w-2xl space-y-10 px-5">
        <header>
          <p className="eyebrow">Account</p>
          <h1 className="text-display mt-2 text-[36px]">Settings</h1>
        </header>

        {/* This week */}
        <section className="surface p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-[13px] text-muted-foreground">This week</p>
            <p className="tabular-nums text-[11px] text-muted-foreground">Edinburgh</p>
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-3">
            {week.map(({ value, label }) => (
              <div key={label}>
                <dd className="text-display text-[36px] tabular-nums">{value}</dd>
                <dt className="mt-1 text-xs text-muted-foreground">{label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* Collections */}
        <section className="space-y-3">
          <p className="eyebrow">Your collections</p>
          <div className="surface divide-y divide-border overflow-hidden p-0">
            {collections.map(({ icon: Icon, title, detail }) => (
              <button
                key={title}
                type="button"
                onClick={() => toast(`${title} is coming soon`)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{title}</span>
                  <span className="meta block">{detail}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="space-y-3">
          <p className="eyebrow">Achievements · {achievements.length}</p>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map(({ icon: Icon, label }) => (
              <div key={label} className="surface flex flex-col items-center gap-2 px-2 py-4 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </span>
                <span className="text-xs font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
