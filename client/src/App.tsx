import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import AllParts from "@/pages/all-parts";
import SellerProfile from "@/pages/seller-profile";
import SellerPortal from "@/pages/seller-portal";
import AdminPanel from "@/pages/admin-panel";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {/* Landing page for unauthenticated users */}
      {!isAuthenticated && !isLoading && (
        <Route path="/" component={Landing} />
      )}
      
      {/* Home page for authenticated users */}
      {isAuthenticated && !isLoading && (
        <Route path="/" component={Home} />
      )}
      
      {/* Public routes available to all */}
      <Route path="/parts" component={AllParts} />
      <Route path="/seller/:sellerId" component={SellerProfile} />
      
      {/* Protected routes requiring authentication */}
      {isAuthenticated && (
        <>
          <Route path="/sell" component={SellerPortal} />
          <Route path="/admin" component={AdminPanel} />
        </>
      )}
      
      <Route component={NotFound} />
    </Switch>
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
