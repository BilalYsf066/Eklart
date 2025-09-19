import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import ArticleCard from "@/components/ArticleCard"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Mail, Star, MessageSquare } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Mock data for artisans - same as in Artisans.tsx
const MOCK_ARTISANS = [
  {
    id: 1,
    name: "Aminata Diallo",
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Porto-Novo",
    shopName: "Rosiers de la capitale",
    articleCount: 12,
    slug: "aminata-diallo",
    description: "Artisane de Dakar spécialisée dans la vannerie traditionnelle. Je crée des paniers tressés en raphia et autres fibres naturelles selon des techniques transmises de génération en génération.",
    rating: 4.8,
    reviewCount: 56,
    joinedDate: "Août 2021",
  },
  {
    id: 2,
    name: "Ibrahim Koné",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Cotonou",
    shopName: "Bijoux des Vents",
    articleCount: 8,
    slug: "ibrahim-kone",
    description: "Bijoutier malien perpétuant les techniques ancestrales de travail des métaux et des perles. Mes créations mêlent tradition baoulé et design contemporain.",
    rating: 4.6,
    reviewCount: 32,
    joinedDate: "Octobre 2021",
  },
  {
    id: 3,
    name: "Fatou Camara",
    imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Cotonou",
    shopName: "Bogolan",
    articleCount: 15,
    slug: "fatou-camara",
    description: "Spécialiste du bogolan, je travaille avec des teintures naturelles pour créer des motifs uniques sur tissu. Mon atelier emploie des femmes de ma communauté pour préserver notre art textile.",
    rating: 4.9,
    reviewCount: 73,
    joinedDate: "Mai 2022",
  },
  {
    id: 4,
    name: "Paul Mensah",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Allada",
    shopName: "Wood Master",
    articleCount: 7,
    slug: "paul-mensah",
    description: "Sculpteur ghanéen travaillant principalement le bois et la pierre. Formé aux beaux-arts d'Accra, je crée des œuvres qui racontent les mythes et légendes de mon pays.",
    rating: 4.5,
    reviewCount: 28,
    joinedDate: "Janvier 2022",
  },
  {
    id: 5,
    name: "Marie Touré",
    imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Abomey",
    shopName: "Adinkra",
    articleCount: 21,
    slug: "marie-toure",
    description: "Créatrice de bijoux qui s'inspire des symboles adinkra et de l'art ivoirien. Je travaille principalement avec du cuivre recyclé et des perles artisanales.",
    rating: 4.7,
    reviewCount: 89,
    joinedDate: "Mars 2021",
  },
  {
    id: 6,
    name: "Omar Diop",
    imageUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Saint-Louis, Sénégal",
    shopName: "Dur comme fer",
    articleCount: 9,
    slug: "omar-diop",
    description: "Artisan métallurgiste perpétuant les traditions de forge de ma région. Je travaille le laiton et le bronze pour créer des objets décoratifs et utilitaires.",
    rating: 4.6,
    reviewCount: 41,
    joinedDate: "Février 2022",
  },
  {
    id: 7,
    name: "Aisha Bamba",
    imageUrl: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Malanville",
    shopName: "Tapis Ali Baba",
    articleCount: 5,
    slug: "aisha-bamba",
    description: "Tisserande de tapis berbères transmettant un savoir-faire familial vieux de plusieurs générations. Chaque tapis est tissé à la main selon des motifs symboliques traditionnels.",
    rating: 4.8,
    reviewCount: 37,
    joinedDate: "Novembre 2021",
  },
  {
    id: 8,
    name: "Jean Ouattara",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Cotonou",
    shopName: "Merveilles du bois",
    articleCount: 11,
    slug: "jean-ouattara",
    description: "Sculpteur burkinabé travaillant principalement le bronze et le bois d'ébène. Mes œuvres s'inspirent des traditions animistes et de l'héritage culturel de mon pays.",
    rating: 4.7,
    reviewCount: 52,
    joinedDate: "Septembre 2021",
  }
]

