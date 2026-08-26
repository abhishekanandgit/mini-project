import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const USERS_KEY = "legalassist_users_v2";
const CURRENT_USER_KEY = "legalassist_current_user_v2";

// Only the admin exists initially.
// There are NO pre-registered users or advocates.
const DEFAULT_ADMIN = {
  id: "admin-001",
  name: "System Administrator",
  email: "admin@legalassist.com",
  password: "admin123",
  role: "admin",
  status: "active",
  verified: true,
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem(USERS_KEY);
    if (!savedUsers) return [DEFAULT_ADMIN];
    try {
      const parsed = JSON.parse(savedUsers);
      return Array.isArray(parsed) ? parsed : [DEFAULT_ADMIN];
    } catch (error) {
      return [DEFAULT_ADMIN];
    }
  });

  // Fetch Users from Backend DB on mount
  useEffect(() => {
    const loadUsers = () => {
      fetch("/api/users")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setUsers(data);
            localStorage.setItem(USERS_KEY, JSON.stringify(data));
          }
        })
        .catch((err) => console.log("Backend DB connect info: using synced local cache"));
    };

    loadUsers();
    const timer = setTimeout(loadUsers, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Sync state to localStorage cache
  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUser]);

  // LOGIN
  const login = async (email, password, role) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password, role }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      } else if (data && data.message) {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.log("Backend offline, using fallback local auth");
    }

    // Local Fallback Check
    const user = users.find(
      (u) =>
        u.email &&
        u.email.toLowerCase() === cleanEmail &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
      return { success: false, message: "Invalid email, password, or role." };
    }

    if (user.role === "advocate") {
      if (user.status === "pending") {
        return { success: false, message: "Your advocate account is waiting for admin approval." };
      }
      if (user.status === "rejected") {
        return { success: false, message: "Your advocate registration has been rejected." };
      }
      if (user.status !== "verified") {
        return { success: false, message: "Your advocate account has not been verified yet." };
      }
    }

    setCurrentUser(user);
    return { success: true, user };
  };

  // REGISTER
  const register = async (userData) => {
    const cleanEmail = userData.email.trim().toLowerCase();

    if (userData.role === "admin") {
      return { success: false, message: "Admin accounts cannot be created through registration." };
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUsers((prev) => [...prev.filter((u) => u.id !== data.user.id), data.user]);
        setCurrentUser(data.user);
        return { success: true, user: data.user };
      } else if (data && data.message) {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.log("Backend offline, fallback local register");
    }

    const emailExists = users.some((user) => user.email && user.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, message: "An account with this email already exists." };
    }

    const newUser = {
      id: `${userData.role}-${Date.now()}`,
      ...userData,
      email: cleanEmail,
      ...(userData.role === "advocate" ? { status: "pending", verified: false } : { status: "active", verified: true }),
      createdAt: new Date().toISOString(),
    };

    setUsers((prevUsers) => [...prevUsers, newUser]);
    setCurrentUser(newUser);

    return { success: true, user: newUser };
  };

  // LOGOUT
  const logout = () => {
    setCurrentUser(null);
  };

  // APPROVE ADVOCATE
  const approveAdvocate = async (advocateId) => {
    let approvedUser = null;

    try {
      const res = await fetch(`/api/users/${advocateId}/approve`, { method: "PUT" });
      const data = await res.json();
      if (res.ok && data.success) {
        approvedUser = data.user;
      }
    } catch (err) {
      console.log("Backend approve error, using local state update");
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === advocateId && user.role === "advocate") {
          approvedUser = approvedUser || { ...user, status: "verified", verified: true };
          return approvedUser;
        }
        return user;
      })
    );

    return approvedUser;
  };

  // REJECT ADVOCATE
  const rejectAdvocate = async (advocateId) => {
    let rejectedUser = null;

    try {
      const res = await fetch(`/api/users/${advocateId}/reject`, { method: "PUT" });
      const data = await res.json();
      if (res.ok && data.success) {
        rejectedUser = data.user;
      }
    } catch (err) {
      console.log("Backend reject error, using local state update");
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === advocateId && user.role === "advocate") {
          rejectedUser = rejectedUser || { ...user, status: "rejected", verified: false };
          return rejectedUser;
        }
        return user;
      })
    );

    return rejectedUser;
  };

  // UPDATE USER
  const updateUser = async (updatedData) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);

    try {
      await fetch(`/api/users/${currentUser.id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
    } catch (err) {
      console.log("Backend update profile offline fallback");
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === currentUser.id ? updatedUser : user))
    );
  };

  const updateUserById = (userId, updatedData) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, ...updatedData } : user))
    );

    if (currentUser?.id === userId) {
      setCurrentUser((prevUser) => ({ ...prevUser, ...updatedData }));
    }
  };

  // DELETE USER / ADVOCATE
  const deleteUser = async (userId) => {
    try {
      await fetch(`/api/users/${userId}`, { method: "DELETE" });
    } catch (err) {
      console.log("Backend delete user error, using local state update");
    }

    setUsers((prevUsers) => prevUsers.filter((user) => String(user.id) !== String(userId)));
    if (String(currentUser?.id) === String(userId)) {
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    users,
    login,
    register,
    logout,
    approveAdvocate,
    rejectAdvocate,
    deleteUser,
    updateUser,
    updateUserById,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// --------------------------------------------------
// useAuth Hook
// --------------------------------------------------

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;