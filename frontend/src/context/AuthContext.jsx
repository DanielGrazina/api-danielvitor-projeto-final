import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

// =========================================================
// Adicionamos esta linha acima do export do hook para 
// ignorar a regra "only-export-components" neste caso específico.
// =========================================================
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const parseJwt = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Erro ao ler token:", e);
      return null;
    }
  };

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
        const decoded = parseJwt(token);
        // Se o token for inválido (expirado ou malformado), logout inicial
        if (!decoded) {
            localStorage.removeItem("token");
            return null;
        }
        
        
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role || "Customer";
        const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded.email || "";
        const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.unique_name || decoded.name || "User";

        return { token, role, email, name };
    }
    return null;
  });

  const login = (token) => {
    const decoded = parseJwt(token);
    
    if (!decoded) {
        console.error("Token inválido recebido no login");
        return false;
    }

    localStorage.setItem("token", token);
    
    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role || "Customer";
    const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || decoded.email || "";
    const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded.unique_name || decoded.name || "User";

    setUser({ token, role, email, name });
    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}