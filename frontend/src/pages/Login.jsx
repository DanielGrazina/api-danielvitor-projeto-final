import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaStore, FaSignInAlt, FaExclamationCircle } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("Auth/login", { email, password });
      
      if (response.data && response.data.token) {
        const sucesso = login(response.data.token);
        
        if (sucesso) {
          // REDIRECIONA AUTOMATICAMENTE PARA A HOME
          navigate("/"); 
        } else {
          setError("Erro ao guardar sessão.");
        }
      } else {
        setError("Token inválido recebido do servidor.");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Tratamento de erros seguro
      const msg = err.response?.data;
      setError(typeof msg === 'string' ? msg : "Credenciais inválidas.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="container-fluid min-vh-100 d-flex bg-white p-0">
      <div className="row g-0 w-100">
        
        {/* LADO ESQUERDO - Branding (Slate 900) */}
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center text-white position-relative overflow-hidden"
             style={{ backgroundColor: "#0f172a" }}>
          
          <div className="position-absolute rounded-circle" style={{ width: "400px", height: "400px", background: "radial-gradient(circle, rgba(79, 70, 229, 0.4) 0%, rgba(15, 23, 42, 0) 70%)", top: "-10%", left: "-10%" }}></div>
          <div className="position-absolute rounded-circle" style={{ width: "300px", height: "300px", background: "radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, rgba(15, 23, 42, 0) 70%)", bottom: "10%", right: "10%" }}></div>

          <div className="z-1 text-center px-5 fade-in">
            <div className="mb-4 d-flex justify-content-center align-items-center gap-2">
                <FaStore size={50} className="text-primary"/>
            </div>
            <h1 className="display-5 fw-bold mb-3">Bem-vindo à <span className="text-primary">StoreAPI</span></h1>
            <p className="lead opacity-75 mb-5" style={{ maxWidth: "500px" }}>
              A plataforma de e-commerce mais rápida e segura para gerir as suas compras.
            </p>
          </div>
        </div>

        {/* LADO DIREITO - Formulário */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 p-5 fade-in" style={{ maxWidth: "550px" }}>
            
            <div className="text-center mb-5 d-lg-none">
               <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                  <FaStore size={32} className="text-primary"/>
                  <span className="h3 fw-bold mb-0 text-dark">Store<span className="text-primary">API</span></span>
               </div>
            </div>

            <div className="mb-5">
              <h2 className="fw-bold text-dark mb-2">Aceder à conta</h2>
              <p className="text-muted">Bem-vindo de volta! Por favor, insira os seus dados.</p>
            </div>

            {error && (
              <div className="alert alert-danger d-flex align-items-center border-0 shadow-sm mb-4" role="alert" style={{ fontSize: "0.9rem" }}>
                  <FaExclamationCircle className="me-2 text-danger" size={18} />
                  <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div className="mb-4">
                <label className="form-label text-secondary fw-semibold small text-uppercase" style={{ fontSize: "0.75rem" }}>Email</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light border-0 ps-3 text-secondary"><FaEnvelope /></span>
                  <input 
                      type="email" 
                      className="form-control bg-light border-0 fs-6 text-dark" 
                      placeholder="exemplo@email.com"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      style={{ boxShadow: "none" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <label className="form-label text-secondary fw-semibold small text-uppercase" style={{ fontSize: "0.75rem" }}>Password</label>
                  <a href="#" className="text-decoration-none small text-primary fw-semibold">Esqueceu-se da senha?</a>
                </div>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light border-0 ps-3 text-secondary"><FaLock /></span>
                  <input 
                      type={showPassword ? "text" : "password"}
                      className="form-control bg-light border-0 fs-6 text-dark" 
                      placeholder="••••••••"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      style={{ boxShadow: "none" }}
                  />
                  <button 
                    className="btn btn-light border-0 text-secondary"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Botão Login */}
              <button 
                type="submit" 
                className="btn btn-primary w-100 py-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 mb-4"
                disabled={loading}
                style={{ borderRadius: "8px" }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    A autenticar...
                  </>
                ) : (
                  <>
                    <FaSignInAlt /> Entrar
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-muted small">
                  Ainda não tem conta? <Link to="/register" className="fw-bold text-primary text-decoration-none">Registar Grátis</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}