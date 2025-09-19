import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Articles from "./pages/Articles"
import ArticleDetails from "./pages/ArticleDetails"
import Cart from "./pages/Cart"
import Artisans from "./pages/Artisans"
import Admin from "./pages/Admin"
import { ProtectedRoute } from "./components/protected-route"
//import { AdminProtectedRoute, UnauthorizedPage } from "./pages/AdminProtectedRoute"
import { Toaster } from "sonner"
import ArtisanDashboard from "./pages/ArtisanDashboard"
import Profile from "./pages/Profile"
import Checkout from "./pages/Checkout"
import UserPage from './pages/AdminPanelPages/UserPage'
import ArticlePage from './pages/AdminPanelPages/ArticlePage'
import ReviewPage from './pages/AdminPanelPages/ReviewPage'
import CategoryPage from './pages/AdminPanelPages/CategoryPage'
import OrderPage from './pages/AdminPanelPages/OrderPage'
import ArtisanDetails from "./pages/ArtisanDetails"
import NotFound from "./pages/NotFound"

function App() {
  return (
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
        <Route path="/admin" element={<Admin />}>
        <Route index element={<UserPage />} />
        <Route path="/admin/users" element={<UserPage />} />
        <Route path="/admin/categories" element={<CategoryPage />} />
        <Route path="/admin/orders" element={<OrderPage />} />
        <Route path="/admin/articles" element={<ArticlePage />} />
        <Route path="/admin/reviews" element={<ReviewPage />} />
        </Route>
        <Route
          path="/register"
          element={
            <ProtectedRoute requireAuth={false} redirectTo="/">
              <Register />
            </ProtectedRoute>
          }
        />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetails />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute requireAuth={true} redirectTo="/login">
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/artisans/:id" element={<ArtisanDetails />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAuth={true} requireRole="ARTISAN" redirectTo="/login">
              <ArtisanDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
    </BrowserRouter>
  )
}

export default App
