import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/http";
import toast from "react-hot-toast";
import { FaSave, FaArrowLeft, FaBox, FaTag, FaAlignLeft, FaEuroSign, FaLayerGroup } from "react-icons/fa";

export default function ProductForm() {
    const [product, setProduct] = useState({ 
        name: "", 
        description: "", 
        price: "", // Inicializar vazio para evitar "0" no input
        stock: "", 
        categoryId: "" 
    });
    
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Carregar Categorias
    useEffect(() => {
        api.get("/Categories")
           .then(res => {
               setCategories(res.data);
               // Se for criação e houver categorias, seleciona a primeira por defeito
               if (!isEdit && res.data.length > 0) {
                   setProduct(prev => ({ ...prev, categoryId: res.data[0].id }));
               }
           })
           .catch(() => toast.error("Erro ao carregar categorias."));
    }, [isEdit]);

    // Carregar Produto (se for edição)
    useEffect(() => {
        if (isEdit) {
            setLoading(true);
            api.get(`/Products/${id}`)
               .then(res => {
                   const d = res.data;
                   setProduct({ 
                       id: d.id || d.Id, 
                       name: d.name || d.Name, 
                       description: d.description || d.Description, 
                       price: d.price || d.Price, 
                       stock: d.stock || d.Stock, 
                       categoryId: d.categoryId || d.CategoryId 
                   });
               })
               .catch(() => {
                   toast.error("Erro ao carregar produto.");
                   navigate("/admin/products");
               })
               .finally(() => setLoading(false));
        }
    }, [id, isEdit, navigate]);

    function handleChange(e) {
        setProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);

        const payload = { 
            ...product, 
            id: isEdit ? parseInt(id) : 0, 
            price: parseFloat(product.price), 
            stock: parseInt(product.stock), 
            categoryId: parseInt(product.categoryId) 
        };

        try {
            if (isEdit) {
                await api.put(`/Products/${id}`, payload);
                toast.success("Produto atualizado com sucesso!");
            } else {
                await api.post("/Products", payload);
                toast.success("Produto criado com sucesso!");
            }
            navigate("/admin/products");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao guardar. Verifique os dados.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-50 py-5">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-7">
                    
                    {/* Header do Cartão */}
                    <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: "16px" }}>
                        <div className="card-header border-0 py-4 px-5 text-white d-flex justify-content-between align-items-center" 
                             style={{ background: "#1e3a8a" }}>
                            <div>
                                <h4 className="mb-1 fw-bold">{isEdit ? "Editar Produto" : "Novo Produto"}</h4>
                                <p className="mb-0 opacity-75 small text-white">Preencha os detalhes do item abaixo</p>
                            </div>
                            <FaBox size={24} className="opacity-50" />
                        </div>

                        <div className="card-body p-5">
                            <form onSubmit={handleSubmit}>
                                
                                {/* Nome */}
                                <div className="mb-4">
                                    <label className="form-label text-muted small fw-bold text-uppercase">Nome do Produto</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0 ps-3 text-muted"><FaBox /></span>
                                        <input 
                                            name="name" 
                                            className="form-control bg-light border-0 py-2" 
                                            value={product.name} 
                                            onChange={handleChange} 
                                            required 
                                            placeholder="Ex: Portátil Gaming" 
                                        />
                                    </div>
                                </div>

                                {/* Descrição */}
                                <div className="mb-4">
                                    <label className="form-label text-muted small fw-bold text-uppercase">Descrição</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0 ps-3 text-muted"><FaAlignLeft /></span>
                                        <textarea 
                                            name="description" 
                                            className="form-control bg-light border-0 py-2" 
                                            rows="3" 
                                            value={product.description} 
                                            onChange={handleChange} 
                                            placeholder="Detalhes técnicos e características..."
                                        />
                                    </div>
                                </div>

                                <div className="row g-4 mb-4">
                                    {/* Preço */}
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold text-uppercase">Preço (€)</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-0 ps-3 text-muted"><FaEuroSign /></span>
                                            <input 
                                                type="number" 
                                                step="0.01" 
                                                name="price" 
                                                className="form-control bg-light border-0 py-2 fw-bold text-dark" 
                                                value={product.price} 
                                                onChange={handleChange} 
                                                required 
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Stock */}
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold text-uppercase">Stock (Unidades)</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-0 ps-3 text-muted"><FaLayerGroup /></span>
                                            <input 
                                                type="number" 
                                                name="stock" 
                                                className="form-control bg-light border-0 py-2" 
                                                value={product.stock} 
                                                onChange={handleChange} 
                                                required 
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Categoria */}
                                <div className="mb-5">
                                    <label className="form-label text-muted small fw-bold text-uppercase">Categoria</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-0 ps-3 text-muted"><FaTag /></span>
                                        <select 
                                            name="categoryId" 
                                            className="form-select bg-light border-0 py-2" 
                                            value={product.categoryId} 
                                            onChange={handleChange}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <option value="" disabled>Selecione uma categoria...</option>
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Botões de Ação */}
                                <div className="d-flex gap-3 pt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => navigate("/admin/products")} 
                                        className="btn btn-outline-secondary flex-grow-1 fw-bold py-2 rounded-3"
                                    >
                                        <FaArrowLeft className="me-2"/> Voltar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary flex-grow-1 fw-bold py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                                        disabled={saving}
                                        style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a" }}
                                    >
                                        {saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                A guardar...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave /> Guardar Produto
                                            </>
                                        )}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}