import { Guide } from "@/types/guide";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SmartImage, StickyFooter } from "@/components/kit";

interface GuideProfileStepProps {
  guide: Guide;
  onConfirm: () => void;
}

const reviews = (first: string) => [
  { when: "2 days ago", text: `${first} showed us hidden gems we never would have found on our own.` },
  { when: "1 week ago", text: "Knowledgeable, friendly, and went well past the two hours we booked." },
];

export const GuideProfileStep = ({ guide, onConfirm }: GuideProfileStepProps) => {
  const first = guide.name.split(" ")[0];

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto w-full max-w-md flex-1 pb-8">
        {/* Portrait */}
        <div className="px-5 pt-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
            <SmartImage src={guide.avatar} alt={guide.name} className="h-full w-full object-cover" />
            <div className="scrim-b absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-on-image">
              <p className="flex items-center gap-1 text-[13px] text-on-image/75">
                <MapPin className="h-3 w-3" />
                {guide.location}
              </p>
              <h2 className="text-display mt-1 text-[38px]">{guide.name}</h2>
            </div>
          </div>
        </div>

        {/* Stats */}
        <dl className="mx-5 mt-4 grid grid-cols-3 divide-x divide-border rounded-2xl border border-border bg-card py-3 text-center">
          <div>
            <dt className="eyebrow">Rating</dt>
            <dd className="text-title mt-1 flex items-center justify-center gap-1 text-xl tabular-nums">
              <Star className="h-4 w-4 fill-highlight text-highlight" strokeWidth={0} />
              {guide.rating.toFixed(1)}
            </dd>
          </div>
          <div>
            <dt className="eyebrow">Reviews</dt>
            <dd className="text-title mt-1 text-xl tabular-nums">{guide.reviews}</dd>
          </div>
          <div>
            <dt className="eyebrow">Rate</dt>
            <dd className="text-title mt-1 text-xl tabular-nums">£{guide.hourlyRate}</dd>
          </div>
        </dl>

        <div className="space-y-7 px-5 pt-7">
          <section className="space-y-2">
            <p className="eyebrow">About</p>
            <p className="text-[15px] leading-relaxed text-foreground/85">{guide.bio}</p>
          </section>

          <section className="space-y-3">
            <p className="eyebrow">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {guide.specialties.map((s) => (
                <Badge key={s} variant="secondary" className="h-8 px-3 text-[13px]">
                  {s}
                </Badge>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <p className="eyebrow">Languages</p>
            <div className="flex flex-wrap gap-2">
              {guide.languages.map((l) => (
                <Badge key={l} variant="outline" className="h-8 px-3 text-[13px]">
                  {l}
                </Badge>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <p className="eyebrow">Recent reviews</p>
            {reviews(first).map((r) => (
              <figure key={r.when} className="surface-sunken space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-highlight text-highlight" strokeWidth={0} />
                    ))}
                  </span>
                  <span className="meta">{r.when}</span>
                </div>
                <blockquote className="text-sm leading-relaxed">“{r.text}”</blockquote>
              </figure>
            ))}
          </section>
        </div>
      </div>

      <StickyFooter>
        <Button size="lg" className="mx-auto flex w-full max-w-md" onClick={onConfirm}>
          Confirm {first} as companion
        </Button>
      </StickyFooter>
    </div>
  );
};
