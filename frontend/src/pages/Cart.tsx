import { useState } from "react"
import { Link } from "react-router-dom"
import { Trash2, ChevronLeft, MinusCircle, PlusCircle, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import { useCart } from "@/hooks/use-cart"
import { Input } from "@/components/ui/input"

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [discountApplied, setDiscountApplied] = useState(false)

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shippingCost = subtotal > 0 ? 2500 : 0
  const discount = discountApplied ? subtotal * 0.1 : 0
  const total = subtotal + shippingCost - discount


  const handleRemoveItem = (id: number) => {
    removeItem(id)
  }

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "EKLART10") {
      setDiscountApplied(true)
      toast.success("Code promo appliqué")
    } else {
      toast.error("Code promo invalide")
    }
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto min-h-screen px-6 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Votre panier</h1>
        
        {items.length === 0 ? (
          <div className="bg-card border p-8 rounded-xs shadow-sm text-center max-w-lg mx-auto">
            <div className="flex justify-center mb-4">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">
              Explorez nos collections pour trouver des trésors artisanaux.
            </p>
            <Button asChild>
              <Link to="/articles">
                Découvrir les articles
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <Card className="rounded-xs">
                <CardContent className="p-0">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 flex gap-4 border-b last:border-0">
                      <Link to={`/articles/${item.id}`} className="flex-shrink-0">
                        <div className="w-24 h-24 relative rounded overflow-hidden border">
                          <img src={item.imageUrl} alt={item.title} className="object-cover w-full h-full" />
                        </div>
                      </Link>
                      
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                             <Link to={`/articles/${item.id}`} className="font-medium hover:text-primary pr-4">{item.title}</Link>
                             <p className="font-semibold text-right">
                                {(item.price * item.quantity).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}
                             </p>
                          </div>
                          <p className="text-sm text-muted-foreground">Par {item.artisan}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <div className="flex justify-between mt-6">
                <Button variant="ghost" asChild>
                  <Link to="/articles">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Continuer les achats
                  </Link>
                </Button>
                <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
                  Vider le panier
                </Button>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24 rounded-xs">
                <CardHeader>
                    <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span>{subtotal.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span>{shippingCost.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Réduction (10%)</span>
                        <span>-{discount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between font-semibold text-lg mb-6">
                    <span>Total</span>
                    <span>{total.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</span>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Code promo"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={discountApplied}
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleApplyCoupon}
                      disabled={!couponCode || discountApplied}
                    >
                      Appliquer
                    </Button>
                  </div>
                  
                  <Button className="w-full" asChild>
                    <Link to="/checkout">Passer la commande</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Cart