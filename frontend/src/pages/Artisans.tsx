import { useState } from "react"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import ArtisanCard from "@/components/ArtisanCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MOCK_ARTISANS = [
  {
    id: 1,
    name: "Aminata Diallo",
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Porto-Novo",
    shopName: "Rosiers de la capitale",
    articleCount: 12,
    slug: "aminata-diallo",
    bio: "Artisane de Porto-Novo spécialisée dans la vannerie traditionnelle. Je crée des paniers tressés en raphia et autres fibres naturelles selon des techniques transmises de génération en génération."
  },
  {
    id: 2,
    name: "Ibrahim Koné",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Cotonou",
    shopName: "Bijoux des Vents",
    articleCount: 8,
    slug: "ibrahim-kone",
  },
  {
    id: 3,
    name: "Fatou Camara",
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Cotonou",
    shopName: "Bogolan",
    articleCount: 15,
    slug: "fatou-camara",
  },
  {
    id: 4,
    name: "Paul Mensah",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Allada",
    shopName: "Wood Master",
    articleCount: 7,
    slug: "paul-mensah",
  },
  {
    id: 5,
    name: "Marie Touré",
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Abomey",
    shopName: "Adinkra",
    articleCount: 21,
    slug: "marie-toure",
  },
  {
    id: 6,
    name: "Omar Diop",
    imageUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Calavi",
    shopName: "Dur comme fer",
    articleCount: 9,
    slug: "omar-diop",
  },
  {
    id: 7,
    name: "Aisha Bamba",
    imageUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Malanville",
    shopName: "Tapis Ali Baba",
    articleCount: 5,
    slug: "aisha-bamba",
  },
  {
    id: 8,
    name: "Jean Ouattara",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Cotonou",
    shopName: "Merveilles du bois",
    articleCount: 11,
    slug: "jean-ouattara",
  }
]

const Artisans = () => {
  const [artisans] = useState(MOCK_ARTISANS)
  const [filteredArtisans, setFilteredArtisans] = useState(MOCK_ARTISANS)
  const [searchQuery, setSearchQuery] = useState("")
  const [shopName, setShopName] = useState("all")

  // Filter artisans based on search and specialty
  const handleFilter = () => {
    let result = [...artisans]
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        artisan => 
          artisan.name.toLowerCase().includes(query) ||
          artisan.location.toLowerCase().includes(query)
      )
    }
    
    // Filter by specialty
    if (shopName !== "all") {
      result = result.filter(
        artisan => artisan.shopName.toLowerCase() === shopName.toLowerCase()
      )
    }
    
    setFilteredArtisans(result)
  }

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleFilter()
  }

  // Handle specialty change
  const handleShopNameChange = (value: string) => {
    setShopName(value)
    setTimeout(() => {
      handleFilter()
    }, 0)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-display text-ekla-brown mb-4">
              Nos Artisans
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Découvrez les artisans talentueux derrière nos produits faits main. 
              Chaque artisan apporte son expertise unique et son savoir-faire traditionnel.
            </p>
          </div>
          
          {/* Search and filter section */}
          <div className="mb-12 max-w-3xl mx-auto">
            <div className="bg-muted/40 p-6 rounded-lg">
              <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="search"
                    placeholder="Rechercher un artisan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="md:w-48">
                  <Select value={shopName} onValueChange={handleShopNameChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Spécialité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les spécialités</SelectItem>
                      <SelectItem value="Vannerie">Vannerie</SelectItem>
                      <SelectItem value="Bijouterie">Bijouterie</SelectItem>
                      <SelectItem value="Bijoux">Bijoux</SelectItem>
                      <SelectItem value="Textiles">Textiles</SelectItem>
                      <SelectItem value="Sculpture">Sculpture</SelectItem>
                      <SelectItem value="Métal">Métal</SelectItem>
                      <SelectItem value="Tapis">Tapis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" /> Rechercher
                </Button>
              </form>
            </div>
          </div>
          
          {/* Artisans grid */}
          {filteredArtisans.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">Aucun artisan trouvé</h3>
              <p className="text-muted-foreground">
                Essayez d'autres termes de recherche ou filtres.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtisans.map((artisan) => (
                <ArtisanCard
                  key={artisan.id}
                  id={artisan.id}
                  name={artisan.name}
                  imageUrl={artisan.imageUrl}
                  location={artisan.location}
                  shopName={artisan.shopName}
                  articleCount={artisan.articleCount}
                  slug={artisan.slug}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Artisans
