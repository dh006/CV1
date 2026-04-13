import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    } catch {
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) localStorage.setItem("token", token);
    // Thông báo CartContext reload giỏ hàng của user này
    window.dispatchEvent(new Event("userChanged"));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Thông báo CartContext xóa giỏ hàng
    window.dispatchEvent(new Event("userChanged"));
    window.location.href = "/";
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    try {
      const res = await authAPI.updateProfile(updatedData);
      const newUser = { ...user, ...res.data.user };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Lỗi cập nhật" };
    }
  }, [user]);

  const value = useMemo(
    () => ({ user, login, logout, updateProfile, isAuthenticated: !!user, loading }),
    [user, loading, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
