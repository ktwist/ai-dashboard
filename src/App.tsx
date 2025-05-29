import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";

const AppContent = () => {
  const { user } = useAuth();

  if (!user) return <Login />;
  return <Dashboard />;
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
