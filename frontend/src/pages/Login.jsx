import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/http";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await api.post("Auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);

      alert("Login OK!");
      localStorage.setItem("token", response.data.token);
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
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button type="submit">Entrar</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
