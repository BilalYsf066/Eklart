import { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  ShoppingCart,
  Package,
  Edit,
  Trash,
  Plus,
  FileText,
  Image,
  Pen,
} from "lucide-react"
import { toast } from "sonner"
import Navbar from '@/components/NavBar'
import Footer from '@/components/Footer'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Skeleton } from '@/components/ui/skeleton'

// Types
interface ArticleImage {
  id: number
  image_path: string
}

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  price: number
  category: Category
  category_id: number
  stock: number
  description: string
  materials?: string[]
  dimensions?: string
  weight?: string
  images: ArticleImage[]
  status: 'draft' | 'published'
  published_at: string | null
  sales: number
}

interface OrderItem {
  id: number
  name: string
  quantity: number
}

interface Order {
  id: number
  order_number: string
  date: string
  customer: string
  items: OrderItem[]
  total: number
  status: string
}

// Données factices pour le tableau de bord (uniquement pour les stats)
const dashboardData = {
  stats: {
    totalSales: 356000,
    totalOrders: 24,
    pendingOrders: 3,
    viewsThisMonth: 427,
    conversionRate: 5.6,
  },
}

// Statuts de commande disponibles
const orderStatuses = [
  "en attente", 
  "payée",
  "en cours",
  "livré",
  "annulé",
]

