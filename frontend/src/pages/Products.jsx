import { useEffect, useState } from "react";
import api from "../api/http";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await api.get("/products");
      setProducts(res.data);
    }
    load();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Produtos</h2>

      <div className="row">
        {products.map((p) => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">
                  {p.description}<br />
                  <strong>{p.price}€</strong><br />
                  <small className="text-muted">
                    Categoria: {p.categoryName}
                  </small>
                </p>
                <button className="btn btn-primary btn-sm">Ver mais</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
