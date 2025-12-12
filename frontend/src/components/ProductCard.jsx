import { useState } from "react";
import api from "../api/http";
import toast from "react-hot-toast";
import { FaCartPlus, FaMinus, FaPlus } from "react-icons/fa";

export default function ProductCard({ data, viewMode = "grid" }) {
    const [adding, setAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const stock = data.stock || data.Stock || 0;
    const productId = data.id || data.Id;
    const productName = data.name || data.Name;

    // --- Lógica de Quantidade ---
    const handleIncrement = () => {
        if (quantity < stock) {
            setQuantity(prev => prev + 1);
        } else {
            toast.error(`Apenas ${stock} unidades em stock.`);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    async function addToCart() {
        if (quantity > stock) {
            toast.error("Stock insuficiente.");
            return;
        }

        setAdding(true);
        try {
            await api.post(`Cart/add?productId=${productId}&quantity=${quantity}`);
            toast.success(`${quantity}x ${productName} adicionado!`);
            setQuantity(1); 
        } catch (error) {
            console.error(error);
            toast.error("Erro ao adicionar ao carrinho.");
        } finally {
            setAdding(false);
        }
    }

    const imageUrl = `https://picsum.photos/seed/${productId}/500/400`;

    const QuantitySelector = ({ size = "sm" }) => (
        <div className={`input-group input-group-${size} me-2`} style={{ width: "110px" }}>
            <button 
                className="btn btn-outline-secondary" 
                type="button" 
                onClick={handleDecrement}
                disabled={quantity <= 1 || adding || stock === 0}
            >
                <FaMinus size={10} />
            </button>
            <input 
                type="text" 
                className="form-control text-center bg-white" 
                value={stock > 0 ? quantity : 0} 
                readOnly 
                style={{ padding: "0" }}
            />
            <button 
                className="btn btn-outline-secondary" 
                type="button" 
                onClick={handleIncrement}
                disabled={quantity >= stock || adding || stock === 0}
            >
                <FaPlus size={10} />
            </button>
        </div>
    );

    // --- LIST VIEW ---
    if (viewMode === "list") {
        return (
            <div className="card border-0 shadow-sm p-3 card-hover-effect d-flex flex-row align-items-center gap-4" style={{ borderRadius: "12px" }}>
                <img src={imageUrl} alt={productName} className="rounded-3" style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <span className="badge bg-light text-primary border mb-2">{data.categoryName || data.CategoryName || "Geral"}</span>
                            <h5 className="fw-bold mb-1 text-dark">{productName}</h5>
                            <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: "400px" }}>
                                {data.description || data.Description || "Sem descrição."}
                            </p>
                        </div>
                        <div className="text-end text-nowrap ms-3">
                            <h4 className="fw-bold text-primary mb-0">{(data.price || data.Price).toFixed(2)} €</h4>
                            <small className={ stock > 0 ? "text-success" : "text-danger" }>
                                {stock > 0 ? `Em Stock (${stock})` : "Esgotado"}
                            </small>
                        </div>
                    </div>
                    <div className="mt-3 d-flex justify-content-end align-items-center">
                        {/* Seletor de Quantidade na Lista */}
                        {stock > 0 && <QuantitySelector size="sm" />}
                        
                        <button 
                            onClick={addToCart} 
                            disabled={adding || stock <= 0}
                            className="btn btn-primary btn-sm px-4 rounded-pill fw-bold"
                        >
                            {adding ? "..." : <><FaCartPlus className="me-2"/> Adicionar</>}
                        </button>
                    </div>
                </div>
                <Styles />
            </div>
        );
    }

    // --- GRID VIEW (Padrão) ---
    return (
        <div className="card h-100 border-0 shadow-sm card-hover-effect overflow-hidden" style={{ borderRadius: "16px" }}>
            
            <div className="position-relative bg-light" style={{ paddingTop: "75%" }}>
                <img 
                    src={imageUrl} 
                    alt={productName} 
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
                    <h5 className="card-title fw-bold text-dark mb-0 text-truncate" title={productName}>
                        {productName}
                    </h5>
                </div>
                
                <p className="card-text text-muted small flex-grow-1" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {data.description || data.Description || "Descrição não disponível para este produto."}
                </p>

                {/* Preço e Status */}
                <div className="d-flex justify-content-between align-items-end mt-2">
                    <div>
                         <small className="text-muted text-uppercase d-block" style={{ fontSize: "0.7rem", fontWeight: "700" }}>Preço</small>
                         <span className="fs-5 fw-bold text-primary">{(data.price || data.Price).toFixed(2)} €</span>
                    </div>
                    <small className={stock > 0 ? "text-success fw-bold" : "text-danger fw-bold"} style={{fontSize: "0.8rem"}}>
                        {stock > 0 ? "Em Stock" : "Esgotado"}
                    </small>
                </div>

                {/* Área de Ação: Quantidade + Botão */}
                <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                    {stock > 0 ? (
                        <QuantitySelector size="sm" />
                    ) : (
                        <div className="text-muted small">Indisponível</div>
                    )}
                    
                    <button 
                        onClick={addToCart} 
                        disabled={adding || stock <= 0}
                        className="btn btn-outline-primary rounded-circle d-flex align-items-center justify-content-center p-0 shadow-sm"
                        style={{ width: "40px", height: "40px", flexShrink: 0 }}
                        title="Adicionar ao Carrinho"
                    >
                        {adding ? (
                            <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                            <FaCartPlus size={16} />
                        )}
                    </button>
                </div>
            </div>
            
            <Styles />
        </div>
    );
}

function Styles() {
    return (
        <style>{`
            .card-hover-effect {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                backface-visibility: hidden;
            }
            .card-hover-effect:hover {
                transform: scale(1.02);
                box-shadow: 0 1rem 3rem rgba(0,0,0,0.15) !important;
                z-index: 10;
            }
            /* Remove as setas padrão do input number se quiser mudar de type text para number */
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button { 
                -webkit-appearance: none; 
                margin: 0; 
            }
        `}</style>
    );
}