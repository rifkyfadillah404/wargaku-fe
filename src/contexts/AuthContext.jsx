import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Set token in API headers
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await api.get("/auth/profile");
          setUser(response.data.data);
        } catch (error) {
          console.error("Auth check failed:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const { user: userData, token: userToken } = response.data.data;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem("token", userToken);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login gagal",
      };
    }
  };

  const loginMasyarakat = async (nik, nama) => {
    try {
      console.log("Calling login-masyarakat with:", { nik, nama });
      const response = await api.post("/auth/login-masyarakat", {
        nik,
        nama,
      });

      console.log("Login masyarakat response:", response.data);

      const { user: userData, token: userToken } = response.data.data;

      console.log("Setting user:", userData);
      console.log("Setting token:", userToken);

      setUser(userData);
      setToken(userToken);
      localStorage.setItem("token", userToken);

      // Set authorization header
      api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;

      console.log("✅ User and token set successfully");

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login masyarakat error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login gagal",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put("/auth/profile", profileData);
      setUser(response.data.data);
      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Update profile gagal",
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return { success: true };
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Ubah password gagal",
      };
    }
  };

  // Debug authentication state (simplified)
  if (user) {
    console.log("AuthContext - User logged in:", user.username, "Role:", user.role);
  }

  const value = {
    user,
    loading,
    login,
    loginMasyarakat,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