const ArtisanDashboard = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])

  // États pour le formulaire d'édition de produit
  const [productName, setProductName] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [productCategoryId, setProductCategoryId] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productStock, setProductStock] = useState("")
  const [productMaterials, setProductMaterials] = useState<string[]>([])
  const [materialsInput, setMaterialsInput] = useState("")
  const [productDimensions, setProductDimensions] = useState("")
  const [productWeight, setProductWeight] = useState("")
  const [productImages, setProductImages] = useState<File[] | null>(null)

  const fetchArtisanData = async () => {
    setIsLoading(true)
    try {
        const [articlesRes, categoriesRes, ordersRes] = await Promise.all([
            api.get('/artisan/articles'),
            api.get('/categories'),
            api.get('/artisan/orders')
        ])
        setProducts(articlesRes.data)
        setCategories(categoriesRes.data)
        setOrders(ordersRes.data)
    } catch (error) {
        toast.error("Erreur", { description: "Impossible de charger les données du tableau de bord." })
    } finally {
        setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArtisanData()
  }, [])

  // Fonctions de gestion de produits
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product)
    setProductName(product.name)
    setProductPrice(String(product.price))
    setProductCategoryId(String(product.category_id))
    setProductDescription(product.description || '')
    setProductStock(String(product.stock))
    setProductMaterials(product.materials || [])
    setMaterialsInput((product.materials || []).join(", "))
    setProductDimensions(product.dimensions || '')
    setProductWeight(product.weight || '')
    setProductImages(null)
    setIsEditing(true)
  }

  const handleAddNewProduct = () => {
    setCurrentProduct(null)
    setProductName("")
    setProductPrice("")
    setProductCategoryId("")
    setProductDescription("")
    setProductStock("")
    setProductMaterials([])
    setMaterialsInput("")
    setProductDimensions("")
    setProductWeight("")
    setProductImages(null)
    setIsEditing(true)
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml']
    const validFiles = []
    
    for (let i = 0; i < files.length; i++) {
        if (!validImageTypes.includes(files[i].type)) {
            toast.error("Erreur", { 
                description: `Le fichier ${files[i].name} n'est pas un format d'image valide.` 
            })
            continue
        }
        
        if (files[i].size > MAX_FILE_SIZE) {
            toast.error("Erreur", { 
                description: `Le fichier ${files[i].name} est trop volumineux (max 5MB).` 
            })
            continue
        }
        
        validFiles.push(files[i])
    }
    
    if (validFiles.length > 0) {
        setProductImages(validFiles)
    }
  }

  const handleSaveProduct = async () => {
    // Basic validation
    if (!productName || !productPrice || !productCategoryId || !productStock) {
      toast.error("Erreur", { description: "Veuillez remplir tous les champs obligatoires." })
      return
    }

    // Image validation for new products
    if (!currentProduct && (!productImages || productImages.length === 0)) {
      toast.error("Erreur", { description: "Veuillez ajouter au moins une image." })
      return
    }

    const formData = new FormData()
    formData.append('name', productName)
    formData.append('price', productPrice.toString()) // Ensure it's a string
    formData.append('category_id', productCategoryId.toString())
    formData.append('stock', productStock.toString())
    formData.append('description', productDescription)
    formData.append('materials', JSON.stringify(productMaterials))
    formData.append('dimensions', productDimensions)
    formData.append('weight', productWeight)

  // Add images with proper validation
    if (productImages && productImages.length > 0) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg+xml']
      
      for (let i = 0; i < productImages.length; i++) {
        const file = productImages[i]
          
        // Double-check file type before sending
        if (validImageTypes.includes(file.type)) {
          formData.append('images[]', file, file.name) // Include filename
        } else {
          toast.error("Erreur", { 
            description: `Le fichier ${file.name} a un format non supporté.` 
          })
          return // Stop the process if invalid file found
        }
      }
    }

    setIsLoading(true)
    try {
      if (currentProduct) {
          formData.append('_method', 'PUT')
          await api.post(`/artisan/articles/${currentProduct.id}`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              }
          })
          toast.success("Succès", { description: "Article mis à jour avec succès." })
      } else {
          await api.post('/artisan/articles', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              }
          })
          toast.success("Succès", { description: "Article ajouté avec succès." })
      }
      
      await fetchArtisanData()
      setIsEditing(false)

    } catch (error: any) {
        console.error('Upload error:', error)
      
        // More detailed error handling
        if (error.response?.data?.errors) {
          const errors = error.response.data.errors
          Object.keys(errors).forEach(key => {
              errors[key].forEach((message: string) => {
                  toast.error("Erreur de validation", { description: message })
              })
          })
        } else {
          const errorMsg = error.response?.data?.message || "Une erreur est survenue lors de l'envoi."
          toast.error("Erreur", { description: errorMsg })
        }
    } finally {
        setIsLoading(false)
    }
  }

  const handlePublishProduct = async (productId: number) => {
    setIsLoading(true)
    try {
      await api.post(`/artisan/articles/${productId}/publish`)
      toast.success("Succès", { description: "Article publié avec succès." })
      await fetchArtisanData()
    } catch (error) {
        toast.error("Erreur", { description: "Impossible de publier l'article." })
    } finally {
        setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    setIsLoading(true)
    try {
      await api.delete(`/artisan/articles/${productId}`)
      toast.success("Succès", { description: "Article supprimé avec succès." })
      setProducts(products.filter((p) => p.id !== productId))
    } catch (error) {
        toast.error("Erreur", { description: "Impossible de supprimer l'article." })
    } finally {
        setIsLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
        await api.put(`/artisan/orders/${orderId}/status`, { status: newStatus });
        setOrders(orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
        toast.success("Statut de la commande mis à jour.");
    } catch (error) {
        toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-20 w-20 rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center">
                <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                    Tableau de bord
                </h1>
                <p className="text-foreground">
                    {user?.full_name} - {user?.artisan?.shop_name}
                </p>
                </div>
              </div>
              <Button
                asChild
                className="bg-primary rounded-xs hover:bg-primary/90 text-white"
              >
                <Link to={`/profile`}>
                  <Pen className="h-4 w-4 mr-2" />
                  Modifier mon profil
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="rounded-xs">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-foreground">Ventes totales</p>
                      <p className="text-2xl font-bold">
                        {dashboardData.stats.totalSales.toLocaleString()} FCFA
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-xs">
                      <BarChart className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xs">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-foreground">
                        Commandes totales
                      </p>
                      <p className="text-2xl font-bold">
                        {dashboardData.stats.totalOrders}
                      </p>
                    </div>
                    <div className="p-3 bg-soko-cream rounded-xs">
                      <ShoppingCart className="h-6 w-6 text-soko-terracotta" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-xs">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-foreground">
                        Commandes en attente
                      </p>
                      <p className="text-2xl font-bold">
                        {dashboardData.stats.pendingOrders}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-xs">
                      <Package className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-xs">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-foreground">Vues ce mois</p>
                      <p className="text-2xl font-bold">
                        {dashboardData.stats.viewsThisMonth}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-xs">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="articles" className="w-full">
              <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 mb-6 rounded-xs">
                <TabsTrigger value="articles" className="rounded-xs">
                  Articles
                </TabsTrigger>
                <TabsTrigger value="orders" className="rounded-xs">
                  Commandes
                </TabsTrigger>
              </TabsList>

              {/* Onglet Produits */}
              <TabsContent value="articles">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Mes articles</h2>
                  <Button
                    className="bg-primary hover:bg-primary/90 rounded-xs text-white"
                    onClick={handleAddNewProduct}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un article
                  </Button>
                </div>

                {isEditing ? (
                  <Card className="rounded-xs shadow-lg">
                    <CardHeader>
                      <CardTitle>
                        {currentProduct
                          ? "Modifier l'article"
                          : "Ajouter un nouvel article"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="article-name">
                            Nom de l'article *
                            </Label>
                            <Input
                              id="article-name"
                              placeholder="Nom de l'article"
                              value={productName}
                              onChange={(e) => setProductName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-price">Prix (FCFA) *</Label>
                            <Input
                              id="product-price"
                              placeholder="Prix du produit"
                              value={productPrice}
                              onChange={(e) => setProductPrice(e.target.value)}
                              type="number"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="product-category">
                              Catégorie *
                            </Label>
                            <Select
                              value={productCategoryId}
                              onValueChange={setProductCategoryId}
                            >
                              <SelectTrigger id="product-category">
                                <SelectValue placeholder="Sélectionner une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.id}
                                    value={String(category.id)}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-stock">
                              Quantité en stock *
                            </Label>
                            <Input
                              id="product-stock"
                              placeholder="Quantité disponible"
                              value={productStock}
                              onChange={(e) => setProductStock(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-description">
                            Description
                          </Label>
                          <Textarea
                            id="product-description"
                            placeholder="Description détaillée du produit"
                            rows={4}
                            value={productDescription}
                            onChange={(e) =>
                              setProductDescription(e.target.value)
                            }
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="product-materials">
                              Matériaux (séparés par des virgules)
                            </Label>
                            <Input
                              id="product-materials"
                              placeholder="Ex: Bois, Métal, Coton"
                              value={materialsInput}
                              onChange={(e) => {
                                const value = e.target.value
                                setMaterialsInput(value)
                                const materials = value
                                  .split(",")
                                  .map(m => m.trim())
                                  .filter(m => m.length > 0)
                                setProductMaterials(materials)
                              }}
                            />
                            <div className="flex flex-wrap gap-2">
                              {productMaterials.map((material, index) => (
                                <Badge key={index} variant="secondary">{material}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-dimensions">
                              Dimensions
                            </Label>
                            <Input
                              id="product-dimensions"
                              placeholder="Ex: 30x20x15 cm"
                              value={productDimensions}
                              onChange={(e) => setProductDimensions(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-weight">
                              Poids
                            </Label>
                            <Input
                              id="product-weight"
                              placeholder="Ex: 1.5 kg"
                              value={productWeight}
                              onChange={(e) => setProductWeight(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Images du produit (jusqu'à 4)</Label>
                          <div className="border-2 border-dashed border-soko-sand p-6 rounded-xs text-center">
                            <input
                              id="product-images"
                              type="file"
                              multiple
                              accept=".jpeg,.png,.jpg,.gif,.svg,image/jpeg,image/png,image/jpg,image/gif,image/svg+xml"
                              onChange={handleImageSelect}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="rounded-xs hover:bg-muted"
                            disabled={isLoading}
                          >
                            Annuler
                          </Button>
                          <Button
                            className="bg-primary rounded-xs hover:bg-primary/90 text-white"
                            onClick={handleSaveProduct}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {products.map((product) => (
                        <Card
                          key={product.id}
                          className="overflow-hidden rounded-xs"
                        >
                          <div className="h-40 overflow-hidden bg-gray-200">
                            {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0].image_path}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                  <Image />
                                </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold truncate pr-2">{product.name}</h3>
                              <Badge
                                variant={product.status === 'published' ? 'default' : 'secondary'}
                                className={product.status === 'published' ? 'bg-green-600' : 'bg-gray-400'}
                              >
                                {product.status === 'published' ? 'Publié' : 'Brouillon'}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-soko-terracotta font-medium">
                                {product.price.toLocaleString()} FCFA
                              </span>
                              <Badge
                                className={
                                  product.stock > 0 ? "bg-green-600" : "bg-red-600"
                                }
                              >
                                {product.stock > 0 ? "En stock" : "Rupture"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              {product.status === 'draft' && (
                                <Button
                                  size="sm"
                                  className="bg-primary text-white text-xs"
                                  onClick={() => handlePublishProduct(product.id)}
                                  disabled={isLoading}
                              >
                                  Publier
                              </Button>
                              )}
                            <div className="flex space-x-2 ml-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                className="p-1 h-8 w-8"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="p-1 h-8 w-8 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                        </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
                )}
              </TabsContent>

              {/* Onglet Commandes */}
              <TabsContent value="orders">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Mes commandes</h2>
                  <Button
                    variant="outline"
                    className="border-soko-terracotta text-soko-terracotta"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg overflow-hidden shadow">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-soko-clay uppercase tracking-wider">
                          Commande
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-soko-clay uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-soko-clay uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-soko-clay uppercase tracking-wider">
                          Articles
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-soko-clay uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-soko-clay uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-soko-clay uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-soko-sand">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {order.order_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-soko-clay">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {order.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {order.items.length} article
                            {order.items.length > 1 ? "s" : ""}
                            <span className="block text-xs text-soko-clay mt-1">
                              {order.items
                                .map((item) => `${item.quantity}x ${item.name}`)
                                .join(", ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {order.total.toLocaleString()} FCFA
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge
                              className={
                                order.status === "livré"
                                  ? "bg-green-600"
                                  : order.status === "payée"
                                  ? "bg-blue-600"
                                  : order.status === "en attente"
                                  ? "bg-yellow-600"
                                  : order.status === "en cours"
                                  ? "bg-blue-600"
                                  : "bg-red-600"
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Select
                              value={order.status}
                              onValueChange={(status) =>
                                handleUpdateOrderStatus(order.id, status)
                              }
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Changer le statut" />
                              </SelectTrigger>
                              <SelectContent>
                                {orderStatuses.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ArtisanDashboard