import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <Routes>
          {/* Páginas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Página protegida */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />

          {/* Redireciona / para /products */}
          <Route path="/" element={<Navigate to="/products" />} />
        </Routes>
      </div>
    </>
  );
}
