import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Minha Loja</Link>

      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navContent">
        <ul className="navbar-nav me-auto">
          {user && (
            <>
                <li className="nav-item">
                <Link className="nav-link" to="/products">Produtos</Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/cart">Carrinho 🛒</Link>
                </li>
            </>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          {!user ? (
            <>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/register">Registar</Link></li>
            </>
          ) : (
            <li className="nav-item">
              <button onClick={logout} className="btn btn-danger btn-sm">Sair</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}