// Import the product mock data from Products page
const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Panier tressé en raphia",
    price: 45,
    imageUrl: "https://images.unsplash.com/photo-1590422749897-47236d4555c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Aminata Diallo",
    category: "Décoration",
    isNew: true,
    artisanId: 1
  },
  {
    id: 2,
    title: "Collier en perles baoulé",
    price: 38.5,
    imageUrl: "https://images.unsplash.com/photo-1600721391689-2564bb8055de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Ibrahim Koné",
    category: "Bijoux",
    artisanId: 2
  },
  {
    id: 3,
    title: "Masque décoratif Gouro",
    price: 124.99,
    imageUrl: "https://images.unsplash.com/photo-1582210449638-91b2e7825b02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Paul Mensah",
    category: "Art",
    artisanId: 4
  },
  {
    id: 4,
    title: "Coussin en bogolan traditionnel",
    price: 32,
    imageUrl: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Fatou Camara",
    category: "Textiles",
    isNew: true,
    artisanId: 3
  },
  {
    id: 5,
    title: "Bracelet en cuivre fait main",
    price: 28.5,
    imageUrl: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Marie Touré",
    category: "Bijoux",
    artisanId: 5
  },
  {
    id: 6,
    title: "Statuette en bois d'ébène",
    price: 78.9,
    imageUrl: "https://images.unsplash.com/photo-1669447648297-03fa6860f78a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Jean Ouattara",
    category: "Art",
    artisanId: 8
  },
  {
    id: 7,
    title: "Tapis tissé à la main",
    price: 120,
    imageUrl: "https://images.unsplash.com/photo-1604772081202-11b97df3768f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Aisha Bamba",
    category: "Textiles",
    artisanId: 7
  },
  {
    id: 8,
    title: "Plateau décoratif en laiton",
    price: 65.5,
    imageUrl: "https://images.unsplash.com/photo-1615658741795-0863b9a9e97c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Omar Diop",
    category: "Décoration",
    isNew: true,
    artisanId: 6
  },
  {
    id: 9,
    title: "Petit panier à fruits",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Aminata Diallo",
    category: "Décoration",
    artisanId: 1
  },
  {
    id: 10,
    title: "Boucles d'oreilles en perles",
    price: 22.5,
    imageUrl: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    artisan: "Ibrahim Koné",
    category: "Bijoux",
    artisanId: 2
  }
];

const ArtisanProfile = () => {
  const { slug } = useParams<{ slug: string }>()
  const [artisan, setArtisan] = useState<any>(null)
  const [artisanArticles, setArtisanArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Find artisan by slug
    const foundArtisan = MOCK_ARTISANS.find(a => a.slug === slug);
    
    if (foundArtisan) {
      setArtisan(foundArtisan);
      
      // Filter products by artisan ID
      const articles = MOCK_ARTICLES.filter(p => p.artisanId === foundArtisan.id)
      setArtisanArticles(articles)
    }
    
    setLoading(false)
  }, [slug])

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div>Chargement...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!artisan) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Artisan non trouvé</h1>
            <p>L'artisan que vous recherchez n'existe pas.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Artisan profile header */}
          <div className="bg-ekla-beige/30 rounded-lg p-6 mb-8">
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={artisan.imageUrl} alt={artisan.name} />
                  <AvatarFallback className="bg-ekla-terracotta text-white text-2xl">
                    {getInitials(artisan.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex gap-2 mt-2">
                  {artisan.certifications?.map((cert: string, index: number) => (
                    <Badge key={index} variant="outline" className="bg_white">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 text-center">
                <h1 className="text-3xl font-bold font-display text-ekla-brown mb-2">
                  {artisan.name}
                </h1>
                <div className="flex items-center text-sm text-muted-foreground mb-3 justify-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{artisan.location}</span>
                  <span className="mx-2">•</span>
                  <span>{artisan.shopName}</span>
                </div>
                
                <div className="flex items-center mb-4 justify-center">
                  <div className="flex items_center">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                    <span className="font-medium">{artisan.rating}</span>
                    <span className="text-muted-foreground text-sm ml-1">
                      ({artisan.reviewCount} avis)
                    </span>
                  </div>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    Membre depuis {artisan.joinedDate}
                  </span>
                </div>
                
                <p className="text-sm mb-6 max-w-2xl mx-auto">{artisan.description}</p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button>
                    <Mail className="mr-2 h-4 w-4" /> Contacter
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" /> Envoyer un message
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for products and reviews */}
          <Tabs defaultValue="articles" className="mb-12">
            <TabsList className="mb-6 rounded-xs flex justify-center">
              <TabsTrigger value="articles">Articles ({artisanArticles.length})</TabsTrigger>
              <TabsTrigger value="reviews">Avis ({artisan.reviewCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="articles">
              {artisanArticles.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Aucun article disponible</h3>
                  <p className="text-muted-foreground">
                    Cet artisan n'a pas encore ajouté d'articles à sa boutique.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {artisanArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      price={article.price}
                      imageUrl={article.imageUrl}
                      artisan={article.artisan}
                      category={article.category}
                      isNew={article.isNew}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">Avis des clients</h3>
                <div className="space-y-4">
                  {/* Mock reviews - in a real app would come from an API */}
                  <div className="border-b pb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Sophie L.</span>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < 5 ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mb-1">
                      Produit magnifique et livraison rapide. Je recommande vivement !
                    </p>
                    <span className="text-xs text-muted-foreground">Il y a 2 mois</span>
                  </div>
                  
                  <div className="border-b pb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Marc D.</span>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < 4 ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mb-1">
                      Très satisfait de mon achat. L'artisanat est d'une qualité exceptionnelle.
                    </p>
                    <span className="text-xs text-muted-foreground">Il y a 3 semaines</span>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Juliette B.</span>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < 5 ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mb-1">
                      Pièce unique qui a dépassé mes attentes. Communication parfaite avec l'artisan.
                    </p>
                    <span className="text-xs text-muted-foreground">Il y a 1 mois</span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="text-center">
                  <Button variant="outline">Voir tous les avis</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ArtisanProfile