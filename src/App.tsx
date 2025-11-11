import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import AdminKeywords from "./pages/AdminKeywords";
import KeywordsList from "./pages/KeywordsList";
import LeadManagement from "./pages/LeadManagement";
import AdminChat from "./pages/AdminChat";
import ChatAnalytics from "./pages/ChatAnalytics";
import AdminKnowledgeBase from "./pages/AdminKnowledgeBase";
import AdminDashboard from "./pages/AdminDashboard";
import BookingAnalytics from "./pages/BookingAnalytics";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminEmailTemplates from "./pages/AdminEmailTemplates";
import AdminEmailAutomation from "./pages/AdminEmailAutomation";
import MasterDashboard from "./pages/MasterDashboard";
import AdminAIResponses from "./pages/AdminAIResponses";
import AISettings from "./pages/AISettings";
import NotFound from "./pages/NotFound";
import { LiveChatWidget } from "./components/LiveChatWidget";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'he';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/keywords"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminKeywords />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/chat" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminChat />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/knowledge" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminKnowledgeBase />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/chat-analytics" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <ChatAnalytics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/booking-analytics" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <BookingAnalytics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/testimonials" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminTestimonials />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/email-templates" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminEmailTemplates />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/email-automation" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminEmailAutomation />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <MasterDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/ai-responses" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminAIResponses />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/keywords" element={<KeywordsList />} />
                <Route 
                  path="/leads" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <LeadManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/ai-settings" element={<AISettings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <LiveChatWidget />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
