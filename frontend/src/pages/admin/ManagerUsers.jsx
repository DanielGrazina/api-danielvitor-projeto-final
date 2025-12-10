import { useEffect, useState } from "react";
import api from "../../api/http";

export default function ManagerUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guardar mudança pendente de role
  const [pendingRoleChange, setPendingRoleChange] = useState(null);
  // { userId, name, email, fromRole, toRole }

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

  // PUT real (apenas quando confirmar)
  async function applyRoleChange(userId, newRole) {
    try {
      await api.put(`/Users/${userId}/role`, `"${newRole}"`, {
        headers: { "Content-Type": "application/json" },
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      alert("Role atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar permissão.");
      loadUsers();
    }
  }

  function handleRoleSelect(u, newRole) {
    const fromRole = u.role || "Customer";
    const toRole = newRole;

    if (fromRole === toRole) return;

    // Abre card de confirmação (sem aplicar já)
    setPendingRoleChange({
      userId: u.id,
      name: u.name,
      email: u.email,
      fromRole,
      toRole,
    });
  }

  function cancelPendingChange() {
    setPendingRoleChange(null);
  }

  async function confirmPendingChange() {
    if (!pendingRoleChange) return;
    const { userId, toRole } = pendingRoleChange;
    setPendingRoleChange(null);
    await applyRoleChange(userId, toRole);
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem a certeza que quer apagar este utilizador?")) return;
    try {
      await api.delete(`/Users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert("Erro ao apagar utilizador.");
    }
  }

  if (loading) return <div className="text-center mt-5">A carregar utilizadores...</div>;

  return (
    <div className="container mt-4">
      <h2>Gestão de Utilizadores (Manager)</h2>

      {/* CARD de confirmação (aparece só quando houver pendingRoleChange) */}
      {pendingRoleChange && (
        <div className="card border-warning mt-3">
          <div className="card-body">
            <h5 className="card-title">Confirmar alteração de permissões</h5>
            <p className="mb-3">
              Tem a certeza que quer alterar as permissões da conta{" "}
              <strong>{pendingRoleChange.name}</strong>{" "}
              <span className="text-muted">({pendingRoleChange.email})</span>{" "}
              de <strong>{pendingRoleChange.fromRole}</strong> para{" "}
              <strong>{pendingRoleChange.toRole}</strong>?
            </p>

            <div className="d-flex gap-2">
              <button className="btn btn-warning" onClick={confirmPendingChange}>
                Confirmar
              </button>
              <button className="btn btn-secondary" onClick={cancelPendingChange}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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
          {users.map((u) => {
            const currentRole = u.role || "Customer";

            // Enquanto houver confirmação pendente PARA ESTE USER,
            // o dropdown deve continuar a mostrar o role antigo (fromRole).
            const isPendingThisUser =
              pendingRoleChange && pendingRoleChange.userId === u.id;

            const selectValue = isPendingThisUser
              ? pendingRoleChange.fromRole
              : currentRole;

            return (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={selectValue}
                    onChange={(e) => handleRoleSelect(u, e.target.value)}
                    style={{ maxWidth: "150px" }}
                    // Opcional: bloquear mudar outros users enquanto há um pending
                    disabled={!!pendingRoleChange && !isPendingThisUser}
                    title={
                      pendingRoleChange && !isPendingThisUser
                        ? "Conclui/cancela a alteração pendente primeiro."
                        : ""
                    }
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
                    disabled={!!pendingRoleChange} // opcional
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
