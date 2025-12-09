import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const response = await api.post("Auth/login", { email, password });
      
      login(response.data.token);
      
      alert("Login OK!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError("Credenciais inválidas");
    }
  }

  return (
    <div style={{ width: "300px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input className="form-control mb-2" type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="form-control mb-2" type="password" placeholder="senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn btn-primary w-100" type="submit">Entrar</button>
      </form>
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
}