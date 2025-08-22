import { useState } from 'react'
import { Link } from "react-router"
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

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  stockQuantity: number;
  sales: number;
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  customer: string;
  items: OrderItem[];
  total: number;
  status: string;
}

// Données factices pour le tableau de bord
const dashboardData = {
  artisan: {
    name: "Marie Diop",
    specialty: "Bijoux",
    location: "Dakar, Sénégal",
    joinDate: "Novembre 2022",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  },
  stats: {
    totalSales: 356000,
    totalOrders: 24,
    pendingOrders: 3,
    viewsThisMonth: 427,
    conversionRate: 5.6,
  },
  products: [
    {
      id: 1,
      name: "Bracelet en perles tressées",
      price: 15000,
      image: "https://www.thekeepingroomnc.com/wp-content/uploads/2020/04/image-placeholder.jpg",
      category: "Bijoux",
      inStock: true,
      stockQuantity: 15,
      sales: 18,
    },
    {
      id: 5,
      name: "Collier en perles de verre",
      price: 12000,
      image: "https://www.thekeepingroomnc.com/wp-content/uploads/2020/04/image-placeholder.jpg",
      category: "Bijoux",
      inStock: true,
      stockQuantity: 8,
      sales: 12,
    },
    {
      id: 9,
      name: "Boucles d'oreilles en perles",
      price: 8000,
      image: "https://www.thekeepingroomnc.com/wp-content/uploads/2020/04/image-placeholder.jpg",
      category: "Bijoux",
      inStock: true,
      stockQuantity: 22,
      sales: 6,
    },
    {
      id: 11,
      name: "Broche en fil d'argent",
      price: 22000,
      image:
        "https://www.thekeepingroomnc.com/wp-content/uploads/2020/04/image-placeholder.jpg",
      category: "Bijoux",
      inStock: false,
      stockQuantity: 0,
      sales: 4,
    },
  ],
  orders: [
    {
      id: "CMD-2023-001",
      date: "21/05/2023",
      customer: "Ahmed Ba",
      items: [{ id: 1, name: "Bracelet en perles tressées", quantity: 1 }],
      total: 15000,
      status: "livré",
    },
    {
      id: "CMD-2023-002",
      date: "03/06/2023",
      customer: "Aminata Sow",
      items: [
        { id: 5, name: "Collier en perles de verre", quantity: 1 },
        { id: 9, name: "Boucles d'oreilles en perles", quantity: 2 },
      ],
      total: 28000,
      status: "en cours",
    },
    {
      id: "CMD-2023-003",
      date: "15/06/2023",
      customer: "Ousmane Diallo",
      items: [
        { id: 1, name: "Bracelet en perles tressées", quantity: 1 },
        { id: 11, name: "Broche en fil d'argent", quantity: 1 },
      ],
      total: 37000,
      status: "en préparation",
    },
  ],
};

const categories = [
  "Bijoux",
  "Textiles",
  "Bois",
  "Céramique",
  "Peinture",
  "Décoration",
  "Accessoires",
  "Cosmétiques",
]

// Statuts de commande disponibles
const orderStatuses = [
  "en attente",
  "en préparation",
  "en cours",
  "livré",
  "annulé",
]

