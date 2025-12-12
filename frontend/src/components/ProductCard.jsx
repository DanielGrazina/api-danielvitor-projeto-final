import { useState } from "react";
import api from "../api/http";
import toast from "react-hot-toast";
import { FaCartPlus } from "react-icons/fa";

export default function ProductCard({ data, viewMode = "grid" }) {
    const [adding, setAdding] = useState(false);

    async function addToCart() {
        setAdding(true);
        try {
            const productId = data.id || data.Id;
            await api.post(`Cart/add?productId=${productId}&quantity=1`);
            toast.success(`${data.name || data.Name} adicionado!`);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao adicionar ao carrinho.");
        } finally {
            setAdding(false);
        }
    }

    const imageUrl = `https://picsum.photos/seed/${data.id || data.Id}/500/400`;

    // --- LIST VIEW ---
    if (viewMode === "list") {
        return (
            // Adicionei a classe 'card-hover-effect' aqui
            <div className="card border-0 shadow-sm p-3 card-hover-effect d-flex flex-row align-items-center gap-4" style={{ borderRadius: "12px" }}>
                <img src={imageUrl} alt={data.name} className="rounded-3" style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <span className="badge bg-light text-primary border mb-2">{data.categoryName || data.CategoryName || "Geral"}</span>
                            <h5 className="fw-bold mb-1 text-dark">{data.name || data.Name}</h5>
                            <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: "400px" }}>
                                {data.description || data.Description || "Sem descrição."}
                            </p>
                        </div>
                        <div className="text-end text-nowrap ms-3">
                            <h4 className="fw-bold text-primary mb-0">{(data.price || data.Price).toFixed(2)} €</h4>
                            <small className={ (data.stock || data.Stock) > 0 ? "text-success" : "text-danger" }>
                                {(data.stock || data.Stock) > 0 ? "Em Stock" : "Esgotado"}
                            </small>
                        </div>
                    </div>
                    <div className="mt-3 text-end">
                        <button 
                            onClick={addToCart} 
                            disabled={adding || (data.stock || data.Stock) <= 0}
                            className="btn btn-primary btn-sm px-4 rounded-pill fw-bold"
                        >
                            {adding ? "..." : <><FaCartPlus className="me-2"/> Adicionar</>}
                        </button>
                    </div>
                </div>
                {/* Estilos injetados no final do ficheiro */}
                <Styles />
            </div>
        );
    }

    // --- GRID VIEW (Padrão) ---
    return (
        // Adicionei a classe 'card-hover-effect' aqui
        <div className="card h-100 border-0 shadow-sm card-hover-effect overflow-hidden" style={{ borderRadius: "16px" }}>
            
            <div className="position-relative bg-light" style={{ paddingTop: "75%" }}>
                <img 
                    src={imageUrl} 
                    alt={data.name} 
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ objectFit: "cover" }}
                />
                <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-white text-dark shadow-sm fw-bold">
                        {data.categoryName || data.CategoryName || "Produto"}
                    </span>
                </div>
            </div>

            <div className="card-body d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold text-dark mb-0 text-truncate" title={data.name || data.Name}>
                        {data.name || data.Name}
                    </h5>
                </div>
                
                <p className="card-text text-muted small flex-grow-1" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {data.description || data.Description || "Descrição não disponível para este produto."}
                </p>

                <div className="d-flex align-items-end justify-content-between mt-3 pt-3 border-top">
                    <div>
                        <small className="text-muted text-uppercase d-block" style={{ fontSize: "0.7rem", fontWeight: "700" }}>Preço</small>
                        <span className="fs-5 fw-bold text-primary">{(data.price || data.Price).toFixed(2)} €</span>
                    </div>
                    
                    <button 
                        onClick={addToCart} 
                        disabled={adding || (data.stock || data.Stock) <= 0}
                        className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm"
                        style={{ width: "45px", height: "45px" }}
                        title="Adicionar ao Carrinho"
                    >
                        {adding ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                            <FaCartPlus size={18} />
                        )}
                    </button>
                </div>
            </div>
            
            <Styles />
        </div>
    );
}

// Componente de estilos isolado para não repetir código
function Styles() {
    return (
        <style>{`
            .card-hover-effect {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                backface-visibility: hidden; /* Evita tremores no zoom */
            }

            /* Efeito de Zoom no Card Inteiro */
            .card-hover-effect:hover {
                transform: scale(1.03); /* Aumenta 3% */
                box-shadow: 0 1rem 3rem rgba(0,0,0,0.15) !important; /* Sombra mais profunda */
                z-index: 10; /* Garante que fica por cima dos vizinhos */
            }
        `}</style>
    );
}