import { useNavigate } from "react-router-dom";
import { Route, MessagesSquare, ArrowRight, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/kit";

const options: { icon: LucideIcon; title: string; description: string; tag: string }[] = [
  {
    icon: Route,
    title: "Guided planning",
    description: "Answer a few questions and we'll find your perfect destination.",
    tag: "5 questions",
  },
  {
    icon: MessagesSquare,
    title: "AI chat",
    description: "Chat naturally with AI to discover and plan your trip.",
    tag: "FreeFlow",
  },
];

const PlanTripPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <TopBar onBack={() => navigate(-1)} />

      <div className="mx-auto max-w-2xl px-5">
        <header className="pb-8 pt-4">
          <p className="eyebrow">Plan your trip</p>
          <h1 className="text-display mt-2 text-[40px]">How would you like to plan?</h1>
          <p className="mt-3 max-w-[34ch] text-[15px] text-muted-foreground">
            Pick a way to start. You can switch at any time.
          </p>
        </header>

        <div className="stagger space-y-3">
          {options.map(({ icon: Icon, title, description, tag }, i) => (
            <button
              key={title}
              type="button"
              onClick={() => toast(`${title} is coming soon`)}
              className={
                i === 0
                  ? "press surface-ink group flex w-full flex-col gap-10 p-5 text-left shadow-md"
                  : "press surface group flex w-full flex-col gap-10 p-5 text-left"
              }
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={
                    i === 0
                      ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-foreground/10"
                      : "flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                  }
                >
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </span>
                <span className={i === 0 ? "font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted" : "eyebrow"}>
                  {tag}
                </span>
              </div>
              <div className="flex w-full items-end justify-between gap-4">
                <div>
                  <h3 className="text-title text-2xl">{title}</h3>
                  <p className={i === 0 ? "mt-1.5 text-sm text-ink-muted" : "mt-1.5 text-sm text-muted-foreground"}>
                    {description}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanTripPage;
