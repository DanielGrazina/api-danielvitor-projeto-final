import { useEffect, useState } from "react";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth(); // Para saber se está logado
  const [profile, setProfile] = useState({ name: "", password: "" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const resProfile = await api.get("Users/profile"); 
      setProfile({ name: resProfile.data.name, password: "" });

      // 2. Carregar Encomendas
      const resOrders = await api.get("Orders/my-orders");
      setOrders(resOrders.data);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar dados do perfil.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      await api.put("Users/profile", {
        name: profile.name,
        password: profile.password || null
      });
      alert("Perfil atualizado com sucesso!");
      setProfile(prev => ({ ...prev, password: "" })); // Limpa campo da pass
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar perfil.");
    }
  }

  if (loading) return <div className="text-center mt-5">A carregar perfil...</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">O meu Perfil</h2>

      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              Meus Dados
            </div>
            <div className="card-body">
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  {}
                  <input type="text" className="form-control" value={user?.email || ""} disabled />
                  <small className="text-muted">O email não pode ser alterado.</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Nome</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nova Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="Deixe vazio para manter a atual"
                    value={profile.password}
                    onChange={e => setProfile({...profile, password: e.target.value})}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Guardar Alterações
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* --- COLUNA DIREITA: Histórico de Encomendas --- */}
        <div className="col-md-7">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white">
              Histórico de Compras
            </div>
            <div className="card-body p-0">
              {orders.length === 0 ? (
                <div className="p-4 text-center">Ainda não fez nenhuma compra.</div>
              ) : (
                <div className="list-group list-group-flush">
                  {orders.map(order => (
                    <div className="list-group-item" key={order.id}>
                      <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">Encomenda #{order.id}</h5>
                        <small>{new Date(order.orderDate).toLocaleDateString()}</small>
                      </div>
                      <p className="mb-1 fw-bold text-success">Total: {order.total.toFixed(2)} €</p>
                      
                      {/* Lista de Produtos dentro da Encomenda */}
                      <ul className="mt-2 small text-muted">
                        {order.items.map(item => (
                          <li key={item.id}>
                            {item.quantity}x {item.product ? item.product.name : "Produto (Apagado)"} 
                            {" "}- {(item.price * item.quantity).toFixed(2)} €
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}