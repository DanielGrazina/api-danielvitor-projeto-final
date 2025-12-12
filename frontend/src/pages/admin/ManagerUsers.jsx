import { useEffect, useState } from "react";
import api from "../../api/http";
import toast from "react-hot-toast";
import { 
    FaUserShield, 
    FaUserTie, 
    FaUser, 
    FaSearch, 
    FaTrash, 
    FaExclamationTriangle,
    FaUsers,
    FaCheck
} from "react-icons/fa";

export default function ManagerUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingRoleChange, setPendingRoleChange] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    try {
      const res = await api.get("/Users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar utilizadores.");
    } finally {
      setLoading(false);
    }
  }

  // Confirmar mudança de Role
  async function applyRoleChange(userId, newRole) {
    setIsProcessing(true);
    try {
      await api.put(`/Users/${userId}/role`, `"${newRole}"`, {
        headers: { "Content-Type": "application/json" },
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      toast.success(`Permissão alterada para ${newRole}`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar permissão.");
      loadUsers(); // Reverte visualmente
    } finally {
      setIsProcessing(false);
    }
  }

  function handleRoleSelect(u, newRole) {
    const fromRole = u.role || "Customer";
    if (fromRole === newRole) return;

    // Scroll para o topo para ver o alerta
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setPendingRoleChange({
      userId: u.id,
      name: u.name,
      email: u.email,
      fromRole,
      toRole: newRole,
    });
  }

  async function confirmPendingChange() {
    if (!pendingRoleChange) return;
    const { userId, toRole } = pendingRoleChange;
    setPendingRoleChange(null);
    await applyRoleChange(userId, toRole);
  }

  async function handleDelete(id) {
    if (!window.confirm("ATENÇÃO: Apagar um utilizador é irreversível. Deseja continuar?")) return;
    
    try {
      await api.delete(`/Users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      toast.success("Utilizador removido.");
    } catch (err) {
      toast.error("Erro ao apagar utilizador.");
    }
  }

  // Filtragem
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  // Helper Visual para Roles
  const getRoleBadge = (role) => {
      switch(role) {
          case 'Admin': 
            return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger d-inline-flex align-items-center gap-1 px-2 py-1"><FaUserShield /> Admin</span>;
          case 'Manager': 
            return <span className="badge bg-warning bg-opacity-10 text-dark border border-warning d-inline-flex align-items-center gap-1 px-2 py-1"><FaUserTie /> Manager</span>;
          default: 
            return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary d-inline-flex align-items-center gap-1 px-2 py-1"><FaUser /> Customer</span>;
      }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50 py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold text-dark mb-0">Gestão de Utilizadores</h2>
            <p className="text-muted small mb-0">Controlo de acessos e permissões do sistema</p>
        </div>
        
        {/* KPI Simples */}
        <div className="bg-white px-4 py-2 rounded-pill shadow-sm border d-flex align-items-center gap-3">
            <div className="text-end">
                <small className="d-block text-muted" style={{ fontSize: "0.7rem", lineHeight: 1 }}>TOTAL</small>
                <span className="fw-bold text-dark">{users.length}</span>
            </div>
            <div className="bg-light rounded-circle p-2 text-primary">
                <FaUsers />
            </div>
        </div>
      </div>

      {/* ÁREA DE ALERTA (Confirmação de Mudança) */}
      {pendingRoleChange && (
        <div className="alert alert-warning border-0 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between p-4 mb-4 rounded-3" style={{ borderLeft: "5px solid #f59e0b" }}>
            <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
                <div className="bg-warning bg-opacity-25 p-3 rounded-circle text-warning-emphasis">
                    <FaExclamationTriangle size={24} />
                </div>
                <div>
                    <h5 className="fw-bold mb-1 text-dark">Alterar Permissões?</h5>
                    <p className="mb-0 text-muted">
                        Deseja alterar <strong>{pendingRoleChange.name}</strong> de 
                        <span className="fw-bold mx-1">{pendingRoleChange.fromRole}</span> para 
                        <span className="fw-bold mx-1 text-primary">{pendingRoleChange.toRole}</span>?
                    </p>
                </div>
            </div>
            <div className="d-flex gap-2 w-100 w-md-auto">
                <button 
                    className="btn btn-light border fw-bold flex-grow-1" 
                    onClick={() => setPendingRoleChange(null)}
                >
                    Cancelar
                </button>
                <button 
                    className="btn btn-warning fw-bold shadow-sm flex-grow-1" 
                    onClick={confirmPendingChange}
                >
                    Confirmar <FaCheck className="ms-1"/>
                </button>
            </div>
        </div>
      )}

      {/* Tabela de Utilizadores */}
      <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "12px" }}>
        
        {/* Barra de Pesquisa */}
        <div className="p-3 border-bottom bg-light">
            <div className="input-group">
                <span className="input-group-text bg-white border-end-0 ps-3 text-muted"><FaSearch /></span>
                <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Pesquisar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ boxShadow: "none" }}
                />
            </div>
        </div>

        <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
                <thead className="bg-light text-secondary small">
                    <tr>
                        <th className="ps-4 py-3">UTILIZADOR</th>
                        <th>EMAIL</th>
                        <th>CARGO ATUAL</th>
                        <th>AÇÕES DE ACESSO</th>
                        <th className="text-end pe-4">ELIMINAR</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-5 text-muted">Nenhum utilizador encontrado.</td></tr>
                    ) : (
                        filteredUsers.map((u) => {
                            const currentRole = u.role || "Customer";
                            const isPending = pendingRoleChange?.userId === u.id;
                            
                            return (
                                <tr key={u.id} className={isPending ? "table-warning" : ""}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center gap-3">
                                            {/* Avatar Gerado */}
                                            <div 
                                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                                                style={{ 
                                                    width: "40px", 
                                                    height: "40px", 
                                                    backgroundColor: u.role === 'Admin' ? '#dc2626' : (u.role === 'Manager' ? '#d97706' : '#1e3a8a') 
                                                }}
                                            >
                                                {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{u.name}</div>
                                                <div className="small text-muted" style={{ fontSize: "0.75rem" }}>ID: {u.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-muted">{u.email}</td>
                                    <td>
                                        {getRoleBadge(currentRole)}
                                    </td>
                                    <td>
                                        <select
                                            className="form-select form-select-sm border-0 bg-light fw-medium"
                                            value={isPending ? pendingRoleChange.toRole : currentRole}
                                            onChange={(e) => handleRoleSelect(u, e.target.value)}
                                            style={{ maxWidth: "160px", cursor: "pointer" }}
                                            disabled={!!pendingRoleChange && !isPending || isProcessing}
                                        >
                                            <option value="Customer">Customer</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="text-end pe-4">
                                        <button 
                                            onClick={() => handleDelete(u.id)} 
                                            className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0 bg-light hover-bg-danger"
                                            disabled={!!pendingRoleChange}
                                            title="Apagar Conta"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>
      
      <style>{`
        .hover-bg-danger:hover { background-color: #dc2626 !important; color: white !important; }
      `}</style>
    </div>
  );
}