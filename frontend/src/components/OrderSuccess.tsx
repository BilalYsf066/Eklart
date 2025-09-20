import { CheckCircle2, ShoppingBag, Mail, Clock, Wallet } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Separator } from "./ui/separator"

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

interface OrderSuccessProps {
  order: OrderDetails | null
  onClose: () => void
}

export default function OrderSuccess({ order, onClose }: OrderSuccessProps) {
  if (!order) {
    return null // or a loading/error state
  }

  return (
    <div>
      <Card className="border-none">
        <CardHeader className="text-center space-y-3 pb-0">
          <div className="mx-auto bg-green-100 rounded-full p-2">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-semibold">Merci pour votre commande !</CardTitle>
          <p className="text-muted-foreground">
            Votre commande a été reçue et est en cours de traitement.
          </p>
          <div className="text-sm bg-muted/50 p-3 rounded-md">
            <p>Numéro de commande: <span className="font-medium">#{order.orderNumber}</span></p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShoppingBag className="h-4 w-4" />
              <span>DÉTAILS DE LA COMMANDE</span>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-medium">
                    {(item.price * item.quantity).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              ))}
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{order.subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{order.shipping.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{order.total.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-md space-y-3">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm">
                  Un email de confirmation avec les détails de votre commande a été envoyé à votre adresse email.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm">
                  Vous pouvez suivre l'état de votre commande dans la section "Mes commandes" de votre compte.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md space-y-3">
            <div className="flex items-start gap-3">
              <Wallet className="h-5 w-5 mt-0.5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm">
                  Une fois livré, veuillez accuser réception de votre colis pour effectuer le paiement.
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={onClose} 
              className="w-full bg-primary hover:bg-primary/90 h-11"
            >
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}