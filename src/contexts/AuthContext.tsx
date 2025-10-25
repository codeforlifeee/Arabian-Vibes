// AuthContext.tsx ✅

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "agent" | "customer";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAgent: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isAgent = user?.role === "agent";

  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    const storedToken = localStorage.getItem("auth_token");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("grant_type", "password");
      params.append("client_id", "frontend_client_id-X5J7zk");
      params.append("client_secret", "b2b.arabianvibesllc.backend");
      params.append("username", email);
      params.append("password", password);

      const response = await axios.post(
        "https://drupal-cms.vinux.in/oauth/token",
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const accessToken = response.data.access_token;
      setToken(accessToken);
      localStorage.setItem("auth_token", accessToken);

      const loggedInUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: "agent",
      };
      setUser(loggedInUser);
      localStorage.setItem("auth_user", JSON.stringify(loggedInUser));

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      const newUser: User = {
        id: "1",
        email,
        name,
        role: "customer",
      };
      setUser(newUser);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAgent, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
