import { useState } from "react";
import api from "../api/http";

export default function ProductCard({ data }) {
    const [quantity, setQuantity] = useState(1);
    
    async function addToCart() {
        const productId = data.id || data.Id;
        try {
            await api.post(`Cart/add?productId=${productId}&quantity=${quantity}`);
            alert(`Adicionado ${quantity}x ${data.name || data.Name} ao carrinho!`);
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar. Verifique o login.");
        }
    }

    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{data.name || data.Name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{data.categoryName || data.CategoryName}</h6>
                <p className="card-text text-truncate">{data.description || data.Description}</p>
                <p className="small text-muted">Stock: {data.stock || data.Stock}</p> {/* Mostrar Stock */}
                
                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong className="fs-5">{data.price || data.Price} €</strong>
                        
                        {/* Seletor de Quantidade */}
                        <input 
                            type="number" 
                            min="1" 
                            max={data.stock || 100} // Impede selecionar mais que o stock
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="form-control form-control-sm"
                            style={{ width: "60px" }}
                        />
                    </div>
                    
                    <button onClick={addToCart} className="btn btn-primary btn-sm w-100">
                        + Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
}