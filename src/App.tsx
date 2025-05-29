import { AuthProvider, useAuth } from "./context/AuthContext";
import { Container } from 'rsuite';
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";

const AppContent = () => {
  const { user } = useAuth();

  if (!user) return <Login />;
  return <Dashboard />;
};

const App = () => (
  <AuthProvider>
    <Container style={{ height: '100vh' }}>
      <AppContent />
    </Container>
  </AuthProvider>
);

export default App;
