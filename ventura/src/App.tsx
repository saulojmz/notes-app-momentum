import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import MapPage from "./pages/MapPage";
import ItineraryPage from "./pages/ItineraryPage";
import DestinationDetailPage from "./pages/DestinationDetailPage";
import ItineraryDetailPage from "./pages/ItineraryDetailPage";
import ItineraryMapView from "./components/itinerary/ItineraryMapView";
import CameraPage from "./pages/CameraPage";
import GuidesPage from "./pages/GuidesPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import PlanTripPage from "./pages/PlanTripPage";
import NotFound from "./pages/NotFound";
import GuidedPlanningPage from "./pages/planner/GuidedPlanningPage";
import PlannerResultsPage from "./pages/planner/PlannerResultsPage";
import PlannerChatPage from "./pages/planner/PlannerChatPage";
import ItineraryOptionsPage from "./pages/planner/ItineraryOptionsPage";
import { ReactNode } from "react";

/**
 * The prototype build (`npm run build:prototype`) runs inside an embedded
 * frame without a real URL, so it routes in memory and can be told where to
 * start by the frame (data-start) or a global.
 */
const startRoute = (): string => {
  try {
    const fromFrame = window.frameElement?.getAttribute("data-start");
    const fromGlobal = (window as unknown as { __VENTURA_START__?: string }).__VENTURA_START__;
    return fromFrame || fromGlobal || "/map";
  } catch {
    return "/map";
  }
};

const Router = ({ children }: { children: ReactNode }) =>
  import.meta.env.MODE === "prototype" ? (
    <MemoryRouter initialEntries={[startRoute()]}>{children}</MemoryRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  );

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/map" replace />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/plan-trip" element={<PlanTripPage />} />
            <Route path="/plan-trip/guided" element={<GuidedPlanningPage />} />
            <Route path="/plan-trip/results" element={<PlannerResultsPage />} />
            <Route path="/plan-trip/chat" element={<PlannerChatPage />} />
            <Route path="/plan-trip/options" element={<ItineraryOptionsPage />} />
            <Route path="/destinations/:id" element={<DestinationDetailPage />} />
            <Route path="/itinerary/:id" element={<ItineraryDetailPage />} />
            <Route path="/itinerary/:id/map" element={<ItineraryMapView />} />
            <Route path="/camera" element={<CameraPage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/bookings/:id" element={<BookingDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
