import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ShoppingBasket, User, Menu, X, Bell } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'
import { useAuth } from '@/contexts/AuthContext'
import { usePermissions } from '@/hooks/use-permissions'
import { api } from '@/lib/api'
import { toast } from 'sonner'

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated, logout } = useAuth()
  const { isArtisan } = usePermissions()
  const { items: cartItems } = useCart()
  const [categories, setCategories] = useState<Array<{
      id: number
      name: string
      created_at: string
      admin: { name: string }
    }>>([])

    useEffect(() => {
      loadCategories()
    }, [])

    const loadCategories = async () => {
      try {
        const response = await api.get("/categories")
        setCategories(response.data)
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error)
        toast.error("Erreur lors du chargement des catégories")
      }
    }

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-2xl text-primary uppercase">Eklart</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/">Accueil</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/articles">Articles</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/artisans">Artisans</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Catégories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-4">
                    <li>
                      {categories.map((category) => (
                        <NavigationMenuLink key={category.id} asChild>
                          <Link to={`/articles?category=${encodeURIComponent(category.name)}`}>
                            <div className="font-medium">{category.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/cart" className="relative hover:text-primary">
            <ShoppingBasket size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {isAuthenticated && (
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative mt-2 rounded-full hover:bg-gray-100"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-foreground hover:text-primary active:text-primary" />
                {/* Uncomment to show notification count badge */}
                {/* <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span> */}
              </button>
              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xs shadow-lg ring-none z-50">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                      <button 
                        onClick={() => setIsNotificationOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="text-sm text-muted-foreground py-4 text-center">
                      Les notifications arrivent bientôt.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {isAuthenticated ? (
            <>
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative mt-1 rounded-full"
                  aria-label="User menu"
                >
                  <User size={20} className="text-foreground hover:text-primary" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xs shadow-lg ring-none z-50">
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm hover:text-primary"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profil
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {isArtisan && (
                <Link to="/dashboard">
                  <Button className="rounded-xs text-white bg-primary hover:bg-primary/90">
                    Espace Artisan
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button className="rounded-xs text-foreground bg-white hover:bg-background hover:text-primary shadow-none">
                  Se connecter
                </Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-xs text-white bg-primary hover:bg-primary/90">
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/cart" className="relative mr-2 hover:text-primary">
            <ShoppingBasket size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          {/* Mobile Notification Bell - Only show when authenticated */}
          {isAuthenticated && (
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="rounded-full hover:bg-gray-100 mt-2"
                aria-label="Notifications"
              >
                <Bell size={20} className="text-foreground" />
              </button>
              
              {/* Mobile Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xs shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900">Notifications</h3>
                      <button 
                        onClick={() => setIsNotificationOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-500 py-4 text-center">
                      Les notifications arrivent bientôt.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              to="/"
              className="py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              to="/articles"
              className="py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Articles
            </Link>
            <Link
              to="/artisans"
              className="py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Artisans
            </Link>
            <Link
              to="/dashboard"
              className="py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Espace Artisan
            </Link>
            <Link
              to="/profile"
              className="py-2 text-foreground hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Compte
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default NavBar
