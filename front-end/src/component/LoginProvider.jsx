import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const LoginContext = createContext(null);

export function LoginProvider({ children }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [expired, setExpired] = useState(0);
  const [authority, setAuthority] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    token !== null && login(token);
  }, []);

  // isLoggedIn
  function isLoggedIn() {
    return Date.now() < expired * 1000;
  }

  // hasAccess
  function hasAccess(param) {
    return id === param;
  }

  function isAdmin() {
    return authority.includes("admin");
  }

  function isManager() {
    return authority.includes("manager") || authority.includes("admin");
  }

  // login
  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    setExpired(payload.exp);
    setId(payload.sub);
    setName(payload.name);
    setAuthority(payload.scope.split(" "));
  }

  // logout
  function logout() {
    localStorage.removeItem("token");
    setExpired(0);
    setId("");
    setName("");
    setAuthority([]);
  }

  return (
    <LoginContext.Provider
      value={{
        id: id,
        name: name,
        authority: authority,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        hasAccess: hasAccess,
        isAdmin: isAdmin,
        isManager: isManager,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
