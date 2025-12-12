import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      
      const response = await api.post("Auth/login", { email, password });
      if (response.data && response.data.token) {
          const sucesso = login(response.data.token);
          
          if (sucesso) {
              navigate("/products");
          } else {
              setError("Erro ao processar o token de acesso.");
          }
      } else {
          setError("A API não retornou um token válido.");
      }

    } catch (err) {
      console.error("Erro no catch:", err);
      if (err.response && err.response.data) {
          setError(typeof err.response.data === 'string' 
              ? err.response.data 
              : "Credenciais inválidas ou erro no servidor.");
      } else {
          setError("Não foi possível conectar ao servidor.");
      }
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Login</h2>
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
                id="email"
                name="email"
                autoComplete="email"
                className="form-control" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
                id="password"
                name="password"
                autoComplete="current-password"
                className="form-control" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
          )}

          <button 
            className="btn btn-primary w-100" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "A entrar..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}