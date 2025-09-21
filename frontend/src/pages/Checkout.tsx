import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import { ShoppingCart, MapPin, Mail } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import OrderSuccess from "@/components/OrderSuccess"

const checkoutSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  address: z.string().min(5, "Adresse complète requise"),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().optional(),
  paymentMethod: z.enum(["mtn_money", "moov_money", "celtiis_cash", "kkiapay", "card"] as const, { 
    message: "Veuillez sélectionner un mode de paiement" 
  }),
  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface OrderDetails {
  orderNumber: string
  date: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
}

const Checkout = () => { 
  const { user } = useAuth()
  const { items: cartItems, _clearLocalCart } = useCart()
  const navigate = useNavigate()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [processedOrder, setProcessedOrder] = useState<OrderDetails | null>(null)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: "", // Will be fetched if client profile exists
        city: "", // Will be fetched if client profile exists
        notes: "",
      })

      // Fetch client address info
      const fetchClientInfo = async () => {
        try {
          // A dedicated endpoint would be better, but we can reuse the profile one
          const response = await api.get('/profile')
          if(response.data.client) {
            form.setValue('address', response.data.client.address || '')
            form.setValue('city', response.data.client.city || '')
          }
        } catch (error) {
          console.warn("Could not fetch client address info")
        }
      }
      fetchClientInfo();
    }
  }, [user, form])
  
  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing && !showSuccessDialog) {
      toast.info("Votre panier est vide. Redirection...")
      navigate('/articles')
    }
  }, [cartItems, navigate, isProcessing, showSuccessDialog])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = 2500
  const total = subtotal + shippingCost

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true)
    
    try {
      const response = await api.post('/orders', data)
      setProcessedOrder(response.data)
      setShowSuccessDialog(true)
      _clearLocalCart()
    } catch (error: any) {
      toast.error("Erreur", {
        description: error.response?.data?.message || "Une erreur est survenue lors de la commande."
      })
    } finally {
      setIsProcessing(false)
    }
  }
  
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Finaliser votre commande
            </h1>
            <p className="text-muted-foreground">
              Complétez vos informations pour finaliser votre achat
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <Card className="bg-white rounded-xs">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Informations personnelles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prénom</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre prénom" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre nom" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="votre@email.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone</FormLabel>
                              <FormControl>
                                <Input placeholder="+229 01 XX XX XX XX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Address */}
                  <Card className="bg-white rounded-xs">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        Adresse de livraison
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse complète</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Numéro, rue, quartier, références..."
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ville</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre ville" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Code postal (optionnel)</FormLabel>
                              <FormControl>
                                <Input placeholder="Code postal" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  

                  {/* Notes */}
                  <Card className="bg-white rounded-xs">
                    <CardHeader>
                      <CardTitle>Notes (optionnel)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                placeholder="Instructions spéciales pour la livraison..."
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Traitement en cours..." : `Confirmer la commande`}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 bg-white rounded-xs">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    Résumé de la commande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Quantité: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Sous-total</span>
                      <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frais de livraison</span>
                      <span>{shippingCost.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{total.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">🔒</Badge>
                      Paiement sécurisé
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">🚚</Badge>
                      Livraison 2-5 jours
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">↩️</Badge>
                      Retour sous 30 jours
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Payment Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden">
          <OrderSuccess order={processedOrder} onClose={() => {
            setShowSuccessDialog(false)
            navigate('/')
          }} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Checkout