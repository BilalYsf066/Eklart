import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { CartProvider } from "@/contexts/CartContext"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Articles from "./pages/Articles"
import ArticleDetails from "./pages/ArticleDetails"
import Cart from "./pages/Cart"
import Artisans from "./pages/Artisans"
import Admin from "./pages/Admin"
import AdminLogin from "./pages/AdminLogin"
import { ProtectedRoute } from "./components/protected-route"
import { AdminProtectedRoute, UnauthorizedPage } from "./pages/AdminProtectedRoute"
import { Toaster } from "sonner"
import ArtisanDashboard from "./pages/ArtisanDashboard"
import ArtisanProfile from "./pages/ArtisanProfile"
import Profile from "./pages/Profile"

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/">
                <Login />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <Admin />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute requireAuth={false} redirectTo="/">
                <Register />
              </ProtectedRoute>
            }
          />
          <Route path="/articles" element={<Articles />} />
          <Route path="/article/:id" element={<ArticleDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/artisans" element={<Artisans />} />
          <Route path="/artisan/:id" element={<ArtisanProfile />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/dashboard" element={<ArtisanDashboard />} />
          <Route path="/profile" element={<Profile />} />
          {/* Ajoutez d'autres routes ici si nécessaire */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster 
              position="top-right" 
              expand={false} 
              richColors 
              closeButton
            />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
