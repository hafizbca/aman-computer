import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const ADMIN_ID = "admin";
const ADMIN_PASS = "Tilo@159";

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem("tz_admin") === "true";
  });

  function login(id, password) {
    if (id === ADMIN_ID && password === ADMIN_PASS) {
      sessionStorage.setItem("tz_admin", "true");
      setIsAdmin(true);
      return true;
    }
    return false;
  }

  function logout() {
    sessionStorage.removeItem("tz_admin");
    setIsAdmin(false);
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
