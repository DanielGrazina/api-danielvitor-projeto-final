import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/http";

export default function ProductForm() {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        categoryId: 1 // Default: Tecnologia
    });

    const { id } = useParams(); // Pega o ID da URL (se existir)
    const navigate = useNavigate();
    const isEdit = !!id; // Boolean: true se for edição
    const [categories, setCategories] = useState([]);// Estado para categorias


    useEffect(() => {
        api.get("/Categories").then(res => setCategories(res.data));
    }, []);

    useEffect(() => {
        if (isEdit) {
            async function loadProduct() {
                try {
                    const res = await api.get(`/Products/${id}`);
                    // Ajusta os dados recebidos para o formato do form (case sensitive do C#)
                    const data = res.data;
                    setProduct({
                        id: data.id || data.Id,
                        name: data.name || data.Name,
                        description: data.description || data.Description,
                        price: data.price || data.Price,
                        stock: data.stock || data.Stock,
                        categoryId: data.categoryId || data.CategoryId
                    });
                } catch (error) {
                    alert("Erro ao carregar produto.");
                    navigate("/admin/products");
                }
            }
            loadProduct();
        }
    }, [id, isEdit, navigate]);

    function handleChange(e) {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            ...product,
            // Garantir que números vão como números e não strings
            id: product.id ? parseInt(product.id) : 0,
            price: parseFloat(product.price),
            stock: parseInt(product.stock),
            categoryId: parseInt(product.categoryId)
        };

        try {
            if (isEdit) {
                await api.put(`/Products/${id}`, payload);
                alert("Produto atualizado!");
            } else {
                await api.post("/Products", payload);
                alert("Produto criado!");
            }
            navigate("/admin/products");
        } catch (error) {
            console.error(error);
            alert("Erro ao guardar. Verifique os dados.");
        }
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <div className="card shadow p-4">
                <h3>{isEdit ? "Editar Produto" : "Novo Produto"}</h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nome</label>
                        <input name="name" className="form-control" value={product.name} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Descrição</label>
                        <textarea name="description" className="form-control" value={product.description} onChange={handleChange} />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Preço (€)</label>
                            <input type="number" step="0.01" name="price" className="form-control" value={product.price} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Stock</label>
                            <input type="number" name="stock" className="form-control" value={product.stock} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Categoria</label>
                        <select
                            name="categoryId"
                            className="form-select"
                            value={product.categoryId}
                            onChange={handleChange}
                        >
                            {/* Mapeamento Dinâmico */}
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                        {isEdit ? "Atualizar" : "Criar"}
                    </button>
                </form>
            </div>
        </div>
    );
}