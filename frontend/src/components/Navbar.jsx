import { Link } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Minha Loja</Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">

        <ul className="navbar-nav me-auto">
          {token && (
            <li className="nav-item">
              <Link className="nav-link" to="/products">Produtos</Link>
            </li>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          {!token ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Registar</Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <button onClick={logout} className="btn btn-danger btn-sm">
                Sair
              </button>
            </li>
          )}
        </ul>

      </div>
    </nav>
  );
}
