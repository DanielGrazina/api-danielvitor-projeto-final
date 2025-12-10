import { useEffect, useState } from "react";
import api from "../../api/http";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

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

  return (
    <div className="container mt-4" style={{maxWidth: "800px"}}>
      <h2>Gestão de Categorias</h2>
      
      {/* Formulário de Criação Rápida */}
      <div className="card p-3 mb-4 shadow-sm">
        <form onSubmit={handleAdd} className="d-flex gap-2">
            <input 
                type="text" 
                className="form-control" 
                placeholder="Nome da nova categoria"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
            />
            <button type="submit" className="btn btn-success">Adicionar</button>
        </form>
      </div>

      {/* Lista */}
      <table className="table table-bordered">
        <thead className="table-light">
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th style={{width: "100px"}}>Ações</th>
            </tr>
        </thead>
        <tbody>
            {categories.map(c => (
                <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>
                        <button 
                            onClick={() => handleDelete(c.id)} 
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