const ArtisanDashboard = () => {
  // État pour les produits
  const [products, setProducts] = useState<Product[]>(dashboardData.products as Product[]);
  const [orders, setOrders] = useState<Order[]>(dashboardData.orders as Order[]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // États pour le formulaire d'édition de produit
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productStock, setProductStock] = useState("");

  // Fonctions de gestion de produits
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setProductName(product.name);
    setProductPrice(product.price.toString());
    setProductCategory(product.category);
    setProductDescription("Description détaillée du produit...");
    setProductStock(product.stockQuantity.toString());
    setIsEditing(true);
  };

  const handleAddNewProduct = () => {
    setCurrentProduct(null);
    setProductName("");
    setProductPrice("");
    setProductCategory("");
    setProductDescription("");
    setProductStock("");
    setIsEditing(true);
  };

  const handleSaveProduct = () => {
    if (!productName || !productPrice || !productCategory || !productStock) {
      toast.error("Erreur", {
        description: "Veuillez remplir tous les champs obligatoires",
      });
      return;
    }

    const price = parseInt(productPrice);
    const stock = parseInt(productStock);

    if (isNaN(price) || price <= 0) {
      toast.error("Erreur", {
        description: "Veuillez entrer un prix valide",
      });
      return;
    }

    if (isNaN(stock) || stock < 0) {
      toast.error("Erreur", {
        description: "Veuillez entrer une quantité de stock valide",
      });
      return;
    }

    if (currentProduct) {
      // Modification d'un produit existant
      const updatedProducts = products.map((p) =>
        p.id === currentProduct.id
          ? {
              ...p,
              name: productName,
              price,
              category: productCategory,
              stockQuantity: stock,
              inStock: stock > 0,
            }
          : p
      );
      setProducts(updatedProducts);

    } else {
      // Ajout d'un nouveau produit
      const newProduct = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        name: productName,
        price,
        image:
          "https://www.thekeepingroomnc.com/wp-content/uploads/2020/04/image-placeholder.jpg", // Image par défaut
        category: productCategory,
        stockQuantity: stock,
        inStock: stock > 0,
        sales: 0,
      };

      setProducts([...products, newProduct]);
    }

    setIsEditing(false);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  // Fonction de mise à jour du statut d'une commande
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );

    setOrders(updatedOrders);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-grow py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={dashboardData.artisan.image}
                    alt={dashboardData.artisan.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Tableau de bord
                  </h1>
                  <p className="text-foreground">
                    {dashboardData.artisan.name} -{" "}
                    {dashboardData.artisan.specialty}
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
                    <div className="p-3 bg-green-100 rounded-md">
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
                    <div className="p-3 bg-soko-cream rounded-md">
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
                    <div className="p-3 bg-yellow-100 rounded-md">
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
                    <div className="p-3 bg-blue-100 rounded-md">
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
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="product-category">
                              Catégorie *
                            </Label>
                            <Select
                              value={productCategory}
                              onValueChange={setProductCategory}
                            >
                              <SelectTrigger id="product-category">
                                <SelectValue placeholder="Sélectionner une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category}
                                    value={category.toLowerCase()}
                                  >
                                    {category}
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
                        <div className="space-y-2">
                          <Label>Images du produit</Label>
                          <div className="border-2 border-dashed border-soko-sand p-6 rounded-md text-center">
                            <Image className="h-12 w-12 mx-auto text-primary mb-2" />
                            <p className="text-sm text-foreground mb-2">
                              Faites glisser des images ici ou cliquez pour
                              télécharger
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-xs"
                            >
                              Parcourir les fichiers
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="rounded-xs hover:bg-muted"
                          >
                            Annuler
                          </Button>
                          <Button
                            className="bg-primary rounded-xs hover:bg-primary/90 text-white"
                            onClick={handleSaveProduct}
                          >
                            Enregistrer
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
                        <div className="h-40 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold truncate">{product.name}</h3>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-soko-terracotta font-medium">
                              {product.price.toLocaleString()} FCFA
                            </span>
                            <Badge
                              className={
                                product.inStock ? "bg-green-600" : "bg-red-600"
                              }
                            >
                              {product.inStock ? "En stock" : "Rupture"}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-soko-clay">
                              Stock: {product.stockQuantity} | Vendus:{" "}
                              {product.sales}
                            </span>
                            <div className="flex space-x-2">
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-soko-clay uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-soko-sand">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {order.id}
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
                                  : order.status === "en préparation"
                                  ? "bg-yellow-600"
                                  : order.status === "en cours"
                                  ? "bg-blue-600"
                                  : order.status === "annulé"
                                  ? "bg-red-600"
                                  : "bg-soko-terracotta"
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
                                    {status}
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
  );
}

export default ArtisanDashboard