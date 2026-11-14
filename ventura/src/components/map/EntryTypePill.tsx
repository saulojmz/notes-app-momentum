import { DoorOpen, Ticket, CalendarCheck } from "lucide-react";
import { EntryType } from "@/types/map";
import { Badge } from "@/components/ui/badge";

interface EntryTypePillProps {
  entryType: EntryType;
}

const entryTypeConfig: Record<EntryType, { label: string; icon: typeof DoorOpen; variant: "success" | "warning" | "info" }> = {
  "walk-in": { label: "Walk-in", icon: DoorOpen, variant: "success" },
  "ticket-required": { label: "Ticket required", icon: Ticket, variant: "warning" },
  "reservation-recommended": { label: "Reservation recommended", icon: CalendarCheck, variant: "info" },
};

export const EntryTypePill = ({ entryType }: EntryTypePillProps) => {
  const { label, icon: Icon, variant } = entryTypeConfig[entryType];
  return (
    <Badge variant={variant} className="h-7 px-3">
      <Icon />
      {label}
    </Badge>
  );
};
