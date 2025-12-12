import { useEffect, useState } from "react";
import api from "../api/http";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { 
    FaTrash, 
    FaShoppingCart, 
    FaArrowLeft, 
    FaLock, 
    FaCreditCard, 
    FaCcVisa, 
    FaCcMastercard, 
    FaShieldAlt 
} from "react-icons/fa";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const res = await api.get("Cart");
      setCart(res.data);
    } catch (err) {
      console.error(err);
      // Se der erro 404 ou null, assumimos carrinho vazio
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId) {
    try {
      await api.delete(`Cart/remove?productId=${productId}`);
      await loadCart(); // Recarrega para atualizar totais
      toast.success("Produto removido.");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao remover item.");
    }
  }

  async function handleCheckout() {
    setIsProcessing(true);
    try {
      const res = await api.post("Checkout");
      toast.success(`Encomenda #${res.data.id} confirmada!`, { duration: 5000 });
      navigate("/profile"); // Redireciona para o histórico
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || "Erro ao finalizar compra.";
      toast.error(typeof msg === "string" ? msg : "Erro no checkout.");
    } finally {
      setIsProcessing(false);
    }
  }

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-50 py-5">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted fw-medium">A carregar o carrinho...</p>
      </div>
    );
  }

  // ESTADO VAZIO
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div className="d-inline-flex align-items-center justify-content-center bg-light rounded-circle mb-4" style={{ width: "120px", height: "120px" }}>
            <FaShoppingCart size={50} className="text-muted opacity-50" />
        </div>
        <h2 className="fw-bold text-dark mb-3">O seu carrinho está vazio</h2>
        <p className="text-muted mb-4" style={{ maxWidth: "500px", margin: "0 auto" }}>
            Parece que ainda não adicionou nada. Explore a nossa coleção e encontre as melhores ofertas de tecnologia e moda.
        </p>
        <Link to="/products" className="btn btn-primary btn-lg px-5 rounded-pill fw-bold shadow-sm" style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a" }}>
            Começar a Comprar
        </Link>
      </div>
    );
  }

  const total = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0 me-3">Meu Carrinho</h2>
        <span className="badge bg-light text-primary border rounded-pill px-3">
            {cart.items.length} {cart.items.length === 1 ? "item" : "itens"}
        </span>
      </div>

      <div className="row g-4">
        
        {/* --- LISTA DE PRODUTOS (Esquerda) --- */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "12px" }}>
            <div className="card-body p-0">
                {cart.items.map((item, index) => (
                    <div 
                        key={item.id} 
                        className={`p-4 d-flex flex-column flex-sm-row align-items-center gap-4 ${index !== cart.items.length - 1 ? "border-bottom" : ""}`}
                    >
                        {/* Imagem */}
                        <div className="flex-shrink-0">
                            <img 
                                src={`https://picsum.photos/seed/${item.productId}/200/200`} 
                                alt={item.product.name} 
                                className="rounded border"
                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                            />
                        </div>

                        {/* Detalhes */}
                        <div className="flex-grow-1 text-center text-sm-start">
                            <h5 className="fw-bold text-dark mb-1">{item.product.name}</h5>
                            <p className="text-muted small mb-2 text-truncate" style={{ maxWidth: "300px" }}>
                                {item.product.description || "Produto de alta qualidade StoreAPI."}
                            </p>
                            <div className="d-inline-block bg-light rounded px-2 py-1 border small text-muted">
                                {item.product.price.toFixed(2)} € / un
                            </div>
                        </div>

                        {/* Quantidade e Total */}
                        <div className="text-center text-sm-end">
                            <div className="mb-2">
                                <span className="small text-muted text-uppercase fw-bold">Qtd</span>
                                <div className="fw-bold fs-5">{item.quantity}</div>
                            </div>
                        </div>

                        {/* Preço Total Item */}
                        <div className="text-center text-sm-end" style={{ minWidth: "100px" }}>
                            <div className="fw-bold text-primary fs-5 mb-2">
                                {(item.product.price * item.quantity).toFixed(2)} €
                            </div>
                            <button 
                                onClick={() => removeItem(item.productId)}
                                className="btn btn-link text-danger p-0 text-decoration-none small d-flex align-items-center justify-content-center justify-content-sm-end gap-1"
                            >
                                <FaTrash size={12} /> Remover
                            </button>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          <div className="mt-4">
            <Link to="/products" className="btn btn-outline-secondary rounded-pill px-4 fw-medium">
                <FaArrowLeft className="me-2" /> Continuar a Comprar
            </Link>
          </div>
        </div>

        {/* --- RESUMO DO PEDIDO (Direita Sticky) --- */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: "100px", borderRadius: "12px" }}>
            <div className="card-header bg-white border-bottom p-4">
                <h5 className="fw-bold mb-0">Resumo do Pedido</h5>
            </div>
            <div className="card-body p-4">
                <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-medium">{total.toFixed(2)} €</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted">Envio</span>
                    <span className="text-success fw-medium">Grátis</span>
                </div>
                
                <hr className="my-3 opacity-10" />
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fs-5 fw-bold text-dark">Total</span>
                    <span className="fs-4 fw-bold text-primary" style={{ color: "#1e3a8a" }}>{total.toFixed(2)} €</span>
                </div>

                <button 
                    onClick={handleCheckout} 
                    disabled={isProcessing}
                    className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
                    style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a" }}
                >
                    {isProcessing ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            A Processar...
                        </>
                    ) : (
                        <>
                            <FaLock size={14} /> Finalizar Compra
                        </>
                    )}
                </button>

                <div className="mt-4 text-center">
                    <div className="d-flex justify-content-center gap-3 text-muted opacity-50 mb-2">
                        <FaCcVisa size={24} />
                        <FaCcMastercard size={24} />
                        <FaCreditCard size={24} />
                    </div>
                    <small className="text-muted d-flex align-items-center justify-content-center gap-1">
                        <FaShieldAlt className="text-success" /> Pagamento 100% Seguro
                    </small>
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}