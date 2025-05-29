import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { role, user, logout } = useAuth();

  return (
    <div>
      <h2>Welcome, {user}!</h2>
      {role === "admin" ? (
        <div>
          <h3>Admin Dashboard</h3>
          <p>You have access to admin features.</p>
          {/* Add admin-specific components or actions here */}
        </div>
      ) : (
        <div>
          <h3>Viewer Dashboard</h3>
          <p>You have access to viewer features.</p>
          {/* Add viewer-specific components or actions here */}
        </div>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;