import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Agents from "@/pages/Agents";
import Customers from "@/pages/Customers";
import CreateOrder from "@/pages/CreateOrder";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes with layout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/agents"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Agents />
                  </ProtectedRoute>
                }
              />
              <Route path="/customers" element={<Customers />} />
              <Route
                path="/create-order"
                element={
                  <ProtectedRoute allowedRoles={['agent']}>
                    <CreateOrder />
                  </ProtectedRoute>
                }
              />
            </Route>
            
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
