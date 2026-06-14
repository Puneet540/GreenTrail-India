import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/layout/Navbar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import Footer from "@/components/layout/Footer";
import NotFound from "@/pages/not-found";

import HomePage from "@/pages/HomePage";
import DestinationsPage from "@/pages/DestinationsPage";
import DestinationDetailPage from "@/pages/DestinationDetailPage";
import StaysPage from "@/pages/StaysPage";
import StayDetailPage from "@/pages/StayDetailPage";
import TravelPage from "@/pages/TravelPage";
import AIPlannerPage from "@/pages/AIPlannerPage";
import CheckoutPage from "@/pages/CheckoutPage";
import BookingConfirmedPage from "@/pages/BookingConfirmedPage";
import MyJourneysPage from "@/pages/MyJourneysPage";
import ProfilePage from "@/pages/ProfilePage";
import StoriesPage from "@/pages/StoriesPage";
import StoryDetailPage from "@/pages/StoryDetailPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AboutPage from "@/pages/AboutPage";
import HiddenGemsPage from "@/pages/HiddenGemsPage";
import FAQPage from "@/pages/FAQPage";
import ContactPage from "@/pages/ContactPage";
import SeasonalPage from "@/pages/SeasonalPage";
import TrainSearchPage from "@/pages/TrainSearchPage";
import FlightSearchPage from "@/pages/FlightSearchPage";
import BusSearchPage from "@/pages/BusSearchPage";
import StaysMapPage from "@/pages/StaysMapPage";
import CommunityStoriesPage from "@/pages/CommunityStoriesPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/destinations" component={DestinationsPage} />
          <Route path="/destinations/:id" component={DestinationDetailPage} />
          <Route path="/stays" component={StaysPage} />
          <Route path="/stays/:id" component={StayDetailPage} />
          <Route path="/travel" component={TravelPage} />
          <Route path="/ai-planner" component={AIPlannerPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/booking-confirmed" component={BookingConfirmedPage} />
          <Route path="/my-journeys" component={MyJourneysPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/stories" component={StoriesPage} />
          <Route path="/stories/:id" component={StoryDetailPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/hidden-gems" component={HiddenGemsPage} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/seasonal" component={SeasonalPage} />
          <Route path="/travel/trains" component={TrainSearchPage} />
          <Route path="/travel/flights" component={FlightSearchPage} />
          <Route path="/travel/buses" component={BusSearchPage} />
          <Route path="/stays/map" component={StaysMapPage} />
          <Route path="/community" component={CommunityStoriesPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
