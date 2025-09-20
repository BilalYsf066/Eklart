import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import ArticleCard from "@/components/ArticleCard"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star } from "lucide-react"

// NOTE: Using the same mock data structure as in frontend/src/pages/Artisans.tsx
const MOCK_ARTISANS = [
  {
    id: 1,
    name: "Aminata Diallo",
    imageUrl:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Porto-Novo",
    shopName: "Rosiers de la capitale",
    articleCount: 12,
    slug: "aminata-diallo",
    bio: "Artisane de Porto-Novo spécialisée dans la vannerie traditionnelle. Je crée des paniers tressés en raphia et autres fibres naturelles selon des techniques transmises de génération en génération.",
  },
  {
    id: 2,
    name: "Ibrahim Koné",
    imageUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Cotonou",
    shopName: "Bijoux des Vents",
    articleCount: 8,
    slug: "ibrahim-kone",
  },
  {
    id: 3,
    name: "Fatou Camara",
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Cotonou",
    shopName: "Bogolan",
    articleCount: 15,
    slug: "fatou-camara",
  },
  {
    id: 4,
    name: "Paul Mensah",
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Allada",
    shopName: "Wood Master",
    articleCount: 7,
    slug: "paul-mensah",
  },
  {
    id: 5,
    name: "Marie Touré",
    imageUrl:
      "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Abomey",
    shopName: "Adinkra",
    articleCount: 21,
    slug: "marie-toure",
  },
  {
    id: 6,
    name: "Omar Diop",
    imageUrl:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Calavi",
    shopName: "Dur comme fer",
    articleCount: 9,
    slug: "omar-diop",
  },
  {
    id: 7,
    name: "Aisha Bamba",
    imageUrl:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Malanville",
    shopName: "Tapis Ali Baba",
    articleCount: 5,
    slug: "aisha-bamba",
  },
  {
    id: 8,
    name: "Jean Ouattara",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80",
    location: "Cotonou",
    shopName: "Merveilles du bois",
    articleCount: 11,
    slug: "jean-ouattara",
  },
]

// Build lightweight mock catalogue per artisan (for display only)
const buildMockCatalogue = (artisan: { id: number; name: string }) => {
  const baseImages = [
    "https://images.unsplash.com/photo-1590422749897-47236d4555c8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600721391689-2564bb8055de?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582210449638-91b2e7825b02?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1669447648297-03fa6860f78a?auto=format&fit=crop&w=800&q=80",
  ]
  const categories = ["Décoration", "Bijoux", "Art", "Textiles", "Accessoires"]

  return Array.from({ length: 6 }).map((_, idx) => ({
    id: artisan.id * 100 + idx + 1,
    title: `Création #${idx + 1} de ${artisan.name.split(" ")[0]}`,
    price: Math.floor(20 + Math.random() * 150),
    imageUrl: baseImages[idx % baseImages.length],
    artisan: artisan.name,
    category: categories[idx % categories.length],
    is_new: idx % 2 === 0,
  }))
}

// Build lightweight mock reviews for display
const buildMockReviews = (artisan: { articleCount: number }) => {
  const count = Math.max(0, Math.floor(artisan.articleCount * 1.5))
  return Array.from({ length: Math.min(5, count) }).map((_, i) => ({
    id: i + 1,
    author: ["Sophie L.", "Marc D.", "Juliette B.", "Nicolas T.", "Awa K."][i % 5],
    rating: 3 + (i % 3),
    comment:
      [
        "Produit magnifique et livraison rapide. Je recommande !",
        "Très satisfait, artisanat de qualité exceptionnelle.",
        "Pièce unique, communication parfaite avec l'artisan.",
        "Emballage soigné, je recommanderai.",
        "Qualité au rendez-vous, merci !",
      ][i % 5],
    date: `${i + 1} semaines`,
  }))
}

const ArtisanProfile = () => {
  const { slug } = useParams<{ slug: string }>()
  const [loading, setLoading] = useState(true)
  const [artisan, setArtisan] = useState<(typeof MOCK_ARTISANS)[number] | null>(null)

  useEffect(() => {
    const found = MOCK_ARTISANS.find((a) => a.slug === slug) || null
    setArtisan(found)
    setLoading(false)
  }, [slug])

  const catalogue = useMemo(() => (artisan ? buildMockCatalogue(artisan) : []), [artisan])
  const reviews = useMemo(() => (artisan ? buildMockReviews(artisan) : []), [artisan])

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()

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

  const reviewCount = reviews.length

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-10">
          {/* Header centré et aligné horizontalement */}
          <div className="max-w-5xl mx-auto bg-muted/30 rounded-lg p-6 mb-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-28 w-28">
                <AvatarImage src={artisan.imageUrl} alt={artisan.name} />
                <AvatarFallback className="bg-ekla-beige text-ekla-brown text-xl">
                  {getInitials(artisan.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold font-display text-ekla-brown mb-2">
                  {artisan.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-sm text-muted-foreground mb-3">
                  <span className="font-medium text-foreground">{artisan.shopName}</span>
                  <span className="hidden md:inline">•</span>
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {artisan.location}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 text-sm text-muted-foreground mb-3">
                  <span className="font-medium text-foreground">{artisan.articleCount} articles</span>
                  <span className="hidden md:inline">•</span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                    {reviewCount} avis
                  </span>
                </div>
                {artisan.bio && (
                  <p className="text-sm text-muted-foreground max-w-3xl md:max-w-xl md:pr-8">
                    {artisan.bio}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mini barre de navigation (onglets) */}
          <div className="max-w-5xl mx-auto rounded-xs p-6">
            <Tabs defaultValue="catalogue" className="mb-12">
              <TabsList className="mb-6 rounded-xs">
                <TabsTrigger value="catalogue" className="px-8">Catalogue</TabsTrigger>
                <TabsTrigger value="reviews" className="px-8">Avis ({reviewCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="catalogue">
                {catalogue.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">Aucun article disponible</h3>
                    <p className="text-muted-foreground">Cet artisan n'a pas encore ajouté d'articles.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {catalogue.map((article) => (
                      <ArticleCard
                        key={article.id}
                        id={article.id}
                        title={article.title}
                        price={article.price}
                        imageUrl={article.imageUrl}
                        artisan={article.artisan}
                        category={article.category}
                        isNew={article.is_new}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">Aucun avis pour le moment</h3>
                    <p className="text-muted-foreground">Soyez le premier à laisser un avis.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border p-6 space-y-6">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{rev.author}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < rev.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm mb-1">{rev.comment}</p>
                        <span className="text-xs text-muted-foreground">Il y a {rev.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default ArtisanProfile