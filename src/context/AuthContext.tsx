import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { login as apiLogin, logout as apiLogout } from "../api/fetchApi";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (name: string, email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  user: { name: string; email: string } | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  async function login(name: string, email: string): Promise<boolean> {
    const success = await apiLogin(name, email);
    if (success) {
      setIsAuthenticated(true);
      setUser({ name, email });
      localStorage.setItem('user', JSON.stringify({ name, email }));
    }
    return success;
  }

  async function logout(): Promise<void> {
    await apiLogout();
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

