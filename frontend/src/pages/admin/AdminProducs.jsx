import { useEffect, useState } from "react";
import api from "../../api/http";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // nº de produtos por página

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Erro ao carregar produtos", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem a certeza que quer apagar este produto?")) return;

    try {
      await api.delete(`/Products/${id}`);
      setProducts((prev) =>
        prev.filter((p) => p.id !== id && p.Id !== id)
      ); // Remove da lista visualmente
      alert("Produto apagado!");
    } catch (error) {
      console.error(error);
      alert("Erro ao apagar. Verifique se o produto está em alguma encomenda.");
    }
  }

  // sempre que o termo de pesquisa mudar, volta para a página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return <div className="text-center mt-5">A carregar gestão...</div>;
  }

  // produtos filtrados por nome OU ID
  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();

    const name = (p.name || p.Name || "").toLowerCase();
    const id = String(p.id || p.Id || "").toLowerCase();

    return name.includes(term) || id.includes(term);
  });

  // paginação em cima dos filtrados
  const totalPages =
    filteredProducts.length === 0
      ? 1
      : Math.ceil(filteredProducts.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + pageSize
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestão de Produtos</h2>
        <Link to="/admin/products/new" className="btn btn-success">
          + Novo Produto
        </Link>
      </div>

      {/* Barra de pesquisa */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Pesquisar por nome ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="table table-bordered table-hover shadow-sm bg-white">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Stock</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                Nenhum produto encontrado.
              </td>
            </tr>
          ) : (
            paginatedProducts.map((p) => (
              <tr key={p.id || p.Id}>
                <td>{p.id || p.Id}</td>
                <td>{p.name || p.Name}</td>
                <td>{p.price || p.Price} €</td>
                <td>{p.stock || p.Stock}</td>
                <td>{p.categoryName || p.CategoryName}</td>
                <td>
                  <Link
                    to={`/admin/products/edit/${p.id || p.Id}`}
                    className="btn btn-primary btn-sm me-2"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id || p.Id)}
                    className="btn btn-danger btn-sm"
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginação */}
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
                <button className="page-link" onClick={() => goToPage(page)}>
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
