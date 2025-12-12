import { useEffect, useState } from "react";
import api from "../api/http";
import ProductCard from "../components/ProductCard";
import { FaSearch, FaTimes, FaFilter, FaTh, FaList } from "react-icons/fa";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  
  const pageSize = 9;

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Reset paginação ao filtrar
  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

  // Extrair Categorias Únicas
  const uniqueCategories = [...new Set(products.map(p => p.categoryName || p.CategoryName || "Geral").filter(Boolean))];

  // Lógica de Filtragem
  const filteredProducts = products.filter((p) => {
    const cat = p.categoryName || p.CategoryName || "Geral";
    const matchCat = selectedCategory === "Todas" || cat === selectedCategory;
    
    const name = (p.name || p.Name || "").toLowerCase();
    const matchSearch = name.includes(searchTerm.toLowerCase());
    
    return matchCat && matchSearch;
  });

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const currentProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-50 py-5">
        <div className="spinner-border text-primary mb-3" style={{width: "3rem", height: "3rem"}} role="status"></div>
        <p className="text-muted fw-medium ls-1">A carregar catálogo...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      
      {/* Header da Secção */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-end mb-5 border-bottom pb-4">
        <div>
            <h6 className="text-primary fw-bold text-uppercase ls-1 mb-2">Loja Online</h6>
            <h2 className="fw-bold text-dark display-6 mb-0">Nossos Produtos</h2>
        </div>
        <div className="text-muted mt-2 mt-md-0">
            Mostrando <span className="fw-bold text-dark">{filteredProducts.length}</span> resultados
        </div>
      </div>

      {/* --- BARRA DE FILTROS (Estilo Antigo com Design Novo) --- */}
      <div className="card border-0 shadow-sm mb-5 sticky-top" style={{ top: "80px", borderRadius: "12px", zIndex: 90 }}>
        <div className="card-body p-4">
          <div className="row g-3 align-items-center">
            
            {/* 1. Barra de Pesquisa */}
            <div className="col-md-7">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 ps-3 text-muted"><FaSearch /></span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Pesquisar por nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ boxShadow: "none" }}
                />
                {searchTerm && (
                    <button className="btn btn-white border border-start-0 text-muted" onClick={() => setSearchTerm("")}>
                        <FaTimes />
                    </button>
                )}
              </div>
            </div>

            {/* 2. Dropdown de Categorias (O que pediu) */}
            <div className="col-md-3">
               <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 ps-3 text-muted"><FaFilter /></span>
                  <select 
                    className="form-select border-start-0"
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ boxShadow: "none", cursor: "pointer" }}
                  >
                    <option value="Todas">Todas as Categorias</option>
                    {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
               </div>
            </div>

            {/* 3. Botões de Visualização (Grid/List) */}
            <div className="col-md-2 text-md-end d-none d-md-block">
              <div className="btn-group" role="group">
                <button 
                    className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-light text-muted border'}`} 
                    onClick={() => setViewMode('grid')}
                >
                    <FaTh />
                </button>
                <button 
                    className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-light text-muted border'}`} 
                    onClick={() => setViewMode('list')}
                >
                    <FaList />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Grid de Produtos */}
      {currentProducts.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3 text-muted opacity-25" style={{ fontSize: "4rem" }}><FaFilter /></div>
          <h4 className="fw-bold text-muted">Nenhum produto encontrado</h4>
          <p className="text-muted">Tente limpar os filtros ou usar outros termos.</p>
          <button 
            className="btn btn-outline-primary rounded-pill mt-2"
            onClick={() => { setSearchTerm(""); setSelectedCategory("Todas"); }}
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "row g-4" : "d-flex flex-column gap-3"}>
          {currentProducts.map((p) => (
            <div 
                className={viewMode === 'grid' ? "col-12 col-sm-6 col-lg-4" : "col-12"} 
                key={p.id || p.Id}
            >
              <ProductCard data={p} viewMode={viewMode} />
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-5 pt-3">
            <nav>
                <ul className="pagination gap-1">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link rounded border-0" onClick={() => goToPage(currentPage - 1)}>Anterior</button>
                    </li>
                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button 
                                className="page-link rounded border-0 fw-bold" 
                                onClick={() => goToPage(i + 1)}
                                style={currentPage === i + 1 ? { backgroundColor: "#1e3a8a", borderColor: "#1e3a8a", color: "white" } : { color: "#1e3a8a" }}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link rounded border-0" onClick={() => goToPage(currentPage + 1)}>Próximo</button>
                    </li>
                </ul>
            </nav>
        </div>
      )}
    </div>
  );
}