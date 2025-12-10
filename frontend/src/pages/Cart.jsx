import { useEffect, useState } from "react";
import api from "../api/http";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  async function loadCart() {
    try {
      const res = await api.get("Cart");
      setCart(res.data);
    } catch (err) {
      console.warn("Carrinho vazio ou erro", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId) {
    try {
      await api.delete(`Cart/remove?productId=${productId}`);
      loadCart();
    } catch (err) {
      console.error(err);
      alert("Erro ao remover item");
    }
  }

  async function handleCheckout() {
    setIsProcessing(true);
    try {
      const res = await api.post("Checkout");
      alert(`Compra com Sucesso! ID: ${res.data.id}`);
      navigate("/products");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data || "Erro no checkout";
      alert(msg);
    } finally {
      setIsProcessing(false);
    }
  }

  if (loading) return <div className="text-center mt-5">A carregar...</div>;
  if (!cart || !cart.items || cart.items.length === 0) 
    return <div className="container mt-5"><h3>O carrinho está vazio 🛒</h3></div>;

  const total = cart.items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="container mt-4">
      <h2>O meu Carrinho</h2>
      <table className="table table-hover mt-3">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd</th>
            <th>Preço</th>
            <th>Subtotal</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.id}>
              <td>{item.product.name}</td>
              <td>{item.quantity}</td>
              <td>{item.product.price} €</td>
              <td>{(item.product.price * item.quantity).toFixed(2)} €</td>
              <td>
                <button onClick={() => removeItem(item.productId)} className="btn btn-danger btn-sm">
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="d-flex justify-content-between align-items-center border-top pt-3">
        <h3>Total: {total.toFixed(2)} €</h3>
        <button 
          onClick={handleCheckout} 
          className="btn btn-primary btn-lg"
          disabled={isProcessing}>
          {isProcessing ? "A Processar..." : "Finalizar Compra"}
        </button>
      </div>
    </div>
  );
}