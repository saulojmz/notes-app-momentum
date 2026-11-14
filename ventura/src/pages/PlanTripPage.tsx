import { useNavigate } from "react-router-dom";
import { Route, MessagesSquare, ArrowRight, type LucideIcon } from "lucide-react";
import { SectionHeader, SmartImage, TopBar } from "@/components/kit";
import { readGuidedAnswers, readGuidedDraft, readPlannerSession, useSavedTrips } from "@/features/planner/trips";

const PlanTripPage = () => {
  const navigate = useNavigate();
  const draft = readGuidedDraft();
  const session = readPlannerSession();
  const guidedDone = readGuidedAnswers();
  const { saved } = useSavedTrips();

  const options: { icon: LucideIcon; title: string; description: string; tag: string; to: string; dark?: boolean; resume?: string }[] = [
    {
      icon: Route,
      title: "Guided planning",
      description: "Answer nine quick questions and we'll match you with destinations.",
      tag: "9 questions",
      to: "/plan-trip/guided",
      dark: true,
      resume: draft && draft.step > 1 && draft.step < 9 ? `Resume at step ${draft.step} of 9` : undefined,
    },
    {
      icon: MessagesSquare,
      title: "AI chat",
      description: "Chat naturally about where, when and how. Get six itineraries back.",
      tag: "FreeFlow",
      to: "/plan-trip/chat",
    },
  ];

  return (
    <div className="min-h-screen">
      <TopBar onBack={() => navigate(-1)} />

      <div className="mx-auto max-w-2xl space-y-10 px-5">
        <header className="pt-4">
          <p className="eyebrow">Plan your trip</p>
          <h1 className="text-display mt-2 text-[40px]">How would you like to plan?</h1>
          <p className="mt-3 max-w-[34ch] text-[15px] text-muted-foreground">Pick a way to start. Each path ends with itineraries you can save.</p>
        </header>

        <div className="stagger space-y-3">
          {options.map(({ icon: Icon, title, description, tag, to, dark, resume }) => (
            <button
              key={title}
              type="button"
              onClick={() => navigate(to)}
              className={
                dark
                  ? "press surface-ink group flex w-full flex-col gap-10 p-5 text-left shadow-md"
                  : "press surface group flex w-full flex-col gap-10 p-5 text-left"
              }
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={
                    dark
                      ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-foreground/10"
                      : "bg-brand-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-primary-foreground"
                  }
                >
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <span className={dark ? "font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted" : "eyebrow"}>{resume ?? tag}</span>
              </div>
              <div className="flex w-full items-end justify-between gap-4">
                <div>
                  <h3 className="text-title text-2xl">{title}</h3>
                  <p className={dark ? "mt-1.5 text-sm text-ink-muted" : "mt-1.5 text-sm text-muted-foreground"}>{description}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>

        {guidedDone && (
          <button
            type="button"
            onClick={() => navigate("/plan-trip/results")}
            className="flex w-full items-center justify-between rounded-2xl bg-secondary px-4 py-3.5 text-left"
          >
            <span>
              <span className="block text-sm font-semibold">Your guided matches</span>
              <span className="meta block truncate">
                {guidedDone.region === "Anywhere" ? "Anywhere" : guidedDone.region} · {guidedDone.setting} · ${guidedDone.budget.toLocaleString("en-US")}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        {session && (session.aiTripIds.length > 0 || session.communityTripIds.length > 0) && (
          <button
            type="button"
            onClick={() => navigate("/plan-trip/options")}
            className="flex w-full items-center justify-between rounded-2xl bg-secondary px-4 py-3.5 text-left"
          >
            <span>
              <span className="block text-sm font-semibold">Your last plan</span>
              <span className="meta block truncate">
                {[session.criteria.destination, session.criteria.dates].filter(Boolean).join(" · ") || "6 itineraries"}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        {saved.length > 0 && (
          <section className="space-y-4">
            <SectionHeader eyebrow={`${saved.length} saved`} title="Your trips" />
            <div className="surface divide-y divide-border overflow-hidden p-0">
              {saved.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => navigate(`/itinerary/${t.id}`)}
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-accent/40"
                >
                  <SmartImage src={t.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{t.title}</span>
                    <span className="meta block truncate">
                      {t.duration} days · {t.source === "guided" ? `${t.match}% match` : t.source === "community" ? "Traveler favourite" : "Planned with AI"}
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PlanTripPage;
