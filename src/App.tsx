
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import Index from "@/pages/Index";
import { ViewDetails } from "@/components/ViewDetails";
import { EditFile } from "@/pages/EditFile";
import { Login } from "@/pages/Login";
import Register from "@/pages/Register";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        await api.getMe();
        if (mounted) setIsAuthenticated(true);
      } catch (e) {
        if (mounted) setIsAuthenticated(false);
      } finally {
        if (mounted) setChecking(false);
      }
    };
    check();
    return () => { mounted = false; };
  }, []);

  if (checking) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <main className="min-h-screen bg-[#F6F6F7] pt-12">
                    <Navbar />
                    <Index />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/files/:id"
              element={
                <ProtectedRoute>
                  <main className="min-h-screen bg-[#F6F6F7] pt-12">
                    <Navbar />
                    <ViewDetails />
                  </main>
                </ProtectedRoute>
              }
            />
            <Route
              path="/files/:id/edit"
              element={
                <ProtectedRoute>
                  <main className="min-h-screen bg-[#F6F6F7] pt-12">
                    <Navbar />
                    <EditFile />
                  </main>
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
