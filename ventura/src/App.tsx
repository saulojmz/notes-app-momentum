import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/map" replace />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/plan-trip" element={<PlanTripPage />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
