import api from "../api/http";

export default function ProductCard({ data }) {
    
    async function addToCart() {
        const productId = data.id || data.Id;

        console.log("A tentar adicionar produto:", productId);

        if (!productId) {
            alert("Erro: ID do produto inválido.");
            return;
        }

        try {
            await api.post(`Cart/add?productId=${productId}&quantity=1`);
            alert("Produto adicionado com sucesso!");
        } catch (error) {
            console.error(error);
            alert("Erro ao adicionar. Verifique a consola (F12).");
        }
    }

    return (
        <div className="card h-100 shadow-sm">
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{data.name || data.Name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{data.categoryName || data.CategoryName}</h6>
                
                <p className="card-text flex-grow-1">
                    {data.description || data.Description}
                </p>
                
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <strong className="fs-5">{data.price || data.Price} €</strong>
                    <button 
                        onClick={addToCart} 
                        className="btn btn-primary btn-sm"
                    >
                        + Adicionar
                    </button>
                </div>
            </div>
        </div>
    );
}