import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface ArtisanCardProps {
  id: number
  name: string
  imageUrl: string
  location: string
  shopName: string
  articleCount: number
  slug: string
}

const ArtisanCard = ({
  id,
  name,
  imageUrl,
  location,
  shopName,
  articleCount,
  slug,
}: ArtisanCardProps) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  return (
    <Card data-artisan-id={id} className="overflow-hidden transition-all duration-300 border-border rounded-xs hover:shadow-md h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback className="bg-ekla-beige text-ekla-brown text-xl">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-medium text-lg mb-1">{name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{location}</span>
          </div>
          <p className="text-sm mb-4 text-muted-foreground">
            <span className="font-medium text-foreground">{shopName}</span>
            <span className="mx-1">•</span>
            <span>{articleCount} articles</span>
          </p>
          <Button asChild className="w-full">
            <Link to={`/artisans/${slug}`}>
              Voir le profil
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ArtisanCard