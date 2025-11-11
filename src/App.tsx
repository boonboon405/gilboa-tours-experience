import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import Chat from "./pages/Chat";
import AdminKeywords from "./pages/AdminKeywords";
import KeywordsList from "./pages/KeywordsList";
import LeadManagement from "./pages/LeadManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'he';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/admin/keywords" element={<AdminKeywords />} />
              <Route path="/keywords" element={<KeywordsList />} />
              <Route path="/leads" element={<LeadManagement />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
