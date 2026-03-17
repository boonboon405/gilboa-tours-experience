import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Booking = lazy(() => import("./pages/Booking"));
const AccessibilityStatement = lazy(() => import("./pages/AccessibilityStatement"));
const Chat = lazy(() => import("./pages/Chat"));
const MasterDashboard = lazy(() => import("./pages/MasterDashboard"));
const LeadManagement = lazy(() => import("./pages/LeadManagement"));
const BookingAnalytics = lazy(() => import("./pages/BookingAnalytics"));
const ChatAnalytics = lazy(() => import("./pages/ChatAnalytics"));
const AdminGallery = lazy(() => import("./pages/AdminGallery"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminTestimonials = lazy(() => import("./pages/AdminTestimonials"));
const AdminKnowledgeBase = lazy(() => import("./pages/AdminKnowledgeBase"));
const AdminEmailTemplates = lazy(() => import("./pages/AdminEmailTemplates"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/accessibility" element={<AccessibilityStatement />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/master" element={<ProtectedRoute requireAdmin><MasterDashboard /></ProtectedRoute>} />
                  <Route path="/admin/leads" element={<ProtectedRoute requireAdmin><LeadManagement /></ProtectedRoute>} />
                  <Route path="/admin/gallery" element={<ProtectedRoute requireAdmin><AdminGallery /></ProtectedRoute>} />
                  <Route path="/admin/categories" element={<ProtectedRoute requireAdmin><AdminCategories /></ProtectedRoute>} />
                  <Route path="/admin/testimonials" element={<ProtectedRoute requireAdmin><AdminTestimonials /></ProtectedRoute>} />
                  <Route path="/admin/knowledge-base" element={<ProtectedRoute requireAdmin><AdminKnowledgeBase /></ProtectedRoute>} />
                  <Route path="/admin/email-templates" element={<ProtectedRoute requireAdmin><AdminEmailTemplates /></ProtectedRoute>} />
                  <Route path="/admin/analytics" element={<ProtectedRoute requireAdmin><BookingAnalytics /></ProtectedRoute>} />
                  <Route path="/admin/chat-analytics" element={<ProtectedRoute requireAdmin><ChatAnalytics /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
