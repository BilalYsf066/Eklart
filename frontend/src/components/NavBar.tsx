import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { ShoppingBasket, User, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/useCart';
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

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { isAuthenticated } = useAuth();
  const { isArtisan } = usePermissions();

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-2">
            <ShoppingBasket size={20} className="text-white" />
          </div>
          <span className="font-semibold text-lg text-primary">Eklart</span>
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
            <ul className="grid w-[300px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link to="/articles">
                    <div className="font-medium">Catégorie 1</div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#">
                    <div className="font-medium">Catégorie 2</div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#">
                    <div className="font-medium">Catégorie 3</div>
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link to="#">
                    <div className="font-medium">Catégorie 4</div>
                  </Link>
                </NavigationMenuLink>
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
              <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-foreground hover:text-primary">
                <User size={20} />
              </Link>
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
  );
};

export default Navbar;
