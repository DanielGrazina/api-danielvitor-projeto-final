import { useState } from "react";
import api from "../api/http";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password
      });

      alert("Registado com sucesso!");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Erro ao registar");
    }
  }

  return (
    <div style={{ width: "300px", margin: "50px auto" }}>
      <h2>Registar</h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

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

        <button type="submit">Criar conta</button>
      </form>
    </div>
  );
}
