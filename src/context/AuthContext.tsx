import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Role = "admin" | "viewer" | null;

interface AuthContextType {
  user: string | null;
  role: Role;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);

  const login = (username: string, password: string) => {
    // Simple mock authentication
    if (username === "admin" && password === "admin123") {
      setUser("admin");
      setRole("admin");
      return true;
    }
    if (username === "user" && password === "user123") {
      setUser("user");
      setRole("viewer");
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};