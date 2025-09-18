import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBasket, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/AuthContext"
import { ReviewForm } from "@/components/review-form"
import { StarRating } from "@/components/StarRating"
import { Card, CardContent } from "@/components/ui/card"

interface Review {
  id: number
  rating: number
  comment: string
  date: string
  clientName: string
}

interface ProductDetails {
  id: number
  title: string
  price: number
  description: string
  images: string[]
  artisan: string
  artisanProfile: string
  category: string
  materials: string[] | string
  dimensions: string
  weight: string
  inStock: number
  isNew: boolean
  rating: number
  reviewsCount: number
  reviews: Review[]
  shipping: string
  returnPolicy: string
}


const ArticleDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mainImage, setMainImage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const reviewsPerSet = 3
  const totalSlides = Math.ceil(reviews.length / reviewsPerSet)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1))
  }


  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true)
      setError(null)
      try {
        const response = await api.get<ProductDetails>(`/articles/${id}`)
        setProduct(response.data)
        setReviews(response.data.reviews || [])
        setMainImage(response.data.images[0] || "")
      } catch (err) {
        setError("Produit non trouvé ou une erreur est survenue.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])
  
  const handleReviewSubmitted = (newReview: Review) => {
    setReviews(prevReviews => [newReview, ...prevReviews])
    // Optionally update product average rating and count if not re-fetching
    if(product) {
        const newTotalRating = reviews.reduce((sum, r) => sum + r.rating, 0) + newReview.rating
        const newReviewCount = reviews.length + 1
        setProduct({
            ...product,
            reviewsCount: newReviewCount,
            rating: newTotalRating / newReviewCount,
        })
    }
  }

  const decreaseQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1))
  }

  const increaseQuantity = () => {
    if (product && quantity < product.inStock) {
      setQuantity((q) => q + 1)
    } else {
      toast.error("La quantité maximale disponible a été atteinte")
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.images[0],
      artisan: product.artisan,
    }, quantity)
  }
  
  if (loading) {
    return (
      <>
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-xs" />
              <div className="flex space-x-2">
                <Skeleton className="w-20 h-20 rounded-xs" />
                <Skeleton className="w-20 h-20 rounded-xs" />
                <Skeleton className="w-20 h-20 rounded-xs" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 flex-1" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (error || !product) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
              <p className="mb-8">{error || "Le produit que vous recherchez n'existe pas ou a été retiré."}</p>
              <Button asChild>
                <Link to="/articles">Retour aux produits</Link>
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    )
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product images */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden border border-border rounded-xs">
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      className={`border ${
                        mainImage === img ? "border-primary" : "border-border"
                      } rounded-xs overflow-hidden w-20 h-20 flex-shrink-0`}
                      onClick={() => setMainImage(img)}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            
              {/* Product info */}
              <div>
                <div className="mb-2 flex items-center space-x-2">
                  {product.isNew && (
                    <Badge className="bg-primary text-white">Nouveau</Badge>
                  )}
                  <Link 
                    to={`/articles?category=${encodeURIComponent(product.category)}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {product.category}
                  </Link>
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                  {product.title}
                </h1>       
                <div className="flex items-center mb-4">
                  <Link 
                    to={product.artisanProfile}
                    className="text-sm hover:text-primary hover:underline"
                  >
                    Par {product.artisan}
                  </Link>
                  <div className="text-xs text-muted-foreground ml-4 flex items-center">
                    <StarRating rating={product.rating} size={14} />
                    <span className="mx-1">•</span>
                    <span>{product.reviewsCount} avis</span>
                  </div>
                </div>
                <p className="text-2xl font-semibold mb-6">
                  {product.price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                </p>
                <p className="text-muted-foreground mb-6">{product.description}</p>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Quantité</span>
                    <span 
                      className={`text-sm font-medium ${
                        product.inStock > 0 ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {product.inStock > 0
                        ? `En stock (${product.inStock} disponibles)`
                        : "Rupture de stock"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center space-y-4 mb-6 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                    <div className="flex border border-border rounded-xs w-full md:w-auto justify-center">
                      <button className="px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50" onClick={decreaseQuantity} disabled={quantity <= 1}>-</button>
                      <span className="px-4 py-2 border-x border-border">{quantity}</span>
                      <button className="px-3 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50" onClick={increaseQuantity} disabled={quantity >= product.inStock}>+</button>
                    </div>
                    <div className="w-full flex flex-col gap-2 md:flex-1 md:flex-row">
                      <Button variant="outline" className="w-full md:flex-1" onClick={handleAddToCart} disabled={product.inStock <= 0}>
                        <ShoppingBasket className="h-4 w-4 mr-2" />
                        Ajouter au panier
                      </Button>
                      <Button className="w-full md:flex-1" asChild disabled={product.inStock <= 0}>
                         <Link to="/checkout">Commander maintenant</Link>
                      </Button>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
                <Tabs defaultValue="details">
                  <TabsList className="w-full">
                    <TabsTrigger value="details" className="flex-1">Détails</TabsTrigger>
                    <TabsTrigger value="shipping" className="flex-1">Livraison</TabsTrigger>
                    <TabsTrigger value="returns" className="flex-1">Retours</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details" className="pt-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Matériaux</span>
                        <span>
                          {Array.isArray(product.materials) ? product.materials.join(", ") : typeof product.materials === "string" ? product.materials.replace(/[\[\]"']+/g, "").replace(/,/g, ", ") : ""}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Dimensions</span>
                        <span>{product.dimensions}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Poids</span>
                        <span>{product.weight}</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="shipping" className="pt-4 text-sm"><p>Expédition en {product.shipping}.</p></TabsContent>
                  <TabsContent value="returns" className="pt-4 text-sm"><p>{product.returnPolicy}</p></TabsContent>
                </Tabs>
              </div>
            </div>
             {/* Reviews Section */}
             <div className="mt-12 relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  Avis clients ({reviews.length})
                </h2>
                {reviews.length > reviewsPerSet && (
                   <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={prevSlide} disabled={currentSlide === 0}> <ChevronLeft /> </Button>
                    <Button variant="ghost" size="icon" onClick={nextSlide} disabled={currentSlide >= totalSlides - 1}> <ChevronRight /> </Button>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <div className="flex overflow-hidden">
                  <div className="flex transition-transform duration-300 ease-in-out w-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                      <div key={slideIndex} className="w-full flex-shrink-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {reviews.slice(slideIndex * reviewsPerSet, (slideIndex + 1) * reviewsPerSet).map((review) => (
                            <Card key={review.id} className="border h-full">
                              <CardContent className="p-6 h-full flex flex-col">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-4">
                                    <StarRating rating={review.rating} />
                                    <span className="text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">Par <strong>{review.clientName}</strong></p>
                                  <p className="text-sm leading-relaxed">{review.comment}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

               {/* Add Review Section */}
                <div className="mt-12">
                    <h3 className="text-xl font-bold mb-4">Laisser un avis</h3>
                    {isAuthenticated ? (
                        <Card>
                            <CardContent className="pt-6">
                                <ReviewForm articleId={product.id} onReviewSubmitted={handleReviewSubmitted} />
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="text-center">
                            <CardContent className="pt-6">
                                <p className="text-muted-foreground">
                                    Vous devez être <Link to="/login" className="text-primary hover:underline">connecté</Link> pour laisser un avis.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ArticleDetails