import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GiftCards from "./pages/GiftCards";
import Sell from "./pages/Sell";
import Buy from "./pages/Buy";
import Dashboard from "./pages/Dashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCards from "./pages/admin/AdminCards";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEmailMarketing from "./pages/admin/AdminEmailMarketing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/gift-cards" element={<GiftCards />} />
              <Route path="/sell" element={<Sell />} />
              <Route path="/buy" element={<Buy />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminOverview />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <AdminProtectedRoute>
                    <AdminOrders />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/cards"
                element={
                  <AdminProtectedRoute>
                    <AdminCards />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/email-marketing"
                element={
                  <AdminProtectedRoute>
                    <AdminEmailMarketing />
                  </AdminProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
