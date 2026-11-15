import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppRouter } from "./lib/router";
import { Layout } from "./components/Layout";
import MapPage from "./pages/MapPage";
import TodayPage from "./pages/TodayPage";
import ItineraryDetailPage from "./pages/ItineraryDetailPage";
import ItineraryMapView from "./components/itinerary/ItineraryMapView";
import CameraPage from "./pages/CameraPage";
import GuidesPage from "./pages/GuidesPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

/**
 * Ventura for mobile: the in-person app (map, today's plan, camera, guides).
 * Planning lives in Ventura for desktop (src/desktop).
 */
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppRouter start="/map">
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/map" replace />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/itinerary/:id" element={<ItineraryDetailPage />} />
            <Route path="/itinerary/:id/map" element={<ItineraryMapView />} />
            <Route path="/camera" element={<CameraPage />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/bookings/:id" element={<BookingDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* Planning moved to Ventura for desktop; old links land somewhere useful. */}
            <Route path="/settings" element={<Navigate to="/profile" replace />} />
            <Route path="/itinerary" element={<Navigate to="/today" replace />} />
            <Route path="/plan-trip/*" element={<Navigate to="/today" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AppRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
