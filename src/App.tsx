import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AbuDhabiPage from "./pages/AbuDhabiActivities";
import DubaiActivitiesPage from "./pages/DubaiActivities";
import RasAlKhaimahActivitiesPage from "./pages/RasAlKhaimahActivities";
import OmanActivitiesPage from "./pages/OmanActivities";

import Activities from "./pages/Activities";
import Hotels from "./pages/Hotels";
import Holidays from "./pages/Holidays";
import Visas from "./pages/Visas";
import Cruise from "./pages/Cruise";
import Contact from "./pages/Contact";
import AbuDhabiExperience from "./pages/AbuDhabiExperience";
import AboutUs from "./pages/AboutUs";

import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter 
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
          
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/dubai" element={<DubaiActivitiesPage />} />
              <Route path="/activities/abu-dhabi" element={<AbuDhabiPage />} />
              <Route path="/activities/ras-al-khaimah" element={<RasAlKhaimahActivitiesPage />} />
              <Route path="/activities/oman" element={<OmanActivitiesPage />} />
              <Route path="/experiences/abu-dhabi" element={<AbuDhabiExperience />} />


              <Route path="/hotelsearch" element={<Hotels />} />
              <Route path="/holidays" element={<Holidays />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/cruise" element={<Cruise />} />
              <Route path="/visas" element={<Visas />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about-us" element={<AboutUs />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
