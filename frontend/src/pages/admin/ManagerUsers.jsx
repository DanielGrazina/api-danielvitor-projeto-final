import { useEffect, useState } from "react";
import api from "../../api/http";

export default function ManagerUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await api.get("/Users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar utilizadores.");
    } finally {
        setLoading(false);
    }
  }

  async function handleRoleChange(userId, newRole) {
    try {
        // O C# espera uma string crua no Body devido ao [FromBody] string
        // Por isso enviamos com content-type json, mas apenas a string entre aspas
        await api.put(`/Users/${userId}/role`, `"${newRole}"`, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        // Atualiza estado local para refletir a mudança
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        alert("Role atualizado com sucesso!");
    } catch (err) {
        console.error(err);
        alert("Erro ao atualizar permissão.");
        loadUsers(); // Reverte em caso de erro
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem a certeza que quer apagar este utilizador?")) return;
    try {
        await api.delete(`/Users/${id}`);
        setUsers(users.filter(u => u.id !== id));
    } catch (err) {
        alert("Erro ao apagar utilizador.");
    }
  }

  if (loading) return <div className="text-center mt-5">A carregar utilizadores...</div>;

  return (
    <div className="container mt-4">
      <h2>Gestão de Utilizadores (Manager)</h2>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Role (Permissão)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                {/* Dropdown para mudar Role instantaneamente */}
                <select 
                    className="form-select form-select-sm"
                    value={u.role || "Customer"}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    style={{maxWidth: "150px"}}
                >
                    <option value="Customer">Customer</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                </select>
              </td>
              <td>
                <button 
                    onClick={() => handleDelete(u.id)} 
                    className="btn btn-danger btn-sm"
                >
                    Apagar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}