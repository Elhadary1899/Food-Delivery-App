// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

/**
 * AuthProvider
 * - يحفظ token و user في localStorage
 * - عند mount: إذا كان في token -> يجيب بيانات المستخدم من /api/auth/me
 * - يوفر login(loginData, jwtToken) بحيث يتوافق مع login.jsx (login(data, token))
 * - يوفر logout() يحذف المفتاحين فقط (token, user)
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Keep localStorage in sync with token/user state
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // On mount: if token exists try to fetch current user
  useEffect(() => {
    let mounted = true;

    async function fetchMe(storedToken) {
      try {
        const res = await axios.get("http://localhost:4000/api/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (mounted && res?.data?.data) {
          setUser(res.data.data);
        }
      } catch (err) {
        // token may be invalid/expired -> remove it
        console.warn(
          "Auth: failed to fetch /auth/me, clearing token",
          err?.response?.data || err.message
        );
        setToken(null);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // if token was restored from localStorage, try to validate it
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken); // ensure state matches
      fetchMe(storedToken);
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * login(loginData, jwtToken)
   * - kept the same signature your login.jsx expects: login(data, token)
   * - If jwtToken provided: save it, fetch /auth/me and save user
   * - If no jwtToken provided, does nothing (caller should provide token)
   */
  const login = async (loginData, jwtToken) => {
    if (!jwtToken) {
      // defensive: if caller passed only token as first arg (older usages), handle it
      // but prefer (loginData, jwtToken)
      console.warn("Auth.login called without token");
      return false;
    }

    try {
      setToken(jwtToken);
      // fetch user with provided token
      const res = await axios.get("http://localhost:4000/api/auth/me", {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });

      if (res?.data?.data) {
        setUser(res.data.data);
        return true;
      } else {
        // fallback: token didn't return user
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error(
        "Auth.login: failed to fetch user with token",
        err?.response?.data || err.message
      );
      setToken(null);
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // do NOT call localStorage.clear() — that removes unrelated data
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
