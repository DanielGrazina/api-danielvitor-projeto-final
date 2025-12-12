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
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast"; 

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <Toaster position="top-center" reverseOrder={false} />

     
      <div className="flex-grow-1">
        <Routes>
          {/* ROTA PRINCIPAL: Mostra a Home Page */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas Protegidas */}
          <Route path="/products" element={
              <ProtectedRoute><Products /></ProtectedRoute>
          } />

          <Route path="/cart" element={
              <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          
          <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Admin Routes */}
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

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}