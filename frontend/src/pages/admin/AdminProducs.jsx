import { useEffect, useState } from "react";
import api from "../../api/http";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { 
    FaEdit, 
    FaTrash, 
    FaSearch, 
    FaPlus, 
    FaBoxOpen, 
    FaExclamationTriangle, 
    FaMoneyBillWave 
} from "react-icons/fa";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem a certeza que deseja apagar este produto permanentemente?")) return;
    
    try {
      await api.delete(`/Products/${id}`);
      setProducts((prev) => prev.filter((p) => (p.id || p.Id) !== id));
      toast.success("Produto apagado com sucesso!");
    } catch (error) {
      toast.error("Erro ao apagar. Verifique se existem encomendas associadas.");
    }
  }

  // Filtragem
  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const name = (p.name || p.Name || "").toLowerCase();
    const id = String(p.id || p.Id);
    return name.includes(term) || id.includes(term);
  });

  // Paginação
  useEffect(() => { setCurrentPage(1); }, [searchTerm]);
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  // Estatísticas Rápidas (KPIs)
  const totalStock = products.reduce((acc, p) => acc + (p.stock || p.Stock || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + ((p.price || p.Price || 0) * (p.stock || p.Stock || 0)), 0);
  const lowStockCount = products.filter(p => (p.stock || p.Stock) < 5).length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50 py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      
      {/* HEADER & ACTIONS */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold text-dark mb-0">Gestão de Produtos</h2>
            <p className="text-muted small mb-0">Gerencie o catálogo da sua loja</p>
        </div>
        <Link 
            to="/admin/products/new" 
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm px-4 fw-bold rounded-pill"
            style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a" }}
        >
            <FaPlus /> Novo Produto
        </Link>
      </div>

      {/* DASHBOARD CARDS (KPIs) */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3 text-white" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)", borderRadius: "12px" }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="opacity-75 mb-0">Total Produtos</h6>
                        <h3 className="fw-bold mb-0">{products.length}</h3>
                    </div>
                    <FaBoxOpen size={28} className="opacity-50" />
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3 text-white" style={{ background: "linear-gradient(135deg, #059669 0%, #34d399 100%)", borderRadius: "12px" }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="opacity-75 mb-0">Valor em Stock</h6>
                        <h3 className="fw-bold mb-0">{totalValue.toFixed(0)} €</h3>
                    </div>
                    <FaMoneyBillWave size={28} className="opacity-50" />
                </div>
            </div>
        </div>
        <div className="col-md-4">
            <div className="card border-0 shadow-sm p-3 text-white" style={{ background: "linear-gradient(135deg, #dc2626 0%, #f87171 100%)", borderRadius: "12px" }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="opacity-75 mb-0">Stock Crítico</h6>
                        <h3 className="fw-bold mb-0">{lowStockCount}</h3>
                    </div>
                    <FaExclamationTriangle size={28} className="opacity-50" />
                </div>
            </div>
        </div>
      </div>

      {/* PAINEL PRINCIPAL */}
      <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "12px" }}>
        
        {/* Barra de Pesquisa */}
        <div className="p-3 border-bottom bg-light">
            <div className="input-group">
                <span className="input-group-text bg-white border-end-0 ps-3 text-muted"><FaSearch /></span>
                <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Pesquisar por nome ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ boxShadow: "none" }}
                />
            </div>
        </div>

        {/* Tabela */}
        <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
                <thead className="bg-light text-secondary small">
                    <tr>
                        <th className="ps-4 py-3">PRODUTO</th>
                        <th>CATEGORIA</th>
                        <th>PREÇO</th>
                        <th>STOCK</th>
                        <th className="text-end pe-4">AÇÕES</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedProducts.length === 0 ? (
                        <tr><td colSpan="5" className="text-center py-5 text-muted">Nenhum produto encontrado.</td></tr>
                    ) : (
                        paginatedProducts.map((p) => {
                            const stock = p.stock || p.Stock || 0;
                            const price = p.price || p.Price || 0;
                            
                            return (
                                <tr key={p.id || p.Id}>
                                    <td className="ps-4">
                                        <div className="d-flex align-items-center gap-3">
                                            {/* Miniatura Imagem */}
                                            <div className="rounded bg-light d-flex align-items-center justify-content-center overflow-hidden border" style={{ width: "45px", height: "45px" }}>
                                                <img 
                                                    src={`https://picsum.photos/seed/${p.id || p.Id}/100/100`} 
                                                    alt="" 
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                                />
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark">{p.name || p.Name}</div>
                                                <div className="small text-muted">ID: {p.id || p.Id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge bg-light text-dark border fw-normal">
                                            {p.categoryName || p.CategoryName || "Geral"}
                                        </span>
                                    </td>
                                    <td className="fw-bold text-primary">{price.toFixed(2)} €</td>
                                    <td>
                                        <span className={`badge border ${
                                            stock === 0 ? 'bg-danger-subtle text-danger border-danger' : 
                                            stock < 10 ? 'bg-warning-subtle text-warning border-warning' : 
                                            'bg-success-subtle text-success border-success'
                                        }`}>
                                            {stock === 0 ? "Esgotado" : `${stock} un`}
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <Link 
                                            to={`/admin/products/edit/${p.id || p.Id}`} 
                                            className="btn btn-outline-primary btn-sm me-2 rounded-circle p-2 border-0 bg-light"
                                            title="Editar"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button 
                                            onClick={() => handleDelete(p.id || p.Id)} 
                                            className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0 bg-light"
                                            title="Apagar"
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

        {/* Paginação */}
        {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light">
                <small className="text-muted">Página {currentPage} de {totalPages}</small>
                <div className="d-flex gap-1">
                    <button className="btn btn-white border btn-sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>Anterior</button>
                    <button className="btn btn-white border btn-sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>Próximo</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}