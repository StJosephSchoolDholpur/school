import React, { createContext, useContext, useState, useEffect } from "react";

interface UserSession {
  email: string;
  name: string;
  role: "super_admin" | "editor";
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem("stj_admin_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Default admin authorization check
    if ((email.trim().toLowerCase() === "admin@stjoseph.com" || email.trim() === "admin") && (pass === "admin123" || pass === "stjoseph2026")) {
      const sessionUser: UserSession = {
        email: email.includes("@") ? email : "admin@stjoseph.com",
        name: "School Administrator",
        role: "super_admin",
      };
      setUser(sessionUser);
      localStorage.setItem("stj_admin_user", JSON.stringify(sessionUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("stj_admin_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
