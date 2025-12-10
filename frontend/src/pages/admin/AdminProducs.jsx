import { useEffect, useState } from "react";
import api from "../../api/http";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setProducts(products.filter(p => p.id !== id && p.Id !== id)); // Remove da lista visualmente
      alert("Produto apagado!");
    } catch (error) {
      console.error(error);
      alert("Erro ao apagar. Verifique se o produto está em alguma encomenda.");
    }
  }

  if (loading) return <div className="text-center mt-5">A carregar gestão...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestão de Produtos</h2>
        <Link to="/admin/products/new" className="btn btn-success">
          + Novo Produto
        </Link>
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
          {products.map((p) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}