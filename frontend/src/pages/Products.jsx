import { useEffect, useState } from "react";
import api from "../api/http";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // nº de produtos por página

  const [selectedCategory, setSelectedCategory] = useState("all");

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

  // sempre que a lista de produtos mudar, volta para página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  // categorias únicas, extraídas dos produtos
  const categories = Array.from(
    new Set(
      products
        .map(
          (p) =>
            p.category ||
            p.Category ||
            p.categoryName ||
            p.CategoryName ||
            p.categoria ||
            p.Categoria
        )
        .filter(Boolean)
    )
  );

  // filtra produtos pela categoria selecionada
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => {
          const cat =
            p.category ||
            p.Category ||
            p.categoryName ||
            p.CategoryName ||
            p.categoria ||
            p.Categoria;
          return cat === selectedCategory;
        });

  // paginação em cima da lista filtrada
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // quando muda categoria, volta para a primeira página
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">A carregar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Produtos</h2>

      {/* Filtro de categoria */}
      <div className="mb-3 d-flex gap-2">
        <label className="form-label mb-0 me-2" htmlFor="categoryFilter">
          Categoria:
        </label>
        <select
          id="categoryFilter"
          className="form-select"
          style={{ maxWidth: "250px" }}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="all">Todas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        {currentProducts.length === 0 && (
          <p>Nenhum produto encontrado para esta categoria.</p>
        )}

        {currentProducts.map((p) => (
          <div className="col-md-4 mb-3" key={p.id || p.Id}>
            <ProductCard data={p} />
          </div>
        ))}
      </div>

      {filteredProducts.length > pageSize && (
        <nav aria-label="Navegação de página">
          <ul className="pagination justify-content-center mt-3">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => goToPage(currentPage - 1)}
              >
                Anterior
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li
                key={page}
                className={`page-item ${
                  currentPage === page ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => goToPage(currentPage + 1)}
              >
                Próximo
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
