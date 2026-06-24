import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { StellarProvider } from "@/context/StellarContext";
import ActivityFeedPage from "@/pages/ActivityFeedPage";
import Home from "@/pages/Home";
import InstitutionDashboard from "@/pages/InstitutionDashboard";
import NotFound from "@/pages/NotFound";
import RecruiterDashboard from "@/pages/RecruiterDashboard";
import StudentDashboard from "@/pages/StudentDashboard";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StellarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/institution" element={<InstitutionDashboard />} />
              <Route path="/recruiter" element={<RecruiterDashboard />} />
              <Route path="/activity" element={<ActivityFeedPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </StellarProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
