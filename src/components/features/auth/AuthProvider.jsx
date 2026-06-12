"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Load token on client only
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      queueMicrotask(() => setReady(true));
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken");
        queueMicrotask(() => setReady(true));
        return;
      }

      queueMicrotask(() => setUser({ id: decoded.id, name: decoded.name }));
    } catch {
      localStorage.removeItem("authToken");
    }

    queueMicrotask(() => setReady(true));
  }, []);

  const login = (token) => {
    localStorage.setItem("authToken", token);
    const decoded = jwtDecode(token);
    queueMicrotask(() => setUser({ id: decoded.id, name: decoded.name }));
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    queueMicrotask(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
