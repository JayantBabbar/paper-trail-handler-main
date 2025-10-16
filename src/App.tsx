
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@/components/Navbar";
import Index from "@/pages/Index";
import { ViewDetails } from "@/components/ViewDetails";
import { EditFile } from "@/pages/EditFile";
import { Login } from "@/pages/Login";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
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
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <main className="min-h-screen bg-[#F6F6F7]">
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
                  <main className="min-h-screen bg-[#F6F6F7]">
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
                  <main className="min-h-screen bg-[#F6F6F7]">
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
