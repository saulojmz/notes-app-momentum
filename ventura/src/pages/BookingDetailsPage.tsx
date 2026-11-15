import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarX } from "lucide-react";
import { useGuideBookings } from "@/hooks/useGuideBookings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState, TopBar } from "@/components/kit";
import { BookingTicket, SafetyActions } from "@/components/guides/BookingTicket";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookings, updateBookingStatus } = useGuideBookings();
  const booking = getBookings().find((b) => b.id === id);

  if (!booking) {
    return (
      <EmptyState
        className="min-h-screen justify-center"
        icon={CalendarX}
        title="Booking not found"
        description="It may have been cancelled"
        action={
          <Button className="w-full" onClick={() => navigate("/guides")}>
            Back to bookings
          </Button>
        }
      />
    );
  }

  const handleCancelBooking = () => {
    updateBookingStatus(booking.id, "completed");
    navigate("/guides");
  };

  return (
    <div className="min-h-screen pb-12">
      <TopBar onBack={() => navigate("/guides")} title="Booking" />

      <div className="mx-auto max-w-md space-y-6 px-5 pt-2">
        <div>
          <Badge variant="success" className="h-7 px-3">
            {booking.status === "confirmed" ? "Confirmed" : "Upcoming"}
          </Badge>
          <h1 className="text-display mt-3 text-[36px]">Meet {booking.guideName.split(" ")[0]}</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {format(booking.date, "EEEE, MMMM d")} · {booking.time === "ASAP" ? "within ~30 min" : booking.time}
          </p>
        </div>

        <BookingTicket booking={booking} showTotal />
        <SafetyActions />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive-outline" size="lg" className="w-full">
              Cancel booking
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
              <AlertDialogDescription>
                Your meetup with {booking.guideName} on {format(booking.date, "MMM d, yyyy")} at {booking.time} will be
                cancelled. This can't be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep booking</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelBooking} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
