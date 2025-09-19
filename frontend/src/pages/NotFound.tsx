import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { Home as HomeIcon, Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 container mx-auto my-48 px-4">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
            Erreur 404
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Page introuvable
          </h1>
          <p className="mt-4 text-muted-foreground">
            La page que vous cherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou revenez à l'accueil.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/">
              <Button className="rounded-xs">
                <HomeIcon className="mr-2" size={16} />
                Retour à l'accueil
              </Button>
            </Link>
            <Link to="/articles">
              <Button variant="outline" className="rounded-xs">
                <Compass className="mr-2" size={16} />
                Découvrir les articles
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
