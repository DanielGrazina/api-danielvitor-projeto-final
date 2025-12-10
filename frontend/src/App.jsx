import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import AdminProducts from "./pages/admin/AdminProducs";
import ProductForm from "./pages/admin/ProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import ManagerUsers from "./pages/admin/ManagerUsers";

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/admin/products" element={
              <ProtectedRoute adminOnly={true}><AdminProducts /></ProtectedRoute>
          } />

          <Route path="/admin/products/new" element={
              <ProtectedRoute adminOnly={true}><ProductForm /></ProtectedRoute>
          } />

          <Route path="/admin/products/edit/:id" element={
              <ProtectedRoute adminOnly={true}><ProductForm /></ProtectedRoute>
          } />

          <Route path="/admin/categories" element={
              <ProtectedRoute adminOnly={true}><AdminCategories /></ProtectedRoute>
          } />

          <Route path="/admin/users" element={
              <ProtectedRoute><ManagerUsers /></ProtectedRoute>
          } />
          
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