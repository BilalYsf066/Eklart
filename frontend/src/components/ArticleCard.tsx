import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBasket } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { useCart } from "@/hooks/use-cart"

interface ArticleCardProps {
  id: number
  title: string
  price: number
  imageUrl: string
  artisan: string
  category: string
  isNew?: boolean
}

const ArticleCard = ({
  id,
  title,
  price,
  imageUrl,
  artisan,
  category,
  isNew = false
}: ArticleCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    addItem({
      id,
      title,
      price,
      imageUrl,
      artisan
    })
    toast.success(`${title} ajouté au panier`)
  }

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 border-border rounded-xs hover:shadow-md h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link to={`/articles/${id}`}>
          <div className="aspect-square overflow-hidden">
            <img
              src={imageUrl || 'https://www.thekeepingroomnc.com/wp-content/uploads/2020/04/image-placeholder.jpg'}
              alt={title}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isHovered ? "scale-105" : "scale-100"
              }`}
            />
          </div>
        </Link>
        {isNew && (
          <Badge className="absolute top-2 left-2 bg-ekla-terracotta">
            Nouveau
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <Link 
          to={`/articles/${id}`}
          className="text-sm hover:text-ekla-terracotta hover:underline transition-colors"
        >
          <h3 className="font-medium mb-1 line-clamp-2">{title}</h3>
        </Link>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-ekla-brown">
            {price.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 })}
          </span>
          <span className="text-xs text-muted-foreground">Par {artisan}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Link 
          to={`/articles?category=${encodeURIComponent(category)}`}
          className="text-xs text-muted-foreground hover:text-ekla-terracotta"
        >
          {category}
        </Link>
        <Button 
          size="sm" 
          variant="ghost" 
          className="p-0 h-8 w-8"
          onClick={handleAddToCart}
        >
          <ShoppingBasket className="h-4 w-4" />
          <span className="sr-only">Ajouter au panier</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ArticleCard
