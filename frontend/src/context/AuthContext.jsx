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
        
        // Tenta encontrar o Role em várias propriedades comuns
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] 
                  || decoded.role 
                  || "Customer";
                  
        return { token, role, name: decoded.unique_name || "User" };
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
    
    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] 
              || decoded.role 
              || "Customer";

    console.log("Login com sucesso. Role detetado:", role); // DEBUG

    setUser({ token, role, name: decoded.unique_name });
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