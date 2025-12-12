import { Link } from "react-router-dom";
import { FaShippingFast, FaShieldAlt, FaHeadset, FaUndo, FaArrowRight } from "react-icons/fa";

export default function Home() {
  return (
    <div className="d-flex flex-column w-100">
      
      {/* HERO SECTION AZUL ESCURO */}
      <div 
        className="d-flex align-items-center position-relative text-white"
        style={{
            minHeight: "85vh",
            background: `linear-gradient(135deg, rgba(23, 37, 84, 0.95) 0%, rgba(30, 58, 138, 0.9) 100%), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
        }}
      >
        <div className="container position-relative z-1 text-center text-md-start">
            <div className="row align-items-center">
                <div className="col-lg-7 fade-in">
                    <span className="badge bg-white text-dark mb-3 px-3 py-2 rounded-pill fw-bold shadow-sm" style={{ color: "#1e3a8a" }}>
                        🚀 Nova Coleção 2024
                    </span>
                    <h1 className="display-3 fw-bold mb-4" style={{ letterSpacing: "-1px" }}>
                        Qualidade Profissional <br/>
                        <span style={{ color: "#60a5fa" }}>Ao Seu Alcance.</span> {/* Azul Claro */}
                    </h1>
                    <p className="lead mb-5 opacity-75" style={{ maxWidth: "600px" }}>
                        Plataforma líder em e-commerce. Produtos certificados, envios rápidos e garantia de satisfação total.
                    </p>
                    
                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-md-start">
                        <Link to="/products" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2 transform-hover" style={{ background: "#2563eb", border: "none" }}>
                            Ver Catálogo <FaArrowRight />
                        </Link>
                        <Link to="/register" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold transform-hover">
                            Criar Conta
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* BARRA ESTATÍSTICAS */}
      <div className="bg-white py-5 border-bottom">
        <div className="container">
            <div className="row g-4 text-center">
                <div className="col-6 col-md-3">
                    <h3 className="fw-bold text-dark mb-0 counter">5k+</h3>
                    <small className="text-muted text-uppercase fw-bold">Clientes</small>
                </div>
                <div className="col-6 col-md-3">
                    <h3 className="fw-bold text-dark mb-0">1.2k+</h3>
                    <small className="text-muted text-uppercase fw-bold">Produtos</small>
                </div>
                <div className="col-6 col-md-3">
                    <h3 className="fw-bold text-dark mb-0">24h</h3>
                    <small className="text-muted text-uppercase fw-bold">Envio</small>
                </div>
                <div className="col-6 col-md-3">
                    <h3 className="fw-bold text-dark mb-0">4.9</h3>
                    <small className="text-muted text-uppercase fw-bold">Rating</small>
                </div>
            </div>
        </div>
      </div>

      {/* BENEFÍCIOS */}
      <div className="container py-5 my-5">
        <div className="text-center mb-5">
            <h6 className="fw-bold text-uppercase ls-1" style={{ color: "#2563eb" }}>Diferenciais</h6>
            <h2 className="fw-bold text-dark">Porquê a StoreAPI?</h2>
        </div>

        <div className="row g-4">
            {/* Card 1 */}
            <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm p-4 text-center hover-lift" style={{ borderRadius: "12px" }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "70px", height: "70px", background: "#eff6ff", color: "#2563eb" }}>
                        <FaShippingFast size={30} />
                    </div>
                    <h5 className="fw-bold mb-3">Envio Expresso</h5>
                    <p className="text-muted small mb-0">Logística otimizada para entregas em 24h.</p>
                </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm p-4 text-center hover-lift" style={{ borderRadius: "12px" }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "70px", height: "70px", background: "#eff6ff", color: "#2563eb" }}>
                        <FaShieldAlt size={30} />
                    </div>
                    <h5 className="fw-bold mb-3">Segurança Total</h5>
                    <p className="text-muted small mb-0">Certificados SSL e proteção de dados avançada.</p>
                </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm p-4 text-center hover-lift" style={{ borderRadius: "12px" }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "70px", height: "70px", background: "#eff6ff", color: "#2563eb" }}>
                        <FaHeadset size={30} />
                    </div>
                    <h5 className="fw-bold mb-3">Suporte Dedicado</h5>
                    <p className="text-muted small mb-0">Acompanhamento personalizado da sua encomenda.</p>
                </div>
            </div>

            {/* Card 4 */}
            <div className="col-md-6 col-lg-3">
                <div className="card h-100 border-0 shadow-sm p-4 text-center hover-lift" style={{ borderRadius: "12px" }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "70px", height: "70px", background: "#eff6ff", color: "#2563eb" }}>
                        <FaUndo size={30} />
                    </div>
                    <h5 className="fw-bold mb-3">Garantia 30 Dias</h5>
                    <p className="text-muted small mb-0">Devolução simplificada sem complicações.</p>
                </div>
            </div>
        </div>
      </div>

      <style>
        {`
            .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
            .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
            .transform-hover { transition: transform 0.2s; }
            .transform-hover:hover { transform: translateY(-3px); }
            .ls-1 { letter-spacing: 1px; }
        `}
      </style>
    </div>
  );
}