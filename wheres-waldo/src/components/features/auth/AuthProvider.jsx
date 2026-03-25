"use client";

import { createContext, useState, useEffect, useRef, use } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

function isLikelyJwt(token) {
  if (typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  return parts.length === 3 && parts.every((part) => part.length > 0);
}

export function useAuth() {
  const context = use(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialisedRef = useRef(false);

  useEffect(() => {
    if (initialisedRef.current) {
      return;
    }
    initialisedRef.current = true;

    const token = localStorage.getItem("authToken");

    if (token) {
      if (!isLikelyJwt(token)) {
        localStorage.removeItem("authToken");
        queueMicrotask(() => {
          setUser(null);
          setLoading(false);
        });
        return;
      }

      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("authToken");
          queueMicrotask(() => {
            setUser(null);
            setLoading(false);
          });
        } else {
          queueMicrotask(() => {
            setUser({ id: decoded.id, name: decoded.name });
            setLoading(false);
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("authToken");
        queueMicrotask(() => {
          setUser(null);
          setLoading(false);
        });
      }
    } else {
      queueMicrotask(() => {
        setUser(null);
        setLoading(false);
      });
    }
  }, []);

  const login = (token, userData) => {
    if (!isLikelyJwt(token)) {
      localStorage.removeItem("authToken");
      setUser(null);
      return;
    }

    localStorage.setItem("authToken", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        token: user ? localStorage.getItem("authToken") : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
