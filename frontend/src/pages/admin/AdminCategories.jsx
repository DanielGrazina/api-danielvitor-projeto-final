import { useEffect, useState } from "react";
import api from "../../api/http";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // nº de categorias por página

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await api.get("/Categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await api.post("/Categories", { name: newCategory });
      setNewCategory("");
      loadCategories(); // Recarrega a lista
      alert("Categoria criada!");
    } catch (err) {
      alert("Erro ao criar categoria.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem a certeza?")) return;
    try {
      await api.delete(`/Categories/${id}`);
      loadCategories();
    } catch (err) {
      // Mostra o erro 400 se tiver produtos associados
      alert(err.response?.data || "Erro ao apagar.");
    }
  }

  // Filtrar categorias por nome OU ID
  const filteredCategories = categories.filter((c) => {
    const term = searchTerm.toLowerCase();
    const name = (c.name || c.Name || "").toLowerCase();
    const id = String(c.id || c.Id || "").toLowerCase();
    return name.includes(term) || id.includes(term);
  });

  // quando mudar o termo de pesquisa, volta para a primeira página
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // paginação em cima das filtradas
  const totalPages =
    filteredCategories.length === 0
      ? 1
      : Math.ceil(filteredCategories.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedCategories = filteredCategories.slice(
    startIndex,
    startIndex + pageSize
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h2>Gestão de Categorias</h2>

      {/* Formulário de Criação Rápida */}
      <div className="card p-3 mb-3 shadow-sm">
        <form onSubmit={handleAdd} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Nome da nova categoria"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button type="submit" className="btn btn-success">
            Adicionar
          </button>
        </form>
      </div>

      {/* Barra de pesquisa */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar por nome ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th style={{ width: "100px" }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategories.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                Nenhuma categoria encontrada.
              </td>
            </tr>
          ) : (
            paginatedCategories.map((c) => (
              <tr key={c.id || c.Id}>
                <td>{c.id || c.Id}</td>
                <td>{c.name || c.Name}</td>
                <td>
                  <button
                    onClick={() => handleDelete(c.id || c.Id)}
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
      {filteredCategories.length > pageSize && (
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
