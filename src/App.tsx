import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LangProvider } from "@/i18n/LangProvider";
import { AuthProvider, useAuth, homeForRole } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import Chat from "./pages/Chat";
import Medications from "./pages/Medications";
import AddMedication from "./pages/AddMedication";
import Adherence from "./pages/Adherence";
import FamilyDashboard from "./pages/FamilyDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function HomeRedirect() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Landing />;
  return <Navigate to={homeForRole(user?.role)} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" />
      <BrowserRouter>
        <LangProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/dashboard" element={<ProtectedRoute roles={["patient"]}><PatientDashboard /></ProtectedRoute>} />
              <Route path="/medications" element={<ProtectedRoute roles={["patient"]}><Medications /></ProtectedRoute>} />
              <Route path="/medications/new" element={<ProtectedRoute roles={["patient"]}><AddMedication /></ProtectedRoute>} />
              <Route path="/adherence" element={<ProtectedRoute roles={["patient"]}><Adherence /></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute roles={["patient", "family"]}><Chat /></ProtectedRoute>} />
              <Route path="/family-dashboard" element={<ProtectedRoute roles={["family"]}><FamilyDashboard /></ProtectedRoute>} />
              <Route path="/doctor-dashboard" element={<ProtectedRoute roles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </LangProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
