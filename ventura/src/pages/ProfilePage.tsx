import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Camera, ChevronRight, Coffee, Landmark, Laptop, Map as MapIcon, MapPin, Phone, Ruler, Share, ShieldCheck, Ticket, UtensilsCrossed, type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SmartImage } from "@/components/kit";
import { dayIndexOn, daysUntil, formatRange, tripStatus, useInbox, useTripSchedule, type InboxItem } from "@/features/trips";
import type { PlannedTrip } from "@/features/planner/types";
import { useGuideBookings } from "@/hooks/useGuideBookings";
import { useSavedLandmarks } from "@/hooks/useSavedLandmarks";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

const KIND_ICON: Record<InboxItem["kind"], LucideIcon> = {
  place: MapPin,
  food: UtensilsCrossed,
  cafe: Coffee,
  event: Ticket,
  landmark: Landmark,
};

const statusLine = (t: PlannedTrip) => {
  const s = tripStatus(t);
  if (s === "now") return `Now · day ${dayIndexOn(t) + 1} of ${t.days.length}`;
  if (s === "upcoming") return `${formatRange(t)} · in ${daysUntil(t)} days`;
  if (s === "past") return `${formatRange(t)} · done`;
  return "No dates yet";
};

const Section = ({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) => (
  <section className="space-y-3">
    <div className="flex items-baseline justify-between px-0.5">
      <h2 className="eyebrow">{title}</h2>
      {aside}
    </div>
    {children}
  </section>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "Alex Turner", username: "alex_turner", bio: "Solo traveler, one city at a time" });
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState(profile);
  const [prefs, setPrefs] = useState(() => storage.get("ventura_prefs", { notify: true, shareLive: true }));
  const { saved } = useTripSchedule();
  const { items: inbox } = useInbox();
  const { savedLandmarks } = useSavedLandmarks();
  const { bookings } = useGuideBookings();

  useEffect(() => {
    const stored = storage.get<typeof profile | null>("ventura_profile", null);
    if (stored) {
      setProfile(stored);
      setForm(stored);
    }
  }, []);

  const setPref = (key: keyof typeof prefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    storage.set("ventura_prefs", next);
  };

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const trips = [...saved].sort((a, b) => {
    const rank = { now: 0, upcoming: 1, unscheduled: 2, past: 3 } as const;
    return rank[tripStatus(a)] - rank[tripStatus(b)] || (a.startDate ?? "").localeCompare(b.startDate ?? "");
  });

  const settings: { icon: LucideIcon; label: string; detail?: string; pref?: keyof typeof prefs }[] = [
    { icon: Bell, label: "Trip reminders", pref: "notify" },
    { icon: ShieldCheck, label: "Share live location with my guide", pref: "shareLive" },
    { icon: Phone, label: "Emergency contact", detail: "Add" },
    { icon: Ruler, label: "Distances", detail: "Kilometres" },
  ];

  return (
    <div className="pt-safe mx-auto min-h-screen max-w-2xl px-5">
      <header className="flex items-center gap-4 pb-6 pt-8">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-display bg-ink text-[26px] text-ink-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h1 className="text-display truncate text-[32px]">{profile.name}</h1>
          <p className="meta">@{profile.username}</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          aria-label="Share profile"
          onClick={() => {
            navigator.clipboard?.writeText(`https://ventura.app/@${profile.username}`).catch(() => undefined);
            toast.success("Profile link copied");
          }}
        >
          <Share />
        </Button>
      </header>

      <div className="space-y-9 pb-8">
        <div className="space-y-3">
          <p className="text-[15px] leading-relaxed text-foreground/85">{profile.bio}</p>
          <Button variant="outline" className="w-full" onClick={() => setEditOpen(true)}>
            Edit profile
          </Button>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card py-4">
          {[
            { label: "Trips", value: saved.length },
            { label: "Discoveries", value: savedLandmarks.length },
            { label: "Guides met", value: bookings.length },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <dd className="text-display text-[30px] tabular-nums">{value}</dd>
              <dt className="meta mt-0.5">{label}</dt>
            </div>
          ))}
        </dl>

        <Section title="Your trips">
          <div className="surface divide-y divide-border overflow-hidden p-0">
            {trips.map((t) => (
              <button key={t.id} type="button" onClick={() => navigate(tripStatus(t) === "now" ? "/today" : `/itinerary/${t.id}`)} className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-secondary/60">
                <SmartImage src={t.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{t.title}</span>
                  <span className={tripStatus(t) === "now" ? "block text-[13px] text-primary" : "meta block"}>{statusLine(t)}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Section>

        <Section title="Saved for later" aside={<span className="meta tabular-nums">{inbox.length}</span>}>
          {inbox.length ? (
            <div className="surface divide-y divide-border overflow-hidden p-0">
              {inbox.map((item) => {
                const Icon = KIND_ICON[item.kind];
                return (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    {item.image ? (
                      <SmartImage src={item.image} alt="" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">{item.name}</span>
                      <span className="meta block truncate">From the {item.source.toLowerCase()} · {item.city}</span>
                    </span>
                  </div>
                );
              })}
              <p className="flex items-center gap-2 bg-secondary/50 px-4 py-3 text-[13px] text-muted-foreground">
                <Laptop className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                Sort these into a trip on Ventura for desktop
              </p>
            </div>
          ) : (
            <p className="rounded-xl bg-secondary px-4 py-3 text-[13px] text-muted-foreground">Places you save from the map or camera show up here</p>
          )}
        </Section>

        <Section title="Collections">
          <div className="surface divide-y divide-border overflow-hidden p-0">
            {[
              { icon: Camera, title: "Discoveries", detail: `${savedLandmarks.length} landmarks`, to: () => navigate("/camera", { state: { view: "saved" } }) },
              { icon: Ticket, title: "Guide bookings", detail: `${bookings.length} booked`, to: () => navigate("/guides") },
              { icon: MapIcon, title: "Shared itineraries", detail: "Published from desktop", to: () => toast("Publish itineraries from Ventura for desktop") },
            ].map(({ icon: Icon, title, detail, to }) => (
              <button key={title} type="button" onClick={to} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{title}</span>
                  <span className="meta block">{detail}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </Section>

        <Section title="Settings">
          <div className="surface divide-y divide-border overflow-hidden p-0">
            {settings.map(({ icon: Icon, label, detail, pref }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3">
                <Icon className="h-[18px] w-[18px] shrink-0 text-muted-foreground" strokeWidth={1.5} />
                <span className="min-w-0 flex-1 text-[15px]">{label}</span>
                {pref ? (
                  <Switch checked={prefs[pref]} onCheckedChange={(v) => setPref(pref, v)} aria-label={label} />
                ) : (
                  <button type="button" onClick={() => toast(`${label} is coming soon`)} className="flex items-center gap-1 text-[13px] text-muted-foreground">
                    {detail}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Section>

        <p className="flex items-start gap-2.5 px-0.5 text-[13px] text-muted-foreground">
          <Laptop className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          Plan new trips, set dates and edit days on Ventura for desktop. They show up here and in Today.
        </p>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {(["name", "username"] as const).map((k) => (
              <div key={k} className="space-y-2">
                <Label htmlFor={k} className="capitalize">
                  {k}
                </Label>
                <Input id={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                storage.set("ventura_profile", form);
                setProfile(form);
                setEditOpen(false);
                toast.success("Profile updated");
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
