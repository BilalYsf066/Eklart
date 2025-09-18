import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#2a2b2e] text-white pt-12 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary font-display uppercase">Eklart</span>
            </Link>
            <p className="text-secondary mb-4 max-w-md">
              Eklart est une marketplace dédiée à l'artisanat du Bénin, 
              mettant en relation les artisans talentueux avec des acheteurs du territoire entier.
            </p>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-display font-medium mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/articles" className="text-secondary hover:text-primary transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/artisans" className="text-secondary hover:text-primary transition-colors">
                  Artisans
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-secondary hover:text-primary transition-colors">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary hover:text-primary transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-display font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-secondary">
                contact@eklart.com
              </li>
              <li className="text-secondary">
                +229 01 95 95 95 95
              </li>
              <li className="text-secondary">
                Cotonou, Bénin
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 py-6 border-t border-primary px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary text-sm">
              © {new Date().getFullYear()} Eklart. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="#" className="text-secondary hover:text-primary text-sm transition-colors">
                Conditions d'utilisation
              </Link>
              <Link to="#" className="text-secondary hover:text-primary text-sm transition-colors">
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
