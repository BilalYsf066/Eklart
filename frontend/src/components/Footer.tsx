
import { Link } from 'react-router-dom'
import { ShoppingBasket } from 'lucide-react'

const navigationLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/articles', label: 'Articles' },
  { to: '/', label: 'À Propos' },
  { to: '/', label: 'Contact' },
]

const categoryLinks = [
  { to: '/articles', label: 'Catégorie 1' },
  { to: '/articles', label: 'Catégorie 2' },
  { to: '/articles', label: 'Catégorie 3' },
  { to: '/articles', label: 'Catégorie 4' },
]

const Footer = () => {
  return (
    <footer className="bg-muted mt-12 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary rounded-full p-2">
                <ShoppingBasket size={20} className="text-white" />
              </div>
              <span className="font-semibold text-lg text-primary">Eklart</span>
            </Link>
            <p className="text-muted-foreground">
              Votre marketplace des produits artisanaux béninois authentiques, faits à la main avec amour et tradition.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Catégories</h3>
            <ul className="space-y-2">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Nous Contacter</h3>
            <address className="text-muted-foreground not-italic">
              <p>Email: <a href="mailto:yessoufbilal9@gmail.com" className="hover:text-primary">yessoufbilal9@gmail.com</a></p>
              <p>Téléphone: <a href="tel:+2290169980272" className="hover:text-primary">+229 0169 980 272</a></p>
              <p className="mt-2">Cotonou, Bénin</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy {new Date().getFullYear()} Eklart. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
