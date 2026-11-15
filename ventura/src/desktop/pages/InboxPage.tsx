import { formatDistanceToNow } from "date-fns";
import { Inbox, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, SmartImage } from "@/components/kit";
import { findTrip } from "@/features/planner/trips";
import { useInbox } from "@/features/trips";
import { toast } from "sonner";
import { AddToTrip } from "../components/AddToTrip";
import { Page, PageHeader } from "../Shell";
import { KIND_ICON } from "./TripsPage";

const InboxPage = () => {
  const { items, remove, file } = useInbox();
  const cities = [...new Set(items.map((i) => i.city))];

  return (
    <Page>
      <PageHeader eyebrow="Saved on your phone" title="From your phone" />
      <p className="-mt-4 mb-8 flex max-w-[64ch] items-start gap-2 text-[15px] text-muted-foreground">
        <Smartphone className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
        Places, events and landmarks you saved while out and about. Add each one to a day, or clear it.
      </p>

      {!items.length ? (
        <EmptyState icon={Inbox} title="All sorted" description="Things you save from the map or camera on your phone show up here" className="py-16" />
      ) : (
        <div className="space-y-10">
          {cities.map((city) => (
            <section key={city} className="space-y-3">
              <h2 className="eyebrow">{city}</h2>
              <ul className="surface divide-y divide-border overflow-hidden p-0">
                {items
                  .filter((i) => i.city === city)
                  .map((item) => {
                    const Icon = KIND_ICON[item.kind];
                    return (
                      <li key={item.id} className="grid grid-cols-[56px_minmax(0,1fr)_420px_36px] items-center gap-4 px-5 py-4">
                        {item.image ? (
                          <SmartImage src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                        ) : (
                          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                            <Icon className="h-5 w-5" strokeWidth={1.5} />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-medium">{item.name}</p>
                          <p className="truncate text-sm text-muted-foreground">{item.detail}</p>
                          <p className="meta mt-0.5">
                            From the {item.source.toLowerCase()} · {formatDistanceToNow(item.savedAt, { addSuffix: true })}
                          </p>
                        </div>
                        <AddToTrip
                          city={item.city}
                          onAdd={(tripId, day) => {
                            file(item.id, tripId, day);
                            toast.success(`Added to day ${day + 1}`, { description: findTrip(tripId)?.title });
                          }}
                        />
                        <Button variant="ghost" size="icon-sm" aria-label={`Clear ${item.name}`} onClick={() => remove(item.id)}>
                          <X />
                        </Button>
                      </li>
                    );
                  })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Page>
  );
};

export default InboxPage;
