import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AccessibilityProvider } from "@/hooks/use-accessibility";

import { WhatsAppFAB } from "@/components/WhatsAppFAB";
import { BackToTop } from "@/components/BackToTop";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import Chat from "./pages/Chat";
import KeywordsList from "./pages/KeywordsList";
import AccessibilityStatement from "./pages/AccessibilityStatement";
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
        <LanguageProvider>
          <AccessibilityProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/accessibility" element={<AccessibilityStatement />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/keywords" element={<KeywordsList />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <WhatsAppFAB />
                <BackToTop />
              </BrowserRouter>
            </TooltipProvider>
          </AccessibilityProvider>
        </LanguageProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
