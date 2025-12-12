import { useEffect, useState } from "react";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { 
    FaUser, 
    FaBoxOpen, 
    FaLock, 
    FaSave, 
    FaEnvelope, 
    FaShoppingBag, 
    FaWallet, 
    FaChartLine,
    FaCalendarAlt
} from "react-icons/fa";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' ou 'orders'
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const resProfile = await api.get("Users/profile");
      setProfile({ name: resProfile.data.name, password: "" });

      const resOrders = await api.get("Orders/my-orders");
      setOrders(resOrders.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar dados do perfil.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put("Users/profile", {
        name: profile.name,
        password: profile.password || null
      });
      toast.success("Perfil atualizado com sucesso!");
      setProfile(prev => ({ ...prev, password: "" }));
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-50 py-5">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted fw-medium">A carregar o seu painel...</p>
      </div>
    );
  }

  // Cálculos
  const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);
  const averageTicket = orders.length > 0 ? totalSpent / orders.length : 0;

  return (
    <div className="container py-5">
      <div className="row g-4">
        
        {/* --- SIDEBAR (Esquerda) --- */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm overflow-hidden sticky-top" style={{ top: "100px", borderRadius: "12px" }}>
            
            {/* Header do Cartão (Navy Blue) */}
            <div className="p-4 text-center text-white" style={{ backgroundColor: "#1e3a8a" }}>
              <div 
                className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm"
                style={{ width: "80px", height: "80px", fontSize: "2rem", fontWeight: "bold", color: "#1e3a8a" }}
              >
                {profile.name ? profile.name.charAt(0).toUpperCase() : <FaUser />}
              </div>
              <h5 className="fw-bold mb-1">{profile.name || "Cliente"}</h5>
              <p className="mb-0 opacity-75 small">{user?.email}</p>
            </div>

            {/* Navegação */}
            <div className="list-group list-group-flush p-3">
              <button
                onClick={() => setActiveTab("profile")}
                className={`list-group-item list-group-item-action border-0 rounded-3 mb-1 px-3 py-3 d-flex align-items-center transition-all ${
                    activeTab === "profile" ? "bg-primary bg-opacity-10 text-primary fw-bold" : "text-muted"
                }`}
                style={activeTab === "profile" ? { color: "#1e3a8a", backgroundColor: "#eff6ff" } : {}}
              >
                <FaUser className="me-3" /> Meus Dados
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`list-group-item list-group-item-action border-0 rounded-3 px-3 py-3 d-flex align-items-center transition-all ${
                    activeTab === "orders" ? "bg-primary bg-opacity-10 text-primary fw-bold" : "text-muted"
                }`}
                style={activeTab === "orders" ? { color: "#1e3a8a", backgroundColor: "#eff6ff" } : {}}
              >
                <FaBoxOpen className="me-3" /> Histórico de Encomendas
                <span className="badge bg-primary rounded-pill ms-auto" style={{ backgroundColor: "#1e3a8a" }}>{orders.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- CONTEÚDO (Direita) --- */}
        <div className="col-lg-8">
          
          {/* TAB: PERFIL */}
          {activeTab === "profile" && (
            <div className="d-flex flex-column gap-4 fade-in">
              
              {/* KPIs (Estatísticas Rápidas) */}
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
                    <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-primary bg-opacity-10 p-3 text-primary" style={{ color: "#1e3a8a", backgroundColor: "#eff6ff" }}>
                            <FaShoppingBag size={20} />
                        </div>
                        <div>
                            <h5 className="fw-bold mb-0 text-dark">{orders.length}</h5>
                            <small className="text-muted" style={{ fontSize: "0.8rem" }}>Encomendas</small>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
                    <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-success bg-opacity-10 p-3 text-success">
                            <FaWallet size={20} />
                        </div>
                        <div>
                            <h5 className="fw-bold mb-0 text-dark">{totalSpent.toFixed(2)} €</h5>
                            <small className="text-muted" style={{ fontSize: "0.8rem" }}>Total Gasto</small>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm p-3" style={{ borderRadius: "12px" }}>
                    <div className="d-flex align-items-center gap-3">
                        <div className="rounded-circle bg-warning bg-opacity-10 p-3 text-warning">
                            <FaChartLine size={20} />
                        </div>
                        <div>
                            <h5 className="fw-bold mb-0 text-dark">{averageTicket.toFixed(2)} €</h5>
                            <small className="text-muted" style={{ fontSize: "0.8rem" }}>Média / Pedido</small>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulário */}
              <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4 text-dark">Informações Pessoais</h5>
                  
                  <form onSubmit={handleUpdate}>
                    {/* Email (Disabled) */}
                    <div className="mb-4">
                        <label className="form-label text-muted small fw-bold text-uppercase">Email</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-0 ps-3"><FaEnvelope className="text-muted" /></span>
                            <input 
                                type="text" 
                                className="form-control bg-light border-0 fw-medium text-muted" 
                                value={user?.email || ""} 
                                disabled 
                                style={{ cursor: "not-allowed" }}
                            />
                            <span className="input-group-text bg-light border-0 pe-3"><FaLock className="text-muted" size={12} /></span>
                        </div>
                    </div>

                    {/* Nome */}
                    <div className="mb-4">
                        <label className="form-label text-muted small fw-bold text-uppercase">Nome Completo</label>
                        <input 
                            type="text" 
                            className="form-control bg-light border-0 py-2" 
                            value={profile.name}
                            onChange={e => setProfile({...profile, name: e.target.value})}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label className="form-label text-muted small fw-bold text-uppercase">Nova Password</label>
                        <input 
                            type="password" 
                            className="form-control bg-light border-0 py-2" 
                            placeholder="Deixe em branco para manter a atual"
                            value={profile.password}
                            onChange={e => setProfile({...profile, password: e.target.value})}
                        />
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                        <button 
                            type="submit" 
                            className="btn btn-primary px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
                            disabled={isSaving}
                            style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a" }}
                        >
                            {isSaving ? <span className="spinner-border spinner-border-sm" /> : <FaSave />}
                            Guardar Alterações
                        </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ENCOMENDAS */}
          {activeTab === "orders" && (
            <div className="d-flex flex-column gap-4 fade-in">
                <h4 className="fw-bold mb-0">Minhas Encomendas</h4>
                
                {orders.length === 0 ? (
                    <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: "12px" }}>
                        <div className="mb-3 text-muted opacity-25" style={{ fontSize: "4rem" }}><FaBoxOpen /></div>
                        <h5 className="fw-bold text-muted">Ainda não fez compras</h5>
                        <p className="text-muted mb-0">Explore a loja e faça a sua primeira encomenda.</p>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-3">
                        {orders.map((order) => (
                            <div key={order.id} className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "12px" }}>
                                <div className="card-header bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
                                    <div>
                                        <span className="badge bg-light text-dark border me-2">#{order.id}</span>
                                        <small className="text-muted fw-medium">
                                            <FaCalendarAlt className="me-1 mb-1" />
                                            {new Date(order.orderDate).toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" })}
                                        </small>
                                    </div>
                                    <div className="fw-bold text-primary fs-5" style={{ color: "#1e3a8a" }}>
                                        {order.total.toFixed(2)} €
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0 align-middle">
                                            <tbody>
                                                {order.items.map(item => (
                                                    <tr key={item.id}>
                                                        <td className="ps-4 py-3" style={{ width: "60px" }}>
                                                            {/* Imagem Pequena */}
                                                            <img 
                                                                src={`https://picsum.photos/seed/${item.productId}/100/100`} 
                                                                alt="prod" 
                                                                className="rounded border" 
                                                                style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <span className="d-block fw-medium text-dark">
                                                                {item.product ? item.product.name : "Produto Indisponível"}
                                                            </span>
                                                        </td>
                                                        <td className="text-center text-muted">x{item.quantity}</td>
                                                        <td className="text-end pe-4 fw-medium">
                                                            {(item.price * item.quantity).toFixed(2)} €
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}

        </div>
      </div>
      
      <style>{`
        .transition-all { transition: all 0.2s ease; }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}