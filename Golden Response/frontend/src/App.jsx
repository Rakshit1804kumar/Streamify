import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AIChatPage from "./pages/AIChatPage.jsx";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  const authRedirect = !isAuthenticated ? "/login" : "/onboarding";

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? <Layout showSidebar><HomePage /></Layout> : <Navigate to={authRedirect} />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
        <Route path="/notifications" element={isAuthenticated && isOnboarded ? <Layout showSidebar><NotificationsPage /></Layout> : <Navigate to={authRedirect} />} />
        <Route path="/profile" element={isAuthenticated && isOnboarded ? <Layout showSidebar><ProfilePage /></Layout> : <Navigate to={authRedirect} />} />
        <Route path="/ai-chat" element={isAuthenticated && isOnboarded ? <Layout showSidebar><AIChatPage /></Layout> : <Navigate to={authRedirect} />} />
        <Route path="/call/:id" element={isAuthenticated && isOnboarded ? <CallPage /> : <Navigate to={authRedirect} />} />
        <Route path="/chat/:id" element={isAuthenticated && isOnboarded ? <Layout showSidebar={true}><ChatPage /></Layout> : <Navigate to={authRedirect} />} />
        <Route path="/onboarding" element={isAuthenticated ? (!isOnboarded ? <OnboardingPage /> : <Navigate to="/" />) : <Navigate to="/login" />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};
export default App;
