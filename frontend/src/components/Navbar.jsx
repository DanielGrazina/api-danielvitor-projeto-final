import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { FaStore, FaShoppingCart, FaUserCircle, FaCog, FaSignOutAlt, FaBars, FaHome } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const isAdminOrManager = user?.role === 'Admin' || user?.role === 'Manager';
  const isActive = (path) => location.pathname === path;
  const handleNavCollapse = () => setIsNavCollapsed(true);

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark sticky-top"
      style={{ 
        // AZUL ESCURO PROFISSIONAL (Navy Blue)
        background: "#1e3a8a", 
        // Gradiente muito subtil para não ficar "chapado"
        backgroundImage: "linear-gradient(to right, #172554, #1e3a8a)",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        padding: "0.8rem 0"
      }}
    >
      <div className="container">
        
        {/* LOGO */}
        <Link 
          className="navbar-brand d-flex align-items-center fw-bold fs-4" 
          to="/" 
          onClick={handleNavCollapse}
        >
          <FaStore className="me-2 text-white" /> 
          <span className="text-white">Store</span>
          <span className="text-white opacity-75">API</span>
        </Link>

        {/* TOGGLE */}
        <button 
          className="navbar-toggler border-0 focus-ring" 
          type="button" 
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
        >
          <FaBars />
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navContent">
          
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
            {/* INÍCIO */}
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 d-flex align-items-center gap-2 ${isActive('/') ? 'active fw-bold' : ''}`} 
                to="/"
                onClick={handleNavCollapse}
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                <FaHome size={14} className="mb-1" /> Início
              </Link>
            </li>

            {/* LOJA */}
            <li className="nav-item">
              <Link 
                className={`nav-link px-3 ${isActive('/products') ? 'active fw-bold' : ''}`} 
                to="/products"
                onClick={handleNavCollapse}
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                Loja
              </Link>
            </li>

            {/* ADMIN */}
            {user && isAdminOrManager && (
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle px-3 text-warning" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  style={{ fontWeight: "500" }}
                >
                  <FaCog className="me-1 mb-1"/> Gestão
                </a>
                <ul className="dropdown-menu shadow-lg border-0 mt-2 rounded-3">
                  <li><h6 className="dropdown-header text-uppercase small fw-bold text-muted">Catálogo</h6></li>
                  <li><Link className="dropdown-item py-2" to="/admin/products" onClick={handleNavCollapse}>Produtos</Link></li>
                  <li><Link className="dropdown-item py-2" to="/admin/categories" onClick={handleNavCollapse}>Categorias</Link></li>
                  {user.role === 'Manager' && (
                    <>
                      <li><hr className="dropdown-divider"/></li>
                      <li><Link className="dropdown-item py-2 text-danger fw-medium" to="/admin/users" onClick={handleNavCollapse}>Utilizadores</Link></li>
                    </>
                  )}
                </ul>
              </li>
            )}
          </ul>

          {/* DIREITA */}
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-medium text-white" to="/login" onClick={handleNavCollapse}>Entrar</Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="btn btn-light btn-sm px-4 rounded-pill fw-bold shadow-sm" 
                    to="/register"
                    onClick={handleNavCollapse}
                    style={{ color: "#1e3a8a" }} // Texto do botão na cor da navbar
                  >
                    Registar
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link position-relative fs-5 ${isActive('/cart') ? 'active' : ''}`} to="/cart" onClick={handleNavCollapse} style={{ color: "white" }}>
                    <FaShoppingCart />
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown">
                    <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{width: 36, height: 36, fontSize: "0.9rem", color: "#1e3a8a"}}>
                      {user.name ? user.name[0].toUpperCase() : <FaUserCircle />}
                    </div>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-2 mt-2 rounded-3" style={{minWidth: "220px"}}>
                    <li className="px-3 py-2 border-bottom mb-2"><p className="mb-0 fw-bold text-dark">{user.name}</p></li>
                    <li><Link className="dropdown-item rounded py-2" to="/profile" onClick={handleNavCollapse}>Meu Perfil</Link></li>
                    <li><button onClick={() => { logout(); handleNavCollapse(); }} className="dropdown-item rounded py-2 text-danger fw-medium">Sair</button></li>
                  </ul>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}