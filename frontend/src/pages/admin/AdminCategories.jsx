import { useEffect, useState } from "react";
import api from "../../api/http";
import toast from "react-hot-toast";
import { 
    FaTrash, 
    FaPlus, 
    FaSearch, 
    FaFolderOpen, 
    FaLayerGroup, 
    FaExclamationCircle 
} from "react-icons/fa";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => { loadCategories(); }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const res = await api.get("/Categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar categorias.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post("/Categories", { name: newCategory });
      setNewCategory("");
      await loadCategories();
      toast.success("Categoria criada com sucesso!");
    } catch (err) {
      toast.error("Erro ao criar categoria.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem a certeza? Categorias com produtos não podem ser apagadas.")) return;
    
    try {
      await api.delete(`/Categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success("Categoria removida.");
    } catch (err) {
      toast.error("Não foi possível apagar (pode ter produtos associados).");
    }
  }

  // Filtragem
  const filteredCategories = categories.filter((c) => {
    const term = searchTerm.toLowerCase();
    const name = (c.name || c.Name || "").toLowerCase();
    const id = String(c.id || c.Id);
    return name.includes(term) || id.includes(term);
  });

  // Paginação
  useEffect(() => { setCurrentPage(1); }, [searchTerm]);
  const totalPages = Math.ceil(filteredCategories.length / pageSize) || 1;
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Gestão de Categorias</h2>
        <p className="text-muted small">Organize os departamentos da sua loja</p>
      </div>

      <div className="row g-4">
        
        {/* --- COLUNA ESQUERDA: Adicionar + Stats --- */}
        <div className="col-lg-4">
            
            {/* KPI Card */}
            <div className="card border-0 shadow-sm mb-4 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)", borderRadius: "12px" }}>
                <div className="card-body p-4 d-flex align-items-center justify-content-between">
                    <div>
                        <h6 className="opacity-75 mb-0 text-uppercase small ls-1">Total Categorias</h6>
                        <h2 className="fw-bold mb-0 mt-1">{categories.length}</h2>
                    </div>
                    <FaLayerGroup size={40} className="opacity-25" />
                </div>
            </div>

            {/* Formulário de Criação */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: "12px" }}>
                <div className="card-header bg-white border-bottom p-4">
                    <h5 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
                        <FaPlus className="text-primary" size={14} /> Nova Categoria
                    </h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleAdd}>
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold text-uppercase">Nome</label>
                            <input
                                type="text"
                                className="form-control bg-light border-0 py-2"
                                placeholder="Ex: Gaming, Roupa..."
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                disabled={isSubmitting}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary w-100 fw-bold shadow-sm"
                            disabled={isSubmitting || !newCategory.trim()}
                            style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a" }}
                        >
                            {isSubmitting ? "A criar..." : "Adicionar Categoria"}
                        </button>
                    </form>
                    <div className="mt-3 d-flex align-items-start gap-2 text-muted">
                        <FaExclamationCircle className="mt-1 flex-shrink-0" size={12} />
                        <small style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                            Categorias só podem ser apagadas se não tiverem produtos associados.
                        </small>
                    </div>
                </div>
            </div>
        </div>

        {/* --- COLUNA DIREITA: Lista e Pesquisa --- */}
        <div className="col-lg-8">
            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "12px" }}>
                
                {/* Barra de Pesquisa */}
                <div className="p-3 border-bottom bg-light">
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0 ps-3 text-muted"><FaSearch /></span>
                        <input
                            type="text"
                            className="form-control border-start-0"
                            placeholder="Pesquisar categoria..."
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
                                <th className="ps-4 py-3">ID</th>
                                <th>NOME DA CATEGORIA</th>
                                <th className="text-end pe-4">AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-5 text-muted">
                                        <FaFolderOpen size={30} className="mb-2 opacity-25 d-block mx-auto"/>
                                        Nenhuma categoria encontrada.
                                    </td>
                                </tr>
                            ) : (
                                paginatedCategories.map((c) => (
                                    <tr key={c.id || c.Id}>
                                        <td className="ps-4 fw-bold text-muted" style={{ width: "80px" }}>#{c.id || c.Id}</td>
                                        <td>
                                            <span className="fw-bold text-dark">{c.name || c.Name}</span>
                                        </td>
                                        <td className="text-end pe-4">
                                            <button 
                                                onClick={() => handleDelete(c.id || c.Id)} 
                                                className="btn btn-outline-danger btn-sm rounded-circle p-2 border-0 bg-light"
                                                title="Apagar"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
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

      </div>
    </div>
  );
}