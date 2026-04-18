import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/data/store";
import ProtectedRoute from "@/components/ProtectedRoute";

const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const StaffDashboard = lazy(() => import("./pages/StaffDashboard"));
const ManagementDashboard = lazy(() => import("./pages/ManagementDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center animate-pulse">Loading Application...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/staff/*" element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              } />
              <Route path="/management/*" element={
                <ProtectedRoute allowedRoles={['management']}>
                  <ManagementDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
