import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppRouter } from "@/lib/router";
import { Shell } from "./Shell";
import TripsPage from "./pages/TripsPage";
import TripEditorPage from "./pages/TripEditorPage";
import PlanPage from "./pages/PlanPage";
import OptionsPage from "./pages/OptionsPage";
import ExplorePage from "./pages/ExplorePage";
import ItineraryPreviewPage from "./pages/ItineraryPreviewPage";
import DestinationPage from "./pages/DestinationPage";
import ResearchMapPage from "./pages/ResearchMapPage";
import LibraryPage from "./pages/LibraryPage";
import InboxPage from "./pages/InboxPage";
import BookingsPage from "./pages/BookingsPage";
import ProfilePage from "./pages/ProfilePage";

/**
 * Ventura for desktop: planning at a table. AI and guided planning, browsing,
 * the full trip editor, a research map, and everything saved on the phone.
 * Guide booking stays on the phone; bookings show here read-only.
 */
const DesktopApp = () => (
  <TooltipProvider>
    <Sonner position="bottom-right" />
    <AppRouter start="/trips" basename="/desktop">
      <Shell>
        <Routes>
          <Route path="/" element={<Navigate to="/trips" replace />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/trips/:id" element={<TripEditorPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/plan/options" element={<OptionsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/itinerary/:id" element={<ItineraryPreviewPage />} />
          <Route path="/explore/destination/:id" element={<DestinationPage />} />
          <Route path="/map" element={<ResearchMapPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/trips" replace />} />
        </Routes>
      </Shell>
    </AppRouter>
  </TooltipProvider>
);

export default DesktopApp;
