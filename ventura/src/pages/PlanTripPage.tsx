import { useNavigate } from "react-router-dom";
import { ListChecks, MessagesSquare, ArrowRight, type LucideIcon } from "lucide-react";
import { SectionHeader, SmartImage, TopBar } from "@/components/kit";
import { readGuidedAnswers, readGuidedDraft, readPlannerSession, useSavedTrips } from "@/features/planner/trips";

const PlanTripPage = () => {
  const navigate = useNavigate();
  const draft = readGuidedDraft();
  const session = readPlannerSession();
  const guidedDone = readGuidedAnswers();
  const { saved } = useSavedTrips();

  const options: { icon: LucideIcon; title: string; description: string; tag: string; to: string; resume?: string }[] = [
    {
      icon: ListChecks,
      title: "Guided planning",
      description: "Answer nine questions and get destinations ranked by fit",
      tag: "9 questions",
      to: "/plan-trip/guided",
      resume: draft && draft.step > 1 && draft.step < 9 ? `Resume at step ${draft.step} of 9` : undefined,
    },
    {
      icon: MessagesSquare,
      title: "AI chat",
      description: "Describe the trip in your own words and get six itineraries",
      tag: "Conversation",
      to: "/plan-trip/chat",
    },
  ];

  return (
    <div className="min-h-screen">
      <TopBar onBack={() => navigate(-1)} />

      <div className="mx-auto max-w-2xl space-y-10 px-5">
        <header className="pt-4">
          <p className="eyebrow">Plan your trip</p>
          <h1 className="text-display mt-2 text-[36px]">How would you like to plan?</h1>
          <p className="mt-3 max-w-[34ch] text-[15px] text-muted-foreground">Both paths end with itineraries you can save and edit</p>
        </header>

        <div className="space-y-3">
          {options.map(({ icon: Icon, title, description, tag, to, resume }) => (
            <button
              key={title}
              type="button"
              onClick={() => navigate(to)}
              className="press surface group flex w-full flex-col gap-8 p-5 text-left transition-colors hover:border-foreground/20"
            >
              <div className="flex w-full items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span className={resume ? "text-[13px] text-primary" : "eyebrow"}>{resume ?? tag}</span>
              </div>
              <div className="flex w-full items-end justify-between gap-4">
                <div>
                  <h3 className="text-title text-xl">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
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
              <span className="block text-sm font-medium">Your guided matches</span>
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
              <span className="block text-sm font-medium">Your last plan</span>
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
