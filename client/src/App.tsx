import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Farms from "./pages/Farms";
import Bookings from "./pages/Bookings";
import Transactions from "./pages/Transactions";
import RequestedFarms from "./pages/RequestedFarms";
import Reviews from "./pages/Reviews";
import Categories from "./pages/Categories";
import Amenities from "./pages/Amenities";
import Cities from "./pages/Cities";
import FAQs from "./pages/FAQs";
import SubProperties from "./pages/SubProperties";
import Banners from "./pages/Banners";
import FeaturedSections from "./pages/FeaturedSections";
import Reels from "./pages/Reels";
import AvailabilityChecker from "./pages/AvailabilityChecker";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/users" component={Users} />
        <Route path="/farms" component={Farms} />
        <Route path="/bookings" component={Bookings} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/requested-farms" component={RequestedFarms} />
        <Route path="/reviews" component={Reviews} />
        <Route path="/categories" component={Categories} />
        <Route path="/amenities" component={Amenities} />
        <Route path="/cities" component={Cities} />
        <Route path="/faqs" component={FAQs} />
        <Route path="/sub-properties" component={SubProperties} />
        <Route path="/banners" component={Banners} />
        <Route path="/featured-sections" component={FeaturedSections} />
        <Route path="/reels" component={Reels} />
        <Route path="/availability-checker" component={AvailabilityChecker} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
