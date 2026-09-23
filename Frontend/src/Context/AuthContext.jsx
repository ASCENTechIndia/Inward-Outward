import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();
let inactivityTimer;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const startInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      alert("Session expired due to inactivity.");
      logout();
    }, 15 * 60 * 1000); // 15 minutes
  };

  const resetInactivityTimer = () => {
    startInactivityTimer();
  };

  const setupInactivityListeners = () => {
    ["mousemove", "keydown", "click", "scroll"].forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });
  };
useEffect(() => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        console.warn("Token expired, logging out.");
        // logout();
        return;
      }

      const userData = {
        userId: decoded.userId,
        username: localStorage.getItem("username"),
        deptId: localStorage.getItem("deptid"),
        ulbId: localStorage.getItem("ulbId"),
        collcenterid: localStorage.getItem("collcenterid"),
        lastLogin: localStorage.getItem("lastlogin"),
        lastLogout: localStorage.getItem("lastlogout"),
        prabhagName: localStorage.getItem("prabhagName"),
        prabhagID: localStorage.getItem("prabhagID"),
        corporation: localStorage.getItem("corporation"),
        opdid: localStorage.getItem("opdid"),
        opdname: localStorage.getItem("opdname") || "",
        desigId: localStorage.getItem("desigId"),
        token,
      };

      setUser(userData);
    } catch (error) {
      console.error("Error decoding token:", error);
      logout();
    }
  }
  setLoading(false);
}, []);


  const login = (userData, token, userConfig) => {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;
        const opdid =
      Array.isArray(userConfig) && userConfig.length > 0
        ? userConfig[0].NUM_USERCOFIG_OPDID
        : "";
        const opdname = Array.isArray(userConfig) && userConfig.length > 0
        ? userConfig[0].VAR_OPD_NAME : "";
      localStorage.setItem("username", userData.Out_UserName);
      localStorage.setItem("deptid", userData.acccounttype);
      localStorage.setItem("ulbId", userData.out_OrgId);
      localStorage.setItem("collcenterid", userData.Out_Collectioncenter);
      localStorage.setItem("token", token);
      localStorage.setItem("lastlogin", userData.Out_LastLogin);
      localStorage.setItem("lastlogout", userData.Out_LastLogOut);
      localStorage.setItem("prabhagName", userData.prabhagName || "");
      localStorage.setItem("prabhagID", userData.prabhagID || ""); // Fixed key
      localStorage.setItem("userId", userData.userId);
      localStorage.setItem("corporation", userData.corporation || "");
      localStorage.setItem("opdid",opdid);
      localStorage.setItem("opdname",opdname  || "");
      localStorage.setItem("desigId", userData.desigId || ""); // Fixed key

      setUser({
        userId,
        username: userData.Out_UserName,
        deptId: userData.deptId,
        ulbId: userData.out_OrgId,
        collcenterid: userData.Out_Collectioncenter,
        lastLogin: userData.Out_LastLogin,
        lastLogout: userData.Out_LastLogOut,
        prabhagName: userData.prabhagName,
        prabhagID: userData.prabhagID, 
        corporation: userData.corporation || "",
        desigId: userData.desigId,
        opdid,
        opdname,
        token,
      });
    } catch (error) {
      console.error("Error decoding token during login:", error);
    }
    setLoading(false);
    setupInactivityListeners();
    startInactivityTimer();
  };

  const logout = () => {
    clearTimeout(inactivityTimer);
    localStorage.clear();
    setUser(null);
    setLoading(false);
    window.location.replace("/"); // force redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
