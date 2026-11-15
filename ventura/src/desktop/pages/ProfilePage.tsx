import { useState } from "react";
import { Link } from "react-router-dom";
import { Smartphone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SmartImage } from "@/components/kit";
import { updateTrip, useSavedTrips } from "@/features/planner/trips";
import { formatRange } from "@/features/trips";
import { useSavedLandmarks } from "@/hooks/useSavedLandmarks";
import { useGuideBookings } from "@/hooks/useGuideBookings";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { Page, PageHeader } from "../Shell";

const ProfilePage = () => {
  const { saved } = useSavedTrips();
  const { savedLandmarks } = useSavedLandmarks();
  const { bookings } = useGuideBookings();
  const profile = storage.get("ventura_profile", { name: "Alex Turner", username: "alex_turner", bio: "Solo traveler, one city at a time" });
  const [prefs, setPrefs] = useState(() => storage.get("ventura_desktop_prefs", { currency: "£", units: "km", email: true }));
  const setPref = <K extends keyof typeof prefs>(k: K, v: (typeof prefs)[K]) => {
    const next = { ...prefs, [k]: v };
    setPrefs(next);
    storage.set("ventura_desktop_prefs", next);
  };
  const days = saved.reduce((n, t) => n + t.days.length, 0);
  const cities = new Set(saved.map((t) => t.destinationName)).size;

  return (
    <Page>
      <PageHeader eyebrow="Account" title="Profile and settings" />
      <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-12">
        <aside className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-display bg-ink text-[26px] text-ink-foreground">AT</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-title text-xl">{profile.name}</p>
              <p className="meta">@{profile.username}</p>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-foreground/85">{profile.bio}</p>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {[
              { k: "Trips", v: saved.length },
              { k: "Cities", v: cities },
              { k: "Days planned", v: days },
              { k: "Discoveries", v: savedLandmarks.length },
            ].map(({ k, v }) => (
              <div key={k} className="bg-card px-4 py-3">
                <dd className="text-display text-[30px] leading-none tabular-nums">{v}</dd>
                <dt className="meta mt-1">{k}</dt>
              </div>
            ))}
          </dl>
          <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <Smartphone className="h-4 w-4" strokeWidth={1.5} />
            Alex's iPhone · synced just now · {bookings.length} guide {bookings.length === 1 ? "booking" : "bookings"}
          </p>
        </aside>

        <div className="space-y-10">
          <section className="space-y-3">
            <div>
              <h2 className="text-title text-xl">Publish itineraries</h2>
              <p className="mt-1 text-sm text-muted-foreground">Published trips appear in Explore for other travelers, without your dates, notes or bookings.</p>
            </div>
            <ul className="surface divide-y divide-border overflow-hidden p-0">
              {saved.map((t) => (
                <li key={t.id} className="flex items-center gap-4 px-4 py-3">
                  <SmartImage src={t.imageUrl} alt="" className="h-11 w-11 shrink-0 rounded-lg object-cover" />
                  <Link to={`/trips/${t.id}`} className="min-w-0 flex-1">
                    <span className="block truncate font-medium hover:underline hover:decoration-foreground/30 hover:underline-offset-4">{t.title}</span>
                    <span className="meta block tabular-nums">
                      {t.days.length} days{formatRange(t) ? ` · ${formatRange(t)}` : ""}
                    </span>
                  </Link>
                  <span className="text-[13px] text-muted-foreground">{t.published ? "Public" : "Private"}</span>
                  <Switch
                    checked={!!t.published}
                    aria-label={`Publish ${t.title}`}
                    onCheckedChange={(v) => {
                      updateTrip({ ...t, published: v });
                      toast(v ? "Published to Explore" : "Back to private");
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-title text-xl">Settings</h2>
            <div className="surface divide-y divide-border overflow-hidden p-0">
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <span>
                  <span className="block text-sm font-medium">Currency</span>
                  <span className="meta block">For costs in the trip editor</span>
                </span>
                <Select value={prefs.currency} onValueChange={(v) => setPref("currency", v)}>
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="£">Pounds (£)</SelectItem>
                    <SelectItem value="€">Euros (€)</SelectItem>
                    <SelectItem value="$">Dollars ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="block text-sm font-medium">Distances</span>
                <Select value={prefs.units} onValueChange={(v) => setPref("units", v)}>
                  <SelectTrigger className="h-9 w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">Kilometres</SelectItem>
                    <SelectItem value="mi">Miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <span>
                  <span className="block text-sm font-medium">Email me a trip summary</span>
                  <span className="meta block">A week before each trip starts</span>
                </span>
                <Switch checked={prefs.email} onCheckedChange={(v) => setPref("email", v)} aria-label="Email me a trip summary" />
              </div>
            </div>
            <Button variant="outline" onClick={() => toast("Signed out of this browser")}>
              Sign out
            </Button>
          </section>
        </div>
      </div>
    </Page>
  );
};

export default ProfilePage;
