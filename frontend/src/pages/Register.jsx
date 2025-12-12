import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/http";
import toast from "react-hot-toast"; // Notificações bonitas
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaTruck, 
  FaStar, 
  FaShieldAlt,
  FaCheckCircle 
} from "react-icons/fa";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();

  // Validação Local antes de enviar à API
  function validateForm() {
    const newErrors = {};
    if (name.trim().length < 3) newErrors.name = "O nome deve ter pelo menos 3 caracteres.";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Insira um email válido.";
    if (password.length < 6) newErrors.password = "Mínimo de 6 caracteres.";
    if (password !== confirmPassword) newErrors.confirmPassword = "As passwords não coincidem.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Cor da barra de força da password
  const getStrengthColor = () => {
    if (password.length === 0) return "bg-light";
    if (password.length < 6) return "bg-danger";
    if (password.length < 10) return "bg-warning";
    return "bg-success";
  };

  async function handleRegister(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post("Users", {
        name: name.trim(),
        email: email.trim(),
        password,
        role: "Customer"
      });

      toast.success("Conta criada com sucesso! Faça login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data || "Erro ao criar conta.";
      toast.error(typeof msg === 'string' ? msg : "Erro desconhecido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid min-vh-100 d-flex bg-white p-0">
      <div className="row g-0 w-100">
        
        {/* LADO ESQUERDO - Branding & Benefícios (Fundo Escuro Profissional) */}
        <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-center text-white p-5 position-relative overflow-hidden" 
             style={{ backgroundColor: "#0f172a" }}>
          
          {/* Decoração de fundo sutil */}
          <div className="position-absolute rounded-circle" style={{ width: "600px", height: "600px", background: "radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(15, 23, 42, 0) 70%)", top: "-10%", left: "-10%" }}></div>

          <div className="z-1 px-xl-5 fade-in">
            <h1 className="display-5 fw-bold mb-4">Junte-se à <span className="text-primary">StoreAPI</span></h1>
            <p className="lead opacity-75 mb-5">
              Crie a sua conta gratuita e comece a aproveitar vantagens exclusivas de membro.
            </p>
            
            <div className="d-flex flex-column gap-4">
              {/* Benefício 1 */}
              <div className="d-flex align-items-center">
                <div className="rounded-3 bg-white bg-opacity-10 p-3 me-3 text-primary shadow-sm">
                   <FaTruck size={20} />
                </div>
                <div>
                  <strong className="d-block fs-5">Envio Grátis</strong>
                  <span className="small opacity-75">Em compras acima de 50€</span>
                </div>
              </div>
              
              {/* Benefício 2 */}
              <div className="d-flex align-items-center">
                <div className="rounded-3 bg-white bg-opacity-10 p-3 me-3 text-primary shadow-sm">
                   <FaStar size={20} />
                </div>
                <div>
                  <strong className="d-block fs-5">Ofertas Exclusivas</strong>
                  <span className="small opacity-75">Acesso antecipado a promoções</span>
                </div>
              </div>

              {/* Benefício 3 */}
              <div className="d-flex align-items-center">
                 <div className="rounded-3 bg-white bg-opacity-10 p-3 me-3 text-primary shadow-sm">
                   <FaShieldAlt size={20} />
                </div>
                <div>
                  <strong className="d-block fs-5">Compra Segura</strong>
                  <span className="small opacity-75">Proteção total dos seus dados</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO - Formulário */}
        <div className="col-lg-7 d-flex align-items-center justify-content-center bg-white">
          <div className="w-100 p-5 fade-in" style={{ maxWidth: "600px" }}>
            
            <div className="text-center mb-4">
              <h2 className="fw-bold text-dark mb-1">Criar Conta</h2>
              <p className="text-muted">Preencha os dados abaixo para começar</p>
            </div>

            <form onSubmit={handleRegister}>
              
              {/* Nome */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-bold small" style={{ fontSize: "0.75rem" }}>NOME COMPLETO</label>
                <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-0 ps-3 text-secondary"><FaUser /></span>
                    <input
                      type="text"
                      className={`form-control bg-light border-0 fs-6 ${errors.name ? 'is-invalid' : ''}`}
                      placeholder="O seu nome"
                      value={name}
                      onChange={(e) => { setName(e.target.value); setErrors({...errors, name: ''}); }}
                      style={{ boxShadow: "none" }}
                    />
                </div>
                {errors.name && <div className="text-danger small mt-1 ms-1">{errors.name}</div>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-bold small" style={{ fontSize: "0.75rem" }}>EMAIL</label>
                <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-0 ps-3 text-secondary"><FaEnvelope /></span>
                    <input
                      type="email"
                      className={`form-control bg-light border-0 fs-6 ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="exemplo@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: ''}); }}
                      style={{ boxShadow: "none" }}
                    />
                </div>
                {errors.email && <div className="text-danger small mt-1 ms-1">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label text-secondary fw-bold small" style={{ fontSize: "0.75rem" }}>PASSWORD</label>
                <div className="input-group input-group-lg">
                    <span className="input-group-text bg-light border-0 ps-3 text-secondary"><FaLock /></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control bg-light border-0 fs-6 ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: ''}); }}
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
                {errors.password && <div className="text-danger small mt-1 ms-1">{errors.password}</div>}
              </div>

              {/* Confirmar Password */}
              <div className="mb-4">
                <label className="form-label text-secondary fw-bold small" style={{ fontSize: "0.75rem" }}>CONFIRMAR PASSWORD</label>
                <div className="input-group input-group-lg">
                     <span className="input-group-text bg-light border-0 ps-3 text-secondary"><FaCheckCircle /></span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control bg-light border-0 fs-6 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Repita a password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setErrors({...errors, confirmPassword: ''}); }}
                      style={{ boxShadow: "none" }}
                    />
                </div>
                {errors.confirmPassword && <div className="text-danger small mt-1 ms-1">{errors.confirmPassword}</div>}
              </div>

              {/* Barra de Força da Senha */}
              {password && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-1">
                    <small className="text-muted" style={{fontSize: "0.75rem"}}>Força da senha</small>
                  </div>
                  <div className="progress" style={{ height: "4px", backgroundColor: "#e2e8f0" }}>
                    <div 
                      className={`progress-bar ${getStrengthColor()}`}
                      role="progressbar"
                      style={{ 
                        width: `${Math.min((password.length / 12) * 100, 100)}%`,
                        transition: 'width 0.3s ease-in-out, background-color 0.3s'
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Botão */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-3 fw-bold shadow-sm mb-4"
                disabled={loading}
                style={{ borderRadius: "8px" }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    A criar conta...
                  </>
                ) : "Criar Conta Gratuita"}
              </button>

              <div className="text-center">
                <p className="text-muted small">
                  Já tem uma conta?{" "}
                  <Link to="/login" className="text-primary fw-bold text-decoration-none">
                    Faça Login
                  </Link>
                </p>
              </div>

              <div className="text-center mt-4 pt-3 border-top">
                 <small className="text-muted opacity-75" style={{ fontSize: "0.8rem" }}>
                    Ao clicar em Registar, concorda com os nossos <a href="#" className="text-muted">Termos</a> e <a href="#" className="text-muted">Privacidade</a>.
                 </small>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}