import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/products" element={
              <ProtectedRoute><Products /></ProtectedRoute>
          } />

          {/* Nova Rota */}
          <Route path="/cart" element={
              <ProtectedRoute><Cart /></ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/products" />} />
        </Routes>
      </div>
    </>
  );
}